#!/usr/bin/env python3
# -*- coding: utf-8 -*-

### import basics
import sys, os, io, time, traceback, fnmatch, re, datetime, hashlib, unicodedata, shutil

import traceback
import json
import itertools
import operator
import simplejson
from collections import OrderedDict

### api dependecies
from flask import Flask, jsonify, Response, abort, request, send_file
from flask_restplus import Resource,Api,reqparse
from werkzeug.utils import secure_filename
from werkzeug.serving import run_simple
from werkzeug.wsgi import DispatcherMiddleware

# matchID imports
import parsers
import log
import config
import pandas as pd

def allowed_upload_file(filename=None):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in config.conf["global"]["data_extensions"]


config.init()
config.read_conf()

app = Flask(__name__)
api=Api(app,version="0.1",title=os.environ['APP'],description="API in developpement")

app.config['APPLICATION_ROOT']="/"+os.environ['APP']+config.conf["global"]["api"]["prefix"]


@api.route('/download/<file>', endpoint='download/<file>')
@api.doc(parmas={'file': 'file name of a previously uploaded file'})
class Download(Resource):
	def get(self,file):
		'''download your uploaded file'''
		available=False
		pfile=os.path.join(config.conf["global"]["paths"]["upload"],file)
		filePreview = ''
		try:
			# df=pd.read_csv(pfile,nrows=100)
			# print(df)
			# filePreview = str(df)[:50] + '...'
			# available=True
			return send_file(pfile)
		except:
			return {"error": "problem while sending you the file"}
		# return {"filePath": pfile, 'filePreview':filePreview , "available": available}
		# return send_from_directory(directory=config.conf["global"]["paths"]["upload"],filename=file)
		# return send_file(pfile,mimetype='text/csv')


@api.route('/conf/', endpoint='conf' )
class Conf(Resource):
	def get(self):
		'''get configuration'''
		try:
			config.read_conf()
			return config.conf["global"]
		except:
			return {"error": "problem while reading conf"}

@api.route('/uploaded/', endpoint='uploaded')
class Uploaded(Resource):
	def get(self):
		'''list of uploaded resources'''
		return list([filenames for root, dirnames, filenames in os.walk(config.conf["global"]["paths"]["upload"])])[0]

@api.route('/uploadone/', endpoint='uploadone')
class UploadOne(Resource):
	@api.expect(parsers.upload_parser2)
	def post(self):
		'''upload one file'''
		response={"upload_status":{}}
		args = parsers.upload_parser2.parse_args()
		if (allowed_upload_file(args['in_file'].filename)):
			try:
				args['in_file'].save(os.path.join(config.conf["global"]["paths"]["upload"], secure_filename(args['in_file'].filename)))
				response["upload_status"][args['in_file'].filename]="ok"
			except:
				response["upload_status"][args['in_file'].filename]=log.err()
		else:
			response["upload_status"][args['in_file'].filename]="extension not allowed"
		return response

@api.route('/uploadmany/', endpoint='uploadmany')
class UploadMany(Resource):
	@api.expect(parsers.upload_parser)
	def post(self):
		'''upload many files at once'''
		response={"upload_status":{}}
		args = parsers.upload_parser.parse_args()
		for fileEntity in args['file']:
			if (allowed_upload_file(fileEntity.filename)):
				try:
					fileEntity.save(os.path.join(config.conf["global"]["paths"]["upload"], secure_filename(fileEntity.filename)))
					response["upload_status"][fileEntity.filename]="ok"
				except:
					response["upload_status"][fileEntity.filename]=log.err()
			else:
				response["upload_status"][fileEntity.filename]="extension not allowed"
		return response

@api.route('/delete/<file>', endpoint='delete/<file>')
@api.doc(parmas={'file': 'file name of a previously uploaded file'})
class actionFile(Resource):
	def delete(self,file):
		'''deleted uploaded file'''
		try:
			pfile=os.path.join(config.conf["global"]["paths"]["upload"],file)
			os.remove(pfile)
			return {"file": file, "status": "deleted"}
		except:
			api.abort(404,{"file": file, "status": log.err()})

# end original





if __name__ == '__main__':
	config.read_conf()
	app.config['DEBUG'] = config.conf["global"]["api"]["debug"]

	config.log=log.Log("main")

	# recipe="dataprep_snpc"
	# r=Recipe(recipe)
	# r.init()
	# r.run()

    # Load a dummy app at the root URL to give 404 errors.
    # Serve app at APPLICATION_ROOT for localhost development.
	application = DispatcherMiddleware(Flask('dummy_app'), {
		app.config['APPLICATION_ROOT']: app,
	})
	run_simple(config.conf["global"]["api"]["host"], config.conf["global"]["api"]["port"], application, processes=config.conf["global"]["api"]["processes"], use_reloader=config.conf["global"]["api"]["use_reloader"])
