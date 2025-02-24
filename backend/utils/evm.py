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

    # Recalculate target_completion_date based on target_days_to_complete
    df['target_completion_date'] = df.apply(
        lambda row: row['target_start_date'] + DateOffset(days=row['target_days_to_complete'] - 1)
        if not pd.isnull(row['target_start_date']) else pd.NaT,
        axis=1
    )

    # Compute SAC and BAC
    project_start_date = df['target_start_date'].min()
    if pd.isnull(project_start_date):
        project_start_date = df['actual_start_date'].min()
    project_target_end = df['target_completion_date'].max()

    if pd.isnull(project_start_date) or pd.isnull(project_target_end):
        sac = 0
    else:
        sac = (project_target_end - project_start_date).days + 1
    bac = df['expected_cost'].sum()

    # Determine done tasks and latest_done_date
    done_tasks = df[~df['actual_completion_date'].isna()]
    if done_tasks.empty:
        latest_done_date = pd.to_datetime(current_day) if current_day else pd.to_datetime(datetime.now().date())
    else:
        latest_done_date = done_tasks['actual_completion_date'].max()

    # Adjust date range to include latest_done_date and target dates
    start_date = df['target_start_date'].min()
    initial_end_date = df['target_completion_date'].max()
    end_date = max(initial_end_date, latest_done_date) if not pd.isnull(initial_end_date) else latest_done_date

    # Handle NaT cases for start_date and end_date
    if pd.isnull(start_date):
        start_date = df['actual_start_date'].min()
    if pd.isnull(start_date) or pd.isnull(end_date):
        dates = pd.date_range(start=latest_done_date, end=latest_done_date)  # Single date
    else:
        dates = pd.date_range(start=start_date, end=end_date)

    # Compute PV, EV, AC, SV%, CPI, and TV% for each date
    pv_ev_list = []
    actual_cost_list = []
    sv_pct_list = []
    cpi_list = []
    tv_pct_list = []

    for date in dates:
        # Planned Value (PV)
        pv = 0.0
        for _, task in df.iterrows():
            if pd.isnull(task['target_start_date']) or pd.isnull(task['target_completion_date']):
                continue
            if date < task['target_start_date']:
                continue
            elif date > task['target_completion_date']:
                pv += task['expected_cost']
            else:
                days_elapsed = (date - task['target_start_date']).days + 1
                duration = task['target_days_to_complete']
                if duration != 0:
                    pv += (days_elapsed / duration) * task['expected_cost']

        # Earned Value (EV)
        ev = 0.0
        for _, task in df.iterrows():
            if not pd.isnull(task['actual_completion_date']) and task['actual_completion_date'] <= date:
                ev += task['expected_cost']

        # Actual Cost (AC)
        ac_value = 0.0
        for _, task in df.iterrows():
            if not pd.isnull(task['actual_completion_date']) and task['actual_completion_date'] <= date:
                ac_value += task['actual_cost']

        pv_ev_list.append((date, round(pv, 2), ev))
        actual_cost_list.append((date, round(ac_value, 2)))

        # Schedule Variance Percent and CPI
        sv_percent = (ev - pv) / pv if pv != 0 else 0.0
        cpi_value = ev / ac_value if ac_value != 0 else 0.0
        sv_pct_list.append((date, sv_percent))
        cpi_list.append((date, cpi_value))

        # Earned Schedule and Time Variance Percent
        if bac != 0:
            es = (ev / bac) * sac
        else:
            es = 0.0

        if pd.isnull(project_start_date) or date < project_start_date:
            at = 0
        else:
            at = (date - project_start_date).days + 1

        tv = es - at
        if at != 0:
            tv_pct = (tv / at)
        else:
            tv_pct = 0.0
        tv_pct_list.append((date, tv_pct))

    # Filter SV%, CPI, and TV% to dates up to latest_done_date
    sv_pct_filtered = []
    cpi_filtered = []
    tv_pct_filtered = []
    for date, sv_percent in sv_pct_list:
        if date <= latest_done_date:
            sv_pct_filtered.append((date.strftime('%Y-%m-%d'), round(sv_percent, 2)))
    for date, cpi_value in cpi_list:
        if date <= latest_done_date:
            cpi_filtered.append((date.strftime('%Y-%m-%d'), round(cpi_value, 2)))
    for date, tv_pct in tv_pct_list:
        if date <= latest_done_date:
            tv_pct_filtered.append((date.strftime('%Y-%m-%d'), round(tv_pct, 2)))

    # Prepare PV, EV, AC filtered to milestone dates
    milestone_dates = set()
    for col in ['target_start_date', 'target_completion_date']:
        milestone_dates.update({d.strftime('%Y-%m-%d') for d in df[col].dropna().unique()})
    filtered_planned = [(date.strftime('%Y-%m-%d'), pv) for date, pv, _ in pv_ev_list if
                        date.strftime('%Y-%m-%d') in milestone_dates]
    filtered_earned = [(date.strftime('%Y-%m-%d'), ev) for date, _, ev in pv_ev_list if
                       date.strftime('%Y-%m-%d') in milestone_dates]
    filtered_actual = [(date.strftime('%Y-%m-%d'), cost) for date, cost in actual_cost_list if
                       date.strftime('%Y-%m-%d') in milestone_dates]

    # Calculate actual_time
    if pd.isnull(project_start_date) or pd.isnull(latest_done_date):
        actual_time = 0
    else:
        actual_time = (latest_done_date - project_start_date).days + 1

    # Aggregated metrics
    ac_aggregated = done_tasks['actual_cost'].sum() if not done_tasks.empty else 0.0

    metrics = {
        'actual_time': actual_time,
        'total_actual_cost': round(ac_aggregated, 2),
        'date_of_latest_done_task': latest_done_date.strftime('%Y-%m-%d') if not done_tasks.empty else None,
        'budget_at_completion': round(bac, 2),
    }

    # Handle current_day default
    if current_day is None:
        current_day = datetime.now()

    return {
        'planned_value': filtered_planned,
        'earned_value': filtered_earned,
        'actual_cost': filtered_actual,
        'schedule_variance_percent_in_decimal': sv_pct_filtered,
        'cost_performance_index': cpi_filtered,
        'time_variance_percent_in_decimal': tv_pct_filtered,
        'metrics': metrics,
        'metadata': {'today': current_day.strftime('%Y-%m-%d')}
    }