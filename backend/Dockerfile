FROM python:3
ARG proxy
ARG app_path
ARG app_name
ENV APP $app_name
ENV conf $app_path/conf
RUN pip install `echo $proxy | sed 's/\(\S\S*\)/--proxy \1/'` simplejson Flask flask_restplus PyYAML Werkzeug psycopg2

RUN mkdir -p $app_path/code $app_path/conf /log $app_path/upload

WORKDIR $app_path

EXPOSE 8081

CMD ["./code/api.py"]
