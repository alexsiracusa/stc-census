from apscheduler.schedulers.asyncio import AsyncIOScheduler
from email.mime.text import MIMEText
from dotenv import load_dotenv
from pytz import timezone
import smtplib
import os

from ..database.data import get_tasks_due_soon


parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(parent_dir, '.env'))

TIMEZONE = os.getenv('TIMEZONE')
SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')

SMTP_USER  = os.getenv('SMTP_USERNAME')
SMTP_PASS  = os.getenv('SMTP_PASSWORD')
NOTIF_EMAIL = os.getenv('NOTIFICATION_EMAIL')

class EmailClient:
    def send_notification(self, tasks: list):
        msg = MIMEText(
            f"Tasks nearing deadline:\n" +
            "\n".join([f"{t['name']} (ID:{t['id']}, Project:{t['project_id']})"
                      for t in tasks])
        )
        msg['Subject'] = 'Task Deadline Alert'
        msg['From'] = SMTP_USER
        msg['To'] = NOTIF_EMAIL

        with smtplib.SMTP(SMTP_SERVER, int(SMTP_PORT)) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.send_message(msg)

def setup_scheduler():
    scheduler = AsyncIOScheduler(timezone=timezone(TIMEZONE))
    scheduler.add_job(
        check_deadlines,
        'interval',
        hours=1,
        max_instances=10,
    )
    scheduler.start()


async def check_deadlines():
    tasks = await get_tasks_due_soon()
    print("AHHHHHHHHHHHHHHHHHHHHHHHHHHH")
    print(tasks)
    if tasks:
        EmailClient().send_notification(tasks)
