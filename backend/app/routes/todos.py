from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from app.models import TodoItem, db

todos_bp = Blueprint('todos', __name__)

@todos_bp.route('/todos', methods=['POST'])
@jwt_required()
def create_todo():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        new_todo = TodoItem(title=data['title'],
                            info=data.get('info',''),
                            completed=False,
                            user_id=current_user_id)
        db.session.add(new_todo)
        db.session.commit()
        return jsonify({
            'id': new_todo.id,
            'title': new_todo.title,
            'info': new_todo.info,
            'completed': new_todo.completed,
            'user_id': new_todo.user_id
        }), 201

    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        db.session.rollback()
        return jsonify({'message': 'Database error occurred while trying to create todo'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to create todo'}),500   

@todos_bp.route('/todos', methods=['GET'])
@jwt_required()
def get_todos():
    try:
        current_user_id = get_jwt_identity()
        todos = TodoItem.query.filter_by(user_id=current_user_id).all()
        return jsonify([{'id': todo.id, 'title': todo.title, 'info': todo.info, 'completed': todo.completed} for todo in todos])
    
    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        return jsonify({'message': 'Database error occurred while trying to fetch all todos'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to fetch all todos'}),500   

@todos_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
@jwt_required()
def delete_todo(todo_id):
    try:
        current_user_id = get_jwt_identity()
        todo = TodoItem.query.filter_by(id=todo_id, user_id=current_user_id).first()
        if not todo:
            return jsonify({'message': ' Todo not found'}), 404
        
        db.session.delete(todo)
        db.session.commit()
        return jsonify({'message': 'Todo was deleted successfully'}), 200

    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        db.session.rollback()
        return jsonify({'message': 'Database error occurred while trying to delete todo'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to delete todo'}),500  

@todos_bp.route('/todos/<int:todo_id>', methods=['PUT'])
@jwt_required()
def update_todo(todo_id):
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        todo = TodoItem.query.filter_by(id=todo_id, user_id=current_user_id).first()
        if not todo:
            return jsonify({'message': ' Todo not found'}), 404
        
        todo.title = data.get('title', todo.title)
        todo.info = data.get('info', todo.info)
        todo.completed = data.get('completed', todo.completed)

        db.session.commit()

        return jsonify({
            'id': todo.id,
            'title': todo.title,
            'info': todo.info,
            'completed': todo.completed,
            'user_id': todo.user_id
        }), 200

    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        db.session.rollback()
        return jsonify({'message': 'Database error occurred while trying to update todo'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to update todo'}),500  