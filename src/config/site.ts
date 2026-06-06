export interface NavItem {
  label: string;
  href: string;
}

export interface SocialLink {
  label: string;
  href: string;
  /** key used to pick an icon */
  icon: 'instagram' | 'x' | 'linkedin' | 'github' | 'email';
}

export const site = {
  name: 'Sandeep J Ramanathan',
  shortName: 'Sandeep JR',
  email: 'sandeep.ramanathan@icloud.com',
  tagline: 'Building technology, music, and ideas that bring people closer together.',
  subline:
    "I'm a Staff Software Engineer, lifelong learner, musician, and Buddhist practitioner exploring how technology can create joy, dignity, and human connection.",
  url: 'https://sandeep-jr.github.io',
  nav: [
    { label: 'About', href: '/' },
    { label: 'Work', href: '/work' },
    { label: 'Engineering', href: '/engineering' },
    { label: 'Music', href: '/music' },
    { label: 'Blog', href: '/blog' },
    { label: 'Philosophy', href: '/philosophy' },
  ] satisfies NavItem[],
  socials: [
    { label: 'Instagram', href: 'https://www.instagram.com/sandy_jr_19/', icon: 'instagram' },
    { label: 'X', href: 'https://x.com/sjramanathan', icon: 'x' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sjramanathan', icon: 'linkedin' },
    { label: 'Email', href: 'mailto:sandeep.ramanathan@icloud.com', icon: 'email' },
  ] satisfies SocialLink[],
} as const;
