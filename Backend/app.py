from flask import Flask, render_template, request, session, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
from dotenv import load_dotenv
import os

# Import the authentication blueprint
from auth import auth_bp

load_dotenv()

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db = SQLAlchemy(app)

CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")

# Register the authentication blueprint
app.register_blueprint(auth_bp, url_prefix='/auth')

@socketio.on('connect')
def handle_connect():
    print('Client connected to WebSocket')

@socketio.on('Disconnect')
def handle_disconnect():
    print('Client disconnected to WebSocket')

# Existing WebSocket event handlers...

if __name__ == '__main__':
    socketio.run(app, host='0.0.0.0', port=int(os.environ.get('PORT',5000)), allow_unsafe_werkzeug=True)
