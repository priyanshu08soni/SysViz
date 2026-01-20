import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Layout, Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigate = useNavigate();
    const setAuth = useAuthStore(state => state.setAuth);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/login`, { email, password });
            setAuth(response.data.user, response.data.token);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4 relative overflow-hidden">
            {/* Background blobs */}
            <div className="absolute top-[-10%] right-[-10%] w-[400px] h-[400px] bg-primary/20 rounded-full blur-[120px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-purple-500/10 rounded-full blur-[120px] animate-pulse" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="flex flex-col items-center mb-10">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary via-accent to-accent-pink border border-primary/20 rounded-2xl flex items-center justify-center mb-4 shadow-xl glow-primary animate-pulse-glow">
                        <Layout className="text-white w-8 h-8" />
                    </div>
                    <h1 className="text-3xl font-heading font-black text-white tracking-tight">Welcome back</h1>
                    <p className="text-muted text-center mt-2">Enter your credentials to access your workspaces.</p>
                </div>

                <div className="glass-strong p-8 rounded-3xl border-white/5 shadow-2xl relative z-10">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {error && (
                            <div className="bg-rose-500/10 border border-rose-500/20 text-rose-400 p-3 rounded-xl text-sm text-center">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-muted uppercase tracking-widest ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-all" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary focus:bg-secondary/70 transition-all placeholder:text-muted/50"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-bold text-muted uppercase tracking-widest">Password</label>
                                <a href="#" className="text-[10px] text-primary hover:underline font-bold uppercase tracking-widest">Forgot?</a>
                            </div>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted group-focus-within:text-primary transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-secondary/50 border border-white/5 rounded-xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full btn-primary py-4 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-white/5">
                        <p className="text-center text-sm text-muted">
                            Don't have an account? {' '}
                            <Link to="/signup" className="text-primary font-bold hover:underline transition-all">
                                Create one for free
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer links */}
                <div className="mt-12 flex justify-center gap-8 opacity-40 hover:opacity-100 transition-opacity">
                    <a href="#" className="text-xs font-bold text-white uppercase tracking-widest hover:text-primary transition-colors">Privacy</a>
                    <a href="#" className="text-xs font-bold text-white uppercase tracking-widest hover:text-primary transition-colors">Terms</a>
                    <a href="#" className="text-xs font-bold text-white uppercase tracking-widest hover:text-primary transition-colors">Support</a>
                </div>
            </motion.div>
        </div>
    );
};

export default LoginPage;
