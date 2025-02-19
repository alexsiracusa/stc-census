import pandas as pd
from datetime import datetime
from pandas.tseries.offsets import DateOffset


def compute_evm(df: pd.DataFrame, current_day: datetime = None):
    # Rename columns for consistency
    df.columns = ['status',
                  'actual_cost', 'expected_cost',
                  'actual_start_date', 'target_start_date',
                  'actual_completion_date', 'target_completion_date',
                  'target_days_to_complete']

    # Convert numeric and date columns and fill missing values
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

    # Create a date range from the earliest target_start_date to the latest target_completion_date
    start_date = df['target_start_date'].min()
    end_date = df['target_completion_date'].max()
    dates = pd.date_range(start=start_date, end=end_date)

    # Compute Planned Value (PV), Earned Value (EV) and Actual Cost trend for each day in the date range.
    pv_ev_list = []  # Each element: (date, planned_value, earned_value)
    actual_cost_list = []  # Each element: (date, accumulated actual_cost)

    for date in dates:
        # Planned Value (PV)
        pv = 0.0
        for _, task in df.iterrows():
            # Skip if target dates are missing.
            if pd.isnull(task['target_start_date']) or pd.isnull(task['target_completion_date']):
                continue
            if date < task['target_start_date']:
                # Task not yet started
                continue
            elif date > task['target_completion_date']:
                # Task is fully planned
                pv += task['expected_cost']
            else:
                # Task is in progress—calculate the proportion of expected cost based on elapsed target days.
                days_elapsed = (date - task['target_start_date']).days + 1
                duration = task['target_days_to_complete']
                if duration != 0:
                    pv += (days_elapsed / duration) * task['expected_cost']

        # Earned Value (EV)
        ev = 0.0
        for _, task in df.iterrows():
            # Instead of checking status, consider the task done if actual_completion_date is not null.
            if not pd.isnull(task['actual_completion_date']):
                if task['actual_completion_date'] <= date:
                    ev += task['expected_cost']

        # Actual Cost (AC) trend: sum the actual cost for all done tasks completed on or before this date.
        ac_value = 0.0
        for _, task in df.iterrows():
            if not pd.isnull(task['actual_completion_date']):
                if task['actual_completion_date'] <= date:
                    ac_value += task['actual_cost']

        pv_ev_list.append((date, round(pv, 2), ev))
        actual_cost_list.append((date, round(ac_value, 2)))

    # Build lists of (date_str, value) from the computed pv/ev lists.
    planned_values = [(date.strftime('%Y-%m-%d'), pv) for date, pv, _ in pv_ev_list]
    earned_values = [(date.strftime('%Y-%m-%d'), ev) for date, _, ev in pv_ev_list]

    # Filter the computed actual_cost_list to only include milestone dates.
    milestone_dates = set()
    for col in ['target_start_date', 'target_completion_date']:
        milestone_dates.update({d.strftime('%Y-%m-%d') for d in df[col].dropna().unique()})
    filtered_planned = [pt for pt in planned_values if pt[0] in milestone_dates]
    filtered_earned = [pt for pt in earned_values if pt[0] in milestone_dates]
    filtered_actual = [(date.strftime('%Y-%m-%d'), cost)
                       for date, cost in actual_cost_list if date.strftime('%Y-%m-%d') in milestone_dates]

    # Calculate aggregated EVM metrics.
    # Instead of filtering on status, a task is considered done if it has an actual_completion_date.
    done_tasks = df[~df['actual_completion_date'].isna()]
    if done_tasks.empty:
        # If no task is done, choose either the provided current_day or today's date.
        latest_done_date = pd.to_datetime(current_day) if current_day else pd.to_datetime(datetime.now().date())
        ac_aggregated = 0.0
        current_ev = 0.0
        current_pv = 0.0
    else:
        latest_done_date = done_tasks['actual_completion_date'].max()
        ac_aggregated = done_tasks[done_tasks['actual_completion_date'] <= latest_done_date]['actual_cost'].sum()
        current_ev = 0.0
        current_pv = 0.0
        for date, pv, ev in pv_ev_list:
            if date <= latest_done_date:
                current_pv = pv
                current_ev = ev

    cv = current_ev - ac_aggregated  # Cost Variance
    sv = current_ev - current_pv  # Schedule Variance
    cpi = current_ev / ac_aggregated if ac_aggregated != 0 else 0.0
    spi = current_ev / current_pv if current_pv != 0 else 0.0

    # Calculate Earned Schedule (ES) in days.
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
                    es_timedelta = (prev_date - project_start_date) + pd.Timedelta(days=fraction * delta_date.days)
                    es_days = es_timedelta.total_seconds() / 86400  # seconds per day
                else:
                    es_days = 0.0
                found = True
                break
        if not found and prev_date is not None:
            es_days = (prev_date - project_start_date).total_seconds() / 86400

    # Build the metrics dictionary.
    metrics = {
        'cost_variance': round(cv, 2),
        'schedule_variance': round(sv, 2),
        'cpi': round(cpi, 2),
        'spi': round(spi, 2),
        'earned_schedule_days': round(es_days, 2),
        # Report the aggregated actual cost for reference (calculated from done tasks).
        'actual_cost_total': round(ac_aggregated, 2),
        'date_of_latest_done_task': latest_done_date.strftime('%Y-%m-%d') if not done_tasks.empty else None
    }

    # If current_day was not provided, use today's date.
    if current_day is None:
        current_day = datetime.now()

    return {
        'planned_value': filtered_planned,
        'earned_value': filtered_earned,
        'actual_cost': filtered_actual,  # Actual Cost trend (list of (date, cost))
        'metrics': metrics,
        'metadata': {'today': current_day.strftime('%Y-%m-%d')}
    }
