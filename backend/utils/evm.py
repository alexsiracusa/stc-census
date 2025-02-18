import pandas as pd
import numpy as np
from datetime import datetime


def compute_evm(df, current_date=None):
    # If a current date is not provided, use today.
    if current_date is None:
        current_date = pd.to_datetime("today").normalize()
    else:
        current_date = pd.to_datetime(current_date)

    # Ensure the date columns are datetime
    date_cols = ["actual_start_date", "target_start_date", "actual_completion_date", "target_completion_date"]
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    # Define a helper to assign a “planned” completion date for PV purposes.
    def get_planned_date(row):
        # For tasks that are finished, use target_completion_date:
        if row['status'] == "done":
            return row['target_completion_date']
        # For tasks explicitly in progress, use actual_start_date plus target_days_to_complete if available,
        # otherwise fall back to target_completion_date.
        elif row['status'] == "in_progress":
            if pd.notnull(row['actual_start_date']) and pd.notnull(row['target_days_to_complete']):
                return row['actual_start_date'] + pd.Timedelta(days=int(row['target_days_to_complete']))
            else:
                return row['target_completion_date']
        # For other tasks (e.g., "todo", "to_do", "on_hold") we use target_completion_date
        else:
            return row['target_completion_date']

    # Create a new column for planned date. (It may be NaT if no target_completion_date is defined.)
    df['planned_date'] = df.apply(get_planned_date, axis=1)

    # ***********************************************
    # Create Planned Value (PV) events.
    # For each task with a valid planned_date, add its expected_cost at that date.
    # (If expected_cost is missing, treat it as 0.)
    df['expected_cost'] = df['expected_cost'].fillna(0)
    pv_df = df[df['planned_date'].notnull()].copy()
    pv_events = pv_df.groupby('planned_date')['expected_cost'].sum().sort_index()
    # Create a cumulative sum (step function) for planned cost.
    pv_cumsum = pv_events.cumsum()

    # ***********************************************
    # Create Earned Value (EV) events.
    # Only tasks that have an actual_completion_date are “earned.”
    # For tasks on hold, we force their cost to 0.
    df['actual_cost'] = df['actual_cost'].fillna(0)
    ev_df = df[df['actual_completion_date'].notnull()].copy()
    # Force actual_cost to 0 for “on_hold” tasks
    ev_df.loc[ev_df['status'] == "on_hold", 'actual_cost'] = 0
    ev_events = ev_df.groupby('actual_completion_date')['actual_cost'].sum().sort_index()
    ev_cumsum = ev_events.cumsum()

    # ***********************************************
    # Build the combined timeline:
    # Use all unique dates from PV events, EV events, and always include the current_date.
    all_dates = set(pv_events.index.tolist() + ev_events.index.tolist() + [current_date])
    timeline = pd.to_datetime(sorted(all_dates))

    # Reindex the cumulative sums to our full timeline, forward filling events.
    pv_series = pv_cumsum.reindex(timeline, method='ffill').fillna(0)
    ev_series = ev_cumsum.reindex(timeline, method='ffill').fillna(0)

    # Convert the series into a list of tuples (date, cumulative cost)
    planned_value_list = [(date.strftime("%Y-%m-%d"), cost) for date, cost in pv_series.items()]
    earned_value_list = [(date.strftime("%Y-%m-%d"), cost) for date, cost in ev_series.items()]

    # ***********************************************
    # Determine the project start date.
    # Here we assume the project start is the earliest between target_start_date and actual_start_date.
    all_start_dates = pd.concat([df['target_start_date'], df['actual_start_date']]).dropna()
    if not all_start_dates.empty:
        project_start = all_start_dates.min()
    else:
        # Fallback: if no start dates, use the earliest date in the timeline
        project_start = timeline[0]

    # ***********************************************
    # Earned Schedule (ES) Calculation:
    # ES is defined as the planned time when the cumulative planned cost equals the current earned value.
    EV_current = ev_series.loc[current_date] if current_date in ev_series.index else ev_series.ffill().iloc[-1]

    # If there is no planned cost even on the timeline, set ES to project_start.
    if pv_series.max() == 0:
        es_date = project_start
    else:
        # If EV_current is below the first planned value, then ES is project_start:
        if EV_current <= pv_series.iloc[0]:
            es_date = timeline[0]
        # If EV_current exceeds the last planned cost, then ES equals the last planned date.
        elif EV_current >= pv_series.iloc[-1]:
            es_date = timeline[-1]
        else:
            # Find the two timeline points bounding EV_current.
            prev_date = timeline[0]
            prev_value = pv_series.iloc[0]
            es_date = timeline[0]
            for t, pv_val in pv_series.items():
                if pv_val < EV_current:
                    prev_date = t
                    prev_value = pv_val
                else:
                    next_date = t
                    next_value = pv_val
                    break
            # Linear interpolation between prev_date and next_date.
            # Avoid division by zero in case of no change.
            if next_value - prev_value != 0:
                fraction = (EV_current - prev_value) / (next_value - prev_value)
            else:
                fraction = 0
            delta = (next_date - prev_date)
            es_date = prev_date + fraction * delta

    # Express Actual Time as the number of days from project_start to current_date.
    actual_time = (current_date - project_start).days
    # Earned Schedule in days is the elapsed time from project_start to the ES date.
    earned_schedule = (es_date - project_start).days
    # Time Variance (TV) is the difference between Actual Time and Earned Schedule.
    time_variance = actual_time - earned_schedule

    # Budget At Completion is the total expected cost (sum over all tasks)
    budget_at_completion = df['expected_cost'].sum()

    metrics = {
        "earned_schedule_days": earned_schedule,
        "actual_time_days": actual_time,
        "time_variance_days": time_variance,
        "budget_at_completion": budget_at_completion,
        "planned_value": planned_value_list,
        "earned_value": earned_value_list
    }

    return metrics
