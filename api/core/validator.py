# coding=utf-8
from bson.objectid import ObjectId
import cerberus
from cerberus.errors import ERROR_BAD_TYPE

from .exceptions import DocumentNotValid

class KbValidator(cerberus.Validator):
    def _validate_type_objectid(self, field, value):
       """ Enables validation for `objectid` schema attribute.

       :param field: field name.
       :param value: field value.
       """
       if not isinstance(value, ObjectId):
           self._error(ERROR_BAD_TYPE % (field, 'ObjectId'))

def assert_schema(document, schema):
    v = KbValidator(schema)
    if not v.validate(document):
        raise DocumentNotValid(v.errors)



