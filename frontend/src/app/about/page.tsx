"use client";

import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { Edit2, Save, X, Plus, Trash2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function About() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const isEditMode = searchParams.get("edit") === "true";

    const [isEditing, setIsEditing] = useState(false);
    const [editSection, setEditSection] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const [content, setContent] = useState({
        intro1: "",
        intro2: ""
    });

    const [experiences, setExperiences] = useState<any[]>([]);
    const [timeline, setTimeline] = useState<any[]>([]);
    const [skills, setSkills] = useState<any[]>([]);
    const [skillCategories, setSkillCategories] = useState<any[]>([]);

    const [newExperience, setNewExperience] = useState({
        title: "",
        company: "",
        start_date: "",
        end_date: "",
        current: false,
        description: ""
    });
    const [newTimelineItem, setNewTimelineItem] = useState({ date: "", title: "", description: "" });
    const [newSkill, setNewSkill] = useState("");
    const [skillCategory, setSkillCategory] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");

    // Fetch all data on mount
    useEffect(() => {
        fetchAllData();
    }, []);

    const fetchAllData = async () => {
        try {
            const [contentRes, expRes, timelineRes, skillsRes, categoriesRes] = await Promise.all([
                axios.get("/api/about-content"),
                axios.get("/api/experiences"),
                axios.get("/api/timeline"),
                axios.get("/api/skills"),
                axios.get("/api/skill-categories")
            ]);

            setContent(contentRes.data);
            setExperiences(expRes.data);
            setTimeline(timelineRes.data);
            setSkills(skillsRes.data);
            setSkillCategories(categoriesRes.data);

            // Set default category if available
            if (categoriesRes.data.length > 0) {
                setSkillCategory(categoriesRes.data[0].name);
            }
        } catch (err) {
            console.error("Failed to fetch data:", err);
        } finally {
            setLoading(false);
        }
    };

    // Calculate duration between two dates
    const calculateDuration = (start: string, end: string | null, isCurrent: boolean) => {
        const startDate = new Date(start + "-01");
        const endDate = isCurrent ? new Date() : new Date((end || start) + "-01");

        const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 +
            (endDate.getMonth() - startDate.getMonth());

        if (months < 1) return "Less than a month";
        if (months === 1) return "1 month";
        if (months < 12) return `${months} months`;

        const years = Math.floor(months / 12);
        const remainingMonths = months % 12;

        if (remainingMonths === 0) return years === 1 ? "1 year" : `${years} years`;
        return `${years} ${years === 1 ? 'year' : 'years'} ${remainingMonths} ${remainingMonths === 1 ? 'month' : 'months'}`;
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr + "-01");
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    // Sort experiences by start date (newest first)
    const sortedExperiences = useMemo(() => {
        return [...experiences].sort((a, b) => b.start_date.localeCompare(a.start_date));
    }, [experiences]);

    // Sort timeline by date (newest first)
    const sortedTimeline = useMemo(() => {
        return [...timeline].sort((a, b) => b.date.localeCompare(a.date));
    }, [timeline]);

    // Group skills by category
    const skillsByCategory = useMemo(() => {
        const grouped: { [key: string]: any[] } = {};
        skillCategories.forEach(cat => {
            grouped[cat.name] = skills.filter(s => s.category === cat.name);
        });
        return grouped;
    }, [skills, skillCategories]);

    const handleSave = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            await axios.put("/api/about-content", content, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setIsEditing(false);
            setEditSection(null);
            alert("Content saved successfully!");
        } catch (err: any) {
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                router.push("/admin/login");
            } else {
                alert("Failed to save: " + (err.response?.data?.detail || err.message));
            }
        }
    };

    const addExperience = async () => {
        if (!newExperience.title || !newExperience.company || !newExperience.start_date) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            const res = await axios.post("/api/experiences", newExperience, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExperiences([...experiences, res.data]);
            setNewExperience({ title: "", company: "", start_date: "", end_date: "", current: false, description: "" });
        } catch (err: any) {
            alert("Failed to add: " + (err.response?.data?.detail || err.message));
        }
    };

    const deleteExperience = async (id: number) => {
        if (!confirm("Delete this experience?")) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/experiences/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setExperiences(experiences.filter(e => e.id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const addTimelineItem = async () => {
        if (!newTimelineItem.date || !newTimelineItem.title) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            const res = await axios.post("/api/timeline", newTimelineItem, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTimeline([...timeline, res.data]);
            setNewTimelineItem({ date: "", title: "", description: "" });
        } catch (err: any) {
            alert("Failed to add: " + (err.response?.data?.detail || err.message));
        }
    };

    const deleteTimelineItem = async (id: number) => {
        if (!confirm("Delete this timeline item?")) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/timeline/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTimeline(timeline.filter(t => t.id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    const addCategory = async () => {
        if (!newCategoryName) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            const res = await axios.post("/api/skill-categories",
                { name: newCategoryName, display_order: skillCategories.length },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSkillCategories([...skillCategories, res.data]);
            setNewCategoryName("");
            setSkillCategory(res.data.name);
        } catch (err: any) {
            alert("Failed to add category: " + (err.response?.data?.detail || err.message));
        }
    };

    const deleteCategory = async (id: number, name: string) => {
        if (!confirm(`Delete category "${name}" and all its skills?`)) return;

        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/skill-categories/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSkillCategories(skillCategories.filter(c => c.id !== id));
            setSkills(skills.filter(s => s.category !== name));
            if (skillCategory === name && skillCategories.length > 1) {
                setSkillCategory(skillCategories.find(c => c.id !== id)?.name || "");
            }
        } catch (err) {
            alert("Delete failed");
        }
    };

    const addSkill = async () => {
        if (!newSkill || !skillCategory) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            const res = await axios.post("/api/skills",
                { name: newSkill, category: skillCategory },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSkills([...skills, res.data]);
            setNewSkill("");
        } catch (err: any) {
            alert("Failed to add: " + (err.response?.data?.detail || err.message));
        }
    };

    const deleteSkill = async (id: number) => {
        const token = localStorage.getItem("token");
        try {
            await axios.delete(`/api/skills/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setSkills(skills.filter(s => s.id !== id));
        } catch (err) {
            alert("Delete failed");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 py-32">
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
                        onClick={() => { setIsEditing(false); setEditSection(null); }}
                        className="w-14 h-14 bg-zinc-900 border border-zinc-800 text-white rounded-full flex items-center justify-center hover:bg-zinc-800 transition-colors shadow-2xl"
                    >
                        <X size={20} />
                    </button>
                    <button
                        onClick={handleSave}
                        className="w-14 h-14 bg-white text-black rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-2xl"
                    >
                        <Save size={20} />
                    </button>
                </div>
            )}

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-5xl font-bold mb-12 text-white">About Me</h1>

                {/* Intro Section */}
                <div className="prose prose-lg prose-invert text-zinc-400 mb-16 space-y-4">
                    {isEditing ? (
                        <>
                            <textarea
                                value={content.intro1}
                                onChange={e => setContent({ ...content, intro1: e.target.value })}
                                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                rows={3}
                            />
                            <textarea
                                value={content.intro2}
                                onChange={e => setContent({ ...content, intro2: e.target.value })}
                                className="w-full p-4 bg-zinc-950 border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                rows={3}
                            />
                        </>
                    ) : (
                        <>
                            <p>{content.intro1}</p>
                            <p>{content.intro2}</p>
                        </>
                    )}
                </div>

                {/* Experience Section - keeping existing code */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Experience</h2>
                        {isEditing && (
                            <button
                                onClick={() => setEditSection(editSection === "experience" ? null : "experience")}
                                className="text-sm bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-zinc-200 transition-colors"
                            >
                                {editSection === "experience" ? "Done" : "Edit"}
                            </button>
                        )}
                    </div>

                    <div className="space-y-6">
                        {sortedExperiences.map((exp) => (
                            <div key={exp.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl p-6 hover:border-zinc-800 transition-colors relative">
                                {editSection === "experience" && (
                                    <button
                                        onClick={() => deleteExperience(exp.id)}
                                        className="absolute top-4 right-4 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex-1">
                                        <h3 className="text-xl font-bold text-white">{exp.title}</h3>
                                        <p className="text-zinc-500 text-sm">{exp.company}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-mono text-zinc-400">
                                            {formatDate(exp.start_date)} - {exp.current ? "Present" : formatDate(exp.end_date)}
                                        </p>
                                        <p className="text-xs text-zinc-600 mt-1">
                                            {calculateDuration(exp.start_date, exp.end_date, exp.current)}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-zinc-400 text-sm">{exp.description}</p>
                            </div>
                        ))}
                    </div>

                    {editSection === "experience" && (
                        <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-white mb-4">Add New Experience</h3>
                            <input
                                placeholder="Title"
                                value={newExperience.title}
                                onChange={e => setNewExperience({ ...newExperience, title: e.target.value })}
                                className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                            />
                            <input
                                placeholder="Company"
                                value={newExperience.company}
                                onChange={e => setNewExperience({ ...newExperience, company: e.target.value })}
                                className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-2">Start Date</label>
                                    <input
                                        type="month"
                                        value={newExperience.start_date}
                                        onChange={e => setNewExperience({ ...newExperience, start_date: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs text-zinc-500 mb-2">End Date</label>
                                    <input
                                        type="month"
                                        value={newExperience.end_date}
                                        onChange={e => setNewExperience({ ...newExperience, end_date: e.target.value })}
                                        disabled={newExperience.current}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors disabled:opacity-50"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-black border border-zinc-800 rounded-xl">
                                <input
                                    type="checkbox"
                                    id="current"
                                    checked={newExperience.current}
                                    onChange={e => setNewExperience({ ...newExperience, current: e.target.checked, end_date: e.target.checked ? "" : newExperience.end_date })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="current" className="text-sm text-zinc-400 cursor-pointer">
                                    I currently work here
                                </label>
                            </div>
                            <textarea
                                placeholder="Description"
                                rows={3}
                                value={newExperience.description}
                                onChange={e => setNewExperience({ ...newExperience, description: e.target.value })}
                                className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                            />
                            <button
                                onClick={addExperience}
                                className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add Experience
                            </button>
                        </div>
                    )}
                </div>

                {/* Timeline Section - keeping existing code */}
                <div className="mb-16">
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Timeline</h2>
                        {isEditing && (
                            <button
                                onClick={() => setEditSection(editSection === "timeline" ? null : "timeline")}
                                className="text-sm bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-zinc-200 transition-colors"
                            >
                                {editSection === "timeline" ? "Done" : "Edit"}
                            </button>
                        )}
                    </div>

                    <div className="space-y-12 border-l border-zinc-800 pl-8 ml-4 relative">
                        {sortedTimeline.map((item) => (
                            <div key={item.id} className="relative">
                                {editSection === "timeline" && (
                                    <button
                                        onClick={() => deleteTimelineItem(item.id)}
                                        className="absolute -right-12 top-0 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                )}
                                <div className="absolute -left-[37px] top-1.5 w-3 h-3 rounded-full bg-white ring-4 ring-black" />
                                <span className="text-xs font-mono text-zinc-500 mb-2 block">{formatDate(item.date)}</span>
                                <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-zinc-500">{item.description}</p>
                            </div>
                        ))}
                    </div>

                    {editSection === "timeline" && (
                        <div className="mt-6 bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                            <h3 className="font-bold text-white mb-4">Add Timeline Item</h3>
                            <div>
                                <label className="block text-xs text-zinc-500 mb-2">Date</label>
                                <input
                                    type="month"
                                    value={newTimelineItem.date}
                                    onChange={e => setNewTimelineItem({ ...newTimelineItem, date: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-500 mb-2">Title</label>
                                <input
                                    placeholder="e.g., Started B.Tech"
                                    value={newTimelineItem.title}
                                    onChange={e => setNewTimelineItem({ ...newTimelineItem, title: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-zinc-500 mb-2">Description</label>
                                <textarea
                                    placeholder="Brief description of this milestone"
                                    rows={2}
                                    value={newTimelineItem.description}
                                    onChange={e => setNewTimelineItem({ ...newTimelineItem, description: e.target.value })}
                                    className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                />
                            </div>
                            <button
                                onClick={addTimelineItem}
                                className="w-full bg-white text-black py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={18} /> Add Timeline Item
                            </button>
                        </div>
                    )}
                </div>

                {/* Skills Section - NEW with dynamic categories */}
                <div>
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold text-white">Skills</h2>
                        {isEditing && (
                            <button
                                onClick={() => setEditSection(editSection === "skills" ? null : "skills")}
                                className="text-sm bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-zinc-200 transition-colors"
                            >
                                {editSection === "skills" ? "Done" : "Edit"}
                            </button>
                        )}
                    </div>

                    {skillCategories.length === 0 ? (
                        <div className="text-center py-12 bg-zinc-950 border border-zinc-900 rounded-2xl">
                            <p className="text-zinc-500 mb-4">No skill categories yet.</p>
                            {isEditing && editSection === "skills" && (
                                <p className="text-zinc-600 text-sm">Add a category below to get started.</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {skillCategories.map((category) => (
                                <div key={category.id}>
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="font-mono text-sm text-zinc-500 uppercase tracking-widest">{category.name}</h3>
                                        {editSection === "skills" && (
                                            <button
                                                onClick={() => deleteCategory(category.id, category.name)}
                                                className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                            >
                                                Delete Category
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {skillsByCategory[category.name]?.map((s) => (
                                            <span key={s.id} className="px-4 py-2 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-lg text-sm hover:border-zinc-600 transition-colors relative group">
                                                {s.name}
                                                {editSection === "skills" && (
                                                    <button
                                                        onClick={() => deleteSkill(s.id)}
                                                        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={12} />
                                                    </button>
                                                )}
                                            </span>
                                        ))}
                                        {(!skillsByCategory[category.name] || skillsByCategory[category.name].length === 0) && (
                                            <span className="text-zinc-600 text-sm italic">No skills in this category yet</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {editSection === "skills" && (
                        <div className="mt-6 space-y-6">
                            {/* Add Category */}
                            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                                <h3 className="font-bold text-white mb-4">Add Category</h3>
                                <div className="flex gap-3">
                                    <input
                                        placeholder="Category name (e.g., Mobile Development)"
                                        value={newCategoryName}
                                        onChange={e => setNewCategoryName(e.target.value)}
                                        onKeyPress={e => e.key === "Enter" && addCategory()}
                                        className="flex-1 p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                    />
                                    <button
                                        onClick={addCategory}
                                        className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                                    >
                                        <Plus size={18} /> Add Category
                                    </button>
                                </div>
                            </div>

                            {/* Add Skill */}
                            {skillCategories.length > 0 && (
                                <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-6 space-y-4">
                                    <h3 className="font-bold text-white mb-4">Add Skill</h3>
                                    <select
                                        value={skillCategory}
                                        onChange={e => setSkillCategory(e.target.value)}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                    >
                                        {skillCategories.map(cat => (
                                            <option key={cat.id} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                    <div className="flex gap-3">
                                        <input
                                            placeholder="Skill name"
                                            value={newSkill}
                                            onChange={e => setNewSkill(e.target.value)}
                                            onKeyPress={e => e.key === "Enter" && addSkill()}
                                            className="flex-1 p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center gap-2"
                                        >
                                            <Plus size={18} /> Add
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
}
