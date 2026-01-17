import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './Button';
import { FileText, ArrowRight, RefreshCw } from 'lucide-react';
import { translations } from '../translations';

interface CvViewProps {
  content: string;
  onApprove: () => void;
  onRegenerate: () => void;
  isGenerating: boolean;
  language: string;
}

export const CvView: React.FC<CvViewProps> = ({ content, onApprove, onRegenerate, isGenerating, language }) => {
  const t = translations[language as keyof typeof translations] || translations['American English'];
  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-6 shrink-0">
        <h2 className="text-3xl font-display font-bold text-[#2c3e50]">{t.cvShield}</h2>
        <p className="text-[#637b89] italic">{t.profileSub}</p>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-2xl border border-[#c5a059] overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#2b5876] to-[#c5a059]"></div>

        {/* Toolbar */}
        <div className="bg-[#fffdf5] border-b border-[#e0d6c5] px-6 py-3 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 text-[#2b5876] font-bold font-display text-sm uppercase">
            <FileText className="w-4 h-4" />
            {t.cvShield} Draft
          </div>
          <Button
            variant="ghost"
            onClick={onRegenerate}
            disabled={isGenerating}
            icon={<RefreshCw className="w-3 h-3" />}
            className="text-xs h-8"
          >
            {t.regenerate}
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
          <div className="prose prose-slate max-w-none font-serif text-sm leading-relaxed
                prose-headings:font-display prose-headings:text-[#2b5876] prose-headings:font-bold
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg prose-h3:text-[#c5a059]
                prose-p:text-[#2c3e50] prose-li:text-[#2c3e50] prose-li:marker:text-[#c5a059]
                prose-strong:text-[#1a3a52] prose-strong:font-bold">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-6 bg-[#fdf6e3] border-t border-[#d4c5b0] flex justify-end items-center gap-4 shrink-0">
          <span className="text-xs font-bold text-[#637b89] uppercase tracking-widest hidden sm:block">
            Satisfied with this scroll?
          </span>
          <Button
            onClick={onApprove}
            isLoading={isGenerating}
            className="w-full sm:w-auto shadow-xl"
            icon={<ArrowRight className="w-4 h-4" />}
          >
            {t.approveProceed}
          </Button>
        </div>
      </div>
    </div>
  );
};