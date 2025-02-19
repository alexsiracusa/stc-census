import pandas as pd
from datetime import datetime


def compute_evm(df, current_date=None):
    if current_date is None:
        current_date = pd.to_datetime("today").normalize()
    else:
        current_date = pd.to_datetime(current_date)

    date_cols = ["actual_start_date", "target_start_date", "actual_completion_date", "target_completion_date"]
    for col in date_cols:
        df[col] = pd.to_datetime(df[col], errors='coerce')

    # Convert costs to numeric types to ensure correct summation
    df['actual_cost'] = pd.to_numeric(df['actual_cost'], errors='coerce').fillna(0)
    df['expected_cost'] = pd.to_numeric(df['expected_cost'], errors='coerce').fillna(0)
    df.loc[df['status'] == 'on_hold', 'actual_cost'] = 0

    def get_planned_date(row):
        if row['status'] == "done":
            return row['target_completion_date']
        elif row['status'] == "in_progress":
            if pd.notnull(row['actual_start_date']) and pd.notnull(row['target_days_to_complete']):
                return row['actual_start_date'] + pd.Timedelta(days=int(row['target_days_to_complete']))
            else:
                return row['target_completion_date']
        else:
            return row['target_completion_date']

    df['planned_date'] = df.apply(get_planned_date, axis=1)

    # Planned Value (PV) calculation
    pv_df = df[df['planned_date'].notnull()].copy()
    pv_events = pv_df.groupby('planned_date')['expected_cost'].sum().sort_index()
    pv_cumsum = pv_events.cumsum()

    # Earned Value (EV) calculation using expected_cost for completed tasks
    ev_df = df[df['actual_completion_date'].notnull()].copy()
    ev_events = ev_df.groupby('actual_completion_date')['expected_cost'].sum().sort_index()
    ev_cumsum = ev_events.cumsum()

    all_dates = set(pv_events.index.tolist() + ev_events.index.tolist() + [current_date])
    timeline = pd.to_datetime(sorted(all_dates))

    pv_series = pv_cumsum.reindex(timeline, method='ffill').fillna(0)
    ev_series = ev_cumsum.reindex(timeline, method='ffill').fillna(0)

    planned_value_list = [(date.strftime("%Y-%m-%d"), cost) for date, cost in pv_series.items()]
    earned_value_list = [(date.strftime("%Y-%m-%d"), cost) for date, cost in ev_series.items()]

    all_start_dates = pd.concat([df['target_start_date'], df['actual_start_date']]).dropna()
    project_start = all_start_dates.min() if not all_start_dates.empty else timeline[0]

    EV_current = ev_series.loc[current_date]
    PV_current = pv_series.loc[current_date]

    ac_df = df[df['actual_start_date'].notnull()]
    AC_current = ac_df['actual_cost'].sum()

    # Calculate Earned Schedule (ES)
    if pv_series.empty:
        es_date = project_start
    else:
        if EV_current <= pv_series.iloc[0]:
            es_date = timeline[0]
        elif EV_current >= pv_series.iloc[-1]:
            es_date = timeline[-1]
        else:
            prev_date = timeline[0]
            prev_value = pv_series.iloc[0]
            next_date = timeline[0]
            next_value = pv_series.iloc[0]
            for t, pv_val in pv_series.items():
                if pv_val < EV_current:
                    prev_date = t
                    prev_value = pv_val
                else:
                    next_date = t
                    next_value = pv_val
                    break
            if next_value - prev_value != 0:
                fraction = (EV_current - prev_value) / (next_value - prev_value)
            else:
                fraction = 0
            delta = (next_date - prev_date)
            es_date = prev_date + fraction * delta

    actual_time = (current_date - project_start).days
    earned_schedule = (es_date - project_start).days
    time_variance = earned_schedule - actual_time

    BAC = df['expected_cost'].sum()

    CV = EV_current - AC_current
    SV = EV_current - PV_current
    CV_percent = (CV / EV_current * 100) if EV_current != 0 else None
    SV_percent = (SV / PV_current * 100) if PV_current != 0 else None
    CPI = EV_current / AC_current if AC_current != 0 else None
    SPI = EV_current / PV_current if PV_current != 0 else None
    EAC = AC_current + (BAC - EV_current) if EV_current else None
    ETC = BAC - EV_current
    VAC = BAC - EAC if EAC else None

    sac_date = pv_series.index.max() if not pv_series.empty else pd.NaT
    sac_days = (sac_date - project_start).days if not pd.isnull(sac_date) else 0
    PAR = BAC / sac_days if sac_days > 0 else 0

    TV = time_variance
    TV_percent = (TV / actual_time * 100) if actual_time != 0 else None
    TPI = earned_schedule / actual_time if actual_time != 0 else None

    metrics = {
        "planned_value": planned_value_list,
        "earned_value": earned_value_list,
        "metrics": {
            "earned_schedule_days": earned_schedule,
            "actual_time_days": actual_time,
            "time_variance_days": TV,
            "budget_at_completion": BAC,
            "cost_variance": CV,
            "schedule_variance": SV,
            "cost_variance_percent": CV_percent,
            "schedule_variance_percent": SV_percent,
            "cost_performance_index": CPI,
            "schedule_performance_index": SPI,
            "estimate_at_completion": EAC,
            "estimate_to_complete": ETC,
            "variance_at_completion": VAC,
            "schedule_at_completion_days": sac_days,
            "planned_accomplishment_rate": PAR,
            "time_variance_percent": TV_percent,
            "time_performance_index": TPI,
            "actual_cost": AC_current
        }
    }

    return metrics
