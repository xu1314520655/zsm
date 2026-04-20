import React from 'react';

interface CodeOutputProps {
  output: string;
  error: string;
  isLoading: boolean;
}

const CodeOutput: React.FC<CodeOutputProps> = ({ output, error, isLoading }) => {
  return (
    <div className="w-full mt-4">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">运行结果</h3>
      <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px]">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <pre className="text-red-600 font-mono text-sm whitespace-pre-wrap">{error}</pre>
        ) : (
          <pre className="text-gray-800 font-mono text-sm whitespace-pre-wrap">{output}</pre>
        )}
      </div>
    </div>
  );
};

export default CodeOutput;