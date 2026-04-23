import React, { useState, useEffect, useRef } from 'react';
import Editor from '@monaco-editor/react';

// @ts-ignore - Pyodide类型定义暂时忽略
import * as Pyodide from 'pyodide';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onRunCode: (code: string, output: string, error: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language, onRunCode }) => {
  const [code, setCode] = useState(initialCode);
  const [pyodide, setPyodide] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const outputRef = useRef<string>('');
  const errorRef = useRef<string>('');

  // 初始化Pyodide
  useEffect(() => {
    const loadPyodide = async () => {
      try {
        const pyodideInstance = await Pyodide.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.26.1/full/',
        });
        
        // 安装pandas和numpy
        await pyodideInstance.loadPackage(['pandas', 'numpy', 'micropip']);
        await pyodideInstance.runPythonAsync(`
          import micropip
          await micropip.install('scikit-learn')
        `);
        
        // 定义data_dir变量
        pyodideInstance.globals.set('data_dir', 'https://raw.githubusercontent.com/xu1314520655/zsm/master/public/data/');
        
        setPyodide(pyodideInstance);
        setIsLoading(false);
      } catch (err) {
        console.error('加载Pyodide失败:', err);
        setIsLoading(false);
      }
    };

    loadPyodide();

    return () => {
      if (pyodide) {
        pyodide.destroy();
      }
    };
  }, []);

  // 运行代码
  const runCode = async () => {
    if (!pyodide) return;

    outputRef.current = '';
    errorRef.current = '';

    try {
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
      errorRef.current += errorMessage;
      console.error('Python执行错误:', errorMessage);
    } finally {
      console.log('输出:', outputRef.current);
      console.log('错误:', errorRef.current);
      onRunCode(code, outputRef.current, errorRef.current);
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">代码编辑器</h3>
        <button
          onClick={runCode}
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? '加载中...' : '运行代码'}
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
    </div>
  );
};

export default CodeEditor;