from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
import io
import sys
import traceback

app = Flask(__name__)

# 数据文件目录
data_dir = './public/data/'

# 捕获标准输出
class Capturing:
    def __init__(self):
        self.buffer = io.StringIO()
        self.old_stdout = sys.stdout
    def __enter__(self):
        sys.stdout = self.buffer
        return self
    def __exit__(self, *args):
        sys.stdout = self.old_stdout

@app.route('/api/run-python', methods=['POST'])
def run_python():
    code = request.json.get('code', '')
    
    output = ''
    error = ''
    
    try:
        # 导入必要的库
        exec_globals = {
            'pd': pd,
            'np': np,
            'data_dir': data_dir
        }
        
        with Capturing() as capture:
            exec(code, exec_globals)
        output = capture.buffer.getvalue()
    except Exception as e:
        error = traceback.format_exc()
    
    return jsonify({
        'output': output,
        'error': error
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)