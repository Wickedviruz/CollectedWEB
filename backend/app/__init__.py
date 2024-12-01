# Externa imports
from flask import Flask
from config import config
from flask_jwt_extended import JWTManager
from flask_migrate import Migrate
from flask_cors import CORS

#Local imports
from .models import db, bcrypt
from .auth.auth_routes import auth_bp
from .routes.todos import todos_bp
from .routes.recipes import recipes_bp
from .routes.weather import weather_bp
from app.extensions import limiter


migrate = Migrate()

def create_app():
    app = Flask(__name__)
    
    #Configurations
    app.config['SQLALCHEMY_DATABASE_URI'] = config.SQLALCHEMY_DATABASE_URI
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = config.SQLALCHEMY_TRACK_MODIFICATIONS
    app.config['SECRET_KEY'] = config.SECRET_KEY
    app.config['JWT_SECRET_KEY'] = config.JWT_SECRET_KEY
    app.config['API_KEY'] = config.API_KEY
    app.config['MAX_CONTENT_LENGTH'] = config.MAX_CONTENT_LENGTH

    # Initialize Extenesions
    db.init_app(app)
    bcrypt.init_app(app)
    migrate.init_app(app,db)
    jwt = JWTManager(app)
    limiter.init_app(app)
    CORS(app)

    # Register blueprints
    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(todos_bp, url_prefix='/todo')
    app.register_blueprint(recipes_bp, url_prefix='/recipe')
    app.register_blueprint(weather_bp, url_prefix='/weather')

    # Apply rate limits to blueprints
    limiter.limit("100 per hour")(auth_bp)
    limiter.limit("100 per hour")(todos_bp)
    limiter.limit("100 per hour")(recipes_bp)
    limiter.limit("200 per hour")(weather_bp)


    with app.app_context():
        db.create_all()

    return app