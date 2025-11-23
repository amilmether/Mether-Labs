"use client";

import { Background } from "@/components/Background";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Code, Cpu, Settings, Terminal, Plus, Edit2, Trash2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function Home() {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const [featuredProjects, setFeaturedProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = () => {
    axios.get("/api/projects?featured=true")
      .then(res => setFeaturedProjects(res.data))
      .catch(err => console.error(err));
  };

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Delete this project?")) return;
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProjects();
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="relative overflow-hidden">
      <Background />

      {/* Edit Mode Indicator */}
      {isEditMode && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-white text-black px-6 py-3 rounded-full font-mono text-sm shadow-2xl border-2 border-zinc-800">
          ✏️ EDIT MODE ACTIVE
        </div>
      )}

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-32">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-sm font-mono text-zinc-500 mb-4">{'>'} initializing_profile.exe</div>
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-white mb-6">
              Amil Mether
            </h1>
            <p className="text-2xl md:text-3xl text-zinc-400 font-light leading-relaxed mb-10">
              Full Stack Engineer & <br />
              <span className="text-white font-medium">IoT Specialist</span>
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Link href="/projects" className="px-8 py-4 bg-white text-black rounded-full font-bold hover:bg-zinc-200 transition-all flex items-center gap-2">
              View Work <ArrowRight size={18} />
            </Link>
            <Link href="/contact" className="px-8 py-4 bg-transparent border border-zinc-700 text-white rounded-full font-medium hover:bg-zinc-900 transition-all">
              Contact Me
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Highlights */}
      <section className="border-t border-zinc-900 bg-black py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Terminal, title: "Web Development", desc: "High-performance backends & reactive frontends." },
              { icon: Cpu, title: "Embedded Systems", desc: "Real-time firmware for ESP32 & ARM Cortex." },
              { icon: Settings, title: "Automation", desc: "Python scripts to streamline complex workflows." }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="group p-8 rounded-3xl bg-zinc-950 border border-zinc-900 hover:border-zinc-700 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <item.icon size={32} className="text-zinc-500 group-hover:text-white transition-colors mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">{item.title}</h3>
                <p className="text-zinc-500 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-32 bg-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-16">
            <h2 className="text-4xl font-bold text-white">Selected Works</h2>
            <div className="flex items-center gap-4">
              {isEditMode && (
                <Link
                  href="/admin/projects"
                  className="bg-white text-black px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 hover:bg-zinc-200 transition-colors"
                >
                  <Plus size={16} /> Add Project
                </Link>
              )}
              <Link href="/projects" className="text-zinc-500 hover:text-white transition-colors flex items-center gap-2 text-sm font-mono">
                VIEW_ALL_PROJECTS <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {featuredProjects.map((project, i) => (
              <div key={project.id} className="group block relative">
                {isEditMode && (
                  <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Link
                      href={`/admin/projects`}
                      className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center hover:bg-zinc-200 transition-colors shadow-lg"
                    >
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDeleteProject(project.id)}
                      className="w-10 h-10 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                )}
                <Link href={`/projects/${project.slug}`}>
                  <div className="relative aspect-[4/3] bg-zinc-900 rounded-3xl overflow-hidden mb-6 border border-zinc-800 group-hover:border-zinc-600 transition-colors">
                    {project.images && project.images.length > 0 ? (
                      <img src={project.images[0]} alt={project.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 grayscale group-hover:grayscale-0" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-700">
                        <Code size={64} />
                      </div>
                    )}
                    <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 text-xs font-mono text-white">
                      {project.category.toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:underline decoration-zinc-700 underline-offset-4">{project.title}</h3>
                    <p className="text-zinc-500 line-clamp-2">{project.short_description}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 border-t border-zinc-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter">
            Let's build something <br /> <span className="text-zinc-600">extraordinary.</span>
          </h2>
          <Link href="/contact" className="inline-flex items-center justify-center px-10 py-5 bg-white text-black rounded-full font-bold text-lg hover:scale-105 transition-transform">
            Start a Project
          </Link>
        </div>
      </section>
    </div>
  );
}
