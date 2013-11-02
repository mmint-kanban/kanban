# coding=utf-8
from flask.blueprints import Blueprint
from flask.globals import request
from time import sleep
from api.core.db import Db

from api.core.views import BaseResourceView
from api.models.process import ProcessModel

class ProcessResource(BaseResourceView):
    """ Resource for process """

    def get(self):
        processes = ProcessModel.query(spec={})
        return {'processes': [p for p in processes]}

    def post(self):
        process = request.form.to_dict()
        process_id = ProcessModel.create(process)
        return {'process': {'_id': process_id}}

    def delete(self, _id):
        ProcessModel.delete(_id)
        return {'process': {}}

    def patch(self, _id):
        process = request.form.to_dict()
        # Get id of process will be updated
        _id = process['_id']
        # Delete _id in process for update process without touching _id
        del process['_id']
        process = ProcessModel.modify(_id, process)
        return {'process': process}


process_blueprint = Blueprint('process_blueprint', __name__)
process_view = ProcessResource.as_view('process_view')

process_blueprint.add_url_rule('/processes', 'processes', process_view)
process_blueprint.add_url_rule('/processes/<string:_id>', 'process', process_view)

