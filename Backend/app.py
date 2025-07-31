from flask import Flask, render_template, request, session, redirect, jsonify
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from flask_socketio import SocketIO, emit
from datetime import datetime
from dotenv import load_dotenv
import os

# Load environment variables from a .env file
load_dotenv()

# Initialize the Flask application
app = Flask(__name__)

# Configure the SQLAlchemy part of the app instance
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

# Create the SQLAlchemy db instance
db = SQLAlchemy(app)

# Enable Cross-Origin Resource Sharing (CORS) for the app
CORS(app, supports_credentials=True)

# Initialize SocketIO for real-time communication
socketio = SocketIO(app, cors_allowed_origins="*")

# Define a simple route to check if the server is running
@app.route('/')
def index():
    return "Server is running"

# Example of a route that uses a SQLAlchemy query
@app.route('/data')
def get_data():
    # Execute a raw SQL query
    result = db.session.execute(text("SELECT * FROM some_table"))
    # Convert the result to a list of dictionaries
    data = [dict(row) for row in result]
    # Return the data as JSON
    return jsonify(data)

# Example of a SocketIO event handler
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('response', {'message': 'Connected to server'})

# Example of a SocketIO event handler for receiving messages
@socketio.on('message')
def handle_message(data):
    print('Received message: ' + data)
    emit('response', {'message': 'Message received'})

# Run the app if this file is executed directly
if __name__ == '__main__':
    # Start the Flask application with SocketIO
    socketio.run(app)
