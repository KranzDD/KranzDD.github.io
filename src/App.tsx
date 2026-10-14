import dominikImg from './assets/dominik.png';
import Publications from './components/Publications';
import HeroAtmosphere from './components/HeroAtmosphere';
import bibContent from './assets/publications.bib?raw';
import { parseBibtex } from './utils/parseBibtex';

const scholarUrl = 'https://scholar.google.com/citations?user=Fs0ANr0AAAAJ&hl=en';
const publications = parseBibtex(bibContent);
const selectedResearch = [
  {
    id: 'kranz2026selfsupervised', signal: 'MCG', topic: 'Representation learning',
    title: 'Learning the structure of cardiac signals',
    description: 'MCG2Vec learns representations from multichannel magnetocardiography. We investigate how these representations capture cardiac physiology across coronary, ventricular, and rhythm-related tasks.',
  },
  {
    id: 'kranz2026exploring', signal: 'ECG', topic: 'Generative modeling',
    title: 'Generating ECGs on the minute scale',
    description: 'ECGEN explores latent diffusion for ECG generation and inpainting, from short rhythm-specific recordings to minute-scale signals. The work also examines the limits of long-duration generation.',
  },
  {
    id: 'krumm2025toward', signal: 'EEG', topic: 'Clinical interpretation',
    title: 'A shared map of brain activity',
    description: 'The Universal Map of EEG places recordings in a shared representation space, connecting recognizable brain activity patterns with classification, clustering, and prognostication.',
  },
];

export default function App() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <header className="site-header">
        <div className="container header-inner">
          <a className="wordmark" href="#about" aria-label="Dominik D. Kranz — introduction">Dominik D. Kranz<span aria-hidden="true">.</span></a>
          <nav aria-label="Main navigation">
            <a href="#research">Research</a>
            <a href="#publications">Publications</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>
      <main id="main">
        <section id="about" className="hero-stage" aria-labelledby="intro-title">
          <HeroAtmosphere />
          <div className="container hero">
          <div className="hero-copy">
            <p className="eyebrow">Medical AI researcher · Berlin</p>
            <h1 id="intro-title">Dominik D. Kranz</h1>
            <p className="hero-statement">Understanding clinical signals<br className="desktop-break" /> through <span>machine learning.</span></p>
            <p className="intro">I develop representation learning and generative models for EEG, ECG, MCG, and ICU time series, with a focus on clinically meaningful representations and rigorous validation.</p>
            <p className="affiliations">Charité – Universitätsmedizin Berlin<br />Berlin Institute of Health</p>
            <div className="hero-actions">
              <a className="button button-primary" href="#publications">Explore publications <span aria-hidden="true">↓</span></a>
              <a className="text-link" href={scholarUrl}>Google Scholar <span aria-hidden="true">↗</span></a>
            </div>
          </div>
          <div className="portrait-frame">
            <img src={dominikImg} alt="Dominik D. Kranz" width="360" height="420" fetchPriority="high" />
            <div className="portrait-caption"><span className="status-dot" aria-hidden="true" />Clinical signals. Meaningful representations.</div>
          </div>
          </div>
        </section>
        <section id="research" className="container section research-section" aria-labelledby="research-title">
          <div className="section-heading">
            <div><p className="eyebrow">Selected research</p><h2 id="research-title">From signals to understanding</h2></div>
            <p>I work across cardiac and neural signals, connecting advances in machine learning with questions from clinical practice.</p>
          </div>
          <div className="research-grid">
            {selectedResearch.map((research) => {
              const publication = publications.find((pub) => pub.id === research.id)!;
              return (
                <article className="research-card" key={research.id}>
                  <div className="research-card-top"><span className="signal-label">{research.signal}</span><span>{research.topic}</span></div>
                  <h3>{research.title}</h3>
                  <p>{research.description}</p>
                  <div className="research-card-footer">
                    <p>{publication.venue} · {publication.year}</p>
                    <a className="text-link" href={publication.url} aria-label={`Read paper: ${publication.title}`}>Read paper <span aria-hidden="true">↗</span></a>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
        <Publications publications={publications} scholarUrl={scholarUrl} />
      </main>
      <footer id="contact" className="container contact" aria-labelledby="contact-title">
        <div><p className="eyebrow">Contact</p><h2 id="contact-title">Let’s connect.</h2><p>For research questions and potential collaborations.</p></div>
        <div className="contact-links">
          <a className="email-link" href="mailto:dominik-dirk.kranz@charite.de">dominik-dirk.kranz@charite.de <span aria-hidden="true">↗</span></a>
          <a className="text-link" href={scholarUrl}>Google Scholar <span aria-hidden="true">↗</span></a>
        </div>
        <div className="footer-meta"><span>Dominik D. Kranz · Berlin</span><a href="#about">Back to top ↑</a></div>
      </footer>
    </>
  );
}
