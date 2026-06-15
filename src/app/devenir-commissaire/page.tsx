"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Flag,
  ShieldCheck,
  Star,
  Users,
} from "lucide-react";

const roles = [
  {
    icon: Flag,
    title: "Commissaire de piste",
    desc: "Présent aux postes de sécurité le long du circuit ou de la spéciale. Vous signalez les incidents avec les drapeaux et protégez les pilotes et le public.",
  },
  {
    icon: ShieldCheck,
    title: "Commissaire technique",
    desc: "Vous vérifiez la conformité des véhicules au règlement technique avant et après les épreuves.",
  },
  {
    icon: ClipboardList,
    title: "Commissaire sportif",
    desc: "Vous appliquez le règlement sportif, gérez les réclamations et participez aux décisions officielles.",
  },
  {
    icon: Users,
    title: "Commissaire au pointage",
    desc: "Vous enregistrez les passages des concurrents et transmettez les informations en temps réel au chronométrage.",
  },
];

const steps = [
  {
    num: "01",
    title: "Créer un compte e-licence FFSA",
    desc: "Rendez-vous sur la plateforme officielle FFSA pour créer votre compte. C'est l'étape de départ obligatoire pour accéder à la formation en ligne.",
    link: { href: "https://licence.ffsa.org/", label: "Accéder à la plateforme FFSA" },
  },
  {
    num: "02",
    title: "Suivre la formation e-learning",
    desc: "La FFSA propose une formation certifiante 100 % en ligne : code des drapeaux, règles de sécurité, droits et devoirs du commissaire, procédures radio. Un quiz final valide vos connaissances. Aucune expérience préalable requise.",
    link: { href: "https://licence.ffsa.org/", label: "Faire la formation en ligne" },
  },
  {
    num: "03",
    title: "Réaliser un stage pratique",
    desc: "Après la formation théorique, vous participez à un stage terrain organisé par un club affilié FFSA. Maniement des drapeaux, extincteurs, radio… La pratique complète la théorie.",
  },
  {
    num: "04",
    title: "Obtenir votre licence Commissaire C",
    desc: "Avec la formation validée et le stage réalisé, vous obtenez votre première licence officielle FFSA Commissaire C. Elle vous assure sur toutes les épreuves et est renouvelable chaque année. Âge minimum : 16 ans.",
  },
  {
    num: "05",
    title: "Créer votre profil TrackMarshal",
    desc: "Inscrivez-vous sur TrackMarshal, ajoutez votre licence, vos disciplines et vos disponibilités. Les organisateurs vous trouvent et vous contactent directement pour leurs événements.",
  },
];

const licenses = [
  {
    grade: "C",
    subtitle: "Débutant — dès 16 ans",
    desc: "Premier niveau pour se lancer. Permet d'officier sur toutes les épreuves auto, circuit et karting en France. S'obtient après la formation e-learning FFSA et un stage pratique. Les mineurs doivent être accompagnés au poste.",
    color: "border-white/10 bg-white/[0.03]",
    badge: "text-zinc-300",
  },
  {
    grade: "B",
    subtitle: "Confirmé — dès 18 ans",
    desc: "Après plusieurs saisons en grade C. Donne accès aux épreuves nationales et permet d'occuper des postes à responsabilité comme chef de poste adjoint.",
    color: "border-[#FF5A1F]/30 bg-[#FF5A1F]/5",
    badge: "text-[#FF5A1F]",
  },
  {
    grade: "A",
    subtitle: "Expert — Chef de Poste",
    desc: "Le niveau le plus élevé. Réservé aux commissaires les plus expérimentés. Permet de diriger un poste de commissaires et d'officier sur les plus grandes épreuves nationales et internationales.",
    color: "border-white/10 bg-white/[0.03]",
    badge: "text-zinc-300",
  },
];

const faqs = [
  {
    q: "Quel est l'âge minimum pour devenir commissaire FFSA ?",
    a: "16 ans. Les mineurs peuvent obtenir la licence Commissaire C avec une autorisation parentale, mais ils ne peuvent pas officier seuls à un poste — ils doivent être accompagnés d'un commissaire expérimenté.",
  },
  {
    q: "Faut-il avoir de l'expérience en motorsport pour commencer ?",
    a: "Non. La formation e-learning FFSA est accessible à tous, sans prérequis. La motivation, la rigueur et la disponibilité sont les qualités les plus recherchées par les organisateurs.",
  },
  {
    q: "La formation e-learning est-elle vraiment obligatoire ?",
    a: "Oui, c'est la porte d'entrée officielle depuis que la FFSA a mis en place sa plateforme en ligne (licence.ffsa.org). Elle est suivie d'un stage pratique auprès d'un club affilié avant d'obtenir la licence C.",
  },
  {
    q: "Est-ce que c'est bénévole ou rémunéré ?",
    a: "La plupart des missions sont bénévoles, mais de nombreux organisateurs proposent des avantages : hébergement, repas, défraiement, pass accompagnants. TrackMarshal vous permet de voir ces conditions avant de postuler.",
  },
  {
    q: "Combien coûte une licence FFSA Commissaire ?",
    a: "Une licence de commissaire FFSA coûte environ 40 à 80 € par an selon le grade. Elle inclut une assurance pour toutes les épreuves officielles auxquelles vous participez.",
  },
];

export default function DevenirCommissairePage() {
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.replace("/dashboard");
    });
  }, [router]);

  return (
    <main className="min-h-screen bg-black text-white">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-24 lg:pt-44 lg:pb-32">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1541773367336-d14e1d89924f?q=80&w=2070&auto=format&fit=crop"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-black/85" />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>
        <div className="absolute left-0 top-0 h-[600px] w-[600px] rounded-full bg-[#FF5A1F]/10 blur-[200px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-5 py-2 text-sm font-bold text-[#FF5A1F]">
              <Flag size={16} />
              Guide complet
            </div>

            <h1 className="mt-6 text-5xl font-black uppercase leading-[0.92] tracking-[-0.03em] sm:text-6xl lg:text-8xl">
              Devenir<br />
              commissaire<br />
              <span className="text-[#FF5A1F]">de piste.</span>
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-zinc-300 lg:text-xl">
              Le rôle de commissaire de piste est essentiel à la sécurité du motorsport.
              Découvrez comment vous lancer, obtenir votre licence et trouver vos premières missions.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/register"
                className="flex h-14 items-center justify-center gap-3 rounded-2xl bg-[#FF5A1F] px-8 font-black transition hover:scale-[1.02] lg:h-16"
              >
                Créer mon profil commissaire
                <ChevronRight size={20} />
              </Link>
              <Link
                href="/events"
                className="flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 font-black transition hover:border-[#FF5A1F]/40 lg:h-16"
              >
                Voir les événements
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* C'est quoi un commissaire */}
      <section className="border-t border-white/10 bg-[#050505] py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Le rôle</p>
              <h2 className="mt-4 text-4xl font-black lg:text-6xl">C'est quoi un commissaire de piste ?</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                Les commissaires de piste sont les garants de la sécurité lors des épreuves motorsport.
                Positionnés à des postes stratégiques, ils surveillent la course, signalent les incidents
                aux pilotes via les drapeaux réglementaires et interviennent en cas d'accident.
              </p>
              <p className="mt-4 text-lg leading-relaxed text-zinc-400">
                Sans eux, aucune épreuve officielle ne peut se tenir. C'est un rôle indispensable,
                valorisant et accessible à toutes et tous — que vous soyez passionné de motorsport
                ou simple curieux souhaitant vivre les courses de l'intérieur.
              </p>
              <div className="mt-8 space-y-3">
                {["Aucun permis de conduire requis", "Accessible dès 16 ans", "Formation e-learning + stage pratique FFSA", "Couverture assurance incluse avec la licence"].map((item) => (
                  <div key={item} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle2 size={18} className="shrink-0 text-[#FF5A1F]" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {roles.map((role) => (
                <div key={role.title} className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF5A1F]/10">
                    <role.icon size={22} className="text-[#FF5A1F]" />
                  </div>
                  <h3 className="mt-5 text-lg font-black">{role.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-zinc-400">{role.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Les licences */}
      <section className="border-t border-white/10 bg-black py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Officiel</p>
            <h2 className="mt-4 text-4xl font-black lg:text-6xl">Les licences</h2>
            <p className="mt-5 mx-auto max-w-2xl text-zinc-400 text-lg">
              Pour officier dans une épreuve officielle, vous avez besoin d'une licence fédérale.
              Elle vous couvre en assurance et vous identifie comme officiel agréé.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {licenses.map((lic) => (
              <div key={lic.grade} className={`rounded-[32px] border p-8 ${lic.color}`}>
                <span className={`text-xs font-black uppercase tracking-[0.2em] ${lic.badge}`}>FFSA</span>
                <div className="mt-4 flex items-baseline gap-3">
                  <span className={`text-5xl font-black ${lic.badge}`}>{lic.grade}</span>
                  <h3 className="text-xl font-black text-white">{lic.subtitle}</h3>
                </div>
                <p className="mt-4 text-zinc-400 leading-relaxed">{lic.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-[24px] border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 p-6 text-center">
            <p className="text-sm text-zinc-300">
              La formation e-learning officielle FFSA est disponible sur{" "}
              <a href="https://licence.ffsa.org/" target="_blank" rel="noopener noreferrer" className="font-bold text-[#FF5A1F] hover:underline">
                licence.ffsa.org
              </a>
              {" "}— plateforme officielle pour créer votre compte et suivre la formation certifiante.
            </p>
          </div>
        </div>
      </section>

      {/* Les étapes */}
      <section className="border-t border-white/10 bg-[#050505] py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-14">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Par où commencer</p>
            <h2 className="mt-4 text-4xl font-black lg:text-6xl">5 étapes pour débuter</h2>
          </div>

          <div className="space-y-4">
            {steps.map((step, i) => (
              <div key={step.num} className="flex gap-6 rounded-[28px] border border-white/10 bg-white/[0.02] p-6 lg:p-8">
                <div className="shrink-0">
                  <span className="text-5xl font-black text-white/10">{step.num}</span>
                </div>
                <div>
                  <h3 className="text-xl font-black lg:text-2xl">{step.title}</h3>
                  <p className="mt-3 text-zinc-400 leading-relaxed">{step.desc}</p>
                  {"link" in step && step.link && (
                    <a
                      href={step.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl border border-[#FF5A1F]/40 bg-[#FF5A1F]/10 px-6 py-3 text-sm font-black text-[#FF5A1F] transition hover:bg-[#FF5A1F]/20"
                    >
                      {step.link.label} <ChevronRight size={16} />
                    </a>
                  )}
                  {i === 4 && (
                    <Link
                      href="/register"
                      className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-6 py-3 text-sm font-black transition hover:scale-[1.01]"
                    >
                      Créer mon profil <ChevronRight size={16} />
                    </Link>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TrackMarshal dans tout ça */}
      <section className="border-t border-white/10 bg-black py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">TrackMarshal</p>
              <h2 className="mt-4 text-4xl font-black lg:text-6xl">Votre plateforme pour trouver des missions</h2>
              <p className="mt-6 text-lg leading-relaxed text-zinc-400">
                Une fois votre licence en poche, TrackMarshal vous connecte directement aux organisateurs
                qui recherchent des commissaires qualifiés pour leurs épreuves.
              </p>
              <div className="mt-8 space-y-4">
                {[
                  { icon: BookOpen, text: "Profil centralisé avec votre licence, expérience et disponibilités" },
                  { icon: Star, text: "Évaluations après chaque événement pour valoriser votre sérieux" },
                  { icon: ClipboardList, text: "Briefings téléchargeables avant chaque épreuve" },
                  { icon: Users, text: "Messagerie directe avec les organisateurs après acceptation" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FF5A1F]/10">
                      <Icon size={18} className="text-[#FF5A1F]" />
                    </div>
                    <p className="text-zinc-300 leading-relaxed">{text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[40px] border border-white/10 bg-white/[0.03] p-8 lg:p-12">
              <img src="/logo.png" alt="TrackMarshal" className="mb-8 h-20 w-20 rounded-full object-cover shadow-xl shadow-[#FF5A1F]/20 ring-2 ring-[#FF5A1F]/30" />
              <h3 className="text-3xl font-black">Prêt à officier ?</h3>
              <p className="mt-4 text-zinc-400">
                Créez votre profil gratuitement, ajoutez votre licence et commencez à postuler aux événements qui vous correspondent.
              </p>
              <div className="mt-8 space-y-4">
                <Link
                  href="/register"
                  className="flex h-14 w-full items-center justify-center gap-3 rounded-2xl bg-[#FF5A1F] font-black transition hover:scale-[1.01]"
                >
                  Créer mon profil gratuit
                  <ChevronRight size={20} />
                </Link>
                <Link
                  href="/events"
                  className="flex h-14 w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 font-black transition hover:border-[#FF5A1F]/40"
                >
                  Voir les événements disponibles
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/10 bg-[#050505] py-20 lg:py-32">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8">
          <div className="mb-14 text-center">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Questions fréquentes</p>
            <h2 className="mt-4 text-4xl font-black lg:text-6xl">FAQ</h2>
          </div>

          <div className="mx-auto max-w-3xl space-y-4">
            {faqs.map((faq) => (
              <div key={faq.q} className="rounded-[24px] border border-white/10 bg-white/[0.02] p-6 lg:p-8">
                <h3 className="text-lg font-black">{faq.q}</h3>
                <p className="mt-3 text-zinc-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
