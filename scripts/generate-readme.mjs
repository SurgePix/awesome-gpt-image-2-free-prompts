/**
 * Regenerates README.md and every README_<locale>.md from data/.
 *
 * Everything that isn't language-specific — prompt text, image URLs, links,
 * the prompt count — lives once in data/content.json. Each locale contributes
 * only its own strings. Run after touching either:
 *
 *   npm run generate
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readJson = (p) => JSON.parse(fs.readFileSync(path.join(root, p), 'utf8'));

const content = readJson('data/content.json');
const { links, imagesByLocale, promptCount, featured, tools } = content;

const LOCALES = [
  { code: 'en', file: 'README.md', label: 'English', flag: '🇺🇸', badge: 'EN' },
  { code: 'zh', file: 'README_zh.md', label: '简体中文', flag: '🇨🇳', badge: 'ZH' },
  { code: 'zh-Hant', file: 'README_zh-Hant.md', label: '繁體中文', flag: '🇭🇰', badge: 'ZH-HANT' },
  { code: 'ja', file: 'README_ja.md', label: '日本語', flag: '🇯🇵', badge: 'JA' },
  { code: 'ko', file: 'README_ko.md', label: '한국어', flag: '🇰🇷', badge: 'KO' },
  { code: 'th', file: 'README_th.md', label: 'ไทย', flag: '🇹🇭', badge: 'TH' },
  { code: 'id', file: 'README_id.md', label: 'Bahasa Indonesia', flag: '🇮🇩', badge: 'ID' },
  { code: 'vi', file: 'README_vi.md', label: 'Tiếng Việt', flag: '🇻🇳', badge: 'VI' },
  { code: 'de', file: 'README_de.md', label: 'Deutsch', flag: '🇩🇪', badge: 'DE' },
  { code: 'fr', file: 'README_fr.md', label: 'Français', flag: '🇫🇷', badge: 'FR' },
  { code: 'es', file: 'README_es.md', label: 'Español', flag: '🇪🇸', badge: 'ES' },
  { code: 'tr', file: 'README_tr.md', label: 'Türkçe', flag: '🇹🇷', badge: 'TR' },
  { code: 'pl', file: 'README_pl.md', label: 'Polski', flag: '🇵🇱', badge: 'PL' },
];

const galleryUrl = (code) =>
  code === 'en' ? links.gallery : `https://surgepix.ai/resources/${code}/gpt-image-2-prompts`;

/* Resource pages exist per locale, so sibling links (the PPT library in the
   tools table) should point at the reader's language too. */
const localiseResource = (url, code) =>
  code === 'en' ? url : url.replace('/resources/', `/resources/${code}/`);

/** Section headings, labels and standing prose, per locale. English fills gaps. */
const UI = readJson('data/ui.json');

function langRow(current) {
  return LOCALES.map(({ code, file, label, badge }) => {
    const colour = code === current ? 'brightgreen' : 'lightgrey';
    const text = encodeURIComponent(label);
    return `[![${badge}](https://img.shields.io/badge/${badge}-${text}-${colour}?style=flat-square)](${code === current ? '#' : file})`;
  }).join('\n');
}

function render(code) {
  const t = { ...UI.en, ...(UI[code] ?? {}) };
  const s = readJson(`data/i18n/${code}.json`);
  const gallery = galleryUrl(code);
  // each locale has its own banner and poster artwork
  const images = imagesByLocale[code] ?? imagesByLocale.en;

  const categories = s.categories.map((c) => `<details>
<summary><b>${c.title}</b> — ${c.blurb}</summary>

${c.items.map((i) => `- ${i}`).join('\n')}

</details>`).join('\n\n');

  const grid = `<table>
${[0, 4, 8].map((i) => `<tr>
${s.categoryGrid.slice(i, i + 4).map((c) => `<td>${c}</td>`).join('\n')}
</tr>`).join('\n')}
</table>`;

  const featuredBlocks = featured.map((f, i) => {
    const meta = s.featured[i] ?? {};
    return `<details>
<summary><b>No.${i + 1} · ${meta.title ?? ''}</b></summary>

${f.badges.map((b) => `![${b.alt}](${b.src})`).join(' ')}

**${t.labelDescription}** ${meta.description ?? ''}

**${t.labelPreview}**
<img src="${f.preview}" width="400" />

**${t.labelPrompt}**
\`\`\`
${f.prompt}
\`\`\`

[**→ ${t.ctaGenerate}**](${links.site})

</details>`;
  }).join('\n\n---\n\n');

  const toolRows = tools.map((tool, i) => {
    const url = tool.url.includes('/resources/') ? localiseResource(tool.url, code) : tool.url;
    return `| ${s.toolNames[i] ?? tool.name} | [${s.toolLinkLabel}](${url}) |`;
  }).join('\n');

  return `<div align="center">

<img src="${images.banner}" alt="awesome-gpt-image-2-free-prompts" style="max-width: 100%;" />

</div>

## 🎨 ${t.title}
[![Awesome](https://awesome.re/badge.svg)](https://awesome.re)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![GitHub stars](https://img.shields.io/github/stars/SurgePix/awesome-gpt-image-2-free-prompts?style=social)](${links.repo})

**${s.tagline}**
${t.subtitle}

${langRow(code)}

[![${t.badgePrompts}](https://img.shields.io/badge/${encodeURIComponent(t.badgePrompts)}-${encodeURIComponent(promptCount)}-ff6b6b?style=flat-square)](${gallery})
[![${t.badgeLanguages}](https://img.shields.io/badge/${encodeURIComponent(t.badgeLanguages)}-${LOCALES.length}-45b7d1?style=flat-square)](#-${t.headingMultilingual.toLowerCase().replace(/[^a-z0-9]+/g, '-')})
[![License](https://img.shields.io/badge/License-MIT-a8e6cf?style=flat-square)](LICENSE)
[![Website](https://img.shields.io/badge/Website-surgepix.ai-ff8b94?style=flat-square)](${gallery})

> ${s.intro.replace('{count}', promptCount)}

[**→ ${t.ctaBrowse}**](${gallery})

[![GPT-Image-2 Prompt Library Preview](${images.poster})](${gallery})

---

## ✨ ${t.headingFeatures}

| ${t.tableFeature} | ${t.tableDescription} |
|---|---|
${s.features.map((f) => `| ${f.icon} **${f.name}** | ${f.desc} |`).join('\n')}

---

## 🗂️ ${t.headingCategories}

${grid}

${categories}

---

## 🔥 ${t.headingFeatured}

⭐ ${t.featuredNote} — [${t.ctaBrowseAll} ${promptCount}](${gallery})

---

${featuredBlocks}

---

## 🌍 ${t.headingMultilingual}

${t.multilingualIntro}

${LOCALES.map(({ flag, label, file, code: c }) =>
  `- ${flag} [${label}](${c === code ? '#' : file})`).join('\n')}

---

## 🚀 ${t.headingHowToUse}

${t.howToUse.replace('{gallery}', gallery)}

---

## 🔗 ${t.headingSourceTracing}

${t.sourceTracing}

---

## 📌 ${t.headingAbout}

${t.about}

${t.learnMore}: [${t.guideTitle}](${links.guide})

---

## 🛠️ ${t.headingTools}

| ${t.tableTool} | ${t.tableLink} |
|---|---|
${toolRows}

---

## 📬 ${t.headingStayUpdated}

- ${t.followX} [X / Twitter](${links.x})
- ${t.joinDiscord} [Discord](${links.discord})
- ${t.visit} [surgepix.ai](${links.site})

---

<div align="center">

${t.footer}

</div>
`;
}

for (const { code, file } of LOCALES) {
  if (!fs.existsSync(path.join(root, `data/i18n/${code}.json`))) {
    console.log(`${file.padEnd(22)} skipped — no data/i18n/${code}.json yet`);
    continue;
  }
  const out = render(code);
  fs.writeFileSync(path.join(root, file), out);
  console.log(`${file.padEnd(22)} ${(Buffer.byteLength(out) / 1024).toFixed(1)} KB`);
}
