"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { ExternalLink, Github, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ProjectDetail() {
    const { slug } = useParams();
    const [project, setProject] = useState<any>(null);

    useEffect(() => {
        if (slug) {
            axios.get(`http://localhost:8000/api/projects/${slug}`)
                .then(res => setProject(res.data))
                .catch(err => console.error(err));
        }
    }, [slug]);

    if (!project) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="w-16 h-16 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-zinc-500">Loading project...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white py-20 md:py-32">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link href="/projects" className="inline-flex items-center gap-2 text-zinc-500 hover:text-white mb-12 transition-colors group">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Projects
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        <div>
                            <div className="inline-block px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs font-mono text-zinc-400 mb-4">
                                {project.category.toUpperCase()}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">{project.title}</h1>
                            <p className="text-xl text-zinc-400 leading-relaxed">{project.short_description}</p>
                        </div>

                        {/* Image Gallery */}
                        {project.images && project.images.length > 0 && (
                            <div className="space-y-4">
                                <div className="aspect-video bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800">
                                    <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover" />
                                </div>
                                {project.images.length > 1 && (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {project.images.slice(1).map((img: string, i: number) => (
                                            <div key={i} className="aspect-video bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800">
                                                <img src={img} alt={`${project.title} ${i + 2}`} className="w-full h-full object-cover" />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Description */}
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-2xl font-bold text-white mb-4">Overview</h3>
                            <div className="text-zinc-400 leading-relaxed whitespace-pre-wrap">
                                {project.detailed_description}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Info Card */}
                        <div className="bg-zinc-950 border border-zinc-900 p-6 rounded-2xl sticky top-24">
                            <h3 className="text-sm font-mono text-zinc-500 uppercase tracking-wider mb-6">Project Info</h3>

                            <div className="space-y-6">
                                <div>
                                    <div className="text-xs text-zinc-600 mb-2 font-mono uppercase tracking-wider">Category</div>
                                    <div className="text-white font-medium">{project.category}</div>
                                </div>

                                <div>
                                    <div className="text-xs text-zinc-600 mb-3 font-mono uppercase tracking-wider">Tech Stack</div>
                                    <div className="flex flex-wrap gap-2">
                                        {project.stack && JSON.parse(JSON.stringify(project.stack)).map((tech: string) => (
                                            <span key={tech} className="text-xs bg-zinc-900 border border-zinc-800 px-3 py-1 rounded-lg text-zinc-300">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-8 space-y-3">
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-white text-black rounded-xl font-bold hover:bg-zinc-200 transition-colors"
                                    >
                                        Live Demo <ExternalLink size={16} />
                                    </a>
                                )}
                                {project.github_link && (
                                    <a
                                        href={project.github_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center justify-center gap-2 w-full py-3 bg-zinc-900 border border-zinc-800 text-white rounded-xl font-medium hover:bg-zinc-800 transition-colors"
                                    >
                                        GitHub Repo <Github size={16} />
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
