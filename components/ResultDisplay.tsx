import React from 'react';
import { RefreshCw, Clipboard, Check, Download } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  result: string;
  onReset: () => void;
}

export const ResultDisplay: React.FC<Props> = ({ result, onReset }) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([result], {type: 'text/markdown'});
    element.href = URL.createObjectURL(file);
    element.download = "resultado_prompt_master.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="animate-in zoom-in-95 duration-500">
      <div className="bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden">
        <div className="bg-stone-900 text-white p-4 flex flex-wrap gap-4 justify-between items-center sticky top-0 z-10 shadow-md">
          <h2 className="font-serif font-bold text-xl flex items-center gap-2 text-amber-50">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"/>
            Resultado Generado
          </h2>
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={handleDownload}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-stone-300 hover:text-white flex items-center gap-2"
              title="Descargar a PC"
            >
              <Download className="w-5 h-5" />
              <span className="hidden sm:inline text-sm font-medium">Exportar</span>
            </button>
            <button 
              onClick={handleCopy}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors text-stone-300 hover:text-white"
              title="Copiar al portapapeles"
            >
              {copied ? <Check className="w-5 h-5 text-green-400" /> : <Clipboard className="w-5 h-5" />}
            </button>
            <button 
              onClick={onReset}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 rounded-lg text-sm font-bold transition-colors shadow-lg text-white"
            >
              <RefreshCw className="w-4 h-4" />
              Nueva Búsqueda
            </button>
          </div>
        </div>
        
        <div className="p-8 md:p-12 overflow-y-auto max-h-[80vh] bg-stone-50">
          <article className="prose prose-stone prose-lg max-w-none prose-headings:font-serif prose-headings:text-stone-900 prose-p:text-stone-700 prose-a:text-amber-700 prose-strong:text-stone-900">
            <ReactMarkdown>{result}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
};