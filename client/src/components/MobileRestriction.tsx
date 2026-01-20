import React from 'react';
import { motion } from 'framer-motion';
import { Monitor, Smartphone, Tablet } from 'lucide-react';

const MobileRestriction: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[9999] lg:hidden flex items-center justify-center p-6 text-center bg-background/80 backdrop-blur-xl">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-strong max-w-md p-8 rounded-3xl shadow-2xl relative overflow-hidden"
            >
                {/* Animated Background Glow */}
                <div className="absolute inset-0 bg-primary/10 blur-3xl -z-10" />

                <div className="flex justify-center gap-4 mb-8">
                    <div className="relative">
                        <Smartphone className="w-12 h-12 text-muted-foreground opacity-50" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-8 h-1 bg-destructive/50 rounded-full rotate-45" />
                        </div>
                    </div>
                    <div className="flex items-center text-primary animate-pulse">
                        <div className="w-2 h-2 rounded-full bg-primary mx-1" />
                        <div className="w-2 h-2 rounded-full bg-primary mx-1" />
                        <div className="w-2 h-2 rounded-full bg-primary mx-1" />
                    </div>
                    <div className="flex gap-2 text-primary">
                        <Tablet className="w-12 h-12" />
                        <Monitor className="w-12 h-12" />
                    </div>
                </div>

                <h1 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                    Optimized for Desktop & Tablet
                </h1>

                <p className="text-muted-foreground mb-8 text-balance leading-relaxed">
                    To provide the best system design experience, SysViz requires a larger screen. Please switch to a
                    <span className="text-primary font-semibold"> Tablet</span> or
                    <span className="text-primary font-semibold"> Desktop</span> device.
                </p>

                <div className="flex flex-col gap-3">
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-left">
                        <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
                            <Monitor size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-medium">Desktop View</div>
                            <div className="text-xs text-muted-foreground italic">Recommended</div>
                        </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center gap-4 text-left opacity-70">
                        <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400">
                            <Tablet size={20} />
                        </div>
                        <div>
                            <div className="text-sm font-medium">Tablet View</div>
                            <div className="text-xs text-muted-foreground">Supported</div>
                        </div>
                    </div>
                </div>

                <p className="mt-8 text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-medium opacity-50">
                    SysViz Visualizer • Pro Edition
                </p>
            </motion.div>
        </div>
    );
};

export default MobileRestriction;
