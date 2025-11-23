"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";
import { Code, ExternalLink, Github } from "lucide-react";

export default function Projects() {
    const [projects, setProjects] = useState<any[]>([]);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        axios.get("/api/projects")
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    }, []);

    const filteredProjects = filter === "All"
        ? projects
        : projects.filter(p => p.category === filter);

    const categories = ["All", "Web", "Embedded", "Automation"];

    return (
        <div className="min-h-screen bg-black text-white py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tighter">Projects</h1>
                        <p className="text-zinc-500">A collection of my work in web and embedded systems.</p>
                    </div>

                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === cat
                                        ? "bg-white text-black"
                                        : "bg-zinc-950 border border-zinc-800 text-zinc-400 hover:border-zinc-600"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProjects.map((project) => (
                        <div key={project.id} className="group bg-zinc-950 rounded-3xl border border-zinc-900 overflow-hidden hover:border-zinc-700 transition-all">
                            <div className="aspect-video bg-zinc-900 relative overflow-hidden">
                                {project.images && project.images.length > 0 ? (
                                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-zinc-700">
                                        <Code size={48} />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono">
                                    {project.category.toUpperCase()}
                                </div>
                            </div>

                            <div className="p-6">
                                <h3 className="text-xl font-bold mb-2 group-hover:text-white transition-colors">{project.title}</h3>
                                <p className="text-zinc-500 text-sm mb-4 line-clamp-2">{project.short_description}</p>

                                <div className="flex flex-wrap gap-2 mb-6">
                                    {project.stack && JSON.parse(JSON.stringify(project.stack)).slice(0, 3).map((tech: string) => (
                                        <span key={tech} className="text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 rounded">
                                            {tech}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3">
                                    <Link href={`/projects/${project.slug}`} className="flex-1 py-2 text-center bg-white text-black rounded-lg text-sm font-bold hover:bg-zinc-200 transition-colors">
                                        View Details
                                    </Link>
                                    {project.link && (
                                        <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:border-zinc-600 transition-colors">
                                            <ExternalLink size={18} />
                                        </a>
                                    )}
                                    {project.github_link && (
                                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg hover:border-zinc-600 transition-colors">
                                            <Github size={18} />
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
