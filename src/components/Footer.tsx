export const Footer = () => {
    return (
        <footer className="bg-black border-t border-zinc-900 py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 text-center">
                <p className="text-zinc-600 text-sm font-mono">
                    © {new Date().getFullYear()} Amil Mether. All rights reserved.
                </p>
                <div className="flex justify-center gap-6 mt-6">
                    <a
                        href="https://www.linkedin.com/in/amilmether/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-white transition-colors text-sm uppercase tracking-widest"
                    >
                        LinkedIn
                    </a>
                    <a
                        href="https://github.com/amilmether/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-zinc-600 hover:text-white transition-colors text-sm uppercase tracking-widest"
                    >
                        GitHub
                    </a>
                    <a
                        href="mailto:amilmether.dev@gmail.com"
                        className="text-zinc-600 hover:text-white transition-colors text-sm uppercase tracking-widest"
                    >
                        Email
                    </a>
                </div>
            </div>
        </footer>
    );
};
