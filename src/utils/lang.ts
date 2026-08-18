/**
 * Language tagging for hand-authored bilingual text.
 *
 * Chinese text is tagged `lang="zh-Hans"` so it picks up the CJK font stack in
 * global.css and is pronounced correctly by screen readers. Imported by both
 * the client-side toggle and build-time templates, so it must stay DOM-free.
 */

const HAN = /\p{Script=Han}/u;

export function hasHan(text: string): boolean {
  return HAN.test(text);
}

export function langFor(text: string): string {
  return hasHan(text) ? 'zh-Hans' : 'en';
}
