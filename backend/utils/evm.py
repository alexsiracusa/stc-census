import pandas as pd
import numpy as np


def compute_evm(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = ['id', 'project_id', 'status','actual_cost', 'start_date', 'completion_date',
                  'expected_cost', 'target_start_date', 'target_completion_date', 'target_days_to_complete']

    # Get current date
    current_date = pd.Timestamp.today().date()

    # Map status to percent complete
    status_mapping = {
        'done': 1.0,
        'in_progress': 0.5,
        'on_hold': 0.0,
        'to_do': 0.0
    }
    df['percent_complete'] = df['status'].map(status_mapping)

    # Calculate Earned Value (EV)
    df['EV'] = df['percent_complete'] * df['expected_cost']

    # Convert date columns to datetime.date objects if necessary
    for col in ['target_start_date', 'target_completion_date']:
        if not pd.api.types.is_datetime64_any_dtype(df[col]):
            df[col] = pd.to_datetime(df[col]).dt.date

    # Function to calculate planned percentage
    def calculate_planned_percent(row):
        target_start = row['target_start_date']
        target_end = row['target_completion_date']

        # Handle missing dates as 0% planned
        if pd.isnull(target_start) or pd.isnull(target_end):
            return 0.0

        if current_date < target_start:
            return 0.0
        elif current_date >= target_end:
            return 1.0
        else:
            elapsed_days = (current_date - target_start).days
            planned_duration = row['target_days_to_complete']

            if planned_duration <= 0:
                return 1.0  # Avoid division by zero or negative

            planned_percent = elapsed_days / planned_duration
            return min(planned_percent, 1.0)

    # Calculate Planned Value (PV)
    df['planned_percent'] = df.apply(calculate_planned_percent, axis=1)
    df['PV'] = df['planned_percent'] * df['expected_cost']

    # Handle NaN in actual_cost by filling with 0
    df['actual_cost'] = df['actual_cost'].fillna(0)
    df['AC'] = df['actual_cost']

    # Aggregate metrics for the entire dataset
    aggregated = df[['EV', 'PV', 'AC', 'expected_cost']].sum()

    # Calculate EVM metrics
    aggregated['SV'] = aggregated['EV'] - aggregated['PV']
    aggregated['CV'] = aggregated['EV'] - aggregated['AC']
    aggregated['SPI'] = aggregated['EV'] / aggregated['PV'] if aggregated['PV'] != 0 else None  # Avoid division by zero
    aggregated['CPI'] = aggregated['EV'] / aggregated['AC'] if aggregated['AC'] != 0 else None
    aggregated['EAC'] = aggregated['expected_cost'] / aggregated['CPI'] if aggregated['CPI'] not in [0, None] else None

    # Convert aggregated Series to DataFrame
    result = pd.DataFrame([aggregated])

    # Rename columns to match expected output
    result.rename(columns={'expected_cost': 'Budget'}, inplace=True)

    # Select the final columns
    result = result[['EV', 'PV', 'AC', 'SV', 'CV', 'SPI', 'CPI', 'EAC']]

    # rename columns to their full name versions
    result.rename(columns={
        'EV': 'earned_value',
        'PV': 'planned_value',
        'AC': 'actual_cost',
        'SV': 'schedule_variance',
        'CV': 'cost_variance',
        'SPI': 'schedule_performance_index',
        'CPI': 'cost_performance_index',
        'EAC': 'estimate_at_completion'
    }, inplace=True)

    return result

