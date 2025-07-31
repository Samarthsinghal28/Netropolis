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
# Set the database URI for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# Initialize the SQLAlchemy object
# This will be used for all database operations
# SQLAlchemy is a popular ORM for handling database operations in Flask
# It abstracts the database interactions and provides a high-level API
db = SQLAlchemy(app)





# Enable Cross-Origin Resource Sharing (CORS) for the app
# This allows the app to accept requests from different origins
CORS(app, supports_credentials=True)

# Initialize SocketIO for real-time communication
# SocketIO is used for handling WebSocket connections
# It allows for real-time bi-directional communication between the client and server
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')


# Define a route for the home page
# This route will render the index.html template
@app.route('/')
def index():
    return render_template('index.html')


# Define a route for handling form submissions
# This route will process the form data sent via POST request
@app.route('/submit', methods=['POST'])
def submit():
    # Get the form data from the request object
    data = request.form
    # Process the form data (e.g., save to database)
    # Here you would typically have logic to handle the form data
    return jsonify({'status': 'success', 'data': data})


# Define a route for handling WebSocket connections
# This route will be used for real-time communication
@socketio.on('connect')
def handle_connect():
    # Emit a message to the client upon successful connection
    emit('response', {'data': 'Connected'})


# Define a route for handling WebSocket messages
# This route will process messages sent from the client
@socketio.on('message')
def handle_message(message):
    # Emit the received message back to the client
    emit('response', {'data': message})


# Define a route for handling WebSocket disconnections
# This route will be called when a client disconnects
@socketio.on('disconnect')
def handle_disconnect():
    print('Client disconnected')


# Run the Flask application
# This will start the Flask development server
if __name__ == '__main__':
    # The app will run on host 0.0.0.0 and port 5000
    # Debug mode is enabled for development purposes
    socketio.run(app, host='0.0.0.0', port=5000, debug=True)
