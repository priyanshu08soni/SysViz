import React, { useCallback, useRef, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Edit2, Save, Play, Square, Share2, Copy, Check, X, Globe, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ReactFlow,
    Controls,
    Background,
    Panel,
    useReactFlow,
    ReactFlowProvider,
    SelectionMode,
    NodeChange,
    EdgeChange,
    Connection
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { useDiagramStore, NodeType } from '../store/useDiagramStore';
import { useAuthStore } from '../store/useAuthStore';
import CustomNode from '../components/CustomNode';
import Sidebar from '../components/Sidebar';
import DiscussionPanel from '../components/DiscussionPanel';
import RemoteCursors from '../components/RemoteCursors';

const nodeTypes: any = {
    custom: CustomNode,
};

const Visualizer: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const searchParams = new URLSearchParams(window.location.search);
    const teamIdParam = searchParams.get('teamId');

    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onConnect,
        addNode,
        initSocket,
        updateCursor,
        loadDesign,
        disconnectSocket,
        designName,
        setDesignName,
        saveDesign,
        isSimulating,
        toggleSimulation,
        setTeamId,
        resetDesign,
        isSaving,
        lastSaved,
        isPublic,
        publicId,
        toggleSharing
    } = useDiagramStore();

    const [showShareModal, setShowShareModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const { token, user } = useAuthStore();

    const { screenToFlowPosition } = useReactFlow();
    const reactFlowWrapper = useRef<HTMLDivElement>(null);

    // Initialization logic
    useEffect(() => {
        if (!token) return;

        if (id === 'new') {
            resetDesign();
            if (teamIdParam) {
                setTeamId(teamIdParam);
            }
        } else if (id) {
            loadDesign(id, token);
        }

        return () => {
            disconnectSocket();
        };
    }, [id, token, teamIdParam]);



    useEffect(() => {
        initSocket(id || 'team-workspace-1');
        return () => {
            disconnectSocket();
        }
    }, [initSocket, disconnectSocket, id]);

    // Auto-save logic
    const autoSaveTimerRef = useRef<any>(null);

    useEffect(() => {
        // Don't auto-save if it's a new unsaved design or no token
        if (id === 'new' || !token) return;

        if (autoSaveTimerRef.current) {
            clearTimeout(autoSaveTimerRef.current);
        }

        autoSaveTimerRef.current = setTimeout(() => {
            saveDesign(token, true);
        }, 3000); // 3 seconds of inactivity

        return () => {
            if (autoSaveTimerRef.current) clearTimeout(autoSaveTimerRef.current);
        };
    }, [nodes, edges, designName, token, id, saveDesign]);

    const handleCopyLink = () => {
        if (!publicId) return;
        const url = `${window.location.origin}/view/${publicId}`;
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Calculate Dynamic Metrics
    const metrics = React.useMemo(() => {
        const serverNodes = nodes.filter(n => ['webServer', 'apiGateway', 'database', 'inferenceServer'].includes(n.data.type as string));
        const totalNodes = serverNodes.length || 1;

        const avgLatency = Math.round(serverNodes.reduce((acc, curr) => acc + (Number(curr.data.latency) || 0), 0) / totalNodes);
        const totalThroughput = serverNodes.reduce((acc, curr) => acc + (Number(curr.data.throughput) || 0), 0);
        // Simulate active requests based on load
        const activeRequests = Math.round(totalThroughput * 0.8) + Math.floor(Math.random() * 10);

        return {
            latency: avgLatency || 0,
            throughput: totalThroughput || 0,
            activeRequests: activeRequests || 0
        };
    }, [nodes]);

    const onDragOver = useCallback((event: React.DragEvent) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback(
        (event: React.DragEvent) => {
            event.preventDefault();

            const type = event.dataTransfer.getData('application/reactflow') as NodeType;
            const label = event.dataTransfer.getData('application/reactflow/label');

            if (!type) {
                return;
            }

            const position = screenToFlowPosition({
                x: event.clientX,
                y: event.clientY,
            });

            addNode(type, position, label || undefined);
        },
        [screenToFlowPosition, addNode]
    );

    const onMouseMove = useCallback((event: React.MouseEvent) => {
        if (reactFlowWrapper.current && user?.username) {
            const rect = reactFlowWrapper.current.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            updateCursor({ x, y }, user.username);
        }
    }, [updateCursor, user]);


    return (
        <div
            className="flex h-screen w-full bg-background overflow-hidden relative"
            onMouseMove={onMouseMove}
        >
            <Sidebar />

            <div className="flex-1 h-full relative" ref={reactFlowWrapper}>
                <RemoteCursors />

                {/* @ts-ignore */}
                <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange as (changes: NodeChange[]) => void}
                    onEdgesChange={onEdgesChange as (changes: EdgeChange[]) => void}
                    onConnect={onConnect as (connection: Connection) => void}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    selectionMode={SelectionMode.Partial}
                    panOnScroll
                    selectionOnDrag
                    className="canvas-grid"
                >
                    <Panel position="top-left" className="m-4 control-header">
                        <div className="flex items-center gap-4">
                            <div className="glass px-4 py-2 rounded-lg flex items-center gap-2 border-white/10">
                                <Edit2 size={14} className="text-muted" />
                                <input
                                    className="bg-transparent border-none focus:outline-none text-white font-bold w-48 placeholder-gray-500"
                                    value={designName}
                                    onChange={(e) => setDesignName(e.target.value)}
                                    placeholder="Untitled System"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-[10px] uppercase tracking-widest font-bold text-muted mr-2 flex items-center gap-2">
                                    {isSaving ? (
                                        <>
                                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse" />
                                            Saving...
                                        </>
                                    ) : lastSaved ? (
                                        <>
                                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                                            Saved {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </>
                                    ) : (
                                        'Unsaved'
                                    )}
                                </div>

                                <button
                                    onClick={() => token && saveDesign(token)}
                                    className="glass px-4 py-2 rounded-lg hover:bg-blue-500/20 hover:text-blue-400 hover:border-blue-500/50 transition-all flex items-center gap-2 text-sm font-medium border-white/10"
                                >
                                    <Save size={16} />
                                    Save
                                </button>

                                <button
                                    onClick={() => setShowShareModal(true)}
                                    className={`glass px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium border-white/10 ${isPublic ? 'bg-indigo-500/20 text-indigo-400 border-indigo-500/50' : 'hover:bg-indigo-500/20 hover:text-indigo-400'}`}
                                >
                                    <Share2 size={16} />
                                    Share
                                </button>

                                <button
                                    onClick={toggleSimulation}
                                    className={`glass px-4 py-2 rounded-lg transition-all flex items-center gap-2 text-sm font-medium border-white/10 ${isSimulating ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50' : 'hover:bg-emerald-500/20 hover:text-emerald-400'}`}
                                >
                                    {isSimulating ? <Square size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}
                                    {isSimulating ? 'Stop' : 'Run'}
                                </button>
                            </div>
                        </div>
                    </Panel>

                    <Background color="#202124" gap={20} />
                    <Controls className="!bg-[#202124] !border-[#3c4043] !rounded-lg !shadow-xl [&>button]:!border-b-[#3c4043] [&>button]:!bg-[#202124] [&>button]:!text-gray-400 [&>button:hover]:!bg-[#303134] [&>button:hover]:!text-white [&>button]:!border-none" />

                    <Panel position="top-right" className="flex flex-col gap-4 metrics-panel">
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
                </ReactFlow>
            </div>

            <DiscussionPanel />

            {/* Share Modal */}
            <AnimatePresence>
                {showShareModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowShareModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md glass-strong p-8 rounded-2xl border-white/10 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-xl font-bold">Share Architecture</h3>
                                <button onClick={() => setShowShareModal(false)} className="text-muted hover:text-white">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPublic ? 'bg-indigo-500/20 text-indigo-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                            {isPublic ? <Globe size={20} /> : <Lock size={20} />}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold">{isPublic ? 'Public Access' : 'Private Access'}</div>
                                            <div className="text-[10px] text-muted uppercase font-bold tracking-wider">
                                                {isPublic ? 'Anyone with link can view' : 'Only you and team can access'}
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => token && toggleSharing(token, !isPublic)}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${isPublic ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-indigo-500 text-white hover:bg-indigo-600'}`}
                                    >
                                        {isPublic ? 'Disable' : 'Enable'}
                                    </button>
                                </div>

                                {isPublic && (
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest pl-1">Sharable Link</label>
                                        <div className="flex gap-2">
                                            <div className="flex-1 bg-secondary border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-gray-400 overflow-hidden whitespace-nowrap mask-fade-right">
                                                {publicId ? `${window.location.origin}/view/${publicId}` : 'Generating link...'}
                                            </div>
                                            <button
                                                onClick={handleCopyLink}
                                                disabled={!publicId}
                                                className="btn-primary px-4 flex items-center justify-center shrink-0 disabled:opacity-75"
                                            >
                                                {copied ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

const VisualizerPage: React.FC = () => (
    <ReactFlowProvider>
        <Visualizer />
    </ReactFlowProvider>
);

export default VisualizerPage;
