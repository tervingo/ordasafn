# -*- coding: utf-8 -*-

from flask import Flask, request, jsonify
import requests
from dotenv import load_dotenv
import os
import logging
from logging.handlers import RotatingFileHandler
from flask_cors import CORS


load_dotenv()  # Carga variables de entorno desde .env

app = Flask(__name__)
CORS(app)

# Configurar logging
logger = logging.getLogger(__name__)
logger.setLevel(logging.INFO)

# Handler para consola
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.INFO)

# Handler para archivo
file_handler = RotatingFileHandler('app.log', maxBytes=10000, backupCount=3, encoding='utf-8')
file_handler.setLevel(logging.INFO)


# Formato para los logs
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# Agregar handlers al logger
logger.addHandler(console_handler)
logger.addHandler(file_handler)


BIN_API_URL = "https://bin.arnastofnun.is/api/ord"
#DICT_API_URL = "https://api.example.com/dictionary"  # Reemplaza con la URL real del diccionario

@app.route('/api/word-info')
def word_info():
    logger.warning("Entering word_info")
    word = request.args.get('word')
    logger.warning(f"The value of word is: {word}")
    
    if not word:
        logger.warning("No word provided in request")
        return jsonify({"error": "No word provided"}), 400
    
    try:

        # Obtener información de inflexión
        bin_response = requests.get(f"{BIN_API_URL}/{word}")
        logger.warning(f"The value of bin_response is: {bin_response}")

        inflection_data = bin_response.json() if bin_response.ok else None
        logger.warning(f"The value of inflection_data is: {inflection_data}")

        # Obtener traducción
#        dict_response = requests.get(f"{DICT_API_URL}/{word}", headers={"Authorization": f"Bearer {os.getenv('DICT_API_KEY')}"})
    #    translation = dict_response.json()['translation'] if dict_response.ok else None

        return jsonify({
            "inflection": inflection_data,
    #        "translation": translation
        })

    except requests.exceptions.RequestException as e:
        logger.error(f"Error making API request: {str(e)}")
        return jsonify({"error": "Error connecting to external API"}), 500


if __name__ == '__main__':
    app.run(debug=True)