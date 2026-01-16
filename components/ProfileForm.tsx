import React, { useState, useEffect } from 'react';
import { CoverLetterData } from '../types';
import { Feather, Save, User, Plus, Trash2, Edit3, Link as LinkIcon, Check, X, PenLine } from 'lucide-react';
import { Button } from './Button';

interface ProfileFormProps {
  data: CoverLetterData;
  onChange: (data: CoverLetterData) => void;
  onNext: () => void;
}

interface SavedProfile {
  id: string;
  name: string;
  timestamp: number;
  data: Partial<CoverLetterData>;
}

// Default profile data provided by the user (Niki)
const DEFAULT_NIKI_PROFILE: SavedProfile = {
  id: 'default-niki-comm',
  name: 'Niki (Comm. Specialist)',
  timestamp: Date.now(),
  data: {
    candidateName: "Niki",
    education: "M.Sc. in Sustainable Development | Uppsala University, Sweden\nB.A. in Literature | Soochow University, Taiwan",
    researchProjects: `PUBLICATIONS & RESEARCH

Sustainability Supply Chain Transitions: Multi-Level Perspective of CSDDD
Uppsala University, Department of Earth Sciences | Jun 2024
- Analyzed the operational impact of the EU’s Corporate Sustainability Due Diligence Directive (CSDDD) on global supply chain governance, with a specific focus on the regulatory landscape for 2026.
- Conducted a qualitative study using expert interviews, media analysis, and EU policy documents to evaluate the readiness of Swedish corporations.
- Identified critical compliance disparities between large enterprises seeking competitive advantages and SMEs facing resource constraints, highlighting the necessity for targeted government intervention in supply chain transitions.

Critical Evaluation of the Environmental Impact Statement: Lower Churchill Hydroelectric Project
Uppsala University
- Conducted a critical audit of the Environmental Impact Statement (EIS) for a major Canadian hydroelectric initiative, identifying significant deficiencies in uncertainty management and risk assessment.
- Evaluated data gaps regarding methylmercury contamination and its downstream effects on aquatic ecosystems and Indigenous communities.
- Proposed enhanced mitigation frameworks and compensation strategies to address socio-economic disparities and improve transparency in stakeholder negotiations.

Farming in Uppsala: The Impact of Demographic Shifts on Food Security
SLU - Swedish University of Agricultural Sciences
- Investigated the correlation between an aging agricultural workforce and regional food security risks in Uppsala, Sweden.
- Assessed structural barriers to market entry for young farmers, including capital limitations, land access, and shifting cultural perceptions.
- Formulated policy recommendations focused on financial incentives and educational initiatives to stimulate industry rejuvenation and ensure long-term local food production resilience.`,
    resumeText: `PROFESSIONAL SUMMARY
Strategic communications professional with 5+ years of experience across Europe and Asia, specializing in translating complex scientific and policy data into credible digital narratives. Currently managing international platforms for a global climate think tank, utilizing data-driven insights to ensure long-term brand consistency. Proven track record in coordinating decentralized communication strategies that bridge technical expertise with global audience engagement.

KEY COMPETENCIES
Core: Strategic Communications, Social Media Management, Content Optimization, Cross-cultural Collaboration, Crisis Management.
Technical & Digital: SEO, Google Analytics (GA4), Meltwater, Drupal, WordPress, Canva, Adobe Creative Suite.
Languages: English (Fluent), Chinese (Native/Fluent), German (Basic/A2).

PROFESSIONAL EXPERIENCE

NewClimate Institute | Cologne, Germany Communications Officer | Dec 2024 – Present Global think tank advancing climate policy and corporate sustainability solutions.
- Drafted 200+ strategic posts for LinkedIn, X, and BlueSky, utilizing targeted engagement tactics to significantly expand professional communities and brand reach.
- Manage three international institutional websites (Drupal/WordPress), applying SEO strategies and GA4 analytics to monitor traffic and improve digital visibility for global audiences.
- Monitor press performance via Meltwater, analyzing 10,000+ media mentions to generate data-driven reports that inform the broader communication strategy.
- Produce digital content for 50+ publications, translating complex research into structured, accessible outputs for corporate, governmental, and international NGO stakeholders.

Taiwan Youth Climate Coalition (TWYCC) | Taipei, Taiwan Communication Team Manager | Feb 2021 – Jan 2023 The first youth environmental NGO in Taiwan.
- Managed a team of ten members, overseeing social media platforms and conceptualizing technical content related to Taiwan's NDCs, IPCC reports, and the UNFCCC COP.
- Spearheaded marketing and bilingual press operations for major campaigns, including the Fridays For Future March and COP26 Taiwan Day, acting as the primary liaison for local governments and NGOs.
- Increased fundraising results by developing customized proposals and securing collaborative opportunities with renewable energy companies and child welfare nonprofits.
- Served as a guest lecturer on the Youth Climate Movement for the Taiwan Youth Development Administration and New Taipei City Government, presenting to over 1,000 attendees.

Pacific Green Energy | Taipei, Taiwan Events and Communication Officer | Jun 2020 – Aug 2021 Pioneering start-up focused on solar plant investment and EVSE.
- Built the PGE brand from the ground up as a founding member; these branding efforts contributed to the company winning the Top Ten Potential Enterprises (OEMA Golden Award) in 2020.
- Produced high-impact video content in collaboration with Deutsche Welle and key influencers, generating over 340,000 views on YouTube.
- Oversaw website development and implemented an SEO content strategy based on renewable energy expertise, achieving an 81% increase in visitor conversion rates.
- addressed supply chain challenges related to solar panel recycling by collaborating with industry experts to mitigate risks and ensure sustainability compliance.

Cookpad | Taipei, Taiwan Content Marketing Intern | Oct 2019 – Jun 2020 The largest online recipe community in the world, focusing on sustainable living.
- Orchestrated the APAC "TeamTrees" (#ARecipeATree) collaborative project, managing KOL relationships and press releases, resulting in the successful donation of over 10,000 trees.
- Managed fan pages with millions of followers, implementing strategies that raised awareness of food sustainability and boosted engagement rates by 50%.`
  }
};

export const ProfileForm: React.FC<ProfileFormProps> = ({ data, onChange, onNext }) => {
  const [profiles, setProfiles] = useState<SavedProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  
  // Creation State
  const [isCreating, setIsCreating] = useState(false);
  const [tempName, setTempName] = useState('');

  // Renaming State
  const [editingNameId, setEditingNameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');

  // Load profiles
  useEffect(() => {
    try {
      const saved = localStorage.getItem('wq_profiles');
      let loadedProfiles: SavedProfile[] = [];
      
      if (saved) {
        loadedProfiles = JSON.parse(saved);
      }

      // Check if our default profile is in the list.
      // If it exists, UPDATE it with the latest code-provided data (in case text was changed in code).
      // If it doesn't exist, and list is empty, add it.
      // We don't force-add if the list is non-empty but missing it (assumes user deleted it intentionally),
      // unless we want to ensure it's always available for this specific demo requirement.
      // Let's force update/insert for the default profile to ensure the user sees their data.
      
      const defaultIndex = loadedProfiles.findIndex(p => p.id === DEFAULT_NIKI_PROFILE.id);
      if (defaultIndex !== -1) {
          loadedProfiles[defaultIndex] = DEFAULT_NIKI_PROFILE;
      } else if (loadedProfiles.length === 0) {
          loadedProfiles.push(DEFAULT_NIKI_PROFILE);
      } else {
        // Optional: If you want to force it even if user has other profiles, un-comment below
        // loadedProfiles.push(DEFAULT_NIKI_PROFILE);
      }

      // Save back to storage to persist the update
      localStorage.setItem('wq_profiles', JSON.stringify(loadedProfiles));
      setProfiles(loadedProfiles);

      // Auto-Select Logic:
      // If no profile is active, and we have profiles, auto-select the first one to populate the form.
      if (loadedProfiles.length > 0 && !activeProfileId) {
         // Only auto-fill if the main form is relatively empty
         if (!data.candidateName) {
            const p = loadedProfiles[0];
            setActiveProfileId(p.id);
            onChange({
                ...data,
                ...p.data,
                candidateName: p.data.candidateName || '',
                education: p.data.education || '',
                researchProjects: p.data.researchProjects || '',
                resumeText: p.data.resumeText || ''
            });
         }
      }

    } catch (e) {
      console.error("Failed to load profiles", e);
    }
  }, []); // Run once on mount

  const saveToStorage = (updatedProfiles: SavedProfile[]) => {
    setProfiles(updatedProfiles);
    localStorage.setItem('wq_profiles', JSON.stringify(updatedProfiles));
  };

  // --- Actions ---

  const handleCreate = () => {
    if (!tempName.trim()) return;
    const emptyData = { ...data, candidateName: '', education: '', researchProjects: '', resumeText: '' };
    onChange(emptyData);

    const newProfile: SavedProfile = {
      id: Date.now().toString(),
      name: tempName,
      timestamp: Date.now(),
      data: { candidateName: '', education: '', researchProjects: '', resumeText: '' }
    };

    saveToStorage([...profiles, newProfile]);
    setActiveProfileId(newProfile.id);
    setIsCreating(false);
    setTempName('');
  };

  const handleSelect = (profile: SavedProfile) => {
    if (editingNameId) return; // Block selection while renaming
    setActiveProfileId(profile.id);
    onChange({
      ...data,
      ...profile.data,
      candidateName: profile.data.candidateName || '',
      education: profile.data.education || '',
      researchProjects: profile.data.researchProjects || '',
      resumeText: profile.data.resumeText || ''
    });
  };

  const handleChange = (field: keyof CoverLetterData, value: any) => {
    // 1. Update UI
    onChange({ ...data, [field]: value });

    // 2. Auto-save to active profile (Live Link)
    if (activeProfileId) {
      const updatedProfiles = profiles.map(p => {
        if (p.id === activeProfileId) {
          return {
            ...p,
            timestamp: Date.now(),
            data: { ...p.data, [field]: value }
          };
        }
        return p;
      });
      saveToStorage(updatedProfiles);
    }
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Delete this character permanently?")) {
      const remaining = profiles.filter(p => p.id !== id);
      saveToStorage(remaining);
      if (activeProfileId === id) setActiveProfileId(null);
    }
  };

  // --- Renaming Logic ---
  const startRenaming = (e: React.MouseEvent, p: SavedProfile) => {
    e.stopPropagation();
    setEditingNameId(p.id);
    setRenameValue(p.name);
  };

  const saveRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (editingNameId) {
      const updated = profiles.map(p => p.id === editingNameId ? { ...p, name: renameValue } : p);
      saveToStorage(updated);
      setEditingNameId(null);
    }
  };

  const cancelRename = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingNameId(null);
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  // Styles
  const inputClass = `w-full px-4 py-3 bg-[#fdfbf7] rounded-lg focus:ring-1 transition-all placeholder-[#a89b8d] text-[#2c3e50] font-sans border ${activeProfileId ? 'border-[#c5a059] focus:ring-[#c5a059] focus:border-[#c5a059]' : 'border-[#d4c5b0] focus:ring-[#2b5876] focus:border-[#2b5876]'}`;
  const labelClass = "text-xs font-bold text-[#637b89] uppercase tracking-widest mb-2 ml-1 font-display";

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-display font-bold text-[#2c3e50] mb-2">The Traveler's Chronicle</h2>
        <p className="text-[#637b89] italic">Select a character to auto-load their history.</p>
      </div>

      {/* --- Character Save Slots --- */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-8">
        {/* Create New Slot */}
        {!isCreating ? (
           <button 
             onClick={() => setIsCreating(true)}
             className="flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#4a7a9c] rounded-xl hover:bg-[#fffdf5] hover:border-[#c5a059] transition-all group min-h-[120px]"
           >
             <div className="w-10 h-10 rounded-full bg-[#f0f9ff] text-[#2b5876] flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
               <Plus className="w-6 h-6" />
             </div>
             <span className="text-xs font-bold uppercase tracking-widest text-[#637b89] group-hover:text-[#c5a059]">Create New</span>
           </button>
        ) : (
          <div className="col-span-1 md:col-span-2 bg-[#fffdf5] border-2 border-[#c5a059] rounded-xl p-4 flex flex-col justify-center animate-in zoom-in-95">
             <label className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] mb-1">Name your Hero</label>
             <div className="flex gap-2">
                <input 
                  autoFocus
                  type="text" 
                  className="flex-1 bg-white border border-[#d4c5b0] rounded px-3 py-1.5 text-sm outline-none focus:border-[#c5a059]"
                  placeholder="e.g. Sophie"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <button onClick={handleCreate} className="bg-[#2b5876] text-white px-3 rounded hover:bg-[#1a3a52]"><Check className="w-4 h-4"/></button>
                <button onClick={() => setIsCreating(false)} className="text-[#637b89] hover:text-[#c0392b] px-2"><X className="w-4 h-4"/></button>
             </div>
          </div>
        )}

        {/* Profile Cards */}
        {profiles.map(p => {
          const isActive = activeProfileId === p.id;
          const isRenaming = editingNameId === p.id;

          return (
            <div 
              key={p.id}
              onClick={() => handleSelect(p)}
              className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 min-h-[120px] flex flex-col justify-between group
                ${isActive 
                  ? 'bg-[#2b5876] border-[#2b5876] text-[#fdf6e3] shadow-lg scale-105 z-10' 
                  : 'bg-[#fffdf5] border-[#d4c5b0] text-[#2c3e50] hover:border-[#2b5876] hover:shadow-md'
                }`}
            >
              {/* Card Header: Icon + Status */}
              <div className="flex justify-between items-start mb-2">
                 <div className={`p-1.5 rounded-lg ${isActive ? 'bg-[#c5a059] text-[#1a3a52]' : 'bg-[#f0f9ff] text-[#2b5876]'}`}>
                    <User className="w-4 h-4" />
                 </div>
                 {isActive && <div className="text-[10px] font-bold uppercase tracking-widest text-[#c5a059] animate-pulse">Active</div>}
              </div>
              
              {/* Card Body: Name (or Edit Input) */}
              <div>
                {isRenaming ? (
                   <div className="flex flex-col gap-2 mt-1 animate-in fade-in" onClick={e => e.stopPropagation()}>
                       <input 
                          autoFocus
                          value={renameValue}
                          onChange={e => setRenameValue(e.target.value)}
                          className="w-full text-xs text-[#2c3e50] px-1 py-1 rounded border border-[#c5a059] outline-none"
                       />
                       <div className="flex gap-1">
                          <button onClick={saveRename} className="bg-[#c5a059] text-[#1a3a52] text-[10px] px-2 py-1 rounded font-bold hover:bg-[#d4b06a]">Save</button>
                          <button onClick={cancelRename} className="bg-[#e2e8f0] text-[#64748b] text-[10px] px-2 py-1 rounded font-bold hover:bg-[#cbd5e1]">Cancel</button>
                       </div>
                   </div>
                ) : (
                   <div className="group/name flex items-center justify-between">
                      <h4 className="font-display font-bold truncate text-sm flex-1" title={p.name}>{p.name}</h4>
                      <button 
                         onClick={(e) => startRenaming(e, p)}
                         className={`opacity-0 group-hover/name:opacity-100 p-1 rounded transition-all ${isActive ? 'text-[#fdf6e3] hover:bg-[#c5a059]' : 'text-[#637b89] hover:bg-[#e2e8f0]'}`}
                         title="Rename"
                      >
                         <PenLine className="w-3 h-3" />
                      </button>
                   </div>
                )}
                
                {!isRenaming && (
                    <p className={`text-[10px] truncate mt-1 ${isActive ? 'text-[#8baec9]' : 'text-[#637b89]'}`}>
                    {p.data.education || "No history yet"}
                    </p>
                )}
              </div>

              {/* Delete Action (Top Right) */}
              {!isActive && !isRenaming && (
                <button 
                  onClick={(e) => handleDelete(e, p.id)}
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-[#fff0f0] rounded text-[#c0392b] transition-all"
                  title="Delete Character"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* --- Main Edit Form --- */}
      <div className={`bg-[#fffdf5] p-8 rounded-xl border-2 shadow-xl relative overflow-hidden transition-colors duration-500 
          ${activeProfileId ? 'border-[#c5a059]' : 'border-[#d4c5b0]'}`}>
        
        {/* Connection Header */}
        <div className="flex items-center gap-3 mb-8 relative z-10 border-b border-[#e0d6c5] pb-4">
           {activeProfile ? (
              <>
                 <div className="p-3 bg-[#c5a059] rounded-full text-[#1a3a52] shadow-sm">
                    <LinkIcon className="w-6 h-6" />
                 </div>
                 <div className="flex-1">
                   <h3 className="font-bold text-xl text-[#2b5876] font-display flex items-center gap-2">
                     {activeProfile.name}'s Experience
                   </h3>
                   <p className="text-xs text-[#c5a059] font-bold uppercase tracking-widest flex items-center gap-1 mt-1">
                     <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
                     Live Linked & Saving
                   </p>
                 </div>
              </>
           ) : (
              <>
                 <div className="p-3 bg-[#f0f9ff] rounded-full text-[#2b5876] border border-[#2b5876]/20">
                    <Edit3 className="w-6 h-6" />
                 </div>
                 <div>
                   <h3 className="font-bold text-xl text-[#2c3e50] font-display">Unbound Profile</h3>
                   <p className="text-xs text-[#637b89] uppercase tracking-widest mt-1">
                     Changes here are not saved to a character slot.
                   </p>
                 </div>
              </>
           )}
        </div>

        <div className="space-y-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>Candidate Name</label>
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
                placeholder="e.g. MSc Alchemy"
                value={data.education}
                onChange={(e) => handleChange('education', e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <label className={labelClass}>
              Arcane Research (Thesis/Projects)
            </label>
            <textarea
              className={`${inputClass} h-64 resize-y custom-scrollbar font-mono text-sm leading-relaxed`}
              placeholder="Describe your thesis or key research projects..."
              value={data.researchProjects}
              onChange={(e) => handleChange('researchProjects', e.target.value)}
            />
          </div>
          
          <div>
            <label className={labelClass}>
              Chronicles (Resume Content)
            </label>
            <textarea
              className={`${inputClass} h-64 resize-y custom-scrollbar font-mono text-sm leading-relaxed`}
              placeholder="Paste your full resume contents here..."
              value={data.resumeText}
              onChange={(e) => handleChange('resumeText', e.target.value)}
            />
          </div>
        </div>

        {/* Decorative Watermark */}
        <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
            <Feather className="w-64 h-64 text-[#2b5876]" />
        </div>
      </div>

      <div className="flex justify-end pt-4">
         <Button onClick={onNext} className="w-full md:w-auto shadow-lg text-sm px-8 h-12">
            Confirm & Proceed to Destination
         </Button>
      </div>
    </div>
  );
};