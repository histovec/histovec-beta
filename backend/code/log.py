#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import yaml as y
from collections import OrderedDict
import os, fnmatch, sys, datetime
try:
	from cStringIO import StringIO
except ImportError:
	from io import StringIO
	
import config

def err():
	#exc_info=sys.exc_info()
	exc_type, exc_obj, exc_tb = sys.exc_info()
	return "{} : {} line {}".format(str(exc_type),exc_obj,exc_tb.tb_lineno)
	#return "{}".format(traceback.print_exception(*exc_info))

def WHERE( back = 0 ):
    frame = sys._getframe( back + 1 )
    return "{}".format(frame.f_code.co_name)
    # return "%s/%s %s()" % ( os.path.basename( frame.f_code.co_filename ),
                        # frame.f_lineno, frame.f_code.co_name )

class Log(object):
	def __init__(self,name=None,test=False):
		self.name=name
		self.chunk="init"
		self.test=test
		self.start=datetime.datetime.now()
		self.writer=sys.stdout
		if (self.test==True):
			self.writer=StringIO()
			self.level=2
		else:
			if ("log" in config.conf["global"].keys()):
				try:
					self.dir=config.conf["global"]["log"]["dir"]
				except:
					self.dir=""
				self.file="{}./{}-{}.log".format(self.dir,datetime.datetime.now().isoformat(),self.name)

				try :
					self.writer=open(self.file,"w+")
				except:
					self.writer=sys.stdout

			try:
				self.level=config.conf["global"]["log"]["level"]
			except:
				self.level=1

		try:
			self.verbose=config.conf["global"]["log"]["verbose"]

		except:
			self.verbose=False

	def write(self,msg=None,error=None,exit=False,level=1):
		try:
			self.writer
		except:
			return
		if (type(self.chunk) ==  int):
			prefix="chunk "
		else:
			prefix=""

		if (level<=self.level):
			t = datetime.datetime.now()
			d = (t-self.start)
			if (error != None):
				if (msg != None):
					fmsg="{} - {} - {}{} : {} - Ooops: {} - {}".format(t,d,prefix,self.chunk,WHERE(1),msg,error)
				else:
					fmsg="{} - {} - {}{} : {} - Ooops: {}".format(t,d,prefix,self.chunk,WHERE(1),error)
			else:
				fmsg="{} - {} - {}{} : {} - {}".format(t,d,prefix,self.chunk,WHERE(1),msg)
			try:
				if (self.verbose==True):
					print(fmsg)
			except:
				pass

			self.writer.write(fmsg+"\n")
			self.writer.flush()
			if (exit):
				#os._exit(1)
				sys.exit(fmsg)
			return fmsg

