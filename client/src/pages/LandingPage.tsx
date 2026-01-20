import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Users, Globe, ArrowRight, Cloud, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import DynamicIsland from '../components/landing/DynamicIsland';
import InteractiveHeroGraph from '../components/landing/InteractiveHeroGraph';
import featureOverviewImg from '../assets/slides/feature-overview.png';
import realtimeSyncImg from '../assets/slides/realtime-sync.png';
import edgeTypesImg from '../assets/slides/edge-types.png';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [activeSlide, setActiveSlide] = useState(0);
    const SLIDE_DURATION = 5000;

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveSlide(prev => (prev + 1) % 3);
        }, SLIDE_DURATION);
        return () => clearInterval(timer);
    }, []);


    const handleStart = () => {
        if (isAuthenticated) navigate('/dashboard');
        else navigate('/signup');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-foreground selection:bg-primary/30 overflow-x-hidden">
            <DynamicIsland />

            {/* Background Effects - Smoother, less clutter */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-500/5 blur-[180px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[180px]" />
                {/* Subtle grid instead of heavy mesh */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
            </div>

            {/* Hero Section */}
            {/* Hero Section */}
            <section className="relative min-h-screen w-full flex items-center justify-center pt-20 overflow-hidden">
                {/* Full Screen Interactive Graph Background */}
                <div className="absolute inset-0 w-full h-full z-0">
                    <InteractiveHeroGraph />
                </div>

                {/* Content Overlay */}
                <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-12 flex justify-start pointer-events-none">
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="flex flex-col items-start text-left max-w-xl"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-md pointer-events-auto hover:bg-white/10 transition-colors cursor-default">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            Next-Gen System Visualization
                        </div>

                        <h1 className="text-5xl md:text-8xl font-heading font-black mb-8 leading-[1.1] text-white tracking-tight drop-shadow-2xl">
                            Build Better <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Architectures.
                            </span>
                        </h1>

                        <p className="text-xl text-muted/90 mb-12 font-medium leading-relaxed drop-shadow-lg">
                            The collaborative platform for sustainable engineering. Design, prototype, and document distributed systems with zero friction.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6 pointer-events-auto">
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(147, 51, 234, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto btn-primary text-lg px-8 py-4 flex items-center justify-center gap-3 rounded-2xl shadow-xl shadow-purple-500/20"
                            >
                                Get Started Free
                                <ArrowRight size={20} />
                            </motion.button>
                            <button className="w-full sm:w-auto btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2 rounded-2xl glass border-white/10 hover:bg-white/5 transition-colors shadow-lg">
                                <Globe size={20} className="text-blue-400" />
                                Live Demo
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Feature Section with Bento Grid */}
            <section id="features" className="py-32 px-6 relative z-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
                            Everything you need to <br /> ship <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 italic">faster</span>.
                        </h2>
                        <p className="text-muted font-medium text-lg max-w-2xl mx-auto">
                            Powerful tools constructed for modern engineering teams. Experience the future of system design.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                        {/* Large Card 1 */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-all p-8 md:p-12 flex flex-col justify-between">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-blue-500/30 transition-all" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 text-blue-400 group-hover:scale-110 transition-transform duration-300">
                                    <Zap size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Real-time Simulation</h3>
                                <p className="text-muted text-lg max-w-md">Watch request packets flow through your architecture. Live latency measurements and throughput analysis in real-time.</p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group relative overflow-hidden rounded-[2rem] bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-all p-8 flex flex-col justify-between">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/20 rounded-full blur-[60px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center mb-6 text-emerald-400 group-hover:rotate-12 transition-transform duration-300">
                                    <Users size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Live Collaboration</h3>
                                <p className="text-muted">Multiple engineers, one canvas. See live cursors and build consistency.</p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group relative overflow-hidden rounded-[2rem] bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-all p-8 flex flex-col justify-between">
                            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -left-10 -top-10 w-40 h-40 bg-amber-500/20 rounded-full blur-[60px] pointer-events-none" />

                            <div className="relative z-10">
                                <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-6 text-amber-400 group-hover:-translate-y-1 transition-transform duration-300">
                                    <Cloud size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">Auto-Save & Sync</h3>
                                <p className="text-muted">Focus on design, not saving. Cloud-native persistence ensures you never lose work.</p>
                            </div>
                        </div>

                        {/* Large Card 4 */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-all p-8 md:p-12 flex flex-col justify-between">
                            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-rose-500/20 rounded-full blur-[80px] pointer-events-none group-hover:bg-rose-500/30 transition-all" />

                            <div className="relative z-10">
                                <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6 text-rose-400 group-hover:scale-110 transition-transform duration-300">
                                    <Activity size={28} />
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-4">Performance Monitoring</h3>
                                <p className="text-muted text-lg max-w-md">Simulate system load and identify bottlenecks before they hit production. Metric-driven design for scalability.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section - Reference Design Match with Slideshow */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto rounded-[3rem] bg-[#080808] border border-white/10 p-8 md:p-12 relative overflow-hidden">
                    {/* Header Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start mb-12 relative z-10">
                        <div className="mb-8 md:mb-0">
                            <span className="text-orange-500 font-bold text-sm tracking-widest uppercase mb-4 block">Interactive Demo</span>
                            <h2 className="text-5xl md:text-6xl font-black text-white leading-[0.95] tracking-tight">
                                Visualize your <br />
                                next big idea.
                            </h2>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-6">
                            <p className="text-muted text-lg max-w-xs md:text-right font-medium">
                                To see all the capabilities of SysViz, check out the interactive examples which are regularly updated.
                            </p>
                            <button
                                onClick={handleStart}
                                className="bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors flex items-center gap-2"
                            >
                                Build Architecture
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Slideshow Container */}
                    <div className="w-full h-[400px] md:h-[500px] bg-[#1a1a1a] rounded-[2rem] border border-white/5 relative overflow-hidden group">
                        <AnimatePresence mode="wait">
                            {activeSlide === 0 && (
                                <motion.div
                                    key="slide-overview"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={featureOverviewImg}
                                        alt="Feature Overview - Design Systems"
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
                                        <span className="text-xs font-mono text-white/70">Feature Overview</span>
                                    </div>
                                </motion.div>
                            )}
                            {activeSlide === 1 && (
                                <motion.div
                                    key="slide-sync"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={realtimeSyncImg}
                                        alt="Real-time Sync Visualization"
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
                                        <span className="text-xs font-mono text-white/70">Multiplayer Sync</span>
                                    </div>
                                </motion.div>
                            )}
                            {activeSlide === 2 && (
                                <motion.div
                                    key="slide-edges"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="absolute inset-0"
                                >
                                    <img
                                        src={edgeTypesImg}
                                        alt="Edge Types Infographic"
                                        className="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                                    <div className="absolute bottom-6 right-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-none">
                                        <span className="text-xs font-mono text-white/70">Connection Types</span>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Footer Tabs with Progress Bars */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 pt-8 border-t border-white/5">
                        <div className="relative group cursor-pointer" onClick={() => setActiveSlide(0)}>
                            <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                                <motion.div
                                    className="h-full bg-orange-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: activeSlide === 0 ? "100%" : "0%" }}
                                    transition={{ duration: activeSlide === 0 ? 5 : 0.3, ease: "linear" }}
                                />
                            </div>
                            <h4 className={`text-lg font-bold mb-2 transition-colors ${activeSlide === 0 ? 'text-white' : 'text-muted group-hover:text-white'}`}>Feature Overview</h4>
                            <p className="text-muted text-sm">Design systems with zero configuration.</p>
                        </div>

                        <div className="relative group cursor-pointer" onClick={() => setActiveSlide(1)}>
                            <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                                <motion.div
                                    className="h-full bg-orange-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: activeSlide === 1 ? "100%" : "0%" }}
                                    transition={{ duration: activeSlide === 1 ? 5 : 0.3, ease: "linear" }}
                                />
                            </div>
                            <h4 className={`text-lg font-bold mb-2 transition-colors ${activeSlide === 1 ? 'text-white' : 'text-muted group-hover:text-white'}`}>Real-time Sync</h4>
                            <p className="text-muted text-sm">Changes propagate instantly to team members.</p>
                        </div>

                        <div className="relative group cursor-pointer" onClick={() => setActiveSlide(2)}>
                            <div className="h-1 w-full bg-white/10 rounded-full mb-4 overflow-hidden">
                                <motion.div
                                    className="h-full bg-orange-500"
                                    initial={{ width: "0%" }}
                                    animate={{ width: activeSlide === 2 ? "100%" : "0%" }}
                                    transition={{ duration: activeSlide === 2 ? 5 : 0.3, ease: "linear" }}
                                />
                            </div>
                            <h4 className={`text-lg font-bold mb-2 transition-colors ${activeSlide === 2 ? 'text-white' : 'text-muted group-hover:text-white'}`}>Edge Types</h4>
                            <p className="text-muted text-sm">Comes with a set of common edge types.</p>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default LandingPage;
