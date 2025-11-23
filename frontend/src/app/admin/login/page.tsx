"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);

            const res = await axios.post("http://localhost:8000/token", formData);
            localStorage.setItem("token", res.data.access_token);
            router.push("/admin");
        } catch (err) {
            alert("Login failed. Check credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-black text-white px-4">
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <div className="w-3 h-3 bg-white rounded-full mx-auto mb-4" />
                    <h1 className="text-3xl font-bold tracking-tighter mb-2">ADMIN ACCESS</h1>
                    <p className="text-zinc-500 text-sm font-mono">Authenticate to continue</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl focus:border-white focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 text-white p-4 rounded-xl focus:border-white focus:outline-none transition-colors"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black p-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? "AUTHENTICATING..." : "AUTHENTICATE"}
                    </button>
                </form>

                <div className="mt-8 text-center">
                    <a href="/" className="text-zinc-600 hover:text-white text-sm transition-colors">
                        ← Back to Home
                    </a>
                </div>
            </div>
        </div>
    );
}
