FROM python:3.8

RUN pip install flask

COPY . .

EXPOSE 5000

ENTRYPOINT ["flask","run", "--host=0.0.0.0"]
