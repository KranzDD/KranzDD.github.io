export type Publication = {
  id: string;
  title: string;
  author: string;
  year: string;
  venue: string;
  url: string;
  month: string;
  day: string;
  type: string;
  volume: string;
  number: string;
  pages: string;
  note: string;
  preprint: string;
  bibtex: string;
};

function cleanLatex(text: string): string {
  const accents: Record<string, string> = { '"': '\u0308', "'": '\u0301', '`': '\u0300', '^': '\u0302', '~': '\u0303', c: '\u0327' };
  return text
    .replace(/\\(["'`^~c])\s*\{?([A-Za-z])\}?/g, (_, accent: string, letter: string) => (letter + accents[accent]).normalize('NFC'))
    .replace(/\\ss\b/g, 'ß')
    .replace(/\\&/g, '&')
    .replace(/[{}]/g, '')
    .replace(/--/g, '–')
    .replace(/\s+/g, ' ')
    .trim();
}

// Read balanced fields so braces in names cannot truncate an author list.
// Supports the braced, quoted and bare values used in this bibliography.
export function parseBibtex(content: string): Publication[] {
  const entries: Publication[] = [];
  const start = /@(\w+)\s*\{\s*([^,]+),/g;
  let match: RegExpExecArray | null;
  while ((match = start.exec(content))) {
    const fields: Record<string, string> = {};
    let cursor = start.lastIndex;
    while (cursor < content.length) {
      while (/[\s,]/.test(content[cursor] ?? '') && cursor < content.length) cursor++;
      if (content[cursor] === '}') { cursor++; break; }
      const field = /^([\w-]+)\s*=\s*/.exec(content.slice(cursor));
      if (!field) throw new Error(`Invalid BibTeX field in ${match[2]}`);
      cursor += field[0].length;
      const opener = content[cursor];
      let value = '';
      if (opener === '{' || opener === '"') {
        cursor++;
        const valueStart = cursor;
        let depth = opener === '{' ? 1 : 0;
        for (; cursor < content.length; cursor++) {
          const char = content[cursor];
          if (char === '\\') { cursor++; continue; }
          if (char === '{') depth++;
          if (char === '}') depth--;
          if ((opener === '{' && depth === 0) || (opener === '"' && char === '"' && depth === 0)) break;
        }
        if (cursor === content.length) throw new Error(`Unclosed BibTeX value in ${match[2]}`);
        value = content.slice(valueStart, cursor++);
      } else {
        const valueStart = cursor;
        while (cursor < content.length && !/[,}\r\n]/.test(content[cursor])) cursor++;
        value = content.slice(valueStart, cursor);
      }
      fields[field[1].toLowerCase()] = value.trim();
    }
    const get = (key: string) => cleanLatex(fields[key] ?? '');
    const venue = get('journal') || get('booktitle') || get('publisher');
    const type = get('entrysubtype') || (venue === 'medRxiv' ? 'Preprint' : match[1].toLowerCase() === 'article' ? 'Journal article' : 'Conference contribution');
    // Site-only relationship/type fields are excluded from the export.
    const bibtexFields = Object.entries(fields).filter(([key]) => !['preprint', 'entrysubtype', 'day'].includes(key));
    const bibtex = `@${match[1]}{${match[2].trim()},\n${bibtexFields.map(([key, value]) => `  ${key} = {${value}}`).join(',\n')}\n}`;
    entries.push({
      id: match[2].trim(), title: get('title'), author: get('author'), year: get('year'),
      month: get('month'), day: get('day'), venue, type, volume: get('volume'), number: get('number'),
      pages: get('pages'), note: get('note'), preprint: fields.preprint ?? '',
      url: fields.url || (fields.doi ? `https://doi.org/${fields.doi}` : ''), bibtex,
    });
    start.lastIndex = cursor;
  }
  const monthNumber = (month: string) => {
    const index = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(month.toLowerCase().slice(0, 3));
    return index >= 0 ? index + 1 : Number(month) || 0;
  };
  return entries.sort((a, b) => Number(b.year) - Number(a.year) || monthNumber(b.month) - monthNumber(a.month) || Number(b.day) - Number(a.day) || a.title.localeCompare(b.title));
}
