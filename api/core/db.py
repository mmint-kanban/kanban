# coding=utf-8
from pymongo.mongo_client import MongoClient
from ..settings import DB_NAME

class _DbMeta(object):
    def __new__(cls, *args, **kwargs):
        return MongoClient()[DB_NAME]

class Db(object):
    __metaclass__ = _DbMeta