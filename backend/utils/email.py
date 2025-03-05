from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import logging
import smtplib
import ssl

from ..config import EMAIL

logger = logging.getLogger(__name__)

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
        email = task.get('task_person_email') or task.get('project_person_email')

        if task.get('task_person_email'):
            first_name = task.get('task_person_first_name') or "FIRSTNAME"
            last_name = task.get('task_person_last_name') or "LASTNAME"
        else:
            first_name = task.get('project_person_first_name') or "FIRSTNAME"
            last_name = task.get('project_person_last_name') or "LASTNAME"

        return email, first_name, last_name

    def format_email_message(self, tasks: list, first_line: str) -> str:
        task_lines = []
        for t in tasks:
            _, first_name, last_name = self.get_person_info(t)
            task_lines.append(
                f"{t['name']} (ID:{t['id']}, Project:{t['project_id']}, Assigned to: {first_name} {last_name})"
            )
        return f"{first_line}<br>" + "<br>".join(task_lines)

    async def send_notification(self, tasks: list, email_subject: str, first_line: str) -> None:
        if not EMAIL.EMAIL_NOTIFICATIONS:
            logger.info("Notifications not sent, since notifications are disabled.")
            return

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
            logger.error(f"Error: Missing email information for tasks with IDs: {task_ids}. These notifications were not sent.")

        if not valid_tasks:
            logger.error("No valid tasks with email information. No notifications sent.")
            return

        for task in valid_tasks:
            email_recipient, _, _ = self.get_person_info(task)
            cc = []
            team_alias = task.get('project_team_email_alias')
            if team_alias and team_alias.strip():
                cc.append(team_alias)

            try:
                # Format email message for this task
                email_message = self.format_email_message([task], first_line)

                message = MessageSchema(
                    subject=email_subject,
                    recipients=[email_recipient],
                    cc=cc,
                    body=email_message,
                    subtype="html"
                )

                fm = FastMail(conf)
                logger.info(f"Sending email notification to {email_recipient} (CC: {cc}) for task {task['id']}...")
                await fm.send_message(message)
                logger.info(f"Email notification sent successfully for task {task['id']}")
            except ssl.SSLError as ssl_err:
                logger.error(f"SSL/TLS error for task {task['id']}: {ssl_err}")
            except smtplib.SMTPAuthenticationError as auth_err:
                logger.error(f"Authentication failed for task {task['id']}: {auth_err}")
            except smtplib.SMTPException as smtp_err:
                logger.error(f"SMTP error sending email for task {task['id']}: {smtp_err}")
            except Exception as e:
                logger.error(f"General error sending email notification for task {task['id']}: {str(e)}")
