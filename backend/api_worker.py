from celery import Celery
import os

app = Celery(
    "api_worker",
    broker=os.getenv("CELERY_BROKER_URL", "redis://localhost"),
    backend=os.getenv("CELERY_RESULT_BACKEND", "db+mysql+pymysql://root@127.0.0.1:3306/ekada"),
    include=["services.tasks"]
)

from services.tasks import *

if __name__ == "__main__":
    result = match_data.delay("LEC")
    print(result)