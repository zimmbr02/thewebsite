from flask import Flask, render_template, request, jsonify, redirect, url_for
from flask_bootstrap import Bootstrap
from functools import wraps

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from sqlalchemy import update

import json
import flask.ext.login as flask_login
#creates a connection to the sqlAlchemy DB
engine = create_engine('sqlite:///final.db',echo=True)
Base = declarative_base()

Session = sessionmaker(bind=engine)
Session.configure(bind=engine)
session = Session()

class User(flask_login.UserMixin):
	pass

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
app.secret_key = "super secret string"
app.debug = True
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

Bootstrap(app)

#def login_required(f):
	#@wraps(f)
	#def decorated_function(*args, **kwargs):
		#if not flask_login.current_user.is_authenticated:
			#return redirect(url_for('logIn'))
		#return f(*args, **kwargs)
	#return decorated_function
	
theUsers = []
for item in session.query(Users).all():
	theUsers.append(item.username)
	
@login_manager.user_loader
def load_user(username):
	if username not in theUsers:
		return
	user = User()
	user.id = username
	return user

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
	return render_template('forgotPassword.html')
	
#renders home.html
@app.route('/home.html/<username>')
#@flask_login.login_required
def home(username):
	if flask_login.current_user.get_id() == username:
		return render_template('home.html', user=username)
		
	else:
		return redirect(url_for('logOut'))
		
@app.route('/toDo.html/<username>')
def toDo(username):
	if flask_login.current_user.get_id() == username:
		return render_template('toDo.html', user=username)
		
	else:
		return redirect(url_for('logOut'))
		
@app.route('/accountSettings.html/<username>')
def accountSettings(username):
	if flask_login.current_user.get_id() == username:
		return render_template('accountSettings.html', user=username)
		
	else:
		return redirect(url_for('logOut'))
		
@app.route('/midtermMashup.html')
def mashup():
	return render_template('midtermMashup.html')
    
#renders index.html
@app.route('/')
def index():
    return render_template('index.html')
    
#renders log-in.html
@app.route('/log-in.html')
def logIn():
    return render_template('log-in.html')

@app.route('/logout')
def logOut():
	flask_login.logout_user()
	return redirect(url_for('index'))
	
@app.route('/confirmPassword', methods=['POST'])
def confirmPassword():
	theDict = json.loads(request.data.decode("utf8"))
	sentPassword = theDict['sentPassword']
	
	allUsers = []
	match = False
	for item in session.query(Users).all():
		allUsers.append(item.username)
	
	if flask_login.current_user.get_id() in allUsers:
		if session.query(Users).filter_by(username = flask_login.current_user.get_id()).all()[0].password == sentPassword:
			match = True
		
	return jsonify(tasklist = [match])
	
@app.route('/updatePassword', methods=['POST'])
def updatePassword():
	theDict = json.loads(request.data.decode("utf8"))
	sentPassword = theDict['sentPassword']
	currentUsername = flask_login.current_user.get_id()
	
	currentUserData = session.query(Users).filter_by(username = currentUsername).first()
	currentUserData.password = sentPassword
	session.commit()
	
	return jsonify (tasklist = [True])
	
@app.route('/deleteAccount', methods=['POST'])
def deleteAccount():
	currentUsername = flask_login.current_user.get_id()
	
	currentUserData = session.query(Users).filter_by(username = currentUsername).first()
	session.delete(currentUserData)
	session.commit()
	
	flask_login.logout_user()
	
	return jsonify (tasklist = [True])
	
@app.route('/personalData', methods=['GET'])
def sendAllPersonalData():
	results = session.query(Users).all()
	reslist = []
	
	for item in results:
		reslist.append(dict(id=item.id,sentUsername=item.username,sentPassword=item.password))
		
	return jsonify(tasklist = reslist)
	
#renders sign-up.html
@app.route('/sign-up.html')
def signUp():
	return render_template('sign-up.html')
	
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
	
	if len(availableIDs) > 0:
		match = True
		newID = availableIDs.pop()
		task = Users(id=newID,username=sentUsername,password=sentPassword,question=sentQuestion,answer=sentAnswer)
		session.add(task)
		session.commit()
		
		user = User()
		user.id = sentUsername
		flask_login.login_user(user)
	
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
			user = User()
			user.id = sentUsername
			flask_login.login_user(user)
			match = True
		
	return jsonify(tasklist = [match])

if __name__=="__main__":
	app.run()