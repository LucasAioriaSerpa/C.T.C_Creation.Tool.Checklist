
#* IMPORTS
import time
from flask import Flask

app = Flask(__name__)

@app.route('/API/status')
def get_current_time(): return {
        'status': 'API is running',
        'time': time.time()
    }
