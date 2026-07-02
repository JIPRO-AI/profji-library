#!/usr/bin/env node
// OG card generator (og-v3 design) — 1200x630 PNG per article.
// Usage:
//   node scripts/generate-og-card.mjs <slug> [slug2 ...]   # specific slugs
//   node scripts/generate-og-card.mjs --missing            # all articles lacking an og-v3 PNG
// Design matches the existing public/og-v3/ cards (wordmark, left stripe, byline).
// deploy-article.sh calls this per-slug so new articles never ship without an OG card.
import sharp from 'sharp';
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const ARTICLES_DIR = join(ROOT, 'src', 'content', 'articles');
const OUTPUT_DIR = join(ROOT, 'public', 'og-v3');

const CAT_COLORS = {
  'AI 심리학': '#c9849b',
  'AI Psychology': '#c9849b',
  '인지 융합': '#9088b8',
  'Cognitive Synthesis': '#9088b8',
  'AI 기술': '#6a9e86',
  'AI Technology': '#6a9e86',
  '에이전트': '#b89468',
  '에이전트 시스템': '#b89468',
  'Agent Systems': '#b89468',
  'LLM 아키텍처': '#6a9e86',
  'LLM Architecture': '#6a9e86',
};
const ACCENT = '#b8a07a';
const TEXT_PRIMARY = '#f0ece5';
const TEXT_MUTED = '#9e978b';

function parseFrontmatter(content) {
  const match = content.match(/^﻿?---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fm = match[1];
  const get = (key) => {
    const m = fm.match(new RegExp(`^${key}:\\s*["']?(.+?)["']?\\s*$`, 'm'));
    return m ? m[1].replace(/^["']|["']$/g, '').trim() : '';
  };
  return { title: get('title'), category: get('category'), description: get('description'), articleType: get('articleType') };
}

function estimateWidth(s) {
  return [...s].reduce((n, c) => n + (c.charCodeAt(0) > 127 ? 2 : 1), 0);
}

function wrapText(text, maxWidth, maxLines) {
  if (!text) return [];
  const words = text.split(' ');
  const lines = [];
  let current = '';
  for (const word of words) {
    if (lines.length >= maxLines) break;
    const testLine = current ? current + ' ' + word : word;
    if (estimateWidth(testLine) > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = testLine;
    }
  }
  if (current && lines.length < maxLines) lines.push(current);
  const used = lines.join(' ');
  if (used.length < text.length - 1 && lines.length > 0) {
    const last = lines[lines.length - 1];
    lines[lines.length - 1] = last.slice(0, -1).trimEnd() + '…';
  }
  return lines;
}

function escapeXml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
}

function buildSVG(title, category, description, articleType) {
  const catColor = CAT_COLORS[category] || ACCENT;
  const titleLines = wrapText(title, 21, 3);
  const titleY = 260;
  const titleLineHeight = 70;
  const descLines = wrapText(description, 40, 2);
  const descY = titleY + titleLines.length * titleLineHeight + 36;
  const typeLabel = articleType ? articleType.toUpperCase() : '';

  const titleSVG = titleLines.map((line, i) =>
    `  <text x="80" y="${titleY + i * titleLineHeight}" font-family="Noto Serif KR, Noto Serif CJK KR, Georgia, serif" font-size="54" font-weight="400" fill="${TEXT_PRIMARY}" letter-spacing="-0.5">${escapeXml(line)}</text>`
  ).join('\n');
  const descSVG = descLines.map((line, i) =>
    `  <text x="80" y="${descY + i * 30}" font-family="Noto Serif KR, Noto Serif CJK KR, Georgia, serif" font-size="20" font-weight="300" fill="${TEXT_MUTED}">${escapeXml(line)}</text>`
  ).join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0f0f13"/>
      <stop offset="100%" stop-color="#0b0b0e"/>
    </linearGradient>
    <linearGradient id="stripe" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="${catColor}" stop-opacity="0.9"/>
      <stop offset="100%" stop-color="${catColor}" stop-opacity="0.3"/>
    </linearGradient>
    <clipPath id="safe"><rect x="0" y="0" width="1120" height="630"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="url(#bg)"/>
  <rect x="0" y="0" width="6" height="630" fill="url(#stripe)"/>
  <rect x="80" y="64" width="56" height="2" fill="${catColor}" opacity="0.85"/>
  <text x="80" y="54" font-family="IBM Plex Mono, Menlo, monospace" font-size="12" font-weight="400" fill="${TEXT_MUTED}" letter-spacing="2.5">JI RESEARCH LIBRARY</text>
  <text x="80" y="106" font-family="IBM Plex Mono, Menlo, monospace" font-size="14" font-weight="400" fill="${catColor}" letter-spacing="1.2">${escapeXml((category || '').toUpperCase())}${typeLabel ? '   ·   ' + typeLabel : ''}</text>
  <g clip-path="url(#safe)">
${titleSVG}
  </g>
  <g clip-path="url(#safe)">
${descSVG}
  </g>
  <rect x="80" y="558" width="1040" height="1" fill="#27272c"/>
  <text x="80" y="592" font-family="IBM Plex Mono, Menlo, monospace" font-size="12" font-weight="400" fill="${TEXT_MUTED}" letter-spacing="1">by Prof Ji  ·  jipro-ai.github.io/profji-library</text>
  <circle cx="1118" cy="592" r="3" fill="${ACCENT}" opacity="0.55"/>
</svg>`;
}

async function generateFor(slug) {
  const file = join(ARTICLES_DIR, slug + '.md');
  if (!existsSync(file)) { console.error(`FAIL ${slug}: article not found`); return false; }
  const { title, category, description, articleType } = parseFrontmatter(readFileSync(file, 'utf8'));
  if (!title) { console.error(`FAIL ${slug}: no title in frontmatter`); return false; }
  const svg = buildSVG(title, category || 'AI 기술', description, articleType);
  await sharp(Buffer.from(svg, 'utf8'))
    .png({ quality: 95, compressionLevel: 8, palette: false, effort: 7, colors: 256 })
    .toColorspace('srgb')
    .toFile(join(OUTPUT_DIR, slug + '.png'));
  console.log(`OK ${slug}`);
  return true;
}

async function main() {
  mkdirSync(OUTPUT_DIR, { recursive: true });
  let slugs = process.argv.slice(2).filter(a => a !== '--missing');
  if (process.argv.includes('--missing') || slugs.length === 0) {
    slugs = readdirSync(ARTICLES_DIR)
      .filter(f => f.endsWith('.md'))
      .map(f => f.replace(/\.md$/, ''))
      .filter(slug => !existsSync(join(OUTPUT_DIR, slug + '.png')));
    if (slugs.length === 0) { console.log('All articles have OG cards.'); return; }
  }
  let ok = 0;
  for (const slug of slugs) { if (await generateFor(slug)) ok++; }
  console.log(`Done: ${ok}/${slugs.length}`);
  if (ok < slugs.length) process.exitCode = 1;
}

main().catch(err => { console.error('Fatal:', err); process.exit(1); });
