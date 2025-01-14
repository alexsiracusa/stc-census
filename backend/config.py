from dotenv import load_dotenv
import os

load_dotenv()

class POSTGRES:
    HOST = os.getenv("POSTGRES_HOST")
    DB = os.getenv("POSTGRES_DB")
    PORT = os.getenv("POSTGRES_PORT")
    USER = os.getenv("POSTGRES_USER")
    PASSWORD = os.getenv("POSTGRES_PASSWORD")

