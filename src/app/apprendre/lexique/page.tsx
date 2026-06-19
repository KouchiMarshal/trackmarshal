"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const terms = [
  { letter: "A", term: "Aspiration", definition: "Technique de dépassement où un pilote se place dans le sillage aérodynamique du concurrent devant pour réduire la traînée et gagner en vitesse en ligne droite." },
  { letter: "A", term: "Autoclave", definition: "Zone fermée entre les stands et la piste, réservée aux commissaires et au personnel autorisé pendant la course." },
  { letter: "B", term: "Bac à graviers", definition: "Zone de dégagement remplie de graviers disposée en dehors de la piste pour ralentir les véhicules qui sortent de la trajectoire. Tend à être remplacé par les zones en asphalte." },
  { letter: "B", term: "Briefing", definition: "Réunion obligatoire avant chaque épreuve rassemblant tous les officiels. Le directeur de course y présente les procédures spécifiques, les zones de danger et les consignes de sécurité du jour." },
  { letter: "C", term: "Chef de poste", definition: "Commissaire responsable d'un poste de commissaires. Il coordonne son équipe, maintient la communication radio avec la direction de course et prend les décisions d'intervention." },
  { letter: "C", term: "Chicane", definition: "Série de virages alternatifs ajoutés volontairement sur un circuit pour réduire la vitesse à un endroit précis, souvent en remplacement d'une zone dangereuse." },
  { letter: "C", term: "Commissaire de piste", definition: "Officiel sportif positionné en bord de piste chargé d'assurer la sécurité des concurrents et d'appliquer les signaux réglementaires (drapeaux, panneaux)." },
  { letter: "C", term: "Cut (ou track limits)", definition: "Franchissement des limites de la piste par un concurrent, généralement matérialisé par des lignes blanches ou des vibreurs. Peut entraîner une pénalité ou l'annulation d'un temps." },
  { letter: "D", term: "Départ arrêté", definition: "Procédure de départ où les véhicules sont immobilisés sur la grille, moteur en marche. Les feux s'allument puis s'éteignent pour donner le signal." },
  { letter: "D", term: "Départ lancé", definition: "Procédure de départ où les concurrents effectuent un tour de formation (formation lap) avant de se positionner en mouvement derrière la ligne de départ." },
  { letter: "D", term: "Directeur de course", definition: "Officiel supérieur responsable de l'organisation et de la sécurité de la course. Il prend toutes les décisions relatives au déroulement de l'épreuve (SC, drapeaux rouges, pénalités)." },
  { letter: "D", term: "Drive-through", definition: "Pénalité obligeant le concurrent à traverser la voie des stands sans s'arrêter (passage obligatoire). Doit être effectuée dans un délai défini." },
  { letter: "D", term: "DRS (Drag Reduction System)", definition: "Système d'aileron arrière mobile utilisé en Formule 1 permettant de réduire la traînée aérodynamique pour faciliter les dépassements. Autorisé uniquement dans des zones définies." },
  { letter: "E", term: "ENCOC", definition: "Première licence commissaire FFSA (Commissaire C). Permet d'officier sur des épreuves nationales sous supervision. Point d'entrée de la carrière de commissaire automobile." },
  { letter: "E", term: "Épreuve spéciale (ES)", definition: "En rallye, portion de route fermée à la circulation sur laquelle les équipages s'affrontent en temps. La spéciale est chronométrée du départ à l'arrivée." },
  { letter: "E", term: "Exclusion", definition: "Sanction sportive retirant un concurrent de la compétition. Matérialisée par le drapeau noir. Peut être temporaire (stands) ou définitive." },
  { letter: "F", term: "FCY — Full Course Yellow", definition: "Procédure FFSA de neutralisation d'une course sans arrêt complet et sans Safety Car. Sur ordre du DC, tous les postes présentent un drapeau jaune agité + panneau « FCY ». Les pilotes doivent réduire leur allure à 80 km/h maximum — contrôlé par le chronométrage. Aucun dépassement autorisé. Fin de procédure signalée par un drapeau vert agité pendant 1 tour." },
  { letter: "F", term: "FFSA", definition: "Fédération Française du Sport Automobile. Organise et réglemente les compétitions automobiles en France. Délivre les licences des commissaires auto." },
  { letter: "F", term: "FFM", definition: "Fédération Française de Motocyclisme. Équivalent de la FFSA pour les compétitions moto. Délivre les licences OFS et OFF pour les commissaires moto." },
  { letter: "F", term: "FIA", definition: "Fédération Internationale de l'Automobile. Organisme mondial régissant le sport automobile international (F1, WRC, WEC...). Les commissaires EICOB peuvent officier sur ses épreuves." },
  { letter: "F", term: "Formation lap", definition: "Tour effectué par les concurrents avant le départ arrêté, permettant de réchauffer les pneus et de se positionner sur la grille dans l'ordre réglementaire." },
  { letter: "G", term: "Gravel trap", definition: "Voir Bac à graviers." },
  { letter: "G", term: "Grille de départ", definition: "Positionnement des concurrents sur la piste avant le départ, déterminé par les résultats des qualifications ou par le règlement de l'épreuve." },
  { letter: "H", term: "Homologation", definition: "Validation officielle qu'un équipement (circuit, véhicule, équipement de sécurité) est conforme aux normes réglementaires pour être utilisé en compétition." },
  { letter: "I", term: "Installation lap", definition: "Tour d'installation effectué par les pilotes en début de session pour vérifier le bon fonctionnement du véhicule avant de commencer réellement la session." },
  { letter: "L", term: "Lap record", definition: "Meilleur temps jamais réalisé sur un circuit en compétition. Peut être le tour le plus rapide d'une course (fastest lap) ou le record absolu du circuit." },
  { letter: "M", term: "Manche", definition: "Division d'une épreuve ou d'un championnat. Une course peut comporter plusieurs manches, chacune comptant pour le classement général." },
  { letter: "M", term: "Meatball flag", definition: "Nom informel du drapeau noir et orange (disque orange sur fond noir), signalant un problème mécanique apparent sur le véhicule d'un concurrent identifié par son numéro." },
  { letter: "C", term: "Code 60", definition: "Procédure FFSA de limitation de vitesse à 60 km/h sur l'ensemble du circuit. Signalée par un drapeau violet avec un cercle blanc portant le chiffre « 60 ». Agité à tous les postes sur ordre DC, puis tenu fixe. Retiré et remplacé par le drapeau vert agité à la reprise. Chaque tour sous Code 60 compte comme un tour de course." },
  { letter: "N", term: "Neutralisation", definition: "Période pendant laquelle la course est suspendue mais pas arrêtée. En FFSA circuit asphalte, elle peut être effectuée via le Safety Car (SC), le Full Course Yellow (FCY) à 80 km/h, ou le Code 60 à 60 km/h. Le VSC (Virtual Safety Car) est une procédure propre à la FIA/F1 et n'est pas utilisé en compétitions FFSA." },
  { letter: "O", term: "Out lap", definition: "Tour de sortie des stands permettant à un concurrent de rejoindre la piste et de réchauffer ses pneus avant d'entamer un tour chronométré rapide." },
  { letter: "P", term: "Parc fermé", definition: "Zone sécurisée où les véhicules sont parqués après la course ou les qualifications. Aucune intervention mécanique n'est autorisée sans permission des commissaires techniques." },
  { letter: "P", term: "Pit lane", definition: "Voie des stands longeant la piste principale. Les concurrents l'empruntent pour s'arrêter aux stands (ravitaillement, changement de pneus, réparations). Vitesse limitée." },
  { letter: "P", term: "Pit stop", definition: "Arrêt aux stands d'un concurrent pendant la course pour ravitaillement, changement de pneus ou réparations. Sa durée peut être cruciale stratégiquement." },
  { letter: "P", term: "Poste de commissaires", definition: "Zone délimitée en bord de piste où est positionnée une équipe de commissaires. Chaque poste a une zone de responsabilité définie et est équipé de drapeaux et d'une radio." },
  { letter: "R", term: "Reconnaissance", definition: "En rallye, passage sur les spéciales avant l'épreuve pour les équipages afin de prendre des notes (pace notes). Effectué à vitesse réduite sur route ouverte." },
  { letter: "S", term: "Safety Car (SC)", definition: "Véhicule de sécurité déployé sur la piste lors d'incidents nécessitant une neutralisation. Les concurrents doivent le suivre en file sans dépasser. Feux orange clignotants." },
  { letter: "S", term: "Scratch", definition: "Meilleur temps absolu sur une épreuve spéciale en rallye, toutes catégories confondues. Le concurrent ayant réalisé le scratch a été le plus rapide sur la spéciale." },
  { letter: "S", term: "Spéciale", definition: "Voir Épreuve spéciale (ES)." },
  { letter: "S", term: "Steward", definition: "Commissaire sportif chargé de juger les incidents et d'infliger les pénalités. Rôle distinct du commissaire de piste — les stewards n'interviennent pas physiquement sur la piste." },
  { letter: "S", term: "Stop and go", definition: "Pénalité obligeant le concurrent à s'arrêter dans sa boîte de stands pendant un temps défini (10 secondes, 30 secondes...). Plus sévère que le drive-through." },
  { letter: "T", term: "Tour de chauffe", definition: "Voir Formation lap." },
  { letter: "T", term: "Track limits", definition: "Voir Cut." },
  { letter: "V", term: "Virtual Safety Car (VSC)", definition: "Procédure de neutralisation FIA utilisée en Formule 1 et sur certaines épreuves FIA internationales. Sans déploiement physique du Safety Car, un delta time est imposé aux pilotes via l'affichage de leur volant. Les commissaires présentent un drapeau jaune fixe. Non utilisé dans les compétitions FFSA nationales, où son équivalent est le FCY (Full Course Yellow) à 80 km/h." },
  { letter: "V", term: "Voie des stands (Pit lane)", definition: "Voie longeant la piste principale, à vitesse réglementée, permettant aux concurrents d'accéder aux stands pour ravitaillement, changement de pneus ou réparations. Son accès reste ouvert sous Safety Car et FCY sauf instruction contraire du DC." },
  { letter: "V", term: "Voiture de tête", definition: "Terme parfois utilisé pour désigner le Safety Car, notamment en rallye ou dans les épreuves où un véhicule ouvre la route avant les concurrents." },
  { letter: "Z", term: "Zone de dégagement", definition: "Espace aménagé en dehors de la piste pour arrêter les véhicules sortant de trajectoire. Peut être en asphalte, gravier ou herbe selon le niveau d'homologation du circuit." },
];

const letters = [...new Set(terms.map((t) => t.letter))].sort();

export default function LexiquePage() {
  const [search, setSearch] = useState("");
  const [activeLetter, setActiveLetter] = useState<string | null>(null);

  const filtered = terms.filter((t) => {
    const matchSearch = search === "" || t.term.toLowerCase().includes(search.toLowerCase()) || t.definition.toLowerCase().includes(search.toLowerCase());
    const matchLetter = activeLetter === null || t.letter === activeLetter;
    return matchSearch && matchLetter;
  });

  const groupedFiltered = letters.reduce<Record<string, typeof terms>>((acc, l) => {
    const group = filtered.filter((t) => t.letter === l);
    if (group.length > 0) acc[l] = group;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1000px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/apprendre" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Glossaire</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Lexique motorsport</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Les termes essentiels du sport automobile et moto — de A à Z.
            Indispensable pour comprendre les briefings et communiquer avec les équipes.
          </p>

          {/* Search */}
          <div className="mt-10">
            <input
              type="text"
              placeholder="Rechercher un terme..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setActiveLetter(null); }}
              className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 px-5 py-4 text-zinc-900 placeholder-zinc-400 outline-none transition focus:border-[#FF5A1F] lg:text-lg"
            />
          </div>

          {/* Letter filter */}
          {search === "" && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={() => setActiveLetter(null)}
                className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] transition ${activeLetter === null ? "bg-[#FF5A1F] text-white" : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"}`}
              >
                Tout
              </button>
              {letters.map((l) => (
                <button
                  key={l}
                  onClick={() => setActiveLetter(activeLetter === l ? null : l)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black uppercase tracking-[0.1em] transition ${activeLetter === l ? "bg-[#FF5A1F] text-white" : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400"}`}
                >
                  {l}
                </button>
              ))}
            </div>
          )}

          {/* Results count */}
          {search !== "" && (
            <p className="mt-4 text-sm text-zinc-500">
              {filtered.length} résultat{filtered.length !== 1 ? "s" : ""} pour «&nbsp;{search}&nbsp;»
            </p>
          )}

          {/* Terms grouped by letter */}
          <div className="mt-10 space-y-10">
            {Object.entries(groupedFiltered).map(([letter, group]) => (
              <div key={letter}>
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-4xl font-black text-[#FF5A1F]/40 lg:text-5xl">{letter}</span>
                  <div className="h-px flex-1 bg-zinc-200" />
                </div>
                <div className="space-y-3">
                  {group.map((t) => (
                    <div key={t.term} className="rounded-[24px] border border-zinc-200 bg-white shadow-sm px-6 py-4 transition hover:border-zinc-300">
                      <p className="font-black text-zinc-900">{t.term}</p>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-600">{t.definition}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filtered.length === 0 && (
              <div className="py-16 text-center">
                <p className="text-5xl">🔍</p>
                <p className="mt-4 text-zinc-500">Aucun terme trouvé pour «&nbsp;{search}&nbsp;»</p>
              </div>
            )}
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
