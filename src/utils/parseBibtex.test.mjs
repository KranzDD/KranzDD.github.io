import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import { parseBibtex } from './parseBibtex.ts';

const bibliography = readFileSync(new URL('../assets/publications.bib', import.meta.url), 'utf8');
const publications = parseBibtex(bibliography);

test('nested LaTeX accents preserve complete author names and lists', () => {
  const ecgen = publications.find((pub) => pub.id === 'kranz2026exploring');
  assert.match(ecgen.author, /Krämer, Jan F/);
  assert.match(ecgen.author, /Oruç/);
  assert.match(ecgen.author, /Meisel, Christian$/);
  const proceedings = publications.find((pub) => pub.id === 'park2024current');
  assert.match(proceedings.author, /Rieß, JC and Kim, SW/);
  assert.match(proceedings.author, /Landmesser, U and others$/);
  assert.equal(publications.some((pub) => /[\\{}]/.test(pub.author + pub.venue)), false);
});

test('bibliography has unique works, valid links, and linked earlier versions', () => {
  assert.equal(publications.length, 11);
  assert.equal(new Set(publications.map((pub) => pub.url)).size, publications.length);
  for (const pub of publications) {
    assert.ok(pub.title && pub.author && pub.year && pub.venue);
    assert.equal(new URL(pub.url).protocol, 'https:');
    assert.equal(parseBibtex(pub.bibtex)[0].author, pub.author);
  }
  assert.equal(publications.find((pub) => pub.id === 'kranz2026selfsupervised').preprint, 'https://doi.org/10.64898/2025.11.30.25341301');
  assert.equal(publications.some((pub) => pub.id === 'kranz2025deep'), false);
  assert.equal(publications.find((pub) => pub.id === 'krumm2026between').type, 'Preprint');
  assert.equal(publications.find((pub) => pub.id === 'dischl2025abstract').type, 'Conference abstract');
});

test('sorts by final publication date, including day within a month', () => {
  assert.deepEqual(publications.slice(0, 3).map((pub) => pub.id), ['krumm2026between', 'kranz2026selfsupervised', 'kranz2026exploring']);
  assert.deepEqual([...new Set(publications.map((pub) => pub.year))], ['2026', '2025', '2024']);
});

test('handles quoted titles, multiline fields, numeric months, and DOI fallback', () => {
  const [pub] = parseBibtex('@article{example, title="A {nested} title", author={One, A and\nTwo, B}, year=2026, month=10, journal={Test}, doi={10.1234/test}}');
  assert.equal(pub.title, 'A nested title');
  assert.equal(pub.author, 'One, A and Two, B');
  assert.equal(pub.month, '10');
  assert.equal(pub.url, 'https://doi.org/10.1234/test');
  assert.throws(() => parseBibtex('@article{broken, title={Unclosed'), /Unclosed/);
});
