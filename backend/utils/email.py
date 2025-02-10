from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import logging
import smtplib
import ssl

from ..config import EMAIL

logger = logging.getLogger(__name__)

email_recipients = [EMAIL.RECIPIENT_EMAILS]
# !!! should replace this with something that fetches the relevant emails from the database
# sidenote: the emails fetched should be related to the projects and tasks at-hand;
# i.e., unrelated users should not have their emails fetched

# Email configuration
conf = ConnectionConfig(
    MAIL_USERNAME=EMAIL.SENDER_EMAIL,
    MAIL_PASSWORD=EMAIL.SENDER_PASSWORD,
    MAIL_FROM=EMAIL.SENDER_EMAIL,
    MAIL_PORT=EMAIL.SMTP_PORT,
    MAIL_SERVER=EMAIL.SMTP_SERVER,
    MAIL_STARTTLS=True,
    MAIL_SSL_TLS=False,
    USE_CREDENTIALS=True,
    VALIDATE_CERTS=True
)


class EmailClient:
    async def send_notification(self, tasks: list) -> None:
        if not EMAIL.EMAIL_NOTIFICATIONS:
            logger.info("Notifications not sent, since notifications are disabled.")
            return
        try:
            # Construct an HTML body listing the tasks
            body = "Tasks nearing deadline:<br>" + "<br>".join(
                [f"{t['name']} (ID:{t['id']}, Project:{t['project_id']})" for t in tasks]
            )
            message = MessageSchema(
                subject="Task Deadline Alert",
                recipients=email_recipients,
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
