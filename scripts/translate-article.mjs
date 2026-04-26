#!/usr/bin/env node
// translate-article.mjs
// Translates Korean articles to English via DeepSeek V3.2 (NVIDIA NIM API)
// Outputs to src/content/articles-en/{slug}.md
//
// Usage:
//   node translate-article.mjs <slug>          # translate one article
//   node translate-article.mjs --top N         # translate top N newest
//   node translate-article.mjs --all           # translate all missing
//   node translate-article.mjs <slug> --force  # re-translate

import https from 'https';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_DIR  = path.join(__dirname, '..');
const KO_DIR    = path.join(SITE_DIR, 'src/content/articles');
const EN_DIR    = path.join(SITE_DIR, 'src/content/articles-en');
const ENV_FILE  = 'C:/Users/jkc30/.openclaw/.env';

fs.mkdirSync(EN_DIR, { recursive: true });

// ── Config ──────────────────────────────────────────────────────────────────

function loadEnv() {
  const map = {};
  for (const line of fs.readFileSync(ENV_FILE, 'utf8').split('\n')) {
    const m = line.match(/^([A-Z_]+)=(.+)$/);
    if (m) map[m[1]] = m[2].trim();
  }
  return map;
}

const API_KEY = loadEnv().NVIDIA_NIM_API_KEY;
if (!API_KEY) { console.error('NVIDIA_NIM_API_KEY not found in .env'); process.exit(1); }

// ── Category mapping ─────────────────────────────────────────────────────────

const CAT_MAP = {
  'AI 심리학':    'AI Psychology',
  '인지 융합':    'Cognitive Synthesis',
  'AI 기술':      'AI Technology',
  '에이전트':     'Agent Systems',
  'LLM 아키텍처': 'LLM Architecture',
};

// ── Frontmatter parser ───────────────────────────────────────────────────────

function parseFrontmatter(content) {
  const m = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!m) throw new Error('No frontmatter found');
  const fields = {};
  for (const line of m[1].split('\n')) {
    const lm = line.match(/^(\w+):\s*"(.*)"\s*$/) || line.match(/^(\w+):\s*(.*)\s*$/);
    if (lm) fields[lm[1]] = lm[2].replace(/^"|"$/g, '').trim();
  }
  return { fields, body: m[2] };
}

// ── NIM streaming call (with retry) ─────────────────────────────────────────

function nimCall(systemPrompt, userPrompt, maxTokens = 9000, attempt = 1) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: 'deepseek-ai/deepseek-v3.2',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userPrompt },
      ],
      temperature: 0.45,
      max_tokens: maxTokens,
      top_p: 0.9,
      stream: true,
    });

    const req = https.request({
      hostname: 'integrate.api.nvidia.com',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        'Content-Length': Buffer.byteLength(payload, 'utf8'),
      },
    }, (res) => {
      if (res.statusCode !== 200) {
        const chunks = [];
        res.on('data', c => chunks.push(c));
        res.on('end', () => reject(new Error(`HTTP ${res.statusCode}: ${Buffer.concat(chunks).toString().slice(0, 300)}`)));
        return;
      }

      let buf = '', result = '';
      res.setEncoding('utf8');
      res.on('data', chunk => {
        buf += chunk;
        const lines = buf.split('\n');
        buf = lines.pop();
        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const data = line.slice(6).trim();
          if (data === '[DONE]') continue;
          try {
            const delta = JSON.parse(data).choices?.[0]?.delta?.content;
            if (delta) { result += delta; process.stderr.write('.'); }
          } catch {}
        }
      });
      res.on('end', () => { process.stderr.write('\n'); resolve(result.trim()); });
      res.on('error', async (err) => {
        if (attempt < 3) {
          process.stderr.write(`\n  [retry ${attempt}/3 after ${err.code}] `);
          await new Promise(r => setTimeout(r, 3000 * attempt));
          nimCall(systemPrompt, userPrompt, maxTokens, attempt + 1).then(resolve).catch(reject);
        } else {
          reject(err);
        }
      });
    });

    req.on('error', async (err) => {
      if (attempt < 3) {
        process.stderr.write(`\n  [retry ${attempt}/3 after ${err.code}] `);
        await new Promise(r => setTimeout(r, 3000 * attempt));
        nimCall(systemPrompt, userPrompt, maxTokens, attempt + 1).then(resolve).catch(reject);
      } else {
        reject(err);
      }
    });

    req.write(payload);
    req.end();
  });
}

// ── System prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are translating Korean academic essays for Ji Research Library.

STYLE — match Ray Ji's English register exactly:
- Short, direct sentences. No hedging filler ("It is worth noting that...", "In today's rapidly evolving...").
- Field-driven, empirical tone: insights come from observation, not abstraction.
- Bullet points for behavioral examples and lists.
- Bold for key terms being formally defined.
- Active voice. Decisive conclusions.
- Compress verbose Korean phrasing into lean English prose.
- Example style: "This was not a data problem. It was a thinking architecture problem."

TRANSLATION RULES:
1. Preserve all markdown: ##, ###, >, **, tables, [n] citations — untouched.
2. Translate headings naturally for English academic register (not word-for-word literal).
3. "Korean term (English term)" → use ONLY the English term; drop the Korean.
4. Keep citation markers [1], [2] etc. as-is.
5. Do NOT add or remove content — same ideas, same argument structure.
6. Proper nouns, model names (GPT, Claude, etc.), brand names → unchanged.
7. 참고문헌 section → translate title if Korean-only, keep format.

OUTPUT FORMAT — return exactly this structure, nothing else:
TITLE: [translated title]
DESC: [translated description, 1-2 lean sentences]
---
[full translated article body in markdown]`;

// ── Translate one article ────────────────────────────────────────────────────

async function translateArticle(slug, force = false) {
  const srcPath = path.join(KO_DIR, `${slug}.md`);
  const dstPath = path.join(EN_DIR,  `${slug}.md`);

  if (!fs.existsSync(srcPath)) {
    console.error(`  ✗ not found: ${slug}.md`);
    return false;
  }
  if (fs.existsSync(dstPath) && !force) {
    console.log(`  – skip (exists): ${slug}`);
    return true;
  }

  const raw = fs.readFileSync(srcPath, 'utf8');
  const { fields, body } = parseFrontmatter(raw);

  const hasTitle = !!fields.titleEn;
  const hasDesc  = !!fields.descriptionEn;

  console.log(`  → ${slug}`);
  console.log(`     title: ${fields.title.slice(0, 60)}`);

  // If we already have title+desc, skip asking for them
  const userPrompt = hasTitle && hasDesc
    ? `TITLE: ${fields.titleEn}\nDESC: ${fields.descriptionEn}\n---\n${body}`
    : `Translate this Korean essay. Title: "${fields.title}"\nDescription: "${fields.description}"\n\n---\n${body}`;

  process.stderr.write('     translating: ');
  let response;
  try {
    response = await nimCall(SYSTEM_PROMPT, userPrompt);
  } catch (err) {
    console.error(`\n  ✗ API error: ${err.message}`);
    return false;
  }

  // Parse output: TITLE / DESC / --- / body
  let finalTitle = fields.titleEn || '';
  let finalDesc  = fields.descriptionEn || '';
  let enBody     = response;

  const headerMatch = response.match(/^TITLE:\s*(.+)\nDESC:\s*(.+)\n---\n([\s\S]+)$/);
  if (headerMatch) {
    finalTitle = finalTitle || headerMatch[1].trim();
    finalDesc  = finalDesc  || headerMatch[2].trim();
    enBody     = headerMatch[3].trim();
  } else {
    // Fallback: take response as body if no header found
    console.warn('     warn: no TITLE/DESC header in response — using existing or slug');
    finalTitle = finalTitle || slug.replace(/-/g, ' ');
    finalDesc  = finalDesc  || fields.description;
  }

  if (enBody.length < 300) {
    console.error(`  ✗ response too short (${enBody.length} chars)`);
    return false;
  }

  const enCategory = CAT_MAP[fields.category] || fields.category;

  // Build tags array string safely
  const rawTags = fields.tags || '';
  const tagsArr = rawTags.startsWith('[')
    ? rawTags  // already formatted
    : rawTags.split(',').map(t => `"${t.trim()}"`).filter(t => t !== '""').join(', ');
  const tagsLine = rawTags.startsWith('[') ? rawTags : `[${tagsArr}]`;

  const frontmatter = [
    '---',
    `title: "${finalTitle.replace(/"/g, '\\"')}"`,
    `description: "${finalDesc.replace(/"/g, '\\"')}"`,
    `pubDate: "${fields.pubDate}"`,
    `category: "${enCategory}"`,
    `articleType: "${fields.articleType || 'essay'}"`,
    `tags: ${tagsLine}`,
    `originalSlug: "${slug}"`,
    '---',
    '',
  ].join('\n');

  fs.writeFileSync(dstPath, frontmatter + enBody + '\n', 'utf8');
  console.log(`  ✓ ${slug}.md  (${enBody.length} chars)`);
  return true;
}

// ── Main ─────────────────────────────────────────────────────────────────────

const args  = process.argv.slice(2);
const force = args.includes('--force');
const isAll = args.includes('--all');
const topI  = args.indexOf('--top');
const topN  = topI >= 0 ? parseInt(args[topI + 1]) || 5 : null;

// All Korean article slugs, sorted newest first
const allSlugs = fs.readdirSync(KO_DIR)
  .filter(f => f.endsWith('.md'))
  .map(f => {
    const slug = f.replace('.md', '');
    const raw  = fs.readFileSync(path.join(KO_DIR, f), 'utf8');
    const m    = raw.match(/pubDate:\s*"?([\d-]+)"?/);
    return { slug, date: m ? m[1] : '2000-01-01' };
  })
  .sort((a, b) => b.date.localeCompare(a.date))
  .map(x => x.slug);

let targets = [];

if (isAll) {
  targets = allSlugs;
} else if (topN !== null) {
  targets = allSlugs
    .filter(s => force || !fs.existsSync(path.join(EN_DIR, `${s}.md`)))
    .slice(0, topN);
} else {
  targets = args.filter(a => !a.startsWith('--') && isNaN(parseInt(a)));
}

if (!targets.length) {
  console.log('Nothing to translate.\nUsage: node translate-article.mjs <slug> | --top N | --all');
  process.exit(0);
}

console.log(`Translating ${targets.length} article(s)...\n`);
let ok = 0, fail = 0;
for (const slug of targets) {
  const success = await translateArticle(slug, force);
  if (success) ok++; else fail++;
  // Brief pause between articles to avoid rate limiting
  if (targets.length > 1) await new Promise(r => setTimeout(r, 1500));
}
console.log(`\nDone: ${ok} translated, ${fail} failed`);
