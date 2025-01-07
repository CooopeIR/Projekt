# import requests
# from datetime import datetime, timezone
# import os
# import base64
# import json

# def encode_image(image_path):
#   """
#   Encode image as base64 string and ensure correct padding.
#   """
#   with open(image_path, 'rb') as img_file:
#     image_bytes = img_file.read()
  
#   # Encode image to base64 string
#   base64_string = base64.b64encode(image_bytes).decode('utf-8')
  
#   # Remove any trailing whitespaces from the encoded string
#   base64_string = base64_string.rstrip()
  
#   # Ensure padding is correct (multiple of 4)
#   padding = len(base64_string) % 4
#   if padding:
#     base64_string += '=' * (4 - padding)
  
#   return base64_string


# def send_weather_data(lambda_endpoint, city, image_path, weather_data, api_key):
#     """
#     Send weather camera data to AWS Lambda as JSON with Base64 encoded image.
#     """
#     # Encode the image
#     base64_image = encode_image(image_path)
    
#     # Create the payload
#     payload = {
#         'city': city,
#         'image': base64_image,
#         'timestamp': datetime.now(timezone.utc).isoformat(),
#         'weather_data': {
#             'humidity': str(weather_data['humidity']),
#             'air_pressure': str(weather_data['pressure']),
#             'temperature': str(weather_data['temperature'])
#         }
#     }
    
#     # Headers
#     headers = {
#         'x-api-key': api_key,
#         'Content-Type': 'application/json'
#     }
    
#     try:
#         # Send the request using json parameter
#         response = requests.post(
#             lambda_endpoint,
#             json=payload,  # Use json parameter instead of data
#             headers=headers
#         )
        
#         # # Debug information
#         # print(f"Request payload type: {type(payload)}")
#         # print(f"Request headers: {headers}")
#         # print(f"Response status code: {response.status_code}")
#         # print(f"Response headers: {dict(response.headers)}")
#         # print(f"Response content: {response.text}")
        
#         return response
        
#     except requests.exceptions.RequestException as e:
#         print(f"Request failed: {str(e)}")
#         raise

# # Example usage
# lambda_endpoint = 'https://jj365xn904.execute-api.us-east-1.amazonaws.com/prod/upload'
# city = 'st. anton'
# api_key = 'ZifLfnBzoA2kn0pSIru7x2SL3zunRIM67rOnlX4R'

# # Path to the folder containing images
# images_folder = './images/vienna'

# # Weather data (sample data; adjust as needed)
# weather_data = {
#   'temperature': 22.5,
#   'humidity': 65,
#   'pressure': 1013.2
# }

# # Send requests for all images in the folder
# for filename in os.listdir(images_folder):
#   if filename.lower().endswith(('.jpg', '.jpeg', '.png')):  # Check for valid image files
#     image_path = os.path.join(images_folder, filename)
#     print(f"Sending data for {image_path}...")
#     response = send_weather_data(lambda_endpoint, city, image_path, weather_data, api_key)
#     print(f"Status Code: {response.status_code}")
#     print(f"Response: {response.text}")

import requests
from datetime import datetime, timezone
import os
import base64
import json

def get_locations(base_url):
    """
    Fetch all locations from the API.
    """
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(
            f"{base_url}/locations",
            headers=headers
        )
        return response
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch locations: {str(e)}")
        raise

def search_locations(base_url, term):
    """
    Search locations with a specific term.
    """
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(
            f"{base_url}/locations",
            params={'term': term},
            headers=headers
        )
        return response
    except requests.exceptions.RequestException as e:
        print(f"Failed to search locations: {str(e)}")
        raise

def get_city_videos(base_url, city_id):
    """
    Fetch videos for a specific city.
    """
    headers = {
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.get(
            f"{base_url}/videos",
            params={'city_id': city_id},
            headers=headers
        )
        return response
    except requests.exceptions.RequestException as e:
        print(f"Failed to fetch city videos: {str(e)}")
        raise

def encode_image(image_path):
    """
    Encode image as base64 string and ensure correct padding.
    """
    with open(image_path, 'rb') as img_file:
        image_bytes = img_file.read()
    
    base64_string = base64.b64encode(image_bytes).decode('utf-8')
    base64_string = base64_string.rstrip()
    
    padding = len(base64_string) % 4
    if padding:
        base64_string += '=' * (4 - padding)
    
    return base64_string

def send_weather_data(lambda_endpoint, city, image_path, weather_data, api_key):
    """
    Send weather camera data to AWS Lambda as JSON with Base64 encoded image.
    """
    base64_image = encode_image(image_path)
    
    payload = {
        'city': city,
        'image': base64_image,
        'timestamp': datetime.now(timezone.utc).isoformat(),
        'weather_data': {
            'humidity': str(weather_data['humidity']),
            'air_pressure': str(weather_data['pressure']),
            'temperature': str(weather_data['temperature'])
        }
    }
    
    headers = {
        'x-api-key': api_key,
        'Content-Type': 'application/json'
    }
    
    try:
        response = requests.post(
            lambda_endpoint,
            json=payload,
            headers=headers
        )
        return response
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {str(e)}")
        raise

# Example usage
base_url = 'https://jj365xn904.execute-api.us-east-1.amazonaws.com/prod'
lambda_endpoint = f'{base_url}/upload'
city = 'Vienna'
api_key = 'ZifLfnBzoA2kn0pSIru7x2SL3zunRIM67rOnlX4R'

# First, get all locations
print("Fetching all locations...")
locations_response = get_locations(base_url)
print(f"Locations Status Code: {locations_response.status_code}")
print(f"Locations Response: {locations_response.text}\n")

# Search locations with term 'tok'
print("Searching locations with term 'tok'...")
search_response = search_locations(base_url, 'tok')
print(f"Search Status Code: {search_response.status_code}")
print(f"Search Response: {search_response.text}\n")

# Get videos for city_id 3
print("Fetching videos for city_id 3...")
videos_response = get_city_videos(base_url, 3)
print(f"Videos Status Code: {videos_response.status_code}")
print(f"Videos Response: {videos_response.text}\n")

# Weather data (sample data)
weather_data = {
    'temperature': 22.5,
    'humidity': 65,
    'pressure': 1013.2
}

# Path to the folder containing images
images_folder = './images/vienna'

# Send requests for all images in the folder
print("Processing image uploads...")
for filename in os.listdir(images_folder):
    if filename.lower().endswith(('.jpg', '.jpeg', '.png')):
        image_path = os.path.join(images_folder, filename)
        print(f"Sending data for {image_path}...")
        response = send_weather_data(lambda_endpoint, city, image_path, weather_data, api_key)
        print(f"Status Code: {response.status_code}")
        print(f"Response: {response.text}")