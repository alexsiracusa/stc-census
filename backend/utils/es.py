import pandas as pd
import numpy as np


# !!! note: update this stub
def compute_es(df: pd.DataFrame) -> pd.DataFrame:
    df.columns = ['id', 'project_id', 'status','actual_cost', 'start_date', 'completion_date',
                  'expected_cost', 'target_start_date', 'target_completion_date', 'target_days_to_complete']

    return df

