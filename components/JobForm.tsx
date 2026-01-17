import React, { useState } from 'react';
import { CoverLetterData, Language, Tone } from '../types';
import { Compass, Sparkles, Link as LinkIcon, AlertCircle } from 'lucide-react';
import { Button } from './Button';
import { extractJobDescriptionFromUrl } from '../services/geminiService';
import { translations } from '../translations';

interface JobFormProps {
  data: CoverLetterData;
  onChange: (data: CoverLetterData) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
  onBack: () => void;
  language: string;
}

export const JobForm: React.FC<JobFormProps> = ({ data, onChange, onAnalyze, isAnalyzing, onBack, language }) => {
  const t = translations[language as keyof typeof translations] || translations['American English'];
  const [url, setUrl] = useState('');
  const [isFetchingUrl, setIsFetchingUrl] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const handleChange = (field: keyof CoverLetterData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const handleUrlImport = async () => {
    if (!url.trim()) return;
    setIsFetchingUrl(true);
    setFetchError(null);
    try {
      const result = await extractJobDescriptionFromUrl(url);
      onChange({
        ...data,
        jobDescription: result.jobDescription,
        companyName: result.companyName || data.companyName
      });
    } catch (e) {
      setFetchError("The magic faded. We couldn't read this scroll (URL). Please paste the details manually.");
    } finally {
      setIsFetchingUrl(false);
    }
  };

  const inputClass = "w-full px-4 py-3 bg-[#fdfbf7] border border-[#d4c5b0] rounded-lg focus:ring-1 focus:ring-[#2b5876] focus:border-[#2b5876] transition-all placeholder-[#a89b8d] text-[#2c3e50] font-sans";
  const labelClass = "text-xs font-bold text-[#637b89] uppercase tracking-widest mb-2 ml-1 font-display";

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-[#2c3e50] mb-2">{t.destinationTitle}</h2>
        <p className="text-[#637b89] italic">{t.destinationSub}</p>
      </div>

      <div className="bg-[#fffdf5] p-8 rounded-xl border border-[#2b5876] shadow-xl relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#2b5876]/10 rounded-bl-[80px] -mr-4 -mt-4"></div>

        <div className="flex items-center gap-3 mb-8 relative z-10">
          <div className="p-3 bg-[#eef5fa] rounded-full border border-[#2b5876]/30 text-[#2b5876]">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-xl text-[#2c3e50] font-display">{t.jobDetails}</h3>
        </div>

        <div className="space-y-6 relative z-10">
          <div>
            <label className={labelClass}>
              {t.companyName}
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Kingsbury Royal Palace"
              value={data.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          </div>



          {/* URL Import Section */}
          <div className="bg-[#f0f9ff] p-4 rounded-lg border border-[#bce3eb]">
            <label className="text-[10px] font-bold text-[#2b5876] uppercase tracking-widest mb-2 block">
              {t.autoFillUrl}
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#a89b8d]">
                  <LinkIcon className="w-4 h-4" />
                </div>
                <input
                  type="url"
                  className={`${inputClass} pl-10 py-2 text-sm h-10`}
                  placeholder="https://linkedin.com/jobs/view/..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUrlImport()}
                />
              </div>
              <Button
                type="button"
                onClick={handleUrlImport}
                isLoading={isFetchingUrl}
                disabled={!url.trim() || isFetchingUrl}
                variant="outline"
                className="h-10 px-4 text-xs"
              >
                {t.extract}
              </Button>
            </div>
            {fetchError && (
              <div className="mt-2 text-xs text-[#c0392b] flex items-center gap-1 animate-in fade-in">
                <AlertCircle className="w-3 h-3 shrink-0" />
                {fetchError}
              </div>
            )}
          </div>

          <div>
            <label className={labelClass}>
              {t.jobDescription}
            </label>
            <textarea
              className={`${inputClass} h-64 resize-y custom-scrollbar`}
              placeholder="Paste the full job description here..."
              value={data.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4 flex-col sm:flex-row">
        <Button variant="ghost" onClick={onBack} className="w-full sm:w-auto">
          {t.backProfile}
        </Button>
        <Button
          onClick={onAnalyze}
          isLoading={isAnalyzing}
          className="w-full sm:flex-1 h-12 shadow-lg hover:-translate-y-0.5"
          icon={<Sparkles className="w-4 h-4" />}
        >
          {t.analyzeFit}
        </Button>
      </div>
    </div>
  );
};