import { site } from '../config/site';

export interface MetaInput {
  title: string;
  description: string;
  path: string;
  ogId?: string;
}

export interface Meta {
  title: string;
  description: string;
  canonical: string;
  ogImage: string;
}

export function buildMeta({ title, description, path, ogId }: MetaInput): Meta {
  const fullTitle = title === site.name ? title : `${title} — ${site.name}`;
  const canonical = new URL(path, site.url).href;
  const ogImage = new URL(`/og/${ogId ?? 'home'}.png`, site.url).href;
  return { title: fullTitle, description, canonical, ogImage };
}
