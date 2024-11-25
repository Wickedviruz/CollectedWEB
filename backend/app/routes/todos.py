from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import TodoItem, db

todos_bp = Blueprint('todos', __name__)

@todos_bp.route('/todos', methods=['POST'])
@jwt_required()
def create_todo():
    current_user_id = get_jwt_identity()
    data = request.get_json()

    new_todo = TodoItem(title=data['title'], info=data['info'], completed=False, user_id=current_user_id)
    db.session.add(new_todo)
    db.session.commit()
    return jsonify ({'message': 'Todo created', 'Todo': new_todo.title}), 201

@todos_bp.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    current_user_id = get_jwt_identity()
    todos = TodoItem.query.filter_by(user_id=current_user_id).all()
    return jsonify([{'id': todo.id, 'title': todo.title, 'info': todo.info, 'completed': todo.completed} for todo in todos])

@todos_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    current_user_id = get_jwt_identity()
    todo = TodoItem.query.filter_by(id=todo_id, user_id=current_user_id).first()
    if not todo:
        return jsonify({'message': ' Todo not found'}), 404
    
    db.session.delete(todo)
    db.session.commit()
    return jsonify({'message': 'Todo was deleted successfully'}), 200