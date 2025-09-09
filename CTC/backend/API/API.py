
#* IMPORTS - CUSTOM
from PYTHON.reFormatJSON import ReFormatJSON as RFJSON
from PYTHON.ManagerDatabase import ManagerDatabase as MGDB

#* IMPORTS - LIBRARIES
import os
import time
import logging
import sqlite3
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


# Checklits
@app.route('/API/checklists', methods=['GET'])
def list_checklists():
    app.logger.info("GET /API/checklists")
    db = MGDB()
    # usando JOIN para trazer o nome do criador
    query = """
        SELECT c.id_checklist, c.nome, c.descricao, c.criado_em, c.criado_por,
               a.nome as criador_nome
        FROM checklist c
        LEFT JOIN auditor a ON c.criado_por = a.id_auditor
        ORDER BY c.criado_em DESC
    """
    results = db._execute(query, (), fetch=True)
    return jsonify({"checklists": results}), 200

@app.route('/API/checklist', methods=['POST'])
def create_checklist():
    app.logger.info("POST /API/checklist")
    if not request.is_json:
        return jsonify({"message": "Content-Type deve ser application/json"}), 400
    data = request.get_json()
    nome = data.get('nome')
    descricao = data.get('descricao', '')
    criado_por = data.get('criado_por')

    if not all([nome, criado_por]):
        return jsonify({"message": "Campos obrigatórios: nome, criado_por (id do auditor)"}), 400

    db_path = MGDB().db_path  
    conn = sqlite3.connect(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO checklist (nome, descricao, criado_por) VALUES (?, ?, ?)",
            (nome, descricao, criado_por)
        )
        conn.commit()
        new_id = cursor.lastrowid
    except Exception as e:
        app.logger.error(f"Erro ao inserir checklist: {e}")
        return jsonify({"message": "Erro ao criar checklist"}), 500
    finally:
        conn.close()

    return jsonify({"message": "Checklist criada com sucesso", "id_checklist": new_id}), 201

@app.route('/API/checklist/<int:checklist_id>', methods=['GET'])
def get_checklist(checklist_id):
    app.logger.info(f"GET /API/checklist/{checklist_id}")
    db = MGDB()

    # checklist
    checklist_rows = db.read("checklist", {"id_checklist": checklist_id})
    if not checklist_rows:
        return jsonify({"message": "Checklist não encontrada"}), 404
    checklist = checklist_rows[0]

    # criterios da checklist
    criterios = db.read("criterio", {"id_checklist": checklist_id})

    # projetos
    projetos = db.read("projeto", {}) 

    # avaliações relacionadas
    avaliacoes = db.read("avaliacao", {"id_checklist": checklist_id})

    response = {
        "checklist": checklist,
        "criterios": criterios,
        "projetos": projetos,
        "avaliacoes": avaliacoes
    }
    return jsonify(response), 200

@app.route('/API/checklist/<int:checklist_id>', methods=['DELETE'])
def delete_checklist(checklist_id):
    app.logger.info(f"DELETE /API/checklist/{checklist_id}")
    db = MGDB()

    criterios = db.read("criterio", {"id_checklist": checklist_id})
    criterio_ids = [c["id_criterio"] for c in criterios] if criterios else []

    if criterio_ids:
        for cid in criterio_ids:
            db.delete("nao_conformidade", {"id_criterio": cid})

    avaliacoes = db.read("avaliacao", {"id_checklist": checklist_id})
    avaliacao_ids = [a["id_avaliacao"] for a in avaliacoes] if avaliacoes else []
    if avaliacao_ids:
        for aid in avaliacao_ids:
            db.delete("nao_conformidade", {"id_avaliacao": aid})
        db.delete("avaliacao", {"id_checklist": checklist_id})

    if criterio_ids:
        db.delete("criterio", {"id_checklist": checklist_id})

    db.delete("checklist", {"id_checklist": checklist_id})

    return jsonify({"message": "Checklist e dados relacionados removidos com sucesso"}), 200

# Critérios
@app.route('/API/criterio', methods=['POST'])
def create_criterio():
    app.logger.info("POST /API/criterio")
    if not request.is_json:
        return jsonify({"message": "Content-Type deve ser application/json"}), 400
    data = request.get_json()
    descricao = data.get('descricao')
    classificacao = data.get('classificacao', '')
    id_checklist = data.get('id_checklist')

    if not all([descricao, id_checklist]):
        return jsonify({"message": "Campos obrigatórios: descricao, id_checklist"}), 400

    MGDB().create("criterio", {
        "descricao": descricao,
        "classificacao": classificacao,
        "id_checklist": id_checklist
    })
    return jsonify({"message": "Critério criado"}), 201

# Projeto
@app.route('/API/projeto', methods=['POST'])
def create_projeto():
    app.logger.info("POST /API/projeto")
    if not request.is_json:
        return jsonify({"message": "Content-Type deve ser application/json"}), 400
    data = request.get_json()
    nome = data.get('nome')
    descricao = data.get('descricao', '')
    responsavel_nome = data.get('responsavel_nome', '')
    responsavel_email = data.get('responsavel_email', '')
    gestor_email = data.get('gestor_email', '')

    if not nome:
        return jsonify({"message": "Campo obrigatório: nome"}), 400

    MGDB().create("projeto", {
        "nome": nome,
        "descricao": descricao,
        "responsavel_nome": responsavel_nome,
        "responsavel_email": responsavel_email,
        "gestor_email": gestor_email
    })
    return jsonify({"message": "Projeto criado"}), 201


if __name__ == '__main__': app.run(debug=True)
