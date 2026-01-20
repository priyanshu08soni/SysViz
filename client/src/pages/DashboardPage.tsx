import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
    Layout,
    Plus,
    Users,
    LogOut,
    Search,
    Grid,
    List as ListIcon,
    ChevronRight,
    Folder,
    Home,
    Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';

const DashboardPage: React.FC = () => {
    const { user, logout, token } = useAuthStore();
    const navigate = useNavigate();
    const [designs, setDesigns] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTeam, setSelectedTeam] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState<'main' | 'activity' | 'teams'>('main');
    const [teams, setTeams] = useState<any[]>([]);
    const [showCreateTeamModal, setShowCreateTeamModal] = useState(false);
    const [showJoinTeamModal, setShowJoinTeamModal] = useState(false);
    const [newTeamName, setNewTeamName] = useState('');
    const [joinCode, setJoinCode] = useState('');
    const [teamActionLoading, setTeamActionLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (activeTab === 'main') {
            fetchDesigns(selectedTeam?._id);
        } else if (activeTab === 'teams') {
            fetchTeams();
        }
    }, [user, navigate, activeTab, selectedTeam]);

    const fetchDesigns = async (teamId?: string) => {
        setLoading(true);
        try {
            const url = teamId
                ? `${import.meta.env.VITE_SERVER_URL}/api/designs/team/${teamId}`
                : `${import.meta.env.VITE_SERVER_URL}/api/designs/mine`;

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setDesigns(res.data);
        } catch (err) {
            console.error('Failed to fetch designs', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchTeams = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/collaboration/teams`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTeams(res.data);
        } catch (err) {
            console.error('Failed to fetch teams', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTeamName.trim()) return;

        setTeamActionLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/collaboration/teams`,
                { name: newTeamName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setNewTeamName('');
            setShowCreateTeamModal(false);
            fetchTeams();
        } catch (err) {
            console.error('Failed to create team', err);
            alert('Failed to create team');
        } finally {
            setTeamActionLoading(false);
        }
    };

    const handleJoinTeam = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!joinCode.trim()) return;

        setTeamActionLoading(true);
        try {
            await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/collaboration/teams/join`,
                { code: joinCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setJoinCode('');
            setShowJoinTeamModal(false);
            fetchTeams();
        } catch (err) {
            console.error('Failed to join team', err);
            alert('Failed to join team. Check the code.');
        } finally {
            setTeamActionLoading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const handleCreateNew = () => {
        if (selectedTeam) {
            navigate(`/visualizer/new?teamId=${selectedTeam._id}`);
        } else {
            navigate('/visualizer/new');
        }
    };

    const filteredDesigns = designs.filter(design =>
        design.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'activity':
                return (
                    <div className="p-10">
                        <h3 className="text-xl font-bold mb-6">Activity Feed</h3>
                        <div className="glass-strong p-6 text-muted">Thinking about adding an activity feed? Start creating designs first!</div>
                    </div>
                );
            case 'teams':
                return (
                    <div className="p-10 flex flex-col h-full overflow-y-auto scrollbar-thin">
                        <div className="flex justify-between items-center mb-8">
                            <div>
                                <h3 className="text-2xl font-bold mb-2">Team Management</h3>
                                <p className="text-muted text-sm">Create or join teams to collaborate on system architectures.</p>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowJoinTeamModal(true)}
                                    className="px-4 py-2 rounded-lg border border-white/10 hover:bg-white/5 transition-all flex items-center gap-2 text-sm font-medium"
                                >
                                    <Users size={16} />
                                    Join via Code
                                </button>
                                <button
                                    onClick={() => setShowCreateTeamModal(true)}
                                    className="btn-primary flex items-center gap-2 text-sm"
                                >
                                    <Plus size={16} />
                                    Create Team
                                </button>
                            </div>
                        </div>

                        {loading ? (
                            <div className="h-64 flex items-center justify-center text-muted">Loading teams...</div>
                        ) : teams.length === 0 ? (
                            <div className="h-64 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-center p-10">
                                <Users className="text-muted w-12 h-12 mb-4 opacity-20" />
                                <h4 className="text-lg font-bold mb-2">No teams found</h4>
                                <p className="text-muted text-sm max-w-sm">Teams allow you to share designs and collaborate in real-time with your teammates.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {teams.map((team) => (
                                    <div key={team._id} className="glass-strong p-6 rounded-xl border-white/5 hover:border-primary/50 transition-all flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center text-primary border border-primary/10">
                                                <Users size={24} />
                                            </div>
                                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${team.role === 'owner' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                                }`}>
                                                {team.role}
                                            </span>
                                        </div>
                                        <h4 className="text-lg font-bold mb-1">{team.name}</h4>
                                        <p className="text-xs text-muted mb-6">{team.members.length} member(s)</p>

                                        <div className="mt-auto space-y-4">
                                            <div className="p-3 bg-secondary/50 rounded-lg border border-white/5 flex flex-col gap-1">
                                                <span className="text-[10px] font-bold text-muted uppercase tracking-wider">Team Invite Code</span>
                                                <div className="flex items-center justify-between">
                                                    <code className="text-sm font-mono text-primary font-bold">{team.code}</code>
                                                    <button
                                                        onClick={() => copyToClipboard(team.code)}
                                                        className="text-[10px] text-muted hover:text-white transition-colors"
                                                    >
                                                        Copy Code
                                                    </button>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => {
                                                    setSelectedTeam(team);
                                                    setActiveTab('main');
                                                }}
                                                className="w-full flex items-center justify-between p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-all text-sm font-medium group"
                                            >
                                                <span>View Designs</span>
                                                <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            default:
                return (
                    <main className="flex-1 overflow-y-auto p-8 scrollbar-thin">
                        {/* Create New Card - Prominent */}
                        <div className="mb-10">
                            <div
                                onClick={handleCreateNew}
                                className="bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl p-8 border border-white/10 flex items-center justify-between cursor-pointer hover:border-primary/50 transition-all group"
                            >
                                <div>
                                    <h3 className="text-2xl font-bold mb-2">Create New System</h3>
                                    <p className="text-muted">Start a fresh architecture diagram from scratch.</p>
                                </div>
                                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform">
                                    <Plus size={28} className="text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="flex flex-col gap-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-bold">
                                    {selectedTeam ? `${selectedTeam.name} Projects` : 'Recent Projects'}
                                </h3>
                                <div className="flex gap-4 items-center">
                                    {selectedTeam && (
                                        <button
                                            onClick={() => setSelectedTeam(null)}
                                            className="text-xs text-primary hover:underline font-medium"
                                        >
                                            Back to My Designs
                                        </button>
                                    )}
                                    <div className="flex bg-white/5 p-1 rounded-lg">
                                        <button
                                            onClick={() => setViewMode('grid')}
                                            className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-secondary text-primary' : 'text-muted hover:text-white'}`}
                                        >
                                            <Grid size={16} />
                                        </button>
                                        <button
                                            onClick={() => setViewMode('list')}
                                            className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-secondary text-primary' : 'text-muted hover:text-white'}`}
                                        >
                                            <ListIcon size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {loading ? (
                                <div className="h-64 flex items-center justify-center text-muted">Loading your designs...</div>
                            ) : filteredDesigns.length === 0 ? (
                                <div className="h-64 border-2 border-dashed border-gray-700 rounded-xl flex flex-col items-center justify-center text-center p-10">
                                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                                        <Folder className="text-muted w-8 h-8" />
                                    </div>
                                    <h4 className="text-lg font-bold mb-2">No matching designs</h4>
                                    <p className="text-muted text-sm max-w-sm mb-6">Try a different search term.</p>
                                </div>
                            ) : (
                                <div className={viewMode === 'grid'
                                    ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
                                    : "flex flex-col gap-4"
                                }>
                                    <AnimatePresence>
                                        {filteredDesigns.map((design, index) => (
                                            <motion.div
                                                key={design._id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                                className="group relative"
                                            >
                                                <div className={`glass-strong rounded-xl border-white/5 hover:border-primary/50 transition-all cursor-pointer card-hover ${viewMode === 'list' ? 'flex items-center p-4 gap-6' : 'p-5 flex flex-col h-full'}`}
                                                    onClick={() => navigate(`/visualizer/${design._id}`)}>

                                                    <div className={`flex items-center ${viewMode === 'list' ? 'gap-4' : 'justify-between mb-4 w-full'}`}>
                                                        <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center text-blue-500 border border-blue-500/10 shrink-0">
                                                            <Layout size={20} />
                                                        </div>
                                                        {viewMode === 'grid' && (
                                                            <div /> /* Spacer/Place for deleted dots */
                                                        )}
                                                    </div>

                                                    <div className={viewMode === 'list' ? 'flex-1 grid grid-cols-3 items-center' : 'flex-1'}>
                                                        <div className={viewMode === 'list' ? 'col-span-1' : ''}>
                                                            <h4 className="text-sm font-bold mb-1 group-hover:text-primary transition-colors truncate">{design.name}</h4>
                                                            {viewMode === 'grid' && (
                                                                <p className="text-xs text-muted mb-4">
                                                                    {design.data?.nodes?.length || 0} nodes &bull; {design.data?.edges?.length || 0} edges
                                                                </p>
                                                            )}
                                                        </div>

                                                        {viewMode === 'list' && (
                                                            <div className="text-xs text-muted col-span-1 text-center">
                                                                {design.data?.nodes?.length || 0} nodes &bull; {design.data?.edges?.length || 0} edges
                                                            </div>
                                                        )}

                                                        <div className={`flex items-center ${viewMode === 'list' ? 'justify-end gap-4 col-span-1' : 'justify-between pt-4 border-t border-white/5 mt-auto'}`}>
                                                            <div className="flex -space-x-2">
                                                                <div className="w-6 h-6 rounded-full border-2 border-secondary bg-primary flex items-center justify-center text-[8px] font-bold text-white uppercase">
                                                                    {user?.username?.charAt(0) || 'U'}
                                                                </div>
                                                            </div>
                                                            <div className="text-[10px] font-medium text-muted uppercase tracking-wide">
                                                                {new Date(design.updated_at).toLocaleDateString()}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    </main>
                );
        }
    };

    return (
        <div className="flex h-screen bg-background text-foreground overflow-hidden font-sans">
            {/* Sidebar */}
            <div className="w-64 border-r border-white/5 flex flex-col glass backdrop-blur-none bg-background-secondary">
                <div className="p-6">
                    <div className="flex items-center gap-3 mb-8 cursor-pointer" onClick={() => navigate('/')}>
                        <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center shadow-sm">
                            <Layout className="text-white w-5 h-5" />
                        </div>
                        <span className="font-bold text-lg tracking-tight">SysViz</span>
                    </div>

                    <div className="space-y-1">
                        <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2 px-3">Main</div>

                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all"
                        >
                            <Home size={16} />
                            <span>Home</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('main')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${activeTab === 'main' ? 'bg-primary/10 text-primary' : 'text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <Grid size={16} />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('activity')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${activeTab === 'activity' ? 'bg-primary/10 text-primary' : 'text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <Activity size={16} />
                            <span>Activity</span>
                        </button>

                        <button
                            onClick={() => setActiveTab('teams')}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-all ${activeTab === 'teams' ? 'bg-primary/10 text-primary' : 'text-muted hover:text-white hover:bg-white/5'}`}
                        >
                            <Users size={16} />
                            <span>Teams</span>
                        </button>
                    </div>
                </div>

                <div className="mt-auto p-4 border-t border-white/5">
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer group">
                        <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold border border-white/5">
                            {user?.username?.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="text-sm font-bold truncate">{user?.username}</div>
                            <div className="text-[10px] text-muted truncate">{user?.email}</div>
                        </div>
                        <button onClick={logout} className="p-1.5 text-muted hover:text-rose-400 transition-colors">
                            <LogOut size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden bg-background">
                {/* Top Header */}
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 glass-light bg-background/50 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-bold text-foreground">My Designs</h2>
                        <ChevronRight className="text-muted" size={14} />
                        <span className="text-muted text-xs font-medium">{designs.length} Projects</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="relative group w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" size={14} />
                            <input
                                type="text"
                                placeholder="Search designs..."
                                className="w-full bg-secondary border border-white/10 rounded-lg py-1.5 pl-9 pr-3 text-sm focus:ring-1 focus:ring-primary/50 transition-all outline-none"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button
                            onClick={handleCreateNew}
                            className="btn-primary flex items-center gap-2 text-xs py-2 px-4"
                        >
                            <Plus size={14} />
                            New Design
                        </button>
                    </div>
                </header>

                {renderContent()}
            </div>

            {/* Modals */}
            <AnimatePresence>
                {showCreateTeamModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowCreateTeamModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md glass-strong p-8 rounded-2xl border-white/10 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold mb-2">Create a New Team</h3>
                            <p className="text-muted text-sm mb-6">Teams share designs and collaborate in real-time.</p>

                            <form onSubmit={handleCreateTeam} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted">Team Name</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. Infrastructure Team"
                                        className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        value={newTeamName}
                                        onChange={(e) => setNewTeamName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateTeamModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={teamActionLoading}
                                        className="flex-1 btn-primary py-3 flex items-center justify-center"
                                    >
                                        {teamActionLoading ? 'Creating...' : 'Create Team'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}

                {showJoinTeamModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowJoinTeamModal(false)}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative w-full max-w-md glass-strong p-8 rounded-2xl border-white/10 shadow-2xl"
                        >
                            <h3 className="text-xl font-bold mb-2">Join a Team</h3>
                            <p className="text-muted text-sm mb-6">Enter the secret code shared by your teammate.</p>

                            <form onSubmit={handleJoinTeam} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-muted">Team Code</label>
                                    <input
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. AB12CD34"
                                        className="w-full bg-secondary border border-white/10 rounded-xl px-4 py-3 text-sm font-mono tracking-widest focus:ring-2 focus:ring-primary/50 transition-all outline-none"
                                        value={joinCode}
                                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                        required
                                    />
                                </div>

                                <div className="flex gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowJoinTeamModal(false)}
                                        className="flex-1 px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-sm font-medium transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={teamActionLoading}
                                        className="flex-1 btn-primary py-3 flex items-center justify-center"
                                    >
                                        {teamActionLoading ? 'Joining...' : 'Join Team'}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DashboardPage;
