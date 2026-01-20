import React, { memo } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import {
    Monitor, Database, Box, Cpu, Workflow, ShieldCheck,
    Brain, FileJson, Activity, Globe, Zap, BarChart, StickyNote
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
    mlModel: <Brain size={18} />,
    trainingData: <FileJson size={18} />,
    inferenceServer: <Activity size={18} />,
    frontend: <Globe size={18} />,
    cdn: <Zap size={18} />,
    analytics: <BarChart size={18} />,
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
    mlModel: 'border-fuchsia-500/40 bg-[#d946ef]/10 text-fuchsia-100',
    trainingData: 'border-yellow-500/40 bg-[#eab308]/10 text-yellow-100',
    inferenceServer: 'border-cyan-500/40 bg-[#06b6d4]/10 text-cyan-100',
    frontend: 'border-sky-500/40 bg-[#0ea5e9]/10 text-sky-100',
    cdn: 'border-lime-500/40 bg-[#84cc16]/10 text-lime-100',
    analytics: 'border-violet-500/40 bg-[#8b5cf6]/10 text-violet-100',
    note: 'border-yellow-200/40 bg-yellow-100/10 text-yellow-100',
};

type ReadOnlyNodeProps = NodeProps<Node<SystemNodeData>>;

const ReadOnlyNode = ({ data }: ReadOnlyNodeProps) => {
    // Special rendering for Note node
    if (data.type === 'note') {
        return (
            <div className={`p-3 rounded-lg border shadow-sm min-w-[200px] min-h-[150px] bg-[#2d2e31] border-yellow-500/50`}>
                <div className="flex items-center gap-2 mb-2 text-yellow-400">
                    <StickyNote size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-wider">Note</span>
                </div>
                <div className="text-xs text-gray-200 whitespace-pre-wrap font-normal leading-relaxed">
                    {data.label}
                </div>
            </div>
        );
    }

    return (
        <div className={`px-3 py-2.5 rounded-lg border shadow-sm min-w-[140px] ${colorMap[data.type] || 'border-gray-600 bg-[#303134]'}`}>
            <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-400 !border-2 !border-[#202124]" />

            <div className="flex items-center gap-3">
                <div className="p-1.5 rounded-md bg-white/5 text-current">
                    {iconMap[data.type]}
                </div>
                <div className="flex flex-col">
                    <div className="text-[10px] font-bold uppercase tracking-wider opacity-70 mb-0.5">
                        {data.type}
                    </div>
                    <div className="text-xs font-semibold text-white">
                        {data.label}
                    </div>
                </div>
            </div>

            <div className="mt-2.5 pt-2.5 border-t border-white/5 flex justify-between gap-2">
                <div className="flex flex-col">
                    <span className="text-[9px] uppercase opacity-50 mb-0.5">Latency</span>
                    <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{data.latency || 0}</span>
                        <span className="text-[9px] opacity-50">ms</span>
                    </div>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-[9px] uppercase opacity-50 mb-0.5">Load</span>
                    <div className="flex items-center gap-1">
                        <span className="font-mono text-xs">{data.throughput || 0}</span>
                        <span className="text-[9px] opacity-50">%</span>
                    </div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-400 !border-2 !border-[#202124]" />
        </div>
    );
};

export default memo(ReadOnlyNode);
