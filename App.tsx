import React, { useState, useEffect } from 'react';
import { UserSelections, AppStage, GenerationState, SavedConfig } from './types';
import { PromptBuilderForm } from './components/PromptBuilderForm';
import { PromptReview } from './components/PromptReview';
import { ResultDisplay } from './components/ResultDisplay';
import { generateRefinedPrompt, executeFinalPrompt } from './services/geminiService';
import { Bot, BookOpen } from 'lucide-react';

const INITIAL_SELECTIONS: UserSelections = {
  taskType: '',
  taskTypeOther: '',
  depth: [],
  context: '',
  examples: '',
  role: '',
  roleOther: '',
  additionalResources: '',
  additionalResourcesOther: '',
  citationStyle: '',
  specificExamples: '',
  audience: '',
  audienceOther: '',
  format: ''
};

export default function App() {
  const [stage, setStage] = useState<AppStage>('INPUT');
  const [selections, setSelections] = useState<UserSelections>(INITIAL_SELECTIONS);
  
  const [genState, setGenState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    generatedPrompt: '',
    finalResult: ''
  });

  const [savedConfigs, setSavedConfigs] = useState<SavedConfig[]>([]);

  // Load saved configs from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('promptMasterConfigs');
      if (saved) {
        setSavedConfigs(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load configs", e);
    }
  }, []);

  // Save Logic
  const handleSaveConfig = (name: string) => {
    const newConfig: SavedConfig = {
      id: crypto.randomUUID(),
      name,
      createdAt: Date.now(),
      selections
    };
    const updated = [newConfig, ...savedConfigs];
    setSavedConfigs(updated);
    localStorage.setItem('promptMasterConfigs', JSON.stringify(updated));
  };

  // Load Logic
  const handleLoadConfig = (config: SavedConfig) => {
    setSelections(config.selections);
    setGenState(prev => ({ ...prev, generatedPrompt: '', finalResult: '' }));
    setStage('INPUT');
  };

  // Delete Logic
  const handleDeleteConfig = (id: string) => {
    const updated = savedConfigs.filter(c => c.id !== id);
    setSavedConfigs(updated);
    localStorage.setItem('promptMasterConfigs', JSON.stringify(updated));
  };

  // Step 1: Generate the Prompt
  const handlePreparePrompt = async () => {
    if (!selections.taskType || !selections.role || !selections.audience) {
      alert("Por favor completa los campos requeridos (Tarea, Rol, Audiencia).");
      return;
    }

    setGenState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const prompt = await generateRefinedPrompt(selections);
      setGenState(prev => ({ 
        ...prev, 
        isLoading: false, 
        generatedPrompt: prompt 
      }));
      setStage('REVIEW');
    } catch (err: any) {
      setGenState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message 
      }));
    }
  };

  // Step 2: Execute the Prompt
  const handleExecuteSearch = async () => {
    setGenState(prev => ({ ...prev, isLoading: true, error: null }));
    
    try {
      const result = await executeFinalPrompt(genState.generatedPrompt);
      setGenState(prev => ({ 
        ...prev, 
        isLoading: false, 
        finalResult: result 
      }));
      setStage('RESULT');
    } catch (err: any) {
      setGenState(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: err.message 
      }));
    }
  };

  const handleReset = () => {
    setStage('INPUT');
    setGenState(prev => ({ ...prev, finalResult: '' }));
  };

  const canGoToReview = !!genState.generatedPrompt;
  const canGoToResult = !!genState.finalResult;

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-stone-900 text-stone-50 border-b border-stone-800 sticky top-0 z-50 shadow-md">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setStage('INPUT')}>
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-900/50 group-hover:scale-105 transition-transform">
              <BookOpen className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl tracking-wide leading-none">Prompt<span className="text-amber-500">Master</span></h1>
              <span className="text-[10px] uppercase tracking-widest text-stone-400 font-semibold">AI Writing Assistant</span>
            </div>
          </div>
          
          {/* Progress Indicators */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium">
            <button 
              onClick={() => setStage('INPUT')}
              className={`flex items-center gap-2 transition-colors ${stage === 'INPUT' ? 'text-amber-500' : 'text-stone-500 hover:text-stone-300'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${stage === 'INPUT' ? 'border-amber-500 bg-amber-500 text-stone-900 font-bold' : 'border-stone-600'}`}>1</span>
              Configurar
            </button>
            
            <div className="w-12 h-px bg-stone-800" />
            
            <button 
              onClick={() => canGoToReview && setStage('REVIEW')}
              disabled={!canGoToReview}
              className={`flex items-center gap-2 transition-colors ${!canGoToReview ? 'cursor-not-allowed opacity-40' : 'hover:text-amber-400'} ${stage === 'REVIEW' ? 'text-amber-500' : 'text-stone-500'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${stage === 'REVIEW' ? 'border-amber-500 bg-amber-500 text-stone-900 font-bold' : 'border-stone-600'}`}>2</span>
              Refinar
            </button>
            
            <div className="w-12 h-px bg-stone-800" />
            
            <button 
              onClick={() => canGoToResult && setStage('RESULT')}
              disabled={!canGoToResult}
              className={`flex items-center gap-2 transition-colors ${!canGoToResult ? 'cursor-not-allowed opacity-40' : 'hover:text-amber-400'} ${stage === 'RESULT' ? 'text-amber-500' : 'text-stone-500'}`}
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border ${stage === 'RESULT' ? 'border-amber-500 bg-amber-500 text-stone-900 font-bold' : 'border-stone-600'}`}>3</span>
              Resultado
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10">
        {genState.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 shadow-sm">
            <span className="font-bold font-serif">Error:</span> {genState.error}
          </div>
        )}

        {stage === 'INPUT' && (
          <PromptBuilderForm 
            selections={selections}
            setSelections={setSelections}
            onGenerate={handlePreparePrompt}
            isLoading={genState.isLoading}
            savedConfigs={savedConfigs}
            onSave={handleSaveConfig}
            onLoad={handleLoadConfig}
            onDelete={handleDeleteConfig}
          />
        )}

        {stage === 'REVIEW' && (
          <PromptReview
            prompt={genState.generatedPrompt}
            setPrompt={(val) => setGenState(prev => ({ ...prev, generatedPrompt: val }))}
            onBack={() => setStage('INPUT')}
            onExecute={handleExecuteSearch}
            isLoading={genState.isLoading}
          />
        )}

        {stage === 'RESULT' && (
          <ResultDisplay 
            result={genState.finalResult}
            onReset={handleReset}
          />
        )}
      </main>
    </div>
  );
}