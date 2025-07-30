from flask import Blueprint, request, jsonify, session
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy import text
from .app import db
import jwt
import datetime
import os

# Blueprint for authentication routes
auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.environ.get('SECRET_KEY', 'your_secret_key')

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    first_name = data['first_name']
    last_name = data['last_name']
    password = generate_password_hash(data['password'])
    email = data['email']
    dob = data['dob']
    specialisation = data['specialisation']

    with db.session.begin():
        query = text('SELECT * FROM userdetails WHERE emailid=:email')
        result = db.session.execute(query, {'email': email}).fetchall()

        if len(result) == 0:
            query = text('INSERT INTO userdetails (firstname, lastname, password, emailid, specialisation, dob) VALUES (:first_name, :last_name, :password, :email, :specialisation, :dob)')
            db.session.execute(query, {'first_name': first_name, 'last_name': last_name, 'password': password, 'email': email, 'specialisation': specialisation, 'dob': dob})
            db.session.commit()
            return jsonify({'message': 'User created successfully'}), 201
        else:
            return jsonify({'message': 'User already exists'}), 409

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['password']

    query = text('SELECT password FROM userdetails WHERE emailid=:email')
    result = db.session.execute(query, {'email': email}).fetchone()

    if result and check_password_hash(result[0], password):
        token = jwt.encode({'email': email, 'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=1)}, SECRET_KEY)
        return jsonify({'token': token}), 200
    else:
        return jsonify({'message': 'Invalid credentials'}), 401

@auth_bp.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    return jsonify({'message': 'Logged out successfully'}), 200
