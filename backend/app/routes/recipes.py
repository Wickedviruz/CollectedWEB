from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import SQLAlchemyError
from app.models import Recipe, db

recipes_bp = Blueprint('Recipes', __name__)

@recipes_bp.route('/recipes', methods=['POST'])
@jwt_required()
def create_recipe():
    try:
        current_user_id = get_jwt_identity()
        data = request.get_json()

        if not data:
            return jsonify({'message': 'No recipe data provided'}), 400

        new_recipe = Recipe(
            title=data['title'],
            ingredients=data['ingredients'],
            instructions=data['instructions'],
            category=data['category'],
            img_url=data['image_url'],
            user_id=current_user_id
        )

        db.session.add(new_recipe)
        db.session.commit()

        return jsonify({'message': 'Recipe created', 'recipe': new_recipe.title}), 201
    
    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        db.session.rollback()
        return jsonify({'message': 'Database error occurred while trying to create recipe'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to create recipe'}),500    

@recipes_bp.route('/recipes', methods=['GET'])
@jwt_required()
def get_recipe():
    try:
        current_user_id = get_jwt_identity()
        recipes = Recipe.query.filter_by(user_id=current_user_id).all()
        return jsonify([{
            'id': recipe.id,
            'title': recipe.title,
            'ingredients': recipe.ingredients,
            'instructions': recipe.instructions,
            'category': recipe.category,
            'img_url': recipe.img_url
        }for recipe in recipes])
    
    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        return jsonify({'message': 'Database error occurred while trying to fetch all recipes'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to fetch all recipes'}),500

@recipes_bp.route('/recipes/<int:recipe_id>', methods=['PUT'])
@jwt_required()
def update_recipe(recipe_id):
    try:
        current_user_id = get_jwt_identity()
        recipe = Recipe.query.filter_by(id=recipe_id, user_id=current_user_id).first()

        if not recipe:
            return jsonify({'message': 'Recipe not found'}), 404
        
        data = request.get_json()
        recipe.title = data.get('title', recipe.title)
        recipe.ingredients = data.get('ingredients', recipe.ingredients)
        recipe.instructions = data.get('instructions', recipe.instructions)
        recipe.category = data.get('category', recipe.category)
        recipe.img_url = data.get('image_url', recipe.img_url)

        db.session.commit()
        return jsonify({'message': ' Recipe updated'}), 200
    
    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        db.session.rollback()
        return jsonify({'message': 'Database error occurred while trying to update the recipe'}), 500

    except Exception as e:
        print(f"Error updating recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to update the recipe'}),500

@recipes_bp.route('/recipes/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def delete_recipe(recipe_id):
    try:
        current_user_id = get_jwt_identity()
        recipe = Recipe.query.filter_by(id=recipe_id, user_id=current_user_id).first()

        if not recipe:
            return jsonify({'message': 'Recipe not found'}), 404

        db.session.delete(recipe)
        db.session.commit()
        return jsonify({'message': 'Recipe was deleted successfully'}), 200
    
    except SQLAlchemyError as e:
        print(f"Database error occurred: {e}")
        db.session.rollback()
        return jsonify({'message': 'Database error occurred while trying to delete the recipe'}), 500

    except Exception as e:
        print(f"Error deleting recipe: {e}")
        return jsonify({'message': 'An error occurred while trying to delete the recipe'}),500