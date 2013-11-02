# coding=utf-8
from flask import request
from flask.blueprints import Blueprint
from flask.json import jsonify
from flask.wrappers import Response
from api.core.db import Db

from api.core.exceptions import CannotLogin
from api.core.views import BaseResourceView
from api.models.auth import AuthModel
from api.settings import SESSION_NAME


class AuthResource(BaseResourceView):
    """ Resource for authentication """

    def get(self):
        """ Get current user """

        user = AuthModel.get_current_user()
        return {'user': user}

    def post(self):
        """ Login user """

        user = AuthModel.auth(request.form.get('username'), request.form.get('password'))
        if user:
            session_id = AuthModel.login(user)
            resp = jsonify({'user': user})
            resp.set_cookie(SESSION_NAME, session_id)
            return resp
        else:
            raise CannotLogin('Cannot login user. Please verify your information.')

    def delete(self):
        """ Logout user """

        resp = Response()
        session_id = request.cookies.get(SESSION_NAME)
        if session_id:
            Db.sessions.remove({'_id': session_id})
            resp.set_cookie(SESSION_NAME, '', expires=0)
        return resp

auth_blueprint = Blueprint('auth_blueprint', __name__)
auth_view = AuthResource.as_view('auth_view')

auth_blueprint.add_url_rule('/auth', 'auth', auth_view)
