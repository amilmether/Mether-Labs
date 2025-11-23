"use client";

import { cn } from "@/lib/utils";
import { BentoCard } from "./BentoCard";
import { MapPin, Clock, Activity, Terminal, Send, ShieldCheck, Globe, Code, Briefcase, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "http://localhost:8000/api";

// Hero Tile
export const HeroTile = () => {
    return (
        <BentoCard className="md:col-span-2 md:row-span-2 min-h-[300px] bg-gradient-to-br from-zinc-900/80 to-zinc-950/80">
            <div className="flex flex-col h-full justify-between relative z-10">
                <div className="flex flex-col gap-2">
                    <motion.h1
                        className="text-5xl md:text-7xl font-bold font-mono tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-zinc-500"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        AMIL<br />METHER
                    </motion.h1>
                    <p className="text-zinc-400 text-xl font-light">Full Stack Engineer</p>
                </div>
                <div className="mt-auto pt-8">
                    <div className="flex items-center gap-2 text-xs text-zinc-500 font-mono border-t border-white/10 pt-4">
                        <Terminal size={14} />
                        <span>SYSTEM_READY // V.1.0.0</span>
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};

// Command Center
export const CommandCenterTile = () => {
    const [time, setTime] = useState("");

    useEffect(() => {
        const updateTime = () => setTime(new Date().toLocaleTimeString('en-US', { hour12: false }));
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <BentoCard className="md:col-span-1 md:row-span-1" float delay={0.2}>
            <div className="flex flex-col h-full justify-between">
                <div className="flex items-center justify-between text-zinc-400">
                    <MapPin size={20} />
                    <span className="text-xs font-mono">KOCHI, KL</span>
                </div>
                <div className="text-3xl font-mono font-bold text-center my-4 tracking-widest">
                    {time || "00:00:00"}
                </div>
                <div className="flex items-center gap-2 text-emerald-500 text-xs font-mono">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    SYSTEM ONLINE
                </div>
            </div>
        </BentoCard>
    );
};

// Metrics Tile
export const MetricsTile = () => {
    const [stats, setStats] = useState({ total_views: 0, unique_visitors: 0 });

    useEffect(() => {
        axios.get(`${API_URL}/stats`)
            .then(res => setStats(res.data))
            .catch(err => console.error("Failed to fetch stats", err));
    }, []);

    return (
        <BentoCard className="md:col-span-1 md:row-span-1" delay={0.3}>
            <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Activity size={20} />
                    <span className="text-xs font-mono">METRICS</span>
                </div>
                <div className="flex flex-col gap-4 my-2">
                    <div>
                        <div className="text-2xl font-bold">{stats.total_views}</div>
                        <div className="text-xs text-zinc-500">TOTAL VIEWS</div>
                    </div>
                    <div>
                        <div className="text-2xl font-bold">{stats.unique_visitors}</div>
                        <div className="text-xs text-zinc-500">UNIQUE VISITORS</div>
                    </div>
                </div>
            </div>
        </BentoCard>
    );
};

// Availability Tile
export const AvailabilityTile = () => {
    return (
        <BentoCard className="md:col-span-1 md:row-span-1 bg-emerald-950/20 border-emerald-500/20" delay={0.4}>
            <div className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 text-emerald-400">
                    <Globe size={20} />
                    <span className="text-xs font-mono">STATUS</span>
                </div>
                <div className="text-xl font-bold text-emerald-100">
                    AVAILABLE FOR HIRE
                </div>
                <button
                    onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                    className="mt-2 w-full py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 text-xs font-mono rounded border border-emerald-500/50 transition-colors"
                >
                    INITIALIZE_CONTACT()
                </button>
            </div>
        </BentoCard>
    );
};

// Projects Tile
export const ProjectsTile = () => {
    const [projects, setProjects] = useState<any[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/projects`)
            .then(res => setProjects(res.data))
            .catch(err => console.error("Failed to fetch projects", err));
    }, []);

    return (
        <BentoCard className="md:col-span-2 md:row-span-2 overflow-y-auto" delay={0.5}>
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
                <Code size={20} />
                <span className="text-xs font-mono">PROJECTS_DATABASE</span>
            </div>
            <div className="flex flex-col gap-4">
                {projects.length === 0 && (
                    <div className="text-zinc-500 text-sm font-mono">No projects loaded.</div>
                )}
                {projects.map((project) => (
                    <div key={project.id} className="p-4 rounded-lg bg-white/5 border border-white/5 hover:border-white/20 transition-colors group">
                        <div className="flex justify-between items-start">
                            <h3 className="font-bold text-lg group-hover:text-blue-400 transition-colors">{project.title}</h3>
                            <span className={cn(
                                "text-[10px] px-2 py-1 rounded font-mono uppercase border",
                                project.priority === 'High' ? "border-red-500/50 text-red-400 bg-red-500/10" :
                                    project.priority === 'Medium' ? "border-yellow-500/50 text-yellow-400 bg-yellow-500/10" :
                                        "border-blue-500/50 text-blue-400 bg-blue-500/10"
                            )}>{project.priority}</span>
                        </div>
                        <p className="text-sm text-zinc-400 mt-1">{project.description}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {project.stack && JSON.parse(JSON.stringify(project.stack)).map((tech: string) => (
                                <span key={tech} className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-300">{tech}</span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
};

// Protocol Tile (Roadmap)
export const ProtocolTile = () => {
    const steps = [
        { label: "SIGNAL", icon: Globe },
        { label: "SYNC", icon: Activity },
        { label: "BUILD", icon: Cpu },
        { label: "LAUNCH", icon: Send },
    ];

    return (
        <BentoCard className="md:col-span-2 md:row-span-1" delay={0.6}>
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
                <ShieldCheck size={20} />
                <span className="text-xs font-mono">THE_PROTOCOL</span>
            </div>
            <div className="flex justify-between items-center relative mt-4">
                <div className="absolute top-1/2 left-0 w-full h-px bg-zinc-800 -z-10" />
                {steps.map((step, i) => (
                    <div key={step.label} className="flex flex-col items-center gap-2 bg-zinc-900/80 p-2 rounded-lg border border-zinc-800">
                        <step.icon size={16} className="text-zinc-400" />
                        <span className="text-[10px] font-mono text-zinc-500">{step.label}</span>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
};

// Data Logs (Testimonials)
export const DataLogsTile = () => {
    const [logs, setLogs] = useState<any[]>([]);

    useEffect(() => {
        axios.get(`${API_URL}/testimonials`)
            .then(res => setLogs(res.data))
            .catch(err => console.error("Failed to fetch testimonials", err));
    }, []);

    return (
        <BentoCard className="md:col-span-1 md:row-span-2" delay={0.7}>
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
                <Briefcase size={20} />
                <span className="text-xs font-mono">DATA_LOGS</span>
            </div>
            <div className="flex flex-col gap-4 overflow-y-auto max-h-[300px]">
                {logs.length === 0 && (
                    <div className="text-zinc-500 text-sm font-mono">No logs found.</div>
                )}
                {logs.map((log) => (
                    <div key={log.id} className="text-xs font-mono border-l-2 border-zinc-700 pl-3 py-1">
                        <div className="text-zinc-300">"{log.text}"</div>
                        <div className="text-zinc-500 mt-1">- {log.client_name}, {log.role}</div>
                    </div>
                ))}
            </div>
        </BentoCard>
    );
};

// Contact Tile
export const ContactTile = () => {
    return (
        <BentoCard className="md:col-span-1 md:row-span-1" delay={0.8}>
            <div id="contact" className="flex flex-col h-full justify-between">
                <div className="flex items-center gap-2 text-zinc-400">
                    <Send size={20} />
                    <span className="text-xs font-mono">UPLINK</span>
                </div>
                <form className="flex flex-col gap-2 mt-4">
                    <input type="text" placeholder="ID (Name)" className="bg-zinc-900/50 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    <input type="email" placeholder="Signal (Email)" className="bg-zinc-900/50 border border-zinc-800 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500" />
                    <input type="text" name="honeypot" className="hidden" />
                    <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 border border-blue-500/50 py-2 rounded text-xs font-mono transition-colors">
                        TRANSMIT
                    </button>
                </form>
            </div>
        </BentoCard>
    );
};
