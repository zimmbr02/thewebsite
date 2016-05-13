from flask import Flask, render_template, request, jsonify
from flask_bootstrap import Bootstrap

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

import json
#creates a connection to the sqlAlchemy DB
engine = create_engine('sqlite:///final.db',echo=True)
Base = declarative_base()

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

#Defining the Login Database
class Users(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    username = Column(String(20))
    password = Column(String(20))
    question = Column(Integer)
    answer = Column(String(100))
    
Base.metadata.create_all(engine)

#task = Users(id=67,username='gffdsfds',password='bret6809',question=1,answer='Kentucky Brunch')
#session.add(task)
#session.commit()

#results = session.query(Users).filter_by(username = 'warbags').all()
#print(results[0].username)

#creates flask app 
app = Flask(__name__)
app.debug = True

Bootstrap(app)

#checks username availability as the user is typing
@app.route('/checkUsernameAvailability', methods=['POST'])
def checkUsernameAvailability():
	theDict = json.loads(request.data.decode("utf8"))
	sentUsername = theDict['sentUsername']
	
	allUsers = []
	match = False
	for item in session.query(Users).all():
		allUsers.append(item.username)
		
	if sentUsername in allUsers:
		match = True
		
	return jsonify(tasklist = [match])

#renders forgotPassword.html
@app.route('/forgotPassword.html')
def forgotPassword():
	return render_template('forgotPassword.html',foo='bar')
	
#renders home.html
@app.route('/home.html')
def home():
    return render_template('home.html',foo='bar')
	
#renders index.html
@app.route('/')
def index():
    return render_template('index.html',foo='bar')
    
#renders log-in.html
@app.route('/log-in.html')
def logIn():
    return render_template('log-in.html',foo='bar')
	
#renders sign-up.html
@app.route('/sign-up.html')
def signUp():
	return render_template('sign-up.html',foo='bar')
	
@app.route('/sign-up', methods=['POST'])
def sign_up():
	theDict = json.loads(request.data.decode("utf8"))
	sentUsername = theDict['sentUsername']
	sentPassword = theDict['sentPassword']
	sentQuestion = theDict['sentQuestion']
	sentAnswer = theDict['sentAnswer']
	
	allIDs = []
	match = False
	for item in session.query(Users).all():
		allIDs.append(item.id)
	
	potentialIDs = []
	for lv in range(100000):
		potentialIDs.append(lv)
		
	availableIDs = set(potentialIDs) - set(allIDs)
	
	print(allIDs)
	
	if len(availableIDs) > 0:
		match = True
		newID = availableIDs.pop()
	
		task = Users(id=newID,username=sentUsername,password=sentPassword,question=sentQuestion,answer=sentAnswer)
		session.add(task)
		session.commit()
	
	return jsonify(tasklist = [match])
	
#receives a username and passwords and checks the database
@app.route('/login', methods=['POST'])
def user_login():
	theDict = json.loads(request.data.decode("utf8"))
	sentUsername = theDict['sentUsername']
	sentPassword = theDict['sentPassword']
	
	allUsers = []
	match = False
	for item in session.query(Users).all():
		allUsers.append(item.username)
	
	if sentUsername in allUsers:
		if session.query(Users).filter_by(username = sentUsername).all()[0].password == sentPassword:
			match = True

	return jsonify(tasklist = [match])

if __name__=="__main__":
    app.run()