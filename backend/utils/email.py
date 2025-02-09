from apscheduler.schedulers.asyncio import AsyncIOScheduler
from dotenv import load_dotenv
from pytz import timezone
from datetime import datetime
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import logging
import os

from ..database.data import get_tasks_due_soon

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(parent_dir, '.env'))

TIMEZONE = os.getenv('TIMEZONE')
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')

SMTP_USER = os.getenv('SMTP_USERNAME')
SMTP_PASS = os.getenv('SMTP_PASSWORD')
NOTIF_EMAIL = os.getenv('NOTIFICATION_EMAIL')

logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=SMTP_USER,
    MAIL_PASSWORD=SMTP_PASS,
    MAIL_FROM=SMTP_USER,
    MAIL_PORT=int(SMTP_PORT),
    MAIL_SERVER=SMTP_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True
)

class EmailClient:
    async def send_notification(self, tasks: list):
        try:
            # Construct an HTML body listing the tasks
            body = "Tasks nearing deadline:<br>" + "<br>".join( [f"{t['name']} (ID:{t['id']}, Project:{t['project_id']})" for t in tasks] )
            message = MessageSchema(
                subject="Task Deadline Alert",
                recipients=[NOTIF_EMAIL], # single or multiple recipients as a list
                body=body,
                subtype="html"
            )
            fm = FastMail(conf)
            await fm.send_message(message)
            logger.info("Email notification sent successfully")
        except Exception as e:
            logger.error(f"Error sending email notification: {str(e)}")


def setup_scheduler():
    scheduler = AsyncIOScheduler(timezone=timezone(TIMEZONE))

    # Add immediate check on startup
    scheduler.add_job(
        check_deadlines,
        'date',  # Run once immediately
        next_run_time=datetime.now(timezone(TIMEZONE))
    )

    # Add recurring check
    scheduler.add_job(
        check_deadlines,
        'interval',
        hours=1,
        max_instances=10,
    )
    scheduler.start()
    return scheduler


async def check_deadlines():
    try:
        tasks = await get_tasks_due_soon()
        logger.info(f"Tasks found: {tasks}")
        if tasks:
            email_client = EmailClient()
            await email_client.send_notification(tasks)
            logger.info(f"Found {len(tasks)} tasks due soon")
        else:
            logger.info("No tasks due soon")
    except Exception as e:
        logger.error(f"Error checking deadlines: {str(e)}")
