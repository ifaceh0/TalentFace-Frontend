/**
 * generate-pdf.js
 * Converts TalentFace_Changes_11_12_May2026.md to PDF using marked + puppeteer-core (if available)
 * or falls back to writing a self-contained HTML file.
 *
 * Run: node generate-pdf.js
 */

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require   = createRequire(import.meta.url);

const MD_PATH  = String.raw`C:\Users\HP\.gemini\antigravity\brain\8496b859-99da-4caa-b0c5-f669d76a8b74\TalentFace_Changes_11_12_May2026.md`;
const OUT_HTML = path.join(__dirname, 'TalentFace_Changes_11_12_May2026.html');

const md = readFileSync(MD_PATH, 'utf-8');

// ─── Minimal markdown → HTML (tables, headings, code, bold, lists) ───────────
function simpleMarkdown(src) {
  return src
    // Headings
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm,    '<h1>$1</h1>')
    // Horizontal rule
    .replace(/^---$/gm, '<hr>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // Code blocks
    .replace(/```[\w]*\n([\s\S]*?)```/gm, (_, code) =>
      `<pre><code>${code.replace(/</g,'&lt;').replace(/>/g,'&gt;')}</code></pre>`)
    // Tables
    .replace(/((?:^\|.+\|\n)+)/gm, (block) => {
      const rows = block.trim().split('\n').filter(r => !/^\|[-| :]+\|$/.test(r));
      const cells = rows.map((r, i) => {
        const tag = i === 0 ? 'th' : 'td';
        return '<tr>' + r.replace(/^\||\|$/g,'').split('|').map(c =>
          `<${tag}>${c.trim()}</${tag}>`).join('') + '</tr>';
      });
      return `<table><thead>${cells[0]}</thead><tbody>${cells.slice(1).join('')}</tbody></table>`;
    })
    // Lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>[\s\S]+?<\/li>\n?)+/g, m => `<ul>${m}</ul>`)
    // Diff lines inside pre (already handled above)
    // Paragraphs (lines not already wrapped)
    .replace(/^(?!<[huptoc]|<ul|<li|<pre|<hr|<table)(.+)$/gm, '<p>$1</p>')
    // Clean empty <p>
    .replace(/<p>\s*<\/p>/g, '');
}

const body = simpleMarkdown(md);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>TalentFace Change Log — 11–12 May 2026</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Segoe UI', Arial, sans-serif;
    font-size: 13px;
    line-height: 1.6;
    color: #1a1a2e;
    background: #fff;
    padding: 40px 48px;
    max-width: 900px;
    margin: auto;
  }
  h1 { font-size: 22px; color: #7f1d1d; border-bottom: 3px solid #7f1d1d; padding-bottom: 6px; margin: 28px 0 12px; }
  h2 { font-size: 17px; color: #1e293b; border-left: 4px solid #ef4444; padding-left: 10px; margin: 22px 0 10px; }
  h3 { font-size: 14px; color: #334155; margin: 18px 0 8px; }
  h4, h5, h6 { font-size: 13px; color: #475569; margin: 14px 0 6px; }
  p { margin: 6px 0; color: #374151; }
  hr { border: none; border-top: 1px solid #e2e8f0; margin: 20px 0; }
  ul { margin: 8px 0 8px 20px; }
  li { margin: 3px 0; color: #374151; }
  code {
    background: #f1f5f9;
    color: #be123c;
    padding: 1px 5px;
    border-radius: 4px;
    font-family: 'Cascadia Code', 'Consolas', monospace;
    font-size: 12px;
  }
  pre {
    background: #0f172a;
    color: #e2e8f0;
    padding: 14px 16px;
    border-radius: 8px;
    overflow-x: auto;
    margin: 10px 0;
    font-family: 'Cascadia Code', 'Consolas', monospace;
    font-size: 12px;
    line-height: 1.5;
  }
  pre code { background: none; color: inherit; padding: 0; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin: 10px 0;
    font-size: 12px;
  }
  th {
    background: #1e293b;
    color: #f8fafc;
    padding: 7px 10px;
    text-align: left;
    font-weight: 600;
  }
  td {
    padding: 6px 10px;
    border-bottom: 1px solid #e2e8f0;
    color: #374151;
  }
  tr:nth-child(even) td { background: #f8fafc; }
  strong { color: #0f172a; }
  @media print {
    body { padding: 20px 30px; }
    h1 { page-break-before: auto; }
    pre, table { page-break-inside: avoid; }
  }
</style>
</head>
<body>
${body}
<div style="margin-top:40px;padding-top:12px;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;text-align:center;">
  TalentFace Platform &mdash; Development Change Log &mdash; Generated 12 May 2026
</div>
</body>
</html>`;

writeFileSync(OUT_HTML, html, 'utf-8');
console.log('✅ HTML written to:', OUT_HTML);
console.log('');
console.log('👉 To get PDF: Open the HTML file in your browser, then press Ctrl+P → Save as PDF');
