import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { codeFiles, CodeFile } from '../data/openwrtScripts';
import { FileCode, Copy, Check, Download, Terminal, Smartphone, Github, BookOpen } from 'lucide-react';

export const CodebaseScreen: React.FC = () => {
  const { addToast, t } = useApp();
  const [selectedFile, setSelectedFile] = useState<CodeFile>(codeFiles[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    addToast(t('copyCode'), 'success');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([selectedFile.code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = selectedFile.filename.split('/').pop() || 'file.txt';
    a.click();
    URL.revokeObjectURL(url);
    addToast(t('downloadZip'), 'success');
  };

  const getCategoryIcon = (category: CodeFile['category']) => {
    switch (category) {
      case 'openwrt':
        return <Terminal className="w-4 h-4 text-[#00C2FF]" />;
      case 'kotlin':
        return <Smartphone className="w-4 h-4 text-[#20D080]" />;
      case 'github':
        return <Github className="w-4 h-4 text-purple-400" />;
      default:
        return <BookOpen className="w-4 h-4 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-6 animate-in fade-in duration-300">
      {/* Header */}
      <div>
        <h2 className="text-xl font-extrabold text-slate-100 flex items-center gap-2">
          <FileCode className="w-6 h-6 text-[#00C2FF]" />
          {t('codebase')}
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          {t('codebaseSubtitle')}
        </p>
      </div>

      {/* Main File Browser Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* File Tree Sidebar */}
        <div className="bg-[#171A21] p-4 rounded-3xl border border-[#262A36] space-y-2">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 px-2">
            Project Source Files
          </h3>

          <div className="space-y-1">
            {codeFiles.map((file) => {
              const isSelected = selectedFile.filename === file.filename;
              return (
                <button
                  key={file.filename}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-3 rounded-2xl transition-all border flex items-center gap-2.5 ${
                    isSelected
                      ? 'bg-[#00C2FF]/15 text-[#00C2FF] border-[#00C2FF]/40 font-bold'
                      : 'bg-[#0F1117] text-slate-300 border-[#262A36] hover:bg-white/5 font-medium'
                  }`}
                >
                  {getCategoryIcon(file.category)}
                  <div className="min-w-0 flex-1">
                    <span className="text-xs block font-mono truncate">
                      {file.filename}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Syntax Highlighted Code Viewer */}
        <div className="md:col-span-2 bg-[#171A21] p-5 rounded-3xl border border-[#262A36] shadow-xl flex flex-col">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#262A36] mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-100 font-mono">
                {selectedFile.filename}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">{selectedFile.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-xl bg-[#0F1117] border border-[#262A36] hover:border-[#00C2FF] text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-[#20D080]" />
                ) : (
                  <Copy className="w-3.5 h-3.5 text-[#00C2FF]" />
                )}
                <span>{copied ? 'Copied!' : t('copyCode')}</span>
              </button>

              <button
                onClick={handleDownload}
                className="px-3 py-1.5 rounded-xl bg-[#00C2FF] text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 hover:opacity-90"
              >
                <Download className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Download</span>
              </button>
            </div>
          </div>

          {/* Code Viewer Container */}
          <div className="bg-[#0F1117] p-4 rounded-2xl border border-[#262A36] overflow-x-auto max-h-[500px]">
            <pre className="font-mono text-xs text-slate-200 leading-relaxed whitespace-pre font-medium">
              <code>{selectedFile.code}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
