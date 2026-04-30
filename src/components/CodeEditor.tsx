import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onRunCode: (code: string, output: string, error: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language, onRunCode }) => {
  const [code, setCode] = useState(initialCode);
  const [isLoading, setIsLoading] = useState(true);
  const [pyodideLoaded, setPyodideLoaded] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const outputRef = useRef<string>('');
  const errorRef = useRef<string>('');
  const pyodideRef = useRef<any>(null);

  useEffect(() => {
    const loadPyodide = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
        script.type = 'text/javascript';
        
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('加载Pyodide脚本失败'));
          document.body.appendChild(script);
        });

        const pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
        });
        
        await pyodide.loadPackage(['pandas', 'numpy', 'micropip']);
        await pyodide.runPythonAsync(`
          import micropip
          await micropip.install('scikit-learn')
        `);
        
        await pyodide.runPythonAsync(`
import pandas as pd
import numpy as np
from io import StringIO
import json

def load_csv_from_url(url):
    import pyodide.http
    content = pyodide.http.pyfetch(url).await_.string().await_
    return pd.read_csv(StringIO(content))

orders_data = """order_id,customer_id,order_date,amount,status
1001,1,2024-01-01,150.50,completed
1002,2,2024-01-01,280.00,completed
1003,1,2024-01-02,95.00,pending
1004,3,2024-01-02,520.75,completed
1005,2,2024-01-03,120.00,cancelled
1006,4,2024-01-03,890.00,completed
1007,5,2024-01-04,350.00,completed
1008,3,2024-01-04,180.00,completed
1009,6,2024-01-05,420.00,pending
1010,4,2024-01-05,650.00,completed
1011,5,2024-01-06,290.00,completed
1012,7,2024-01-06,110.50,cancelled
1013,6,2024-01-07,780.00,completed
1014,8,2024-01-07,320.00,completed
1015,7,2024-01-08,195.00,completed"""

user_logs_data = """user_id,timestamp,url
1,2024-01-01 08:30:00,/home/
1,2024-01-01 08:35:00,/product/123/
1,2024-01-01 08:40:00,/product/123/detail/
1,2024-01-01 08:45:00,/purchase/
2,2024-01-01 09:00:00,/home/
2,2024-01-01 09:05:00,/category/electronics/
2,2024-01-01 09:10:00,/product/456/
3,2024-01-01 10:00:00,/home/
3,2024-01-01 10:05:00,/search/?q=phone
3,2024-01-01 10:10:00,/product/789/
3,2024-01-01 10:15:00,/product/789/detail/
4,2024-01-01 22:00:00,/home/
4,2024-01-01 22:05:00,/product/321/
4,2024-01-01 22:10:00,/purchase/
5,2024-01-02 00:30:00,/home/
5,2024-01-02 00:35:00,/product/654/
5,2024-01-02 00:40:00,/cart/
5,2024-01-02 00:45:00,/checkout/"""

transactions_data = """order_id,product_name,quantity,price
T001,牛奶,2,12.00
T001,面包,3,8.50
T001,鸡蛋,10,15.00
T002,可乐,1,5.50
T002,薯片,2,8.00
T003,牛奶,1,6.00
T003,饼干,2,10.00
T004,水果礼盒,1,88.00
T005,饮料组合,1,58.00
T005,零食礼包,1,45.00
T006,牛奶,3,18.00
T006,酸奶,2,14.00
T006,面包,2,17.00"""

customer_transactions_data = """customer_id,transaction_id,transaction_date,amount
1,T1,2024-01-01,150.00
1,T2,2024-01-05,200.00
1,T3,2024-01-12,180.00
2,T4,2024-01-02,320.00
2,T5,2024-01-08,280.00
3,T6,2024-01-03,1500.00
3,T7,2024-01-15,2000.00
3,T8,2024-01-28,1800.00
4,T9,2024-01-04,450.00
5,T10,2024-01-06,890.00
5,T11,2024-01-20,650.00
6,T12,2024-01-07,120.00
7,T13,2024-01-09,560.00
7,T14,2024-01-18,420.00
7,T15,2024-01-25,380.00
8,T16,2024-01-10,950.00
9,T17,2024-01-11,280.00
10,T18,2024-01-13,3200.00
10,T19,2024-01-22,2800.00"""

sales_data = """date,sales,is_holiday
2024-01-01,12500,1
2024-01-02,8500,0
2024-01-03,9200,0
2024-01-04,8800,0
2024-01-05,11000,0
2024-01-06,13500,0
2024-01-07,14200,0
2024-01-08,9800,0
2024-01-09,8200,0
2024-01-10,8900,0
2024-01-11,9500,0
2024-01-12,12800,0
2024-01-13,13800,0
2024-01-14,15000,1
2024-01-15,10500,0
2024-01-16,9200,0
2024-01-17,8800,0
2024-01-18,9600,0
2024-01-19,11200,0
2024-01-20,14500,0"""

user_events_data = """user_id,date,event_type
1,2024-01-01,signup
1,2024-01-01,login
1,2024-01-01,add_to_cart
1,2024-01-01,purchase
2,2024-01-01,signup
2,2024-01-01,login
2,2024-01-02,login
3,2024-01-02,signup
3,2024-01-02,login
3,2024-01-03,login
3,2024-01-03,add_to_cart
4,2024-01-02,signup
4,2024-01-02,login
5,2024-01-03,signup
5,2024-01-03,login
5,2024-01-03,purchase
6,2024-01-03,signup
6,2024-01-04,login
7,2024-01-04,signup
7,2024-01-04,login
7,2024-01-05,login
7,2024-01-05,add_to_cart
7,2024-01-05,purchase"""

ab_test_data = """user_id,group,converted
1,control,0
2,test,1
3,control,0
4,test,1
5,control,1
6,test,0
7,control,0
8,test,1
9,control,0
10,test,1
11,control,0
12,test,0
13,control,1
14,test,1
15,control,0
16,test,1
17,control,0
18,test,0
19,control,0
20,test,1
21,control,1
22,test,1
23,control,0
24,test,1
25,control,0"""

user_features_data = """user_id,total_amount,frequency,recency,avg_order_value
1,530.00,3,5,176.67
2,600.00,2,10,300.00
3,5300.00,3,3,1766.67
4,450.00,1,18,450.00
5,1540.00,2,12,770.00
6,120.00,1,16,120.00
7,1360.00,3,8,453.33
8,950.00,1,12,950.00
9,280.00,1,13,280.00
10,6000.00,2,10,3000.00
11,890.00,2,5,445.00
12,1560.00,4,2,390.00
13,420.00,2,15,210.00
14,780.00,2,8,390.00
15,2340.00,5,1,468.00"""

basket_data = """order_id,product_id,price,quantity,discount,profit_margin
B001,P001,150.00,1,0.10,0.35
B001,P002,80.00,2,0.10,0.25
B002,P003,280.00,1,0.05,0.40
B003,P001,150.00,1,0.00,0.35
B003,P004,520.00,1,0.15,0.30
B003,P005,95.00,1,0.00,0.20
B004,P006,890.00,1,0.20,0.45
B005,P002,80.00,3,0.15,0.25
B005,P007,350.00,1,0.10,0.38
B006,P008,180.00,2,0.05,0.28
B007,P009,420.00,1,0.00,0.32
B008,P001,150.00,2,0.12,0.35
B008,P003,280.00,1,0.12,0.40
B008,P005,95.00,1,0.12,0.20"""

users_data = """user_id,name,gender,age,registration_date
1,张三,M,28,2024-01-01
2,李四,F,32,2024-01-01
3,王五,M,45,2024-01-02
4,赵六,F,25,2024-01-02
5,钱七,M,30,2024-01-03
6,孙八,F,35,2024-01-03
7,周九,M,22,2024-01-04
8,吴十,F,40,2024-01-04"""

products_data = """product_id,product_name,category,price,stock
P001,手机,电子产品,1500.00,100
P002,耳机,电子产品,280.00,200
P003,笔记本电脑,电子产品,5200.00,50
P004,平板,电子产品,3500.00,80
P005,充电宝,电子产品,95.00,300
P006,智能手表,电子产品,890.00,150
P007,路由器,电子产品,350.00,120
P008,数据线,电子产品,80.00,500
P009,鼠标,电子产品,180.00,250
P010,键盘,电子产品,420.00,180"""

reviews_data = """order_id,product_id,review_date,rating,comment
1001,P001,2024-01-02,5,非常好用
1002,P002,2024-01-03,4,音质不错
1003,P003,2024-01-04,5,性能很好
1004,P001,2024-01-05,3,一般般
1005,P004,2024-01-06,5,很满意
1006,P005,2024-01-07,4,价格实惠
1007,P006,2024-01-08,5,功能强大
1008,P007,2024-01-09,3,信号一般
1009,P008,2024-01-10,4,质量不错
1010,P009,2024-01-11,5,手感很好"""

def load_orders():
    return pd.read_csv(StringIO(orders_data))

def load_user_logs():
    return pd.read_csv(StringIO(user_logs_data))

def load_transactions():
    return pd.read_csv(StringIO(transactions_data))

def load_customer_transactions():
    return pd.read_csv(StringIO(customer_transactions_data))

def load_sales_data():
    return pd.read_csv(StringIO(sales_data))

def load_user_events():
    return pd.read_csv(StringIO(user_events_data))

def load_ab_test():
    return pd.read_csv(StringIO(ab_test_data))

def load_user_features():
    return pd.read_csv(StringIO(user_features_data))

def load_basket_data():
    return pd.read_csv(StringIO(basket_data))

def load_users():
    return pd.read_csv(StringIO(users_data))

def load_products():
    return pd.read_csv(StringIO(products_data))

def load_reviews():
    return pd.read_csv(StringIO(reviews_data))
        `);
        
        pyodideRef.current = pyodide;
        setPyodideLoaded(true);
      } catch (err: any) {
        console.error('加载Pyodide失败:', err);
        setLoadError(`加载Python环境失败: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    loadPyodide();

    return () => {
      if (pyodideRef.current) {
        try {
          pyodideRef.current.destroy();
        } catch (e) {
          console.error('销毁Pyodide失败:', e);
        }
      }
    };
  }, []);

  const runCode = async () => {
    if (!pyodideRef.current) {
      onRunCode(code, '', 'Python环境未加载，请刷新页面重试');
      return;
    }

    setIsRunning(true);
    outputRef.current = '';
    errorRef.current = '';

    try {
      const pyodide = pyodideRef.current;
      
      const oldStdout = pyodide.setStdout((text: string) => {
        outputRef.current += text;
        console.log('Python stdout:', text);
      });
      const oldStderr = pyodide.setStderr((text: string) => {
        errorRef.current += text;
        console.error('Python stderr:', text);
      });

      console.log('开始执行Python代码...');
      console.log('代码内容:', code);
      
      await pyodide.runPythonAsync(code);
      console.log('Python代码执行完成');
      
      pyodide.setStdout(oldStdout);
      pyodide.setStderr(oldStderr);
    } catch (err: any) {
      const errorMessage = err.toString();
      errorRef.current += `执行错误: ${errorMessage}`;
      console.error('Python执行错误:', errorMessage);
    } finally {
      console.log('最终输出:', outputRef.current);
      console.log('最终错误:', errorRef.current);
      if (!outputRef.current && !errorRef.current) {
        outputRef.current = '代码执行完成，但没有输出结果。请检查代码中是否有print语句。';
      }
      onRunCode(code, outputRef.current, errorRef.current);
      setIsRunning(false);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">代码编辑器</h3>
        <button
          onClick={runCode}
          disabled={isLoading || !pyodideLoaded || isRunning}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '加载中...' : isRunning ? '执行中...' : '运行代码'}
        </button>
      </div>
      <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
        <Editor
          height="400px"
          language={language}
          value={code}
          onChange={(newValue) => setCode(newValue || initialCode)}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 4,
            automaticLayout: true,
          }}
        />
      </div>
      {isLoading && (
        <div className="mt-2 text-sm text-gray-500">
          正在加载Python环境，请稍候...
        </div>
      )}
      {loadError && (
        <div className="mt-2 text-sm text-red-600">
          {loadError}
        </div>
      )}
      {pyodideLoaded && !isLoading && (
        <div className="mt-2 text-sm text-green-600">
          Python环境加载成功，可以运行代码
        </div>
      )}
    </div>
  );
};

export default CodeEditor;