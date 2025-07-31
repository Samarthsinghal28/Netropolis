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

# Define a database model for storing messages
class Message(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), nullable=False)
    content = db.Column(db.String(120), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Route for the home page
@app.route('/')
def index():
    # Render the index.html template
    return render_template('index.html')

# API endpoint to fetch messages
@app.route('/messages', methods=['GET'])
def get_messages():
    # Query all messages from the database
    messages = Message.query.all()
    # Return messages as JSON
    return jsonify([{'username': msg.username, 'content': msg.content, 'timestamp': msg.timestamp} for msg in messages])

# API endpoint to post a new message
@app.route('/messages', methods=['POST'])
def post_message():
    # Get data from the request
    data = request.json
    # Create a new message object
    new_message = Message(username=data['username'], content=data['content'])
    # Add the new message to the database session
    db.session.add(new_message)
    # Commit the session to save the message to the database
    db.session.commit()
    # Emit the new message to all connected clients via SocketIO
    socketio.emit('new_message', {'username': new_message.username, 'content': new_message.content, 'timestamp': new_message.timestamp})
    # Return a success response
    return jsonify({'success': True})

# Run the app
if __name__ == '__main__':
    # Create database tables if they don't exist
    db.create_all()
    # Start the Flask app with SocketIO
    socketio.run(app)
