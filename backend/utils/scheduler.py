from apscheduler.schedulers.asyncio import AsyncIOScheduler
from datetime import datetime
from functools import wraps
from pytz import timezone
import logging

from ..database.data import get_tasks_due_soon, get_tasks_overdue
from .email import EmailClient
from ..config import TIMEZONE

logger = logging.getLogger(__name__)

def setup_scheduler() -> AsyncIOScheduler:
    """
    Initialize scheduler and add jobs.
    :return: scheduler
    """
    current_tz = timezone(TIMEZONE.TZ)
    scheduler = AsyncIOScheduler(timezone=current_tz)

    # Add immediate check for soon-to-be-due tasks
    scheduler.add_job(
        check_deadlines,
        'date',  # Run once immediately
        next_run_time=datetime.now(current_tz)
    )

    # Add immediate check for overdue tasks
    scheduler.add_job(
        check_overdue,
        'date',  # Run once immediately
        next_run_time=datetime.now(current_tz)
    )

    # Add recurring check for soon-to-be-due tasks
    scheduler.add_job(
        check_deadlines,
        'interval',
        hours=1,
    )

    # Add recurring check for overdue tasks
    scheduler.add_job(
        check_overdue,
        'interval',
        hours=1,
    )

    scheduler.start()
    return scheduler


def safe_debug_task(error_message=None, debug=False):
    """
    Decorator for error handling in async functions,
    and allows log messages to be toggled on/off.
    This assumes the decorated function is an async function.

    :param error_message: Custom error message.
    :param debug: If True, enables logging messages.
    """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            if not debug:
                logging.disable(logging.INFO)
            try:
                result = await func(*args, **kwargs)
                return result
            except Exception as e:
                msg = error_message or f"Error in {func.__name__}"
                logger.error(f"{msg}: {str(e)}")
            finally:
                if not debug:
                    logging.disable(logging.NOTSET)
        return wrapper
    return decorator


@safe_debug_task("Error checking upcoming deadlines", debug=False)
async def check_deadlines() -> None:
    """
    Check for tasks due soon and, if any are found, send email notifications.
    """
    tasks = await get_tasks_due_soon()
    logger.info(f"Tasks found: {tasks}")
    if tasks:
        email_client = EmailClient()
        await email_client.send_notification(tasks)
        logger.info(f"Found {len(tasks)} tasks due soon")
    else:
        logger.info("No tasks due soon")

@safe_debug_task("Error checking overdue tasks", debug=False)
async def check_overdue() -> None:
    """
    Check for tasks overdue and, if any are found, send email notifications.
    """
    tasks = await get_tasks_overdue()
    logger.info(f"Tasks found: {tasks}")
    if tasks:
        email_client = EmailClient()
        await email_client.send_notification(tasks)
        logger.info(f"Found {len(tasks)} tasks overdue")
    else:
        logger.info("No tasks overdue")
