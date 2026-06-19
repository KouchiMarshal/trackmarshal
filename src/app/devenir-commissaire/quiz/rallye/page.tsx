import QuizEngine, { QuizQuestion } from "@/components/quiz/QuizEngine";

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "En rallye, comment les concurrents s'élancent-ils dans une épreuve spéciale ?",
    options: [
      "En peloton groupé, comme en circuit",
      "Un par un à intervalles réguliers",
      "En deux vagues de 10 simultanément",
      "En convoi derrière une voiture ouvreuse",
    ],
    correct: 1,
    explanation: "En rallye, les concurrents s'élancent UN PAR UN à intervalles réguliers (généralement 1 à 3 minutes). Le commissaire voit donc les voitures passer une à une, avec de longues périodes d'attente entre elles.",
  },
  {
    id: 2,
    question: "Qu'est-ce qu'une Épreuve Spéciale (ES) en rallye ?",
    options: [
      "Une manche comptant double pour le championnat",
      "Une portion de route fermée à la circulation, chronométrée du départ à l'arrivée",
      "Une qualification disputée la veille du rallye",
      "Un secteur chronométré sur route ouverte à la circulation",
    ],
    correct: 1,
    explanation: "L'ES est une portion de route fermée à la circulation sur laquelle les équipages s'affrontent en temps. Elle est chronométrée du départ à l'arrivée. Sur un rallye, plusieurs ES se succèdent sur 1 à 3 jours.",
  },
  {
    id: 3,
    question: "En rallye FFSA, l'utilisation du drapeau blanc est :",
    options: [
      "Obligatoire dès qu'un véhicule lent est présent",
      "Facultative",
      "Réservée aux spéciales forestières",
      "Interdite depuis 2024",
    ],
    correct: 1,
    explanation: "Selon le règlement FFSA Rallye 2026, l'utilisation du drapeau blanc est FACULTATIVE. Lorsqu'il est utilisé, il signale la présence d'un véhicule beaucoup plus lent sur la portion contrôlée par le poste.",
  },
  {
    id: 4,
    question: "Lorsqu'il est utilisé en rallye, que signale le drapeau blanc ?",
    options: [
      "Fin de la spéciale — tous les concurrents sont passés",
      "Véhicule hors course stationné sur le bord de la route",
      "Présence d'un véhicule beaucoup plus lent sur la portion contrôlée",
      "Assistance médicale en cours sur la spéciale",
    ],
    correct: 2,
    explanation: "Le drapeau blanc en rallye signale qu'un véhicule beaucoup plus lent (voiture d'ouverture, concurrent en panne partielle, véhicule de service) se trouve sur la portion contrôlée par le poste. Son utilisation reste facultative.",
  },
  {
    id: 5,
    question: "La tenue du commissaire en rallye FFSA est :",
    options: [
      "Combinaison en coton obligatoire, comme en circuit asphalte",
      "Chasuble ou combinaison selon l'organisateur",
      "Tenue civile avec un gilet réfléchissant",
      "Combinaison ignifugée FIA obligatoire",
    ],
    correct: 1,
    explanation: "En rallye FFSA, la tenue est une chasuble ou une combinaison selon l'organisateur — contrairement au circuit asphalte où la combinaison en coton est obligatoire. Cela reflète les conditions d'intervention différentes en forêt ou sur route.",
  },
  {
    id: 6,
    question: "Qu'est-ce que la « reconnaissance » en rallye ?",
    options: [
      "Le passage des équipages sur les spéciales à vitesse de course, la veille de l'épreuve",
      "Le passage des équipages sur les spéciales à vitesse réduite, sur route ouverte, pour prendre des notes",
      "La visite des commissaires sur chaque spéciale avant l'épreuve",
      "La vérification administrative des licences des pilotes",
    ],
    correct: 1,
    explanation: "La reconnaissance est le passage des équipages sur les spéciales AVANT l'épreuve, à vitesse réduite sur route ouverte à la circulation. L'équipage prend des notes (pace notes) qui seront utilisées à pleine vitesse lors de l'épreuve.",
  },
  {
    id: 7,
    question: "Les notes prises lors de la reconnaissance par le copilote s'appellent :",
    options: [
      "Le road book",
      "Le carnet de bord",
      "Les pace notes (notes de rythme)",
      "Le livret de sécurité",
    ],
    correct: 2,
    explanation: "Les « pace notes » (ou notes de pacenotes) sont les notes prises lors de la reconnaissance. Elles décrivent chaque virage, difficulté et particularité de la route. Le copilote les lit à voix haute pendant la spéciale pour guider le pilote.",
  },
  {
    id: 8,
    question: "Quel est le rôle principal du copilote pendant une épreuve spéciale ?",
    options: [
      "Contrôler la vitesse pour ne pas dépasser les limites légales",
      "Lire les pace notes à voix haute pour guider le pilote mètre par mètre",
      "Communiquer par radio avec l'assistance pendant la spéciale",
      "Chronométrer le temps de passage aux intermédiaires",
    ],
    correct: 1,
    explanation: "Pendant une spéciale, le copilote lit les pace notes à voix haute en temps réel, annonçant chaque virage, sa difficulté et sa longueur. C'est ce travail d'équipe entre pilote et copilote qui permet de rouler à la limite sur des routes inconnues.",
  },
  {
    id: 9,
    question: "Qu'est-ce que le « scratch » sur une épreuve spéciale de rallye ?",
    options: [
      "Le meilleur temps absolu de la spéciale, toutes catégories confondues",
      "Le temps de référence servant à calculer les pénalités",
      "Le classement à mi-parcours de la spéciale",
      "Le premier concurrent à l'arrivée dans sa catégorie uniquement",
    ],
    correct: 0,
    explanation: "Le scratch est le MEILLEUR TEMPS ABSOLU réalisé sur une épreuve spéciale, toutes catégories confondues. Le concurrent qui réalise le scratch est le plus rapide de la spéciale, indépendamment de sa catégorie.",
  },
  {
    id: 10,
    question: "Entre deux épreuves spéciales, les équipages circulent sur :",
    options: [
      "Des routes fermées réservées au rallye",
      "La route ouverte à la circulation normale, avec un horaire imposé (la liaison)",
      "Des routes réservées, mais à vitesse libre",
      "La même spéciale mais en sens inverse",
    ],
    correct: 1,
    explanation: "Entre les spéciales, les équipages circulent sur la « liaison » : route ouverte à la circulation normale, où le code de la route s'applique. Un horaire imposé doit être respecté, sous peine de pénalités de temps.",
  },
  {
    id: 11,
    question: "La « zone d'assistance » (ou service park) en rallye est :",
    options: [
      "La zone médicale à l'arrivée de chaque spéciale",
      "La zone désignée où les équipes techniques peuvent travailler sur les véhicules entre les spéciales",
      "La zone de contrôle technique avant le départ",
      "Le paddock réservé aux commissaires",
    ],
    correct: 1,
    explanation: "La zone d'assistance (service park) est la zone désignée où les mécaniciens peuvent travailler sur les véhicules entre les spéciales. En dehors de cette zone, les interventions sont strictement réglementées.",
  },
  {
    id: 12,
    question: "Un commissaire en poste de rallye voit une voiture s'immobiliser dans sa zone de surveillance. Quelle est sa première action ?",
    options: [
      "Courir vers le véhicule pour aider le pilote",
      "Présenter le double drapeau jaune pour alerter les concurrents suivants et informer l'organisation",
      "Attendre l'ordre radio de l'organisation",
      "Déclencher le drapeau rouge immédiatement",
    ],
    correct: 1,
    explanation: "La PREMIÈRE action est de signaler le danger aux concurrents qui arrivent (double drapeau jaune agité) et d'alerter l'organisation par radio. La sécurité des autres concurrents prime. On n'approche le véhicule qu'une fois la zone sécurisée.",
  },
  {
    id: 13,
    question: "En rallye, les commissaires travaillent généralement dans quelles conditions ?",
    options: [
      "Depuis une tour de contrôle centrale avec vue sur toute la spéciale",
      "En postes isolés en forêt ou sur route, parfois sans liaison radio directe",
      "Toujours en équipe de 10 commissaires minimum",
      "Uniquement depuis le paddock principal",
    ],
    correct: 1,
    explanation: "En rallye, les commissaires sont souvent isolés en forêt ou sur route, avec de longues périodes d'attente entre les voitures. La liaison radio n'est pas toujours directe avec l'organisation. Cette autonomie exige une bonne préparation individuelle.",
  },
  {
    id: 14,
    question: "Lors d'une spéciale, que note le commissaire pour chaque véhicule qui passe ?",
    options: [
      "Uniquement le temps de passage pour l'aider à établir le classement",
      "Le numéro de départ, l'heure de passage et tout incident ou anomalie constaté",
      "Uniquement les incidents graves, pas les passages normaux",
      "Rien — le chronométrage officiel est géré par d'autres officiels",
    ],
    correct: 1,
    explanation: "Le commissaire note le numéro de départ de chaque véhicule qui passe et l'heure, ainsi que tout incident ou anomalie (fumée, pièce endommagée, comportement dangereux). Ces informations peuvent être cruciales pour l'organisation en cas d'incident.",
  },
  {
    id: 15,
    question: "Le drapeau rouge en rallye peut être déclenché :",
    options: [
      "Uniquement par l'organisation centrale, jamais par le commissaire",
      "Sur ordre de l'organisation, ou par le commissaire en cas de danger immédiat menaçant des vies",
      "Uniquement après accord de 3 commissaires",
      "Jamais — en rallye il n'y a pas de drapeau rouge",
    ],
    correct: 1,
    explanation: "En rallye, le drapeau rouge peut être déclenché sur ordre de l'organisation. Un commissaire peut aussi l'initier en cas de danger immédiat menaçant des vies — il en informe aussitôt l'organisation. La spéciale doit alors être neutralisée.",
  },
  {
    id: 16,
    question: "Qu'est-ce que le « road book » (carnet de route) en rallye ?",
    options: [
      "Le livre de bord mécanique du véhicule",
      "Le document remis aux équipages décrivant tout le parcours : liaisons, spéciales et points de contrôle",
      "Le rapport des commissaires remis après chaque spéciale",
      "Le guide de la route à destination des spectateurs",
    ],
    correct: 1,
    explanation: "Le road book est le document officiel remis aux équipages. Il décrit l'intégralité du parcours : liaisons sur route ouverte, points de contrôle horaires, départs de spéciales, distances. L'équipage doit le suivre à la lettre.",
  },
  {
    id: 17,
    question: "Un équipage arrive en retard au pointage d'un contrôle horaire. Que se passe-t-il ?",
    options: [
      "Il est exclu immédiatement de l'épreuve",
      "Il reçoit une pénalité de temps (par minute de retard)",
      "Rien — les contrôles horaires sont indicatifs",
      "Il doit effectuer un arrêt obligatoire de 5 minutes",
    ],
    correct: 1,
    explanation: "En rallye, les contrôles horaires (pointages) imposent un horaire de passage précis. Un retard entraîne une pénalité de temps ajoutée au classement général. Une avance est aussi pénalisée car elle indique que l'équipage a roulé trop vite en liaison.",
  },
  {
    id: 18,
    question: "Une voiture de rallye accidentée bloque entièrement la spéciale. Les commissaires doivent :",
    options: [
      "Déplacer immédiatement le véhicule pour dégager la route",
      "Présenter le double drapeau jaune en amont, sécuriser la zone, informer l'organisation pour neutraliser ou arrêter la spéciale",
      "Attendre le passage de tous les concurrents avant d'intervenir",
      "Rediriger les concurrents sur un itinéraire de remplacement",
    ],
    correct: 1,
    explanation: "Lors d'un blocage de spéciale, les commissaires signalent le danger aux concurrents suivants (double jaune), sécurisent la zone et informent l'organisation. L'organisation décidera de neutraliser ou d'arrêter la spéciale. On ne déplace pas un véhicule accidenté sans autorisation.",
  },
  {
    id: 19,
    question: "Combien de commissaires mobilise généralement une épreuve spéciale de rallye ?",
    options: [
      "5 à 10 commissaires",
      "20 à 60 commissaires",
      "100 à 200 commissaires",
      "Moins de 5 commissaires",
    ],
    correct: 1,
    explanation: "Une épreuve spéciale de rallye mobilise généralement 20 à 60 commissaires selon la longueur et la configuration de la spéciale. Un rallye complet sur plusieurs jours peut en mobiliser plusieurs centaines au total.",
  },
  {
    id: 20,
    question: "En rallye, la fermeture d'une épreuve spéciale est effectuée :",
    options: [
      "Dès que le premier concurrent a terminé",
      "Après le passage du dernier concurrent, une fois le délai de sécurité écoulé et sur ordre de l'organisation",
      "Automatiquement après 30 minutes d'épreuve",
      "Dès que l'organisation envoie le signal radio",
    ],
    correct: 1,
    explanation: "La fermeture officielle d'une spéciale intervient après le passage du dernier concurrent, l'écoulement du délai de sécurité réglementaire et sur ordre explicite de l'organisation. Les commissaires ne quittent pas leur poste avant d'en avoir reçu l'autorisation.",
  },
];

export default function QuizRallyePage() {
  return (
    <QuizEngine
      title="Quiz spécial rallye"
      questions={questions}
      backHref="/devenir-commissaire/quiz"
      backLabel="Retour aux quiz"
      reviewHref="/devenir-commissaire/epreuves"
      reviewLabel="Revoir les types d'épreuves"
      glowColor="bg-green-500/5"
    />
  );
}
