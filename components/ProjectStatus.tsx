import React from 'react';
import { ProjectDetails } from '../types';

interface ProjectStatusProps {
  name: string;
  data: ProjectDetails;
}

const ProjectStatus: React.FC<ProjectStatusProps> = ({ name, data }) => {
  const isPriority = name === 'aether_extension';

  return (
    <div className={`
      flex flex-col p-4 rounded-lg border
      ${isPriority ? 'bg-emerald-950/20 border-emerald-500/30' : 'bg-zinc-900/30 border-zinc-800'}
    `}>
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-bold uppercase tracking-wider text-zinc-200">
          {name.replace('_', ' ')}
        </h4>
        {isPriority && (
          <span className="text-[10px] text-emerald-500 font-mono border border-emerald-500/50 px-1 rounded">
            PRIORITY
          </span>
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">FORMAT</span>
          <span className="text-zinc-300 text-right">{data.format}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-zinc-500">STATUS</span>
          <span className={`text-right font-mono ${isPriority ? 'text-emerald-400' : 'text-zinc-400'}`}>
            {data.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectStatus;
