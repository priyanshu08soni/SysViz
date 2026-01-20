import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
    ReactFlow,
    Background,
    Controls,
    ReactFlowProvider,
    Panel
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import axios from 'axios';
import { Globe, ArrowLeft, Loader2 } from 'lucide-react';
import ReadOnlyNode from '../components/ReadOnlyNode';

const nodeTypes = {
    custom: ReadOnlyNode,
};

const Viewer: React.FC = () => {
    const { publicId } = useParams<{ publicId: string }>();
    const [design, setDesign] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Calculate Dynamic Metrics (Always call hooks at top level)
    const metrics = React.useMemo(() => {
        if (!design?.data?.nodes) return { latency: 0, throughput: 0, activeRequests: 0 };

        const serverNodes = design.data.nodes.filter((n: any) => ['webServer', 'apiGateway', 'database', 'inferenceServer'].includes(n.data.type));
        const totalNodes = serverNodes.length || 1;

        const avgLatency = Math.round(serverNodes.reduce((acc: number, curr: any) => acc + (Number(curr.data.latency) || 0), 0) / totalNodes);
        const totalThroughput = serverNodes.reduce((acc: number, curr: any) => acc + (Number(curr.data.throughput) || 0), 0);
        const activeRequests = Math.round(totalThroughput * 0.8) + Math.floor(Math.random() * 10);

        return {
            latency: avgLatency || 0,
            throughput: totalThroughput || 0,
            activeRequests: activeRequests || 0
        };
    }, [design]);

    useEffect(() => {
        const fetchPublicDesign = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/designs/public/${publicId}`);
                setDesign(res.data);
            } catch (err: any) {
                console.error('Failed to fetch public design', err);
                setError(err.response?.data?.message || 'Design not found or private');
            } finally {
                setLoading(false);
            }
        };

        if (publicId) {
            fetchPublicDesign();
        }
    }, [publicId]);

    if (loading) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-white">
                <Loader2 className="animate-spin text-blue-500 mb-4" size={32} />
                <p className="text-muted font-medium">Loading visualization...</p>
            </div>
        );
    }

    if (error || !design) {
        return (
            <div className="h-screen w-full flex flex-col items-center justify-center bg-background text-white p-6 text-center">
                <div className="w-16 h-16 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center mb-6">
                    <Globe size={32} />
                </div>
                <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
                <p className="text-muted max-w-md mb-8">{error || 'This design is private or does not exist.'}</p>
                <Link to="/" className="btn-primary px-6 py-2 flex items-center gap-2">
                    <ArrowLeft size={16} />
                    Back to Home
                </Link>
            </div>
        );
    }



    return (
        <div className="h-screen w-full bg-background relative overflow-hidden">
            <ReactFlow
                nodes={design?.data?.nodes || []}
                edges={design?.data?.edges || []}
                nodeTypes={nodeTypes}
                fitView
                nodesDraggable={false}
                nodesConnectable={false}
                elementsSelectable={false}
                zoomOnDoubleClick={false}
                className="viewer-canvas"
            >
                <Background color="#1a1a1a" gap={20} />
                <Controls className="!bg-[#202124] !border-[#3c4043] !rounded-lg !shadow-xl [&>button]:!border-b-[#3c4043] [&>button]:!bg-[#202124] [&>button]:!text-gray-400 [&>button:hover]:!bg-[#303134] [&>button:hover]:!text-white [&>button]:!border-none" showInteractive={false} />

                <Panel position="top-left" className="m-6">
                    <div className="glass px-6 py-4 rounded-2xl border-white/10 shadow-2xl bg-black/40 backdrop-blur-md max-w-sm">
                        <div className="flex items-center gap-2 mb-1">
                            <Globe size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Public View</span>
                        </div>
                        <h1 className="text-xl font-bold text-white mb-2">{design.name}</h1>
                        <p className="text-xs text-muted mb-4 line-clamp-2">This is a read-only shared visualization of a system architecture.</p>
                        <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                            <Link to="/signup" className="text-[10px] font-bold text-white bg-blue-600 hover:bg-blue-500 px-3 py-1.5 rounded-lg transition-all">
                                Create Your Own
                            </Link>
                            <span className="text-[10px] text-muted font-medium italic">Powered by SysViz</span>
                        </div>
                    </div>
                </Panel>

                <Panel position="top-right" className="flex flex-col gap-4 metrics-panel m-6">
                    <div className="glass p-3 rounded-lg border-white/10 min-w-[180px] shadow-lg bg-[#202124]/90 metrics-panel">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                            <h3 className="text-xs font-bold opacity-70 uppercase text-gray-300">Live Metrics</h3>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-medium text-gray-400">Avg. Latency</span>
                                <span className="text-xs font-mono text-emerald-400">{metrics.latency}ms</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-medium text-gray-400">Throughput</span>
                                <span className="text-xs font-mono text-blue-400">{metrics.throughput}/s</span>
                            </div>
                            <div className="flex justify-between items-center group">
                                <span className="text-[10px] font-medium text-gray-400">Active Req</span>
                                <span className="text-xs font-mono text-amber-400">{metrics.activeRequests}</span>
                            </div>
                        </div>
                    </div>
                </Panel>

                <Panel position="bottom-right" className="m-6">
                    <div className="glass px-3 py-1.5 rounded-full border-white/10 bg-black/40 backdrop-blur-md">
                        <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Read Only Mode</span>
                    </div>
                </Panel>
            </ReactFlow>
        </div>
    );
};

const ViewerPage: React.FC = () => (
    <ReactFlowProvider>
        <Viewer />
    </ReactFlowProvider>
);

export default ViewerPage;
