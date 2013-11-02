# coding=utf-8
from copy import deepcopy
from flask.json import jsonify
from flask.wrappers import Response
import json
from flask.views import MethodView
import mimerender
from werkzeug.exceptions import BadRequest
from api.core.exceptions import CannotLogin, DocumentNotValid, CannotDeleteDocument, CannotCreateDocument, CannotModifyDocument


def render_json_exception(exception):
    errors = exception.message
    if isinstance(exception.message, list):
        errors = ','.join(exception.message)
    if not errors:
        errors = exception.description
    return errors

mimerender = mimerender.FlaskMimeRender()
mimerender_json_exception = mimerender.map_exceptions(
    mapping=(
        #(Exception, '500 Internal Server Error'),
        (ValueError, '400 Bad Request'),
        (AttributeError, '400 Bad Request'),

        #
        (BadRequest, '400 Bad Request'),

        # Custom
        (CannotLogin, '400 Bad Request'),
        (DocumentNotValid, '400 Bad Request'),
        (CannotDeleteDocument, '400 Bad Request'),
        (CannotCreateDocument, '400 Bad Request'),
        (CannotModifyDocument, '400 Bad Request')
    ),
    default='json',
    json=render_json_exception
)


def alter_response(response):
    """
    Alter some info:
    - headers['Content-Type']
    - remove Content-Length because old Content-Length correspond to data length without Json format,
    we must remove this to rebuild Content-Length correspond to new data json format
    - Build data with json format
    """

    data = deepcopy(response.data)

    # If response is string then try to convert to Json
    if isinstance(data, str):
        try:
            data = json.loads(data)
        except Exception:
            # If response.data is string but cannot convert to Json then do nothing
            # just keep original value
            pass

    response.headers['Content-Type'] = 'application/json; charset=utf-8'
    del response.headers['Content-Length']

    # Success response
    if response.status_code == 200:
        json_response = {
            'status': response.status,
            'status_code': response.status_code,
            'data': data
        }
    # Error response
    else:
        json_response = {
            'status': response.status,
            'status_code': response.status_code,
            'errors': data
        }

    response.data = json.dumps(json_response)
    return response


class BaseResourceView(MethodView):
    decorators = [mimerender_json_exception]

    def dispatch_request(self, *args, **kwargs):
        resp = super(BaseResourceView, self).dispatch_request(*args, **kwargs)
        if resp is None:
            resp = jsonify({})
        elif isinstance(resp, dict):
            resp = jsonify(resp)
        return resp
