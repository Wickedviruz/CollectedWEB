from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from datetime import datetime


db = SQLAlchemy()
bcrypt = Bcrypt()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    firstname = db.Column(db.String(60))
    lastname = db.Column(db.String(60))
    password_hash = db.Column(db.String(128), nullable=False)
    role = db.Column(db.String(20), default='user')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, firstname, lastname, email, password, role='user'):
        self.firstname = firstname
        self.lastname = lastname
        self.email = email
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')
        self.role = role

    def check_password(self, password):
        return bcrypt.check_password_hash(self.password_hash, password)
    

class TodoItem(db.Model):
    __tablename__ = 'todos'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable = False)
    info = db.Column(db.String(500))
    completed = db.Column(db.Boolean, default=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'))

class Recipe(db.Model):
    __tablename__ ='recipes'

    id =db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable = False)
    ingredients = db.Column(db.Text, nullable = False)
    instructions = db.Column(db.Text, nullable = False)
    category = db.Column(db.String(100))
    img_url = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)

    user = db.relationship('User', backref='recipes')

    def __init__(self, title, ingredients, instructions, user_id, category='', img_url=''):
        self.title = title
        self.ingredients = ingredients
        self.instructions = instructions
        self.category = category
        self.img_url = img_url
        self.user_id = user_id