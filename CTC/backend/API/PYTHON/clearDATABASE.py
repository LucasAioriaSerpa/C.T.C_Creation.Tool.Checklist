
#* IMPORTS - CUSTOM
from ManagerDatabase import ManagerDatabase as MGDB

#* IMPORTS - LIBRARIES
...

class ClearDatabase:
    def __init__(self):
        self.db = MGDB()

    def clear_all_data(self):
        print("Clearing all data from the database...")
        tables = [
            "nao_conformidade",
            "resposta",
            "avaliacao",
            "criterio",
            "checklist",
            "projeto",
            "auditor"
        ]
        for table in tables: self.db._execute(f"DELETE FROM sqlite_sequence WHERE name='{table}';")
        self.db._execute('PRAGMA foreign_keys = ON;')
        self.db._execute("DELETE FROM nao_conformidade;")
        self.db._execute("DELETE FROM resposta;")
        self.db._execute("DELETE FROM avaliacao;")
        self.db._execute("DELETE FROM criterio;")
        self.db._execute("DELETE FROM checklist;")
        self.db._execute("DELETE FROM projeto;")
        self.db._execute("DELETE FROM auditor;")
        print("All data cleared from the database!")

if __name__ == "__main__":
    clearer = ClearDatabase()
    clearer.clear_all_data()
