import React from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { motion } from 'framer-motion';
import {
    Mail,
    Calendar,
    Shield,
    Layout,
    Users,
    Edit,
    Camera
} from 'lucide-react';

const ProfileTab: React.FC<{ designsCount: number; teamsCount: number }> = ({ designsCount, teamsCount }) => {
    const { user } = useAuthStore();

    if (!user) return null;

    // Type casting because we added created_at to the backend but the store interface might not have it yet
    const userData = user as any;
    const joinDate = userData.created_at
        ? new Date(userData.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
        : 'N/A';

    return (
        <div className="p-10 flex flex-col h-full overflow-y-auto scrollbar-thin">
            <div className="mb-10">
                <h3 className="text-2xl font-bold mb-2">My Profile</h3>
                <p className="text-muted text-sm">Manage your account settings and view your activity stats.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Essential Info */}
                <div className="lg:col-span-1 space-y-8">
                    <div className="glass-strong p-8 rounded-2xl border-white/5 flex flex-col items-center text-center relative overflow-hidden group">
                        {/* Background Decoration */}
                        <div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl group-hover:bg-primary/20 transition-all duration-700" />

                        <div className="relative mb-6">
                            <div className="w-32 h-32 rounded-full bg-primary/20 flex items-center justify-center text-primary border-2 border-primary/20 shadow-2xl relative group/avatar">
                                {user.avatar_url ? (
                                    <img src={user.avatar_url} alt={user.username} className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <span className="text-5xl font-bold">{user.username.charAt(0).toUpperCase()}</span>
                                )}
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer">
                                    <Camera size={24} className="text-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-4 border-secondary rounded-full" title="Online" />
                        </div>

                        <h4 className="text-xl font-bold mb-1">{user.username}</h4>
                        <p className="text-sm text-muted mb-6 flex items-center justify-center gap-1.5">
                            <Shield size={12} className="text-primary" />
                            System Architect
                        </p>

                        <button className="w-full py-2.5 rounded-xl bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                            <Edit size={14} />
                            Edit Profile
                        </button>
                    </div>

                    <div className="glass-strong p-6 rounded-2xl border-white/5 space-y-4">
                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 transition-all hover:bg-white/10">
                            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                                <Mail size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Email Address</p>
                                <p className="text-sm font-medium">{user.email}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4 p-3 bg-white/5 rounded-xl border border-white/5 transition-all hover:bg-white/10">
                            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-500">
                                <Calendar size={18} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Member Since</p>
                                <p className="text-sm font-medium">{joinDate}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Stats & Settings */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-strong p-6 rounded-2xl border-white/5 bg-gradient-to-br from-blue-500/5 to-transparent shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 border border-blue-500/10">
                                    <Layout size={24} />
                                </div>
                                <span className="text-[10px] font-bold py-1 px-2 bg-blue-500/10 text-blue-500 rounded-lg border border-blue-500/10">Total</span>
                            </div>
                            <h5 className="text-sm font-bold text-muted mb-1">Architecture Designs</h5>
                            <p className="text-3xl font-bold">{designsCount}</p>
                        </motion.div>

                        <motion.div
                            whileHover={{ y: -5 }}
                            className="glass-strong p-6 rounded-2xl border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center text-purple-500 border border-purple-500/10">
                                    <Users size={24} />
                                </div>
                                <span className="text-[10px] font-bold py-1 px-2 bg-purple-500/10 text-purple-500 rounded-lg border border-purple-500/10">Active</span>
                            </div>
                            <h5 className="text-sm font-bold text-muted mb-1">Collaboration Teams</h5>
                            <p className="text-3xl font-bold">{teamsCount}</p>
                        </motion.div>
                    </div>

                    <div className="glass-strong p-8 rounded-2xl border-white/5">
                        <h4 className="text-lg font-bold mb-6">Recent Activity Analysis</h4>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-muted uppercase tracking-wider">System Complexity (Avg)</span>
                                    <span>High (72%)</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-primary w-[72%] rounded-full shadow-[0_0_10px_rgba(var(--primary-rgb),0.5)]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-muted uppercase tracking-wider">Team Contribution</span>
                                    <span>Modern (45%)</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-accent w-[45%] rounded-full shadow-[0_0_10px_rgba(var(--accent-rgb),0.5)]" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-xs font-medium">
                                    <span className="text-muted uppercase tracking-wider">Design Efficiency</span>
                                    <span>Optimized (88%)</span>
                                </div>
                                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[88%] rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileTab;
