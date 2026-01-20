import React, { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    useNodesState,
    useEdgesState,
    addEdge,
    Connection,
    Edge,
    Node
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../CustomNode';

const nodeTypes = {
    custom: CustomNode,
};

const initialNodes: Node[] = [
    {
        id: '1',
        type: 'custom',
        position: { x: 250, y: 50 },
        data: { type: 'client', label: 'Users', latency: 20, throughput: 100 }
    },
    {
        id: '2',
        type: 'custom',
        position: { x: 250, y: 200 },
        data: { type: 'loadBalancer', label: 'Load Balancer', latency: 5, throughput: 95 }
    },
    {
        id: '3',
        type: 'custom',
        position: { x: 100, y: 350 },
        data: { type: 'webServer', label: 'Server A', latency: 45, throughput: 40 }
    },
    {
        id: '4',
        type: 'custom',
        position: { x: 400, y: 350 },
        data: { type: 'webServer', label: 'Server B', latency: 42, throughput: 55 }
    },
    {
        id: '5',
        type: 'custom',
        position: { x: 250, y: 500 },
        data: { type: 'database', label: 'Primary DB', latency: 15, throughput: 80 }
    }
];

const initialEdges: Edge[] = [
    { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: '#3b82f6' } },
    { id: 'e2-3', source: '2', target: '3', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e2-4', source: '2', target: '4', animated: true, style: { stroke: '#8b5cf6' } },
    { id: 'e3-5', source: '3', target: '5', animated: true, style: { stroke: '#10b981' } },
    { id: 'e4-5', source: '4', target: '5', animated: true, style: { stroke: '#10b981' } },
];

const InteractiveHeroGraph: React.FC = () => {
    const [nodes, , onNodesChange] = useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

    const onConnect = useCallback(
        (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#fff' } }, eds)),
        [setEdges],
    );

    return (
    return (
        <div className="absolute inset-0 w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505] pointer-events-none z-10" />

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                fitView
                className="bg-[#050505]"
                minZoom={0.5}
                maxZoom={1.5}
                proOptions={{ hideAttribution: true }}
            >
                <Background color="#1a1a1a" gap={24} size={1} />
                <Controls className="!bg-[#202124] !border-[#3c4043] [&>button]:!text-gray-400 m-4" />
            </ReactFlow>
        </div>
    );
    );
};

export default InteractiveHeroGraph;
