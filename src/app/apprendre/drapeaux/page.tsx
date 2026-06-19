import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

type Discipline = {
  name: string;
  presentation: string;
  presentationColor: string;
  note: string;
};

type Flag = {
  name: string;
  img: string;
  situation: string;
  description: string;
  reaction: string;
  category: string;
  categoryColor: string;
  disciplines?: Discipline[];
};

const PRES = {
  agite: "border-[#FF5A1F]/40 bg-[#FF5A1F]/10 text-[#FF5A1F]",
  fixe: "border-blue-500/40 bg-blue-500/10 text-blue-400",
  agiteFixe: "border-yellow-500/40 bg-yellow-500/10 text-yellow-400",
  nonUtilise: "border-zinc-600/40 bg-zinc-800/30 text-zinc-500",
  propre: "border-red-500/40 bg-red-500/10 text-red-400",
  dc: "border-purple-500/40 bg-purple-500/10 text-purple-400",
};

const flags: Flag[] = [
  {
    name: "Drapeau rouge",
    img: "/flags/rouge.svg",
    situation: "Arrêt immédiat de la séance",
    description: "La session est interrompue : accident grave, obstruction de la piste ou conditions dangereuses. Tout dépassement est interdit. Dimensions : 100×80 cm (plus grand que les autres drapeaux).",
    reaction: "Agiter vigoureusement. Maintenir jusqu'à ce qu'il n'y ait plus aucune voiture en piste.",
    category: "Danger extrême",
    categoryColor: "bg-red-500/20 text-red-400 border-red-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Délégué aux postes sur ORDRE DC uniquement. Essais → stands ; Course → ligne drapeau rouge ou stands dans l'ordre.",
      },
      {
        name: "Tout-terrain",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Délégué aux postes sur ORDRE DC. Essais / Manches → lieu indiqué par les commissaires. Interdit en finale sauf danger imminent.",
      },
      {
        name: "Rallye",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Délégué aux P.K. sur ORDRE DC. Activé également via le voyant LED rouge du boîtier géolocalisation embarqué. L'équipage s'arrête immédiatement.",
      },
      {
        name: "Course de côte",
        presentation: "PROPRE INITIATIVE",
        presentationColor: PRES.propre,
        note: "Le commissaire le présente de sa PROPRE INITIATIVE si accident grave ou obstruction totale. Cascade depuis le poste jusqu'au départ. Les pilotes s'arrêtent immédiatement.",
      },
      {
        name: "Karting",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Présenté par la DC sur la ligne de départ. Ralentir, ne plus se dépasser, rouler à allure réduite puis s'arrêter à l'endroit défini au briefing.",
      },
    ],
  },
  {
    name: "Drapeau jaune — 1 drapeau",
    img: "/flags/jaune.svg",
    situation: "Danger sur le bord ou une partie de la piste — ralentir, ne pas dépasser",
    description: "Un danger est présent sur le bord ou sur une partie de la piste (véhicule accidenté, commissaire à proximité, débris). Tout dépassement est formellement interdit jusqu'à la fin de la zone de danger. Peut être présenté 2 tours consécutifs pour un obstacle non retiré.",
    reaction: "Agiter vigoureusement au poste précédant le danger.",
    category: "Danger",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Présenté au poste précédant le danger. Aussi présenté sur les 2 postes précédant la grille lors du tour de reconnaissance.",
      },
      {
        name: "Tout-terrain",
        presentation: "AGITÉ / FIXE",
        presentationColor: PRES.agiteFixe,
        note: "AGITÉ = danger sur bord ou partie de piste. FIXE en fin de série si dépannage et véhicule encore roulant.",
      },
      {
        name: "Rallye",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Le commissaire portant une chasuble identifiable présente le jaune sur ordre DC ou à sa propre appréciation si incident dans sa zone.",
      },
      {
        name: "Course de côte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Danger sur bord ou partie de la route. Aussi présenté lors de la redescente des concurrents si vitesse trop élevée ou bouchon.",
      },
      {
        name: "Karting",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Danger sur le bord ou une partie de la piste. Ne doublez pas.",
      },
    ],
  },
  {
    name: "Double drapeau jaune — 2 drapeaux",
    img: "/flags/jaune.svg",
    situation: "Danger majeur sur la trajectoire — réduire considérablement, prêt à s'arrêter",
    description: "Danger qui obstrue partiellement ou totalement la piste, ou des commissaires interviennent directement sur la piste. Les deux drapeaux sont agités par le même commissaire, au poste immédiatement avant le danger. Tout dépassement est strictement interdit.",
    reaction: "Agiter les deux drapeaux simultanément. Présenté uniquement au poste immédiatement avant l'endroit dangereux.",
    category: "Danger majeur",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "2× AGITÉS",
        presentationColor: PRES.agite,
        note: "Danger obstrue partiellement ou totalement la piste, ou commissaires en intervention sur la piste.",
      },
      {
        name: "Tout-terrain",
        presentation: "2× AGITÉS / FIXE+CROISÉ",
        presentationColor: PRES.agiteFixe,
        note: "2× AGITÉS = incident sur trajectoire. FIXE+CROISÉ en fin de série = dépannage, véhicule non roulant.",
      },
      {
        name: "Rallye",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "En rallye, les commissaires n'utilisent pas le double jaune. Un seul drapeau jaune est présenté.",
      },
      {
        name: "Course de côte",
        presentation: "2× AGITÉS",
        presentationColor: PRES.agite,
        note: "Danger obstrue partiellement ou totalement la route. Présenté par le même commissaire au poste précédant l'endroit dangereux.",
      },
      {
        name: "Karting",
        presentation: "2× AGITÉS",
        presentationColor: PRES.agite,
        note: "Danger obstrue totalement ou partiellement la piste.",
      },
    ],
  },
  {
    name: "Drapeau vert",
    img: "/flags/vert.svg",
    situation: "Voie libre — fin de zone de danger",
    description: "Indique la fin d'une zone de danger ou l'ouverture de la piste. Utilisé différemment selon les disciplines : parfois par la direction de course uniquement, parfois par les commissaires de poste.",
    reaction: "Agiter à l'entrée de la zone dégagée. Usage et conditions selon discipline.",
    category: "Autorisation",
    categoryColor: "bg-green-500/20 text-green-400 border-green-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Ouverture de piste, début de séance, fin de zone FCY (1 tour), relance après Safety Car. Présenté à tous les postes.",
      },
      {
        name: "Tout-terrain",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Ouverture de piste uniquement. PAS D'UTILISATION après un drapeau jaune — sauf en endurance.",
      },
      {
        name: "Rallye",
        presentation: "DC SEULEMENT",
        presentationColor: PRES.dc,
        note: "Les commissaires de poste NE présentent PAS de drapeau vert. C'est la voiture DC (serre-file) qui le présente lors de la redescente en fin de montée.",
      },
      {
        name: "Course de côte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Présenté par les commissaires à l'ouverture de piste pour indiquer que tout est OK au poste. Aussi présenté par la voiture DC lors de la redescente.",
      },
      {
        name: "Karting",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Fin de zone neutralisée, début d'une séance d'essais ou tours de formation. Présenté par les commissaires et la DC.",
      },
    ],
  },
  {
    name: "Drapeau damier",
    img: "/flags/damier.svg",
    situation: "Fin de course ou de session",
    description: "Présenté au vainqueur lors du passage sous le drapeau, puis à tous les concurrents suivants. Marque la fin officielle de l'épreuve. Présenté depuis la ligne d'arrivée ou depuis une voiture officielle.",
    reaction: "Agiter vigoureusement au passage du premier concurrent, puis des suivants.",
    category: "Fin de session",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Présenté AGITÉ depuis la ligne d'arrivée. Voiture officielle après fin de toute partie d'épreuve.",
      },
      {
        name: "Tout-terrain",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "AGITÉ sur la ligne d'arrivée. Voiture officielle après fin de toute partie. À la présentation du damier, les voitures sont en parc fermé.",
      },
      {
        name: "Rallye",
        presentation: "VOITURE DC",
        presentationColor: PRES.dc,
        note: "Apposé sur les portières de la voiture officielle DC. Son passage informe de la fin de la compétition, mais PAS de la fin de la privatisation de l'épreuve.",
      },
      {
        name: "Course de côte",
        presentation: "VOITURE DC",
        presentationColor: PRES.dc,
        note: "Présenté depuis une voiture officielle à la fin de toute partie d'épreuve. Les commissaires peuvent présenter tous leurs drapeaux agités lors du passage des concurrents.",
      },
      {
        name: "Karting",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "AGITÉ depuis la ligne d'arrivée. Signal de fin de séance d'entraînement, d'essais et/ou de courses.",
      },
    ],
  },
  {
    name: "Drapeau bleu",
    img: "/flags/bleu.svg",
    situation: "Laisser passer un concurrent plus rapide",
    description: "Présenté au concurrent qui va être doublé — soit par un pilote plus rapide lors des essais, soit par un pilote ayant un ou plusieurs tours d'avance en course.",
    reaction: "Agiter. Le pilote averti doit laisser le passage sans retarder le concurrent plus rapide.",
    category: "Information",
    categoryColor: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "FIXE + AGITÉ",
        presentationColor: PRES.agiteFixe,
        note: "FIXE à la voiture sortant des stands quand une autre s'approche. AGITÉ essais (cédez passage) ; Course sprint (doublé avec 1 tour d'avance) ; Endurance (doublé par plus rapide).",
      },
      {
        name: "Tout-terrain",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Essais : cédez le passage à un véhicule plus rapide. Course : vous allez être doublé par un véhicule ayant au moins un tour d'avance.",
      },
      {
        name: "Rallye",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Le drapeau bleu n'est PAS utilisé en rallye — les voitures partent à intervalles et ne se croisent pas dans le même sens.",
      },
      {
        name: "Course de côte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Présenté AGITÉ au concurrent le moins rapide pour lui signifier qu'il doit impérativement se laisser doubler.",
      },
      {
        name: "Karting",
        presentation: "FIXE / AGITÉ",
        presentationColor: PRES.agiteFixe,
        note: "FIXE par la DC : gardez votre ligne, vous allez être doublé. AGITÉ par la DC : cédez le passage.",
      },
    ],
  },
  {
    name: "Drapeau noir (avec numéro)",
    img: "/flags/noir.svg",
    situation: "Exclusion du concurrent désigné",
    description: "Présenté avec un panneau indiquant le numéro du concurrent exclu. Le pilote doit rejoindre immédiatement les stands. L'exclusion peut être due à une infraction grave au règlement sportif.",
    reaction: "Tenu fixe avec panneau numéro. Uniquement sur ordre de la DC ou du collège des commissaires sportifs. Ne concerne qu'un seul concurrent.",
    category: "Exclusion",
    categoryColor: "bg-zinc-800/50 text-zinc-300 border-zinc-600/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 4 tours maximum. Ordre du collège des commissaires sportifs. Le pilote s'arrête à son stand ou à l'endroit désigné à la prochaine approche de la voie des stands.",
      },
      {
        name: "Tout-terrain",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 3 tours maximum. Ordre DC uniquement. NON PRÉSENTÉ lors des finales — seul le drapeau triangulé noir/blanc est alors utilisé.",
      },
      {
        name: "Rallye",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Le drapeau noir n'est pas utilisé en rallye.",
      },
      {
        name: "Course de côte",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Le drapeau noir n'est pas utilisé en course de côte / slalom.",
      },
      {
        name: "Karting",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 4 tours maximum par la DC. Immobilisation du pilote à la prochaine approche du parc assistance.",
      },
    ],
  },
  {
    name: "Drapeau noir et orange (meatball)",
    img: "/flags/meatball.svg",
    situation: "Problème mécanique — rejoindre les stands obligatoirement",
    description: "Drapeau « meatball ». Présenté avec le numéro du concurrent dont le véhicule présente un problème mécanique apparent pouvant constituer un danger (fuite d'huile, pièce détachée...). Le pilote DOIT s'arrêter au stand au prochain passage.",
    reaction: "Tenu FIXE avec panneau numéro. Uniquement sur ordre DC. Délégué aux postes les plus proches de la voie des stands.",
    category: "Mécanique",
    categoryColor: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Délégué aux 3 derniers postes avant l'entrée de la voie des stands sur ordre DC. Arrêt OBLIGATOIRE au stand au prochain passage.",
      },
      {
        name: "Tout-terrain",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Délégué à certains postes sur ordre DC et SEULEMENT en cas de danger imminent. En finale, uniquement si danger imminent.",
      },
      {
        name: "Rallye",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en rallye.",
      },
      {
        name: "Course de côte",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en course de côte / slalom.",
      },
      {
        name: "Karting",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 1 tour par la DC. Arrêt pour défectuosité technique ou vestimentaire. Le pilote peut repartir après réparation et mise en conformité.",
      },
    ],
  },
  {
    name: "Drapeau jaune et rouge rayé",
    img: "/flags/jaune-rouge.svg",
    situation: "Piste glissante ou contaminée en aval du poste",
    description: "Avertit les concurrents d'une détérioration de l'adhérence : huile, eau, débris ou autre substance glissante. Accompagné d'une main levée vers le ciel pour signaler le début d'une averse.",
    reaction: "Tenir FIXE au poste. Aucun drapeau vert n'est présenté à la suite de ce drapeau (sauf en karting).",
    category: "Avertissement",
    categoryColor: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE au maximum 4 tours. Accompagné d'une main levée vers le ciel pour une averse. Pas de drapeau vert après.",
      },
      {
        name: "Tout-terrain",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 1 tour. Uniquement sur les parties REVÊTUES du circuit. Non utilisé sur les parties non revêtues.",
      },
      {
        name: "Rallye",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en rallye.",
      },
      {
        name: "Course de côte",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE + main levée vers le ciel pour indiquer une averse. Pas de drapeau vert dans le secteur suivant.",
      },
      {
        name: "Karting",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE par la DC au moins 4 tours ou jusqu'au retour à la normale. Si la piste revient à la normale, un drapeau vert est présenté.",
      },
    ],
  },
  {
    name: "Drapeau blanc",
    img: "/flags/blanc.svg",
    situation: "Véhicule lent sur la piste",
    description: "Signale la présence d'un véhicule circulant beaucoup plus lentement que les concurrents en piste : ambulance, véhicule de service, concurrent en panne roulant au ralenti. En circuit tout-terrain, présenté FIXE pour demander une assistance médicale.",
    reaction: "Agiter. En secteur aveugle (circuit asphalte), peut dans ce cas précis remplacer le drapeau jaune.",
    category: "Information",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Véhicule lent risquant de gêner les concurrents. En secteur aveugle, peut remplacer le drapeau jaune.",
      },
      {
        name: "Tout-terrain",
        presentation: "AGITÉ / FIXE",
        presentationColor: PRES.agiteFixe,
        note: "AGITÉ = pilote risque de rattraper un véhicule lent. FIXE = demande d'assistance médicale.",
      },
      {
        name: "Rallye",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Signale un véhicule beaucoup plus lent sur la portion contrôlée par le poste.",
      },
      {
        name: "Course de côte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Un pilote risque de rattraper un véhicule beaucoup plus lent sur la portion contrôlée par le poste.",
      },
      {
        name: "Karting",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Utilisation facultative. Signale la présence d'un kart au ralenti sur la piste.",
      },
    ],
  },
  {
    name: "Drapeau noir et blanc diagonal",
    img: "/flags/noir-blanc.svg",
    situation: "Avertissement pour conduite antisportive",
    description: "Présenté avec le numéro du concurrent. Premier et unique avertissement pour comportement contraire à l'esprit sportif ou conduite dangereuse. La répétition de l'infraction peut entraîner le drapeau noir.",
    reaction: "Tenu FIXE avec panneau numéro. Uniquement sur ordre DC. Délégué à certains postes selon discipline.",
    category: "Avertissement sportif",
    categoryColor: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 1 tour + numéro. Avertissement : conduite soumise à investigations. Ordre DC, délégué à certains postes.",
      },
      {
        name: "Tout-terrain",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 1 tour + numéro. Avertissement conduite soumise à investigations. En finale : remplace le drapeau noir (non présenté en finale).",
      },
      {
        name: "Rallye",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en rallye.",
      },
      {
        name: "Course de côte",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en course de côte / slalom.",
      },
      {
        name: "Karting",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "FIXE 1 tour par la DC. Avertissement pour conduite non sportive ou dangereuse.",
      },
    ],
  },
  {
    name: "Drapeau Code 60 (violet)",
    img: "/flags/code60.svg",
    situation: "Limitation de vitesse à 60 km/h sur tout le circuit",
    description: "Drapeau violet avec un cercle blanc contenant le chiffre « 60 ». Imposé par le directeur de course lorsque deux drapeaux jaunes sont présentés. Limite la vitesse à 60 km/h sur l'ensemble du circuit. Chaque tour sous Code 60 compte comme un tour de course. Utilisé uniquement si les vitesses peuvent être surveillées en direct.",
    reaction: "Agiter sur la ligne de départ et à TOUS les postes simultanément, puis maintenir FIXE une fois les voitures ralenties. Remplacé par le drapeau vert agité à la reprise.",
    category: "Neutralisation",
    categoryColor: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "AGITÉ puis FIXE",
        presentationColor: PRES.agiteFixe,
        note: "AGITÉ ≥1 tour jusqu'à ce que les voitures soient à 60 km/h. Puis FIXE jusqu'à retrait DC. Remplacé par vert agité à tous les postes.",
      },
      {
        name: "Tout-terrain",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Le Code 60 n'est pas utilisé sur les circuits tout-terrain.",
      },
      {
        name: "Rallye",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Le Code 60 n'est pas utilisé en rallye.",
      },
      {
        name: "Course de côte",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Le Code 60 n'est pas utilisé en course de côte / slalom.",
      },
      {
        name: "Karting",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Le Code 60 n'est pas utilisé en karting. Le karting utilise la procédure « SLOW ».",
      },
    ],
  },
];

export default function DrapeauxPage() {
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

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Lexique</p>
          <h1 className="mt-4 text-4xl font-black lg:text-6xl">Les drapeaux</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Chaque drapeau a une signification précise — et son usage varie selon la discipline.
            Un commissaire doit connaître les deux.
          </p>

          {/* Dimensions + légende */}
          <div className="mt-5 flex flex-wrap gap-3">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-400">
              <span className="font-bold text-white">Drapeau rouge :</span> 100 × 80 cm
              &nbsp;·&nbsp;
              <span className="font-bold text-white">Autres :</span> 80 × 60 cm
            </div>
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.02] px-4 py-2">
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.agite}`}>AGITÉ</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.fixe}`}>FIXE</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.agiteFixe}`}>AGITÉ+FIXE</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.dc}`}>DC SEULEMENT</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.propre}`}>PROPRE INITIATIVE</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.nonUtilise}`}>NON UTILISÉ</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/apprendre/quiz/drapeaux"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold transition hover:opacity-90"
            >
              🎯 Tester mes connaissances
            </Link>
          </div>

          <div className="mt-14 space-y-5">
            {flags.map((flag) => (
              <div
                key={flag.name}
                className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.02] transition hover:border-white/20"
              >
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start lg:p-8">

                  {/* Flag image */}
                  <div className="shrink-0">
                    <img
                      src={flag.img}
                      alt={flag.name}
                      className="h-20 w-32 rounded-2xl border border-white/10 object-cover sm:h-24 sm:w-36"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-3">
                      <h2 className="text-xl font-black lg:text-2xl">{flag.name}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${flag.categoryColor}`}>
                        {flag.category}
                      </span>
                    </div>

                    <p className="mt-2 text-base font-bold text-[#FF5A1F]">{flag.situation}</p>
                    <p className="mt-3 leading-relaxed text-zinc-400">{flag.description}</p>

                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Geste du commissaire</p>
                      <p className="mt-1 text-sm text-zinc-300">{flag.reaction}</p>
                    </div>

                    {/* Par discipline */}
                    {flag.disciplines && (
                      <div className="mt-5">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-500">Par type d&apos;épreuve</p>
                        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                          {flag.disciplines.map((d) => (
                            <div
                              key={d.name}
                              className="rounded-2xl border border-white/10 bg-black/20 px-3 py-3"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-black text-white">{d.name}</span>
                                <span className={`rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${d.presentationColor}`}>
                                  {d.presentation}
                                </span>
                              </div>
                              <p className="mt-1.5 text-xs leading-relaxed text-zinc-500">{d.note}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
