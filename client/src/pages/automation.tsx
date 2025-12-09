
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
import DashboardLayout from "@/components/dashboard/Layout";
import { DashboardPageHeader } from "@/components/dashboard/headers/DashboardPageHeader";
import { nodeTypes } from "@/components/automation/CustomNodes";
import { Webhook, MousePointer2, Sparkles, MessageSquare } from 'lucide-react';

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
      position: { x: 350, y: 135},
      data: { label: "+" }
  }
];

const initialEdges: Edge[] = [
  { id: 'e1-6', source: '1', target: '6', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e2-3', source: '2', target: '3', label: 'POST', animated: true, style: { stroke: '#94a3b8' }, labelStyle: { fill: '#94a3b8', fontWeight: 700 } },
  { id: 'e3-4', source: '3', target: '4', animated: true, style: { stroke: '#94a3b8' } },
  { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#94a3b8' } },
];

export default function AutomationPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#94a3b8' } }, eds)),
    [setEdges],
  );

  return (
    <DashboardLayout 
      activeTool="automation"
      header={
        <DashboardPageHeader
          title="Automation"
          description="Manage your automation workflows."
        />
      }
    >
      <div className="h-full w-full bg-[#0f0f12]">
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
    </DashboardLayout>
  );
}
