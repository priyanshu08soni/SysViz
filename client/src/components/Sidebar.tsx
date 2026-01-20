import React, { useState } from 'react';
import {
    ChevronDown, ChevronRight, ChevronLeft,
    Database, Globe, Server, Cpu, Box, Brain,
    Workflow, Zap, Activity,
    BarChart, Layers
} from 'lucide-react';
import { type NodeType } from '../store/useDiagramStore';
// --- Types ---
type SidebarItem = {
    type: NodeType;
    label: string;
    icon?: React.ReactNode;
};

type SubCategory = {
    id: string;
    label: string;
    icon?: React.ReactNode;
    items: SidebarItem[];
};

type Category = {
    id: string;
    label: string;
    subCategories: SubCategory[];
};

// --- Data ---
const sidebarData: Category[] = [
    {
        id: 'web',
        label: 'Web Development',
        subCategories: [
            {
                id: 'frontend',
                label: 'Frontend',
                icon: <Globe size={14} />,
                items: [
                    { type: 'frontend', label: 'React.js' },
                    { type: 'frontend', label: 'Vue.js' },
                    { type: 'frontend', label: 'Next.js' },
                    { type: 'frontend', label: 'Angular' },
                    { type: 'client', label: 'HTML5 / Static' },
                ]
            },
            {
                id: 'backend',
                label: 'Backend & Server',
                icon: <Cpu size={14} />,
                items: [
                    { type: 'webServer', label: 'Node.js' },
                    { type: 'webServer', label: 'Django' },
                    { type: 'webServer', label: 'Spring Boot' },
                    { type: 'webServer', label: 'Go Fiber' },
                ]
            },
            {
                id: 'api',
                label: 'API & Networking',
                icon: <Workflow size={14} />,
                items: [
                    { type: 'apiGateway', label: 'GraphQL API' },
                    { type: 'apiGateway', label: 'REST API' },
                    { type: 'loadBalancer', label: 'Nginx LB' },
                    { type: 'apiGateway', label: 'Kong Gateway' },
                ]
            }
        ]
    },
    {
        id: 'database',
        label: 'Databases',
        subCategories: [
            {
                id: 'sql',
                label: 'Relational (SQL)',
                icon: <Database size={14} />,
                items: [
                    { type: 'database', label: 'PostgreSQL' },
                    { type: 'database', label: 'MySQL' },
                    { type: 'database', label: 'SQL Server' },
                    { type: 'database', label: 'Oracle' },
                    { type: 'database', label: 'SQLite' },
                ]
            },
            {
                id: 'nosql',
                label: 'NoSQL',
                icon: <Database size={14} />,
                items: [
                    { type: 'database', label: 'MongoDB' },
                    { type: 'database', label: 'Cassandra' },
                    { type: 'database', label: 'DynamoDB' },
                    { type: 'database', label: 'Supabase' },
                    { type: 'database', label: 'Elasticsearch' },
                ]
            },
            {
                id: 'cache',
                label: 'Caching',
                icon: <Box size={14} />,
                items: [
                    { type: 'cache', label: 'Redis' },
                    { type: 'cache', label: 'Memcached' },
                ]
            }
        ]
    },
    {
        id: 'ml',
        label: 'Machine Learning',
        subCategories: [
            {
                id: 'frameworks',
                label: 'Frameworks',
                icon: <Brain size={14} />,
                items: [
                    { type: 'mlModel', label: 'PyTorch' },
                    { type: 'mlModel', label: 'TensorFlow' },
                    { type: 'mlModel', label: 'Scikit-Learn' },
                    { type: 'mlModel', label: 'Keras' },
                    { type: 'mlModel', label: 'HuggingFace' },
                ]
            },
            {
                id: 'ops',
                label: 'ML Ops',
                icon: <Activity size={14} />,
                items: [
                    { type: 'inferenceServer', label: 'OpenAI API' },
                    { type: 'inferenceServer', label: 'SageMaker' },
                    { type: 'inferenceServer', label: 'Triton Server' },
                    { type: 'trainingData', label: 'Training Data' },
                    { type: 'trainingData', label: 'Jupyter' },
                ]
            }
        ]
    },
    {
        id: 'devops',
        label: 'DevOps & Services',
        subCategories: [
            {
                id: 'compute',
                label: 'Compute / Container',
                icon: <Server size={14} />,
                items: [
                    { type: 'webServer', label: 'Docker' },
                    { type: 'loadBalancer', label: 'Kubernetes' },
                    { type: 'webServer', label: 'Jenkins' },
                    { type: 'apiGateway', label: 'GitHub Actions' },
                ]
            },
            {
                id: 'streaming',
                label: 'Streaming',
                icon: <Zap size={14} />,
                items: [
                    { type: 'messageQueue', label: 'Kafka' },
                    { type: 'messageQueue', label: 'RabbitMQ' },
                    { type: 'messageQueue', label: 'ActiveMQ' },
                ]
            },
            {
                id: 'monitoring',
                label: 'Monitoring',
                icon: <BarChart size={14} />,
                items: [
                    { type: 'analytics', label: 'Prometheus' },
                    { type: 'analytics', label: 'Grafana' },
                    { type: 'analytics', label: 'Datadog' },
                ]
            },
            {
                id: 'general',
                label: 'General',
                icon: <Layers size={14} />,
                items: [
                    { type: 'client', label: 'User / Client' },
                    { type: 'note', label: 'Sticky Note' },
                ]
            },
        ]
    }
];

const Sidebar: React.FC = () => {
    // State to track expanded items: Record<ID, boolean>
    // IDs are 'cat-web', 'sub-frontend', etc. to avoid collision
    const [expanded, setExpanded] = useState<Record<string, boolean>>({
        'cat-web': true,
        'sub-frontend': true
    });

    const toggle = (id: string) => {
        setExpanded(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const onDragStart = (event: React.DragEvent, nodeType: string, label: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.setData('application/reactflow/label', label);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="w-64 glass flex flex-col border-r border-white/5 h-full z-20 bg-[#0c1015]/95 backdrop-blur-md">
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Layers size={18} className="text-primary" />
                    <h2 className="text-sm font-bold tracking-tight uppercase">Components</h2>
                </div>
                <a href="/dashboard" className="p-1.5 hover:bg-white/5 rounded-lg transition-colors text-muted hover:text-white">
                    <ChevronLeft size={16} />
                </a>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
                <div className="space-y-1">
                    {sidebarData.map((category) => {
                        const catId = `cat-${category.id}`;
                        const isCatOpen = expanded[catId];

                        return (
                            <div key={category.id} className="select-none">
                                {/* Category Header */}
                                <button
                                    onClick={() => toggle(catId)}
                                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-all duration-200 group ${isCatOpen ? 'text-white bg-white/5' : 'text-muted hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <span className="font-bold text-sm">{category.label}</span>
                                    <ChevronDown size={14} className={`transition-transform duration-200 ${isCatOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* SubCategories */}
                                {isCatOpen && (
                                    <div className="mt-1 ml-2 pl-2 border-l border-white/5 space-y-1">
                                        {category.subCategories.map((sub) => {
                                            const subId = `sub-${sub.id}`;
                                            const isSubOpen = expanded[subId];

                                            return (
                                                <div key={sub.id}>
                                                    <button
                                                        onClick={() => toggle(subId)}
                                                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-md transition-colors ${isSubOpen ? 'text-blue-400' : 'text-muted/80 hover:text-white'
                                                            }`}
                                                    >
                                                        {isSubOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                                        <div className="flex items-center gap-2">
                                                            {sub.icon}
                                                            <span className="text-xs font-semibold uppercase tracking-wider">{sub.label}</span>
                                                        </div>
                                                    </button>

                                                    {/* Items */}
                                                    {isSubOpen && (
                                                        <div className="ml-5 mt-1 space-y-0.5">
                                                            {sub.items.map((item, idx) => (
                                                                <div
                                                                    key={`${item.type}-${idx}`}
                                                                    className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-white/10 hover:border-primary/50 border border-transparent transition-all cursor-move group"
                                                                    onDragStart={(event) => onDragStart(event, item.type, item.label)}
                                                                    draggable
                                                                >
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-primary transition-colors" />
                                                                    <span className="text-sm text-gray-400 group-hover:text-white transition-colors truncate">
                                                                        {item.label}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
