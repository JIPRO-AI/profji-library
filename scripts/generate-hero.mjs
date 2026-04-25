#!/usr/bin/env node
/**
 * generate-hero.mjs
 * Generates abstract generative-art hero images for all articles.
 * - AI 기술   → circuit-board / PCB traces  (amber  #b8a07a)
 * - 인지 융합  → neural wave flows           (violet #9088b8)
 * - 에이전트   → multi-agent node graph      (teal   #7ab8b0)
 * Each image is 1200×630 SVG → PNG via sharp.
 * Output: public/images/articles/{slug}.png
 */

import sharp from 'sharp';
import { mkdirSync, existsSync, readdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT_DIR = join(ROOT, 'public', 'images', 'articles');

if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const W = 1200, H = 630;

// ── Seeded PRNG (LCG) ──────────────────────────────────────────
function makePRNG(seed) {
  let s = (Math.abs(seed) ^ 0xdeadbeef) >>> 0;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function hashStr(str) {
  let h = 0x811c9dc5;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

function hexToRgb(hex) {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function rgba(c, a) {
  return `rgba(${c.r},${c.g},${c.b},${a.toFixed(3)})`;
}

// ── Article discovery (auto-reads content dir) ──────────────────
const CONTENT_DIR = join(ROOT, 'src', 'content', 'articles');

function readCategory(mdPath) {
  try {
    const text = readFileSync(mdPath, 'utf8');
    const m = text.match(/^category:\s*"?([^"\n]+)"?/m);
    return m ? m[1].trim() : 'AI 기술';
  } catch { return 'AI 기술'; }
}

function discoverArticles(onlySlug = null) {
  const files = readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  return files.map(f => {
    const slug = f.replace(/\.md$/, '');
    const category = readCategory(join(CONTENT_DIR, f));
    return { slug, category };
  }).filter(a => !onlySlug || a.slug === onlySlug);
}

// ── CLI args ─────────────────────────────────────────────────────
// Usage: node generate-hero.mjs [--slug <slug>] [--force]
//   --slug  : generate only for this article
//   --force : regenerate even if output exists
const args = process.argv.slice(2);
const slugArg  = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;
const force    = args.includes('--force');

const articles = discoverArticles(slugArg);

// ── Shared: subtle grid + bottom gradient ──────────────────────
function makeGrid() {
  let g = '';
  for (let x = 0; x <= W; x += 80) g += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(255,255,255,0.018)" stroke-width="0.5"/>`;
  for (let y = 0; y <= H; y += 80) g += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.018)" stroke-width="0.5"/>`;
  return g;
}

// ── Style 1: Circuit board (AI 기술) ───────────────────────────
function circuitArt(slug) {
  const rng = makePRNG(hashStr(slug));
  const acc = hexToRgb('#b8a07a');

  // Secondary warm tint — varies per article
  const tintShift = rng() * 0.04;
  const acc2 = { r: Math.min(255, acc.r + 20), g: acc.g, b: Math.max(0, acc.b - 20) };

  let defs = `
    <radialGradient id="rg" cx="${(0.25 + rng() * 0.5).toFixed(2)}" cy="${(0.25 + rng() * 0.5).toFixed(2)}" r="0.6">
      <stop offset="0%" stop-color="${rgba(acc, 0.09)}"/>
      <stop offset="100%" stop-color="${rgba(acc, 0)}"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(11,11,14,0.35)"/>
      <stop offset="55%"  stop-color="rgba(11,11,14,0)"/>
      <stop offset="100%" stop-color="rgba(11,11,14,0.85)"/>
    </linearGradient>`;

  let body = `<rect width="${W}" height="${H}" fill="url(#rg)"/>`;

  // Manhattan circuit traces
  const NUM_TRACES = 22 + Math.floor(rng() * 14);
  for (let i = 0; i < NUM_TRACES; i++) {
    let x = Math.floor(rng() * 14) * 80 + 40;
    let y = Math.floor(rng() * 7) * 80 + 40;
    const segs = 3 + Math.floor(rng() * 4);
    let d = `M ${x} ${y}`;
    for (let s = 0; s < segs; s++) {
      const horiz = rng() > 0.5;
      const steps = 1 + Math.floor(rng() * 3);
      if (horiz) x = Math.max(0, Math.min(W, x + (rng() > 0.5 ? 1 : -1) * steps * 80));
      else       y = Math.max(0, Math.min(H, y + (rng() > 0.5 ? 1 : -1) * steps * 80));
      d += ` L ${x} ${y}`;
    }
    const op = 0.07 + rng() * 0.22;
    const sw = 0.7 + rng() * 1.1;
    const useAcc2 = rng() > 0.7;
    const c = useAcc2 ? acc2 : acc;
    body += `<path d="${d}" stroke="${rgba(c, op)}" stroke-width="${sw.toFixed(1)}" fill="none" stroke-linecap="square"/>`;

    // Pad at endpoint
    const padOp = op * 1.6;
    body += `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" fill="${rgba(c, Math.min(0.6, padOp))}" rx="1"/>`;
  }

  // Junction nodes at grid crossings
  const NUM_NODES = 14 + Math.floor(rng() * 10);
  for (let i = 0; i < NUM_NODES; i++) {
    const nx = Math.floor(rng() * 15) * 80 + 40;
    const ny = Math.floor(rng() * 8) * 80 + 40;
    const r = 2.5 + rng() * 4;
    const op = 0.25 + rng() * 0.45;
    body += `<circle cx="${nx}" cy="${ny}" r="${r}" fill="${rgba(acc, op)}"/>`;
    if (rng() > 0.55) {
      body += `<circle cx="${nx}" cy="${ny}" r="${r * 2.4}" fill="none" stroke="${rgba(acc, op * 0.3)}" stroke-width="0.8"/>`;
    }
  }

  // IC-style component outlines (rectangles with pins)
  const NUM_IC = 2 + Math.floor(rng() * 3);
  for (let i = 0; i < NUM_IC; i++) {
    const icX = 100 + rng() * (W - 200);
    const icY = 80  + rng() * (H - 160);
    const icW = 60 + rng() * 100;
    const icH = 40 + rng() * 60;
    const op  = 0.08 + rng() * 0.12;
    body += `<rect x="${(icX - icW/2).toFixed(1)}" y="${(icY - icH/2).toFixed(1)}" width="${icW.toFixed(1)}" height="${icH.toFixed(1)}" fill="${rgba(acc, 0.03)}" stroke="${rgba(acc, op)}" stroke-width="0.8" rx="2"/>`;
    // Pins on sides
    const pins = 3 + Math.floor(rng() * 4);
    for (let p = 0; p < pins; p++) {
      const py = icY - icH/2 + (p + 1) * icH / (pins + 1);
      body += `<line x1="${(icX - icW/2 - 8).toFixed(1)}" y1="${py.toFixed(1)}" x2="${(icX - icW/2).toFixed(1)}" y2="${py.toFixed(1)}" stroke="${rgba(acc, op * 1.4)}" stroke-width="1.2"/>`;
      body += `<line x1="${(icX + icW/2).toFixed(1)}" y1="${py.toFixed(1)}" x2="${(icX + icW/2 + 8).toFixed(1)}" y2="${py.toFixed(1)}" stroke="${rgba(acc, op * 1.4)}" stroke-width="1.2"/>`;
    }
  }

  // Corner registration marks
  for (const [cx, cy] of [[28,28],[W-28,28],[28,H-28],[W-28,H-28]]) {
    body += `<path d="M ${cx-12},${cy} L ${cx},${cy} L ${cx},${cy-12}" fill="none" stroke="${rgba(acc, 0.25)}" stroke-width="1"/>`;
    body += `<path d="M ${cx+12},${cy} L ${cx},${cy} L ${cx},${cy+12}" fill="none" stroke="${rgba(acc, 0.25)}" stroke-width="1"/>`;
  }

  return { defs, body };
}

// ── Style 2: Neural waves (인지 융합) ──────────────────────────
function neuralArt(slug) {
  const rng = makePRNG(hashStr(slug));
  const acc = hexToRgb('#9088b8');

  const glowX = 0.2 + rng() * 0.6;
  const glowY = 0.2 + rng() * 0.6;

  let defs = `
    <radialGradient id="rg" cx="${glowX.toFixed(2)}" cy="${glowY.toFixed(2)}" r="0.55">
      <stop offset="0%"   stop-color="${rgba(acc, 0.13)}"/>
      <stop offset="100%" stop-color="${rgba(acc, 0)}"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(11,11,14,0.4)"/>
      <stop offset="55%"  stop-color="rgba(11,11,14,0)"/>
      <stop offset="100%" stop-color="rgba(11,11,14,0.85)"/>
    </linearGradient>
    <filter id="blur3" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3"/>
    </filter>`;

  let body = `<rect width="${W}" height="${H}" fill="url(#rg)"/>`;

  // Wave bands — flowing sinusoidal-ish bezier paths
  const NUM_BANDS = 16 + Math.floor(rng() * 10);
  for (let i = 0; i < NUM_BANDS; i++) {
    const baseY = (i / NUM_BANDS) * H * 1.2 - H * 0.1;
    const amp   = 30 + rng() * 90;
    const phase = rng() * W;
    // 4-point bezier sweeping the full width
    const y0  = baseY + Math.sin(phase / 300) * amp;
    const cp1x = W * 0.25;
    const cp1y = baseY + (rng() - 0.5) * amp * 2.5;
    const cp2x = W * 0.75;
    const cp2y = baseY + (rng() - 0.5) * amp * 2.5;
    const y1  = baseY + Math.sin((phase + W) / 300) * amp;
    const op  = 0.04 + rng() * 0.14;
    const sw  = 0.4 + rng() * 1.8;

    body += `<path d="M 0,${y0.toFixed(1)} C ${cp1x},${cp1y.toFixed(1)} ${cp2x},${cp2y.toFixed(1)} ${W},${y1.toFixed(1)}" stroke="${rgba(acc, op)}" stroke-width="${sw.toFixed(1)}" fill="none"/>`;

    // Glow duplicate (wider, more transparent)
    if (rng() > 0.5) {
      body += `<path d="M 0,${y0.toFixed(1)} C ${cp1x},${cp1y.toFixed(1)} ${cp2x},${cp2y.toFixed(1)} ${W},${y1.toFixed(1)}" stroke="${rgba(acc, op * 0.4)}" stroke-width="${(sw * 4).toFixed(1)}" fill="none" filter="url(#blur3)"/>`;
    }

    // Synapse dots along path
    const numSynapses = 2 + Math.floor(rng() * 4);
    for (let s = 0; s < numSynapses; s++) {
      const t  = 0.1 + rng() * 0.8;
      // Cubic bezier point
      const mt = 1 - t;
      const sx = mt*mt*mt*0 + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*W;
      const sy = mt*mt*mt*y0 + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*y1;
      const sr = 1.5 + rng() * 4;
      const sop = 0.2 + rng() * 0.5;
      body += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${sr}" fill="${rgba(acc, sop)}"/>`;
      if (rng() > 0.6) {
        body += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(sr * 2.8).toFixed(1)}" fill="none" stroke="${rgba(acc, sop * 0.25)}" stroke-width="0.5"/>`;
      }
    }
  }

  // Concentric rings at focal point
  const fx = glowX * W, fy = glowY * H;
  for (let r = 1; r <= 6; r++) {
    const ring = r * 28 + rng() * 15;
    body += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="${ring.toFixed(1)}" fill="none" stroke="${rgba(acc, Math.max(0, 0.18 - r * 0.025))}" stroke-width="0.7"/>`;
  }
  // Central dot
  body += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="4" fill="${rgba(acc, 0.5)}"/>`;
  body += `<circle cx="${fx.toFixed(1)}" cy="${fy.toFixed(1)}" r="8" fill="${rgba(acc, 0.12)}" filter="url(#blur3)"/>`;

  return { defs, body };
}

// ── Style 3: Multi-agent network (에이전트) ────────────────────
function agentArt(slug) {
  const rng = makePRNG(hashStr(slug));
  const acc = hexToRgb('#7ab8b0');

  let defs = `
    <radialGradient id="rg" cx="0.5" cy="0.5" r="0.55">
      <stop offset="0%"   stop-color="${rgba(acc, 0.09)}"/>
      <stop offset="100%" stop-color="${rgba(acc, 0)}"/>
    </radialGradient>
    <linearGradient id="vignette" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="rgba(11,11,14,0.4)"/>
      <stop offset="55%"  stop-color="rgba(11,11,14,0)"/>
      <stop offset="100%" stop-color="rgba(11,11,14,0.85)"/>
    </linearGradient>
    <filter id="blur5" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="5"/>
    </filter>`;

  let body = `<rect width="${W}" height="${H}" fill="url(#rg)"/>`;

  // Generate agent nodes (layered: small periphery + large hubs)
  const nodes = [];
  // Periphery agents
  const NUM_AGENTS = 12 + Math.floor(rng() * 8);
  for (let i = 0; i < NUM_AGENTS; i++) {
    nodes.push({
      x: W * (0.08 + rng() * 0.84),
      y: H * (0.08 + rng() * 0.84),
      r: 3 + rng() * 9,
      tier: 0,
    });
  }
  // Hub nodes (3–5)
  const NUM_HUBS = 3 + Math.floor(rng() * 3);
  for (let i = 0; i < NUM_HUBS; i++) {
    nodes.push({
      x: W * (0.2 + rng() * 0.6),
      y: H * (0.2 + rng() * 0.6),
      r: 18 + rng() * 20,
      tier: 1,
    });
  }

  // Edges first (drawn below nodes)
  for (let i = 0; i < nodes.length; i++) {
    const maxConns = nodes[i].tier === 1 ? 6 : 3;
    const numConns = 1 + Math.floor(rng() * maxConns);
    for (let c = 0; c < numConns; c++) {
      const j = Math.floor(rng() * nodes.length);
      if (i === j) continue;
      const a = nodes[i], b = nodes[j];
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if (dist > 450) continue; // skip very long edges
      const op = 0.06 + rng() * 0.18;
      const sw = 0.5 + rng() * 0.8;
      // Slight curve via a midpoint offset
      const mx = (a.x + b.x) / 2 + (rng() - 0.5) * 60;
      const my = (a.y + b.y) / 2 + (rng() - 0.5) * 60;
      body += `<path d="M ${a.x.toFixed(1)},${a.y.toFixed(1)} Q ${mx.toFixed(1)},${my.toFixed(1)} ${b.x.toFixed(1)},${b.y.toFixed(1)}" stroke="${rgba(acc, op)}" stroke-width="${sw.toFixed(1)}" fill="none"/>`;
    }
  }

  // Draw nodes
  for (const n of nodes) {
    const op   = n.tier === 1 ? 0.3 + rng() * 0.3 : 0.15 + rng() * 0.4;
    const fill = n.tier === 1 ? rgba(acc, 0.07) : rgba(acc, 0.04);
    body += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${n.r}" fill="${fill}" stroke="${rgba(acc, op)}" stroke-width="${n.tier === 1 ? 1.2 : 0.8}"/>`;
    // Inner dot
    body += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${(n.r * 0.28).toFixed(1)}" fill="${rgba(acc, op * 0.8)}"/>`;
    // Hub glow
    if (n.tier === 1) {
      body += `<circle cx="${n.x.toFixed(1)}" cy="${n.y.toFixed(1)}" r="${(n.r * 1.6).toFixed(1)}" fill="${rgba(acc, 0.04)}" filter="url(#blur5)"/>`;
    }
  }

  // Orbit rings around the first hub
  const hub = nodes.find(n => n.tier === 1);
  if (hub) {
    for (let o = 1; o <= 3; o++) {
      const or = hub.r * (1.8 + o * 0.8);
      body += `<circle cx="${hub.x.toFixed(1)}" cy="${hub.y.toFixed(1)}" r="${or.toFixed(1)}" fill="none" stroke="${rgba(acc, 0.06)}" stroke-width="0.7" stroke-dasharray="4 8"/>`;
    }
  }

  // Hexagonal grid overlay (light)
  const HEX_SIZE = 55;
  const HEX_H = HEX_SIZE * Math.sqrt(3);
  for (let row = -1; row <= Math.ceil(H / HEX_H) + 1; row++) {
    for (let col = -1; col <= Math.ceil(W / (HEX_SIZE * 1.5)) + 1; col++) {
      const hx = col * HEX_SIZE * 1.5;
      const hy = row * HEX_H + (col % 2 === 0 ? 0 : HEX_H / 2);
      const pts = Array.from({ length: 6 }, (_, i) => {
        const a = (Math.PI / 180) * (60 * i - 30);
        return `${(hx + HEX_SIZE * Math.cos(a)).toFixed(1)},${(hy + HEX_SIZE * Math.sin(a)).toFixed(1)}`;
      }).join(' ');
      body += `<polygon points="${pts}" fill="none" stroke="rgba(255,255,255,0.013)" stroke-width="0.5"/>`;
    }
  }

  return { defs, body };
}

// ── Build full SVG ──────────────────────────────────────────────
function buildSVG(slug, category) {
  let artFn;
  if      (category === '인지 융합') artFn = neuralArt;
  else if (category === '에이전트')  artFn = agentArt;
  else                               artFn = circuitArt;

  const { defs, body } = artFn(slug);

  return `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs>${defs}
</defs>
<rect width="${W}" height="${H}" fill="#0b0b0e"/>
${makeGrid()}
${body}
<rect width="${W}" height="${H}" fill="url(#vignette)"/>
</svg>`;
}

// ── Run ─────────────────────────────────────────────────────────
let done = 0, skipped = 0;
for (const { slug, category } of articles) {
  const out = join(OUT_DIR, `${slug}.png`);
  if (!force && existsSync(out)) { skipped++; continue; }
  const svg = buildSVG(slug, category);
  await sharp(Buffer.from(svg))
    .png({ compressionLevel: 8 })
    .toFile(out);
  done++;
  console.log(`[+] ${slug}  (${category})`);
}

if (skipped > 0) console.log(`Skipped ${skipped} existing (use --force to regenerate)`);
console.log(`Done — ${done} new images → public/images/articles/`);
