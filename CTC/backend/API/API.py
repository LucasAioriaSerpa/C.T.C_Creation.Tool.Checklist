
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
from flask_mail import Mail, Message
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
frontend_url = os.getenv('FRONTEND_URL', '*')
CORS(app, resources={r"/API/*": {"origins": frontend_url}})
logging.basicConfig(level=logging.INFO)

app.config['MAIL_SERVER'] = os.getenv('MAIL_SERVER', 'smtp.gmail.com')
app.config['MAIL_PORT'] = 587
app.config['MAIL_USERNAME'] = os.getenv('MAIL_USERNAME')
app.config['MAIL_PASSWORD'] = os.getenv('MAIL_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.getenv('MAIL_DEFAULT_SENDER')
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USE_SSL'] = False
mail = Mail(app)

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
        app.logger.error("  > !!! Requisição NÃO recebida em JSON !!!")
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
    app.logger.warning("   > ?!? TU NÃO DEVERIA ESTAR AQ! ?!?")
    return jsonify({
        "message": "???????????man como GENESIOS ÁGUADOS tu chego aq???????????"
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
        app.logger.warning("   > ?!? Nenhum dado neste usuário ?!?")
        return jsonify({
            "message": "Nenhum dado neste usuário?!"
        }), 404
    if (email != login[0]['email'] and password != login[0]['senha']):
        app.logger.warning("   > ?!? Email ou senha incorretos ?!?")
        return jsonify({
            "message": "Email ou senha incorretos."
        }), 404
    user = login[0]
    return jsonify({
        "message": f"Login bem sucedido!\n Email: {user['email']}",
        "token": "seu-token",
        "id_auditor": user['id_auditor'],
        "nome": user['nome'],
        "email": user['email']
    }), 200

# Checklits
@app.route('/API/checklists', methods=['GET'])
def list_checklists():
    app.logger.info("GET /API/checklists")
    db = MGDB()
    # usando JOIN para trazer o nome do criador
    query = """
        SELECT c.id_checklist, c.nome, c.descricao, c.criado_em, c.criado_por, a.nome as criador_nome
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
    projeto = data.get('projeto', None)
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
        id_checklist = cursor.lastrowid
        conn.commit()
        if projeto:
            projeto_nome = projeto.get('nome')
            projeto_descricao = projeto.get('descricao', '')
            responsavel_nome = projeto.get('responsavel_nome', '')
            responsavel_email = projeto.get('responsavel_email', '')
            gestor_email = projeto.get('gestor_email', '')
            if not projeto_nome: return jsonify({"message": "Campo obrigatório no projeto: nome"}), 400
            cursor.execute(
                "INSERT INTO projeto (nome, descricao, responsavel_nome, responsavel_email, gestor_email) VALUES (?, ?, ?, ?, ?)",
                (projeto_nome, projeto_descricao, responsavel_nome, responsavel_email, gestor_email)
            )
            projeto_id = cursor.lastrowid
            conn.commit()
            cursor.execute(
                "INSERT INTO avaliacao (data_avaliacao, aderencia, status, id_auditor, id_projeto, id_checklist) VALUES (?, ?, ?, ?, ?, ?)",
                (time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()), 0.0, 'pendente', criado_por, projeto_id, id_checklist))
            conn.commit()
        else: raise ValueError("Projeto não fornecido!")
    except Exception as e:
        app.logger.error(f"Erro ao inserir checklist: {e}")
        return jsonify({"message": "Erro ao criar checklist"}), 500
    finally:
        conn.close()
    return jsonify({"message": "Checklist criada com sucesso", "id_checklist": id_checklist}), 200

@app.route('/API/checklist/<int:checklist_id>', methods=['GET'])
def get_checklist(checklist_id):
    app.logger.info(f"GET /API/checklist/{checklist_id}")
    db = MGDB()
    try:
        checklist_rows = db.read("checklist", {"id_checklist": checklist_id})
        if not checklist_rows:
            return jsonify({"message": "Checklist não encontrada"}), 404
        checklist = checklist_rows[0]
        criterios = db.read("criterio", {"id_checklist": checklist_id})
        app.logger.info(f"Critérios encontrados: {len(criterios) if criterios else 0}")
        query_projetos = """
            SELECT p.* FROM projeto p
                JOIN avaliacao a ON p.id_projeto = a.id_projeto
            WHERE a.id_checklist = ?
        """
        projetos = db._execute(query_projetos, (checklist_id,), fetch=True)
        avaliacoes = db.read("avaliacao", {"id_checklist": checklist_id})
        aderencia = 0
        id_avaliacao_ativa = None
        ultima_avaliacao_ativa = None
        nao_conformidades = []
        if avaliacoes:
            query_avaliacao = "SELECT * FROM avaliacao WHERE id_checklist = ? ORDER BY data_avaliacao DESC LIMIT 1"
            avaliacao_ativa_rows = db._execute(query_avaliacao, (checklist_id,), fetch=True)
            if avaliacao_ativa_rows:
                avaliacao_ativa = avaliacao_ativa_rows[0]
                id_avaliacao_ativa = avaliacao_ativa['id_avaliacao']
                ultima_avaliacao_ativa = avaliacao_ativa['data_avaliacao']
                query_respostas_counts = """
                    SELECT
                        SUM(CASE WHEN classificacao = 'SIM' THEN 1 ELSE 0 END) AS sim_count,
                        SUM(CASE WHEN classificacao = 'N/A' THEN 1 ELSE 0 END) AS nao_aplicavel_count
                    FROM resposta
                    WHERE id_avaliacao = ?
                """
                counts_result = db._execute(query_respostas_counts, (id_avaliacao_ativa,), fetch=True)
                nao_conformidades = db.read("nao_conformidade", {"id_avaliacao": id_avaliacao_ativa})
                sim_count = counts_result[0]['sim_count'] if counts_result and counts_result[0]['sim_count'] is not None else 0
                nao_aplicavel_count = counts_result[0]['nao_aplicavel_count'] if counts_result and counts_result[0]['nao_aplicavel_count'] is not None else 0
                criterios_list = criterios if criterios is not None else []
                total_criterios = len(criterios_list)
                total_criterios_com_resposta = total_criterios - nao_aplicavel_count
                app.logger.info(f"Total critérios: {total_criterios}, SIM: {sim_count}, N/A: {nao_aplicavel_count}, Total com resposta: {total_criterios_com_resposta}")
                if total_criterios_com_resposta > 0: aderencia = sim_count / total_criterios_com_resposta
        respostas_map = {}
        if id_avaliacao_ativa:
            query_respostas = "SELECT id_criterio, classificacao FROM resposta WHERE id_avaliacao = ?"
            respostas = db._execute(query_respostas, (id_avaliacao_ativa,), fetch=True)
            if respostas is None:
                respostas = []
            for r in respostas:
                respostas_map[r['id_criterio']] = r['classificacao']
        criterios = criterios if criterios is not None else []
        for criterio in criterios:
            criterio['classificacao_resposta'] = respostas_map.get(criterio['id_criterio'], 'N/A')
        response = {
            "checklist": checklist,
            "criterios": criterios,
            "projetos": projetos,
            "avaliacoes": avaliacoes,
            "id_avaliacao": id_avaliacao_ativa,
            "ultima_avaliacao": ultima_avaliacao_ativa,
            "nao_conformidades": nao_conformidades,
            "aderencia": aderencia
        }
        db.update("avaliacao", {"aderencia": round(aderencia * 100, 2)}, {"id_avaliacao": id_avaliacao_ativa})
        return jsonify(response), 200
    except Exception as e:
        app.logger.error(f"Erro ao buscar dados da checklist com ID {checklist_id}: {e}")
        return jsonify({
            "message": "Erro interno do servidor ao buscar checklist.",
            "error_details": str(e)
        }), 500

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
        for aid in avaliacao_ids: db.delete("nao_conformidade", {"id_avaliacao": aid})
        db.delete("avaliacao", {"id_checklist": checklist_id})
    if criterio_ids: db.delete("criterio", {"id_checklist": checklist_id})
    projeto_id = avaliacoes[0]['id_projeto'] if avaliacoes else None
    projeto = db.read("projeto", {"id_projeto": projeto_id}) if projeto_id else None
    if projeto: db.delete("projeto", {"id_projeto": projeto_id})
    respostas = db.read("resposta", {"id_avaliacao": avaliacao_ids}) if avaliacao_ids else []
    if respostas: db.delete("resposta", {"id_avaliacao": avaliacao_ids})
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

@app.route('/API/criterio/<int:criterio_id>', methods=['PUT'])
def update_criterio(criterio_id):
    app.logger.info(f"PUT /API/criterio/{criterio_id}")
    if not request.is_json: return jsonify({
            "message": "Content-Type deve ser application/json"
        }), 400
    data = request.get_json()
    classificacao = data.get('classificacao')
    if classificacao not in ['SIM', 'NAO', 'N/A']: return jsonify({
            "message": "Classificação inválida. Use SIM, NAO ou N/A"
        }), 400
    db = MGDB()
    criterio = db.read("criterio", {"id_criterio": criterio_id})
    if not criterio: return jsonify({
            "message": "Critério não encontrado"
        }), 404
    db.update("criterio", {"classificacao": classificacao}, {"id_criterio": criterio_id})
    return jsonify({
        "message": "Critério atualizado com sucesso"
    }), 200

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
    return jsonify({"message": "Projeto criado"}), 200

@app.route('/API/projeto/<int:projeto_id>', methods=['DELETE'])
def delete_projeto(projeto_id):
    app.logger.info(f"   > DELETE /API/projeto/{projeto_id}")
    db = MGDB()
    result = db.delete("projeto", {'id_projeto': projeto_id})
    if result: return jsonify({
        "message": f"Projeto {projeto_id} removido com sucesso."
    }), 200
    return jsonify({
        "message": "Projeto não encontrado ou erro ao remover!"
    }), 400

@app.route('/API/projeto/<int:projeto_id>', methods=['PUT'])
def update_projeto(projeto_id):
    app.logger.info(f"  > PUT /API/projeto/{projeto_id}")
    if not request.is_json: return jsonify({'message': "Content-Type deve ser application/json"}), 400
    data = request.get_json()
    update_data = {k: v for k, v in data.items() if k != 'id_projeto'}
    if not update_data:return jsonify({'message': "Nenhum dado para atualizar"}), 400
    db = MGDB()
    try:
        result = db.update("projeto", update_data, {'id_projeto': projeto_id})
        return jsonify({
            'message': f"Projeto {projeto_id} atualizado com sucesso"
        }), 200
    except Exception as e:
        app.logger.error(f"     > Erro ao atualizar projeto: {e}")
        return jsonify({'message': "Erro ao atualizar projeto"}), 400

@app.route('/API/sendEmail', methods=['POST'])
def send_email():
    app.logger.info("POST /API/sendEmail")
    if not request.is_json: return jsonify({
        "message": "Content-Type deve ser application/json"
    }), 400
    data = request.get_json()
    autor = data.get('autor', app.config['MAIL_DEFAULT_SENDER'])
    recipiente = data.get('recipiente')
    assunto = data.get('assunto', 'Sem Assunto')
    corpo = data.get('message', '')
    if not recipiente: return jsonify({
        "message": "Erro: Campo de recipiente faltando"
    }), 400
    try:
        msg = Message(  assunto,
                        sender=autor,
                        recipients=[recipiente],
                        body=corpo
                    )
        mail.send(msg)
        app.logger.info(f"E-mail enviado para {recipiente}")
        return jsonify({
            "message": "E-mail enviado com sucesso"
        }), 200
    except Exception as e:
        app.logger.error(f"Erro ao enviar e-mail: {e}")
        return jsonify({
            "message": "Erro ao enviar e-mail"
        }), 500

@app.route('/API/avaliacao', methods=['POST'])
def create_avaliacao():
    app.logger.info("POST /API/avaliacao")
    if not request.is_json: return jsonify({
        "message": "Content-Type deve ser application/json"
    }), 400
    data = request.get_json()
    id_auditor = data.get('id_auditor')
    id_projeto = data.get('id_projeto')
    id_checklist = data.get('id_checklist')
    if not all([id_auditor, id_projeto, id_checklist]): return jsonify({
        "message": "Campos obrigatórios: id_auditor, id_projeto, id_checklist"
    }), 400
    try:
        MGDB().create("avaliacao", {
            "id_auditor": id_auditor,
            "id_projeto": id_projeto,
            "id_checklist": id_checklist
        })
        return jsonify({
            "message": "Avaliação criada"
        }), 200
    except Exception as e:
        app.logger.error(f"     > Erro ao criar avaliação: {e}")
        return jsonify({
            "message": "Erro ao criar avaliação"
        }), 400

@app.route('/API/avaliacao/<int:avaliacao_id>/respostas', methods=['GET'])
def get_respostas_avaliacao(avaliacao_id):
    app.logger.info(f"GET /API/avaliacao/{avaliacao_id}/respostas")
    db = MGDB()
    respostas = db.read("resposta", {"id_avaliacao": avaliacao_id})
    return jsonify(respostas), 200

@app.route('/API/naoconformidade', methods=['POST'])
def create_nao_conformidade():
    app.logger.info("POST /API/naoconformidade")
    if not request.is_json:
        return jsonify({
            "message": "Content-Type deve ser application/json"
        }), 400
    data = request.get_json()
    app.logger.info(f"  > Dados recebidos: {data}")
    id_avaliacao = data.get('id_avaliacao')
    id_criterio = data.get('id_criterio')
    prazo = data.get('prazo')
    db = MGDB()
    criterio = db.read("criterio", {"id_criterio": id_criterio})
    descricao = criterio[0]['descricao'] if criterio else None
    if not all([prazo, id_avaliacao, id_criterio]):
        return jsonify({
            "message": "Campos obrigatórios: descricao, prazo, id_avaliacao, id_criterio"
        }), 400
    nc_existente = db.read("nao_conformidade", {"id_avaliacao": id_avaliacao, "id_criterio": id_criterio})
    if nc_existente:
        return jsonify({
            "message": "Já existe uma não conformidade registrada para este critério nesta avaliação."
        }), 400
    try:
        db.create("nao_conformidade", {
            "descricao": descricao,
            "prazo": prazo,
            "status": "pendente",
            "ultima_atualizacao": time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()),
            "tentativas": 0,
            "id_avaliacao": id_avaliacao,
            "id_criterio": id_criterio
        })
        return jsonify({
            "message": "Não conformidade registrada com sucesso!"
        }), 200
    except Exception as e:
        app.logger.error(f"     > Erro ao criar não conformidade: {e}")
        return jsonify({
            "message": "Erro ao criar não conformidade"
        }), 400

@app.route('/API/naoconformidade/<int:nc_id>', methods=['PUT'])
def update_nao_conformidade(nc_id):
    app.logger.info(f"PUT /API/naoconformidade/{nc_id}")
    if not request.is_json: return jsonify({
        "message": "Content-Type deve ser application/json"
    }), 400
    data = request.get_json()
    db = MGDB()
    try:
        existing_nc = db.read("nao_conformidade", {"id_nao_conformidade": nc_id})
        if not existing_nc: return jsonify({
            "message": "Não conformidade não encontrada"
        }), 404
        update_fields = {}
        if 'prazo' in data:
            update_fields['prazo'] = data['prazo']
        if 'status' in data:
            update_fields['status'] = data['status']
        if not update_fields: return jsonify({
            "message": "Nenhum campo para atualizar fornecido"
        }), 400
        update_fields['ultima_atualizacao'] = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())
        db.update("nao_conformidade", {"id_nao_conformidade": nc_id}, {"$set": update_fields})
        return jsonify({
            "message": "Não conformidade atualizada com sucesso!"
        }), 200
    except Exception as e:
        app.logger.error(f"  > Erro ao atualizar não conformidade: {e}")
        return jsonify({
            "message": "Erro ao atualizar não conformidade"
        }), 500

@app.route('/API/resposta', methods=['PUT'])
def update_resposta():
    app.logger.info("PUT /API/resposta")
    if not request.is_json:
        return jsonify({
            "message": "Content-Type deve ser application/json"
        }), 400
    data = request.get_json()
    id_avaliacao = data.get('id_avaliacao')
    id_criterio = data.get('id_criterio')
    classificacao = data.get('classificacao')
    if not all([id_avaliacao, id_criterio, classificacao]):
        return jsonify({
            "message": "Campos obrigatórios: id_avaliacao, id_criterio, classificacao"
        }), 400
    db = MGDB()
    criterio = db.read("criterio", {"id_criterio": id_criterio})
    if not criterio:
        return jsonify({
            "message": "Critério não encontrado"
        }), 400
    db.update("criterio", {"classificacao": classificacao}, {"id_criterio": id_criterio})
    resposta_existente = db.read("resposta", {"id_avaliacao": id_avaliacao, "id_criterio": id_criterio})
    if classificacao in ["SIM", "NA"]:
        db.delete("nao_conformidade", {"id_avaliacao": id_avaliacao, "id_criterio": id_criterio})
    if resposta_existente:
        db.update("resposta", {"classificacao": classificacao}, {"id_avaliacao": id_avaliacao, "id_criterio": id_criterio})
        return jsonify({
            "message": "Resposta atualizada com sucesso"
        }), 200
    else:
        db.create("resposta", {
            "id_avaliacao": id_avaliacao,
            "id_criterio": id_criterio,
            "classificacao": classificacao,
        })
        return jsonify({
            "message": "Resposta criada com sucesso"
        }), 200

if __name__ == '__main__': app.run(debug=True)
