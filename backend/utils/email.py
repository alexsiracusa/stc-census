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

    def get_person_info(self, task: dict) -> tuple:
        """
        Get the appropriate person's email and name information from the task.
        Uses task_person info if available, otherwise falls back to project_person info.
        :param task: task dictionary
        :return: tuple of (email, first_name, last_name)
        """
        # Use task person's email if available, otherwise use project person's email
        email = task.get('task_person_email') or task.get('project_person_email')

        # Get appropriate first name, with fallback to "FIRSTNAME" if missing
        if task.get('task_person_email'):
            first_name = task.get('task_person_first_name') or "FIRSTNAME"
            last_name = task.get('task_person_last_name') or "LASTNAME"
        else:
            first_name = task.get('project_person_first_name') or "FIRSTNAME"
            last_name = task.get('project_person_last_name') or "LASTNAME"

        return (email, first_name, last_name)

    def format_email_message(self, tasks: list, first_line: str) -> str:
        """
        Format the email message to be sent for a list of tasks.
        :param tasks: list of tasks with task and project person information
        :param first_line: first line of the email message
        :return: formatted email message
        """
        task_lines = []
        for t in tasks:
            _, first_name, last_name = self.get_person_info(t)
            task_lines.append(
                f"{t['name']} (ID:{t['id']}, Project:{t['project_id']}, Assigned to: {first_name} {last_name})"
            )

        return f"{first_line}<br>" + "<br>".join(task_lines)

    async def send_notification(self, tasks: list, email_subject: str, first_line: str) -> None:
        """
        Send an email notification to the recipients based on the tasks.
        :param tasks: list of tasks containing recipient information
        :param email_subject: subject of the email
        :param first_line: first line of the email message
        :return: None
        """
        if not EMAIL.EMAIL_NOTIFICATIONS:
            logger.info("Notifications not sent, since notifications are disabled.")
            return

        # Check tasks for missing project person emails when task person email is also missing
        invalid_tasks = []
        valid_tasks = []

        for task in tasks:
            email, _, _ = self.get_person_info(task)
            if not email:
                invalid_tasks.append(task)
            else:
                valid_tasks.append(task)

        if invalid_tasks:
            task_ids = [t['id'] for t in invalid_tasks]
            error_msg = f"Error: Missing email information for tasks with IDs: {task_ids}. These notifications were not sent."
            logger.error(error_msg)

        if not valid_tasks:
            logger.error("No valid tasks with email information. No notifications sent.")
            return

        # Extract unique email addresses from the valid tasks
        email_recipients = []
        for task in valid_tasks:
            email, _, _ = self.get_person_info(task)
            if email and email not in email_recipients:
                email_recipients.append(email)

        try:
            # Format the email message
            email_message = self.format_email_message(valid_tasks, first_line)

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
