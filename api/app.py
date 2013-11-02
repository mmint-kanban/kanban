# coding=utf-8
from flask.app import Flask
from api.core.views import alter_response

from resources import (
    auth_blueprint, user_blueprint, process_blueprint, ticket_blueprint
)

app = Flask(__name__)


@app.route('/')
def home():
    return 'Kanban API v1'

app.register_blueprint(auth_blueprint, url_prefix='/api')
app.register_blueprint(user_blueprint, url_prefix='/api')
app.register_blueprint(process_blueprint, url_prefix='/api')
app.register_blueprint(ticket_blueprint, url_prefix='/api')


app.after_request(alter_response)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)