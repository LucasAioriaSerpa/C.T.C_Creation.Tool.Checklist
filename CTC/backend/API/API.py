
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
    app.logger.info("   > Requisição POST para /API/sendFormData recebida!")
    if not request.is_json:
        app.logger.error("   > !!! Requisição NÃO recebida em JSON !!!")
        return jsonify({
            "message": "Content-Type deve ser application/json"
        }), 400
    dados = request.get_json()
    db_table = dados.get('db-table')
    if db_table is None:
        app.logger.error("   > !!! Campo 'db-table' não fornecido na requisição !!!")
        return jsonify({
            "message": "O campo 'db-table' é obrigatorio!"
        }), 400
    match db_table:
        case 'auditor':
            nome = dados.get('nome')
            email = dados.get('email')
            password = dados.get('password')
            if not all([nome, email, password]):
                app.logger.error("   > !!! Dados incompletos no formulario !!!")
                return jsonify({
                    "message": "Nome, email e password são obrigatorios!"
                }), 400
            app.logger.info(f"   > Dados recebidos e validos:\n      > Nome: {nome}\n      > Email: {email}")
            MGDB().create(db_table, {
                "nome":  nome,
                "email": email,
                "senha": password
            })
            return jsonify({
                "message": "Dados recebidos e salvos com sucesso!",
                "timestamp": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
            }), 200
        case 'avaliacao':
            ...
        case 'checklist':
            ...
        case 'criterio':
            ...
        case 'nao_conformidade':
            ...
        case 'projeto':
            ...
        case _:
            app.logger.error(f"   > !!! Tabela '{db_table}' não reconhecida !!!")
            return jsonify({
                "message": f"Tabela '{db_table}' não reconhecida."
            }), 400
    app.logger.warning(f"   > ?!? TU NÃO DEVERIA ESTAR AQ! ?!?")
    return jsonify({
        "message": f"???????????man como GENESIOS ÁGUADOS tu chego aq???????????"
    }), 404

@app.route('/API/dados/<string:tabela>', methods=['GET'])
def get_data(tabela: str):
    app.logger.info(f"  > Requisição GET para a busca de dados da tabela: {tabela}")
    try:
        dados = MGDB().read(tabela, {})
        if dados is None:
            app.logger.warning(f"   > ?!? Tabela '{tabela}' não encontrada ?!?")
            return jsonify({
                "message": f"Tabela '{tabela}' não encontrada"
            }), 404
        if not dados:
            app.logger.warning(f"   > ?!? Tabela '{tabela}' nenhum dado encontrado ?!?")
            return jsonify({
                "message": f"Nenhum dado encontrado na tabela '{tabela}'"
            }), 404
        return jsonify(dados), 200
    except Exception as e:
        app.logger.error(f"     > !!! Ao buscar dados da tabela '{tabela}': {e}")
        return jsonify({
            "message": "Erro interno do servidor"
        }), 400

@app.route('/API/login', methods=['POST'])
def handle_login():
    app.logger.info(f"  > Requisição POST para /API/login recebida!")
    dados = request.get_json()
    email = dados.get('email')
    password = dados.get('password')
    if not all([email, password]):
        app.logger.error("   > !!! Dados incompletos no formulario !!!")
        return jsonify({
            "message": "email e password são obrigatorios!"
        }), 400
    login = MGDB().read('auditor', {"email": email, "senha": password})
    if login is None:
        app.logger.warning("   > ?!? Usuário não encontrado ?!?")
        return jsonify({
            "message": "Usuário não encontrado"
        }), 404
    if not login:
        app.logger.warning(f"   > ?!? Nenhum dado neste usuário ?!?")
        return jsonify({
            "message": "Nenhum dado neste usuário?!"
        }), 404
    if (email != login[0]['email'] and password != login[0]['senha']):
        app.logger.warning("   > ?!? Email ou senha incorretos ?!?")
        return jsonify({
            "message": "Email ou senha incorretos."
        }), 404
    return jsonify({
        "message": f"Login bem sucedido!\n Email: {email}",
        "token": "seu-token"
    }), 200

if __name__ == '__main__': app.run(debug=True)
