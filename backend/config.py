from dotenv import load_dotenv
import os

load_dotenv()

class POSTGRES:
    HOST = os.getenv("POSTGRES_HOST")
    DB = os.getenv("POSTGRES_DB")
    PORT = os.getenv("POSTGRES_PORT")
    USER = os.getenv("POSTGRES_USER")
    PASSWORD = os.getenv("POSTGRES_PASSWORD")

class TIMEZONE:
    TZ = os.getenv("TIMEZONE")

class EMAIL:
    list_of_false = {"false", "False", "FALSE", "f", "0", "no", "No", "NO", "n", "off", "Off", "OFF"}
    EMAIL_NOTIFICATIONS = os.getenv("EMAIL_NOTIFICATIONS") not in list_of_false

    SMTP_SERVER = os.getenv("SMTP_SERVER")
    SMTP_PORT = int(os.getenv("SMTP_PORT"))

    SENDER_EMAIL = os.getenv("SENDER_EMAIL")
    SENDER_USERNAME = os.getenv("SENDER_USERNAME")
    SENDER_PASSWORD = os.getenv("SENDER_PASSWORD")

    # !!! note: this should be depreciated and replaced with an automated system that fetches emails from the database
    RECIPIENT_EMAILS = os.getenv("RECIPIENT_EMAILS")