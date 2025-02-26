import pandas as pd
import numpy as np
from datetime import datetime


def compute_evm(df: pd.DataFrame, current_day: datetime = None):
    # Rename columns for consistency
    df.columns = [
        'status',
        'actual_cost', 'expected_cost',
        'actual_start_date', 'target_start_date',
        'actual_completion_date', 'target_completion_date',
        'target_days_to_complete'
    ]

    # Convert numeric and date columns and fill missing values
    df[['actual_cost', 'expected_cost']] = df[['actual_cost', 'expected_cost']].astype(float).fillna(0)
    df['target_days_to_complete'] = df['target_days_to_complete'].astype(int).fillna(0)

    # Convert date columns to datetime
    date_columns = ['actual_start_date', 'target_start_date', 'actual_completion_date', 'target_completion_date']
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    # Recalculate target_completion_date using vectorized operation
    df['target_completion_date'] = df['target_start_date'] + pd.to_timedelta(df['target_days_to_complete'] - 1,
                                                                             unit='D')

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
    done_tasks = df[df['actual_completion_date'].notna()]
    if done_tasks.empty:
        latest_done_date = pd.to_datetime(current_day) if current_day else pd.to_datetime(datetime.now().date())
    else:
        latest_done_date = done_tasks['actual_completion_date'].max()

    # Adjust date range to include latest_done_date and target dates
    start_date = df['target_start_date'].min()
    initial_end_date = df['target_completion_date'].max()
    end_date = initial_end_date if pd.notnull(
        initial_end_date) and initial_end_date >= latest_done_date else latest_done_date
    if pd.isnull(start_date):
        start_date = df['actual_start_date'].min()

    # If start_date or end_date is not defined, use latest_done_date only.
    if pd.isnull(start_date) or pd.isnull(end_date):
        dates = pd.to_datetime([latest_done_date])
    else:
        dates = pd.date_range(start=start_date, end=end_date)

    # -------------------------
    # Vectorized computation
    # -------------------------

    # Convert the date range to an array in datetime64[D]
    dates_np = dates.values.astype("datetime64[D]")
    n_dates = len(dates_np)

    # Get task arrays (convert dates to datetime64[D] for vectorized day arithmetic)
    ts = df["target_start_date"].values.astype("datetime64[D]")
    tc = df["target_completion_date"].values.astype("datetime64[D]")
    expected = df["expected_cost"].values.astype(float)
    duration = df["target_days_to_complete"].values.astype(float)

    # Create a boolean mask for tasks with valid target_start and target_completion dates.
    valid = (~pd.isna(ts)) & (~pd.isna(tc))

    # Create a matrix of elapsed days for each date (rows) and each task (columns).
    # dt will be an integer matrix where:
    #   dt < 1    => the date is before the task’s target_start_date (0 contribution)
    #   dt > duration  => the task is fully “earned” (100% expected_cost)
    #   otherwise use fraction dt/duration * expected_cost.
    dt = ((dates_np[:, None] - ts[None, :]) / np.timedelta64(1, "D")).astype(int) + 1
    pv_matrix = np.where(
        ~valid[None, :],
        0,
        np.where(
            dt < 1,
            0,
            np.where(
                dt > duration[None, :],
                expected[None, :],
                (dt / duration[None, :]) * expected[None, :]
            )
        )
    )
    pv_per_date = pv_matrix.sum(axis=1)

    # Compute EV and AC.
    # For each task, if it has a valid actual_completion_date and that date is <= current date then include.
    ac_dates = df["actual_completion_date"].values.astype("datetime64[D]")
    valid_ac = ~pd.isna(ac_dates)
    completed = (dates_np[:, None] >= ac_dates[None, :]) & valid_ac[None, :]
    ev_per_date = np.where(completed, expected[None, :], 0).sum(axis=1)
    ac_per_date = np.where(completed, df["actual_cost"].values[None, :], 0).sum(axis=1)

    # Compute Schedule Variance % and Cost Performance Index
    sv_array = np.where(pv_per_date != 0, (ev_per_date - pv_per_date) / pv_per_date, 0)
    cpi_array = np.where(ac_per_date != 0, ev_per_date / ac_per_date, 0)

    # Earned schedule and Time Variance %
    if bac != 0:
        es_array = (ev_per_date / bac) * sac
    else:
        es_array = np.zeros_like(ev_per_date)
    if pd.isna(project_start_date):
        at_array = np.zeros_like(es_array)
    else:
        proj_start_np = np.datetime64(project_start_date.strftime("%Y-%m-%d"))
        at_array = ((dates_np - proj_start_np) / np.timedelta64(1, "D")).astype(int) + 1
    tv_array = es_array - at_array
    tv_pct_array = np.where(at_array != 0, tv_array / at_array, 0)

    # -------------------------
    # Filter the results to milestone dates
    # -------------------------

    # Build milestone dates from target_start_date and target_completion_date,
    # then restrict to dates on or before the latest_done_date.
    milestone_dates = set(
        pd.concat([df["target_start_date"], df["target_completion_date"]]).dropna().unique()
    )
    milestone_dates = {d for d in milestone_dates if d <= latest_done_date}
    milestone_str = {d.strftime("%Y-%m-%d") for d in milestone_dates}

    # Build lists (tuples with date string and rounded metric value) for milestone dates only.
    filtered_planned = [
        (d.strftime("%Y-%m-%d"), round(pv, 2))
        for d, pv in zip(dates, pv_per_date)
        if d.strftime("%Y-%m-%d") in milestone_str
    ]
    filtered_earned = [
        (d.strftime("%Y-%m-%d"), round(ev, 2))
        for d, ev in zip(dates, ev_per_date)
        if d.strftime("%Y-%m-%d") in milestone_str
    ]
    filtered_actual = [
        (d.strftime("%Y-%m-%d"), round(ac, 2))
        for d, ac in zip(dates, ac_per_date)
        if d.strftime("%Y-%m-%d") in milestone_str
    ]
    sv_pct_filtered = [
        (d.strftime("%Y-%m-%d"), round(sv, 2))
        for d, sv in zip(dates, sv_array)
        if d.strftime("%Y-%m-%d") in milestone_str
    ]
    cpi_filtered = [
        (d.strftime("%Y-%m-%d"), round(cpi, 2))
        for d, cpi in zip(dates, cpi_array)
        if d.strftime("%Y-%m-%d") in milestone_str
    ]
    tv_pct_filtered = [
        (d.strftime("%Y-%m-%d"), round(tv, 2))
        for d, tv in zip(dates, tv_pct_array)
        if d.strftime("%Y-%m-%d") in milestone_str
    ]

    # Calculate actual_time (duration from project start date to latest completed task)
    if pd.isnull(project_start_date) or pd.isnull(latest_done_date):
        actual_time = 0
    else:
        actual_time = (latest_done_date - project_start_date).days + 1

    # Aggregate actual cost
    ac_aggregated = done_tasks["actual_cost"].sum() if not done_tasks.empty else 0.0
    metrics = {
        "actual_time": actual_time,
        "total_actual_cost": round(ac_aggregated, 2),
        "date_of_latest_done_task": latest_done_date.strftime("%Y-%m-%d") if not done_tasks.empty else None,
        "budget_at_completion": round(bac, 2),
    }

    # Handle current_day default
    if current_day is None:
        current_day = datetime.now()

    return {
        "planned_value": filtered_planned,
        "earned_value": filtered_earned,
        "actual_cost": filtered_actual,
        "schedule_variance_percent_in_decimal": sv_pct_filtered,
        "cost_performance_index": cpi_filtered,
        "time_variance_percent_in_decimal": tv_pct_filtered,
        "metrics": metrics,
        "metadata": {"today": current_day.strftime("%Y-%m-%d")},
    }
