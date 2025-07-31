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
# Set the database URI for SQLAlchemy from environment variables
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# Initialize the SQLAlchemy object with the Flask app
# This will be used for all database operations
# db is an instance of SQLAlchemy
# It represents the database and provides methods to interact with it
db = SQLAlchemy(app)

# Enable Cross-Origin Resource Sharing (CORS) for the app
# This allows the app to accept requests from different origins
CORS(app, supports_credentials=True)

# Initialize SocketIO for real-time communication
# This will allow the app to handle WebSocket connections
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

# Define a route for the root URL
# When a user accesses the root URL, the index.html template will be rendered
@app.route('/')
def index():
    return render_template('index.html')

# Define a route to handle form submissions
# This route will accept POST requests and process form data
@app.route('/submit', methods=['POST'])
def submit():
    # Get data from the form
    data = request.form['data']
    # Process the data (e.g., save to database)
    # Here you would add logic to handle the data
    return jsonify({'status': 'success', 'data': data})

# Define a route to handle WebSocket connections
# This route will be used to send and receive messages in real-time
@socketio.on('message')
def handle_message(message):
    print('received message: ' + message)
    # Emit the message back to the client
    emit('message', message)

# Main entry point of the application
# This block will run the app when the script is executed directly
if __name__ == '__main__':
    # Run the Flask app with SocketIO
    # The app will be accessible on all network interfaces (0.0.0.0)
    # and will use port 5000
    socketio.run(app, host='0.0.0.0', port=5000)
