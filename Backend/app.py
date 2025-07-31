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
# SQLAlchemy is a library that facilitates communication between Python programs and databases
# It provides a set of high-level API for connecting to databases and performing operations
# such as creating, reading, updating, and deleting records.
db = SQLAlchemy(app)

# Enable Cross-Origin Resource Sharing (CORS) for the app
# This allows the app to accept requests from different origins
CORS(app, supports_credentials=True)

# Initialize SocketIO for real-time communication
# SocketIO is a library that enables real-time, bidirectional communication between web clients and servers
socketio = SocketIO(app, cors_allowed_origins="*", manage_session=False)

# Define a User model for the database
# This model represents a table in the database
# Each instance of this class corresponds to a row in the table
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)

# Define the home route
# This route renders the home page of the application
@app.route('/')
def home():
    return render_template('index.html')

# Define the login route
# This route handles user login
# It checks the user's credentials and starts a session if they are valid
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data['username']).first()
    if user and user.password == data['password']:
        session['user_id'] = user.id
        return jsonify({'message': 'Logged in successfully'}), 200
    return jsonify({'message': 'Invalid credentials'}), 401

# Define the signup route
# This route handles user registration
# It creates a new user in the database if the username and email are unique
@app.route('/signup', methods=['POST'])
def signup():
    data = request.get_json()
    if User.query.filter_by(username=data['username']).first() is not None:
        return jsonify({'message': 'Username already exists'}), 409
    if User.query.filter_by(email=data['email']).first() is not None:
        return jsonify({'message': 'Email already exists'}), 409
    new_user = User(username=data['username'], email=data['email'], password=data['password'])
    db.session.add(new_user)
    db.session.commit()
    return jsonify({'message': 'User created successfully'}), 201

# Define the logout route
# This route logs out the user by clearing the session
@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect('/')

# Define a SocketIO event for handling chat messages
# This event listens for 'message' events and broadcasts the message to all connected clients
@socketio.on('message')
def handle_message(data):
    print('received message: ' + data)
    emit('message', data, broadcast=True)

# Run the app if this file is executed directly
if __name__ == '__main__':
    socketio.run(app, debug=True)