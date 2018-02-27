import werkzeug
from flask_restplus import reqparse
from werkzeug.datastructures import FileStorage


conf_parser = reqparse.RequestParser()
conf_parser.add_argument('file', location='files',
                           type=FileStorage, action='append', required=True, help='yaml file')

yaml_parser = reqparse.RequestParser()
yaml_parser.add_argument('yaml',
                           type=str, required=True, help='yaml text')

upload_parser = reqparse.RequestParser()
upload_parser.add_argument('file', location='files',
                           type=FileStorage, action='append', required=True, help='files : csv, ... For test, use POSTMAN because swagger does not work')
live_parser = reqparse.RequestParser()
live_parser.add_argument('file', location='files',
                           type=FileStorage, required=True, help='data file : csv, ...')

upload_parser2 = reqparse.RequestParser()
upload_parser2.add_argument('in_file', location='files',
                           type=FileStorage, required=True, help='csv, ...')
