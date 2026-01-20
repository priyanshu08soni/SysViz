import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, ChevronRight, Layout, LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

const DynamicIsland: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuthStore();
    const navigate = useNavigate();

    const [isHovered, setIsHovered] = useState(false);



    const handleStart = () => {
        if (isAuthenticated) navigate('/dashboard');
        else navigate('/signup');
    };

    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none">
            <motion.div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                animate={{
                    width: isHovered ? "85vw" : "80vw",
                    height: isHovered ? 64 : 48,
                    borderRadius: isHovered ? 24 : 32,
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="glass-strong pointer-events-auto shadow-2xl overflow-hidden border-white/20 flex items-center px-6 relative group"
            >
                <div className="flex items-center justify-between w-full h-full relative">

                    {/* Left: Brand/Icon */}
                    <div className="flex items-center gap-2 shrink-0">
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center shrink-0">
                            <Layers size={18} className="text-white" />
                        </div>
                        <AnimatePresence>
                            {isHovered ? (
                                <motion.span
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -10 }}
                                    className="text-sm font-black tracking-tight"
                                >
                                    SysViz
                                </motion.span>
                            ) : null}
                        </AnimatePresence>
                    </div>

                    {/* Middle: Custom Navigation or Status (Visible on Hover) */}
                    <AnimatePresence>
                        {isHovered && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                className="flex items-center gap-6"
                            >
                                <nav className="flex gap-4 text-[10px] font-bold uppercase tracking-widest text-muted">
                                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                                    <Link to="/templates" className="hover:text-white transition-colors">Templates</Link>
                                    <a href="#features" className="hover:text-white transition-colors">Features</a>
                                </nav>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Right: User/Actions */}
                    <div className="flex items-center gap-2 shrink-0">
                        {isAuthenticated ? (
                            <div className="flex items-center gap-2">
                                <AnimatePresence>
                                    {isHovered && (
                                        <motion.button
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            onClick={logout}
                                            className="text-muted hover:text-red-400 transition-colors p-1"
                                            title="Logout"
                                        >
                                            <LogOut size={16} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                                <motion.button
                                    onClick={() => navigate('/dashboard')}
                                    whileTap={{ scale: 0.95 }}
                                    className="w-8 h-8 text-muted hover:text-white flex items-center justify-center transition-colors"
                                >
                                    <Layout size={18} />
                                </motion.button>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white uppercase border border-white/10">
                                    {user?.username?.charAt(0) || 'U'}
                                </div>
                            </div>
                        ) : (
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-primary text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full flex items-center gap-1 shrink-0"
                            >
                                Get Started
                                <ChevronRight size={14} />
                            </motion.button>
                        )}
                    </div>
                </div>


            </motion.div>
        </div>
    );
};

export default DynamicIsland;
