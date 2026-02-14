import React, { useEffect } from 'react';
import { ProjectDetails } from '../types';

interface ProjectModalProps {
  name: string;
  data: ProjectDetails;
  onClose: () => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ name, data, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-zinc-800 flex justify-between items-center bg-zinc-950/50">
           <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${name === 'aether_extension' ? 'bg-emerald-500 shadow-[0_0_8px_#10b981]' : 'bg-zinc-600'}`} />
             <h2 className="text-lg font-bold text-white uppercase tracking-wider">
               {name.replace(/_/g, ' ')}
             </h2>
           </div>
           <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors p-1 hover:bg-zinc-800 rounded">
             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
             </svg>
           </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
           <div className="space-y-5">
              <DetailRow label="Format" value={data.format} />
              <DetailRow label="Status" value={data.status} highlight />
              
              {data.description && (
                  <div className="pt-2">
                    <span className="text-xs font-mono text-zinc-500 block mb-2 tracking-widest">DESCRIPTION</span>
                    <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/50 p-4 rounded border border-zinc-800/50">
                        {data.description}
                    </p>
                  </div>
              )}

              {data.current_focus && (
                  <div className="pt-2">
                     <span className="text-xs font-mono text-emerald-600 block mb-2 tracking-widest flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                        CURRENT FOCUS
                     </span>
                     <p className="text-sm text-zinc-200 border-l-2 border-emerald-500/30 pl-3 py-1">
                        {data.current_focus}
                     </p>
                  </div>
              )}

              {data.function && (
                  <div className="pt-2">
                     <span className="text-xs font-mono text-zinc-500 block mb-2 tracking-widest">FUNCTION</span>
                     <p className="text-sm text-zinc-400 italic">
                        {data.function}
                     </p>
                  </div>
              )}
           </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-zinc-950 border-t border-zinc-800 flex justify-between items-center">
             <span className="text-[9px] font-mono text-zinc-600">VESSEL::NEXUS::DB</span>
             <span className="text-[9px] font-mono text-zinc-600">ID: {btoa(name).substring(0,8)}</span>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

const DetailRow: React.FC<{label: string, value: string, highlight?: boolean}> = ({label, value, highlight}) => (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1 pb-2 border-b border-zinc-800/50 last:border-0">
        <span className="text-xs font-mono text-zinc-500 uppercase tracking-wider">{label}</span>
        <span className={`text-sm font-medium ${highlight ? 'text-emerald-400 font-mono' : 'text-zinc-200'}`}>{value}</span>
    </div>
);

export default ProjectModal;