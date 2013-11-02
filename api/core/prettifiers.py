# coding=utf-8
from bson.objectid import ObjectId


class ObjectIdToStr(dict):
    def __setitem__(self, key, value):
        if isinstance(value, ObjectId):
            value = str(value)
        super(ObjectIdToStr, self).__setitem__(key, value)
