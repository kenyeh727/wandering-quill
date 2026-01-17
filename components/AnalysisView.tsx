import React from 'react';
import { AnalysisResult } from '../types';
import { Button } from './Button';
import { CheckCircle2, XCircle, ArrowRight, Sparkles, AlertTriangle, PenTool, ShieldAlert, Trash2, HelpCircle } from 'lucide-react';
import { translations } from '../translations';

interface AnalysisViewProps {
  result: AnalysisResult;
  onProceed: () => void;
  onCancel: () => void;
  onStartNew?: () => void;
  isGeneratingDraft: boolean;
  styleNotes: string;
  onStyleNotesChange: (value: string) => void;
  language: string;
}

export const AnalysisView: React.FC<AnalysisViewProps> = ({
  result,
  onProceed,
  onCancel,
  onStartNew,
  isGeneratingDraft,
  styleNotes,
  onStyleNotesChange,
  language
}) => {
  const t = translations[language as keyof typeof translations] || translations['American English'];
  const isHighMatch = result.score >= 75;
  const hasPros = result.pros && result.pros.length > 0;
  const hasCons = result.cons && result.cons.length > 0;

  const getScoreColor = () => isHighMatch ? 'text-[#10b981]' : 'text-[#f59e0b]';
  const getBorderColor = () => isHighMatch ? 'border-[#10b981]' : 'border-[#f59e0b]';
  const getBackgroundAccent = () => isHighMatch ? 'bg-[#ecfdf5]' : 'bg-[#fffbeb]';

  return (
    <div className={`flex flex-col h-[calc(100vh-14rem)] bg-[#fdf6e3] rounded-lg shadow-xl border-2 ${getBorderColor()} overflow-hidden relative transition-colors duration-500`}>
      <div className={`absolute top-0 left-0 w-full h-2 ${isHighMatch ? 'bg-gradient-to-r from-[#10b981] to-[#34d399]' : 'bg-gradient-to-r from-[#f59e0b] to-[#3b82f6]'}`}></div>

      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-[url('https://www.transparenttextures.com/patterns/cream-paper.png')]">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center p-8 ${getBackgroundAccent()} rounded-full border-4 ${getBorderColor()} shadow-lg mb-4 relative`}>
            <div className={`text-5xl font-display font-bold ${getScoreColor()}`}>
              {result.score}%
            </div>
            {!isHighMatch && (
              <div className="absolute -top-2 -right-2 bg-[#3b82f6] text-white p-2 rounded-full shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
            )}
          </div>
          <h3 className="text-2xl font-display font-bold text-[#2c3e50]">
            {isHighMatch ? t.pathClear : t.treadCarefully}
          </h3>
          <p className="text-[#637b89] mt-2 italic font-serif">"{result.verdict}"</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#f0f9ff] rounded-lg p-6 border-l-4 border-[#2b5876] shadow-sm">
            <h4 className="font-display font-bold text-[#1a3a52] flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
              <Sparkles className="w-4 h-4 text-[#2b5876]" />
              {t.strengths}
            </h4>
            {hasPros ? (
              <ul className="space-y-3">
                {result.pros.map((pro, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#34495e] leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-[#2b5876] shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#637b89] italic flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> No specific strengths detected.
              </p>
            )}
          </div>

          <div className="bg-[#fff5f5] rounded-lg p-6 border-l-4 border-[#ff6b6b] shadow-sm">
            <h4 className="font-display font-bold text-[#c0392b] flex items-center gap-2 mb-3 text-sm uppercase tracking-wide">
              <AlertTriangle className="w-4 h-4 text-[#ff6b6b]" />
              {t.missingIngredients}
            </h4>
            {hasCons ? (
              <ul className="space-y-3">
                {result.cons.map((con, i) => (
                  <li key={i} className="flex items-start gap-3 text-sm text-[#34495e] leading-relaxed">
                    <XCircle className="w-4 h-4 text-[#ff6b6b] shrink-0 mt-0.5" />
                    <span>{con}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-[#637b89] italic flex items-center gap-2">
                <HelpCircle className="w-4 h-4" /> No major gaps found.
              </p>
            )}
          </div>
        </div>

        <div className="bg-[#fffbf0] p-6 rounded-lg border border-[#c5a059] mt-6 relative">
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#fdf6e3] px-3 border border-[#c5a059] rounded-full py-1">
            <PenTool className="w-4 h-4 text-[#c5a059]" />
          </div>
          <label className="text-xs font-bold text-[#8d703e] uppercase tracking-widest flex justify-center mb-3 mt-1">
            {t.enchantmentModifiers}
          </label>
          <textarea
            className="w-full px-4 py-3 bg-white border border-[#e0d6c5] rounded focus:ring-1 focus:ring-[#c5a059] focus:border-[#c5a059] transition-all placeholder-[#c5bdae] text-[#2c3e50] h-20 resize-none font-serif text-sm italic"
            placeholder="Add special instructions (e.g. 'Emphasize my leadership')..."
            value={styleNotes}
            onChange={(e) => onStyleNotesChange(e.target.value)}
          />
        </div>
      </div>

      <div className="p-6 bg-[#fdf6e3] border-t border-[#d4c5b0] flex flex-col sm:flex-row gap-4 justify-between items-center z-10 shrink-0">
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="ghost" onClick={onCancel}>{t.backEdit}</Button>
          {onStartNew && (
            <Button variant="ghost" onClick={onStartNew} className="text-[#c0392b] hover:text-[#c0392b] hover:bg-[#fff0f0]" icon={<Trash2 className="w-4 h-4" />}>
              {t.discardNew}
            </Button>
          )}
        </div>

        <Button variant={isHighMatch ? "primary" : "accent"} onClick={onProceed} isLoading={isGeneratingDraft} icon={<ArrowRight className="w-4 h-4" />}>
          {isHighMatch ? t.weavePackage : t.proceedCaution}
        </Button>
      </div>
    </div>
  );
};