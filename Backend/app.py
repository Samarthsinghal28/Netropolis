from flask import Flask, render_template, request, session, redirect
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text
from flask_cors import CORS
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = '346b796077f9834414b58249decb4112'  # Secret key required by Flask-SocketIO
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456@localhost/Netropolis'
db = SQLAlchemy(app)


CORS(app, supports_credentials=True)
socketio = SocketIO(app, cors_allowed_origins="*")



@socketio.on('connect')
def handle_connect():
    print('Client connected to WebSocket')



@socketio.on('Disconnect')
def handle_disconnect():
    print('Client disconnected to WebSocket')


# WebSocket event handler to execute create user query
@socketio.on('create_user')
def create_user(data):
    print(data)
    username = data['username']
    first_name = data['first_name']
    last_name = data['last_name']
    password = data['password']
    email = data['email']
    dob = data['dob']
    specialisation = data['specialisation']

    with app.app_context():
        # Execute the SQL query to create a new user
        query = text('INSERT INTO userdetails (username, firstname, lastname, password, emailid,specialisation, dob) VALUES (:username, :first_name, :last_name, :password, :email, :specialisation, :dob)')
        db.session.execute(query, {'username': username, 'first_name': first_name, 'last_name': last_name, 'password': password, 'email': email, 'specialisation' : specialisation, 'dob' : dob})
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
    dob = data['dob']
    specialisation = data['specialisation']

    with app.app_context():
        # Execute the SQL query to create a new user
        query = text('INSERT INTO userdetails (username, firstname, lastname, password, emailid, specialisation, data) VALUES (:username, :first_name, :last_name, :password, :email, :specialisation, :dob)')
        db.session.execute(query, {'username': username, 'first_name': first_name, 'last_name': last_name, 'password': password, 'email': email, 'specialisation': specialisation, 'dob': dob})
        db.session.commit()

        # Emit a message to the client confirming the user creation
        emit('community_manager_created', {'message': 'Manager created successfully'})


@socketio.on('login_user')
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
            emit('login_result', {'message': 'User logged in successfully'})
        else:
            emit('login_result', {'message': 'Incorrect password'})
    else:
        emit('login_result', {'message': 'User does not exist'})


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
def All_Quests():

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

@socketio.on('search_quests_exact')
def search_Quests_exact(data):

    work=data['work']

    with app.app_context():
        # Execute the SQL query to create a new quest        
        query = text(f"SELECT * FROM Quests WHERE work =work")
        Quests = db.session.execute(query, {'work': {work}})
        

        # Convert the result to a list of dictionaries
        if(len(Quests)!=0):
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
            emit('selected_quests_exact', {'quests': quests_data})

        else:
            emit('no_quest_found_elastic',{'message':f'No Quest Found with work = {work}'})

@socketio.on('search_quests_elastic')
def search_Quests_elastic(data):

    elastic_work=data['work']
    works = elastic_work.split()

    Quests=[]

    with app.app_context():
        
        for work in works: 
            query = text(f"SELECT * FROM Quests WHERE work LIKE :work")
            result = db.session.execute(query, {'work': f'%{work}%'})

        
        # Convert the result to a list of dictionaries
            if(len(result)!=0):
                for quest in Quests:
                    quests_data = {'Quest_no': quest.Quest_no,
                                'Location': quest.Location,
                                'Work': quest.Work,
                                'Reward': quest.Reward,
                                'Days': quest.Days,
                                'Temperature': quest.Temperature,
                                'Leisure': quest.Leisure,
                                'Local_events': quest.Local_events}
                    Quests.append(quests_data)
        
        print(quests_data)
        # Emit a message to the client containing the quests data
        if(len(Quests)!=0):
            emit('selected_quests_elastic', {'quests': quests_data})

        else:
            emit('no_quest_found_elastic',{'message':f'No Quest Found with work = {work}'})


@socketio.on('schedule_request')
def schedule_Quest(data):
    dates = data["dates"]
    user_id = data["user"]
    quest_id = data["quest_id"] 

    with app.app_context():
        
        query = text(f'Select * from Quests where Quest_no={quest_id}')
        result=db.session.execute(query).fetchone

        quest_detail={'Quest_id' : quest_id,
                    'Location': result.Location,
                    'Work': result.Work,
                    'Employer': result.Employer }
        
        query = text('INSERT INTO ScheduleRequest (Employer, Quest_id, user_id, status) VALUES (:employer, :Quest_id, :user_id, :status)')
        db.session.execute(query, {'employer': quest_detail['Employer'], 'Quest_id': quest_detail['Quest_id'],'user_id':user_id, 'status' : 'pending'})
        db.session.commit()

        # Emit a message to the client confirming the quest creation
        emit('request_created', {'message': 'Request created successfully'})
    

    # Function to handle request acceptance
@socketio.on('accept_request')
def accept_request(data):
    request_id = data["request_id"]
    
    with app.app_context():
        # Update the status of the request to "accepted" in the database
        query = text('UPDATE ScheduleRequest SET status = :status WHERE request_id = :request_id')
        db.session.execute(query, {'status': 'accepted', 'request_id': request_id})
        db.session.commit()

        emit('request_accepted',{'message':'Request Accepted By Employer'})


# Function to handle request rejection
@socketio.on('reject_request')
def reject_request(data):
    request_id = data["request_id"]
    
    with app.app_context():
        # Update the status of the request to "rejected" in the database
        query = text('UPDATE ScheduleRequest SET status = :status WHERE request_id = :request_id')
        db.session.execute(query, {'status': 'rejected', 'request_id': request_id})
        db.session.commit()

        emit('request_rejected',{'message':'Request Rejected By Employer'})



if __name__ == '__main__':
    # app.run(debug=True)
    socketio.run(app, debug=True, port=5001, allow_unsafe_werkzeug=True)
