import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Shield, Users, Globe, ArrowRight, Cloud, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import DynamicIsland from '../components/landing/DynamicIsland';
import InteractiveHeroGraph from '../components/landing/InteractiveHeroGraph';
import Footer from '../components/Footer';

const LandingPage: React.FC = () => {
    const { isAuthenticated } = useAuthStore();
    const navigate = useNavigate();


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
            <section className="relative min-h-screen flex items-center pt-20 px-6 md:px-12 lg:px-24">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left: Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-left relative z-20"
                    >
                        <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-8 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-300 backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
                            Next-Gen System Visualization
                        </div>

                        <h1 className="text-5xl md:text-7xl font-heading font-black mb-8 leading-[1.1] text-white tracking-tight">
                            Build Better <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Architectures.
                            </span>
                        </h1>

                        <p className="text-lg text-muted/80 max-w-xl mb-10 font-medium leading-relaxed">
                            The collaborative platform for sustainable engineering. Design, prototype, and document distributed systems with zero friction.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-6">
                            <motion.button
                                onClick={handleStart}
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(147, 51, 234, 0.4)" }}
                                whileTap={{ scale: 0.95 }}
                                className="w-full sm:w-auto btn-primary text-lg px-8 py-4 flex items-center justify-center gap-3 rounded-2xl"
                            >
                                Get Started Free
                                <ArrowRight size={20} />
                            </motion.button>
                            <button className="w-full sm:w-auto btn-secondary text-lg px-8 py-4 flex items-center justify-center gap-2 rounded-2xl glass border-white/10 hover:bg-white/5 transition-colors">
                                <Globe size={20} className="text-blue-400" />
                                Live Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Right: Interactive Graph */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                        className="relative z-10 w-full"
                    >
                        {/* Decorative Background Blob */}
                        <div className="absolute -top-20 -right-20 w-[120%] h-[120%] bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-transparent blur-3xl -z-10 rounded-full opacity-50" />

                        <InteractiveHeroGraph />
                    </motion.div>
                </div>
            </section>

            {/* Feature Section with 3D Cards */}
            <section id="features" className="py-32 px-8 relative z-10 bg-gradient-to-b from-transparent to-[#050505]">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">Everything you need to <br /> ship <span className="text-primary italic">faster</span>.</h2>
                        <p className="text-muted font-medium text-lg">Powerful tools built for modern engineering teams.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Zap />}
                            title="Real-time Simulation"
                            description="Watch request packets flow through your architecture. Live latency measurements and throughput analysis."
                            color="blue"
                            delay={0.1}
                        />
                        <FeatureCard
                            icon={<Users />}
                            title="Live Collaboration"
                            description="Multiple engineers, one canvas. See live cursors, discuss changes, and build consensus instantly."
                            color="purple"
                            delay={0.2}
                        />
                        <FeatureCard
                            icon={<Cloud />}
                            title="Auto-Save & Sync"
                            description="Focus on design, not saving. Every change is preserved instantly with cloud-native persistence."
                            color="emerald"
                            delay={0.3}
                        />
                        <FeatureCard
                            icon={<Activity />}
                            title="Performance Monitoring"
                            description="Simulate system load and identify bottlenecks before they hit production. Metric-driven design."
                            color="rose"
                            delay={0.4}
                        />
                        <FeatureCard
                            icon={<Globe />}
                            title="Public Sharing"
                            description="Generate ultra-fast, read-only links to your system architectures. Perfect for documentation."
                            color="amber"
                            delay={0.5}
                        />
                        <FeatureCard
                            icon={<Shield />}
                            title="Enterprise Security"
                            description="Role-based access control and secure team workspaces to protect your architectural blueprints."
                            color="indigo"
                            delay={0.6}
                        />
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-8">
                <div className="max-w-5xl mx-auto glass-strong rounded-[3rem] p-12 md:p-24 text-center border-white/5 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10">
                        <h2 className="text-4xl md:text-7xl font-black mb-8">Ready to visualize <br /> your next big idea?</h2>
                        <button
                            onClick={handleStart}
                            className="btn-primary text-xl px-12 py-6 rounded-3xl glow-primary"
                        >
                            Build Your Architecture Now
                        </button>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};

const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: string, delay: number }> = ({ icon, title, description, color, delay }) => {
    const colors: any = {
        blue: "text-blue-400 bg-blue-500/10",
        purple: "text-purple-400 bg-purple-500/10",
        emerald: "text-emerald-400 bg-emerald-500/10",
        rose: "text-rose-400 bg-rose-500/10",
        amber: "text-amber-400 bg-amber-500/10",
        indigo: "text-indigo-400 bg-indigo-500/10",
    };

    return (
        <motion.div
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0.2}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay }}
            whileHover={{
                y: -5,
                boxShadow: "0 20px 40px -20px rgba(0,0,0,0.5)"
            }}
            className="p-8 rounded-[2rem] bg-[#0f0f0f] border border-white/5 hover:border-white/10 transition-all group cursor-grab active:cursor-grabbing relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-[50px] -mr-16 -mt-16 pointer-events-none" />

            <div className={`w-14 h-14 ${colors[color]} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                {React.cloneElement(icon as any, { size: 28 })}
            </div>
            <h3 className="text-xl font-bold mb-3 tracking-tight text-gray-100">{title}</h3>
            <p className="text-muted/80 leading-relaxed text-sm font-medium">{description}</p>
        </motion.div>
    );
};

export default LandingPage;
