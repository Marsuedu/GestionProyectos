import React, { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const isDark = saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDark(isDark);
    // Ensure global html does not keep a stale dark class
    document.documentElement.classList.remove('dark');
    const authRoot = document.getElementById('auth-root');
    const siteRoot = document.getElementById('site-root');
    if (authRoot) authRoot.classList.toggle('dark', isDark);
    if (siteRoot) siteRoot.classList.toggle('dark', isDark);
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    // Always manage dark mode only on the authenticated root container
    document.documentElement.classList.remove('dark');
    const authRoot = document.getElementById('auth-root');
    const siteRoot = document.getElementById('site-root');
    if (authRoot) authRoot.classList.toggle('dark', next);
    if (siteRoot) siteRoot.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  }

  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:border-zinc-700 dark:hover:bg-zinc-900"
      aria-label="Toggle theme"
    >
      {dark ? (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M21.64 13.03A9 9 0 0 1 11 2a1 1 0 0 0-1 1a7 7 0 0 0 8.95 8.95a1 1 0 0 0 .69-1.92Z"/></svg>
      ) : (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M6.76 4.84l-1.8-1.79L3.17 4.83l1.79 1.8l1.8-1.79zM1 13h3v-2H1v2zm10 9h2v-3h-2v3zm9-9h3v-2h-3v2zM17.24 4.84l1.79-1.8l1.79 1.8l-1.8 1.79l-1.78-1.79zM12 5a7 7 0 1 0 .001 14.001A7 7 0 0 0 12 5zm0 12a5 5 0 1 1 .001-10.001A5 5 0 0 1 12 17zm7.07 3.04l1.79 1.79l1.79-1.79l-1.8-1.8l-1.78 1.8zM4.93 20.04l-1.8 1.79l1.8 1.79l1.79-1.8l-1.79-1.78z"/></svg>
      )}
      <span className="hidden sm:inline">{dark ? 'Oscuro' : 'Claro'}</span>
    </button>
  );
}
