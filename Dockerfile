FROM python:3.8 AS req
WORKDIR /workdir
RUN python3 -m pip install pipenv

COPY Pipfile* ./
RUN python3 -m pipenv lock --requirements > requirements.txt

FROM python:3.8 as srv
WORKDIR /workdir
COPY --from=req /workdir/requirements.txt ./requirements.txt
RUN python3 -m pip install -r requirements.txt

COPY . .

EXPOSE 5000

CMD python3 -m flask run --host=0.0.0.0
