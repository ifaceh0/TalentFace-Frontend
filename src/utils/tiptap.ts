import type { JSONContent } from '@tiptap/react';

/**
 * Recursively extract plain text from a Tiptap JSON document.
 * Mirrors utils/tiptap.util.js on the backend — keep both in sync.
 */
export function extractTextFromTiptapJSON(node: JSONContent | null | undefined): string {
  if (!node) return '';
  let text = node.text || '';
  if (Array.isArray(node.content)) {
    text += node.content.map(extractTextFromTiptapJSON).join(' ');
  }
  return text;
}

/** True if the doc has any real visible text (not just an empty paragraph) */
export function hasTiptapContent(node: JSONContent | null | undefined): boolean {
  return extractTextFromTiptapJSON(node).trim().length > 0;
}