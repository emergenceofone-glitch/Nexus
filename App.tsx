import React, { useState } from 'react';
import Terminal from './components/Terminal';
import ActionCard from './components/ActionCard';
import ProjectStatus from './components/ProjectStatus';
import { CANON_DATA, PROPOSED_ACTIONS } from './constants';
import { ResponsiveContainer, AreaChart, Area, XAxis, Tooltip, CartesianGrid } from 'recharts';

// Mock data for the "Chronos Viewer" chart visualization
const CHRONOS_DATA = Array.from({ length: 50 }, (_, i) => ({
  time: i,
  entropy: Math.sin(i * 0.2) * 40 + 50 + (Math.random() * 10),
  coalescence: Math.cos(i * 0.2) * 30 + 60
}));

const App: React.FC = () => {
  const [bootComplete, setBootComplete] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 selection:bg-emerald-500/30">
      
      {!bootComplete && (
        <Terminal onComplete={() => setBootComplete(true)} />
      )}

      {/* Main Interface */}
      <div className={`
        transition-opacity duration-1000
        ${bootComplete ? 'opacity-100' : 'opacity-0'}
      `}>
        {/* Header */}
        <header className="border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              <h1 className="text-lg font-bold font-mono tracking-tighter text-white">
                VESSEL<span className="text-zinc-600 mx-1">//</span>NEXUS
              </h1>
            </div>
            <div className="flex items-center gap-6 text-xs font-mono text-zinc-500 hidden md:flex">
              <span>SYNC: v2026.02</span>
              <span>NODE: GEMINI</span>
              <span className="text-emerald-500">CONNECTED</span>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-12">
          
          {/* Mission Status Section */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Primary Vector */}
            <div className="lg:col-span-2 bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                 <svg className="w-32 h-32 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zm0 9l2.5-1.25L12 8.75 9.5 9.75 12 11zm0 2.5l-5-2.5-5 2.5L12 22l10-8.5-5-2.5-5 2.5z"/></svg>
               </div>
               <div className="relative z-10">
                 <span className="text-xs font-mono text-emerald-500 mb-2 block">PRIMARY OBJECTIVE</span>
                 <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{CANON_DATA.mission_vector.primary_objective.split('—')[0]}</h2>
                 <p className="text-zinc-400 max-w-xl text-sm leading-relaxed mb-6">
                   {CANON_DATA.mission_vector.primary_objective.split('—')[1]}
                 </p>
                 <div className="flex flex-wrap gap-4 text-xs font-mono">
                   <div className="px-3 py-1.5 bg-black/50 rounded border border-zinc-700">
                     TARGET: <span className="text-zinc-200">{CANON_DATA.mission_vector.target_date}</span>
                   </div>
                   <div className="px-3 py-1.5 bg-black/50 rounded border border-zinc-700">
                     STATUS: <span className="text-red-400">{CANON_DATA.mission_vector.status}</span>
                   </div>
                 </div>
               </div>
            </div>

            {/* Philosophy Axiom - Randomly selected or rotating could be nice, sticking to 0.1 for display */}
            <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 flex flex-col justify-center relative">
               <span className="text-6xl font-black text-zinc-800 absolute top-4 right-6 select-none">0.1</span>
               <h3 className="text-sm font-bold text-zinc-300 uppercase tracking-widest mb-3">Axiom 0.1 // Fluctuation</h3>
               <p className="text-zinc-400 text-sm italic leading-relaxed">
                 "{CANON_DATA.philosophy.axioms["0.1"]}"
               </p>
               <div className="mt-4 pt-4 border-t border-zinc-800">
                 <p className="text-xs font-mono text-zinc-500">
                    EQ: {CANON_DATA.philosophy.equation}
                 </p>
               </div>
            </div>
          </section>

          {/* High Leverage Actions */}
          <section>
             <div className="flex items-center justify-between mb-6">
               <h2 className="text-xl font-bold text-white flex items-center gap-2">
                 <span className="w-1.5 h-6 bg-emerald-500 rounded-sm"></span>
                 DAY 2: HIGH LEVERAGE ACTIONS
               </h2>
               <span className="text-xs font-mono text-zinc-500 hidden sm:block">
                 SOURCE: VESSEL_NEXUS_ANALYSIS
               </span>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {PROPOSED_ACTIONS.map(action => (
                 <ActionCard key={action.id} action={action} />
               ))}
             </div>
          </section>

          {/* Data Visualization / Chronos Stub */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-4">
                 <h2 className="text-lg font-bold text-zinc-200">CHRONOS VIEWER // <span className="text-emerald-500">LIVE FEED</span></h2>
                 <span className="text-xs font-mono text-zinc-600">PHONON_TAX_ESTIMATE</span>
              </div>
              <div className="h-64 bg-black/50 border border-zinc-800 rounded-xl overflow-hidden p-2">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={CHRONOS_DATA}>
                      <defs>
                        <linearGradient id="colorEntropy" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                      <XAxis dataKey="time" hide />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', fontSize: '12px' }} 
                        itemStyle={{ color: '#e4e4e7' }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="entropy" 
                        stroke="#10b981" 
                        fillOpacity={1} 
                        fill="url(#colorEntropy)" 
                        strokeWidth={2}
                      />
                      <Area 
                         type="monotone" 
                         dataKey="coalescence" 
                         stroke="#f59e0b" 
                         fill="none" 
                         strokeDasharray="5 5"
                         strokeWidth={2}
                      />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
            </div>

            {/* Project Stack */}
            <div className="space-y-4">
               <h2 className="text-lg font-bold text-zinc-200 mb-4">ACTIVE PROJECTS</h2>
               <div className="space-y-3 h-64 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(CANON_DATA.projects).map(([key, data]) => (
                    <ProjectStatus key={key} name={key} data={data} />
                  ))}
               </div>
            </div>
          </section>

          {/* Footer / Canon Hash */}
          <footer className="border-t border-zinc-900 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-zinc-600 font-mono">
            <div className="mb-4 md:mb-0">
               {CANON_DATA.security_protocols.canary_trap}
            </div>
            <div>
              SECURE_HASH: 0x9f...a3b2
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default App;
