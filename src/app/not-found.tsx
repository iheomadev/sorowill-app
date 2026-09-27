import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="mx-auto max-w-xl rounded-xl border border-white/10 bg-white/5 p-8 text-center">
        <p className="text-5xl" aria-hidden="true">
          🔮
        </p>
        <h1 className="mt-4 text-2xl font-bold text-will-light">Page not found</h1>
        <p className="mt-2 text-sm text-will-light/60">
          The page or route you&apos;re looking for doesn&apos;t exist. It may have been moved,
          deleted, or you may have followed a mistyped link.
        </p>
        <p className="mt-1 text-sm text-will-light/40">
          Double-check the URL and try again, or navigate back to a known page.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-block rounded-full bg-will-purple px-5 py-2 text-sm font-medium text-white transition hover:bg-will-purple/90"
          >
            Go to home
          </Link>
          <Link
            href="/dashboard"
            className="inline-block rounded-full border border-white/20 px-5 py-2 text-sm text-will-light/70 transition hover:border-white/40 hover:text-will-light"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
