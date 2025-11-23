"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2, X, Save, ArrowLeft, GripVertical } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AboutManager() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<'intro' | 'experience' | 'skills' | 'testimonials'>('intro');
    const [loading, setLoading] = useState(true);

    // Data States
    const [aboutContent, setAboutContent] = useState({ intro1: "", intro2: "" });
    const [experiences, setExperiences] = useState<any[]>([]);
    const [skillCategories, setSkillCategories] = useState<any[]>([]);
    const [testimonials, setTestimonials] = useState<any[]>([]);

    // Modal States
    const [isExpModalOpen, setIsExpModalOpen] = useState(false);
    const [isSkillCatModalOpen, setIsSkillCatModalOpen] = useState(false);
    const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);

    // Forms
    const [expForm, setExpForm] = useState({
        title: "",
        company: "",
        start_date: "",
        end_date: "",
        current: false,
        description: ""
    });

    const [skillCatForm, setSkillCatForm] = useState({
        name: "",
        display_order: 0
    });

    const [newSkillName, setNewSkillName] = useState("");
    const [selectedCatId, setSelectedCatId] = useState<number | null>(null);

    const [testimonialForm, setTestimonialForm] = useState({
        client_name: "",
        role: "",
        text: ""
    });

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        fetchAllData();
    }, [router]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [aboutRes, expRes, skillsRes, testRes] = await Promise.all([
                axios.get("/api/about"),
                axios.get("/api/experience"),
                axios.get("/api/skill-categories"),
                axios.get("/api/testimonials")
            ]);

            setAboutContent(aboutRes.data);
            setExperiences(expRes.data);
            setSkillCategories(skillsRes.data);
            setTestimonials(testRes.data);
        } catch (error) {
            console.error("Failed to fetch data", error);
        } finally {
            setLoading(false);
        }
    };

    // --- About Content Handlers ---
    const handleSaveAbout = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/about", aboutContent, {
                headers: { Authorization: `Bearer ${token}` }
            });
            alert("About content saved!");
        } catch (error) {
            console.error(error);
            alert("Failed to save");
        }
    };

    // --- Experience Handlers ---
    const handleSaveExperience = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (editingItem) {
                await axios.put(`/api/experience/${editingItem.id}`, expForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("/api/experience", expForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsExpModalOpen(false);
            setEditingItem(null);
            setExpForm({ title: "", company: "", start_date: "", end_date: "", current: false, description: "" });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to save experience");
        }
    };

    const handleDeleteExperience = async (id: number) => {
        if (!confirm("Delete this experience?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/experience/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
        }
    };

    // --- Skill Handlers ---
    const handleSaveSkillCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (editingItem) {
                await axios.put(`/api/skill-categories/${editingItem.id}`, skillCatForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("/api/skill-categories", skillCatForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsSkillCatModalOpen(false);
            setEditingItem(null);
            setSkillCatForm({ name: "", display_order: 0 });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to save category");
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm("Delete this category and all its skills?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/skill-categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
        }
    };

    const handleAddSkill = async (catName: string) => {
        if (!newSkillName.trim()) return;
        const token = localStorage.getItem("token");
        try {
            await axios.post("/api/skills", { name: newSkillName, category: catName }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNewSkillName("");
            setSelectedCatId(null);
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to add skill");
        }
    };

    const handleDeleteSkill = async (id: number) => {
        if (!confirm("Delete this skill?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/skills/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to delete skill");
        }
    };

    // --- Testimonial Handlers ---
    const handleSaveTestimonial = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem("token");
        try {
            if (editingItem) {
                await axios.put(`/api/testimonials/${editingItem.id}`, testimonialForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("/api/testimonials", testimonialForm, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setIsTestimonialModalOpen(false);
            setEditingItem(null);
            setTestimonialForm({ client_name: "", role: "", text: "" });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to save testimonial");
        }
    };

    const handleDeleteTestimonial = async (id: number) => {
        if (!confirm("Delete this testimonial?")) return;
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/testimonials/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchAllData();
        } catch (error) {
            console.error(error);
            alert("Failed to delete");
        }
    };

    if (loading) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-black text-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/admin" className="text-zinc-500 hover:text-white transition-colors">
                        <ArrowLeft size={20} />
                    </Link>
                    <h1 className="text-3xl font-bold">About Page Manager</h1>
                </div>

                {/* Tabs */}
                <div className="flex gap-4 mb-8 border-b border-zinc-800 pb-4 overflow-x-auto">
                    {['intro', 'experience', 'skills', 'testimonials'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab as any)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab ? 'bg-white text-black' : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Content */}
                <div className="space-y-8">
                    {/* Intro Tab */}
                    {activeTab === 'intro' && (
                        <div className="space-y-6 max-w-3xl">
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Introduction Paragraph 1</label>
                                <textarea
                                    rows={5}
                                    value={aboutContent.intro1}
                                    onChange={e => setAboutContent({ ...aboutContent, intro1: e.target.value })}
                                    className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Introduction Paragraph 2</label>
                                <textarea
                                    rows={5}
                                    value={aboutContent.intro2}
                                    onChange={e => setAboutContent({ ...aboutContent, intro2: e.target.value })}
                                    className="w-full p-4 bg-zinc-900 border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                />
                            </div>
                            <button
                                onClick={handleSaveAbout}
                                className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                            >
                                <Save size={18} /> Save Content
                            </button>
                        </div>
                    )}

                    {/* Experience Tab */}
                    {activeTab === 'experience' && (
                        <div>
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setExpForm({ title: "", company: "", start_date: "", end_date: "", current: false, description: "" });
                                    setIsExpModalOpen(true);
                                }}
                                className="mb-6 bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-200 transition-colors font-bold text-sm"
                            >
                                <Plus size={16} /> Add Experience
                            </button>
                            <div className="space-y-4">
                                {experiences.map(exp => (
                                    <div key={exp.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg">{exp.title}</h3>
                                            <p className="text-zinc-400">{exp.company}</p>
                                            <p className="text-zinc-500 text-sm mt-1">
                                                {exp.start_date} - {exp.current ? 'Present' : exp.end_date}
                                            </p>
                                            <p className="text-zinc-400 mt-2 text-sm whitespace-pre-wrap">{exp.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(exp);
                                                    setExpForm({
                                                        title: exp.title,
                                                        company: exp.company,
                                                        start_date: exp.start_date,
                                                        end_date: exp.end_date || "",
                                                        current: exp.current,
                                                        description: exp.description
                                                    });
                                                    setIsExpModalOpen(true);
                                                }}
                                                className="p-2 bg-zinc-800 text-white rounded-lg hover:bg-zinc-700"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteExperience(exp.id)}
                                                className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Skills Tab */}
                    {activeTab === 'skills' && (
                        <div>
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setSkillCatForm({ name: "", display_order: 0 });
                                    setIsSkillCatModalOpen(true);
                                }}
                                className="mb-6 bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-200 transition-colors font-bold text-sm"
                            >
                                <Plus size={16} /> Add Category
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {skillCategories.map(cat => (
                                    <div key={cat.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl">
                                        <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-2">
                                            <h3 className="font-bold text-lg">{cat.name}</h3>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingItem(cat);
                                                        setSkillCatForm({ name: cat.name, display_order: cat.display_order });
                                                        setIsSkillCatModalOpen(true);
                                                    }}
                                                    className="text-zinc-400 hover:text-white"
                                                >
                                                    <Edit2 size={14} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteCategory(cat.id)}
                                                    className="text-red-400 hover:text-red-300"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {cat.skills.map((skill: any) => (
                                                <div key={skill.id} className="bg-zinc-800 px-3 py-1 rounded-full text-sm flex items-center gap-2">
                                                    {skill.name}
                                                    <button
                                                        onClick={() => handleDeleteSkill(skill.id)}
                                                        className="text-zinc-500 hover:text-red-400"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <input
                                                placeholder="New skill..."
                                                value={selectedCatId === cat.id ? newSkillName : ""}
                                                onChange={e => {
                                                    setSelectedCatId(cat.id);
                                                    setNewSkillName(e.target.value);
                                                }}
                                                className="flex-1 bg-black border border-zinc-800 rounded-lg px-3 py-1.5 text-sm focus:border-white outline-none"
                                            />
                                            <button
                                                onClick={() => handleAddSkill(cat.name)}
                                                disabled={selectedCatId !== cat.id || !newSkillName.trim()}
                                                className="bg-white text-black px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-zinc-200 disabled:opacity-50"
                                            >
                                                Add
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Testimonials Tab */}
                    {activeTab === 'testimonials' && (
                        <div>
                            <button
                                onClick={() => {
                                    setEditingItem(null);
                                    setTestimonialForm({ client_name: "", role: "", text: "" });
                                    setIsTestimonialModalOpen(true);
                                }}
                                className="mb-6 bg-white text-black px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-zinc-200 transition-colors font-bold text-sm"
                            >
                                <Plus size={16} /> Add Testimonial
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {testimonials.map(t => (
                                    <div key={t.id} className="bg-zinc-900 border border-zinc-800 p-6 rounded-xl relative group">
                                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => {
                                                    setEditingItem(t);
                                                    setTestimonialForm({ client_name: t.client_name, role: t.role, text: t.text });
                                                    setIsTestimonialModalOpen(true);
                                                }}
                                                className="p-1.5 bg-zinc-800 text-white rounded hover:bg-zinc-700"
                                            >
                                                <Edit2 size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTestimonial(t.id)}
                                                className="p-1.5 bg-red-500/10 text-red-400 rounded hover:bg-red-500/20"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                        <p className="text-zinc-300 italic mb-4">"{t.text}"</p>
                                        <div>
                                            <h4 className="font-bold">{t.client_name}</h4>
                                            <p className="text-zinc-500 text-sm">{t.role}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Modals */}
                {/* Experience Modal */}
                {isExpModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6">
                            <h2 className="text-xl font-bold mb-4">{editingItem ? "Edit Experience" : "Add Experience"}</h2>
                            <form onSubmit={handleSaveExperience} className="space-y-4">
                                <input
                                    placeholder="Title (e.g. Senior Developer)"
                                    required
                                    value={expForm.title}
                                    onChange={e => setExpForm({ ...expForm, title: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl"
                                />
                                <input
                                    placeholder="Company"
                                    required
                                    value={expForm.company}
                                    onChange={e => setExpForm({ ...expForm, company: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl"
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="month"
                                        required
                                        value={expForm.start_date}
                                        onChange={e => setExpForm({ ...expForm, start_date: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl"
                                    />
                                    <input
                                        type="month"
                                        disabled={expForm.current}
                                        value={expForm.end_date}
                                        onChange={e => setExpForm({ ...expForm, end_date: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl disabled:opacity-50"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={expForm.current}
                                        onChange={e => setExpForm({ ...expForm, current: e.target.checked })}
                                        className="w-4 h-4"
                                    />
                                    <label className="text-sm">I currently work here</label>
                                </div>
                                <textarea
                                    placeholder="Description"
                                    rows={4}
                                    value={expForm.description}
                                    onChange={e => setExpForm({ ...expForm, description: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl resize-none"
                                />
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setIsExpModalOpen(false)} className="flex-1 py-3 bg-zinc-900 rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-white text-black font-bold rounded-xl">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Skill Category Modal */}
                {isSkillCatModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-sm w-full p-6">
                            <h2 className="text-xl font-bold mb-4">{editingItem ? "Edit Category" : "Add Category"}</h2>
                            <form onSubmit={handleSaveSkillCategory} className="space-y-4">
                                <input
                                    placeholder="Category Name"
                                    required
                                    value={skillCatForm.name}
                                    onChange={e => setSkillCatForm({ ...skillCatForm, name: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl"
                                />
                                <input
                                    type="number"
                                    placeholder="Display Order"
                                    value={skillCatForm.display_order}
                                    onChange={e => setSkillCatForm({ ...skillCatForm, display_order: parseInt(e.target.value) })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl"
                                />
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setIsSkillCatModalOpen(false)} className="flex-1 py-3 bg-zinc-900 rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-white text-black font-bold rounded-xl">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Testimonial Modal */}
                {isTestimonialModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-lg w-full p-6">
                            <h2 className="text-xl font-bold mb-4">{editingItem ? "Edit Testimonial" : "Add Testimonial"}</h2>
                            <form onSubmit={handleSaveTestimonial} className="space-y-4">
                                <input
                                    placeholder="Client Name"
                                    required
                                    value={testimonialForm.client_name}
                                    onChange={e => setTestimonialForm({ ...testimonialForm, client_name: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl"
                                />
                                <input
                                    placeholder="Role / Company"
                                    required
                                    value={testimonialForm.role}
                                    onChange={e => setTestimonialForm({ ...testimonialForm, role: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl"
                                />
                                <textarea
                                    placeholder="Testimonial Text"
                                    required
                                    rows={4}
                                    value={testimonialForm.text}
                                    onChange={e => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl resize-none"
                                />
                                <div className="flex gap-3 mt-6">
                                    <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="flex-1 py-3 bg-zinc-900 rounded-xl">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-white text-black font-bold rounded-xl">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
