import React from 'react';
import { ArrowLeft, Search, Edit3 } from 'lucide-react';

interface Props {
  prompt: string;
  setPrompt: (val: string) => void;
  onBack: () => void;
  onExecute: () => void;
  isLoading: boolean;
}

export const PromptReview: React.FC<Props> = ({ prompt, setPrompt, onBack, onExecute, isLoading }) => {
  return (
    <div className="animate-in slide-in-from-right-8 duration-500">
      <div className="bg-white rounded-xl shadow-xl border border-stone-200 overflow-hidden">
        <div className="bg-stone-50 p-6 border-b border-stone-200 flex justify-between items-center">
          <button 
            onClick={onBack}
            className="text-stone-500 hover:text-stone-800 flex items-center gap-2 text-sm font-bold transition-colors uppercase tracking-wide"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </button>
          <div className="flex items-center gap-2 text-amber-700 font-serif font-bold text-lg">
            <Edit3 className="w-5 h-5" />
            <span>Revisar Prompt Generado</span>
          </div>
        </div>

        <div className="p-6 md:p-10">
          <label className="block text-stone-600 font-medium mb-3">
            Edita el prompt si es necesario antes de buscar:
          </label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full h-96 p-6 bg-stone-50 border border-stone-300 rounded-lg font-mono text-sm text-stone-800 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 focus:outline-none resize-none leading-relaxed shadow-inner"
              spellCheck={false}
            />
          </div>

          <div className="mt-8 flex justify-end">
            <button
              onClick={onExecute}
              disabled={isLoading}
              className={`flex items-center gap-2 px-8 py-3 rounded-lg text-white font-bold text-lg shadow-md transition-all transform hover:-translate-y-0.5
                 ${isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'}`}
            >
               {isLoading ? (
                <>
                   <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Procesando...
                </>
               ) : (
                 <>
                   <Search className="w-5 h-5" />
                   Buscar / Ejecutar
                 </>
               )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};