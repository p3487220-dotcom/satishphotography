import Link from "next/link";
import { ArrowLeft, Camera } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-primary text-white flex items-center justify-center px-6 py-20">
      <div className="max-w-2xl w-full rounded-3xl border border-white/10 bg-[#050505]/80 p-8 sm:p-12 shadow-[0_0_60px_rgba(212,175,55,0.08)] text-center">
        <div className="flex justify-center mb-6">
          <div className="rounded-full border border-gold/30 bg-gold/10 p-4">
            <Camera className="h-8 w-8 text-gold" />
          </div>
        </div>

        <p className="text-[11px] uppercase tracking-[0.35em] text-gold/80 mb-4">
          404 Not Found
        </p>
        <h1 className="text-3xl sm:text-4xl font-serif font-light tracking-[0.2em] mb-4">
          This page has wandered off.
        </h1>
        <p className="text-sm sm:text-base text-white/70 leading-7 max-w-xl mx-auto">
          The page you requested could not be found. It may have moved, been removed, or the address may be incorrect.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-primary transition hover:bg-gold-light"
          >
            <ArrowLeft className="h-4 w-4" />
            Return Home
          </Link>
          <a
            href="mailto:erlasatish32@gmail.com"
            className="text-sm text-white/60 transition hover:text-gold"
          >
            Contact the studio
          </a>
        </div>
      </div>
    </main>
  );
}
