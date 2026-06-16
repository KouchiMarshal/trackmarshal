"use client";

import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import { CheckCircle2, ClipboardList, MessageSquare, Search, ShieldCheck } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;
    if (hash && (hash.includes("access_token") || hash.includes("error_code") || hash.includes("type=email"))) {
      router.replace(`/auth/confirm${hash}`);
    }
  }, []);

  const steps = [
    {
      icon: Search,
      step: "01",
      title: "Publiez ou trouvez un événement",
      desc: "Les organisateurs publient leurs besoins en commissaires. Les commissaires parcourent les événements correspondant à leur profil.",
    },
    {
      icon: ClipboardList,
      step: "02",
      title: "Candidatez en un clic",
      desc: "Les commissaires postulent directement. Les organisateurs reçoivent les candidatures avec profil, licence et expérience vérifiés.",
    },
    {
      icon: CheckCircle2,
      step: "03",
      title: "Confirmez et communiquez",
      desc: "Acceptez les commissaires, envoyez le briefing, échangez via la messagerie intégrée. Tout est centralisé.",
    },
  ];


  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative flex min-h-screen items-center overflow-hidden pt-28 lg:pt-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541773367336-d14e1d89924f?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        </div>
        <div className="absolute left-0 top-0 h-[350px] w-[350px] rounded-full bg-[#FF5A1F]/10 blur-[120px] lg:h-[700px] lg:w-[700px] lg:blur-[220px]" />

        <div className="relative z-10 mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl">
            <div className="flex items-center gap-5">
              <img
                src="/logo.png"
                alt="TrackMarshal"
                className="h-20 w-20 rounded-full object-cover shadow-xl shadow-[#FF5A1F]/30 ring-2 ring-[#FF5A1F]/40 lg:h-28 lg:w-28"
              />
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F] sm:text-sm">
                Plateforme Motorsport Premium
              </p>
            </div>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[-0.05em] sm:text-6xl lg:text-[9rem]">
              Connecter.<br />
              Recruter.<br />
              <span className="text-[#FF5A1F]">Sécuriser.</span>
            </h1>

            <p className="mt-8 max-w-3xl text-lg leading-relaxed text-zinc-300 sm:text-xl lg:text-2xl">
              La plateforme moderne qui connecte organisateurs et commissaires motorsport partout en France.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link href="/events" className="flex h-14 items-center justify-center rounded-2xl bg-[#FF5A1F] px-8 text-base font-black transition hover:scale-[1.02] lg:h-16 lg:px-10 lg:text-lg">
                Voir les événements
              </Link>
              <Link href="/register" className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 text-base font-black transition hover:border-[#FF5A1F]/40 hover:bg-[#FF5A1F]/10 lg:h-16 lg:px-10 lg:text-lg">
                Créer un compte
              </Link>
            </div>
            <Link
              href="/devenir-commissaire"
              className="mt-5 inline-flex items-center gap-2 text-sm text-zinc-500 transition hover:text-[#FF5A1F]"
            >
              <span>Pas encore commissaire ?</span>
              <span className="font-bold text-[#FF5A1F]">Découvrez comment le devenir →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="border-t border-white/10 bg-[#050505] py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Simple et rapide</p>
            <h2 className="mt-4 text-4xl font-black lg:text-6xl">Comment ça marche</h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="relative rounded-[32px] border border-white/10 bg-white/[0.02] p-8 lg:p-10">
                <span className="text-8xl font-black text-white/5 absolute top-6 right-8 leading-none">{s.step}</span>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                  <s.icon size={24} className="text-[#FF5A1F]" />
                </div>
                <h3 className="mt-6 text-2xl font-black lg:text-3xl">{s.title}</h3>
                <p className="mt-4 text-lg leading-relaxed text-zinc-400">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/register" className="inline-flex h-16 items-center rounded-2xl bg-[#FF5A1F] px-10 text-lg font-black transition hover:scale-[1.02]">
              Rejoindre TrackMarshal
            </Link>
          </div>
        </div>
      </section>

      {/* Fonctionnalités */}
      <section className="border-t border-white/10 bg-black py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Tout ce qu'il vous faut</p>
            <h2 className="mt-4 text-4xl font-black lg:text-6xl">Une plateforme complète</h2>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {[
              { icon: ShieldCheck, title: "Profils vérifiés", text: "Licences FFSA/UFOLEP vérifiées manuellement. Les organisateurs savent exactement à qui ils ont affaire." },
              { icon: MessageSquare, title: "Messagerie intégrée", text: "Communication directe entre organisateurs et commissaires après acceptation. Zéro email externe nécessaire." },
              { icon: ClipboardList, title: "Gestion des candidatures", text: "Workflow complet : candidature → examen → acceptation/refus → briefing PDF téléchargeable." },
            ].map((item) => (
              <div key={item.title} className="rounded-[32px] border border-white/10 bg-white/[0.03] p-8 backdrop-blur-xl lg:p-12">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                  <item.icon size={24} className="text-[#FF5A1F]" />
                </div>
                <h3 className="mt-8 text-2xl font-black lg:text-3xl">{item.title}</h3>
                <p className="mt-5 text-lg leading-relaxed text-zinc-400">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="border-t border-white/10 bg-black py-20 lg:py-32">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 text-center">
          <img src="/logo.png" alt="TrackMarshal" className="mx-auto mb-8 h-20 w-20 rounded-full object-cover shadow-xl shadow-[#FF5A1F]/20 ring-2 ring-[#FF5A1F]/30" />
          <h2 className="text-4xl font-black lg:text-7xl">Prêt à démarrer ?</h2>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-zinc-400">
            Rejoignez la communauté des commissaires et organisateurs motorsport sur TrackMarshal.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row justify-center">
            <Link href="/register" className="flex h-16 items-center justify-center rounded-2xl bg-[#FF5A1F] px-10 text-lg font-black transition hover:scale-[1.02]">
              Créer un compte gratuit
            </Link>
            <Link href="/events" className="flex h-16 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 text-lg font-black transition hover:border-[#FF5A1F]/40">
              Parcourir les événements
            </Link>
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
