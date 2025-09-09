
#* IMPORTS - CUSTOM
from PYTHON.reFormatJSON import ReFormatJSON as RFJSON
from PYTHON.ManagerDatabase import ManagerDatabase as MGDB

#* IMPORTS - LIBRARIES
import os
import time
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
frontend_url = os.getenv('FRONTEND_URL', '*')
CORS(app, resources={r"/API/*": {"origins": frontend_url}})
logging.basicConfig(level=logging.INFO)

@app.route('/API/status', methods=['GET'])
def get_status():
    data = {
        "message": "CTC Backend is running!",
        "author": "Backend Flask + Dotenv",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
        "status": "OK"
    }
    app.logger.info(f"\n   > Status endpoint was accessed.\n   > Response: {RFJSON(data).reformat("data")}")
    return jsonify(data)

@app.route('/API/sendFormData', methods=['POST'])
def handle_form_data():
    app.logger.info("   > Requeisição POST para /API/sendFormData recebida")
    if not request.is_json:
        app.logger.error("  > !!! Requisição recebida em JSON !!!")
        return jsonify({
            "message": "Content-Type deve ser application/json"
        }), 400
    dados = request.get_json()
    nome = dados.get('nome')
    email = dados.get('email')
    password = dados.get('password')
    if not all([nome, email, password]):
        app.logger.error("  > !!! Dados incompletos no formulario !!!")
        return jsonify({
            "message": "Nome, email e password são obrigatorios"
        }), 400
    app.logger.info(f"  > Dados recebidos e validos:\n      > Nome: {nome}\n      > Email: {email}")
    MGDB().create("auditor", {
        "nome":     nome,
        "email":    email,
        "senha":    password
    })
    return jsonify({
        "message": "Dados recebidos com sucesso!",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
    }), 201

if __name__ == '__main__': app.run(debug=True)
