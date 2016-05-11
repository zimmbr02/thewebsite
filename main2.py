from flask import Flask, render_template
from flask_bootstrap import Bootstrap

from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy import Column, Integer, String, Date, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

#creates a connection to the sqlAlchemy DB
engine = create_engine('sqlite:///final.db',echo=True)
Base = declarative_base()
Base.metadata.create_all(engine)

#Defining the Login Database
class Login(Base):
    __tablename__ = 'login'
    id = Column(Integer, primary_key=True)
    username = Column(String(20))
    password = Column(String(20))


#creates flask app 
app = Flask(__name__)
app.debug = True

Bootstrap(app)

#renders index.html
@app.route('/')
def index():
    return render_template('index.html',foo='bar')

#renders forgotPassword.html
@app.route('/forgotPassword.html')
def forgotPassword():
	return render_template('forgotPassword.html',foo='bar')

#checks if username and password submitted is a valid login, logs into site or returns false
@app.route('/login/<int:username_password>', methods=['GET'])
def user_login(username_password):
    Session = sessionmaker(bind=engine)
    Session.configure(bind=engine)
    session = Session()

    #create a list of [username,password]
    theList = username_password.split()
    results = session.query(Login).filter_by(username = theList[0]).all()
    reslist = []
    
#


if __name__=="__main__":
    app.run()