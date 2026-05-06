from celery import Celery

app = Celery(
    "api_worker",
    broker="redis://localhost",
    backend="db+mysql://root@127.0.0.1:3306/ekada",
    include=["services.tasks"]
)

if __name__ == "__main__":
    app.start()