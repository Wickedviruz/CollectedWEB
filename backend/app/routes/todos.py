from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import TodoItem, db

todos_bp = Blueprint('todos', __name__)

@todos_bp.route('/todos', methods=['POST'])
@jwt_required()
def create_todo():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    new_todo = TodoItem(title=data['title'], completed=False, user_id=current_user_id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify ({'message': 'Todo created', 'Todo': new_todo.title}), 201