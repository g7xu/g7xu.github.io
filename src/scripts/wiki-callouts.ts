import type { TokenizerAndRendererExtension, Tokens } from 'marked';

const TYPES = [
  'note',
  'info',
  'tip',
  'question',
  'warning',
  'danger',
  'failure',
  'bug',
  'example',
  'quote',
  'success',
  'abstract',
] as const;
type CalloutType = (typeof TYPES)[number];
const TYPE_SET: ReadonlySet<string> = new Set(TYPES);

const ICONS: Record<CalloutType, string> = {
  note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4Z"/></svg>',
  info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
  tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5Z"/></svg>',
  question:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  warning:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0Z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  danger:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  failure:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
  bug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="6" width="8" height="14" rx="4"/><path d="M12 20v-9"/><path d="M6.53 9 4 8"/><path d="M6 13H2"/><path d="M6 17l-2 2"/><path d="m17.47 9 2.53-1"/><path d="M18 13h4"/><path d="m18 17 2 2"/><path d="M8 6a4 4 0 0 1 8 0"/></svg>',
  example:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  quote:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  success:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  abstract:
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 2h6a2 2 0 0 1 2 2v2H7V4a2 2 0 0 1 2-2Z"/><rect x="5" y="6" width="14" height="16" rx="2"/><line x1="9" y1="12" x2="15" y2="12"/><line x1="9" y1="16" x2="15" y2="16"/></svg>',
};

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

interface CalloutToken extends Tokens.Generic {
  type: 'callout';
  raw: string;
  calloutType: CalloutType;
  calloutTitle: string;
  tokens: Tokens.Generic[];
}

export const calloutExtension: TokenizerAndRendererExtension = {
  name: 'callout',
  level: 'block',
  start(src: string) {
    const idx = src.search(/^> \[!/m);
    return idx === -1 ? undefined : idx;
  },
  tokenizer(src: string): CalloutToken | undefined {
    const header = /^> \[!([A-Za-z]+)\][ \t]*([^\n]*)(?:\n|$)/.exec(src);
    if (!header || header.index !== 0) return undefined;
    const type = header[1].toLowerCase();
    if (!TYPE_SET.has(type)) return undefined;

    const afterHeader = src.slice(header[0].length);
    const lines = afterHeader.split('\n');
    const bodyLines: string[] = [];
    let consumedChars = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line === '>' || /^> /.test(line)) {
        bodyLines.push(line === '>' ? '' : line.slice(2));
        consumedChars += line.length + (i < lines.length - 1 ? 1 : 0);
      } else {
        break;
      }
    }

    const raw = header[0] + afterHeader.slice(0, consumedChars);
    const body = bodyLines.join('\n');
    const title = header[2].trim() || capitalize(type);
    const bodyTokens: Tokens.Generic[] = [];
    this.lexer.blockTokens(body, bodyTokens);

    return {
      type: 'callout',
      raw,
      calloutType: type as CalloutType,
      calloutTitle: title,
      tokens: bodyTokens,
    };
  },
  renderer(token) {
    const t = token as CalloutToken;
    const inner = this.parser.parse(t.tokens);
    const icon = ICONS[t.calloutType];
    const title = escapeHtml(t.calloutTitle);
    return (
      `<div class="callout callout-${t.calloutType}" data-callout="${t.calloutType}">` +
      `<div class="callout-title">${icon}<span class="callout-title-text">${title}</span></div>` +
      `<div class="callout-body">${inner}</div>` +
      `</div>`
    );
  },
};
