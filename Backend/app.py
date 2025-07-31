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
# Set the database URI from environment variables
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
# Initialize SQLAlchemy with the Flask app
...[truncated]