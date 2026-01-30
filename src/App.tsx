import { useEffect, useMemo, useState } from "react";
import bannerImg from "./assets/banner.png";
import dominikImg from "./assets/dominik.png";
import Publications from "./components/Publications";

type NavItem = {
  label: string;
  href: string;
};

type FocusCard = {
  title: string;
  description: string;
  icon: "wave" | "spark" | "globe" | "clinic";
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

function Icon({ name }: { name: FocusCard["icon"] }) {
  const common = "h-5 w-5 text-sky-200";
  switch (name) {
    case "wave":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M2 12h3l2-6 4 12 3-9 2 3h4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    case "spark":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 2l1.2 4.6L18 8l-4.8 1.4L12 14l-1.2-4.6L6 8l4.8-1.4L12 2z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M5 14l.8 3L9 18l-3.2 1-.8 3-.8-3L1 17l3.2-1L5 14z"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            opacity="0.8"
          />
        </svg>
      );
    case "globe":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 22a10 10 0 100-20 10 10 0 000 20z"
            stroke="currentColor"
            strokeWidth="1.7"
          />
          <path
            d="M2 12h20"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            opacity="0.9"
          />
          <path
            d="M12 2c3 2.6 5 6.2 5 10s-2 7.4-5 10c-3-2.6-5-6.2-5-10S9 4.6 12 2z"
            stroke="currentColor"
            strokeWidth="1.7"
            opacity="0.85"
          />
        </svg>
      );
    case "clinic":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 20V6a2 2 0 012-2h12a2 2 0 012 2v14"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
          />
          <path
            d="M9 20v-6h6v6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinejoin="round"
            opacity="0.9"
          />
          <path
            d="M12 7v4m-2-2h4"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
          />
        </svg>
      );
    default:
      return null;
  }
}

function Button({
  href,
  children,
  variant = "primary",
}: {
  href?: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
}) {
  const base =
    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-medium transition focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400/60 focus-visible:ring-offset-0";
  const styles =
    variant === "primary"
      ? "bg-sky-500/20 text-sky-100 ring-1 ring-sky-400/30 hover:bg-sky-500/28 hover:ring-sky-300/40"
      : "bg-white/0 text-slate-100 ring-1 ring-white/10 hover:bg-white/5 hover:ring-white/15";
  const cls = cn(base, styles);

  if (href) {
    return (
      <a href={href} className={cls}>
        {children}
      </a>
    );
  }
  return <button className={cls}>{children}</button>;
}

function SectionTitle({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight text-slate-100">{title}</h2>
        {subtitle ? (
          <p className="mt-1 text-sm text-slate-300/80">{subtitle}</p>
        ) : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

export default function App() {
  const nav: NavItem[] = useMemo(
    () => [
      { label: "Research", href: "#about" },
      { label: "Publications", href: "#publications" },
      { label: "Contact", href: "#contact" },
    ],
    []
  );

  const focusCards: FocusCard[] = useMemo(
    () => [
      {
        title: "Clinical Signal AI",
        description: "ECG, EEG, ICU waveforms",
        icon: "wave",
      },
      {
        title: "Generative Models",
        description: "Diffusion, self-supervised learning",
        icon: "spark",
      },
      {
        title: "Multicenter Validation",
        description: "Robust medical AI",
        icon: "globe",
      },
      {
        title: "Translational Research",
        description: "From signals to clinics",
        icon: "clinic",
      },
    ],
    []
  );

  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-dvh bg-[#070a10] text-slate-100">
      {/* Background */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_700px_at_10%_-10%,rgba(56,189,248,0.20),transparent_60%),radial-gradient(900px_500px_at_90%_10%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(800px_600px_at_50%_110%,rgba(99,102,241,0.12),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.13] [background-image:linear-gradient(rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:48px_48px]" />
        <div className="absolute inset-0 bg-noise opacity-[0.22]" />
      </div>

      {/* Header */}
      <header
        className={cn(
          "sticky top-0 z-50 border-b border-white/5 backdrop-blur supports-[backdrop-filter]:bg-black/20",
          scrolled && "bg-black/35"
        )}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <a href="#" className="text-base font-semibold tracking-tight text-slate-100">
            Dominik D. Kranz
          </a>

          <nav className="hidden items-center gap-6 md:flex">
            {nav.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-sm text-slate-200/80 hover:text-slate-100 transition"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="w-full">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/5 bg-white/2 py-24 md:py-48">
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={bannerImg}
              alt=""
              className="h-full w-full object-cover object-center"
              loading="eager"
              decoding="async"
            />
          </div>

          {/* Content */}
          <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 px-6 md:grid-cols-2">
            <div className="rounded-3xl border border-sky-500/10 bg-slate-900/50 p-8 shadow-[0_0_40px_-10px_rgba(14,165,233,0.15)]">
              <p className="text-sm font-medium text-slate-300/90">Medical AI Researcher</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-50 md:text-5xl">
                Artificial Intelligence for <span className="text-sky-200">Clinical Signals</span>
              </h1>
              <p className="mt-4 max-w-prose text-base leading-relaxed text-slate-200/80">
                Representation learning and generative modeling of EEG, ECG, MCG, and ICU time series
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <Button href="#publications" variant="primary">
                  View Publications
                </Button>
                <Button href="https://github.com/" variant="ghost">
                  GitHub
                </Button>
              </div>
            </div>

            {/* Right column stays empty on desktop (image is background); but keep structure */}
            <div className="hidden md:block" />
          </div>
        </section>

        {/* About (moved above Research Focus) */}
        <section id="about" className="mx-auto max-w-[1600px] px-6 py-10">
          <div className="grid gap-12 md:grid-cols-2 items-start">
            <div className="relative">
              <img
                src={dominikImg}
                alt="Dominik D. Kranz"
                className="float-left mr-6 mb-4 h-48 w-48 border-white/30 rounded-full border-4 border-slate-900/50 object-cover object-[50%_0%] shadow-2xl shadow-sky-900/20 ring-1 ring-white/10"
              />
              <p className="text-lg leading-relaxed tracking-wide text-white/70 max-w-prose">
                I work on artificial intelligence methods for interpreting clinical time-series data, with a
                focus on electrophysiological signals such as{" "}
                <span className="text-xl font-medium text-sky-300/90">EEG</span>,{" "}
                <span className="text-xl font-medium text-sky-300/90">ECG</span>,{" "}
                <span className="text-xl font-medium text-sky-300/90">MCG</span>, and{" "}
                <span className="text-xl font-medium text-sky-300/90">ICU waveforms</span>.{" "}
                My research centers on{" "}
                <span className="font-medium text-sky-200/90">
                  self-supervised representation learning
                </span>{" "}
                and{" "}
                <span className="font-medium text-sky-200/90">
                  generative modeling
                </span>{" "}
                approaches that can leverage large-scale routine clinical recordings while remaining
                robust across heterogeneous patient cohorts and measurement settings. A central goal of
                this work is to bridge methodological advances in deep learning with rigorous
                clinical validation, enabling models that generalize across centers and support
                translational use. I currently pursue my work at <span className="text-xl font-medium text-sky-300/90">Charité - Universitätsmedizin Berlin</span>, and the <span className="text-xl font-medium text-sky-300/90">Berlin Institute of Health</span>.

              </p>
            </div>

            {/* Highlighted publication */}
            <div className="flex flex-col gap-4">
              <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10">
                <div className="absolute -inset-px rounded-2xl border-2 border-transparent bg-gradient-to-b from-sky-500/20 to-transparent opacity-0 transition group-hover:opacity-100" />
                <div className="relative">
                  <div className="text-sm font-medium text-sky-300">Recent Publication</div>
                  <h3 className="mt-2 text-lg font-semibold text-slate-100 group-hover:text-white">
                    Exploring Latent Diffusion Models for ECG Generation on the Minute Scale
                  </h3>
                  <p className="mt-1 text-sm text-slate-400">
                    Kranz DD, et al. · <span className="text-slate-300">Computer Methods and Programs in Biomedicine (2025)</span>
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                      Diffusion Models
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-300">
                      ECG
                    </span>
                  </div>
                  <a href="https://doi.org/10.1016/j.cmpb.2025.109138" target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-sky-200 hover:text-sky-100 transition">
                    Read Paper <span aria-hidden="true">&rarr;</span>
                  </a>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <div className="text-2xl font-semibold text-sky-300">Why it matters</div>
                <p className="text-lg leading-relaxed tracking-wide text-white/70">
                  This paper introduces <span className="font-medium text-sky-200/90">ECGEN</span>, a <span className="font-medium text-sky-200/90">next-generation diffusion model</span> that pushes generative AI beyond short snippets toward <span className="font-medium text-sky-200/90">minute-scale physiological signals</span>. By synthesizing realistic, <span className="font-medium text-sky-200/90">long-duration ECGs</span> and enabling tasks like <span className="font-medium text-sky-200/90">inpainting</span> and <span className="font-medium text-sky-200/90">signal restoration</span>, ECGEN explores how <span className="font-medium text-sky-200/90">foundation-style generative models</span> could reshape data availability, robustness, and evaluation in clinical AI.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Publications */}
        <Publications />

        {/* Footer */}
        <footer id="contact" className="mx-auto max-w-7xl px-6 py-10">
          <div className="h-px w-full bg-white/8" />
          <div className="mt-6 flex flex-col gap-2 text-xs text-slate-200/60 sm:flex-row sm:items-center sm:justify-between">
            <div>Berlin · Medical AI</div>
            {/* <div className="text-slate-200/50">Built with React · Vite · Tailwind · TypeScript</div> */}
          </div>
        </footer>
      </main>
    </div >
  );
}
