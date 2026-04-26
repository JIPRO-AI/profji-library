#!/usr/bin/env node
// generate-novel-hero.mjs
// Generates cinematic hero images for each novel episode (AI시대 인간 직장인 생존법)
// Usage: node generate-novel-hero.mjs [--slug ai-survival-ep1] [--force]

import sharp from 'sharp';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const OUT_DIR = path.join(__dirname, '..', 'public', 'images', 'novels');
fs.mkdirSync(OUT_DIR, { recursive: true });

const W = 1200, H = 480;

// Seeded PRNG (LCG) for deterministic art
function makePrng(seed) {
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

// ── EP1: 새로운 동료 — Server Room Awakening ─────────────────────────────────
// Cold, digital, a single spark of consciousness igniting in the dark.
// Palette: deep navy → data streams (cyan/teal) → amber awakening core

function ep1() {
  const rng = makePrng(0xa1b2);

  const defs = `
    <linearGradient id="e1bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#030d1e"/>
      <stop offset="100%" stop-color="#020810"/>
    </linearGradient>
    <radialGradient id="e1aura" cx="745" cy="240" r="320" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#e8a840" stop-opacity="0.9"/>
      <stop offset="20%"  stop-color="#c47a1a" stop-opacity="0.55"/>
      <stop offset="55%"  stop-color="#1a2d4a" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#020810" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="e1core" cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stop-color="#fff8e6" stop-opacity="1"/>
      <stop offset="28%"  stop-color="#f0b045" stop-opacity="0.9"/>
      <stop offset="65%"  stop-color="#c47a1a" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#e8a840" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="e1vig" cx="50%" cy="50%" r="70%">
      <stop offset="0%"   stop-color="transparent"/>
      <stop offset="100%" stop-color="#010508" stop-opacity="0.72"/>
    </radialGradient>
    <filter id="e1glow">
      <feGaussianBlur stdDeviation="10" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="e1softglow">
      <feGaussianBlur stdDeviation="18" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;

  let body = '';

  // Background
  body += `<rect width="${W}" height="${H}" fill="url(#e1bg)"/>`;
  body += `<rect width="${W}" height="${H}" fill="url(#e1aura)"/>`;

  // Server racks (left side silhouettes)
  const racks = [32, 92, 148, 204];
  for (const rx of racks) {
    const rh = 310 + rng() * 24;
    const ry = (H - rh) / 2;
    body += `<rect x="${rx}" y="${ry}" width="44" height="${rh.toFixed(0)}" fill="#070f1c" stroke="#132030" stroke-width="0.6"/>`;
    // Unit separator lines
    for (let u = 1; u < 15; u++) {
      const ly = ry + u * rh / 15;
      body += `<line x1="${rx}" y1="${ly.toFixed(0)}" x2="${rx+44}" y2="${ly.toFixed(0)}" stroke="#132030" stroke-width="0.3"/>`;
    }
    // LED status lights
    for (let i = 0; i < 14; i++) {
      const ly = ry + 14 + i * (rh - 28) / 14;
      const col = rng() > 0.88 ? '#ff4422' : rng() > 0.55 ? '#00e67a' : '#00b4cc';
      const op = (0.35 + rng() * 0.6).toFixed(2);
      body += `<circle cx="${rx+8}" cy="${ly.toFixed(0)}" r="2" fill="${col}" opacity="${op}"/>`;
    }
    // Drive slots (small rectangles)
    for (let d = 0; d < 5; d++) {
      const dy = ry + 20 + d * 42;
      body += `<rect x="${rx+14}" y="${dy.toFixed(0)}" width="22" height="6" rx="1" fill="#0e1828" stroke="#1a2a3a" stroke-width="0.4"/>`;
    }
  }

  // Horizontal data stream lines
  for (let i = 0; i < 40; i++) {
    const y = 15 + rng() * (H - 30);
    const x1 = 260 + rng() * 160;
    const x2 = x1 + 120 + rng() * 480;
    const op = (0.04 + rng() * 0.18).toFixed(2);
    const lw = (0.3 + rng() * 0.8).toFixed(1);
    const col = rng() > 0.45 ? '#00d4aa' : '#4a90d9';
    body += `<line x1="${x1.toFixed(0)}" y1="${y.toFixed(0)}" x2="${x2.toFixed(0)}" y2="${y.toFixed(0)}" stroke="${col}" stroke-width="${lw}" opacity="${op}"/>`;
    // Data packet dots on streams
    if (rng() > 0.5) {
      const px = x1 + rng() * (x2 - x1);
      const pw = 3 + rng() * 6;
      const pOp = (0.15 + rng() * 0.3).toFixed(2);
      body += `<rect x="${px.toFixed(0)}" y="${(y-0.8).toFixed(0)}" width="${pw.toFixed(0)}" height="1.6" fill="${col}" opacity="${pOp}"/>`;
    }
  }

  // Awakening core position
  const cx = 745, cy = 240;

  // Orbital rings
  const rings = [
    { r: 95,  op: 0.025, col: '#e8a840' },
    { r: 68,  op: 0.05,  col: '#f0b045' },
    { r: 44,  op: 0.09,  col: '#f8d070' },
    { r: 24,  op: 0.18,  col: '#fff0c0' },
  ];
  for (const ring of rings) {
    body += `<circle cx="${cx}" cy="${cy}" r="${ring.r}" fill="${ring.col}" opacity="${(ring.op * 0.28).toFixed(3)}"/>`;
    body += `<circle cx="${cx}" cy="${cy}" r="${ring.r}" fill="none" stroke="${ring.col}" stroke-width="1" opacity="${ring.op.toFixed(3)}"/>`;
  }

  // Hex/binary particle scatter
  const chars = ['0','1','A','F','3','E','7','B','2','9','C','D'];
  for (let i = 0; i < 48; i++) {
    const angle = rng() * Math.PI * 2;
    const dist = 55 + rng() * 240;
    const px = cx + Math.cos(angle) * dist;
    const py = cy + Math.sin(angle) * dist;
    if (px < 250 || px > W - 20 || py < 5 || py > H - 5) continue;
    const ch = chars[Math.floor(rng() * chars.length)];
    const op = (0.05 + rng() * 0.18 * (1 - dist / 280)).toFixed(2);
    const fs = 7 + rng() * 10;
    body += `<text x="${px.toFixed(0)}" y="${py.toFixed(0)}" font-family="monospace" font-size="${fs.toFixed(0)}" fill="#e8a840" opacity="${op}">${ch}</text>`;
  }

  // Synapse connection lines to peripheral nodes
  const nodes = [[360, 130], [420, 360], [560, 95], [530, 388], [640, 200], [680, 300]];
  for (const [nx, ny] of nodes) {
    const op = (0.05 + rng() * 0.08).toFixed(2);
    body += `<line x1="${cx}" y1="${cy}" x2="${nx}" y2="${ny}" stroke="#e8a840" stroke-width="0.5" opacity="${op}"/>`;
    body += `<circle cx="${nx}" cy="${ny}" r="${(2+rng()*2).toFixed(1)}" fill="#e8a840" opacity="${(parseFloat(op)*2.2).toFixed(2)}"/>`;
  }

  // Core glow (large soft) — behind the hard core
  body += `<circle cx="${cx}" cy="${cy}" r="52" fill="#e8a840" opacity="0.12" filter="url(#e1softglow)"/>`;

  // Core glow layers
  body += `<circle cx="${cx}" cy="${cy}" r="30" fill="#e8a840" opacity="0.6" filter="url(#e1glow)"/>`;
  body += `<circle cx="${cx}" cy="${cy}" r="16" fill="#f8d890" opacity="0.85"/>`;
  body += `<circle cx="${cx}" cy="${cy}" r="6"  fill="#fff8f0" opacity="0.98"/>`;

  // Label
  body += `<text x="${cx+46}" y="${cy-46}" font-family="monospace" font-size="10" fill="#e8a840" opacity="0.45" letter-spacing="4">ARI ONLINE</text>`;

  // EP label (atmospheric, bottom-left)
  body += `<text x="270" y="${H-22}" font-family="monospace" font-size="9" fill="#4a7090" opacity="0.4" letter-spacing="3">EP.01 · 새로운 동료</text>`;

  // Vignette
  body += `<rect width="${W}" height="${H}" fill="url(#e1vig)"/>`;

  return `<defs>${defs}</defs>${body}`;
}

// ── EP2: 적응의 기술 — Morning Office Integration ────────────────────────────
// Warm, domestic. Ari has become routine — like air. A familiar morning.
// Palette: warm amber sunrise, dark desk, cactus, calendar, clock

function ep2() {
  const rng = makePrng(0xb265);

  const defs = `
    <linearGradient id="e2bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#140e05"/>
      <stop offset="100%" stop-color="#0a0806"/>
    </linearGradient>
    <radialGradient id="e2sunrise" cx="0" cy="0" r="720" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#c88020" stop-opacity="0.38"/>
      <stop offset="45%"  stop-color="#8a5010" stop-opacity="0.12"/>
      <stop offset="100%" stop-color="#0a0806" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="e2vig" cx="50%" cy="50%" r="72%">
      <stop offset="0%"   stop-color="transparent"/>
      <stop offset="100%" stop-color="#050402" stop-opacity="0.78"/>
    </radialGradient>
    <linearGradient id="e2desk" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#110e08"/>
      <stop offset="100%" stop-color="#0d0b06"/>
    </linearGradient>`;

  let body = '';

  // Background
  body += `<rect width="${W}" height="${H}" fill="url(#e2bg)"/>`;
  body += `<rect width="${W}" height="${H}" fill="url(#e2sunrise)"/>`;

  // Window frame (left)
  const winX = 55, winY = 55, winW = 195, winH = 270;
  // Morning light fill
  body += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="#c88020" opacity="0.07"/>`;
  // Window panes
  body += `<rect x="${winX}" y="${winY}" width="${winW}" height="${winH}" fill="none" stroke="#2a1e0a" stroke-width="1.2"/>`;
  body += `<line x1="${winX+winW/2}" y1="${winY}" x2="${winX+winW/2}" y2="${winY+winH}" stroke="#2a1e0a" stroke-width="0.8"/>`;
  body += `<line x1="${winX}" y1="${winY+winH/3}" x2="${winX+winW}" y2="${winY+winH/3}" stroke="#2a1e0a" stroke-width="0.8"/>`;
  body += `<line x1="${winX}" y1="${winY+winH*2/3}" x2="${winX+winW}" y2="${winY+winH*2/3}" stroke="#2a1e0a" stroke-width="0.8"/>`;
  // Outside building shapes (stylized)
  body += `<rect x="${winX+8}" y="${winY+15}" width="40" height="80" fill="#0d0a04" opacity="0.7"/>`;
  body += `<rect x="${winX+58}" y="${winY+30}" width="28" height="65" fill="#0d0a04" opacity="0.6"/>`;
  body += `<rect x="${winX+100}" y="${winY+8}" width="35" height="95" fill="#0d0a04" opacity="0.65"/>`;
  body += `<rect x="${winX+142}" y="${winY+22}" width="30" height="75" fill="#0d0a04" opacity="0.6"/>`;
  // Horizon glow (sunrise outside window)
  body += `<rect x="${winX+2}" y="${winY+winH*0.55}" width="${winW-4}" height="${winH*0.45-2}" fill="#c88020" opacity="0.09"/>`;

  // Light rays from window
  for (let i = 0; i < 5; i++) {
    const startY = winY + 60 + i * 38;
    const endX = winX + winW + 500 + i * 40;
    const endY = startY + (i - 2) * 30;
    const op = (0.035 - i * 0.004).toFixed(3);
    body += `<line x1="${winX+winW}" y1="${startY}" x2="${endX}" y2="${endY}" stroke="#c88020" stroke-width="${10 - i}" stroke-linecap="round" opacity="${op}"/>`;
  }

  // Desk surface
  const deskY = 345;
  body += `<rect x="0" y="${deskY}" width="${W}" height="${H - deskY}" fill="url(#e2desk)"/>`;
  body += `<line x1="0" y1="${deskY}" x2="${W}" y2="${deskY}" stroke="#2a2010" stroke-width="0.8"/>`;

  // ── Calendar grid (center-right) ──
  const calX = 720, calY = 80, calW = 255, calH = 215;
  body += `<rect x="${calX}" y="${calY}" width="${calW}" height="${calH}" fill="#0c0a07" stroke="#211a08" stroke-width="0.8"/>`;
  body += `<rect x="${calX}" y="${calY}" width="${calW}" height="26" fill="#181208"/>`;
  // Calendar day letters
  const days = ['S','M','T','W','T','F','S'];
  const cw = calW / 7;
  for (let d = 0; d < 7; d++) {
    const dx = calX + d * cw + cw / 2;
    body += `<text x="${dx.toFixed(0)}" y="${calY+17}" font-family="monospace" font-size="7.5" fill="#6a5020" text-anchor="middle">${days[d]}</text>`;
  }
  // Calendar cells
  const rowH = (calH - 26) / 5;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 7; col++) {
      const cellX = calX + col * cw;
      const cellY = calY + 26 + row * rowH;
      body += `<rect x="${cellX}" y="${cellY}" width="${cw}" height="${rowH}" fill="none" stroke="#181208" stroke-width="0.5"/>`;
      const num = row * 7 + col + 1;
      if (num <= 30) {
        // Day 15 = today (highlighted)
        const isToday = num === 15;
        // Days 1-14 = past (slightly highlighted)
        if (isToday) {
          body += `<circle cx="${(cellX+cw/2).toFixed(0)}" cy="${(cellY+rowH/2).toFixed(0)}" r="${(Math.min(cw,rowH)*0.38).toFixed(0)}" fill="#c88020" opacity="0.28"/>`;
        }
        const col2 = isToday ? '#c88020' : num < 15 ? '#3a2e10' : '#252010';
        body += `<text x="${(cellX+cw/2).toFixed(0)}" y="${(cellY+rowH/2+2.5).toFixed(0)}" font-family="monospace" font-size="7" fill="${col2}" text-anchor="middle">${num}</text>`;
      }
    }
  }

  // ── Clock face (far right) ──
  const clkX = 1080, clkY = 200, clkR = 78;
  body += `<circle cx="${clkX}" cy="${clkY}" r="${clkR}" fill="#0a0906" stroke="#211a08" stroke-width="1"/>`;
  for (let h = 0; h < 12; h++) {
    const ang = h * Math.PI / 6 - Math.PI / 2;
    const isMain = h % 3 === 0;
    const r1 = isMain ? clkR - 14 : clkR - 9;
    const x1 = clkX + Math.cos(ang) * r1;
    const y1 = clkY + Math.sin(ang) * r1;
    const x2 = clkX + Math.cos(ang) * (clkR - 4);
    const y2 = clkY + Math.sin(ang) * (clkR - 4);
    body += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="#2a2010" stroke-width="${isMain ? 1.5 : 0.7}"/>`;
  }
  // Hands: 8:52
  const hAng = ((8 + 52/60) / 12) * Math.PI * 2 - Math.PI / 2;
  const mAng = (52 / 60) * Math.PI * 2 - Math.PI / 2;
  body += `<line x1="${clkX}" y1="${clkY}" x2="${(clkX+Math.cos(hAng)*clkR*0.52).toFixed(1)}" y2="${(clkY+Math.sin(hAng)*clkR*0.52).toFixed(1)}" stroke="#c88020" stroke-width="2" stroke-linecap="round" opacity="0.8"/>`;
  body += `<line x1="${clkX}" y1="${clkY}" x2="${(clkX+Math.cos(mAng)*clkR*0.7).toFixed(1)}" y2="${(clkY+Math.sin(mAng)*clkR*0.7).toFixed(1)}" stroke="#c88020" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>`;
  body += `<circle cx="${clkX}" cy="${clkY}" r="3" fill="#c88020" opacity="0.8"/>`;

  // ── Geometric cactus on desk ──
  const cacX = 520, cacY = deskY;
  // Pot (trapezoid)
  body += `<polygon points="${cacX-17},${cacY} ${cacX+17},${cacY} ${cacX+11},${cacY+32} ${cacX-11},${cacY+32}" fill="#1a1208"/>`;
  body += `<line x1="${cacX-17}" y1="${cacY+10}" x2="${cacX+17}" y2="${cacY+10}" stroke="#261c0c" stroke-width="0.6"/>`;
  // Main trunk
  body += `<rect x="${cacX-5}" y="${cacY-82}" width="10" height="82" fill="#0a1e08" stroke="#162a10" stroke-width="0.5"/>`;
  // Left arm
  body += `<rect x="${cacX-20}" y="${cacY-56}" width="15" height="7" fill="#0a1e08" stroke="#162a10" stroke-width="0.5"/>`;
  body += `<rect x="${cacX-20}" y="${cacY-88}" width="7" height="38" fill="#0a1e08" stroke="#162a10" stroke-width="0.5"/>`;
  // Right arm
  body += `<rect x="${cacX+5}" y="${cacY-50}" width="15" height="7" fill="#0a1e08" stroke="#162a10" stroke-width="0.5"/>`;
  body += `<rect x="${cacX+13}" y="${cacY-80}" width="7" height="35" fill="#0a1e08" stroke="#162a10" stroke-width="0.5"/>`;

  // ── Post-it note ──
  const posX = 380, posY = deskY + 10;
  // Paper shadow
  body += `<rect x="${posX+2}" y="${posY+2}" width="116" height="74" rx="1" fill="#0a0804" transform="rotate(-2 ${posX+60} ${posY+40})"/>`;
  // Paper
  body += `<rect x="${posX}" y="${posY}" width="116" height="74" rx="1" fill="#1e1808" transform="rotate(-2 ${posX+60} ${posY+40})"/>`;
  body += `<text x="${posX+58}" y="${posY+30}" font-family="monospace" font-size="8" fill="#8a7020" text-anchor="middle" transform="rotate(-2 ${posX+60} ${posY+40})">오늘도</text>`;
  body += `<text x="${posX+58}" y="${posY+46}" font-family="monospace" font-size="8" fill="#8a7020" text-anchor="middle" transform="rotate(-2 ${posX+60} ${posY+40})">정시퇴근!</text>`;

  // ARI status indicator (small)
  const ariX = 310, ariY = deskY - 22;
  body += `<circle cx="${ariX}" cy="${ariY}" r="4" fill="#c88020" opacity="0.55"/>`;
  body += `<text x="${ariX+12}" y="${ariY+3}" font-family="monospace" font-size="8" fill="#c88020" opacity="0.45">ARI · 연결됨</text>`;

  // EP label
  body += `<text x="270" y="${H-22}" font-family="monospace" font-size="9" fill="#7a5820" opacity="0.4" letter-spacing="3">EP.02 · 적응의 기술</text>`;

  // Vignette
  body += `<rect width="${W}" height="${H}" fill="url(#e2vig)"/>`;

  return `<defs>${defs}</defs>${body}`;
}

// ── EP3: 공존의 공식 — Corporate Disruption ──────────────────────────────────
// Ominous. The Slack notification. Fracture. Stability was an illusion.
// Palette: cold near-black, red alert glow, crack pattern

function ep3() {
  const rng = makePrng(0xc3e4);

  // Pre-compute crack paths for SVG (deterministic)
  function crackPath(originX, originY, startAngle, totalLen, segs, jitter) {
    let px = originX, py = originY, angle = startAngle;
    let pts = `${px.toFixed(0)},${py.toFixed(0)}`;
    const segLen = totalLen / segs;
    for (let i = 0; i < segs; i++) {
      angle += (rng() - 0.5) * jitter;
      px += Math.sin(angle) * segLen;
      py += Math.cos(angle) * segLen;
      pts += ` ${px.toFixed(0)},${py.toFixed(0)}`;
    }
    return pts;
  }

  const defs = `
    <linearGradient id="e3bg" x1="0" y1="0" x2="${W}" y2="${H}" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#050505"/>
      <stop offset="100%" stop-color="#030308"/>
    </linearGradient>
    <radialGradient id="e3alert" cx="${W/2}" cy="145" r="380" gradientUnits="userSpaceOnUse">
      <stop offset="0%"   stop-color="#cc2200" stop-opacity="0.38"/>
      <stop offset="40%"  stop-color="#881100" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#030308" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="e3vig" cx="50%" cy="50%" r="72%">
      <stop offset="0%"   stop-color="transparent"/>
      <stop offset="100%" stop-color="#020202" stop-opacity="0.82"/>
    </radialGradient>
    <filter id="e3glow">
      <feGaussianBlur stdDeviation="9" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="e3bigglow">
      <feGaussianBlur stdDeviation="20" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>`;

  let body = '';

  // Background
  body += `<rect width="${W}" height="${H}" fill="url(#e3bg)"/>`;
  body += `<rect width="${W}" height="${H}" fill="url(#e3alert)"/>`;

  // Perspective floor grid
  const horizY = 245;
  const vpX = W / 2;
  // Horizontal lines
  for (let i = 0; i < 11; i++) {
    const t = i / 10;
    const y = horizY + t * (H - horizY);
    const op = (0.06 + t * 0.22).toFixed(2);
    body += `<line x1="0" y1="${y.toFixed(0)}" x2="${W}" y2="${y.toFixed(0)}" stroke="#161616" stroke-width="0.7" opacity="${op}"/>`;
  }
  // Vanishing-point lines
  for (let i = 0; i <= 18; i++) {
    const bx = (i / 18) * W;
    const diff = Math.abs(i - 9) / 9;
    const op = (0.06 + diff * 0.07).toFixed(2);
    body += `<line x1="${vpX.toFixed(0)}" y1="${horizY}" x2="${bx.toFixed(0)}" y2="${H}" stroke="#161616" stroke-width="0.7" opacity="${op}"/>`;
  }

  // Notification card
  const nX = vpX - 210, nY = 52, nW = 420, nH = 92;
  // Outer glow
  body += `<rect x="${nX-4}" y="${nY-4}" width="${nW+8}" height="${nH+8}" rx="8" fill="#cc2200" opacity="0.15" filter="url(#e3bigglow)"/>`;
  // Card body
  body += `<rect x="${nX}" y="${nY}" width="${nW}" height="${nH}" rx="5" fill="#0d0604" stroke="#882200" stroke-width="0.9"/>`;
  // Header bar
  body += `<rect x="${nX}" y="${nY}" width="${nW}" height="24" rx="5" fill="#180a06"/>`;
  body += `<rect x="${nX}" y="${nY+12}" width="${nW}" height="12" fill="#180a06"/>`;
  // Red dot
  body += `<circle cx="${nX+15}" cy="${nY+12}" r="5" fill="#cc2200" opacity="0.92"/>`;
  // Header text
  body += `<text x="${nX+30}" y="${nY+16}" font-family="monospace" font-size="9" fill="#cc5533" letter-spacing="1">긴급 공지 · Nextflow Corp</text>`;
  // Message lines
  body += `<text x="${nX+14}" y="${nY+42}" font-family="monospace" font-size="10" fill="#bb7755">조직 효율화 및 인력 재편에 관한 공지</text>`;
  body += `<text x="${nX+14}" y="${nY+61}" font-family="monospace" font-size="8.5" fill="#664444">일부 직책에 대한 역할 재조정이 즉시 시행됩니다.</text>`;
  body += `<text x="${nX+14}" y="${nY+78}" font-family="monospace" font-size="7.5" fill="#3a2020">— 인사팀</text>`;

  // Crack origin (bottom center of notification)
  const crackX = vpX, crackY = nY + nH;

  // Crack lines radiating downward
  const crackDefs = [
    { angle:  0.25, len: 340, segs: 7, jitter: 0.35, w: 1.2, op: 0.42 },
    { angle: -0.28, len: 310, segs: 7, jitter: 0.35, w: 1.1, op: 0.38 },
    { angle:  0.85, len: 255, segs: 5, jitter: 0.4,  w: 0.8, op: 0.30 },
    { angle: -0.88, len: 260, segs: 5, jitter: 0.4,  w: 0.8, op: 0.28 },
    { angle:  1.45, len: 200, segs: 4, jitter: 0.45, w: 0.6, op: 0.22 },
    { angle: -1.48, len: 195, segs: 4, jitter: 0.45, w: 0.6, op: 0.20 },
  ];
  for (const cd of crackDefs) {
    const pts = crackPath(crackX, crackY, cd.angle, cd.len, cd.segs, cd.jitter);
    // Glow
    body += `<polyline points="${pts}" fill="none" stroke="#ff4422" stroke-width="${cd.w * 2.5}" opacity="0.07" filter="url(#e3glow)"/>`;
    // Main crack
    body += `<polyline points="${pts}" fill="none" stroke="#cc3300" stroke-width="${cd.w}" opacity="${cd.op}"/>`;
    // Branch crack
    if (cd.len > 250) {
      const brPts = crackPath(crackX + (rng()-0.5)*60, crackY + 60 + rng()*40, cd.angle + (rng()>0.5?1:-1)*(0.5+rng()*0.4), cd.len * 0.42, 3, 0.5);
      body += `<polyline points="${brPts}" fill="none" stroke="#882200" stroke-width="${cd.w * 0.55}" opacity="${cd.op * 0.55}"/>`;
    }
  }

  // Broken node boxes (org chart remnants)
  const nodePositions = [
    [vpX - 280, 305], [vpX + 280, 305],
    [vpX - 160, 355], [vpX + 160, 355],
    [vpX - 390, 370], [vpX + 390, 370],
  ];
  for (const [nx, ny] of nodePositions) {
    const op = (0.08 + rng() * 0.1).toFixed(2);
    body += `<rect x="${nx-26}" y="${ny-13}" width="52" height="26" rx="2" fill="none" stroke="#441818" stroke-width="0.7" opacity="${op}"/>`;
    const xOp = (parseFloat(op) * 0.8).toFixed(2);
    body += `<line x1="${nx-13}" y1="${ny-6}" x2="${nx+13}" y2="${ny+6}" stroke="#cc2200" stroke-width="0.6" opacity="${xOp}"/>`;
    body += `<line x1="${nx+13}" y1="${ny-6}" x2="${nx-13}" y2="${ny+6}" stroke="#cc2200" stroke-width="0.6" opacity="${xOp}"/>`;
  }

  // Scatter particles
  for (let i = 0; i < 55; i++) {
    const ang = rng() * Math.PI * 2;
    const dist = 25 + rng() * 320;
    const px = crackX + Math.sin(ang) * dist;
    const py = crackY + Math.cos(ang) * dist * 0.65;
    if (px < 0 || px > W || py < 0 || py > H) continue;
    const r = (0.8 + rng() * 2.2).toFixed(1);
    const op = (0.04 + rng() * 0.18 * (1 - dist/340)).toFixed(2);
    const col = rng() > 0.5 ? '#cc2200' : '#ff5533';
    body += `<circle cx="${px.toFixed(0)}" cy="${py.toFixed(0)}" r="${r}" fill="${col}" opacity="${op}"/>`;
  }

  // Quote at bottom
  body += `<text x="${W/2}" y="${H-18}" font-family="monospace" font-size="8.5" fill="#441818" text-anchor="middle" opacity="0.55" letter-spacing="2">안정은 종종 다음 폭풍의 전조다</text>`;

  // EP label
  body += `<text x="270" y="${H-35}" font-family="monospace" font-size="9" fill="#441818" opacity="0.4" letter-spacing="3">EP.03 · 공존의 공식</text>`;

  // Vignette
  body += `<rect width="${W}" height="${H}" fill="url(#e3vig)"/>`;

  return `<defs>${defs}</defs>${body}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const slugArg = args.includes('--slug') ? args[args.indexOf('--slug') + 1] : null;
const force   = args.includes('--force');

const episodes = [
  { slug: 'ai-survival-ep1', fn: ep1 },
  { slug: 'ai-survival-ep2', fn: ep2 },
  { slug: 'ai-survival-ep3', fn: ep3 },
];

for (const ep of episodes) {
  if (slugArg && ep.slug !== slugArg) continue;
  const outPath = path.join(OUT_DIR, `${ep.slug}.png`);
  if (fs.existsSync(outPath) && !force) {
    console.log(`  skip (exists): ${ep.slug}.png — use --force to regenerate`);
    continue;
  }
  const body = ep.fn();
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">${body}</svg>`;
  try {
    await sharp(Buffer.from(svg)).png({ compressionLevel: 8 }).toFile(outPath);
    console.log(`  generated: ${ep.slug}.png`);
  } catch (err) {
    console.error(`  ERROR ${ep.slug}:`, err.message);
    // Write debug SVG
    const dbgPath = outPath.replace('.png', '-debug.svg');
    fs.writeFileSync(dbgPath, svg, 'utf8');
    console.error(`  debug SVG written: ${dbgPath}`);
  }
}
