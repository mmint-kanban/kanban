# coding=utf-8
from datetime import datetime
from flask.globals import request
from hashlib import md5

from api.core.db import Db
from api.core.model import Model
from api.core.prettifiers import ObjectIdToStr
from api.settings import SESSION_NAME


class AuthModel(Model):
    schema = {
        'userId': {'required': True, 'type': 'string'},
        'ttl': {'required': True, 'type': 'datetime'}
    }

    @staticmethod
    def auth(username, password):
        user = Db.users.find_one({'username': username}, as_class=ObjectIdToStr)
        if user:
            if md5(password).hexdigest() != user.get('password'):
                user = None
            else:
                user['isAuthenticated'] = True
        return user

    @staticmethod
    def login(user):
        if user.get('isAuthenticated'):
            session_id = md5(user.get('username')).hexdigest()
            Db.sessions.find_and_modify(
                query={'_id': session_id},
                update={'$set': {
                    'user': user,
                    'ttl': datetime.now()
                }},
                upsert=True
            )
            return session_id

        return None

    @staticmethod
    def get_current_user():
        session_id = request.cookies.get(SESSION_NAME)
        session = Db.sessions.find_one({'_id': session_id})
        user = None
        if session:
            user = session.get('user')
        return user
