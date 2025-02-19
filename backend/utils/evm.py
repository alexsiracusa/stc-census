import pandas as pd
from datetime import datetime
from pandas.tseries.offsets import DateOffset


def compute_evm(df: pd.DataFrame, current_day: datetime = None):
    df.columns = ['status',
                  'actual_cost', 'expected_cost',
                  'actual_start_date', 'target_start_date',
                  'actual_completion_date', 'target_completion_date',
                  'target_days_to_complete']

    # Convert and clean data
    df[['actual_cost', 'expected_cost']] = df[['actual_cost', 'expected_cost']].astype(float).fillna(0)
    df['target_days_to_complete'] = df['target_days_to_complete'].astype(int).fillna(0)
    date_columns = ['actual_start_date', 'target_start_date',
                    'actual_completion_date', 'target_completion_date']
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], errors='coerce')
    df['status'] = df['status'].astype(str)

    # Recalculate target_completion_date based on target_days_to_complete
    df['target_completion_date'] = df.apply(
        lambda row: row['target_start_date'] + DateOffset(days=row['target_days_to_complete'] - 1)
        if not pd.isnull(row['target_start_date']) else pd.NaT,
        axis=1
    )

    # Generate date range from the earliest target start to the latest target completion
    start_date = df['target_start_date'].min()
    end_date = df['target_completion_date'].max()
    dates = pd.date_range(start=start_date, end=end_date)

    # Calculate PV and EV for each date in the range
    pv_ev_list = []
    for date in dates:
        pv = 0.0
        # Calculate Planned Value (PV)
        for _, task in df.iterrows():
            if pd.isnull(task['target_start_date']) or pd.isnull(task['target_completion_date']):
                continue
            if date < task['target_start_date']:
                continue  # Task hasn't started yet
            elif date > task['target_completion_date']:
                pv += task['expected_cost']
            else:
                days_elapsed = (date - task['target_start_date']).days + 1
                duration = task['target_days_to_complete']
                if duration != 0:
                    pv += (days_elapsed / duration) * task['expected_cost']
        # Calculate Earned Value (EV)
        ev = 0.0
        for _, task in df.iterrows():
            if task['status'].lower() == 'done' and not pd.isnull(task['actual_completion_date']):
                if task['actual_completion_date'] <= date:
                    ev += task['expected_cost']
        pv_ev_list.append((date, round(pv, 2), ev))

    # Build planned_value and earned_value lists from computed data points.
    planned_values = [(date.strftime('%Y-%m-%d'), pv) for date, pv, _ in pv_ev_list]
    earned_values = [(date.strftime('%Y-%m-%d'), ev) for date, _, ev in pv_ev_list]

    # Instead of compressing by cost changes, we now want to keep only those dates that “correspond”
    # to at least one task. We consider a date as corresponding to a task if it is equal to one of the
    # task's target_start_date or target_completion_date.
    milestone_dates = set()
    for col in ['target_start_date', 'target_completion_date']:
        # Only include non-null dates
        milestone_dates.update({d.strftime('%Y-%m-%d') for d in df[col].dropna().unique()})

    filtered_planned = [pt for pt in planned_values if pt[0] in milestone_dates]
    filtered_earned = [pt for pt in earned_values if pt[0] in milestone_dates]

    # Calculate EVM metrics
    done_tasks = df[df['status'].str.lower() == 'done']
    if done_tasks.empty:
        # If no tasks are done, use current_day (if provided) or use today's date.
        latest_done_date = pd.to_datetime(current_day) if current_day else pd.to_datetime(datetime.now().date())
        ac = 0.0
        current_ev = 0.0
        current_pv = 0.0
    else:
        latest_done_date = done_tasks['actual_completion_date'].max()
        ac = done_tasks[done_tasks['actual_completion_date'] <= latest_done_date]['actual_cost'].sum()
        current_ev = 0.0
        current_pv = 0.0
        for date, pv, ev in pv_ev_list:
            if date <= latest_done_date:
                current_pv = pv
                current_ev = ev

    # Compute variances and indices
    cv = current_ev - ac
    sv = current_ev - current_pv
    cpi = current_ev / ac if ac != 0 else 0.0
    spi = current_ev / current_pv if current_pv != 0 else 0.0

    # Calculate Earned Schedule (ES) in days
    es_days = 0.0
    project_start_date = df['target_start_date'].min()
    if not pd.isnull(project_start_date) and current_ev > 0:
        prev_date = None
        prev_pv = None
        found = False
        for date, pv, _ in pv_ev_list:
            if pv <= current_ev:
                prev_date = date
                prev_pv = pv
            else:
                if prev_date is not None:
                    next_pv = pv
                    delta_pv = next_pv - prev_pv
                    fraction = (current_ev - prev_pv) / delta_pv if delta_pv != 0 else 0.0
                    delta_date = date - prev_date
                    # Interpolated time delta (as a fraction of a day)
                    es_timedelta = (prev_date - project_start_date) + pd.Timedelta(days=fraction * delta_date.days)
                    es_days = es_timedelta.total_seconds() / 86400  # seconds per day
                else:
                    es_days = 0.0
                found = True
                break
        if not found and prev_date is not None:
            es_days = (prev_date - project_start_date).total_seconds() / 86400

    metrics = {
        'cost_variance': round(cv, 2),
        'schedule_variance': round(sv, 2),
        'cpi': round(cpi, 2),
        'spi': round(spi, 2),
        'earned_schedule_days': round(es_days, 2),
        'actual_cost': round(ac, 2),
        'date_of_latest_done_task': latest_done_date.strftime('%Y-%m-%d') if not done_tasks.empty else None
    }

    # Determine today's date if not provided
    if current_day is None:
        current_day = datetime.now()

    return {
        'planned_value': filtered_planned,
        'earned_value': filtered_earned,
        'metrics': metrics,
        'metadata': {'today': current_day.strftime('%Y-%m-%d')}
    }
