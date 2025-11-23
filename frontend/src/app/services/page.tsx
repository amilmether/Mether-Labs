"use client";

import { useEffect, useState, Suspense } from "react";
import axios from "axios";
import { CheckCircle, Edit2, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function ServicesContent() {
    const searchParams = useSearchParams();
    const isEditMode = searchParams.get("edit") === "true";

    const [services, setServices] = useState<any[]>([]);

    useEffect(() => {
        axios.get("/api/services")
            .then(res => setServices(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm("Delete this service?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/services/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setServices(services.filter(s => s.id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-black text-white py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-20">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter flex-1">Services</h1>
                        {isEditMode && (
                            <Link
                                href="/admin/services"
                                className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                            >
                                <Plus size={16} /> Add Service
                            </Link>
                        )}
                    </div>
                    <p className="text-zinc-500 text-lg">
                        I help individuals, students, and small businesses build websites, tools, and prototypes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-zinc-950 border border-zinc-900 p-8 rounded-3xl hover:border-zinc-700 transition-all group relative">
                            {isEditMode && (
                                <div className="absolute top-4 right-4 flex gap-2">
                                    <Link
                                        href="/admin/services"
                                        className="w-8 h-8 bg-white text-black rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors"
                                    >
                                        <Edit2 size={14} />
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(service.id)}
                                        className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}

                            <div className="mb-6">
                                <h3 className="text-2xl font-bold mb-2 group-hover:text-white transition-colors">{service.title}</h3>
                                <p className="text-zinc-500 text-sm">{service.short_description}</p>
                            </div>

                            <div className="space-y-3 mb-8">
                                {service.deliverables && JSON.parse(JSON.stringify(service.deliverables)).map((item: string) => (
                                    <div key={item} className="flex items-start gap-3 text-sm text-zinc-400">
                                        <CheckCircle size={16} className="text-white mt-0.5 shrink-0" />
                                        <span>{item}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="pt-6 border-t border-zinc-900">
                                <div className="text-sm text-zinc-500 mb-4">
                                    Starting from <span className="font-bold text-white text-lg">{service.price_from}</span>
                                </div>
                                <Link
                                    href={`/contact?service=${encodeURIComponent(service.title)}`}
                                    className="block w-full py-3 bg-white text-black text-center rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                                >
                                    Request Service
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Services() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500">Loading...</p>
                </div>
            </div>
        }>
            <ServicesContent />
        </Suspense>
    );
}
