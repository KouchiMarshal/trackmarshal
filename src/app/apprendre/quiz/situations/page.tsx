import QuizEngine, { QuizQuestion } from "@/components/quiz/QuizEngine";

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Une voiture sort de la piste et s'immobilise dans le bac à graviers. Le pilote lève le pouce pour signaler qu'il est indemne. Quel signal présentez-vous ?",
    options: [
      "Drapeau jaune FIXE",
      "Drapeau jaune AGITÉ",
      "Aucun signal — le pilote est sain et sauf",
      "Drapeau vert — la zone est dégagée",
    ],
    correct: 0,
    explanation: "La voiture est hors de la trajectoire mais constitue un danger potentiel. Le jaune FIXE est approprié : danger en amont, ralentir, pas de dépassement. Le jaune AGITÉ est réservé aux dangers immédiats sur ou près de la trajectoire.",
  },
  {
    id: 2,
    question: "Vous constatez de l'huile fraîche sur la piste mais n'avez reçu aucun ordre du DC. Que faites-vous ?",
    options: [
      "Attendez l'ordre radio avant d'agir",
      "Présentez le drapeau jaune et rouge rayé de votre propre initiative, puis informez le DC",
      "Présentez le drapeau jaune agité",
      "Ne faites rien — ce n'est pas votre décision",
    ],
    correct: 1,
    explanation: "Le drapeau jaune et rouge rayé peut être présenté à la propre initiative du commissaire lorsqu'il constate que la piste est rendue glissante (huile, eau, débris). Il informe ensuite immédiatement le DC par radio.",
  },
  {
    id: 3,
    question: "Une voiture s'arrête sur la trajectoire, moteur coupé. Le pilote semble conscient à l'intérieur. Quel signal présentez-vous ?",
    options: [
      "Drapeau jaune FIXE",
      "Double drapeau jaune AGITÉ",
      "Drapeau rouge immédiatement",
      "Drapeau blanc",
    ],
    correct: 1,
    explanation: "Une voiture sur la trajectoire représente un danger grave et immédiat. Le double drapeau jaune AGITÉ est approprié : voie totalement ou partiellement obstruée, les concurrents doivent être prêts à s'arrêter. C'est la DC qui décide si la situation nécessite un drapeau rouge.",
  },
  {
    id: 4,
    question: "Le Safety Car est déployé. Un concurrent souhaite rentrer aux stands pour changer ses pneus. Est-ce autorisé ?",
    options: [
      "Non, la pit lane est toujours fermée sous Safety Car",
      "Oui, sauf instruction contraire du DC",
      "Oui, uniquement pour les urgences mécaniques",
      "Non, uniquement après l'extinction des feux SC",
    ],
    correct: 1,
    explanation: "En circuit asphalte FFSA, la voie des stands reste ouverte sous Safety Car sauf instruction contraire du DC. Idem sous FCY. Les concurrents peuvent rentrer aux stands librement pendant la neutralisation.",
  },
  {
    id: 5,
    question: "Vous êtes sur la ligne de relance. Le Safety Car éteint ses feux orange clignotants et rentre aux stands. Quel signal présentez-vous ?",
    options: [
      "Drapeau vert AGITÉ",
      "Drapeau vert FIXE",
      "Aucun signal — la reprise est automatique",
      "Drapeau blanc pour indiquer le passage du SC",
    ],
    correct: 0,
    explanation: "Sur la ligne de relance, lorsque le SC éteint ses feux et rentre, le commissaire présente le drapeau VERT AGITÉ. Ce vert n'est présenté QUE sur la ligne de relance — jamais à tous les postes simultanément, contrairement à la fin de FCY ou Code 60.",
  },
  {
    id: 6,
    question: "La fin de FCY est annoncée par le DC. Vous êtes au poste 7. Quel signal présentez-vous et pendant combien de temps ?",
    options: [
      "Drapeau vert AGITÉ pendant 1 tour",
      "Drapeau vert FIXE jusqu'à la fin de la course",
      "Aucun signal — la fin de FCY se signale uniquement sur la ligne de départ/arrivée",
      "Drapeau vert AGITÉ une seule fois, au passage d'un concurrent",
    ],
    correct: 0,
    explanation: "À la fin de la FCY, le drapeau vert est AGITÉ à TOUS les postes pendant 1 tour complet. Cela permet à tous les concurrents de constater la reprise, quelle que soit leur position sur le circuit.",
  },
  {
    id: 7,
    question: "Un concurrent franchit les track limits devant votre poste. Que faites-vous ?",
    options: [
      "Présentez immédiatement le drapeau noir avec son numéro",
      "Notez son numéro, l'heure et le tour, puis transmettez à la DC ou aux stewards",
      "Présentez le drapeau noir et blanc diagonal (avertissement)",
      "Ne faites rien — c'est aux commissaires techniques de gérer",
    ],
    correct: 1,
    explanation: "Le commissaire de piste n'inflige pas lui-même les pénalités. Il note les faits (numéro, heure, tour) et les transmet à la DC ou aux stewards, qui décideront de la sanction éventuelle.",
  },
  {
    id: 8,
    question: "Votre radio tombe en panne pendant la course. Quelle est la procédure ?",
    options: [
      "Quittez votre poste pour aller signaler la panne à la DC",
      "Signalez la panne à votre Chef de poste, restez en poste et observez les signaux visuels des postes voisins",
      "Arrêtez de présenter des signaux — sans radio, vous n'êtes plus habilité",
      "Retournez au paddock pour récupérer une radio de remplacement",
    ],
    correct: 1,
    explanation: "En cas de panne radio, on reste IMPÉRATIVEMENT à son poste. Le Chef de poste gère la communication. On observe les signaux visuels des postes voisins pour suivre la situation. Quitter son poste pendant une course est extrêmement dangereux.",
  },
  {
    id: 9,
    question: "Lors d'une FCY, vous constatez qu'un concurrent en dépasse un autre. Que faites-vous ?",
    options: [
      "Ne faites rien — les dépassements mineurs sont tolérés en FCY",
      "Notez les numéros des concurrents concernés, l'heure et le tour, et informez immédiatement le DC",
      "Agitez vigoureusement le drapeau jaune pour les avertir",
      "Présentez le drapeau noir au concurrent fautif",
    ],
    correct: 1,
    explanation: "Tout dépassement est strictement interdit en FCY, sous peine de sanction par les commissaires sportifs. Le commissaire de piste ne décerne pas lui-même la pénalité — il note les faits et les transmet immédiatement à la DC.",
  },
  {
    id: 10,
    question: "En circuit asphalte FFSA, un commissaire peut-il déclencher le drapeau rouge de sa propre initiative ?",
    options: [
      "Oui, en cas de danger immédiat mettant des vies en danger",
      "Oui, si le Chef de poste l'approuve",
      "Non, le drapeau rouge ne peut être déclenché que sur ordre du DC en circuit asphalte",
      "Oui, uniquement si la radio du DC ne répond pas",
    ],
    correct: 2,
    explanation: "En circuit asphalte FFSA, le drapeau rouge est une décision EXCLUSIVE du Directeur de course. Le commissaire ne peut jamais l'initier de sa propre initiative, contrairement à la course de côte où c'est autorisé en cas de danger immédiat.",
  },
  {
    id: 11,
    question: "En course de côte, dans quel cas un commissaire peut-il déclencher le drapeau rouge de sa propre initiative ?",
    options: [
      "Pour tout accident visible depuis son poste",
      "En cas de danger immédiat menaçant des vies — suivi d'une information immédiate au DC",
      "Jamais, même en urgence absolue",
      "Uniquement si le Chef de poste est absent",
    ],
    correct: 1,
    explanation: "En course de côte, le commissaire PEUT présenter le rouge de sa propre initiative en cas de danger immédiat menaçant des vies. Il doit en informer immédiatement le DC par radio. C'est une exception propre à cette discipline.",
  },
  {
    id: 12,
    question: "La course est neutralisée par un Safety Car. Pouvez-vous sortir sur la piste pour baliser l'incident ?",
    options: [
      "Oui, dès que le SC est déployé",
      "Non, uniquement sur autorisation explicite du DC",
      "Oui, si aucun concurrent n'est visible dans votre zone",
      "Oui, après le premier passage du SC devant votre poste",
    ],
    correct: 1,
    explanation: "Même sous Safety Car, un commissaire ne peut intervenir sur la piste que sur autorisation EXPLICITE du DC. Les voitures circulent encore — à vitesse réduite certes, mais le danger est réel.",
  },
  {
    id: 13,
    question: "Un commissaire du poste voisin agite le drapeau rouge sans que le DC l'ait ordonné. Que faites-vous ?",
    options: [
      "Reproduisez immédiatement le signal par solidarité",
      "N'imitez pas ce signal sans ordre du DC — informez le DC de la situation",
      "Attendez 30 secondes et reproduisez si personne n'a réagi",
      "Courez au poste voisin pour lui demander d'arrêter",
    ],
    correct: 1,
    explanation: "En circuit asphalte, le rouge est une décision exclusive du DC. Reproduire un rouge non autorisé crée une confusion dangereuse. On informe le DC de ce qui se passe, sans reproduire le signal non ordonné.",
  },
  {
    id: 14,
    question: "Code 60 déclenché. Quel drapeau présentez-vous, et selon quelle séquence ?",
    options: [
      "Drapeau violet « 60 » — toujours FIXE",
      "Drapeau violet « 60 » — d'abord AGITÉ sur ordre DC, puis FIXE",
      "Drapeau jaune AGITÉ + panneau « 60 »",
      "Drapeau violet « 60 » — AGITÉ continuellement jusqu'à la reprise",
    ],
    correct: 1,
    explanation: "Lors du déclenchement du Code 60, le drapeau violet (cercle blanc « 60 ») est d'abord AGITÉ à tous les postes sur ordre du DC, puis tenu FIXE jusqu'à la fin de la procédure. La reprise est signalée par un vert agité pendant 1 tour.",
  },
  {
    id: 15,
    question: "Le DC annonce la fin du Code 60. Quel signal présentez-vous et pendant combien de temps ?",
    options: [
      "Retirez le drapeau violet sans rien présenter d'autre",
      "Drapeau vert FIXE jusqu'à la fin de la course",
      "Drapeau vert AGITÉ pendant 1 tour",
      "Drapeau vert AGITÉ jusqu'au prochain incident",
    ],
    correct: 2,
    explanation: "La fin du Code 60 est signalée par un drapeau vert AGITÉ pendant 1 tour à TOUS les postes, comme pour la fin de FCY. Les concurrents peuvent alors reprendre leur vitesse de course normale.",
  },
  {
    id: 16,
    question: "Lors d'un départ arrêté, un concurrent cale sur la grille. Quelle est votre action immédiate ?",
    options: [
      "Ne rien faire — ce n'est pas votre rôle",
      "Alerter les concurrents qui arrivent derrière et informer le DC immédiatement",
      "Courir vers le concurrent pour l'aider à redémarrer",
      "Déclencher le drapeau rouge de votre propre initiative",
    ],
    correct: 1,
    explanation: "Un concurrent calé sur la grille représente un danger immédiat au moment du départ. Le commissaire doit alerter les concurrents qui suivent (gestes, drapeau jaune) et informer immédiatement le DC pour interrompre si nécessaire la procédure de départ.",
  },
  {
    id: 17,
    question: "Un véhicule perd des débris sur la piste devant votre poste. Quel signal présentez-vous immédiatement ?",
    options: [
      "Drapeau jaune FIXE",
      "Drapeau jaune et rouge rayé",
      "Drapeau noir avec le numéro du concurrent",
      "Aucun — attendez l'ordre du DC",
    ],
    correct: 1,
    explanation: "Le drapeau jaune et rouge rayé peut être présenté à la propre initiative du commissaire lorsque la piste devient dangereuse (débris, huile, eau). Il signale immédiatement le danger et informe ensuite le DC.",
  },
  {
    id: 18,
    question: "Un pilote sort seul et indemne de son véhicule accidenté et marche vers votre poste. Quelle est votre priorité ?",
    options: [
      "Lui administrer les premiers secours médicaux",
      "L'éloigner de la trajectoire, le mettre en sécurité et maintenir vos signaux de danger",
      "L'inviter à remonter dans son véhicule pour le déplacer",
      "Appeler immédiatement le SAMU",
    ],
    correct: 1,
    explanation: "La priorité est de mettre le pilote en sécurité hors de la trajectoire des véhicules, tout en continuant à présenter les signaux de danger. Le commissaire n'est pas médecin — il sécurise la zone et informe le DC.",
  },
  {
    id: 19,
    question: "Après le drapeau damier, un concurrent continue à rouler à grande vitesse devant votre poste. Que faites-vous ?",
    options: [
      "Présentez le drapeau rouge pour l'arrêter",
      "Continuez à présenter le damier et informez le DC si le comportement est dangereux",
      "Rien — la course est terminée, votre rôle est fini",
      "Présentez le drapeau noir avec son numéro",
    ],
    correct: 1,
    explanation: "Après le damier, les concurrents sont encore en piste et doivent progressivement ralentir. Le commissaire reste vigilant, continue à présenter le damier et signale tout comportement dangereux au DC.",
  },
  {
    id: 20,
    question: "Vous êtes seul à votre poste, radio en panne, et il y a un accident grave devant vous. Quelle est votre PRIORITÉ ABSOLUE ?",
    options: [
      "Courir prévenir le poste voisin",
      "Présenter immédiatement les signaux de danger pour protéger les concurrents qui arrivent",
      "Attendre que quelqu'un passe et vienne vous aider",
      "Quitter le poste pour chercher de l'aide au paddock",
    ],
    correct: 1,
    explanation: "La priorité absolue est de SIGNALER le danger aux concurrents qui arrivent. Même sans radio et sans Chef de poste, les signaux visuels (drapeaux jaunes, double jaune) protègent immédiatement les vies. On ne quitte jamais un poste actif sans être remplacé.",
  },
];

export default function QuizSituationsPage() {
  return (
    <QuizEngine
      title="Quiz situations & réflexes"
      questions={questions}
      backHref="/apprendre/quiz"
      backLabel="Retour aux quiz"
      reviewHref="/apprendre/procedures"
      reviewLabel="Revoir les procédures"
      glowColor="bg-yellow-500/5"
    />
  );
}
