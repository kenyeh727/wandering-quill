import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, RefreshCw, Printer, Search, ExternalLink, Scroll, FileText, Sparkles } from 'lucide-react';
import { Button } from './Button';
import { Source } from '../types';

interface ResultViewProps {
  coverLetter: string;
  tailoredResume: string;
  sources?: Source[];
  onRegenerate: () => void;
  isGenerating: boolean;
}

export const ResultView: React.FC<ResultViewProps> = ({ 
  coverLetter, 
  tailoredResume, 
  sources = [], 
  onRegenerate, 
  isGenerating 
}) => {
  const [activeTab, setActiveTab] = useState<'resume' | 'coverLetter'>('resume');
  const [copied, setCopied] = useState(false);

  const contentToDisplay = activeTab === 'resume' ? tailoredResume : coverLetter;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(contentToDisplay);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '', 'width=800,height=600');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Wandering Quill - ${activeTab === 'resume' ? 'Tailored Resume' : 'Cover Letter'}</title>
            <style>
              body { font-family: 'Georgia', serif; line-height: 1.8; padding: 60px; max-width: 800px; margin: 0 auto; color: #2c3e50; background: #fff; }
              p { margin-bottom: 1.2em; }
              a { color: #2b5876; text-decoration: none; }
              h1, h2, h3 { color: #1a3a52; border-bottom: 1px solid #eee; padding-bottom: 10px; }
              ul { padding-left: 20px; }
              li { margin-bottom: 0.5em; }
            </style>
          </head>
          <body>
            ${contentToDisplay.replace(/\n/g, '<br/>')}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#fdf6e3] rounded-lg shadow-xl border border-[#c5a059] overflow-hidden relative">
       <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2b5876] via-[#ff6b6b] to-[#c5a059]"></div>
       
      {/* Header & Tabs */}
      <div className="flex flex-col border-b border-[#d4c5b0] bg-[#fffdf5]">
          <div className="flex items-center justify-between px-6 py-4">
            <h3 className="font-display font-bold text-[#2c3e50] flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#c5a059]" />
                Application Package
            </h3>
            <div className="flex gap-2">
            <Button 
                variant="secondary" 
                size="sm" 
                onClick={handleCopy} 
                title="Copy to Clipboard"
                className="h-9 w-9 p-0 rounded-full border border-[#d4c5b0]"
            >
                {copied ? <Check className="w-4 h-4 text-[#2b5876]" /> : <Copy className="w-4 h-4" />}
            </Button>
            <Button 
                variant="secondary" 
                size="sm" 
                onClick={handlePrint}
                title="Print / Save PDF"
                className="h-9 w-9 p-0 rounded-full border border-[#d4c5b0]"
            >
                <Printer className="w-4 h-4" />
            </Button>
            </div>
          </div>
          
          {/* Tabs */}
          <div className="flex px-6 gap-2">
              <button
                onClick={() => setActiveTab('resume')}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-t-lg transition-colors border-t border-l border-r ${
                    activeTab === 'resume' 
                    ? 'bg-[#fdf6e3] border-[#d4c5b0] text-[#2b5876] -mb-[1px] relative z-10' 
                    : 'bg-[#f0f0f0] border-transparent text-[#637b89] hover:bg-[#e6e6e6]'
                }`}
              >
                  <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4" />
                      Tailored CV
                  </div>
              </button>
              <button
                onClick={() => setActiveTab('coverLetter')}
                className={`px-4 py-2 text-sm font-bold uppercase tracking-wide rounded-t-lg transition-colors border-t border-l border-r ${
                    activeTab === 'coverLetter' 
                    ? 'bg-[#fdf6e3] border-[#d4c5b0] text-[#2b5876] -mb-[1px] relative z-10' 
                    : 'bg-[#f0f0f0] border-transparent text-[#637b89] hover:bg-[#e6e6e6]'
                }`}
              >
                  <div className="flex items-center gap-2">
                      <Scroll className="w-4 h-4" />
                      Cover Letter
                  </div>
              </button>
          </div>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-10 bg-[#fdf6e3] custom-scrollbar">
        <div className="prose prose-slate max-w-none text-[#2c3e50] leading-loose mb-8 font-serif">
          <ReactMarkdown>{contentToDisplay}</ReactMarkdown>
        </div>

        {activeTab === 'coverLetter' && sources.length > 0 && (
          <div className="mt-12 pt-6 border-t border-[#d4c5b0] relative">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#fdf6e3] px-2">
                 <Search className="w-4 h-4 text-[#c5a059]" />
            </div>
            <h4 className="text-[10px] font-bold text-[#637b89] uppercase tracking-widest mb-4 text-center">
              Divined from these sources
            </h4>
            <div className="flex flex-wrap gap-2 justify-center">
              {sources.map((source, index) => (
                <a 
                  key={index} 
                  href={source.uri} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-3 py-1.5 rounded bg-[#f0f9ff] hover:bg-[#e0f2fe] text-[#2b5876] text-xs font-bold transition-colors border border-[#bbdefb]"
                >
                  <span className="truncate max-w-[200px] font-sans">{source.title}</span>
                  <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#d4c5b0] bg-[#fffdf5] flex justify-end">
        <Button 
          variant="outline" 
          onClick={onRegenerate} 
          isLoading={isGenerating}
          icon={<RefreshCw className="w-4 h-4" />}
        >
          Recast Package
        </Button>
      </div>
    </div>
  );
};