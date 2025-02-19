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
        df[col] = pd.to_datetime(df[col], errors='coerce')

    df['status'] = df['status'].astype(str)

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

        pv_ev_list.append((date, round(pv, 2), ev))

    # Build the planned_value and earned_value lists as tuples (date, cost)
    planned_values = [(date.strftime('%Y-%m-%d'), pv) for date, pv, _ in pv_ev_list]
    earned_values = [(date.strftime('%Y-%m-%d'), ev) for date, _, ev in pv_ev_list]

    # Compression function: for a list of (date, cost) points, remove all intermediate points
    # where the cost is unchanged (i.e. keep only the first and last point in a run of same cost).
    def compress_points(points):
        if not points:
            return points
        compressed = []
        current_group = [points[0]]
        for point in points[1:]:
            if point[1] == current_group[-1][1]:
                # Same cost as the last point in the group; collect it.
                current_group.append(point)
            else:
                # New cost group; for the previous group, keep the first and last entries.
                if len(current_group) == 1:
                    compressed.extend(current_group)
                else:
                    compressed.append(current_group[0])
                    compressed.append(current_group[-1])
                current_group = [point]
        # Process the final group.
        if current_group:
            if len(current_group) == 1:
                compressed.extend(current_group)
            else:
                compressed.append(current_group[0])
                compressed.append(current_group[-1])
        # (Optional) Double-check for any accidental duplicate consecutive entries and merge.
        final_compressed = [compressed[0]]
        for pt in compressed[1:]:
            if pt[1] == final_compressed[-1][1]:
                # Overwrite with later date for clarity.
                final_compressed[-1] = pt
            else:
                final_compressed.append(pt)
        return final_compressed

    # Compress both PV and EV series.
    compressed_planned = compress_points(planned_values)
    compressed_earned = compress_points(earned_values)

    return {'planned_value': compressed_planned, 'earned_value': compressed_earned, 'metrics': {}}
