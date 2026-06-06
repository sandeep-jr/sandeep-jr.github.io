import { OGImageRoute } from 'astro-og-canvas';
import { site } from '../../config/site';

// One OG card per top-level page (ids match buildMeta ogId values).
const pages: Record<string, { title: string; description: string }> = {
  home: { title: site.name, description: site.tagline },
  work: { title: 'Work', description: 'Platforms in fintech, fraud, and money movement at scale.' },
  engineering: { title: 'Engineering', description: 'Distributed systems, cloud-native infra, and agentic AI.' },
  music: { title: 'Music', description: 'Violin, guitar, piano — music that brings people together.' },
  blog: { title: 'Blog', description: 'Engineering, leadership, and being human.' },
  philosophy: { title: 'Philosophy', description: 'Technology, Buddhism, peace, and human dignity.' },
};

export const { getStaticPaths, GET } = await OGImageRoute({
  param: 'route',
  pages,
  getImageOptions: (_path, page) => ({
    title: page.title,
    description: page.description,
    bgGradient: [[10, 10, 10]],
    border: { color: [227, 25, 55], width: 8, side: 'inline-start' },
    padding: 60,
  }),
});
