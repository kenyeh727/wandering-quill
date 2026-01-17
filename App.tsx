import React, { useState, useEffect } from 'react';
import { Feather, Flame, Loader2, Sparkles, MapPin, Shield, Scroll, Trash2, ChevronRight, Save } from 'lucide-react';
import { ProfileForm } from './components/ProfileForm';
import { JobForm } from './components/JobForm';
import { AnalysisView } from './components/AnalysisView';
import { CvView } from './components/CvView';
import { CoverLetterView } from './components/CoverLetterView';
import { CoverLetterData, Tone, Language, Source, AnalysisResult } from './types';
import { generateCoverLetter, analyzeJobFit, tailorResume } from './services/geminiService';
import { Button } from './components/Button';
import { Navbar } from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import { translations } from './translations';

type Step = 'profile' | 'job' | 'analysis' | 'cv' | 'letter';

const STORAGE_KEY = 'wq_state_v2';

const App: React.FC = () => {
  const [formData, setFormData] = useState<CoverLetterData>({
    resumeText: '',
    jobDescription: '',
    candidateName: '',
    companyName: '',
    tone: Tone.HUMBLE_CONFIDENT,
    language: Language.TRADITIONAL_CHINESE,
    writingSample: '',
    education: '',
    researchProjects: ''
  });

  const [step, setStep] = useState<Step>('profile');

  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [tailoredResume, setTailoredResume] = useState<string>('');
  const [generatedCoverLetter, setGeneratedCoverLetter] = useState<string>('');
  const [sources, setSources] = useState<Source[]>([]);

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState("Consulting the stars...");
  const [isLoaded, setIsLoaded] = useState(false);

  const { user } = useAuth();
  const t = translations[formData.language as keyof typeof translations] || translations['American English'];

  // --- Persistence Logic ---

  // Load state on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.formData) setFormData(parsed.formData);
        if (parsed.step) setStep(parsed.step);
        if (parsed.analysisResult) setAnalysisResult(parsed.analysisResult);
        if (parsed.tailoredResume) setTailoredResume(parsed.tailoredResume);
        if (parsed.generatedCoverLetter) setGeneratedCoverLetter(parsed.generatedCoverLetter);
        if (parsed.sources) setSources(parsed.sources);
      }
    } catch (e) {
      console.error("Failed to load state", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save state on change
  useEffect(() => {
    if (!isLoaded) return;
    const stateToSave = {
      formData,
      step,
      analysisResult,
      tailoredResume,
      generatedCoverLetter,
      sources
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToSave));
  }, [formData, step, analysisResult, tailoredResume, generatedCoverLetter, sources, isLoaded]);


  // --- Loading Animation Cycler ---
  useEffect(() => {
    if (isProcessing) {
      const messages = [
        "Aligning the constellations...",
        "Reading your chronicles...",
        "Deciphering the destination...",
        "Weaving the spells...",
        "Polishing the gems...",
        "Consulting the archives..."
      ];
      setLoadingMessage(messages[0]);
      let i = 1;
      const interval = setInterval(() => {
        setLoadingMessage(messages[i % messages.length]);
        i++;
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isProcessing]);

  // --- Actions ---

  const handleResetApplication = () => {
    if (window.confirm("Are you sure you want to discard this job application and start a new quest? Your profile will be kept.")) {
      // Keep profile data, clear job data
      setFormData(prev => ({
        ...prev,
        jobDescription: '',
        companyName: '',
        revisionInstructions: ''
      }));
      setAnalysisResult(null);
      setTailoredResume('');
      setGeneratedCoverLetter('');
      setSources([]);
      setStep('job');
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!formData.jobDescription.trim()) {
      setError("We need a destination (Job Description) to proceed.");
      return;
    }
    setIsProcessing(true);
    setError(null);
    try {
      const result = await analyzeJobFit(formData);
      setAnalysisResult(result);
      setStep('analysis');
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCv = async () => {
    setIsProcessing(true);
    setError(null);
    setLoadingMessage(t.cvShield + "...");
    try {
      const result = await tailorResume(formData);
      setTailoredResume(result);
      setStep('cv');
    } catch (err) {
      setError("Could not tailor resume.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCreateCoverLetter = async (instructions?: string) => {
    setIsProcessing(true);
    setError(null);
    setLoadingMessage(t.letterScroll + "...");

    // Create a temporary data object merging any new instructions
    // We also update state so it's persisted, but use the local variable for the immediate call
    let dataToUse = { ...formData };
    if (instructions) {
      dataToUse = { ...formData, revisionInstructions: instructions };
      setFormData(dataToUse);
    }

    try {
      const result = await generateCoverLetter(dataToUse);
      setGeneratedCoverLetter(result.content);
      setSources(result.sources || []);
      setStep('letter');
    } catch (err) {
      setError("Could not generate cover letter.");
    } finally {
      setIsProcessing(false);
    }
  };

  // --- Navigation Helpers ---

  const steps: { id: Step, label: string, icon: any }[] = [
    { id: 'profile', label: 'Profile', icon: Feather },
    { id: 'job', label: 'Quest', icon: MapPin },
    { id: 'analysis', label: 'Consult', icon: Sparkles },
    { id: 'cv', label: 'Shield', icon: Shield },
    { id: 'letter', label: 'Scroll', icon: Scroll },
  ];

  const canNavigateTo = (targetId: Step): boolean => {
    // Profile and Job are always accessible
    if (targetId === 'profile' || targetId === 'job') return true;
    // Analysis accessible if we have a result
    if (targetId === 'analysis' && analysisResult) return true;
    // CV accessible if we have a draft
    if (targetId === 'cv' && tailoredResume) return true;
    // Letter accessible if we have a draft
    if (targetId === 'letter' && generatedCoverLetter) return true;
    return false;
  };

  const currentStepIndex = steps.findIndex(s => s.id === step);

  if (!isLoaded) return null; // Prevent flash of empty state

  return (
    <div className="min-h-screen flex flex-col bg-[#fdf6e3] text-[#2c3e50] font-sans selection:bg-[#ff6b6b] selection:text-white bg-[url('https://www.transparenttextures.com/patterns/cream-dust.png')]">

      <Navbar
        onBrandClick={() => setStep('profile')}
        currentStepIndex={currentStepIndex}
        onReset={handleResetApplication}
        language={formData.language}
        onLanguageChange={(lang) => setFormData(prev => ({ ...prev, language: lang }))}
      />

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col">

        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-10 overflow-x-auto py-2">
          {steps.map((s, idx) => {
            const isActive = s.id === step;
            const isAccessible = canNavigateTo(s.id);
            const isPast = idx < currentStepIndex;

            return (
              <React.Fragment key={s.id}>
                <div className="flex flex-col items-center gap-2 relative group">
                  <button
                    onClick={() => isAccessible && setStep(s.id)}
                    disabled={!isAccessible}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 border-2 z-10 relative
                        ${isActive
                        ? 'bg-[#2b5876] border-[#2b5876] text-white scale-110 shadow-lg'
                        : isAccessible
                          ? 'bg-[#fffdf5] border-[#c5a059] text-[#2b5876] hover:bg-[#eef5fa] cursor-pointer'
                          : 'bg-[#fdf6e3] border-[#d4c5b0] text-[#d4c5b0] cursor-not-allowed'
                      }`}
                  >
                    <s.icon className="w-5 h-5" />
                    {/* Auto-save indicator for active step */}
                    {isActive && (
                      <div className="absolute -top-1 -right-1">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#10b981]"></span>
                        </span>
                      </div>
                    )}
                  </button>
                  <span className={`text-[10px] font-bold uppercase tracking-widest absolute -bottom-6 whitespace-nowrap transition-colors
                        ${isActive ? 'text-[#2b5876]' : isAccessible ? 'text-[#637b89]' : 'text-[#d4c5b0]'}
                    `}>
                    {s.label}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div className={`w-8 sm:w-16 h-0.5 transition-colors duration-300 mx-2
                    ${isPast ? 'bg-[#c5a059]' : 'bg-[#d4c5b0]/50'}
                  `} />
                )}
              </React.Fragment>
            );
          })}
        </div>

        {error && (
          <div className="max-w-3xl mx-auto w-full mb-6 p-4 bg-[#fff0f0] border-l-4 border-[#ff6b6b] rounded-r text-sm font-medium text-[#c0392b] shadow-md animate-bounce">
            {error}
          </div>
        )}

        {/* Loading Overlay */}
        {isProcessing && (
          <div className="fixed inset-0 z-[60] bg-[#fdf6e3]/80 backdrop-blur-sm flex items-center justify-center animate-in fade-in duration-300">
            <div className="text-center p-8 bg-[#fffdf5] rounded-xl border border-[#c5a059] shadow-2xl relative overflow-hidden max-w-sm w-full mx-4">
              <div className="relative z-10">
                <div className="w-20 h-20 mx-auto mb-6 relative">
                  <Loader2 className="w-full h-full text-[#c5a059] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-[#2b5876] animate-pulse" />
                  </div>
                </div>
                <h3 className="text-xl font-display font-bold text-[#2b5876] mb-2 animate-pulse">
                  {loadingMessage}
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* Views */}
        <div className="flex-1 w-full max-w-5xl mx-auto min-h-[500px]">
          {step === 'profile' && (
            <ProfileForm
              data={formData}
              onChange={setFormData}
              onNext={() => setStep('job')}
              language={formData.language}
            />
          )}

          {step === 'job' && (
            <JobForm
              data={formData}
              onChange={setFormData}
              onAnalyze={handleAnalyze}
              isAnalyzing={isProcessing}
              onBack={() => setStep('profile')}
              language={formData.language}
            />
          )}

          {step === 'analysis' && analysisResult && (
            <div className="h-full animate-in fade-in slide-in-from-bottom-8 duration-500">
              <AnalysisView
                result={analysisResult}
                onProceed={() => handleCreateCv()}
                onCancel={() => setStep('job')}
                isGeneratingDraft={isProcessing}
                styleNotes={formData.writingSample}
                onStyleNotesChange={(val) => setFormData(prev => ({ ...prev, writingSample: val }))}
                onStartNew={handleResetApplication}
                language={formData.language}
              />
            </div>
          )}

          {step === 'cv' && (
            <CvView
              content={tailoredResume}
              onApprove={() => handleCreateCoverLetter()}
              onRegenerate={() => handleCreateCv()}
              isGenerating={isProcessing}
              language={formData.language}
            />
          )}

          {step === 'letter' && (
            <CoverLetterView
              content={generatedCoverLetter}
              sources={sources}
              onRegenerate={(instructions) => handleCreateCoverLetter(instructions)}
              isGenerating={isProcessing}
              onStartOver={handleResetApplication}
              language={formData.language}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;