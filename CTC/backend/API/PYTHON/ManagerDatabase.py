import sqlite3
import pathlib

class ManagerDatabase:
    def __init__(self):
        base_path = pathlib.Path(__file__).parent.parent.parent.parent
        self.db_path = base_path / "backend" / "database" / "db_ctc.db"

    def connect(self):
        return sqlite3.connect(self.db_path)

    def _execute(self, query, values=(), fetch=False):
        with self.connect() as conn:
            conn.row_factory = sqlite3.Row if fetch else None
            cursor = conn.cursor()
            cursor.execute(query, values)
            if fetch:
                rows = cursor.fetchall()
                return [dict(row) for row in rows]
            else:
                conn.commit()
                return None

    def create(self, table, data: dict):
        columns = ", ".join(data.keys())
        placeholders = ", ".join(["?" for _ in data])
        values = tuple(data.values())
        query = f"INSERT INTO {table} ({columns}) VALUES ({placeholders})"
        self._execute(query, values)

    def read(self, table, conditions: dict[None, None]):
        query = f"SELECT * FROM {table}"
        values = ()
        if conditions:
            condition = " AND ".join([f"{col}=?" for col in conditions.keys()])
            query += f" WHERE {condition}"
            values = tuple(conditions.values())
        return self._execute(query, values, fetch=True)

    def update(self, table, data: dict, conditions: dict):
        set_value = ", ".join([f"{col}=?" for col in data.keys()])
        condition = " AND ".join([f"{col}=?" for col in conditions.keys()])
        values = tuple(data.values()) + tuple(conditions.values())
        query = f"UPDATE {table} SET {set_value} WHERE {condition}"
        self._execute(query, values)

    def delete(self, table, conditions: dict):
        condition = " AND ".join([f"{col}=?" for col in conditions.keys()])
        values = tuple(conditions.values())
        query = f"DELETE FROM {table} WHERE {condition}"
        self._execute(query, values)



# INSERIR
# ManagerDatabase().create("nome_tabela", {"atributo_tabela": "valor_campo", "atributo_tabela": "valor_campo"})

# VISUALIZAR
# ManagerDatabase().read("nome_tabela")) ou ManagerDatabase().("nome_tabela", {"atributo_procurado": "valor_atributo"})

# ATUALIZAR
# ManagerDatabase().update("nome_tabela", {"campo_que_sera_atualizado": "novo_valor_do_campo"}, {"atributo_procurado": "valor_procurado"})

# DELETAR
# ManagerDatabase().delete("nome_tabela", {"atributo_procurado (ex: nome)": "valor_procurado"})

