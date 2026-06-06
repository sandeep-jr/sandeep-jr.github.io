import { useState } from 'react';
import { site } from '../../config/site';
import { cn } from '../../lib/cn';

export default function Nav({ pathname }: { pathname: string }) {
  const [open, setOpen] = useState(false);
  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href);

  return (
    <nav className="flex items-center gap-1">
      <button
        type="button"
        className="rounded-md px-3 py-2 text-sm text-muted hover:text-ink md:hidden"
        aria-expanded={open}
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
      >
        Menu
      </button>
      <ul
        className={cn(
          'gap-1 md:flex',
          open
            ? 'absolute left-0 right-0 top-full flex flex-col border-b border-hair bg-elev p-4 md:static md:flex-row md:border-0 md:bg-transparent md:p-0'
            : 'hidden md:flex',
        )}
      >
        {site.nav.map((item) => (
          <li key={item.href}>
            <a
              href={item.href}
              aria-current={isActive(item.href) ? 'page' : undefined}
              onClick={() => setOpen(false)}
              className={cn(
                'rounded-md px-3 py-2 text-sm transition-colors hover:text-ink',
                isActive(item.href) ? 'text-accent' : 'text-muted',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
