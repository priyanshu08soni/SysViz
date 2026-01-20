import React from 'react';
import { motion } from 'framer-motion';
import { Database, Server, Cpu, Globe, Zap } from 'lucide-react';

const HeroFlowchart: React.FC = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 select-none">
            <svg className="w-full h-full" viewBox="0 0 1200 800" fill="none" xmlns="http://www.w3.org/2000/svg">

                {/* Defs for Glows */}
                <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>

                    <linearGradient id="edgeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(147, 51, 234, 0.2)" />
                        <stop offset="50%" stopColor="rgba(59, 130, 246, 0.4)" />
                        <stop offset="100%" stopColor="rgba(147, 51, 234, 0.2)" />
                    </linearGradient>
                </defs>

                {/* Animated Edges - Smooth Bezier Curves */}
                <Edge d="M 150 400 C 225 400, 225 250, 300 250" />
                <Edge d="M 150 400 C 225 400, 225 550, 300 550" />
                <Edge d="M 300 250 C 600 250, 600 250, 900 250" />
                <Edge d="M 300 550 C 600 550, 600 550, 900 550" />
                <Edge d="M 900 250 C 975 250, 975 400, 1050 400" />
                <Edge d="M 900 550 C 975 550, 975 400, 1050 400" />

                {/* Data Packets */}
                <DataPacket path="M 150 400 C 225 400, 225 250, 300 250" delay={0} />
                <DataPacket path="M 150 400 C 225 400, 225 550, 300 550" delay={1} />
                <DataPacket path="M 300 250 C 600 250, 600 250, 900 250" delay={0.5} />
                <DataPacket path="M 300 550 C 600 550, 600 550, 900 550" delay={1.5} />
                <DataPacket path="M 900 250 C 975 250, 975 400, 1050 400" delay={2} />
                <DataPacket path="M 900 550 C 975 550, 975 400, 1050 400" delay={2.5} />

                {/* Nodes - Moved to sides to avoid text overlap */}
                <LandingNode x={150} y={400} icon={<Globe size={24} />} label="Traffic" color="indigo" />
                <LandingNode x={300} y={250} icon={<Server size={24} />} label="API Gateway" color="blue" />
                <LandingNode x={300} y={550} icon={<Zap size={24} />} label="Auth Service" color="amber" />
                <LandingNode x={900} y={250} icon={<Cpu size={24} />} label="Processing" color="emerald" />
                <LandingNode x={900} y={550} icon={<Database size={24} />} label="Database" color="purple" />
                <LandingNode x={1050} y={400} icon={<Globe size={24} />} label="CDN" color="rose" />

            </svg>
        </div>
    );
};

const Edge: React.FC<{ d: string }> = ({ d }) => (
    <motion.path
        d={d}
        stroke="url(#edgeGradient)"
        strokeWidth="2"
        fill="none"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: "easeInOut" }}
    />
);

const DataPacket: React.FC<{ path: string; delay: number }> = ({ path, delay }) => (
    <motion.circle
        r="4"
        fill="#6366f1"
        filter="url(#glow)"
        drag
        initial={{ offsetDistance: "0%", opacity: 0 }}
        animate={{
            offsetDistance: ["0%", "100%"],
            opacity: [0, 1, 1, 0]
        }}
        transition={{
            duration: 3,
            repeat: Infinity,
            delay,
            ease: "linear"
        }}
        style={{ offsetPath: `path("${path}")` }}
    />
);

const LandingNode: React.FC<{ x: number; y: number; icon: React.ReactNode; label: string; color: string }> = ({ x, y, icon, label, color }) => {
    const colors: any = {
        indigo: "from-indigo-500/20 to-indigo-500/5 text-indigo-400 border-indigo-500/20",
        blue: "from-blue-500/20 to-blue-500/5 text-blue-400 border-blue-500/20",
        amber: "from-amber-500/20 to-amber-500/5 text-amber-400 border-amber-500/20",
        emerald: "from-emerald-500/20 to-emerald-500/5 text-emerald-400 border-emerald-500/20",
        purple: "from-purple-500/20 to-purple-500/5 text-purple-400 border-purple-500/20",
        rose: "from-rose-500/20 to-rose-500/5 text-rose-400 border-rose-500/20",
    };

    return (
        <foreignObject x={x - 60} y={y - 40} width="120" height="100">
            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                whileHover={{ scale: 1.05 }}
                className={`flex flex-col items-center justify-center p-4 rounded-2xl border bg-gradient-to-br ${colors[color]} backdrop-blur-md shadow-xl`}
            >
                <div className="mb-2 opacity-80">{icon}</div>
                <span className="text-[10px] font-black uppercase tracking-widest text-center whitespace-nowrap">{label}</span>
            </motion.div>
        </foreignObject>
    );
};

export default HeroFlowchart;
