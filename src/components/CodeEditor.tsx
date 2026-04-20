import React, { useState } from 'react';
import Editor from '@monaco-editor/react';

interface CodeEditorProps {
  initialCode: string;
  language: string;
  onRunCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ initialCode, language, onRunCode }) => {
  const [code, setCode] = useState(initialCode);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">代码编辑器</h3>
        <button
          onClick={() => onRunCode(code)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all shadow-md"
        >
          运行代码
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
    </div>
  );
};

export default CodeEditor;