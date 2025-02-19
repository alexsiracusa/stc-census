import pandas as pd
from datetime import datetime
from pandas.tseries.offsets import DateOffset


def compute_evm(df: pd.DataFrame, current_day: datetime = None):
    df.columns = ['status',
                  'actual_cost', 'expected_cost',
                  'actual_start_date', 'target_start_date',
                  'actual_completion_date', 'target_completion_date',
                  'target_days_to_complete']

    # ensuring proper column types
    df[['actual_cost', 'expected_cost']] = df[['actual_cost', 'expected_cost']].astype(float).fillna(0)
    df['target_days_to_complete'] = df['target_days_to_complete'].astype(int).fillna(0)
    date_columns = ['actual_start_date', 'target_start_date',
                    'actual_completion_date', 'target_completion_date']
    for col in date_columns:
        df[col] = pd.to_datetime(df[col])

    df['status'] = df['status'].astype(str)

    # Convert date columns to datetime and handle NaT
    date_columns = ['actual_start_date', 'target_start_date',
                    'actual_completion_date', 'target_completion_date']
    for col in date_columns:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    # Ensure numeric columns are properly typed
    df[['actual_cost', 'expected_cost']] = df[['actual_cost', 'expected_cost']].astype(float).fillna(0)
    df['target_days_to_complete'] = df['target_days_to_complete'].astype(int).fillna(0)

    # Recalculate target_completion_date based on target_days_to_complete
    df['target_completion_date'] = df.apply(
        lambda row: row['target_start_date'] + DateOffset(days=row['target_days_to_complete'] - 1)
        if not pd.isnull(row['target_start_date']) else pd.NaT,
        axis=1
    )

    # Generate the date range from min target start to max target completion
    start_date = df['target_start_date'].min()
    end_date = df['target_completion_date'].max()
    dates = pd.date_range(start=start_date, end=end_date)

    # Calculate PV and EV for each date
    pv_ev_list = []
    for date in dates:
        pv = 0.0
        # Calculate Planned Value (PV)
        for _, task in df.iterrows():
            if pd.isnull(task['target_start_date']) or pd.isnull(task['target_completion_date']):
                continue
            if date < task['target_start_date']:
                continue  # Task hasn't started
            elif date > task['target_completion_date']:
                # Task is fully planned
                pv += task['expected_cost']
            else:
                # Calculate the proportion of days elapsed
                days_elapsed = (date - task['target_start_date']).days + 1
                duration = task['target_days_to_complete']
                if duration == 0:
                    continue  # Avoid division by zero
                pv += (days_elapsed / duration) * task['expected_cost']

        # Calculate Earned Value (EV)
        ev = 0.0
        for _, task in df.iterrows():
            if task['status'] == 'done' and not pd.isnull(task['actual_completion_date']):
                if task['actual_completion_date'] <= date:
                    ev += task['expected_cost']

        pv_ev_list.append((date.date(), round(pv, 2), ev))

    # Split into PV and EV lists
    planned_values = [(date.strftime('%Y-%m-%d'), pv) for date, pv, _ in pv_ev_list]
    earned_values = [(date.strftime('%Y-%m-%d'), ev) for date, _, ev in pv_ev_list]

    return {'planned_value': planned_values, 'earned_value': earned_values, 'metrics': {}}