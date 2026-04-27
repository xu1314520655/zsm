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

  // 初始化Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        
        // 动态加载Pyodide
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js';
        script.type = 'text/javascript';
        
        await new Promise<void>((resolve, reject) => {
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('加载Pyodide脚本失败'));
          document.body.appendChild(script);
        });

        // @ts-ignore - 全局Pyodide对象
        const pyodide = await (window as any).loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
        });
        
        // 安装必要的包
        await pyodide.loadPackage(['pandas', 'numpy', 'micropip']);
        await pyodide.runPythonAsync(`
          import micropip
          await micropip.install('scikit-learn')
        `);
        
        // 定义data_dir变量
        pyodide.globals.set('data_dir', 'https://raw.githubusercontent.com/xu1314520655/zsm/master/public/data/');
        
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

  // 运行代码
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
      
      // 重定向标准输出
      pyodide.setStdout((text: string) => {
        outputRef.current += text;
        console.log('Python stdout:', text);
      });
      pyodide.setStderr((text: string) => {
        errorRef.current += text;
        console.error('Python stderr:', text);
      });

      // 执行代码
      console.log('开始执行Python代码...');
      await pyodide.runPythonAsync(code);
      console.log('Python代码执行完成');
    } catch (err: any) {
      const errorMessage = err.toString();
      errorRef.current += `执行错误: ${errorMessage}`;
      console.error('Python执行错误:', errorMessage);
    } finally {
      console.log('输出:', outputRef.current);
      console.log('错误:', errorRef.current);
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