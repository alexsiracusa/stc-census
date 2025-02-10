from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from dotenv import load_dotenv
import logging
import smtplib
import ssl
import os

# Environment setup
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(parent_dir, '.env'))

# Environment variables
SEND_NOTIFICATIONS = os.getenv('SEND_NOTIFICATIONS')  # boolean

SMTP_SERVER = os.getenv('SMTP_SERVER')
SMTP_PORT = os.getenv('SMTP_PORT')
SMTP_USER = os.getenv('SENDER_EMAIL')
SMTP_PASS = os.getenv('SENDER_EMAIL_PASS')
NOTIF_EMAIL = os.getenv('RECIPIENT_EMAIL')

logger = logging.getLogger(__name__)

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=SMTP_USER,
    MAIL_PASSWORD=SMTP_PASS,
    MAIL_FROM=SMTP_USER,
    MAIL_PORT=int(SMTP_PORT),
    MAIL_SERVER=SMTP_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


class EmailClient:
    async def send_notification(self, tasks: list):
        if not SEND_NOTIFICATIONS:
            logger.info("Notifications not sent, since notifications are disabled.")
            return
        try:
            # Construct an HTML body listing the tasks
            body = "Tasks nearing deadline:<br>" + "<br>".join(
                [f"{t['name']} (ID:{t['id']}, Project:{t['project_id']})" for t in tasks]
            )
            message = MessageSchema(
                subject="Task Deadline Alert",
                recipients=[NOTIF_EMAIL],
                body=body,
                subtype="html"
            )
            fm = FastMail(conf)
            logger.info("Sending email notification...")
            await fm.send_message(message)
            logger.info("Email notification sent successfully")
        except ssl.SSLError as ssl_err:
            logger.error(f"SSL/TLS error: {ssl_err}")
        except smtplib.SMTPAuthenticationError as auth_err:
            logger.error(f"Authentication failed: {auth_err}")
        except smtplib.SMTPException as smtp_err:
            logger.error(f"SMTP error sending email: {smtp_err}")
        except Exception as e:
            logger.error(f"General error sending email notification: {str(e)}")


