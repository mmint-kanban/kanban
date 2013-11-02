# coding=utf-8
from flask.blueprints import Blueprint
from flask.globals import request
from werkzeug.exceptions import BadRequest
from api.core.db import Db
from api.core.utils import request_data_to_dict

from api.core.views import BaseResourceView
from api.models.ticket import TicketModel

class TicketResource(BaseResourceView):
    """ Resource for ticket """

    def post(self):
        data = request_data_to_dict(request.form)

        ticket = TicketModel.add_to_process(data.get('processId'), data.get('ticket'))
        return {'ticket': ticket}

    def delete(self, _id):
        res = TicketModel.delete_from_process(request.args.get('processId'), _id)
        return {'ticket': res}

    def patch(self, _id):
        data = request_data_to_dict(request.form)

        # Move ticket to another process
        if 'oldProcessId' in data and 'newProcessId' in data:
            ticket = TicketModel.move_to_process(
                old_process_id=data.get('oldProcessId'),
                new_process_id=data.get('newProcessId'),
                ticket=data.get('ticket')
            )
        # Edit existing ticket
        else:
            ticket = TicketModel.modify(data.get('processId'), _id, data.get('ticket'))

        return {'ticket': ticket}


ticket_blueprint = Blueprint('ticket_blueprint', __name__)
ticket_view = TicketResource.as_view('ticket_view')

ticket_blueprint.add_url_rule('/tickets', 'tickets', ticket_view)
ticket_blueprint.add_url_rule('/tickets/<string:_id>', 'ticket', ticket_view)

