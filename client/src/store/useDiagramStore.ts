import { create } from 'zustand';
import {
    Connection,
    Edge,
    EdgeChange,
    Node,
    NodeChange,
    addEdge,
    applyNodeChanges,
    applyEdgeChanges
} from '@xyflow/react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

export type NodeType =
    | 'client' | 'loadBalancer' | 'apiGateway' | 'webServer' | 'cache' | 'messageQueue' | 'database'
    | 'mlModel' | 'trainingData' | 'inferenceServer'
    | 'frontend' | 'cdn' | 'analytics'
    | 'note';

export interface SystemNodeData extends Record<string, unknown> {
    label: string;
    type: NodeType;
    latency: number;
    throughput: number;
}

interface RemoteUser {
    id: string;
    name: string;
    color: string;
    position: { x: number; y: number };
}

interface Message {
    id: string;
    user: string;
    text: string;
    timestamp: string;
}

interface DiagramState {
    nodes: Node[];
    edges: Edge[];
    socket: Socket | null;
    remoteUsers: RemoteUser[];
    messages: Message[];
    workspaceId: string;
    teamId: string | null;
    isSimulating: boolean;
    designName: string;
    isSaving: boolean;
    lastSaved: Date | null;
    isPublic: boolean;
    publicId: string | null;

    // Actions
    setDesignName: (name: string) => void;
    setTeamId: (id: string | null) => void;
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    addNode: (type: NodeType, position: { x: number; y: number }, label?: string, emit?: boolean) => void;

    // Simulation
    toggleSimulation: () => void;

    // Persistence
    saveDesign: (token: string, silent?: boolean) => Promise<void>;
    loadDesign: (designId: string, token: string) => Promise<void>;
    toggleSharing: (token: string, isPublic: boolean) => Promise<void>;

    // Collaboration Actions
    initSocket: (workspaceId: string) => void;
    disconnectSocket: () => void;
    updateCursor: (position: { x: number; y: number }, userName: string) => void;
    sendMessage: (text: string) => void;
    addFakeUser: (user: RemoteUser) => void;

    // Activity LOG
    activityLog: string[];

    addActivity: (activity: string) => void;

    // Local UI Sync
    setNodes: (nodes: Node[]) => void;
    setEdges: (edges: Edge[]) => void;
    resetDesign: () => void;
}

const COLORS = ['#1a73e8', '#e37400', '#1e8e3e', '#d93025', '#9334e6', '#0097a7'];

export const useDiagramStore = create<DiagramState>((set, get) => ({
    nodes: [],
    edges: [],
    socket: null,
    remoteUsers: [],
    messages: [],
    activityLog: [],
    workspaceId: 'default',
    teamId: null,
    isSimulating: false,
    designName: 'Untitled System',
    isSaving: false,
    lastSaved: null,
    isPublic: false,
    publicId: null,

    setDesignName: (name) => set({ designName: name }),
    setTeamId: (id) => set({ teamId: id }),

    resetDesign: () => set({
        nodes: [],
        edges: [],
        workspaceId: 'default',
        teamId: null,
        designName: 'Untitled System',
        messages: [],
        activityLog: [],
        isPublic: false,
        publicId: null,
        lastSaved: null
    }),

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    addActivity: (activity) => set(state => ({ activityLog: [activity, ...state.activityLog].slice(0, 50) })),

    addFakeUser: (fakeUser) => {
        set((state) => {
            const users = [...state.remoteUsers];
            const existingIdx = users.findIndex(u => u.id === fakeUser.id);
            if (existingIdx > -1) {
                users[existingIdx] = fakeUser;
            } else {
                users.push(fakeUser);
            }
            return { remoteUsers: users };
        });
    },

    toggleSimulation: () => {
        const isSimulating = !get().isSimulating;
        const edges = get().edges.map(edge => ({
            ...edge,
            animated: isSimulating
        }));
        set({ isSimulating, edges });
    },

    saveDesign: async (token, silent = false) => {
        const { nodes, edges, workspaceId, teamId, designName } = get();
        if (!silent) set({ isSaving: true });

        try {
            // Check if we need to create a NEW design or UPDATE existing
            if (workspaceId === 'default' || workspaceId === 'new') {
                // CREATE (POST)
                const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/designs`,
                    {
                        name: designName || 'Untitled System',
                        teamId: teamId, // Include teamId if present
                        data: { nodes, edges }
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                // Update local state with the new ID so future saves are updates
                set({
                    workspaceId: res.data._id,
                    publicId: res.data.public_id,
                    isPublic: res.data.is_public,
                    lastSaved: new Date()
                });
                get().addActivity(`Design created: ${designName}`);
            } else {
                // UPDATE (PUT)
                const res = await axios.put(`${import.meta.env.VITE_SERVER_URL}/api/designs/${workspaceId}`,
                    {
                        name: designName || 'Untitled System',
                        data: { nodes, edges }
                    },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                set({
                    lastSaved: new Date(),
                    publicId: res.data.public_id,
                    isPublic: res.data.is_public
                });
                if (!silent) get().addActivity(`Design saved: ${designName}`);
            }
        } catch (err) {
            console.error('Failed to save design', err);
        } finally {
            if (!silent) set({ isSaving: false });
        }
    },

    toggleSharing: async (token, isPublic) => {
        const { workspaceId } = get();
        if (workspaceId === 'default' || workspaceId === 'new') return;

        try {
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/designs/${workspaceId}/share`,
                { isPublic },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            set({
                isPublic: res.data.is_public,
                publicId: res.data.public_id
            });
            get().addActivity(`Sharing ${isPublic ? 'enabled' : 'disabled'}`);
        } catch (err) {
            console.error('Failed to toggle sharing', err);
            alert('Failed to update sharing settings');
        }
    },

    loadDesign: async (designId, token) => {
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/designs/${designId}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const { nodes, edges } = res.data.data;
            set({
                nodes: nodes || [],
                edges: edges || [],
                workspaceId: designId,
                designName: res.data.name || 'Untitled System',
                isPublic: res.data.is_public,
                publicId: res.data.public_id,
                lastSaved: new Date(res.data.updated_at)
            });
            get().addActivity(`Loaded design: ${res.data.name}`);
        } catch (err) {
            console.error('Failed to load design');
            set({ nodes: [], edges: [] });
        }
    },

    disconnectSocket: () => {
        const { socket } = get();
        if (socket) {
            socket.disconnect();
            set({ socket: null, remoteUsers: [] });
        }
    },

    initSocket: (workspaceId) => {
        const { socket: existingSocket } = get();
        if (existingSocket) {
            existingSocket.disconnect();
        }

        const socket = io(import.meta.env.VITE_SERVER_URL);

        socket.on('connect', () => {
            socket.emit('join-workspace', workspaceId);
        });

        socket.on('user-cursor-move', ({ userId, userName, position }) => {
            set((state) => {
                const users = [...state.remoteUsers];
                const existingIdx = users.findIndex(u => u.id === userId);
                const color = COLORS[Math.floor(Math.random() * COLORS.length)] || '#3b82f6';

                if (existingIdx > -1) {
                    users[existingIdx] = { ...users[existingIdx]!, position, name: userName };
                } else {
                    users.push({ id: userId, name: userName, color, position });
                }
                return { remoteUsers: users };
            });
        });

        socket.on('nodes-sync', (changes) => {
            set({ nodes: applyNodeChanges(changes, get().nodes) });
        });

        socket.on('edges-sync', (changes) => {
            set({ edges: applyEdgeChanges(changes, get().edges) });
        });

        socket.on('node-added', (node) => {
            set({ nodes: [...get().nodes, node] });
            get().addActivity(`New node added: ${node.data.label}`);
        });

        socket.on('new-message', (msg) => {
            set({ messages: [...get().messages, msg] });
        });

        socket.on('user-disconnected', (userId) => {
            set({ remoteUsers: get().remoteUsers.filter(u => u.id !== userId) });
        });

        set({ socket, workspaceId });
    },

    updateCursor: (position, userName) => {
        const { socket, workspaceId } = get();
        if (socket) {
            socket.emit('cursor-move', {
                workspaceId,
                userId: socket.id,
                userName: userName || 'Team Member',
                position
            });
        }
    },

    onNodesChange: (changes) => {
        const updatedNodes = applyNodeChanges(changes, get().nodes);
        set({ nodes: updatedNodes });

        const { socket, workspaceId } = get();
        if (socket && changes.length > 0) {
            socket.emit('node-change', { workspaceId, changes });
        }
    },

    onEdgesChange: (changes) => {
        const updatedEdges = applyEdgeChanges(changes, get().edges);
        set({ edges: updatedEdges });

        const { socket, workspaceId } = get();
        if (socket && changes.length > 0) {
            socket.emit('edge-change', { workspaceId, changes });
        }
    },

    onConnect: (connection) => {
        const updatedEdges = addEdge(connection, get().edges);
        set({ edges: updatedEdges });
        get().addActivity(`New connection created`);
        // In a real app, you'd also emit this connection
    },

    addNode: (type, position, label, emit = true) => {
        // Handle optional arguments for backward compatibility if needed, though strict signature change is better here
        const actualLabel = label || type.charAt(0).toUpperCase() + type.slice(1).replace(/([A-Z])/g, ' $1');

        const id = `${type}-${Date.now()}`;
        const newNode: Node = {
            id,
            type: 'custom',
            data: {
                label: actualLabel,
                type,
                latency: 10,
                throughput: 100
            },
            position,
        };

        set(state => ({
            nodes: [...state.nodes, newNode],
            activityLog: [`Added ${actualLabel} node`, ...state.activityLog]
        }));

        const { socket, workspaceId } = get();
        if (socket && emit) {
            socket.emit('add-node', { workspaceId, node: newNode });
        }
    },

    sendMessage: (text) => {
        const { socket, workspaceId } = get();
        if (socket) {
            const msg = {
                id: Date.now().toString(),
                user: 'Me',
                text,
                timestamp: new Date().toLocaleTimeString()
            };
            socket.emit('send-message', { workspaceId, message: msg });
        }
    }
}));
