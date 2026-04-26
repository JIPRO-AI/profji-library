import sharp from 'sharp';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { readdir, readFile, mkdir } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const PUBLIC = join(ROOT, 'public');
const OG_DIR = join(PUBLIC, 'og');
const ARTICLES_DIR = join(ROOT, 'src', 'content', 'articles');

// Design tokens (matching "The Reading Room" theme)
const BG = '#0b0b0e';
const SURFACE = '#18181c';
const ACCENT = '#b8a07a';
const ACCENT_DIM = 'rgba(184, 160, 122, 0.12)';
const TEXT = '#f0ece5';
const TEXT_SEC = '#9c978e';
const TEXT_MUTED = '#5c5851';

const W = 1200;
const H = 630;

// Category color map
const CAT_COLORS = {
  '인지 융합': '#9088b8',
  'AI 전략': '#c9849b',
  '멀티에이전트': '#6a9e86',
  '기술': '#b89468',
  default: ACCENT,
};

function getCatColor(cat) {
  return CAT_COLORS[cat] || CAT_COLORS.default;
}

function escapeXml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

/**
 * Word-wrap text into lines that fit within maxWidth (approximate char-based).
 * For Korean text, 1 char ≈ 1 em width at the given font size.
 */
function wrapText(text, maxChars) {
  const words = text.split('');
  const lines = [];
  let current = '';
  for (const char of text) {
    current += char;
    // Approximate: Korean chars ~1em each, English ~0.5em
    const width = [...current].reduce((w, c) => w + (c.charCodeAt(0) > 255 ? 1 : 0.55), 0);
    if (width >= maxChars) {
      lines.push(current);
      current = '';
    }
  }
  if (current) lines.push(current);
  return lines;
}

function generateDefaultSvg() {
  return `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d11"/>
      <stop offset="100%" stop-color="#08080b"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="20%" stop-color="${ACCENT}"/>
      <stop offset="80%" stop-color="${ACCENT}"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect x="60" y="60" width="${W - 120}" height="${H - 120}" rx="12" fill="${SURFACE}" opacity="0.5"/>
  <rect x="100" y="60" width="${W - 200}" height="2" fill="url(#accentLine)" opacity="0.8"/>
  <line x1="72" y1="72" x2="72" y2="105" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="72" y1="72" x2="105" y2="72" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="72" x2="${W - 72}" y2="105" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="72" x2="${W - 105}" y2="72" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="72" y1="${H - 72}" x2="72" y2="${H - 105}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="72" y1="${H - 72}" x2="105" y2="${H - 72}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="${H - 72}" x2="${W - 72}" y2="${H - 105}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="${H - 72}" x2="${W - 105}" y2="${H - 72}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <circle cx="120" cy="200" r="3" fill="${ACCENT}" opacity="0.15"/>
  <circle cx="135" cy="195" r="2" fill="${ACCENT}" opacity="0.10"/>
  <text x="120" y="285" font-family="Georgia, 'Noto Serif KR', serif" font-size="72" font-weight="300" fill="${ACCENT}" opacity="0.9" letter-spacing="-2">Ji</text>
  <text x="120" y="355" font-family="Georgia, 'Noto Serif KR', serif" font-size="52" font-weight="600" fill="${TEXT}" letter-spacing="-1">Research Library</text>
  <line x1="120" y1="385" x2="440" y2="385" stroke="${ACCENT}" stroke-width="1" opacity="0.4"/>
  <text x="120" y="428" font-family="'Noto Sans KR', 'Helvetica Neue', sans-serif" font-size="22" fill="${TEXT_SEC}">AI-Powered Autonomous Research Library</text>
  <text x="120" y="465" font-family="'Noto Sans KR', 'Helvetica Neue', sans-serif" font-size="18" fill="${TEXT_MUTED}">Exploring human intelligence in the age of AI</text>
  <rect x="120" y="500" width="180" height="30" rx="15" fill="${ACCENT_DIM}" stroke="${ACCENT}" stroke-width="0.5" opacity="0.7"/>
  <circle cx="140" cy="515" r="4" fill="${ACCENT}" opacity="0.8"/>
  <text x="155" y="520" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="12" fill="${ACCENT}" letter-spacing="1" opacity="0.9">RESEARCHING...</text>
  <text x="${W - 120}" y="${H - 90}" text-anchor="end" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="14" fill="${TEXT_MUTED}" letter-spacing="1">jipro-ai.github.io/profji-library</text>
  <rect x="100" y="${H - 62}" width="${W - 200}" height="1" fill="url(#accentLine)" opacity="0.4"/>
</svg>`;
}

function generateArticleSvg({ title, description, category, date }) {
  const catColor = getCatColor(category);
  const safeTitle = escapeXml(title);
  const safeDesc = escapeXml(description);
  const safeCat = escapeXml(category);

  // Wrap title: ~22 Korean chars per line at 44px
  const titleLines = wrapText(title, 22);
  const titleSvg = titleLines.slice(0, 3).map((line, i) => {
    const y = 260 + i * 60;
    return `<text x="120" y="${y}" font-family="Georgia, 'Noto Serif KR', serif" font-size="46" font-weight="600" fill="${TEXT}" letter-spacing="-0.5">${escapeXml(line)}</text>`;
  }).join('\n  ');

  const descY = 260 + Math.min(titleLines.length, 3) * 60 + 30;

  // Wrap description: ~40 chars per line at 20px
  const descLines = wrapText(description, 40);
  const descSvg = descLines.slice(0, 2).map((line, i) => {
    const y = descY + i * 30;
    return `<text x="120" y="${y}" font-family="'Noto Sans KR', 'Helvetica Neue', sans-serif" font-size="20" fill="${TEXT_SEC}">${escapeXml(line)}</text>`;
  }).join('\n  ');

  return `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0d0d11"/>
      <stop offset="100%" stop-color="#08080b"/>
    </linearGradient>
    <linearGradient id="accentLine" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="transparent"/>
      <stop offset="20%" stop-color="${ACCENT}"/>
      <stop offset="80%" stop-color="${ACCENT}"/>
      <stop offset="100%" stop-color="transparent"/>
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="${W}" height="${H}" fill="url(#bgGrad)"/>
  <rect x="60" y="60" width="${W - 120}" height="${H - 120}" rx="12" fill="${SURFACE}" opacity="0.5"/>

  <!-- Top accent line -->
  <rect x="100" y="60" width="${W - 200}" height="2" fill="url(#accentLine)" opacity="0.8"/>

  <!-- Corner marks -->
  <line x1="72" y1="72" x2="72" y2="105" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="72" y1="72" x2="105" y2="72" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="72" x2="${W - 72}" y2="105" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="72" x2="${W - 105}" y2="72" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="72" y1="${H - 72}" x2="72" y2="${H - 105}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="72" y1="${H - 72}" x2="105" y2="${H - 72}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="${H - 72}" x2="${W - 72}" y2="${H - 105}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>
  <line x1="${W - 72}" y1="${H - 72}" x2="${W - 105}" y2="${H - 72}" stroke="${ACCENT}" stroke-width="1.5" opacity="0.4"/>

  <!-- Category badge -->
  <circle cx="130" cy="140" r="5" fill="${catColor}"/>
  <text x="148" y="145" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="13" fill="${catColor}" letter-spacing="1" text-transform="uppercase">${safeCat}</text>

  <!-- Date -->
  <text x="120" y="195" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="14" fill="${TEXT_MUTED}" letter-spacing="0.5">${date}</text>

  <!-- Thin separator -->
  <line x1="120" y1="210" x2="350" y2="210" stroke="${ACCENT}" stroke-width="0.5" opacity="0.3"/>

  <!-- Title -->
  ${titleSvg}

  <!-- Description -->
  ${descSvg}

  <!-- Bottom: site label -->
  <text x="120" y="${H - 90}" font-family="Georgia, 'Noto Serif KR', serif" font-size="20" font-weight="300" fill="${ACCENT}" opacity="0.7">Ji Research Library</text>

  <text x="${W - 120}" y="${H - 90}" text-anchor="end" font-family="'IBM Plex Mono', 'Courier New', monospace" font-size="13" fill="${TEXT_MUTED}" letter-spacing="1">jipro-ai.github.io/profji-library</text>

  <!-- Bottom accent line -->
  <rect x="100" y="${H - 62}" width="${W - 200}" height="1" fill="url(#accentLine)" opacity="0.4"/>
</svg>`;
}

function parseFrontmatter(content) {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return null;
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
    // Match key: "quoted value" (handles colons in value)
    const mQuoted = line.match(/^(\w+):\s*"(.*)"$/);
    if (mQuoted) { fm[mQuoted[1]] = mQuoted[2]; continue; }
    // Match key: unquoted value
    const mPlain = line.match(/^(\w+):\s*(.+)$/);
    if (mPlain) fm[mPlain[1]] = mPlain[2];
  }
  return fm;
}

async function main() {
  // Ensure og directory exists
  await mkdir(OG_DIR, { recursive: true });

  // 1. Generate default OG image
  const defaultSvg = generateDefaultSvg();
  await sharp(Buffer.from(defaultSvg)).png({ quality: 95 }).toFile(join(PUBLIC, 'og-default.png'));
  console.log('✓ og-default.png');

  // 2. Generate per-article OG images
  const files = await readdir(ARTICLES_DIR);
  const mdFiles = files.filter(f => f.endsWith('.md') || f.endsWith('.mdx'));

  for (const file of mdFiles) {
    const slug = file.replace(/\.(md|mdx)$/, '');
    const content = await readFile(join(ARTICLES_DIR, file), 'utf-8');
    const fm = parseFrontmatter(content);
    if (!fm || !fm.title) {
      console.log(`⚠ Skipping ${file} (no frontmatter)`);
      continue;
    }

    const svg = generateArticleSvg({
      title: fm.title,
      description: fm.description || '',
      category: fm.category || '',
      date: fm.pubDate || '',
    });

    await sharp(Buffer.from(svg)).png({ quality: 95 }).toFile(join(OG_DIR, `${slug}.png`));
    console.log(`✓ og/${slug}.png`);
  }

  console.log('\nAll OG images generated!');
}

main().catch(console.error);
