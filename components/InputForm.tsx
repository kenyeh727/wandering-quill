import React from 'react';
import { CoverLetterData } from '../types';
import { Button } from './Button';
import { Feather, Compass, Sparkles } from 'lucide-react';

interface InputFormProps {
  data: CoverLetterData;
  onChange: (data: CoverLetterData) => void;
  onSubmit: () => void;
  isGenerating: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ data, onChange, onSubmit, isGenerating }) => {
  const handleChange = (field: keyof CoverLetterData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  // Parchment paper look for inputs
  const inputClass = "w-full px-4 py-3 bg-[#fdfbf7] border border-[#d4c5b0] rounded-lg focus:ring-1 focus:ring-[#2b5876] focus:border-[#2b5876] transition-all placeholder-[#a89b8d] text-[#2c3e50] font-sans";
  const labelClass = "text-xs font-bold text-[#637b89] uppercase tracking-widest mb-2 ml-1 font-display";

  return (
    <div className="space-y-6">
      
      {/* Block 1: The Traveler (User) */}
      <div className="bg-[#fffdf5] p-6 rounded-lg border border-[#c5a059] shadow-[4px_4px_0px_rgba(197,160,89,0.2)] relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#ff6b6b]/10 rounded-bl-[40px] -mr-2 -mt-2"></div>
        
        <div className="flex items-center gap-3 mb-6 relative z-10">
           <div className="p-2.5 bg-[#fff0f0] rounded-full border border-[#ff6b6b]/30 text-[#ff6b6b]">
             <Feather className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-xl text-[#2c3e50] font-display">The Traveler</h3>
        </div>

        <div className="space-y-5 relative z-10">
          <div>
            <label className={labelClass}>Name</label>
            <input
              type="text"
              className={inputClass}
              placeholder="Sophie Hatter"
              value={data.candidateName}
              onChange={(e) => handleChange('candidateName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>
              Magical Studies (Education)
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="e.g. MSc in Applied Alchemy, Kingsbury Univ."
              value={data.education}
              onChange={(e) => handleChange('education', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>
              Arcane Research (Thesis/Projects)
            </label>
            <textarea
              className={`${inputClass} h-40 resize-y custom-scrollbar`}
              placeholder="Describe your thesis or key research projects..."
              value={data.researchProjects}
              onChange={(e) => handleChange('researchProjects', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>
              Chronicles (Resume)
            </label>
            <textarea
              className={`${inputClass} h-80 resize-y custom-scrollbar`}
              placeholder="Paste your full resume contents here..."
              value={data.resumeText}
              onChange={(e) => handleChange('resumeText', e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Block 2: The Destination (Job) */}
      <div className="bg-[#fffdf5] p-6 rounded-lg border border-[#2b5876] shadow-[4px_4px_0px_rgba(43,88,118,0.2)] relative overflow-hidden">
        {/* Decorative corner */}
        <div className="absolute top-0 right-0 w-16 h-16 bg-[#2b5876]/10 rounded-bl-[40px] -mr-2 -mt-2"></div>

        <div className="flex items-center gap-3 mb-6 relative z-10">
           <div className="p-2.5 bg-[#eef5fa] rounded-full border border-[#2b5876]/30 text-[#2b5876]">
             <Compass className="w-5 h-5" />
           </div>
           <h3 className="font-bold text-xl text-[#2c3e50] font-display">The Destination</h3>
        </div>

        <div className="space-y-5 relative z-10">
          <div>
            <label className={labelClass}>
               Target Realm (Company)
            </label>
            <input
              type="text"
              className={inputClass}
              placeholder="Kingsbury Royal Palace"
              value={data.companyName}
              onChange={(e) => handleChange('companyName', e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>
              Quest Details (Job Description)
            </label>
            <textarea
              className={`${inputClass} h-60 resize-y custom-scrollbar`}
              placeholder="What does the position entail?"
              value={data.jobDescription}
              onChange={(e) => handleChange('jobDescription', e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="pt-4">
        <Button 
          onClick={onSubmit} 
          isLoading={isGenerating} 
          className="w-full h-14 text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-b-4 border-[#1a3a52] active:border-b-0 active:translate-y-1"
          icon={<Sparkles className="w-4 h-4" />}
        >
          Consult the Stars (Analyze)
        </Button>
        <p className="text-center text-[10px] uppercase tracking-widest text-[#637b89] mt-4 font-bold">
            Magic takes a moment to weave
        </p>
      </div>
    </div>
  );
};