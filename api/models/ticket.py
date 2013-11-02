# coding=utf-8
from bson.objectid import ObjectId
from datetime import datetime

from api.core.db import Db
from api.core.exceptions import  CannotCreateDocument, CannotDeleteDocument
from api.core.model import Model
from api.core.prettifiers import ObjectIdToStr
from api.core.validator import assert_schema

class TicketModel(Model):
    schema = {
        '_id' : {'required': True, 'type': 'objectid'},
        'userId': {'required': False, 'type': 'string'},
        'title': {'required': True, 'type': 'string'},
        'description': {'required': True, 'type': 'string'},
        'createdAt': {'required': True, 'type': 'datetime'},
        'modifiedAt': {'required': True, 'type': 'datetime'},
    }

    @staticmethod
    def modify(process_id, _id, spec={}):
        assert_schema(document=spec, schema=TicketModel.schema)

        return Db.processes.find_and_modify(
            query={'_id': ObjectId(process_id), 'tickets._id': _id},
            update={'$set': {'tickets.$': spec}},
            new=True
        )

    @staticmethod
    def add_to_process(process_id, ticket):
        ticket['_id'] = ObjectId(ticket.get('_id')) or ObjectId()
        ticket['createdAt'] = datetime.utcnow()
        ticket['modifiedAt'] = datetime.utcnow()
        assert_schema(document=ticket, schema=TicketModel.schema)

        res = Db.processes.find_and_modify(
            query={'_id': ObjectId(process_id)},
            update={'$push': {'tickets': ticket}},
            new=True,
            as_class=ObjectIdToStr
        )

        if res:
            ticket['_id'] = str(ticket['_id'])
            return ticket
        else:
            raise CannotCreateDocument('Cannot add ticket to process.')


    @staticmethod
    def delete_from_process(process_id, ticket_id):
        if not process_id or not ticket_id:
            raise CannotDeleteDocument('Cannot delete document. Please verify processId or ticketId.')

        res = Db.processes.find_and_modify(
            query={'_id': ObjectId(process_id)},
            update={'$pull': {'tickets': {'_id': ObjectId(ticket_id)}}
        })

        if res:
            return {}
        else:
            raise CannotDeleteDocument('Unable to delete the ticket. Maybe ticker does not exist in this process.')

    @staticmethod
    def move_to_process(old_process_id, new_process_id, ticket):
        # To see: db.test.find({"shapes.color": "red"}, {_id: 0, 'shapes.$': 1});

        # Delete from old process
        TicketModel.delete_from_process(old_process_id, ticket['_id'])
        # Add to new process
        ticket = TicketModel.add_to_process(new_process_id, ticket)

        return ticket
