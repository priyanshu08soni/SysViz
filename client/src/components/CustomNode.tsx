import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node, useReactFlow } from '@xyflow/react';
import {
    Monitor, Database, Box, Cpu, Workflow, ShieldCheck,
    Brain, FileJson, Activity, Globe, Zap, BarChart, StickyNote, Trash2
} from 'lucide-react';
import { SystemNodeData, NodeType } from '../store/useDiagramStore';

const iconMap: Record<NodeType, React.ReactNode> = {
    client: <Monitor size={18} />,
    loadBalancer: <Workflow size={18} />,
    apiGateway: <ShieldCheck size={18} />,
    webServer: <Cpu size={18} />,
    cache: <Box size={18} />,
    messageQueue: <Box size={18} />,
    database: <Database size={18} />,

    // ML Nodes
    mlModel: <Brain size={18} />,
    trainingData: <FileJson size={18} />,
    inferenceServer: <Activity size={18} />,

    // Web Nodes
    frontend: <Globe size={18} />,
    cdn: <Zap size={18} />,
    analytics: <BarChart size={18} />,

    // Tools
    note: <StickyNote size={18} />,
};

const colorMap: Record<NodeType, string> = {
    client: 'border-blue-500/40 bg-[#3b82f6]/10 text-blue-100',
    loadBalancer: 'border-purple-500/40 bg-[#8b5cf6]/10 text-purple-100',
    apiGateway: 'border-indigo-500/40 bg-[#6366f1]/10 text-indigo-100',
    webServer: 'border-emerald-500/40 bg-[#10b981]/10 text-emerald-100',
    cache: 'border-orange-500/40 bg-[#f97316]/10 text-orange-100',
    messageQueue: 'border-pink-500/40 bg-[#ec4899]/10 text-pink-100',
    database: 'border-rose-500/40 bg-[#f43f5e]/10 text-rose-100',

    // ML
    mlModel: 'border-fuchsia-500/40 bg-[#d946ef]/10 text-fuchsia-100',
    trainingData: 'border-yellow-500/40 bg-[#eab308]/10 text-yellow-100',
    inferenceServer: 'border-cyan-500/40 bg-[#06b6d4]/10 text-cyan-100',

    // Web
    frontend: 'border-sky-500/40 bg-[#0ea5e9]/10 text-sky-100',
    cdn: 'border-lime-500/40 bg-[#84cc16]/10 text-lime-100',
    analytics: 'border-violet-500/40 bg-[#8b5cf6]/10 text-violet-100',

    // Tools
    note: 'border-yellow-200/40 bg-yellow-100/10 text-yellow-100',
};

type CustomNodeProps = NodeProps<Node<SystemNodeData>>;

const CustomNode = ({ id, data, selected }: CustomNodeProps) => {
    const { updateNodeData, deleteElements } = useReactFlow();

    // Special rendering for Note node
    if (data.type === 'note') {
        const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            updateNodeData(id, { label: e.target.value });
        };
        const onDelete = (e: React.MouseEvent) => {
            e.stopPropagation();
            deleteElements({ nodes: [{ id }] });
        };

        return (
            <div className={`p-3 rounded-lg border shadow-sm transition-all duration-200 min-w-[200px] min-h-[150px] bg-[#2d2e31] border-yellow-500/50 group ${selected ? 'ring-1 ring-yellow-400' : ''}`}>
                <button
                    onClick={onDelete}
                    className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-600"
                >
                    <Trash2 size={10} />
                </button>
                <div className="flex items-center gap-2 mb-2 text-yellow-400">
                    <StickyNote size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Note</span>
                </div>
                <textarea
                    className="w-full h-full bg-transparent border-none focus:outline-none text-xs text-gray-200 resize-none font-normal placeholder-gray-500 leading-relaxed"
                    placeholder="Add your notes here..."
                    defaultValue={data.label === 'Note' ? '' : data.label}
                    onChange={handleNoteChange}
                    onMouseDown={(e) => e.stopPropagation()}
                />
            </div>
        );
    }

    const onDataChange = (field: string, value: string | number) => {
        updateNodeData(id, { [field]: value });
    };

    const onDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        deleteElements({ nodes: [{ id }] });
    };

    return (
        <div className={`px-3 py-2.5 rounded-lg border shadow-sm transition-all duration-200 min-w-[140px] group ${selected ? 'ring-2 ring-primary border-transparent' : ''
            } ${colorMap[data.type] || 'border-gray-600 bg-[#303134]'}`}>

            <button
                onClick={onDelete}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-sm z-10 hover:bg-red-600"
            >
                <Trash2 size={10} />
            </button>

            <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-400 !border-2 !border-[#202124]" />

            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-white/5 text-current">
                    {iconMap[data.type]}
                </div>
                <div className="flex flex-col">
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">
                        {data.type}
                    </div>
                    <input
                        className="text-xs font-semibold text-white bg-transparent border-none focus:ring-0 w-24 p-0 placeholder-gray-500"
                        defaultValue={data.label}
                        onChange={(e) => onDataChange('label', e.target.value)}
                    />
                </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-white/5 flex justify-between gap-2">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase opacity-50 mb-0.5">Latency</span>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            className="font-mono bg-transparent p-0 w-8 text-xs focus:outline-none text-right border-b border-transparent focus:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            defaultValue={data.latency || 0}
                            onChange={(e) => onDataChange('latency', parseInt(e.target.value))}
                        />
                        <span className="text-[9px] opacity-50">ms</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] uppercase opacity-50 mb-0.5">Load</span>
                    <div className="flex items-center gap-1">
                        <input
                            type="number"
                            className="font-mono bg-transparent p-0 w-8 text-xs focus:outline-none text-right border-b border-transparent focus:border-white/20 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            defaultValue={data.throughput || 0}
                            onChange={(e) => onDataChange('throughput', parseInt(e.target.value))}
                        />
                        <span className="text-[9px] opacity-50">%</span>
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-400 !border-2 !border-[#202124]" />
        </div>
    );
};


export default memo(CustomNode);
