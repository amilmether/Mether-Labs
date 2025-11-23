"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, Edit2, X, Save, ArrowLeft, Upload, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProjectsManager() {
    const router = useRouter();
    const [projects, setProjects] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [uploading, setUploading] = useState(false);

    const [form, setForm] = useState({
        title: "",
        slug: "",
        short_description: "",
        detailed_description: "",
        category: "Web",
        stack: "",
        link: "",
        github_link: "",
        images: "",
        featured: false
    });

    const fetchProjects = async () => {
        try {
            const res = await axios.get("/api/projects");
            setProjects(res.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        // Check if user is authenticated
        const token = localStorage.getItem("token");
        if (!token) {
            router.push("/admin/login");
            return;
        }
        fetchProjects();
    }, [router]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        setUploading(true);
        const uploadedUrls: string[] = [];

        try {
            for (let i = 0; i < files.length; i++) {
                const formData = new FormData();
                formData.append("file", files[i]);

                const res = await axios.post("/api/upload-image", formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data"
                    }
                });

                uploadedUrls.push(res.data.url);
            }

            // Add uploaded URLs to existing images
            const currentImages = form.images ? form.images.split(",").map(s => s.trim()).filter(s => s) : [];
            const allImages = [...currentImages, ...uploadedUrls];
            setForm({ ...form, images: allImages.join(", ") });

            alert(`Successfully uploaded ${uploadedUrls.length} image(s)`);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                localStorage.removeItem("token");
                router.push("/admin/login");
            } else {
                alert("Upload failed: " + (err.response?.data?.detail || err.message));
            }
        } finally {
            setUploading(false);
        }
    };

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
            stack: form.stack.split(",").map(s => s.trim()).filter(s => s),
            images: form.images ? form.images.split(",").map(s => s.trim()).filter(s => s) : []
        };

        try {
            if (editingId) {
                await axios.put(`/api/projects/${editingId}`, payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                await axios.post("/api/projects", payload, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            fetchProjects();
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
        if (!confirm("Are you sure you want to delete this project?")) return;
        const token = localStorage.getItem("token");

        if (!token) {
            alert("Session expired. Please login again.");
            router.push("/admin/login");
            return;
        }

        try {
            await axios.delete(`/api/projects/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchProjects();
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

    const handleEdit = (project: any) => {
        setEditingId(project.id);
        setForm({
            title: project.title,
            slug: project.slug,
            short_description: project.short_description,
            detailed_description: project.detailed_description,
            category: project.category,
            stack: project.stack.join(", "),
            link: project.link || "",
            github_link: project.github_link || "",
            images: project.images ? project.images.join(", ") : "",
            featured: project.featured
        });
        setIsModalOpen(true);
    };

    const resetForm = () => {
        setEditingId(null);
        setForm({
            title: "",
            slug: "",
            short_description: "",
            detailed_description: "",
            category: "Web",
            stack: "",
            link: "",
            github_link: "",
            images: "",
            featured: false
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
                        <h1 className="text-3xl font-bold">Projects Manager</h1>
                        <p className="text-zinc-500 text-sm mt-1">Manage your portfolio projects</p>
                    </div>
                    <button
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="bg-white text-black px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-zinc-200 transition-colors font-bold"
                    >
                        <Plus size={18} /> Add Project
                    </button>
                </div>

                {/* Projects Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(p => (
                        <div key={p.id} className="bg-zinc-950 border border-zinc-900 rounded-2xl overflow-hidden group hover:border-zinc-700 transition-colors">
                            <div className="aspect-video bg-zinc-900 relative">
                                {p.images && p.images.length > 0 ? (
                                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                        No Image
                                    </div>
                                )}
                                {p.featured && (
                                    <div className="absolute top-3 right-3 bg-white text-black px-2 py-1 rounded text-xs font-bold">
                                        FEATURED
                                    </div>
                                )}
                            </div>
                            <div className="p-5">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="font-bold text-lg">{p.title}</h3>
                                    <span className="text-xs bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">{p.category}</span>
                                </div>
                                <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{p.short_description}</p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="flex-1 py-2 bg-zinc-900 border border-zinc-800 text-white rounded-lg text-sm font-medium hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {projects.length === 0 && (
                    <div className="text-center py-20">
                        <p className="text-zinc-600">No projects yet. Click "Add Project" to create one.</p>
                    </div>
                )}

                {/* Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-zinc-950 border-b border-zinc-800 p-6 flex justify-between items-center">
                                <h2 className="text-2xl font-bold">{editingId ? "Edit Project" : "New Project"}</h2>
                                <button onClick={() => setIsModalOpen(false)} className="text-zinc-500 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Title *</label>
                                        <input
                                            placeholder="Project Title"
                                            required
                                            value={form.title}
                                            onChange={e => setForm({ ...form, title: e.target.value })}
                                            className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Slug *</label>
                                        <input
                                            placeholder="project-slug"
                                            required
                                            value={form.slug}
                                            onChange={e => setForm({ ...form, slug: e.target.value })}
                                            className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Short Description *</label>
                                    <input
                                        placeholder="Brief description for cards"
                                        required
                                        value={form.short_description}
                                        onChange={e => setForm({ ...form, short_description: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Detailed Description *</label>
                                    <textarea
                                        placeholder="Full project description"
                                        rows={5}
                                        required
                                        value={form.detailed_description}
                                        onChange={e => setForm({ ...form, detailed_description: e.target.value })}
                                        className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors resize-none"
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Category</label>
                                        <select
                                            value={form.category}
                                            onChange={e => setForm({ ...form, category: e.target.value })}
                                            className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        >
                                            <option>Web</option>
                                            <option>Embedded</option>
                                            <option>Automation</option>
                                            <option>Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Tech Stack (comma separated)</label>
                                        <input
                                            placeholder="React, Node.js, MongoDB"
                                            value={form.stack}
                                            onChange={e => setForm({ ...form, stack: e.target.value })}
                                            className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Live Link</label>
                                        <input
                                            placeholder="https://example.com"
                                            value={form.link}
                                            onChange={e => setForm({ ...form, link: e.target.value })}
                                            className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">GitHub Link</label>
                                        <input
                                            placeholder="https://github.com/..."
                                            value={form.github_link}
                                            onChange={e => setForm({ ...form, github_link: e.target.value })}
                                            className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-mono text-zinc-500 mb-2 uppercase tracking-wider">Images</label>
                                    <div className="space-y-3">
                                        <input
                                            placeholder="https://image1.jpg, https://image2.jpg"
                                            value={form.images}
                                            onChange={e => setForm({ ...form, images: e.target.value })}
                                            className="w-full p-3 bg-black border border-zinc-800 rounded-xl text-white focus:border-white outline-none transition-colors"
                                        />
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="file"
                                                id="image-upload"
                                                accept="image/jpeg,image/jpg,image/png"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                            <label
                                                htmlFor="image-upload"
                                                className={`flex-1 py-3 px-4 bg-zinc-900 border border-zinc-800 text-white rounded-xl text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer flex items-center justify-center gap-2 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {uploading ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                        Uploading...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Upload size={16} />
                                                        Upload Images (PNG/JPEG)
                                                    </>
                                                )}
                                            </label>
                                        </div>
                                        {form.images && (
                                            <div className="grid grid-cols-3 gap-2">
                                                {form.images.split(",").map((url, i) => (
                                                    <div key={i} className="relative aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 group">
                                                        <img src={url.trim()} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" />
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const images = form.images.split(",").map(u => u.trim()).filter((_, idx) => idx !== i);
                                                                setForm({ ...form, images: images.join(", ") });
                                                            }}
                                                            className="absolute top-2 right-2 p-1.5 bg-red-500/90 hover:bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                                            title="Delete image"
                                                        >
                                                            <X size={14} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-4 bg-zinc-900 border border-zinc-800 rounded-xl">
                                    <input
                                        type="checkbox"
                                        id="featured"
                                        checked={form.featured}
                                        onChange={e => setForm({ ...form, featured: e.target.checked })}
                                        className="w-5 h-5"
                                    />
                                    <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                                        Feature this project on homepage
                                    </label>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-zinc-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Save size={18} />
                                    {editingId ? "Update Project" : "Create Project"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
