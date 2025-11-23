"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2, X, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ServicesManager() {
    const router = useRouter();
    const [services, setServices] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);

    const [form, setForm] = useState({
        title: "",
        short_description: "",
        detailed_description: "",
        deliverables: "",
        price_from: "",
        stack: "",
        is_active: true
    });

    const fetchServices = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/services");
            setServices(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        fetchServices();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        const payload = {
            ...form,
            deliverables: form.deliverables.split(",").map(s => s.trim()).filter(s => s),
            stack: form.stack.split(",").map(s => s.trim()).filter(s => s)
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:8000/api/services/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("http://localhost:8000/api/services", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchServices();
            setIsModalOpen(false);
            resetForm();
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                router.push("/admin/login");
            } else {
                alert("Operation failed: " + (err.response?.data?.detail || err.message));
            }
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm("Are you sure you want to delete this service?")) return;
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            await axios.delete(`http://localhost:8000/api/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchServices();
        } catch (err: any) {
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                router.push("/admin/login");
            } else {
                alert("Delete failed");
            }
        }
    };

    const handleEdit = (service: any) => {
        setEditingId(service.id);
        setForm({
            title: service.title,
            short_description: service.short_description,
            detailed_description: service.detailed_description || "",
            deliverables: service.deliverables.join(", "),
            price_from: service.price_from,
            stack: service.stack ? service.stack.join(", ") : "",
            is_active: service.is_active
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            title: "",
            short_description: "",
            detailed_description: "",
            deliverables: "",
            price_from: "",
            stack: "",
            is_active: true
        });
    };

    return (
        <div className="min-h-screen bg-black text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-3xl font-bold">Services Manager</h1>
                        <p className="text-zinc-500 text-sm mt-1">Manage your service offerings</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-white text-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-zinc-200 transition-colors font-bold"
                    >
                        <Plus size={18} /> Add Service
                    </button>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {services.map(s => (
                        <div key={s.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-700 transition-colors">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="font-bold text-xl flex-1">{s.title}</h3>
                                {s.is_active && (
                                    <span className="text-xs bg-green-500/10 border border-green-500/20 text-green-400 px-2 py-1 rounded">ACTIVE</span>
                                )}
                            </div>
                            <p className="text-zinc-500 text-sm mb-4">{s.short_description}</p>
                            <div className="text-white font-bold mb-4">{s.price_from}</div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleEdit(s)}
                                    className="flex-1 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(s.id)}
                                    className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {services.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-600">No services yet. Click "Add Service" to create one.</p>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">{editingId ? "Edit Service" : "New Service"}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Service Title *</label>
                                    <input
                                        placeholder="e.g., Portfolio Website Development"
                                        required
                                        value={form.title}
                                        onChange={e => setForm({ ...form, title: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Short Description *</label>
                                    <textarea
                                        placeholder="Brief description of the service"
                                        rows={2}
                                        required
                                        value={form.short_description}
                                        onChange={e => setForm({ ...form, short_description: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Detailed Description *</label>
                                    <textarea
                                        placeholder="Full description of what's included"
                                        rows={4}
                                        required
                                        value={form.detailed_description}
                                        onChange={e => setForm({ ...form, detailed_description: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Deliverables (comma separated) *</label>
                                    <textarea
                                        placeholder="Responsive design, SEO optimization, Contact form"
                                        rows={3}
                                        required
                                        value={form.deliverables}
                                        onChange={e => setForm({ ...form, deliverables: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Tech Stack (comma separated)</label>
                                    <input
                                        placeholder="React, Node.js, PostgreSQL"
                                        value={form.stack}
                                        onChange={e => setForm({ ...form, stack: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Price From *</label>
                                    <input
                                        placeholder="e.g., ₹15,000"
                                        required
                                        value={form.price_from}
                                        onChange={e => setForm({ ...form, price_from: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                    />
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={form.is_active}
                                        onChange={e => setForm({ ...form, is_active: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium cursor-pointer">
                                        Active (visible on services page)
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingId ? "Update Service" : "Create Service"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
