import { describe, it, expect } from 'vitest';
import { buildMeta } from './seo';

describe('buildMeta', () => {
  it('uses page title with site name suffix', () => {
    const m = buildMeta({ title: 'Work', description: 'd', path: '/work' });
    expect(m.title).toBe('Work — Sandeep J Ramanathan');
  });

  it('does not double-suffix the home title', () => {
    const m = buildMeta({ title: 'Sandeep J Ramanathan', description: 'd', path: '/' });
    expect(m.title).toBe('Sandeep J Ramanathan');
  });

  it('builds an absolute canonical url', () => {
    const m = buildMeta({ title: 'Work', description: 'd', path: '/work' });
    expect(m.canonical).toBe('https://sandeep-jr.github.io/work');
  });

  it('builds an absolute og image url from the og route', () => {
    const m = buildMeta({ title: 'Work', description: 'd', path: '/work', ogId: 'work' });
    expect(m.ogImage).toBe('https://sandeep-jr.github.io/og/work.png');
  });
});
