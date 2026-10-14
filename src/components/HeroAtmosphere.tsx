import { useEffect, useRef, useState } from 'react';

const tileWidth = 1440;

// Decorative, synthetic waveforms; these are not patient recordings.
function signalPath(kind: 'ecg' | 'eeg' | 'slow', baseline: number) {
  return Array.from({ length: tileWidth / 2 + 1 }, (_, index) => {
    const x = index * 2;
    const phase = (x % 288) / 288;
    const bump = (center: number, width: number, height: number) => height * Math.exp(-(((phase - center) / width) ** 2));
    const angle = x / tileWidth * Math.PI * 2;
    const amplitude = kind === 'ecg'
      ? bump(.22, .035, 8) - bump(.385, .012, 10) + bump(.415, .009, 65) - bump(.445, .018, 21) + bump(.64, .07, 17)
      : kind === 'eeg'
        ? (Math.sin(angle * 37) * 8 + Math.sin(angle * 61) * 4 + Math.sin(angle * 17) * 7) * (.7 + .3 * Math.cos(angle * 3))
        : Math.sin(angle * 5) * 16 + Math.sin(angle * 10 + .4) * 5;
    return `${index ? 'L' : 'M'}${x},${(baseline - amplitude).toFixed(2)}`;
  }).join(' ');
}

const signals = [
  { name: 'eeg', path: signalPath('eeg', 140) },
  { name: 'slow', path: signalPath('slow', 310) },
  { name: 'ecg', path: signalPath('ecg', 480) },
];
const fragments = [
  { x: 700, y: 35, scale: .9 },
  { x: 1150, y: 210, scale: 1.1 },
  { x: 660, y: 385, scale: .7 },
];
const nodes = [[0, 42], [56, 0], [92, 72], [145, 28], [188, 98], [65, 130], [240, 52]];
const edges = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [2, 5], [3, 4], [3, 6], [4, 6], [4, 5]];

export default function HeroAtmosphere() {
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState(true);
  const background = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let inView = true;
    const update = () => setActive(inView && !document.hidden);
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      update();
    });
    if (background.current) observer.observe(background.current);
    document.addEventListener('visibilitychange', update);
    update();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', update);
    };
  }, []);

  return (
    <>
      <div className="hero-atmosphere" ref={background} aria-hidden="true" data-paused={paused || !active}>
        <div className="atmosphere-glow" />
        <svg className="atmosphere-svg" viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" focusable="false">
          {signals.map((signal) => (
            <g key={signal.name} className={`signal-track signal-${signal.name}`}>
              {[0, tileWidth].map((offset) => (
                <g key={offset} transform={`translate(${offset} 0)`}>
                  <path className="signal-halo" d={signal.path} />
                  <path className="signal-line" d={signal.path} />
                </g>
              ))}
            </g>
          ))}
          <g className="network-track">
            {[0, tileWidth].map((offset) => (
              <g key={offset} transform={`translate(${offset} 0)`}>
                {fragments.map((fragment, index) => (
                  <g key={index} transform={`translate(${fragment.x} ${fragment.y}) scale(${fragment.scale})`}>
                    <g className={`network-fragment fragment-${index}`}>
                      {edges.map(([a, b]) => <line key={`${a}-${b}`} x1={nodes[a][0]} y1={nodes[a][1]} x2={nodes[b][0]} y2={nodes[b][1]} />)}
                      {nodes.map(([x, y], node) => (
                        <g key={node}>
                          <circle className="node-halo" cx={x} cy={y} r="8" />
                          <circle className="network-node" cx={x} cy={y} r={node === 2 ? 3 : 2} />
                        </g>
                      ))}
                    </g>
                  </g>
                ))}
              </g>
            ))}
          </g>
        </svg>
      </div>
      <button className="atmosphere-control" type="button" aria-pressed={paused} aria-label="Pause background animation" onClick={() => setPaused(!paused)}>
        <svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
          {paused ? <path d="M4 2l9 6-9 6z" fill="currentColor" /> : <path d="M5 3v10M11 3v10" stroke="currentColor" strokeWidth="2" />}
        </svg>
        {paused ? 'Resume motion' : 'Pause motion'}
      </button>
    </>
  );
}
