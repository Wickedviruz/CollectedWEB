from flask import Blueprint, request, jsonify
from app.models import User, db
from flask_jwt_extended import create_access_token
from ..extensions import limiter
from datetime import timedelta

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
@limiter.limit("5 per minute")
def register():
    data = request.get_json()

    firstname = data.get('firstname')
    lastname = data.get('lastname')
    email = data.get('email')
    password = data.get('password')

    if User.query.filter_by(email=email).first():
        return jsonify({'message': 'Email already exists'}), 400

    try:
        new_user= User(firstname=firstname, lastname=lastname, email=email, password=password, role='user')
        db.session.add(new_user)
        db.session.commit()
        return jsonify({'message': 'User registered successfully'}), 201
    except Exception as e:
        db.session.rollback()
        print(f"Error druing user registration: {e}")
        return jsonify({'message': 'Failed to register user'}), 500

@auth_bp.route('/login', methods=['POST'])
@limiter.limit("5 per minute")
def login():
    data = request.get_json()

    email = data.get('email')
    password = data.get('password')

    user = User.query.filter_by(email=email).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id, expires_delta=timedelta(minutes=30))
        return jsonify({'access_token': access_token, 'role': user.role}), 200
    
    return jsonify({'message': ' Invalid credentials'}), 401

