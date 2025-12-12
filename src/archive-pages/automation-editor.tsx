
import { useState, useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  ReactFlowProvider,
  addEdge,
  Connection,
  Edge,
  Node,
  useNodesState,
  useEdgesState,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { DashboardPageHeader } from "~/components/dashboard/headers/DashboardPageHeader";
import { nodeTypes } from "~/components/automation/CustomNodes";
import { Webhook, MousePointer2, Sparkles, ArrowLeft, Save, Play } from 'lucide-react';
import { Button } from "~/components/ui/button";
import { useLocation } from "wouter";

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: {
      label: "When clicking 'Execute workflow'",
      icon: <MousePointer2 className="h-6 w-6 text-white" />
    },
  },
  {
    id: '2',
    type: 'trigger',
    position: { x: 100, y: 300 },
    data: {
      label: "Webhook",
      icon: <Webhook className="h-6 w-6 text-white" />
    },
  },
  {
    id: '3',
    type: 'custom',
    position: { x: 450, y: 300 },
    data: {
      label: "Transcribe a recording",
      description: "Transcribe Recording",
      icon: <Sparkles className="h-6 w-6 text-white" />
    },
  },
  {
    id: '4',
    type: 'custom',
    position: { x: 800, y: 300 },
    data: {
      label: "Respond to Webhook",
      icon: <Webhook className="h-6 w-6 text-white" />
    },
  },
  {
    id: '5',
    type: 'add',
    position: { x: 1100, y: 335 }, // Centered vertically relative to the previous node
    data: { label: "+" },
  },
  {
    id: '6',
    type: 'add',
    position: { x: 350, y: 135 },
    data: { label: "+" }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-6', source: '1', target: '6', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e2-3', source: '2', target: '3', label: 'POST', animated: true, style: { stroke: '#94a3b8' }, labelStyle: { fill: '#94a3b8', fontWeight: 700 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#94a3b8' } },
];

export default function AutomationEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [, setLocation] = useLocation();

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8' } }, eds)),
    [setEdges],
  );

  return (
    <div className="h-screen flex flex-col bg-[#0f0f12]">
      {/* Custom Header for Editor Mode */}
      <div className="h-16 border-b border-[#2a2a35] bg-[#0f0f12] flex items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-400 hover:text-white hover:bg-white/10"
            onClick={() => setLocation('/automation')}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-white">New User Onboarding</h1>
            <span className="text-xs text-slate-400">Last edited just now</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-transparent border-[#2a2a35] text-slate-300 hover:text-white hover:bg-white/5 gap-2">
            <Save className="h-4 w-4" />
            Save Draft
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
            <Play className="h-4 w-4 fill-current" />
            Activate
          </Button>
        </div>
      </div>

      {/* Editor Canvas */}
      <div className="flex-1 w-full bg-[#0f0f12]">
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            className="bg-[#0f0f12]"
            minZoom={0.5}
            maxZoom={1.5}
            defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
          >
            <Background color="#2a2a35" gap={20} size={1} />
            <Controls className="bg-[#1e1e24] border border-[#2a2a35] text-white fill-white" />
            <MiniMap
              nodeColor="#2a2a35"
              maskColor="rgba(15, 15, 18, 0.7)"
              className="bg-[#1e1e24] border border-[#2a2a35]"
            />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </div>
  );
}
