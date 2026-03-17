export default function GitHubLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white p-2 text-slate-700 shadow-sm hover:bg-slate-50
                 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
      title="View code on GitHub"
      aria-label="View code on GitHub"
    >
      <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor" aria-hidden>
        <path d="M12 .5C5.73.5.75 5.61.75 12.03c0 5.14 3.2 9.5 7.64 11.04.56.1.77-.25.77-.55v-2.02c-3.11.7-3.77-1.55-3.77-1.55-.51-1.34-1.24-1.7-1.24-1.7-1.01-.72.08-.7.08-.7 1.12.08 1.71 1.18 1.71 1.18.99 1.74 2.6 1.24 3.23.95.1-.74.39-1.24.7-1.53-2.48-.29-5.09-1.27-5.09-5.66 0-1.25.43-2.27 1.14-3.07-.11-.29-.5-1.46.11-3.04 0 0 .93-.3 3.05 1.17a10.2 10.2 0 0 1 2.78-.38c.94 0 1.88.13 2.78.38 2.12-1.47 3.05-1.17 3.05-1.17.61 1.58.22 2.75.11 3.04.71.8 1.14 1.82 1.14 3.07 0 4.4-2.61 5.36-5.1 5.65.4.36.75 1.06.75 2.14v3.17c0 .3.2.65.78.55 4.43-1.55 7.62-5.9 7.62-11.04C23.25 5.61 18.27.5 12 .5Z" />
      </svg>
    </a>
  )
}

