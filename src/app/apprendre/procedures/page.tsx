import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

const procedures = [
  {
    emoji: "🚗",
    title: "Safety Car (SC)",
    headerBg: "bg-yellow-500/10 border-yellow-500/30",
    headerText: "text-yellow-400",
    contexte:
      "Incident ou danger grave nécessitant une neutralisation de la course, sans pour autant justifier l'arrêt complet.",
    role: "Présenter le drapeau jaune agité + panneau SC sur TOUS les postes. Le drapeau vert n'est montré qu'à la ligne de relance.",
    etapes: [
      "Sur décision de la direction de course, le Safety Car sort des stands feux orange allumés.",
      "TOUS les postes présentent simultanément le drapeau jaune agité et le panneau « SC ».",
      "Un double drapeau jaune agité est présenté au poste précédant le lieu de l'incident.",
      "Les concurrents se rangent en file derrière le SC — tout dépassement est interdit.",
      "L'accès à la voie des stands reste ouvert ; la sortie est réglée par un feu vert (éteint quand le SC passe).",
      "Quand le DC rappelle le SC, ses feux orange s'éteignent. Les drapeaux jaunes sont retirés — seuls les panneaux « SC » restent.",
      "Quand le SC rentre aux stands, les panneaux « SC » sont retirés. Le drapeau VERT est montré UNIQUEMENT sur la ligne de relance.",
    ],
    pointCritique:
      "Le drapeau vert n'est présenté qu'à la ligne de relance — JAMAIS sur tous les postes lors d'un SC.",
  },
  {
    emoji: "📋",
    title: "FCY — Full Course Yellow (Jaune Total)",
    headerBg: "bg-blue-500/10 border-blue-500/30",
    headerText: "text-blue-400",
    contexte:
      "Incident nécessitant une intervention sur la piste ou ses abords, sans justifier l'arrêt de la course ni le déploiement du SC.",
    role: "Sur ordre DC : agiter le drapeau jaune + présenter le panneau « FCY » sur TOUS les postes pendant toute la durée de l'intervention.",
    etapes: [
      "La direction de course déclare le régime FCY (Full Course Yellow) par radio.",
      "Chaque poste agite un drapeau JAUNE et présente simultanément le panneau « FCY ».",
      "Si l'incident est sur la trajectoire de course, un double drapeau jaune est présenté au poste précédant le danger.",
      "Les pilotes doivent immédiatement réduire leur allure à 80 km/h maximum — contrôlé par le chronométrage.",
      "Tout dépassement est interdit. Toute infraction peut être sanctionnée par les commissaires sportifs.",
      "Une fois le problème résolu, le DC autorise la reprise.",
      "Tous les postes remplacent le jaune + FCY par un drapeau VERT agité pendant 1 tour.",
    ],
    pointCritique:
      "Limite de vitesse : 80 km/h maximum en FCY. Le contrôle est automatique par chronométrage.",
  },
  {
    emoji: "🟣",
    title: "Code 60",
    headerBg: "bg-purple-500/10 border-purple-500/30",
    headerText: "text-purple-400",
    contexte:
      "Limitation de vitesse unique imposée sur tout le circuit, déclenchée par deux drapeaux jaunes lors d'essais ou de course. Alternative au FCY.",
    role: "Agiter le drapeau violet (cercle blanc « 60 ») sur ordre DC, simultanément à tous les postes — puis le maintenir fixe une fois les voitures ralenties.",
    etapes: [
      "Sur instruction DC, le drapeau Code 60 (violet avec cercle blanc « 60 ») est AGITÉ sur la ligne de départ et à tous les postes.",
      "Le drapeau reste AGITÉ au moins 1 tour complet, jusqu'à ce que toutes les voitures soient visiblement à 60 km/h.",
      "Il est ensuite maintenu FIXE jusqu'au retrait ordonné par la direction de course.",
      "Les drapeaux jaunes continuent d'être agités au poste précédant l'incident — mais sans drapeau vert à la suite.",
      "Chaque tour effectué sous Code 60 compte comme un tour de course.",
      "Quand le DC retire le Code 60, le drapeau est immédiatement remplacé par un drapeau VERT agité à tous les postes.",
      "Les dépassements restent interdits jusqu'à l'affichage du drapeau vert.",
    ],
    pointCritique:
      "Limite de vitesse : 60 km/h. Le Code 60 est utilisé uniquement si les vitesses peuvent être surveillées en direct.",
  },
  {
    emoji: "🔴",
    title: "Drapeau rouge — Arrêt de séance",
    headerBg: "bg-red-500/10 border-red-500/30",
    headerText: "text-red-400",
    contexte:
      "Incident grave, obstacle majeur ou météo dangereuse.",
    role: "Agiter vigoureusement le drapeau rouge et rester en position jusqu'à ordre de la direction.",
    etapes: [
      "La direction de course décrète l'arrêt — annonce radio simultanée sur tous les postes.",
      "Tous les commissaires présentent et agitent vigoureusement le drapeau rouge.",
      "Les pilotes ralentissent immédiatement et rejoignent les stands ou la grille selon instruction.",
      "Aucun dépassement autorisé (sauf voitures arrêtées sur la trajectoire).",
      "Les commissaires restent en position, drapeaux agités, jusqu'à ordre de la direction.",
      "Les équipes d'intervention peuvent accéder à la piste en sécurité.",
      "La séance peut être suspendue, reprise ou arrêtée définitivement.",
    ],
    pointCritique:
      "Ne quittez pas votre poste avant ordre explicite de la direction de course.",
  },
  {
    emoji: "🚑",
    title: "Évacuation d'un véhicule",
    headerBg: "bg-orange-500/10 border-orange-500/30",
    headerText: "text-orange-400",
    contexte:
      "Véhicule immobilisé sur la piste ou dans une zone dangereuse.",
    role: "Protéger la zone par drapeaux jaunes et coordonner l'intervention en sécurité.",
    etapes: [
      "Drapeau jaune agité sur votre poste et le poste précédent pour protéger la zone.",
      "Évaluation de la situation depuis le bord de piste — n'accédez PAS immédiatement.",
      "Attendez le ralentissement effectif du trafic avant toute intervention.",
      "Vérifiez que le moteur est coupé avant d'approcher le véhicule.",
      "Si le pilote est conscient, guidez-le vers un endroit sûr hors piste.",
      "Si le pilote est inconscient : NE PAS déplacer — appelez les secours, signalez aux postes voisins.",
      "Une fois la zone sécurisée, assistez au remorquage du véhicule hors piste.",
      "Annoncez la fin d'intervention à la direction — passage au drapeau vert.",
    ],
    pointCritique:
      "Ne déplacez jamais un pilote inconscient sans personnel médical qualifié.",
  },
  {
    emoji: "🚦",
    title: "Départ arrêté",
    headerBg: "bg-green-500/10 border-green-500/30",
    headerText: "text-green-400",
    contexte:
      "Début de course ou reprise après drapeau rouge.",
    role: "Vérifier le positionnement des voitures sur la grille et quitter la piste avant l'extinction des feux.",
    etapes: [
      "Formation de la grille selon l'ordre établi (qualifications ou classement).",
      "Tour de formation (formation lap) : voitures dans l'ordre derrière la Safety Car ou seules.",
      "Les commissaires de grille s'assurent que chaque voiture est bien positionnée.",
      "Feux rouges allumés un à un (5 feux) — les pilotes restent immobiles.",
      "Extinction des feux rouges : départ ! Les commissaires reculent immédiatement derrière les barrières.",
      "Le drapeau vert peut être agité à la ligne de départ simultanément.",
    ],
    pointCritique:
      "Quittez la piste AVANT l'extinction des feux — jamais après.",
  },
];

export default function ProceduresPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="absolute left-0 top-0 h-[400px] w-[400px] rounded-full bg-[#FF5A1F]/8 blur-[160px] pointer-events-none" />

        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/apprendre" className="text-sm text-zinc-500 transition hover:text-white">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Sécurité</p>
          <h1 className="mt-4 text-4xl font-black lg:text-6xl">Les procédures</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Les procédures standardisées que tout commissaire doit connaître par cœur. En course,
            chaque seconde compte.
          </p>

          {/* Procedure cards */}
          <div className="mt-16 space-y-6">
            {procedures.map((proc, idx) => (
              <div
                key={proc.title}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02]"
              >
                {/* Header band */}
                <div className={`flex items-center gap-4 border-b px-6 py-5 lg:px-8 ${proc.headerBg}`}>
                  <span className="text-2xl">{proc.emoji}</span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
                      Procédure {String(idx + 1).padStart(2, "0")}
                    </p>
                    <h2 className={`text-xl font-black lg:text-2xl ${proc.headerText}`}>
                      {proc.title}
                    </h2>
                  </div>
                </div>

                <div className="p-6 lg:p-8">
                  {/* Contexte */}
                  <div className="mb-6 rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                      Contexte
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">{proc.contexte}</p>
                  </div>

                  {/* Role du commissaire */}
                  <div className="mb-6 rounded-2xl border border-[#FF5A1F]/20 bg-[#FF5A1F]/5 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#FF5A1F]">
                      Rôle du commissaire
                    </p>
                    <p className="mt-1 text-sm text-zinc-300">{proc.role}</p>
                  </div>

                  {/* Etapes */}
                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                      Étapes
                    </p>
                    <ol className="space-y-3">
                      {proc.etapes.map((etape, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-xs font-black text-zinc-400">
                            {i + 1}
                          </span>
                          <p className="text-zinc-400">{etape}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Point critique */}
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-500/30 bg-red-500/5 px-4 py-4">
                    <span className="shrink-0 text-lg">⚠️</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-red-400">
                        Point critique
                      </p>
                      <p className="mt-1 text-sm font-bold text-white">{proc.pointCritique}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Avertissement réglementaire */}
          <div className="mt-12 flex items-start gap-3 rounded-[24px] border border-yellow-500/30 bg-yellow-500/5 p-6 lg:p-8">
            <span className="shrink-0 text-2xl">⚠️</span>
            <p className="leading-relaxed text-zinc-300">
              Ces procédures sont basées sur le règlement général FFSA. Certaines épreuves ou
              championnats peuvent avoir des procédures spécifiques. Consultez toujours le règlement
              particulier de l&apos;épreuve et écoutez le briefing.
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
