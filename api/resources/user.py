# coding=utf-8
from flask.blueprints import Blueprint
from flask.globals import request

from api.core.views import BaseResourceView
from api.models.user import UserModel


class UserResource(BaseResourceView):
    """ Resource for authentication """

    def get(self):
        # Search user
        users = UserModel.search(
            keyword=request.args.get('keyword'),
            fields=('username', '_id')
        )
        return {'users': users}

    def post(self, _id=None):
        UserModel.register(request.form)
        return 'ok'

user_blueprint = Blueprint('user_blueprint', __name__)
user_view = UserResource.as_view('user_view')

user_blueprint.add_url_rule('/users', 'users', user_view)
user_blueprint.add_url_rule('/users/<string:_id>', 'user', user_view)

