# coding=utf-8
from bson.objectid import ObjectId
from datetime import datetime
from flask.globals import request
from hashlib import md5
from pymongo import DESCENDING, ASCENDING

from api.core.db import Db
from api.core.model import Model
from api.core.prettifiers import ObjectIdToStr
from api.core.validator import assert_schema
from api.settings import SESSION_NAME
from ticket import TicketModel

class ProcessModel(Model):
    schema = {
        'name': {'required': True, 'type': 'string'},
        'description': {'required': True, 'type': 'string'},
        'order': {'required': True, 'type': 'integer'},
        'class': {'required': True, 'type': 'string', 'allowed': ["default", "primary", "danger", "warning", "success"]},
        'tickets': {'required': True, 'type': 'list', 'items': TicketModel.schema}
    }

    @staticmethod
    def get(_id):
        return Db.processes.find_one({'_id': ObjectId(_id)})

    @staticmethod
    def create(process):
        if 'order' in process:
            process['order'] = int(process['order'])
        # Initialize empty ticket list
        process['tickets'] = []
        assert_schema(document=process, schema=ProcessModel.schema)

        process_id = Db.processes.insert(process)
        return str(process_id)

    @staticmethod
    def query(spec={}):
        processes = Db.processes.find(spec, sort=[('order', ASCENDING)], as_class=ObjectIdToStr)
        return [p for p in processes]

    @staticmethod
    def delete(_id):
        Db.processes.remove({'_id': ObjectId(_id)})
        return {}

    @staticmethod
    def modify(_id, spec={}):
        if 'order' in spec:
            spec['order'] = int(spec['order'])

        return Db.processes.find_and_modify(
            query={'_id': ObjectId(_id)},
            update={'$set': spec},
            new=True,
            as_class=ObjectIdToStr
        )
