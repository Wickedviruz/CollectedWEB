import os
import yaml

class Config:
    def __init__(self):
        base_path = os.path.dirname(os.path.abspath(__file__))
        config_path = os.path.join(base_path, "config.yaml")

        if not os.path.exists(config_path):
            raise FileNotFoundError(
                f"config.yaml not found. Please create one based on config.example.yaml."
            )

        with open (config_path, 'r') as file:
            self.config = yaml.safe_load(file)


            self.SECRET_KEY = self.config['app']['secret_key']
            self.JWT_SECRET_KEY = self.config['app']['jwt_secret_key']
            self.DEBUG = self.config['app']['debug']
            self.HOST = self.config['host']['host']
            self.PORT = self.config['host']['port']
            self.SQLALCHEMY_DATABASE_URI = self.config['database']['uri']
            self.SQLALCHEMY_TRACK_MODIFICATIONS = self.config['database']['check_modifications']
            self.LOGGING_LEVEL = self.config['logging']['level']
            self.LOGGING_FILE = self.config['logging']['file']
            self.API_KEY = self.config['weather']['api_key']
            self.WEATHER = self.config['weather']['weather_url']
            self.FORECAST = self.config['weather']['forecast_url']

config = Config()