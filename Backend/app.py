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
# It allows us to interact with the database using Python objects
# instead of writing raw SQL queries
# Initialize the database connection
# This will be used to interact with the database
# SQLAlchemy is a popular ORM (Object Relational Mapper) for Python
# It allows us to interact with the database using Python objects
# instead of writing raw SQL queries
db = SQLAlchemy(app)

# Enable Cross-Origin Resource Sharing (CORS) for the app
# This allows the app to accept requests from different origins
CORS(app, supports_credentials=True)

# Initialize SocketIO for real-time communication
# This allows the app to support WebSockets
# WebSockets are a protocol for full-duplex communication channels over a single TCP connection
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

# Define a simple route to test the server
@app.route('/')
def index():
    # Render the index.html template
    return render_template('index.html')

# Define a route to handle form submissions
@app.route('/submit', methods=['POST'])
def submit():
    # Get data from the form
    data = request.form.get('data')
    # Process the data (this is just a placeholder)
    # In a real application, you would do something with the data here
    return jsonify({'status': 'success', 'data': data})

# Define a route to handle WebSocket connections
@socketio.on('connect')
def handle_connect():
    # Emit a message to the client
    emit('response', {'message': 'Connected'})

# Define a route to handle WebSocket messages
@socketio.on('message')
def handle_message(data):
    # Emit the received message back to the client
    emit('response', {'message': data})

# Run the app if this file is executed directly
if __name__ == '__main__':
    # Start the Flask development server
    # The server will listen on all available IP addresses (0.0.0.0)
    # and port 5000
    socketio.run(app, host='0.0.0.0', port=5000)