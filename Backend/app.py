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

# Initialize Flask application
app = Flask(__name__)
# Set the database URI for SQLAlchemy
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# Initialize SQLAlchemy with the Flask app
# SQLAlchemy is an ORM that provides a full suite of well-known enterprise-level persistence patterns
# It encourages the use of efficient and effective database access patterns
# and is designed for efficient and high-performing database access
# It is a core component of the Flask application
# and is used to interact with the database
# It is used to create, read, update, and delete records in the database
db = SQLAlchemy(app)

# Enable Cross-Origin Resource Sharing (CORS) for the app
# This allows the app to accept requests from different origins
# which is essential for APIs that are accessed from web browsers
CORS(app, supports_credentials=True)

# Initialize SocketIO for real-time communication
# SocketIO is a library that enables real-time, bidirectional
# and event-based communication between the browser and the server
# It is used to create real-time web applications
# and is a core component of the Flask application
# It is used to send and receive messages in real-time
# and is used to create chat applications, notifications, etc.
socketio = SocketIO(app, cors_allowed_origins="*", async_mode='threading')


@app.route('/')
def index():
    # Render the index.html template
    # This is the main page of the application
    return render_template('index.html')


@app.route('/api/data', methods=['GET'])
def get_data():
    # Handle GET requests to the /api/data endpoint
    # This endpoint returns JSON data
    # It is used to fetch data from the server
    # and is used by the client-side application
    data = {'key': 'value'}
    return jsonify(data)


if __name__ == '__main__':
    # Run the Flask application
    # The application will be accessible at http://localhost:5000/
    # The application will be running in debug mode
    # which means that any changes to the code will be automatically reloaded
    # and any errors will be displayed in the browser
    socketio.run(app, debug=True)
