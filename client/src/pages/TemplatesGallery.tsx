import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, ArrowLeft, Copy, Eye, Clock, Star, Filter } from 'lucide-react';
import { motion } from 'framer-motion';

const templates = [
    {
        id: 'url-shortener',
        title: 'URL Shortener System',
        description: 'Scalable architecture for a high-traffic URL shortening service like Bitly.',
        image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc48?q=80&w=2600&auto=format&fit=crop',
        tags: ['Distributed', 'Caching'],
        stars: 124,
    },
    {
        id: 'e-commerce',
        title: 'E-commerce Platform',
        description: 'Microservices architecture for a modern e-commerce system with payment integration.',
        image: 'https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2600&auto=format&fit=crop',
        tags: ['Microservices', 'Events'],
        stars: 89,
    },
    {
        id: 'chat-app',
        title: 'Real-time Chat App',
        description: 'WebSocket-based architecture for instant messaging with global scaling.',
        image: 'https://images.unsplash.com/photo-1611746872915-64382b5c76da?q=80&w=2600&auto=format&fit=crop',
        tags: ['WebSockets', 'NoSQL'],
        stars: 156,
    }
];

const TemplatesGallery: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background text-white">
            <header className="h-20 border-b border-white/5 flex items-center justify-between px-10 glass sticky top-0 z-50">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 hover:bg-white/5 rounded-full transition-all text-muted hover:text-white"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div className="flex items-center gap-3">
                        <Layout className="text-primary" size={24} />
                        <h1 className="text-xl font-bold">Template Gallery</h1>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group hidden md:block">
                        <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                        <select className="bg-secondary/50 border border-white/5 rounded-full py-2 pl-10 pr-6 appearance-none focus:outline-none focus:ring-1 focus:ring-primary/30 text-sm font-medium">
                            <option>All Architectures</option>
                            <option>System Design Interview</option>
                            <option>Microservices</option>
                            <option>Distributed Systems</option>
                        </select>
                    </div>
                    <button className="bg-white/5 hover:bg-white/10 text-white px-5 py-2 rounded-full text-sm font-bold transition-all">
                        Request Template
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto p-10">
                <div className="mb-12">
                    <h2 className="text-4xl font-black mb-4">Start with a Blueprint</h2>
                    <p className="text-muted text-lg max-w-2xl font-medium">Clone industry-standard system architectures into your workspace and start collaborating immediately.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {templates.map((template, index) => (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group"
                        >
                            <div className="glass rounded-[32px] border-white/5 overflow-hidden hover:border-primary/30 transition-all flex flex-col h-full shadow-2xl">
                                <div className="h-48 relative overflow-hidden">
                                    <img
                                        src={template.image}
                                        alt={template.title}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        {template.tags.map(tag => (
                                            <span key={tag} className="bg-black/50 backdrop-blur-md text-[10px] font-bold px-2.5 py-1 rounded-full border border-white/10 uppercase tracking-widest leading-none">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-primary/20 backdrop-blur-xl border border-primary/30 p-2 rounded-xl text-primary font-bold text-xs flex items-center gap-1.5 shadow-xl">
                                        <Star size={14} fill="currentColor" />
                                        {template.stars}
                                    </div>
                                </div>

                                <div className="p-8 flex flex-col flex-1">
                                    <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">{template.title}</h3>
                                    <p className="text-muted text-sm leading-relaxed mb-8 flex-1">{template.description}</p>

                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20">
                                            <Copy size={18} />
                                            Clone
                                        </button>
                                        <button className="flex-1 glass hover:bg-white/5 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all">
                                            <Eye size={18} />
                                            Preview
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 p-12 glass rounded-[48px] border-white/5 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full" />
                    <div className="relative z-10">
                        <Clock className="mx-auto text-primary mb-6" size={48} />
                        <h3 className="text-3xl font-black mb-4">Coming Soon: Custom Templates</h3>
                        <p className="text-muted text-lg max-w-xl mx-auto mb-8 font-medium">Save your own architectural patterns as templates and share them with the entire SysViz community.</p>
                        <button className="bg-white text-black px-10 py-4 rounded-xl font-black hover:bg-primary hover:text-white transition-all shadow-2xl">
                            Join Early Access
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default TemplatesGallery;
