import React, { useState } from 'react';
import { UserSelections, SavedConfig } from '../types';
import { TASK_TYPES, DEPTH_OPTIONS, ROLES, RESOURCE_TYPES, CITATION_FORMATS, AUDIENCES, FORMATS } from '../constants';
import { ChevronDown, CheckSquare, Square, Sparkles, Save, FolderOpen, Trash2, X, PenTool } from 'lucide-react';

interface Props {
  selections: UserSelections;
  setSelections: React.Dispatch<React.SetStateAction<UserSelections>>;
  onGenerate: () => void;
  isLoading: boolean;
  savedConfigs: SavedConfig[];
  onSave: (name: string) => void;
  onLoad: (config: SavedConfig) => void;
  onDelete: (id: string) => void;
}

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h3 className="text-xl font-serif font-bold text-stone-800 mb-4 mt-10 flex items-center gap-2 border-b border-stone-200 pb-2">
    <span className="w-1.5 h-6 bg-amber-500 rounded-full inline-block"></span>
    {children}
  </h3>
);

export const PromptBuilderForm: React.FC<Props> = ({ 
  selections, 
  setSelections, 
  onGenerate, 
  isLoading,
  savedConfigs,
  onSave,
  onLoad,
  onDelete
}) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [newConfigName, setNewConfigName] = useState('');

  const handleChange = (field: keyof UserSelections, value: any) => {
    setSelections(prev => ({ ...prev, [field]: value }));
  };

  const toggleDepth = (option: string) => {
    setSelections(prev => {
      const current = prev.depth;
      if (current.includes(option)) {
        return { ...prev, depth: current.filter(item => item !== option) };
      } else {
        return { ...prev, depth: [...current, option] };
      }
    });
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newConfigName.trim()) {
      onSave(newConfigName);
      setNewConfigName('');
      setShowSaveModal(false);
    }
  };

  // Updated aesthetic classes
  const inputClasses = "w-full p-3 bg-white border border-stone-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-stone-800 placeholder-stone-400 font-medium shadow-sm";
  const selectClasses = "w-full p-3 bg-white border border-stone-300 rounded-md appearance-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-stone-800 font-medium shadow-sm cursor-pointer";

  return (
    <div className="space-y-8 animate-in fade-in duration-500 relative">
      
      {/* Top Toolbar for Save/Load */}
      <div className="flex justify-end gap-3 mb-4">
        <button
          onClick={() => setShowLoadModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 hover:text-amber-700 hover:border-amber-300 transition-colors shadow-sm"
        >
          <FolderOpen className="w-4 h-4" />
          Cargar Configuración
        </button>
        <button
          onClick={() => setShowSaveModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-stone-600 bg-white border border-stone-300 rounded-lg hover:bg-stone-50 hover:text-amber-700 hover:border-amber-300 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Guardar Actual
        </button>
      </div>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-stone-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">Guardar Configuración</h3>
              <button onClick={() => setShowSaveModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSaveSubmit}>
              <label className="block text-sm font-bold text-stone-700 mb-2">Nombre</label>
              <input
                autoFocus
                type="text"
                value={newConfigName}
                onChange={e => setNewConfigName(e.target.value)}
                placeholder="Ej: Reporte Financiero Mensual"
                className={inputClasses + " mb-6"}
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowSaveModal(false)}
                  className="px-4 py-2 text-stone-700 font-medium hover:bg-stone-100 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={!newConfigName.trim()}
                  className="px-4 py-2 bg-amber-600 text-white font-medium rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-lg max-h-[80vh] flex flex-col border border-stone-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-serif font-bold text-stone-900">Cargar Configuración</h3>
              <button onClick={() => setShowLoadModal(false)} className="text-stone-400 hover:text-stone-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2 space-y-2">
              {savedConfigs.length === 0 ? (
                <p className="text-center text-stone-500 py-8">No hay configuraciones guardadas aún.</p>
              ) : (
                savedConfigs.sort((a, b) => b.createdAt - a.createdAt).map(config => (
                  <div key={config.id} className="flex items-center justify-between p-4 border border-stone-200 rounded-lg hover:border-amber-400 hover:bg-amber-50/50 transition-all group bg-white cursor-pointer" onClick={() => { onLoad(config); setShowLoadModal(false); }}>
                    <div className="flex-1">
                      <h4 className="font-bold text-stone-800 font-serif text-lg">{config.name}</h4>
                      <p className="text-xs text-stone-500 mt-1 font-medium uppercase tracking-wider">{new Date(config.createdAt).toLocaleDateString()} • {config.selections.taskType}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); onDelete(config.id); }}
                      className="p-2 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-8 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-orange-600"></div>
        
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-amber-100 text-amber-600 rounded-full mb-4">
            <PenTool className="w-6 h-6" />
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 tracking-tight">Configura tu Asistente</h2>
          <p className="text-stone-500 mt-3 font-medium text-lg">Define los parámetros para obtener el mejor resultado posible.</p>
        </div>

        {/* 1. Task Type */}
        <SectionTitle>¿Qué deseas que realice?</SectionTitle>
        <div className="relative">
          <select
            value={selections.taskType}
            onChange={(e) => handleChange('taskType', e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled>Selecciona una opción...</option>
            {TASK_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-stone-500 pointer-events-none" />
        </div>
        {selections.taskType === 'Otro' && (
          <input
            type="text"
            placeholder="Especifique la tarea..."
            value={selections.taskTypeOther}
            onChange={(e) => handleChange('taskTypeOther', e.target.value)}
            className={"mt-3 " + inputClasses}
          />
        )}

        {/* 2. Depth / Breadth */}
        <SectionTitle>Profundidad y Amplitud del resultado</SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {DEPTH_OPTIONS.map(option => (
            <div
              key={option}
              onClick={() => toggleDepth(option)}
              className={`cursor-pointer flex items-center p-4 rounded-lg border-2 transition-all duration-200 ${
                selections.depth.includes(option)
                  ? 'bg-amber-50 border-amber-500 text-amber-900'
                  : 'bg-white border-stone-200 hover:border-amber-300 text-stone-700'
              }`}
            >
              {selections.depth.includes(option) ? (
                <CheckSquare className="w-5 h-5 mr-3 text-amber-600" />
              ) : (
                <Square className="w-5 h-5 mr-3 text-stone-300" />
              )}
              <span className="text-sm font-bold">{option}</span>
            </div>
          ))}
        </div>

        {/* 3. Context */}
        <SectionTitle>Contexto de la solicitud</SectionTitle>
        <textarea
          rows={3}
          placeholder="Describe el contexto para que la IA comprenda mejor tu situación..."
          value={selections.context}
          onChange={(e) => handleChange('context', e.target.value)}
          className={inputClasses + " resize-y"}
        />

        {/* 4. Examples (Input) */}
        <SectionTitle>Ejemplos (Opcional)</SectionTitle>
        <textarea
          rows={2}
          placeholder="Agrega ejemplos para guiar el estilo o formato..."
          value={selections.examples}
          onChange={(e) => handleChange('examples', e.target.value)}
          className={inputClasses + " resize-y"}
        />

        {/* 5. Role */}
        <SectionTitle>Rol Específico</SectionTitle>
        <div className="relative">
          <select
            value={selections.role}
            onChange={(e) => handleChange('role', e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled>Selecciona un rol...</option>
            {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-stone-500 pointer-events-none" />
        </div>
        {selections.role === 'Otro' && (
          <input
            type="text"
            placeholder="Especifique el rol..."
            value={selections.roleOther}
            onChange={(e) => handleChange('roleOther', e.target.value)}
            className={"mt-3 " + inputClasses}
          />
        )}

        {/* 6. Additional Resources */}
        <SectionTitle>¿Deseas que proporcione otros recursos adicionales?</SectionTitle>
        <div className="relative">
          <select
            value={selections.additionalResources}
            onChange={(e) => handleChange('additionalResources', e.target.value)}
            className={selectClasses}
          >
            <option value="">Ninguno / No necesario</option>
            {RESOURCE_TYPES.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-stone-500 pointer-events-none" />
        </div>
        {selections.additionalResources === 'Otro' && (
          <input
            type="text"
            placeholder="Especifique otro recurso..."
            value={selections.additionalResourcesOther}
            onChange={(e) => handleChange('additionalResourcesOther', e.target.value)}
            className={"mt-3 " + inputClasses}
          />
        )}

        {/* 7. Citation Format */}
        <SectionTitle>Formato para las referencias</SectionTitle>
        <div className="relative">
          <select
            value={selections.citationStyle}
            onChange={(e) => handleChange('citationStyle', e.target.value)}
            className={selectClasses}
          >
            <option value="">No especificado</option>
            {CITATION_FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-stone-500 pointer-events-none" />
        </div>

        {/* 8. Specific Examples (Output) */}
        <SectionTitle>¿Deseas que agregue ejemplos específicos?</SectionTitle>
        <input
          type="text"
          placeholder="Describe los ejemplos que deseas (Opcional)"
          value={selections.specificExamples}
          onChange={(e) => handleChange('specificExamples', e.target.value)}
          className={inputClasses}
        />

        {/* 9. Audience */}
        <SectionTitle>Audiencia Objetivo</SectionTitle>
        <div className="relative">
          <select
            value={selections.audience}
            onChange={(e) => handleChange('audience', e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled>Selecciona la audiencia...</option>
            {AUDIENCES.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-stone-500 pointer-events-none" />
        </div>
        {selections.audience === 'Otro' && (
          <input
            type="text"
            placeholder="Especifique la audiencia..."
            value={selections.audienceOther}
            onChange={(e) => handleChange('audienceOther', e.target.value)}
            className={"mt-3 " + inputClasses}
          />
        )}

        {/* 10. Format */}
        <SectionTitle>Formato de Respuesta</SectionTitle>
        <div className="relative">
          <select
            value={selections.format}
            onChange={(e) => handleChange('format', e.target.value)}
            className={selectClasses}
          >
            <option value="" disabled>Selecciona el formato...</option>
            {FORMATS.map(f => <option key={f} value={f}>{f}</option>)}
          </select>
          <ChevronDown className="absolute right-3 top-3.5 h-5 w-5 text-stone-500 pointer-events-none" />
        </div>

        {/* Action Button */}
        <div className="mt-12 pt-8 border-t border-stone-200 flex justify-end">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className={`flex items-center gap-3 px-10 py-4 rounded-lg text-white font-bold text-lg shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98]
              ${isLoading ? 'bg-stone-400 cursor-not-allowed' : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-orange-200'}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Preparar Prompt
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};