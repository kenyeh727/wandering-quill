import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Copy, Check, Printer, Search, ExternalLink, Scroll, RefreshCw, PenTool } from 'lucide-react';
import { Button } from './Button';
import { Source } from '../types';

interface CoverLetterViewProps {
  content: string;
  sources?: Source[];
  onRegenerate: (instructions: string) => void;
  isGenerating: boolean;
  onStartOver: () => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({ 
  content, 
  sources = [], 
  onRegenerate, 
  isGenerating,
  onStartOver
}) => {
  const [copied, setCopied] = useState(false);
  const [instructions, setInstructions] = useState('');
  const [showTweaks, setShowTweaks] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleRewrite = () => {
      onRegenerate(instructions);
      // Optional: Clear instructions or keep them? Keeping them might be helpful if the user wants to iterate.
      // setShowTweaks(false); 
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-6 shrink-0">
        <h2 className="text-3xl font-display font-bold text-[#2c3e50]">The Enchanted Scroll</h2>
        <p className="text-[#637b89] italic">Your voice, amplified. Ready for the owl post.</p>
      </div>

      <div className="flex-1 bg-[#fdf6e3] rounded-xl shadow-2xl border border-[#c5a059] overflow-hidden flex flex-col relative">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#2b5876] via-[#ff6b6b] to-[#c5a059]"></div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#d4c5b0] bg-[#fffdf5] shrink-0">
            <h3 className="font-display font-bold text-[#2c3e50] flex items-center gap-2">
                <Scroll className="w-5 h-5 text-[#c5a059]" />
                Final Draft
            </h3>
            <div className="flex gap-2">
                <Button 
                    variant="secondary" 
                    size="sm" 
                    onClick={handleCopy} 
                    title="Copy"
                    className="h-9 w-9 p-0 rounded-full border border-[#d4c5b0]"
                >
                    {copied ? <Check className="w-4 h-4 text-[#2b5876]" /> : <Copy className="w-4 h-4" />}
                </Button>
            </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
            <div className="prose prose-slate max-w-none text-[#2c3e50] leading-loose font-serif text-base">
                <ReactMarkdown>{content}</ReactMarkdown>
            </div>

            {sources.length > 0 && (
                <div className="mt-12 pt-6 border-t border-[#d4c5b0]/50">
                    <div className="flex items-center justify-center gap-2 mb-4 opacity-70">
                        <Search className="w-3 h-3 text-[#c5a059]" />
                        <span className="text-[10px] font-bold text-[#637b89] uppercase tracking-widest">
                            Weaved from reality
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {sources.map((source, index) => (
                            <a 
                                key={index} 
                                href={source.uri} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-1.5 rounded bg-[#fff] border border-[#d4c5b0] text-[#2b5876] text-xs font-bold hover:shadow-sm transition-all"
                            >
                                <span className="truncate max-w-[200px] font-sans">{source.title}</span>
                                <ExternalLink className="w-3 h-3 ml-1.5 opacity-50" />
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>

        {/* Tweak Section (Expandable) */}
        <div className={`border-t border-[#d4c5b0] bg-[#fffbf0] transition-all duration-300 ease-in-out overflow-hidden ${showTweaks ? 'max-h-48' : 'max-h-0'}`}>
            <div className="p-4">
                <label className="text-[10px] font-bold text-[#8d703e] uppercase tracking-widest flex items-center gap-2 mb-2">
                    <PenTool className="w-3 h-3" />
                    Revision Instructions
                </label>
                <div className="flex gap-2">
                    <textarea 
                        className="flex-1 px-3 py-2 bg-white border border-[#e0d6c5] rounded text-sm text-[#2c3e50] focus:ring-1 focus:ring-[#c5a059] focus:border-[#c5a059] resize-none h-20 font-serif italic"
                        placeholder="e.g. Make the opening more punchy, or emphasize my project management skills..."
                        value={instructions}
                        onChange={(e) => setInstructions(e.target.value)}
                    />
                    <Button 
                        variant="primary" 
                        onClick={handleRewrite} 
                        isLoading={isGenerating}
                        className="h-20 w-24 shrink-0 text-xs flex-col gap-1"
                    >
                        <RefreshCw className="w-4 h-4 mb-1" />
                        Rewrite
                    </Button>
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#d4c5b0] bg-[#fffdf5] flex justify-between items-center shrink-0">
            <Button variant="ghost" onClick={onStartOver}>Start New Journey</Button>
            
            {!showTweaks ? (
                <Button 
                    variant="outline" 
                    onClick={() => setShowTweaks(true)} 
                    isLoading={isGenerating}
                    icon={<PenTool className="w-4 h-4" />}
                >
                    Request Changes
                </Button>
            ) : (
                <Button 
                    variant="ghost" 
                    onClick={() => setShowTweaks(false)} 
                    className="text-[#637b89]"
                >
                    Cancel Changes
                </Button>
            )}
        </div>
      </div>
    </div>
  );
};