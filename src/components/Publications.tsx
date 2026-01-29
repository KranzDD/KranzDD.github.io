
import { useMemo } from 'react';
import bibContent from '../assets/publications.bib?raw';
import { parseBibtex } from '../utils/parseBibtex';

export default function Publications() {
    const publications = useMemo(() => parseBibtex(bibContent), []);

    return (
        <section id="publications" className="mx-auto max-w-5xl px-6 py-20">
            <div className="mb-10">
                <h2 className="text-3xl font-semibold tracking-tight text-slate-100">Publications</h2>
                <p className="mt-2 text-slate-400">
                    Selected works from recent years.
                </p>
            </div>

            <div className="space-y-6">
                {publications.map((pub) => (
                    <div
                        key={pub.id}
                        className="group relative flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 transition hover:border-white/10 hover:bg-white/10 sm:flex-row sm:items-start sm:gap-6"
                    >
                        <div className="absolute -inset-px rounded-2xl border-2 border-transparent bg-gradient-to-b from-sky-500/10 to-transparent opacity-0 transition group-hover:opacity-100 pointer-events-none" />

                        <div className="flex-1">
                            <h3 className="text-lg font-medium leading-snug text-slate-200 group-hover:text-slate-50 transition">
                                {pub.title}
                            </h3>
                            <div className="mt-2 text-sm text-slate-400 leading-relaxed">
                                {pub.author}
                            </div>
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center rounded-md border border-sky-500/20 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300">
                                    {pub.year}
                                </span>
                                <span className="inline-flex items-center text-xs text-slate-500">
                                    •
                                </span>
                                <span className="text-sm font-medium text-slate-300">
                                    {pub.venue}
                                </span>
                            </div>
                        </div>

                        {/* Placeholder for link if available in the future */}
                        {pub.url && (
                            <div className="shrink-0">
                                <a href={pub.url} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-white">
                                    <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                                    </svg>
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
