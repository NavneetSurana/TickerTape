import os
from dotenv import load_dotenv
load_dotenv()
dbName = os.getenv("DB_NAME_TT")
user = os.getenv("DB_USER")
password = os.getenv("DB_PASSWORD")
host = os.getenv("DB_HOST")
port = os.getenv("DB_PORT")
url = os.getenv("DB_URL")
backupPath = os.getenv("DB_BACKUP_PATH")
authDb = os.getenv("AUTH_DB")
