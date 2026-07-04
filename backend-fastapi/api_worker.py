from celery import Celery

app = Celery(
    "api_worker",
    broker="redis://localhost",
    backend="db+mysql+pymysql://root@127.0.0.1:3306/ekada",
    include=["services.tasks"]
)

from services.tasks import *

if __name__ == "__main__":
    result = match_data.delay("LCK")
    print(result)