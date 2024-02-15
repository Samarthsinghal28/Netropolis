from flask import Flask, render_template, request, session, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = '346b796077f9834414b58249decb4112'  # Secret key required by Flask-SocketIO
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/Netropolis'
db = SQLAlchemy(app)
socketio = SocketIO(app)


# WebSocket event handler to execute create user query
@socketio.on('create_user')
def create_user(data):
    username = data['username']
    first_name = data['first_name']
    last_name = data['last_name']
    password = data['password']
    email = data['email']

    with app.app_context():
        # Execute the SQL query to create a new user
        query = text('INSERT INTO userdetails (username, firstname, lastname, password, emailid) VALUES (:username, :first_name, :last_name, :password, :email)')
        db.session.execute(query, {'username': username, 'firstname': first_name, 'lastname': last_name, 'password': password, 'emailid': email})
        db.session.commit()

        # Emit a message to the client confirming the user creation
        emit('user_created', {'message': 'User created successfully'})


@socketio.on('create_community_manager')
def create_manager(data):
    username = data['username']
    first_name = data['first_name']
    last_name = data['last_name']
    password = data['password']
    email = data['email']

    with app.app_context():
        # Execute the SQL query to create a new user
        query = text('INSERT INTO manager (username, firstname, lastname, password, emailid) VALUES (:username, :first_name, :last_name, :password, :email)')
        db.session.execute(query, {'username': username, 'firstname': first_name, 'lastname': last_name, 'password': password, 'emailid': email})
        db.session.commit()

        # Emit a message to the client confirming the user creation
        emit('community_manager_created', {'message': 'Manager created successfully'})


@socketio.on('/login_user')
def login_user(details):
    username = details['username']
    password = details['password']

    # Query the database to check if the username exists
    query = text('SELECT password FROM userdetails WHERE username=:username')
    result = db.session.execute(query, {'username': username}).fetchone()

    if result:
        # If the username exists, check if the password matches
        stored_password = result[0]  # Password retrieved from the database
        if stored_password == password:
            emit('loggedin', {'message': 'User logged in successfully'})
        else:
            emit('login_failed', {'message': 'Incorrect password'})
    else:
        emit('login_failed', {'message': 'User does not exist'})


@socketio.on('/login_manager')
def login_manager(details):
    username = details['username']
    password = details['password']

    # Query the database to check if the username exists
    query = text('SELECT password FROM manager WHERE username=:username')
    result = db.session.execute(query, {'username': username}).fetchone()

    if result:
        # If the username exists, check if the password matches
        stored_password = result[0]  # Password retrieved from the database
        if stored_password == password:
            emit('loggedin', {'message': 'Manager logged in successfully'})
        else:
            emit('login_failed', {'message': 'Incorrect password'})
    else:
        emit('login_failed', {'message': 'Manager does not exist'})

@socketio.on('create_quest')
def create_quest(data):
    location = data['location']
    work = data['work']
    reward = data['reward']
    days = data['days']
    temperature = data.get('temperature')  
    leisure = data.get('leisure')          
    local_events = data.get('local_events')  
    manager = data['Manager']

    with app.app_context():
        # Execute the SQL query to create a new quest
        query = text('INSERT INTO Quests (Location, Work, Reward, Days, Temperature, Leisure, Local_events, Employer) VALUES (:location, :work, :reward, :days, :temperature, :leisure, :local_events, :manager)')
        db.session.execute(query, {'location': location, 'work': work, 'reward': reward, 'days': days, 'temperature': temperature, 'leisure': leisure, 'local_events': local_events,'manager' : manager})
        db.session.commit()

        # Emit a message to the client confirming the quest creation
        emit('quest_created', {'message': 'Quest created successfully'})


@socketio.on('all_quests')
def All_Quests(data):

    with app.app_context():
        # Execute the SQL query to create a new quest
        query = text('Select * from Quests')
        Quests=db.session.execute(query)
        
        # Convert the result to a list of dictionaries
        quests_data = [{'Quest_no': quest.Quest_no,
                        'Location': quest.Location,
                        'Work': quest.Work,
                        'Reward': quest.Reward,
                        'Days': quest.Days,
                        'Temperature': quest.Temperature,
                        'Leisure': quest.Leisure,
                        'Local_events': quest.Local_events} for quest in Quests]
        
        print(quests_data)

        # Emit a message to the client containing the quests data
        emit('all_quests_response', {'quests': quests_data})

@socketio.on('schedule')
def schedule_Quest(data):
    dates = data["dates"]
    user_id = data["user"]

    query = text(f'Select * from userdetails where username={user_id}')
    result=db.session.execute(query).fetchone

    # Convert the result to a list of dictionaries
    #(username, firstname, lastname, password, emailid)

    user_detail = {'firstName': result.firstname,
                    'lastName': result.lastname,
                    'emailId': result.emailid   }
    
    

    
    





    
    
    

    



        








if __name__ == '__main__':
    socketio.run(app, debug=True, allow_unsafe_werkzeug=True)
