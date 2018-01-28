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
from flask import Flask,jsonify,Response, abort,request
from flask_restplus import Resource,Api,reqparse
from werkzeug.utils import secure_filename
from werkzeug.serving import run_simple
from werkzeug.wsgi import DispatcherMiddleware

# matchID imports
import parsers
import log
import config

def allowed_upload_file(filename=None):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in config.conf["global"]["data_extensions"]

def allowed_conf_file(filename=None):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in config.conf["global"]["recipe_extensions"]


config.init()
config.read_conf()

app = Flask(__name__)
api=Api(app,version="0.1",title=os.environ['APP'],description="API in developpement")

app.config['APPLICATION_ROOT']="/"+os.environ['APP']+config.conf["global"]["api"]["prefix"]

@api.route('/conf/', endpoint='conf' )
class Conf(Resource):
	def get(self):
		'''get all configured elements
		Lists all configured elements of the backend, as described in the yaml files :
		- global configuration
		- projects :
		  - datasets
		  - recipes'''
		try:
			config.read_conf()
			return config.conf["global"]
		except:
			return {"error": "problem while reading conf"}

@api.route('/upload/', endpoint='upload')
class Upload(Resource):
	def get(self):
		'''list uploaded resources'''
		return list([filenames for root, dirnames, filenames in os.walk(config.conf["global"]["paths"]["upload"])])[0]

	@api.expect(parsers.upload_parser)
	def post(self):
		'''upload multiple tabular data files, .gz or .txt or .csv'''
		response={"upload_status":{}}
		args = parsers.upload_parser.parse_args()
		for file in args['file']:
			if (allowed_upload_file(file.filename)):
				try:
					file.save(os.path.join(config.conf["global"]["paths"]["upload"], secure_filename(file.filename)))
					response["upload_status"][file.filename]="ok"
				except:
					response["upload_status"][file.filename]=log.err()
			else:
				response["upload_status"][file.filename]="extension not allowed"
		return response

@api.route('/upload/<file>', endpoint='upload/<file>')
@api.doc(parmas={'file': 'file name of a previously uploaded file'})
class actionFile(Resource):
	def get(self,file):
		'''get back uploaded file'''
		filetype="unknown"
		pfile=os.path.join(config.conf["global"]["paths"]["upload"],file)
		try:
			df=pd.read_csv(pfile,nrows=100)
			filetype="csv"
		except:
			pass
		return {"file": file, "type_guessed": filetype}

	def delete(self,file):
		'''deleted uploaded file'''
		try:
			pfile=os.path.join(config.conf["global"]["paths"]["upload"],file)
			os.remove(pfile)
			return {"file": file, "status": "deleted"}
		except:
			api.abort(404,{"file": file, "status": log.err()})


@api.route('/conf/<project>/', endpoint='conf/<project>')
@api.doc(parms={'project': 'name of a project'})
class DirectoryConf(Resource):
	def get(self,project):
		'''get configuration files of a project'''
		config.read_conf()
		if project in list(config.conf["global"]["projects"].keys()):
			return config.conf["global"]["projects"][project]
		else:
			api.abort(404)

	@api.expect(parsers.conf_parser)
	def post(self,project):
		'''(KO) import a zipped project'''
		if (directory != "conf"):
			response={"upload_status":{}}
			args = parsers.conf_parser.parse_args()
			for file in args['file']:
				if (allowed_conf_file(file.filename)):
					try:
						file.save(os.path.join(config.conf["global"]["paths"]["conf"][project], secure_filename(file.filename)))
						response["upload_status"][file.filename]="ok"
					except:
						response["upload_status"][file.filename]=log.err()
				else:
					response["upload_status"][file.filename]="extension not allowed"
				config.read_conf()
				response["yaml_validator"]=config.conf["global"]["projects"][project]
			return response
		else:
			api.abort(403)

	def put(self,project):
		'''create a project'''
		if (project == "conf"):
			api.abort(403)
		elif project in config.conf["global"]["projects"].keys():
			api.abort(400, 'project "{}" already exists'.format(project))
		else:
			try:
				dirname=os.path.join(config.conf["global"]["paths"]["projects"],project)
				os.mkdir(dirname)
				os.mkdir(os.path.join(dirname,'recipes'))
				os.mkdir(os.path.join(dirname,'datasets'))
				config.read_conf()
				return {"message": "{} successfully created".format(project)}
			except:
				api.abort(400,log.err())

	def delete(self,project):
		'''delete a project'''
		if (project == "conf"):
			api.abort(403)
		elif project in config.conf["global"]["projects"].keys():
			response={project: "not deleted"}
			try:
				dirname=os.path.join(config.conf["global"]["paths"]["projects"],project)
				shutil.rmtree(dirname)
				response[project]="deleted"
			except:
				response[project]="deletion failed - "+log.err()
			config.read_conf()
			#response["yaml_validator"]=config.conf["global"]["projects"][project]
			return response
		else:
			api.abort(404)

@api.route('/conf/<project>/<path:file>', endpoint='conf/<project>/<path:file>')
class FileConf(Resource):
	def get(self,project,file):
		'''get a text/yaml configuration file from project'''
		try:
			config.read_conf()
			if (file in config.conf["global"]["projects"][project]["files"]):
				try:
					pfile=os.path.join(config.conf["global"]["projects"][project]["path"],file)
					with open(pfile) as f:
						return Response(f.read(),mimetype="text/plain")
				except:
					api.abort(404)
			else:
				api.abort(404)
		except:
			api.abort(404)

	def delete(self,project,file):
		'''delete a text/yaml configuration file from project'''
		if (project != "conf"):
			if (file in config.conf["global"]["projects"][project]["files"]):
				try:
					pfile=os.path.join(config.conf["global"]["projects"][project]["path"],file)
					os.remove(pfile)
					config.read_conf()
					return jsonify({"conf": project, "file":file, "status": "removed"})
				except:
					api.abort(403)

	@api.expect(parsers.yaml_parser)
	def post(self,project,file):
		'''upload a text/yaml configuration file to a project'''
		if (project != "project"):
			args = parsers.yaml_parser.parse_args()
			filecontent=args['yaml']
			if (allowed_conf_file(file)):
				try:
					test = config.ordered_load(filecontent)
				except:
					api.abort(400,{file: {"saved" : "ko - "+log.err()}})

				try:
					pfile=os.path.join(config.conf["global"]["projects"][project]["path"],file)
					with open(pfile,'w') as f:
						f.write(filecontent.encode("utf-8", 'ignore'))
					response={file: {"saved": "ok"}}
					config.read_conf()
					response[file]["yaml_validator"]=config.conf["global"]["projects"][project]["files"][file]
					return response
				except:
					api.abort(400,{file: {"saved" : "ko - "+log.err()}})
			else:
				api.abort(403)
		else:
			api.abort(403)




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
