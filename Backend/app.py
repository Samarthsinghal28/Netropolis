from flask import Flask, render_template, request, session, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
from dotenv import load_dotenv
import os

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
db = SQLAlchemy(app)

CORS(app, supports_credentials=True)

# Import and register the auth blueprint
from .auth import auth_bp
app.register_blueprint(auth_bp, url_prefix='/auth')

# SocketIO setup
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

# Example route
@app.route('/')
def index():
    return "Welcome to the Flask App!"

if __name__ == '__main__':
    socketio.run(app, debug=True)
