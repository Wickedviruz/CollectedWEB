import requests
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from config import config

weather_bp = Blueprint('weather', __name__)

# Definiera två olika URL:er för nuvarande väder och prognos
CURRENT_BASE_URL = config.WEATHER
FORECAST_BASE_URL = config.FORECAST
API_KEY = config.API_KEY

def wind_direction(degrees):
    directions = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"]
    index = int((degrees + 11.25) / 22.5) % 16
    return directions[index]

@weather_bp.route('/current', methods=['GET'])
@jwt_required()
def get_current_weather():
    try:
        latitude = request.args.get('lat')
        longitude = request.args.get('lon')
        city = request.args.get('city')

        params = {
            'appid': API_KEY,
            'units': 'metric'
        }

        if city:
            params['q'] = city
        elif latitude and longitude:
            params['lat'] = latitude
            params['lon'] = longitude
        else:
            return jsonify({'message': 'No valid parameters were provided'}), 400

        response = requests.get(CURRENT_BASE_URL, params=params)
        
        if response.status_code != 200:
            return jsonify({'message': 'Failed to retrieve weather data'}), response.status_code
        
        data = response.json()
        wind_deg = data.get("wind", {}).get("deg", 0)
        wind_direction_str = wind_direction(wind_deg)

        enhanced_data = {
            "location": data.get("name", "Unknown location"),
            "temperature": data["main"]["temp"],
            "feels_like": data["main"]["feels_like"],
            "weather": data["weather"][0]["description"],
            "humidity": data["main"]["humidity"],
            "pressure": data["main"]["pressure"],
            "wind_speed": data["wind"]["speed"],
            "wind_direction": wind_direction_str,
            "wind_gust": data["wind"].get("gust", "N/A"),
            "clouds": data["clouds"]["all"],
        }
        
        return jsonify(enhanced_data), 200
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({'message': f'Error occurred: {e}'}), 500

@weather_bp.route('/forecast', methods=['GET'])
@jwt_required()
def get_weather_forecast():
    try:
        latitude = request.args.get('lat')
        longitude = request.args.get('lon')
        city = request.args.get('city')

        params = {
            'appid': API_KEY,
            'units': 'metric'
        }

        if city:
            params['q'] = city
        elif latitude and longitude:
            params['lat'] = latitude
            params['lon'] = longitude
        else:
            return jsonify({'message': 'No valid parameters were provided'}), 400

        response = requests.get(FORECAST_BASE_URL, params=params)
        
        if response.status_code != 200:
            return jsonify({'message': 'Failed to retrieve forecast data'}), response.status_code

        data = response.json()
        
        # Processa datan för att visa en mer förståelig prognos för frontend
        forecast_data = []
        for item in data["list"]:
            forecast_entry = {
                "date": item["dt_txt"],
                "temperature": item["main"]["temp"],
                "weather": item["weather"][0]["description"],
                "wind_speed": item["wind"]["speed"],
                "wind_direction": wind_direction(item["wind"].get("deg", 0)),
                "humidity": item["main"]["humidity"],
                "pressure": item["main"]["pressure"],
            }
            forecast_data.append(forecast_entry)
        
        return jsonify(forecast_data), 200
    except Exception as e:
        print(f"Exception occurred: {e}")
        return jsonify({'message': f'Error occurred: {e}'}), 500
