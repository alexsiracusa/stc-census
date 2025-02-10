from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv
from datetime import datetime
from pytz import timezone
import logging
import os

from ..database.data import get_tasks_due_soon, get_tasks_overdue
from .logging import safe_debug_task
from .email import EmailClient

# Environment setup
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(parent_dir, '.env'))

TIMEZONE = os.getenv('TIMEZONE')
logger = logging.getLogger(__name__)


def setup_scheduler(debug:bool=True) -> AsyncIOScheduler:
    """
    Initialize scheduler and add jobs.
    :return: scheduler
    """
    scheduler = AsyncIOScheduler(timezone=timezone(TIMEZONE))

    # Add immediate check for soon-to-be-due tasks
    scheduler.add_job(
        check_deadlines,
        'date',  # Run once immediately
        next_run_time=datetime.now(timezone(TIMEZONE))
    )

    # Add immediate check for overdue tasks
    scheduler.add_job(
        check_overdue,
        'date',  # Run once immediately
        next_run_time=datetime.now(timezone(TIMEZONE))
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


@safe_debug_task("Error checking upcoming deadlines")
async def check_deadlines(debug:bool=False) -> None:
    """
    Check for tasks due soon and, if any are found, send email notifications.
    :param debug: If on, this will log messages.
    """
    tasks = await get_tasks_due_soon()
    logger.info(f"Tasks found: {tasks}")
    if tasks:
        email_client = EmailClient()
        await email_client.send_notification(tasks)
        logger.info(f"Found {len(tasks)} tasks due soon")
    else:
        logger.info("No tasks due soon")

@safe_debug_task("Error checking overdue tasks")
async def check_overdue(debug:bool=False) -> None:
    """
    Check for tasks overdue and, if any are found, send email notifications.
    :param debug: If on, this will log messages.
    """
    tasks = await get_tasks_overdue()
    logger.info(f"Tasks found: {tasks}")
    if tasks:
        email_client = EmailClient()
        await email_client.send_notification(tasks)
        logger.info(f"Found {len(tasks)} tasks overdue")
    else:
        logger.info("No tasks overdue")
