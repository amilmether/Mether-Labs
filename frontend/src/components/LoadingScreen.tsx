"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export const LoadingScreen = () => {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return prev + 2;
            });
        }, 30);

        return () => clearInterval(interval);
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black"
            initial={{ opacity: 1 }}
            animate={{ opacity: progress >= 100 ? 0 : 1 }}
            transition={{ duration: 0.5, delay: progress >= 100 ? 0.3 : 0 }}
            style={{ pointerEvents: progress >= 100 ? "none" : "auto" }}
        >
            <div className="flex flex-col items-center gap-8 w-full max-w-md px-8">
                <div className="w-full">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">SYSTEM_BOOT</span>
                        <span className="text-xs font-mono text-white">{progress}%</span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div
                            className="h-full bg-white"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.1 }}
                        />
                    </div>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-xs font-mono text-zinc-600"
                >
                    {'>'} initializing_kernel...
                </motion.div>
            </div>
        </motion.div>
    );
};
