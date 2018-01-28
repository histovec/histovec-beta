FROM python:3
ARG proxy
ARG app_path
ARG app_name
ENV APP $app_name
ENV conf $app_path/conf
RUN pip install `echo $proxy | sed 's/\(\S\S*\)/--proxy \1/'` simplejson Flask flask_restplus PyYAML elasticsearch Werkzeug sqlalchemy psycopg2
 
RUN mkdir -p $app_path/code $app_path/conf /log

WORKDIR $app_path

RUN echo $app_path/code

VOLUME $app_path/code
VOLUME $app_path/conf
VOLUME /log

EXPOSE 8081

CMD ["./code/api.py"]



