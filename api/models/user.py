# coding=utf-8
from bson.objectid import ObjectId
from hashlib import md5
from api.core.db import Db
from api.core.model import Model
from api.core.prettifiers import ObjectIdToStr
from api.core.validator import assert_schema


class UserModel(Model):
    schema = {
        'username': {'required': True, 'type': 'string'},
        'fullName': {'required': True, 'type': 'string'},
        'email':    {'required': True, 'type': 'string'},
        'password': {'required': True, 'type': 'string'},
    }

    @staticmethod
    def register(user):
        user = user.to_dict()
        assert_schema(user, UserModel.schema)
        user['password'] = md5(user['password']).hexdigest()
        Db.users.insert(user)

    @staticmethod
    def search(keyword=None, _id=None, fields=[]):
        # Search by keyword
        if keyword is not None:
            if keyword == '':
                return []
            spec = {'username': {'$regex': keyword}}
        # Search by _id
        elif _id is not None:
            spec = {'_id': ObjectId(_id)}
        # By default, search all users
        else:
            spec = {}

        users = Db.users.find(spec, dict([(f, 1) for f in fields]), as_class=ObjectIdToStr)
        return [u for u in users]

