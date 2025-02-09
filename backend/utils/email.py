from apscheduler.schedulers.asyncio import AsyncIOScheduler
from email.mime.text import MIMEText
from dotenv import load_dotenv
from pytz import timezone
from datetime import datetime
import smtplib
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


class EmailClient:
    def send_notification(self, tasks: list):
        try:
            msg = MIMEText(
                f"Tasks nearing deadline:\n" +
                "\n".join([f"{t['name']} (ID:{t['id']}, Project:{t['project_id']})"
                           for t in tasks])
            )
            msg['Subject'] = 'Task Deadline Alert'
            msg['From'] = SMTP_USER
            msg['To'] = NOTIF_EMAIL

            print(f'AHHHHHHHHHHHHHHHHH msg:\n{msg}')

            with smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT)) as server:
                print('ahhhhhhhhhhhhh smtp starting')
                server.starttls()
                print('ahhhhhhhhhhhhh start tls done')
                server.login(SMTP_USER, SMTP_PASS)
                print('ahhhhhhhhhhhhh login done')
                server.send_message(msg)
                logger.info("Email notification sent successfully")
                print('ahhhhhhhhhhhhh 44444444444444')
        except smtplib.SMTPException as e:
            logger.error(f"SMTP error occurred: {str(e)}")
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
        print(f'AHHHHHHHHHHH tasks:\n{tasks}')
        if tasks:
            EmailClient().send_notification(tasks)
            logger.info(f"Found {len(tasks)} tasks due soon")
        else:
            logger.info("No tasks due soon")
    except Exception as e:
        logger.error(f"Error checking deadlines: {str(e)}")
