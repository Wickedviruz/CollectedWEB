from flask import Flask
from config import config
from .models import db, bcrypt
from .auth.auth_routes import auth_bp
from .routes.todos import todos_bp
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate

jwt = JWTManager()
migrate = Migrate()

def create_app():
    app = Flask(__name__)

    app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
    app.config['SECRET_KEY'] = config.SECRET_KEY
    app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY

    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app,db)

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(todos_bp, url_prefix='/todo')

    with app.app_context():
        db.create_all()

    return app