"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Mail, Calendar } from "lucide-react";

export default function MessagesManager() {
    const [messages, setMessages] = useState<any[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const token = localStorage.getItem("token");
            try {
                const res = await axios.get("/api/messages", {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setMessages(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchMessages();
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-8">Messages</h1>
            <div className="space-y-4">
                {messages.length === 0 && <div className="text-zinc-500">No messages yet.</div>}
                {messages.map(msg => (
                    <div key={msg.id} className="bg-white p-6 rounded-xl border border-zinc-200 shadow-sm">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg">{msg.name}</h3>
                                <div className="text-zinc-500 text-sm flex items-center gap-2">
                                    <Mail size={14} /> {msg.email}
                                </div>
                            </div>
                            <div className="text-xs text-zinc-400 flex items-center gap-1">
                                <Calendar size={12} />
                                {new Date(msg.timestamp).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="mb-4">
                            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-600 text-xs rounded-md font-medium mr-2">
                                {msg.type}
                            </span>
                            {msg.budget && (
                                <span className="inline-block px-2 py-1 bg-green-50 text-green-600 text-xs rounded-md font-medium">
                                    Budget: {msg.budget}
                                </span>
                            )}
                        </div>
                        <p className="text-zinc-700 bg-zinc-50 p-4 rounded-lg text-sm">
                            {msg.message}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
