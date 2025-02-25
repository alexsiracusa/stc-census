from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import logging
import smtplib
import ssl

from ..config import EMAIL

logger = logging.getLogger(__name__)

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

    def format_email_message(self, tasks: list, first_line: str) -> str:
        """
        Format the email message to be sent for a list of tasks.
        :param tasks: list of tasks of the form {'id': int, 'name': str, 'project_id': int, 'email': str, 'first_name': str, 'last_name': str}
        :param first_line: first line of the email message
        :return: formatted email message
        """
        return f"{first_line}<br>" + "<br>".join(
            [f"{t['name']} (ID:{t['id']}, Project:{t['project_id']}, Assigned to: {t['first_name']} {t['last_name']})"
             for t in tasks]
        )

    async def send_notification(self, tasks: list, email_subject: str, first_line: str) -> None:
        """
        Send an email notification to the recipients based on the tasks.
        :param tasks: list of tasks containing recipient email information
        :param email_subject: subject of the email
        :param first_line: first line of the email message
        :return: None
        """
        if not EMAIL.EMAIL_NOTIFICATIONS:
            logger.info("Notifications not sent, since notifications are disabled.")
            return

        # Extract unique email addresses from the tasks
        email_recipients = list(set([task['email'] for task in tasks if 'email' in task and task['email']]))

        if not email_recipients:
            logger.warning("No valid email recipients found in tasks. Notification not sent.")
            return

        try:
            # Format the email message
            email_message = self.format_email_message(tasks, first_line)

            # Construct an HTML body listing the tasks
            message = MessageSchema(
                subject=email_subject,
                recipients=email_recipients,
                body=email_message,
                subtype="html"
            )

            fm = FastMail(conf)
            logger.info(f"Sending email notification to {len(email_recipients)} recipients...")
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
