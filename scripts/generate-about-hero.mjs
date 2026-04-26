#!/usr/bin/env node
/**
 * generate-about-hero.mjs
 * Creates the About page hero image:
 *   Left  (AI)     → amber circuit traces flowing right
 *   Center          → convergence zone, glowing orb, mixed style
 *   Right (Human)  → violet neural waves flowing left
 * Output: public/images/about-hero.png  (1440 × 300)
 */

import sharp from 'sharp';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const OUT  = join(ROOT, 'public', 'images', 'about-hero.png');

mkdirSync(join(ROOT, 'public', 'images'), { recursive: true });

const W = 1440, H = 300;

// ── helpers ─────────────────────────────────────────────────────
function makePRNG(seed) {
  let s = (seed ^ 0xdeadbeef) >>> 0;
  return () => { s = (Math.imul(1664525, s) + 1013904223) >>> 0; return s / 0x100000000; };
}
const rng = makePRNG(0xabcd1234);

function hex(r, g, b, a) { return `rgba(${r},${g},${b},${a.toFixed(3)})`; }

// Palette
const AMB  = { r: 184, g: 160, b: 122 }; // amber
const VIO  = { r: 144, g: 136, b: 184 }; // violet
const BG   = '#0b0b0e';

// Zone boundaries
const CX = W / 2;     // center x = 720
const L_END = 480;    // AI zone ends
const R_START = 960;  // Human zone starts
const CY = H / 2;     // center y = 150

// ── Build SVG ──────────────────────────────────────────────────

let defs = `
  <!-- Center radial glow -->
  <radialGradient id="cglow" cx="0.5" cy="0.5" r="0.5">
    <stop offset="0%"   stop-color="rgba(${AMB.r},${AMB.g},${AMB.b},0.10)"/>
    <stop offset="40%"  stop-color="rgba(${VIO.r},${VIO.g},${VIO.b},0.05)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
  </radialGradient>

  <!-- Left amber glow -->
  <radialGradient id="lglow" cx="0.3" cy="0.5" r="0.5">
    <stop offset="0%"   stop-color="rgba(${AMB.r},${AMB.g},${AMB.b},0.07)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
  </radialGradient>

  <!-- Right violet glow -->
  <radialGradient id="rglow" cx="0.7" cy="0.5" r="0.5">
    <stop offset="0%"   stop-color="rgba(${VIO.r},${VIO.g},${VIO.b},0.07)"/>
    <stop offset="100%" stop-color="rgba(0,0,0,0)"/>
  </radialGradient>

  <!-- Top+bottom vignette -->
  <linearGradient id="vig" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0%"   stop-color="rgba(11,11,14,0.55)"/>
    <stop offset="30%"  stop-color="rgba(11,11,14,0)"/>
    <stop offset="70%"  stop-color="rgba(11,11,14,0)"/>
    <stop offset="100%" stop-color="rgba(11,11,14,0.75)"/>
  </linearGradient>

  <!-- Left→center fade mask -->
  <linearGradient id="lmask" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="white" stop-opacity="1"/>
    <stop offset="85%"  stop-color="white" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="white" stop-opacity="0"/>
  </linearGradient>
  <linearGradient id="rmask" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0%"   stop-color="white" stop-opacity="0"/>
    <stop offset="15%"  stop-color="white" stop-opacity="0.5"/>
    <stop offset="100%" stop-color="white" stop-opacity="1"/>
  </linearGradient>
`;

let bg   = `<rect width="${W}" height="${H}" fill="${BG}"/>`;
let grid = '';
let left = '';   // AI circuit traces
let center = ''; // convergence zone
let right = '';  // human neural waves
let labels = '';

// ── Grid (subtle) ──────────────────────────────────────────────
for (let x = 0; x <= W; x += 60) grid += `<line x1="${x}" y1="0" x2="${x}" y2="${H}" stroke="rgba(255,255,255,0.012)" stroke-width="0.5"/>`;
for (let y = 0; y <= H; y += 60) grid += `<line x1="0" y1="${y}" x2="${W}" y2="${y}" stroke="rgba(255,255,255,0.012)" stroke-width="0.5"/>`;

// ── LEFT: AI Circuit Traces ────────────────────────────────────
// 6 traces at different heights, L-shaped, flowing right toward center
const traceYs = [52, 82, 112, 148, 182, 218];

for (let i = 0; i < traceYs.length; i++) {
  const y = traceYs[i];
  const op  = 0.18 + rng() * 0.22;
  const sw  = 0.8 + rng() * 1.2;

  // Each trace: start from left edge, may do 1-2 L-bends, end near L_END
  const segments = 2 + Math.floor(rng() * 2);
  let cx = 0, cy = y;
  let d = `M ${cx},${cy}`;

  for (let s = 0; s < segments; s++) {
    const nx = Math.min(cx + 80 + Math.floor(rng() * 180), L_END - 20);
    d += ` L ${nx},${cy}`;
    if (s < segments - 1 && rng() > 0.4) {
      const ny = traceYs[Math.floor(rng() * traceYs.length)];
      d += ` L ${nx},${ny}`;
      // pad at corner
      left += `<rect x="${nx - 4}" y="${cy - 4}" width="8" height="8" fill="rgba(${AMB.r},${AMB.g},${AMB.b},${(op * 1.4).toFixed(2)})" rx="1"/>`;
      cy = ny;
    }
    cx = nx;
  }

  // Endpoint (circle) — this is a "synapse" connecting to center
  left += `<path d="${d}" stroke="rgba(${AMB.r},${AMB.g},${AMB.b},${op.toFixed(2)})" stroke-width="${sw.toFixed(1)}" fill="none" stroke-linecap="square"/>`;
  left += `<circle cx="${cx}" cy="${cy}" r="3.5" fill="rgba(${AMB.r},${AMB.g},${AMB.b},${(op * 1.8).toFixed(2)})"/>`;

  // Short stub continuing to L_END
  if (cx < L_END - 10) {
    left += `<line x1="${cx}" y1="${cy}" x2="${L_END}" y2="${cy}" stroke="rgba(${AMB.r},${AMB.g},${AMB.b},${(op * 0.5).toFixed(2)})" stroke-width="0.6" stroke-dasharray="3 4"/>`;
  }
}

// IC component outline left side
left += `<rect x="60" y="105" width="90" height="90" fill="rgba(${AMB.r},${AMB.g},${AMB.b},0.02)" stroke="rgba(${AMB.r},${AMB.g},${AMB.b},0.12)" stroke-width="0.8" rx="2"/>`;
for (let p = 0; p < 4; p++) {
  const py = 115 + p * 20;
  left += `<line x1="52" y1="${py}" x2="60" y2="${py}" stroke="rgba(${AMB.r},${AMB.g},${AMB.b},0.18)" stroke-width="1.2"/>`;
  left += `<line x1="150" y1="${py}" x2="158" y2="${py}" stroke="rgba(${AMB.r},${AMB.g},${AMB.b},0.18)" stroke-width="1.2"/>`;
}

// Small label "AI" bottom-left
left += `<text x="24" y="${H - 22}" font-family="monospace" font-size="9" fill="rgba(${AMB.r},${AMB.g},${AMB.b},0.45)" letter-spacing="3">AI</text>`;
left += `<line x1="20" y1="${H - 16}" x2="90" y2="${H - 16}" stroke="rgba(${AMB.r},${AMB.g},${AMB.b},0.12)" stroke-width="0.5"/>`;

// ── RIGHT: Human Neural Waves ──────────────────────────────────
const waveYs = [60, 95, 130, 170, 210];

for (let i = 0; i < waveYs.length; i++) {
  const y = waveYs[i];
  const op  = 0.14 + rng() * 0.20;
  const sw  = 0.7 + rng() * 1.3;

  // Bezier wave from right edge flowing left to R_START
  const cp1x = W - 80 - rng() * 120;
  const cp1y = y + (rng() - 0.5) * 100;
  const cp2x = R_START + 60 + rng() * 100;
  const cp2y = y + (rng() - 0.5) * 80;
  const endY = waveYs[Math.floor(rng() * waveYs.length)];

  right += `<path d="M ${W},${y} C ${cp1x},${cp1y} ${cp2x},${cp2y} ${R_START},${endY}" stroke="rgba(${VIO.r},${VIO.g},${VIO.b},${op.toFixed(2)})" stroke-width="${sw.toFixed(1)}" fill="none"/>`;

  // Synapse dots along path
  const numSyn = 2 + Math.floor(rng() * 3);
  for (let s = 0; s < numSyn; s++) {
    const t  = 0.1 + rng() * 0.8;
    const mt = 1 - t;
    const sx = mt*mt*mt*W + 3*mt*mt*t*cp1x + 3*mt*t*t*cp2x + t*t*t*R_START;
    const sy = mt*mt*mt*y + 3*mt*mt*t*cp1y + 3*mt*t*t*cp2y + t*t*t*endY;
    const sr = 1.5 + rng() * 3.5;
    const sop = 0.2 + rng() * 0.45;
    right += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${sr}" fill="rgba(${VIO.r},${VIO.g},${VIO.b},${sop.toFixed(2)})"/>`;
    if (rng() > 0.5) {
      right += `<circle cx="${sx.toFixed(1)}" cy="${sy.toFixed(1)}" r="${(sr * 2.5).toFixed(1)}" fill="none" stroke="rgba(${VIO.r},${VIO.g},${VIO.b},${(sop * 0.22).toFixed(2)})" stroke-width="0.5"/>`;
    }
  }

  // End node
  right += `<circle cx="${R_START}" cy="${endY}" r="4" fill="rgba(${VIO.r},${VIO.g},${VIO.b},${(op * 1.8).toFixed(2)})"/>`;

  // Stub leftward
  right += `<line x1="${R_START}" y1="${endY}" x2="${R_START - 60}" y2="${endY}" stroke="rgba(${VIO.r},${VIO.g},${VIO.b},${(op * 0.45).toFixed(2)})" stroke-width="0.6" stroke-dasharray="3 4"/>`;
}

// Label "HUMAN" bottom-right
right += `<text x="${W - 24}" y="${H - 22}" font-family="monospace" font-size="9" fill="rgba(${VIO.r},${VIO.g},${VIO.b},0.45)" letter-spacing="3" text-anchor="end">HUMAN</text>`;
right += `<line x1="${W - 90}" y1="${H - 16}" x2="${W - 20}" y2="${H - 16}" stroke="rgba(${VIO.r},${VIO.g},${VIO.b},0.12)" stroke-width="0.5"/>`;

// ── CENTER: Convergence Zone ───────────────────────────────────
// Intermediate connection nodes between L_END and R_START
const connNodes = [
  { x: L_END + 30,  y: 80,  a: 0.5 },
  { x: L_END + 60,  y: 160, a: 0.45 },
  { x: L_END + 120, y: 110, a: 0.55 },
  { x: R_START - 120, y: 90,  a: 0.5 },
  { x: R_START - 60,  y: 155, a: 0.45 },
  { x: R_START - 30,  y: 115, a: 0.5 },
];

// Edges between connection nodes
const edges = [
  [0, 2], [1, 2], [2, 3], [3, 4], [3, 5],
  [2, 4], [0, 3], [1, 4],
];

for (const [a, b] of edges) {
  const na = connNodes[a], nb = connNodes[b];
  const mx = (na.x + nb.x) / 2 + (rng() - 0.5) * 40;
  const my = (na.y + nb.y) / 2 + (rng() - 0.5) * 30;
  const op = 0.08 + rng() * 0.14;
  center += `<path d="M ${na.x},${na.y} Q ${mx.toFixed(1)},${my.toFixed(1)} ${nb.x},${nb.y}" stroke="rgba(200,180,150,${op.toFixed(2)})" stroke-width="0.7" fill="none"/>`;
}

// Connect L traces to nearest node
for (let i = 0; i < traceYs.length; i++) {
  const ty  = traceYs[i];
  const nrst = connNodes.slice(0, 3).reduce((best, n) => Math.abs(n.y - ty) < Math.abs(best.y - ty) ? n : best);
  const op = 0.1;
  center += `<line x1="${L_END}" y1="${ty}" x2="${nrst.x}" y2="${nrst.y}" stroke="rgba(${AMB.r},${AMB.g},${AMB.b},${op})" stroke-width="0.6" stroke-dasharray="2 4"/>`;
}

// Connect R waves to nearest node
for (let i = 0; i < waveYs.length; i++) {
  const wy   = waveYs[i];
  const nrst = connNodes.slice(3).reduce((best, n) => Math.abs(n.y - wy) < Math.abs(best.y - wy) ? n : best);
  const op = 0.1;
  center += `<line x1="${R_START}" y1="${wy}" x2="${nrst.x}" y2="${nrst.y}" stroke="rgba(${VIO.r},${VIO.g},${VIO.b},${op})" stroke-width="0.6" stroke-dasharray="2 4"/>`;
}

// Draw connection nodes
for (const n of connNodes) {
  center += `<circle cx="${n.x}" cy="${n.y}" r="5" fill="rgba(200,180,150,0.04)" stroke="rgba(200,180,150,${(n.a * 0.4).toFixed(2)})" stroke-width="0.8"/>`;
  center += `<circle cx="${n.x}" cy="${n.y}" r="2" fill="rgba(200,180,150,${n.a.toFixed(2)})"/>`;
}

// Central orb
const orbR1 = 52, orbR2 = 34, orbR3 = 18, orbCore = 6;
center += `<ellipse cx="${CX}" cy="${CY}" rx="260" ry="160" fill="url(#cglow)"/>`;
center += `<circle cx="${CX}" cy="${CY}" r="${orbR1}" fill="none" stroke="rgba(184,160,122,0.06)" stroke-width="1"/>`;
center += `<circle cx="${CX}" cy="${CY}" r="${orbR2}" fill="none" stroke="rgba(184,160,122,0.09)" stroke-width="0.8"/>`;
center += `<circle cx="${CX}" cy="${CY}" r="${orbR3}" fill="rgba(184,160,122,0.04)" stroke="rgba(184,160,122,0.15)" stroke-width="1"/>`;
center += `<circle cx="${CX}" cy="${CY}" r="${orbCore}" fill="rgba(184,160,122,0.35)"/>`;
center += `<circle cx="${CX}" cy="${CY}" r="3" fill="rgba(220,200,170,0.7)"/>`;

// Lines from orb to connection nodes
for (const n of connNodes) {
  const op = 0.07 + rng() * 0.08;
  center += `<line x1="${CX}" y1="${CY}" x2="${n.x}" y2="${n.y}" stroke="rgba(200,180,150,${op.toFixed(2)})" stroke-width="0.5"/>`;
}

// Center label
center += `<text x="${CX}" y="${H - 22}" font-family="monospace" font-size="8" fill="rgba(255,255,255,0.18)" letter-spacing="4" text-anchor="middle">COGNITION</text>`;

// ── Assemble ────────────────────────────────────────────────────
const svg = `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
<defs>${defs}</defs>
${bg}
${grid}
<rect width="${W}" height="${H}" fill="url(#lglow)"/>
<rect width="${W}" height="${H}" fill="url(#rglow)"/>
${left}
${right}
${center}
<rect width="${W}" height="${H}" fill="url(#vig)"/>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ compressionLevel: 8 })
  .toFile(OUT);

console.log(`Done → ${OUT}`);
