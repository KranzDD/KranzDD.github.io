
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
                    Sorted chronologically
                </p>
            </div>

            <div className="space-y-6">
                {publications.map((pub) => (
                    <div
                        key={pub.id}
                        className="group relative flex flex-col gap-2 rounded-2xl border border-white/5 bg-white/5 p-6 transition hover:border-white/10 hover:bg-white/10 sm:flex-row sm:items-center sm:gap-6"
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

                        {/* Link to paper */}
                        {pub.url && (
                            <div className="mt-4 sm:mt-0 shrink-0">
                                <a
                                    href={pub.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white hover:border-white/20 group/link"
                                >
                                    Read Paper <span aria-hidden="true" className="group-hover/link:translate-x-0.5 transition-transform">&rarr;</span>
                                </a>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
