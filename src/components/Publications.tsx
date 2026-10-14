import type { Publication } from '../utils/parseBibtex';

function Authors({ author }: { author: string }) {
  return author.split(/\s+and\s+/).map((name, index) => {
    const [family, given] = name.split(',').map((part) => part.trim());
    const displayName = family === 'others' ? 'et al.' : given ? `${given} ${family}` : family;
    return <span key={`${index}-${name}`}>{index > 0 && ', '}{family === 'Kranz' ? <strong>{displayName}</strong> : displayName}</span>;
  });
}

export default function Publications({ publications, scholarUrl }: { publications: Publication[]; scholarUrl: string }) {
  const years = [...new Set(publications.map((pub) => pub.year))];
  return (
    <section id="publications" className="container section publications-section" aria-labelledby="publications-title">
      <div className="section-heading">
        <div><p className="eyebrow">Publications & preprints</p><h2 id="publications-title">The work, in detail</h2></div>
        <a className="text-link" href={scholarUrl}>View Google Scholar <span aria-hidden="true">↗</span></a>
      </div>
      <p className="section-note">Newest first. Earlier preprints are linked with their published articles.</p>
      {years.map((year) => (
        <div className="publication-year" key={year}>
          <h3 className="year-label">{year}</h3>
          <ol className="publication-list" aria-label={`Publications from ${year}`}>
            {publications.filter((pub) => pub.year === year).map((pub) => (
              <li key={pub.id}>
                <article className="publication" aria-labelledby={`${pub.id}-title`}>
                  <div className="publication-meta"><span className={`publication-type${pub.type === 'Preprint' ? ' preprint' : ''}`}>{pub.type}</span><span>{pub.venue}{pub.volume && ` ${pub.volume}`}{pub.number && `(${pub.number})`}{pub.pages && `, ${pub.pages}`}</span></div>
                  <h4 id={`${pub.id}-title`}><a href={pub.url}>{pub.title}</a></h4>
                  <p className="authors"><Authors author={pub.author} /></p>
                  {pub.note && <p className="publication-note">{pub.note}</p>}
                  <div className="publication-actions">
                    <a href={pub.url} aria-label={`Read ${pub.type === 'Preprint' ? 'preprint' : 'paper'}: ${pub.title}`}>{pub.type === 'Preprint' ? 'Preprint' : 'Paper'} <span aria-hidden="true">↗</span></a>
                    {pub.preprint && <a href={pub.preprint} aria-label={`Earlier preprint of ${pub.title}`}>Earlier preprint <span aria-hidden="true">↗</span></a>}
                    <details className="citation">
                      <summary aria-label={`Show BibTeX citation for ${pub.title}`}>BibTeX</summary>
                      <pre tabIndex={0} aria-label={`BibTeX citation for ${pub.title}`}>{pub.bibtex}</pre>
                    </details>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      ))}
    </section>
  );
}
