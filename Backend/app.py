# Import necessary modules from Flask and other libraries
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
# This will be used to interact with the database
# SQLAlchemy is a popular ORM (Object Relational Mapper) for Python
# It allows you to interact with the database using Python objects
# instead of writing raw SQL queries
# This makes it easier to work with databases in a Pythonic way
db = SQLAlchemy(app)

# Enable Cross-Origin Resource Sharing (CORS) for the app
# This allows the app to accept requests from different origins
# which is useful for APIs that are accessed from different domains
CORS(app, supports_credentials=True)

# Initialize SocketIO for real-time communication
# SocketIO is a library that enables real-time, bidirectional
# communication between web clients and servers
# It is commonly used for chat applications, live notifications, etc.
socketio = SocketIO(app)

# Define a simple route for the root URL
# This route will render a template called 'index.html'
@app.route('/')
def index():
    return render_template('index.html')

# Define a route for handling form submissions
# This route will accept POST requests and process form data
@app.route('/submit', methods=['POST'])
def submit():
    # Get data from the form
    data = request.form['data']
    # Process the data (e.g., save to database)
    # For now, just return a JSON response with the data
    return jsonify({'data': data})

# Define a route for handling WebSocket connections
# This route will be used for real-time communication
@socketio.on('connect')
def handle_connect():
    print('Client connected')
    emit('response', {'message': 'Connected'})

# Define a route for handling WebSocket disconnections
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')

# Define a route for handling custom WebSocket events
@socketio.on('my_event')
def handle_my_custom_event(json):
    print('Received json: ' + str(json))
    emit('response', {'message': 'JSON received'})

# Run the Flask application
# This will start the Flask development server
# The server will listen for incoming requests and handle them
if __name__ == '__main__':
    socketio.run(app, debug=True)