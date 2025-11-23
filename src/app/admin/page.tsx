"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Eye, Users, Folder, MessageSquare, Mail, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_URL } from "@/config";

export default function AdminDashboard() {
    const [stats, setStats] = useState({ total_views: 0, unique_visitors: 0 });
    const [projectsCount, setProjectsCount] = useState(0);
    const [messages, setMessages] = useState<any[]>([]);

    // Mock data for chart
    const data = [
        { name: 'Mon', views: 40 },
        { name: 'Tue', views: 30 },
        { name: 'Wed', views: 20 },
        { name: 'Thu', views: 27 },
        { name: 'Fri', views: 18 },
        { name: 'Sat', views: 23 },
        { name: 'Sun', views: 34 },
    ];

    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const sRes = await axios.get(`${API_URL}/api/stats`);
                setStats(sRes.data);

                const pRes = await axios.get(`${API_URL}/api/projects`);
                setProjectsCount(pRes.data.length);

                const token = localStorage.getItem("token");
                if (token) {
                    try {
                        const mRes = await axios.get(`${API_URL}/api/messages`, {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        setMessages(mRes.data);
                    } catch (e: any) {
                        if (e.response && e.response.status === 401) {
                            localStorage.removeItem("token");
                            router.push("/admin/login");
                        } else {
                            console.error(e);
                        }
                    }
                } else {
                    router.push("/admin/login");
                }
            } catch (e) {
                console.error(e);
            }
        };
        fetchData();
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-12">
                    <Link href="/" className="text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-4xl font-bold">Dashboard</h1>
                        <p className="text-zinc-500 text-sm mt-1">System analytics and messages</p>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Total Views</div>
                            <Eye size={20} className="text-zinc-700" />
                        </div>
                        <div className="text-4xl font-bold">{stats.total_views}</div>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Unique Visitors</div>
                            <Users size={20} className="text-zinc-700" />
                        </div>
                        <div className="text-4xl font-bold">{stats.unique_visitors}</div>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Projects</div>
                            <Folder size={20} className="text-zinc-700" />
                        </div>
                        <div className="text-4xl font-bold">{projectsCount}</div>
                    </div>
                    <div className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900">
                        <div className="flex items-center justify-between mb-4">
                            <div className="text-zinc-500 text-xs font-mono uppercase tracking-wider">Messages</div>
                            <MessageSquare size={20} className="text-zinc-700" />
                        </div>
                        <div className="text-4xl font-bold">{messages.length}</div>
                    </div>
                </div>

                {/* Traffic Chart */}
                <div className="bg-zinc-950 p-8 rounded-2xl border border-zinc-900 mb-12">
                    <h2 className="text-xl font-bold mb-8">Traffic Overview</h2>
                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#71717a' }} />
                                <Tooltip
                                    cursor={{ fill: '#18181b' }}
                                    contentStyle={{
                                        backgroundColor: '#09090b',
                                        border: '1px solid #27272a',
                                        borderRadius: '12px',
                                        color: '#fff'
                                    }}
                                />
                                <Bar dataKey="views" fill="#ffffff" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Messages */}
                <div>
                    <h2 className="text-2xl font-bold mb-6">Recent Messages</h2>
                    <div className="space-y-4">
                        {messages.length === 0 && (
                            <div className="text-zinc-500 text-center py-12 bg-zinc-950 rounded-2xl border border-zinc-900">
                                No messages yet.
                            </div>
                        )}
                        {messages.slice(0, 5).map(msg => (
                            <div key={msg.id} className="bg-zinc-950 p-6 rounded-2xl border border-zinc-900 hover:border-zinc-800 transition-colors">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="font-bold text-lg">{msg.name}</h3>
                                        <div className="text-zinc-500 text-sm flex items-center gap-2 mt-1">
                                            <Mail size={14} /> {msg.email}
                                        </div>
                                    </div>
                                    <div className="text-xs text-zinc-600 flex items-center gap-1 font-mono">
                                        <Calendar size={12} />
                                        {new Date(msg.timestamp).toLocaleDateString()}
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <span className="inline-block px-3 py-1 bg-zinc-900 text-zinc-400 text-xs rounded-lg font-mono border border-zinc-800">
                                        {msg.type}
                                    </span>
                                </div>
                                <p className="text-zinc-400 bg-black/50 p-4 rounded-xl text-sm border border-zinc-900">
                                    {msg.message}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
