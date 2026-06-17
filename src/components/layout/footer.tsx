import Link from "next/link";

export default function Footer() {

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-[#050505]">

      <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/10 blur-[160px]" />

      <div className="relative z-20 mx-auto max-w-[1600px] px-8 py-24">

        <div className="grid gap-16 lg:grid-cols-4">

          <div className="lg:col-span-2">

            <div className="flex items-center gap-3">

              <div className="h-3 w-3 rounded-full bg-[#FF5A1F]" />

              <h2 className="text-3xl font-black">
                TrackMarshal
              </h2>

            </div>

            <p className="mt-8 max-w-xl text-lg leading-relaxed text-zinc-400">

              The premium international platform connecting motorsport marshals,
              officials and organizers across the world’s most iconic racing events.

            </p>

            <div className="mt-10 flex gap-4">

              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">

                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Events
                </p>

                <p className="mt-2 text-3xl font-black text-[#FF5A1F]">
                  215+
                </p>

              </div>

              <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 backdrop-blur-xl">

                <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">
                  Countries
                </p>

                <p className="mt-2 text-3xl font-black text-[#FF5A1F]">
                  28
                </p>

              </div>

            </div>

          </div>

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">

              Platform

            </p>

            <div className="mt-8 flex flex-col gap-5">

              <Link
                href="/events"
                className="text-zinc-400 transition hover:text-white"
              >
                Events
              </Link>

              <Link
                href="/dashboard"
                className="text-zinc-400 transition hover:text-white"
              >
                Dashboard
              </Link>

              <Link
                href="/login"
                className="text-zinc-400 transition hover:text-white"
              >
                Login
              </Link>

            </div>

          </div>

          <div>

            <p className="text-sm font-bold uppercase tracking-[0.2em] text-white">

              Motorsport

            </p>

            <div className="mt-8 flex flex-col gap-5">

              <p className="text-zinc-400">
                Formula
              </p>

              <p className="text-zinc-400">
                Endurance
              </p>

              <p className="text-zinc-400">
                Rally
              </p>

            </div>

          </div>

        </div>

        <div className="mt-20 border-t border-white/10 pt-8">

          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

            <p className="text-sm text-zinc-500">

              © 2026 TrackMarshal. All rights reserved.

            </p>

            <div className="flex items-center gap-8 text-sm text-zinc-500">

              <p>Privacy Policy</p>

              <p>Terms of Service</p>

              <p>Contact</p>

              <a
                href="https://www.instagram.com/trackmarshal.app"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram TrackMarshal"
                className="transition hover:text-[#FF5A1F]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>

            </div>

          </div>

        </div>

      </div>

    </footer>
  );
}