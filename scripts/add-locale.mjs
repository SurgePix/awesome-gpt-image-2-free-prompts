/* Helper: writes data/i18n/<code>.json and merges the locale's UI strings into
   data/ui.json. Each locale file under scripts/locales/ default-exports { code,
   i18n, ui }. Structure is validated against the English baseline so a new
   locale can't ship with a missing or extra field. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const enI18n = readJson('data/i18n/en.json');
const enUi = readJson('data/ui.json').en;

function validate(code, i18n, ui) {
  const errs = [];
  const keys = (o) => Object.keys(o).sort().join(',');
  if (keys(i18n) !== keys(enI18n)) errs.push(`i18n keys differ from en`);
  if (keys(ui) !== keys(enUi)) errs.push(`ui keys differ from en`);
  const counts = { features: 8, categoryGrid: 12, categories: 10, featured: 8, toolNames: 11 };
  for (const [k, n] of Object.entries(counts)) {
    if (i18n[k]?.length !== n) errs.push(`${k}: expected ${n}, got ${i18n[k]?.length}`);
  }
  i18n.categories.forEach((c, i) => {
    if (c.items.length !== enI18n.categories[i].items.length)
      errs.push(`categories[${i}].items: expected ${enI18n.categories[i].items.length}, got ${c.items.length}`);
  });
  if (errs.length) { console.error(`✗ ${code}:\n  ` + errs.join('\n  ')); process.exit(1); }
}

export function addLocale({ code, i18n, ui }) {
  validate(code, i18n, ui);
  fs.writeFileSync(path.join(root, `data/i18n/${code}.json`), JSON.stringify(i18n, null, 2) + '\n');
  const all = readJson('data/ui.json');
  all[code] = ui;
  fs.writeFileSync(path.join(root, 'data/ui.json'), JSON.stringify(all, null, 2) + '\n');
  console.log(`✓ ${code}: i18n + ui written`);
}
