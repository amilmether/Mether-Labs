"use client";

import { useState, Suspense, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, MapPin, Linkedin, Github, Send, Phone, Edit2, Save, X } from "lucide-react";

function ContactForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isEditMode = searchParams.get("edit") === "true";
    const initialService = searchParams.get("service") || "";

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        type: initialService ? "Service Request" : "General Inquiry",
        budget: "",
        whatsapp: "",
        message: initialService ? `I'm interested in the ${initialService} service.` : ""
    });
    const [status, setStatus] = useState("");
    const [profile, setProfile] = useState<any>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedProfile, setEditedProfile] = useState({
        location: "",
        whatsapp: ""
    });

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const res = await axios.get("/api/profile");
            setProfile(res.data);
            setEditedProfile({
                location: res.data.location || "Kottayam, Kerala, India",
                whatsapp: res.data.whatsapp || ""
            });
        } catch (err) {
            console.error("Failed to fetch profile:", err);
        }
    };

    const handleSaveProfile = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            await axios.put("/api/profile", {
                ...profile,
                location: editedProfile.location,
                whatsapp: editedProfile.whatsapp
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            fetchProfile();
            alert("Profile updated successfully!");
        } catch (err: any) {
            alert("Failed to update: " + (err.response?.data?.detail || err.message));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("sending");
        try {
            await axios.post("/api/contact", formData);
            setStatus("success");
            setFormData({ name: "", email: "", type: "General Inquiry", budget: "", whatsapp: "", message: "" });
        } catch (err) {
            setStatus("error");
        }
    };

    const displayLocation = profile?.location || "Kottayam, Kerala, India";
    const displayWhatsapp = profile?.whatsapp;

    return (
        <div className="min-h-screen bg-black text-white py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {isEditMode && !isEditing && (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="fixed bottom-8 right-8 z-50 w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-2xl"
                    >
                        <Edit2 size={20} />
                    </button>
                )}

                {isEditing && (
                    <div className="fixed bottom-8 right-8 z-50 flex gap-3">
                        <button
                            onClick={() => setIsEditing(false)}
                            className="w-14 h-14 bg-zinc-900 border border-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-2xl"
                        >
                            <X size={20} />
                        </button>
                        <button
                            onClick={handleSaveProfile}
                            className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-2xl"
                        >
                            <Save size={20} />
                        </button>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Left Column */}
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-8 tracking-tighter">Let's Talk</h1>
                        <p className="text-xl text-zinc-500 mb-16 leading-relaxed">
                            Have a project idea, need help with development, or just want to connect? Send me a message.
                        </p>

                        <div className="space-y-8 mb-16">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                                    <Mail size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-xs text-zinc-600 font-mono uppercase tracking-wider mb-1">Email</div>
                                    <a href="mailto:amilmether.dev@gmail.com" className="text-white hover:text-zinc-300 transition-colors">amilmether.dev@gmail.com</a>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                                    <MapPin size={20} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-xs text-zinc-600 font-mono uppercase tracking-wider mb-1">Location</div>
                                    {isEditing ? (
                                        <input
                                            value={editedProfile.location}
                                            onChange={e => setEditedProfile({ ...editedProfile, location: e.target.value })}
                                            className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-white outline-none transition-colors"
                                            placeholder="City, State, Country"
                                        />
                                    ) : (
                                        <div className="text-white">{displayLocation}</div>
                                    )}
                                </div>
                            </div>

                            {(displayWhatsapp || isEditing) && (
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center">
                                        <Phone size={20} className="text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-xs text-zinc-600 font-mono uppercase tracking-wider mb-1">WhatsApp</div>
                                        {isEditing ? (
                                            <input
                                                value={editedProfile.whatsapp}
                                                onChange={e => setEditedProfile({ ...editedProfile, whatsapp: e.target.value })}
                                                className="w-full p-2 bg-zinc-950 border border-zinc-800 rounded-lg text-white focus:border-white outline-none transition-colors"
                                                placeholder="+91 1234567890 (optional)"
                                            />
                                        ) : (
                                            <a href={`https://wa.me/${displayWhatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-white hover:text-zinc-300 transition-colors">
                                                {displayWhatsapp}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="pt-8 border-t border-zinc-900">
                            <h3 className="text-sm font-mono text-zinc-600 uppercase tracking-wider mb-6">Connect</h3>
                            <div className="flex gap-4">
                                <a href="https://www.linkedin.com/in/amilmether/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                    <Linkedin size={20} />
                                </a>
                                <a href="https://github.com/amilmether/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center hover:bg-white hover:text-black transition-all">
                                    <Github size={20} />
                                </a>
                                {(displayWhatsapp || isEditing) && (
                                    <a
                                        href={displayWhatsapp ? `https://wa.me/${displayWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent("Hi! I saw your website and would like to connect.")}` : "#"}
                                        target={displayWhatsapp ? "_blank" : undefined}
                                        rel={displayWhatsapp ? "noopener noreferrer" : undefined}
                                        className={`w-12 h-12 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-center transition-all group ${displayWhatsapp ? 'hover:bg-white hover:text-black' : 'opacity-50 cursor-not-allowed'}`}
                                        onClick={(e) => !displayWhatsapp && e.preventDefault()}
                                    >
                                        <svg
                                            viewBox="0 0 24 24"
                                            width="20"
                                            height="20"
                                            fill="currentColor"
                                        >
                                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                                        </svg>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Form */}
                    <div className="bg-zinc-950 border border-zinc-900 p-8 md:p-10 rounded-3xl">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Name</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-white outline-none transition-colors"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Email</label>
                                    <input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-white outline-none transition-colors"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Project Type</label>
                                    <div className="relative">
                                        <select
                                            value={formData.type}
                                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                                            className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors appearance-none cursor-pointer"
                                        >
                                            <option>General Inquiry</option>
                                            <option>Portfolio Website</option>
                                            <option>Business Website</option>
                                            <option>College Project</option>
                                            <option>Embedded/IoT Prototype</option>
                                            <option>Other</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Budget (Optional)</label>
                                    <div className="relative">
                                        <select
                                            value={formData.budget}
                                            onChange={e => setFormData({ ...formData, budget: e.target.value })}
                                            className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors appearance-none cursor-pointer"
                                        >
                                            <option value="">Select range</option>
                                            <option>Under ₹5k</option>
                                            <option>₹5k - ₹15k</option>
                                            <option>₹15k - ₹30k</option>
                                            <option>₹30k+</option>
                                        </select>
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                            <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">WhatsApp (Optional)</label>
                                <input
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                                    className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-white outline-none transition-colors"
                                    placeholder="+91 1234567890"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Message</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                                    className="w-full p-4 bg-black border border-zinc-800 rounded-xl text-white placeholder-zinc-600 focus:border-white outline-none transition-colors resize-none"
                                    placeholder="Tell me about your project..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={status === "sending"}
                                className="w-full py-4 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                            >
                                {status === "sending" ? "SENDING..." : (
                                    <>
                                        <Send size={18} />
                                        SEND MESSAGE
                                    </>
                                )}
                            </button>

                            {status === "success" && (
                                <div className="p-4 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl text-center text-sm">
                                    Message sent successfully! I'll get back to you soon.
                                </div>
                            )}
                            {status === "error" && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-center text-sm">
                                    Failed to send message. Please try again.
                                </div>
                            )}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Contact() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            <ContactForm />
        </Suspense>
    );
}
