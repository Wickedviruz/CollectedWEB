from flask import Blueprint, request, jsonify
from datetime import timedelta
from flask_jwt_extended import create_access_token,jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from werkzeug.security import generate_password_hash

#local imports
from app.models import User, db
from ..extensions import limiter

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

@auth_bp.route('/profile', methods=['GET'])
@limiter.limit("10 per minute")
@jwt_required()
def userprofile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.filter_by(id=current_user_id).first()

        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        user_data = {
            'firstname': f"{user.firstname}",
            'lastname': f"{user.lastname}",
            'email': user.email,
            'role': user.role
        }

        return jsonify(user_data), 200


    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        db.session.rollback()
        return jsonify({'message': 'Database error occurred while trying to get user profile'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to get user profile'}),500  
    
@auth_bp.route('/profile', methods=['PUT'])
@jwt_required()
@limiter.limit("20 per minute")
def update_profile():
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)

        if not user:
            return jsonify({'message': 'User not found'}), 404

        data = request.get_json()
        new_firstname = data.get('firstname')
        new_lastname = data.get('lastname')
        new_email = data.get('email')
        current_password = data.get('current_password')
        new_password = data.get('new_password')

        if new_firstname:
            user.firstname = new_firstname
        if new_lastname:
            user.lastname = new_lastname
        if new_email:
            if User.query.filter(User.email == new_email, User.id != current_user_id).first():
                return jsonify({'message': 'Email already exists'}), 400
            user.email = new_email

        if new_password:
            if not user.check_password(current_password):
                return jsonify({'message': 'Current password is incorrect'}), 400
            user.password = generate_password_hash(new_password)

        db.session.commit()

        return jsonify({
            'message': 'Profile updated successfully',
            'firstname': user.firstname,
            'lastname': user.lastname,
            'email': user.email
        }), 200

    except SQLAlchemyError as e:
        db.session.rollback()
        print(f"Database error occurred: {e}")
        return jsonify({'message': 'Database error occurred while updating profile'}), 500

    except Exception as e:
        print(f"An error occurred: {e}")
        return jsonify({'message': 'An error occurred while updating profile'}), 500