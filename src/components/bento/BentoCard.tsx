"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface BentoCardProps {
    children: React.ReactNode;
    className?: string;
    float?: boolean;
    delay?: number;
}

export const BentoCard = ({ children, className, float = false, delay = 0 }: BentoCardProps) => {
    return (
        <motion.div
            className={cn(
                "relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-900/40 p-6 backdrop-blur-md shadow-xl flex flex-col",
                className
            )}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay }}
        >
            {float && (
                <motion.div
                    className="absolute inset-0 -z-10"
                    animate={{ y: [0, -10, 0] }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: delay,
                    }}
                />
            )}
            {/* Content wrapper to apply float if needed, or just apply to the whole card? 
          If I apply to whole card, the initial animation might conflict.
          Let's apply float to the whole card after initial.
      */}
            <motion.div
                className="h-full w-full flex flex-col"
                animate={float ? { y: [0, -10, 0] } : {}}
                transition={
                    float
                        ? {
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                            delay: delay + 0.5, // Start floating after enter
                        }
                        : {}
                }
            >
                {children}
            </motion.div>
        </motion.div>
    );
};
