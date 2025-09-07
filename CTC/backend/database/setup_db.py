
import sqlite3

conn = sqlite3.connect("db_ctc.db")
cursor = conn.cursor()

cursor.execute("PRAGMA foreign_keys = ON;")

# ---------------------------
# Tabela Auditor
# ---------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS auditor (
    id_auditor INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
);
""")

# ---------------------------
# Tabela Projeto
# ---------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS projeto (
    id_projeto INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    responsavel_nome TEXT NOT NULL,
    responsavel_email TEXT NOT NULL,
    gestor_email TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    status TEXT DEFAULT 'em andamento'
);
""")

# ---------------------------
# Tabela Checklist
# ---------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS checklist (
    id_checklist INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    descricao TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP,
    criado_por INTEGER NOT NULL,
    FOREIGN KEY (criado_por) REFERENCES auditor(id_auditor)
);
""")

# ---------------------------
# Tabela Critério
# ---------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS criterio (
    id_criterio INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    classificacao TEXT NOT NULL,
    id_checklist INTEGER NOT NULL,
    FOREIGN KEY (id_checklist) REFERENCES checklist(id_checklist)
);
""")

# ---------------------------
# Tabela Avaliação
# ---------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS avaliacao (
    id_avaliacao INTEGER PRIMARY KEY AUTOINCREMENT,
    data_avaliacao TEXT DEFAULT CURRENT_TIMESTAMP,
    aderencia REAL,
    status TEXT DEFAULT 'em andamento',
    id_auditor INTEGER NOT NULL,
    id_projeto INTEGER NOT NULL,
    id_checklist INTEGER NOT NULL,
    FOREIGN KEY (id_auditor) REFERENCES auditor(id_auditor),
    FOREIGN KEY (id_projeto) REFERENCES projeto(id_projeto),
    FOREIGN KEY (id_checklist) REFERENCES checklist(id_checklist)
);
""")

# ---------------------------
# Tabela Não Conformidade
# ---------------------------
cursor.execute("""
CREATE TABLE IF NOT EXISTS nao_conformidade (
    id_nao_conformidade INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao TEXT NOT NULL,
    prazo TEXT NOT NULL,
    status TEXT DEFAULT 'pendente',
    ultima_atualizacao TEXT DEFAULT CURRENT_TIMESTAMP,
    tentativas INTEGER DEFAULT 0,
    id_avaliacao INTEGER NOT NULL,
    id_criterio INTEGER NOT NULL,
    FOREIGN KEY (id_avaliacao) REFERENCES avaliacao(id_avaliacao),
    FOREIGN KEY (id_criterio) REFERENCES criterio(id_criterio)
);
""")

# Salva e fecha conexão
conn.commit()
conn.close()

print("Banco de dados e tabelas criados com sucesso!")
