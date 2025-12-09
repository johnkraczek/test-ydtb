
import { useCallback } from 'react';
import ReactFlow, {
  Handle,
  Position,
  NodeProps,
} from 'reactflow';
import { Zap, Webhook, MessageSquare, Plus } from 'lucide-react';
import { cn } from "@/lib/utils";

const CustomNode = ({ data, selected }: NodeProps) => {
  return (
    <div 
      className={cn(
        "bg-[#1e1e24] rounded-2xl border-2 min-w-[180px] shadow-lg transition-all duration-200",
        selected ? "border-indigo-500 shadow-indigo-500/20" : "border-[#2a2a35] hover:border-slate-600"
      )}
    >
      <div className="p-4">
        {/* Header with Icon */}
        <div className="flex flex-col items-center gap-3 text-center mb-2">
           <div className="h-12 w-12 rounded-2xl bg-[#2a2a35] flex items-center justify-center text-white border border-white/5 shadow-inner">
             {data.icon}
           </div>
           <div>
             <div className="text-sm font-medium text-white">{data.label}</div>
             <div className="text-[10px] text-slate-400 mt-0.5">{data.description}</div>
           </div>
        </div>
      </div>

      {/* Handles */}
      <Handle 
        type="target" 
        position={Position.Left} 
        className="w-3 h-3 !bg-slate-400 !border-2 !border-[#1e1e24]" 
      />
      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-slate-400 !border-2 !border-[#1e1e24]" 
      />
      
      {/* Output Label if present */}
      {data.outputLabel && (
        <div className="absolute -right-12 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-mono">
            {data.outputLabel}
        </div>
      )}
    </div>
  );
};

const TriggerNode = ({ data, selected }: NodeProps) => {
  return (
    <div 
      className={cn(
        "bg-[#1e1e24] rounded-2xl border-2 min-w-[180px] shadow-lg transition-all duration-200",
        selected ? "border-indigo-500 shadow-indigo-500/20" : "border-[#2a2a35] hover:border-slate-600"
      )}
    >
      <div className="absolute -left-3 top-4">
          <Zap className="h-6 w-6 text-orange-500 fill-orange-500 animate-pulse" />
      </div>

      <div className="p-4 pl-6">
        <div className="flex flex-col items-center gap-3 text-center mb-2">
           <div className="h-12 w-12 rounded-2xl bg-[#2a2a35] flex items-center justify-center text-white border border-white/5 shadow-inner">
             {data.icon}
           </div>
           <div>
             <div className="text-sm font-medium text-white">{data.label}</div>
             <div className="text-[10px] text-slate-400 mt-0.5">{data.description}</div>
           </div>
        </div>
      </div>

      <Handle 
        type="source" 
        position={Position.Right} 
        className="w-3 h-3 !bg-slate-400 !border-2 !border-[#1e1e24]" 
      />
    </div>
  );
};

const AddNode = ({ data }: NodeProps) => {
    return (
        <div className="h-10 w-10 rounded-xl border-2 border-dashed border-slate-600 hover:border-slate-400 bg-transparent flex items-center justify-center cursor-pointer transition-colors group">
            <Plus className="h-5 w-5 text-slate-600 group-hover:text-slate-400" />
             <Handle 
                type="target" 
                position={Position.Left} 
                className="w-1 h-1 !opacity-0" 
            />
        </div>
    )
}

export const nodeTypes = {
  custom: CustomNode,
  trigger: TriggerNode,
  add: AddNode
};
