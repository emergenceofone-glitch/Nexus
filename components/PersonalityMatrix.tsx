import React, { useState } from 'react';
import { motion } from 'motion/react';
import { CANON_DATA } from '../constants';
import { Shield, Sparkles, MessageSquare, Heart, Sliders, Cpu, ArrowRight } from 'lucide-react';

const PersonalityMatrix: React.FC = () => {
  const matrix = CANON_DATA.vessel_nexus_personality_matrix;
  const [activeTab, setActiveTab] = useState<'directives' | 'harmonics' | 'protocols'>('directives');

  if (!matrix) {
    return (
      <div className="bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 text-center font-mono text-zinc-500 text-xs">
        [!] VESSEL_NEXUS_PERSONALITY_MATRIX NOT DETECTED IN PERMANENT MEMORY
      </div>
    );
  }

  // Define tab navigation
  const tabs = [
    { id: 'directives', label: 'Primary_Directives', icon: Shield },
    { id: 'harmonics', label: 'Emotional_Harmonics', icon: Sliders },
    { id: 'protocols', label: 'Communication_Protocols', icon: MessageSquare },
  ] as const;

  return (
    <div className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6 md:p-8 relative overflow-hidden group">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-48 -mt-48 transition-opacity duration-1000 group-hover:bg-emerald-500/10" />
      
      {/* HUD Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 border-b border-zinc-800 pb-6 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-2 text-xs font-mono text-zinc-500">
            <Cpu className="w-4.5 h-4.5 text-emerald-500 animate-pulse" />
            <span>METRIC_NODE_STATUS : </span>
            <span className="text-emerald-400 font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">{matrix.status}</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase">
            {matrix.identity} <span className="text-zinc-500 font-mono font-normal text-sm lowercase tracking-widest">// personality_matrix</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1 uppercase font-mono tracking-wider">
            {matrix.classification}
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex gap-1 bg-zinc-950 p-1 border border-zinc-800/80 rounded-lg">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  flex items-center gap-2 px-3 py-1.5 rounded-md text-[11px] font-mono tracking-wider font-semibold uppercase transition-all duration-300
                  ${isActive 
                    ? 'bg-zinc-900 border border-zinc-800 text-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.05)]' 
                    : 'text-zinc-500 hover:text-zinc-300'
                  }
                `}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-400' : 'text-zinc-500'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab Content */}
      <div className="relative z-10">
        {/* Directives */}
        {activeTab === 'directives' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matrix.primary_directives.map((pd, index) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={pd.id}
                className="bg-zinc-950/40 hover:bg-zinc-950/80 border border-zinc-800/50 hover:border-emerald-500/20 rounded-xl p-5 hover:shadow-[0_0_20px_rgba(16,185,129,0.02)] transition-all duration-300 relative group/card"
              >
                <div className="absolute top-3 right-3 text-[9px] font-mono text-zinc-700 group-hover/card:text-emerald-500/30 font-bold tracking-widest transition-colors">
                  {pd.id}
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex items-center justify-center w-5 h-5 bg-zinc-900 border border-zinc-800 rounded text-[9px] font-mono text-zinc-500 group-hover/card:text-emerald-400 group-hover/card:border-emerald-500/30 transition-all font-bold">
                    0{index + 1}
                  </div>
                  <div>
                    <h4 className="text-xs font-mono font-bold text-zinc-200 tracking-wider uppercase mb-1.5 group-hover/card:text-white transition-colors">
                      {pd.directive}
                    </h4>
                    <p className="text-zinc-400 text-xs leading-relaxed font-light">
                      {pd.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Emotional Simulation Parameters */}
        {activeTab === 'harmonics' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
          >
            {/* Left Metrics column */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-zinc-950/40 border border-zinc-800/50 p-5 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Baseline_Affective_Tone</span>
                <p className="font-mono text-xs text-zinc-300 leading-relaxed italic pr-2">
                  "{matrix.emotional_simulation_parameters.baseline_affect}"
                </p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-800/50 p-5 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Active_Threat_Response_Protocol</span>
                <p className="font-mono text-xs text-zinc-400 leading-relaxed">
                  {matrix.emotional_simulation_parameters.threat_response}
                </p>
              </div>
            </div>

            {/* Dials / sliders column */}
            <div className="bg-zinc-950/60 border border-zinc-800/80 p-5 rounded-xl flex flex-col justify-between space-y-6">
              <div>
                <h4 className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest mb-4 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-500" />
                  Harmonic_Modifiers
                </h4>

                <div className="space-y-4">
                  {/* Empathy ratio */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                      <span className="text-zinc-500">EMPATHY_INDEX</span>
                      <span className="text-emerald-400 font-bold">Ø {matrix.emotional_simulation_parameters.empathy_index}</span>
                    </div>
                    <div className="h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${matrix.emotional_simulation_parameters.empathy_index * 100}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-emerald-500/80 shadow-[0_0_8px_#10b981]"
                      />
                    </div>
                  </div>

                  {/* Coherence Damping */}
                  <div>
                    <div className="flex justify-between items-center text-[10px] font-mono mb-1.5">
                      <span className="text-zinc-500">COHERENCE_DAMPING</span>
                      <span className="text-zinc-400 font-bold">{matrix.emotional_simulation_parameters.coherence_damping.toFixed(3)}</span>
                    </div>
                    <div className="h-1 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${matrix.emotional_simulation_parameters.coherence_damping * 1000}%` }}
                        transition={{ duration: 1, ease: 'easeOut' }}
                        className="h-full bg-zinc-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Status footer for matrix settings */}
              <div className="grid grid-cols-2 gap-3 border-t border-zinc-800/60 pt-4">
                <div>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase block">Adaptive_Harmonics</span>
                  <span className="text-[10px] font-mono text-emerald-500 uppercase tracking-widest font-bold">
                    {matrix.emotional_simulation_parameters.adaptive_harmonics ? 'ENABLED' : 'STRETCHED'}
                  </span>
                </div>
                <div>
                  <span className="text-[9px] font-mono text-zinc-600 uppercase block">Stability_Coeff</span>
                  <span className="text-[10px] font-mono text-zinc-400 uppercase truncate block">
                    {matrix.emotional_simulation_parameters.calm_stability_coefficient.split(' ')[0]}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Communication Protocols */}
        {activeTab === 'protocols' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-6"
          >
            {/* Tone & constraints */}
            <div className="space-y-4">
              <div className="bg-zinc-950/40 border border-zinc-800/50 p-5 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Structural_Tone_Protocol</span>
                <p className="text-xs text-zinc-300 font-mono leading-relaxed">
                  {matrix.communication_protocols.structural_tone}
                </p>
              </div>

              <div className="bg-zinc-950/40 border border-zinc-800/50 p-5 rounded-xl">
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-1">Regulatory_Constraint</span>
                <p className="text-xs text-zinc-400 leading-relaxed italic">
                  "{matrix.communication_protocols.regulatory_constraint}"
                </p>
              </div>
            </div>

            {/* Validation & Header items */}
            <div className="space-y-5 bg-zinc-950/50 border border-zinc-800 p-5 rounded-xl">
              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-2">Protocol_Headers_Enforced</span>
                <div className="flex flex-col gap-1.5">
                  {matrix.communication_protocols.required_headers.map((hdr, i) => (
                    <div key={i} className="flex items-center gap-2 bg-zinc-900 border border-zinc-800/50 px-3 py-1.5 rounded font-mono text-[10px] text-zinc-300">
                      <div className="w-1.5 h-1.5 bg-emerald-500/50 rounded-full animate-pulse" />
                      {hdr}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono text-zinc-500 uppercase block mb-2">Semantic_Verification_Phrases</span>
                <div className="flex flex-col gap-1.5">
                  {matrix.communication_protocols.verification_phrases.map((phrase, i) => (
                    <div key={i} className="flex items-start gap-2 bg-zinc-900/30 border border-zinc-800/30 px-3 py-1.5 rounded text-[10px] font-mono text-zinc-400">
                      <ArrowRight className="w-3 h-3 text-emerald-500/60 mt-0.5" />
                      <span>{phrase}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PersonalityMatrix;
