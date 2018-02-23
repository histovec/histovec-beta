#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import yaml as y
from collections import OrderedDict
from multiprocessing import Manager
import os, fnmatch, sys

import log

def init():
	global manager, shared
	manager = Manager()
	shared = manager.dict()

def ordered_load(stream, Loader=y.Loader, object_pairs_hook=OrderedDict):
	class OrderedLoader(Loader):
		pass
	def construct_mapping(loader, node):
		loader.flatten_mapping(node)
		return object_pairs_hook(loader.construct_pairs(node))
	OrderedLoader.add_constructor(
		y .resolver.BaseResolver.DEFAULT_MAPPING_TAG,
		construct_mapping)
	return y.load(stream, OrderedLoader)

def deepupdate(original, update):
	"""
    Recursively update a dict.
    Subdict's won't be overwritten but also updated.
    """
	print(original)
	if (isinstance(original, dict)):
		for key, value in original.items():
		# python3 for key, value in original.items():
			if key not in update:
				update[key] = value
			elif isinstance(value, dict):
				deepupdate(value, update[key])
	return update

def check_conf(cfg,path,source):

	return cfg

def read_conf():
	global conf
	try:
		conf_dir=conf["global"]["conf"]
	except:
		conf_dir=os.environ['conf']

	cfg={"global":{"paths":{}}}
	cfg=read_conf_dir(conf_dir,cfg)
	conf=cfg
	print(conf)

def read_conf_dir(conf_dir,cfg):
	path=os.path.basename(conf_dir)
	cfg["global"]["paths"][path] = {"path": conf_dir,"files":{}}
	for root, dirnames, filenames in os.walk(conf_dir):
		#print root,dirnames,filenames
		subpath=root.replace(conf_dir+"/","") if (conf_dir != root) else ""
		for filename in fnmatch.filter(filenames, '*.yml'):
			conf_file=os.path.join(root, filename)
			filename=os.path.join(subpath,filename)
			cfg["global"]["paths"][path]["files"][filename]="not checked"

			with open(conf_file) as reader:
				try:
					update=ordered_load(reader)
					update=check_conf(update,path,filename)
					cfg=deepupdate(cfg,update)
					cfg["global"]["paths"][path]["files"][filename]="yaml is ok"
				except:
					cfg["global"]["paths"][path]["files"][filename]="yaml is ko - "+log.err()
	return cfg
