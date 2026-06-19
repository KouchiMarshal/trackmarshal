import QuizEngine, { QuizQuestion } from "@/components/quiz/QuizEngine";

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Avant d'approcher un véhicule accidenté, quelle condition est IMPÉRATIVE ?",
    options: [
      "Obtenir l'accord verbal du pilote",
      "S'assurer que la zone est sécurisée et que les concurrents suivants ont été alertés",
      "Attendre l'arrivée du médecin de course",
      "Vérifier que le moteur est éteint",
    ],
    correct: 1,
    explanation: "La sécurité du commissaire est primordiale. Avant d'approcher tout véhicule accidenté, il faut s'assurer que la zone est sécurisée (signaux de danger en place, concurrents alertés) et que la DC a été informée. Approcher sans sécurisation expose le commissaire aux véhicules en circulation.",
  },
  {
    id: 2,
    question: "En cas d'incendie d'un véhicule avec le pilote à l'intérieur, quelle est la PREMIÈRE action ?",
    options: [
      "Ouvrir immédiatement la porte et extraire le pilote",
      "Alerter la DC (radio / drapeau rouge selon discipline) et utiliser l'extincteur si accessible",
      "Attendre l'arrivée des pompiers avant toute intervention",
      "Éteindre d'abord le feu, puis alerter la DC",
    ],
    correct: 1,
    explanation: "La première action est d'alerter la DC et de déclencher les secours (drapeau rouge ou radio). Si l'extincteur est accessible et utilisable sans danger pour le commissaire, il l'utilise simultanément. On n'extrait pas seul un pilote blessé sauf danger immédiat (feu, noyade).",
  },
  {
    id: 3,
    question: "Pour couper le harnais ou la ceinture d'un pilote blessé qui ne peut pas se libérer seul, on utilise :",
    options: [
      "Des ciseaux de pharmacie",
      "Un couteau à lame rétractable",
      "Un coupe-sangle / coupe-ceinture de sécurité",
      "Une pince multifonctions",
    ],
    correct: 2,
    explanation: "Le coupe-sangle (ou coupe-ceinture de sécurité) est un équipement INDISPENSABLE du commissaire. Sa lame recourbée permet de glisser sous la sangle et de couper sans risquer de blesser le pilote, même dans une position difficile.",
  },
  {
    id: 4,
    question: "Un pilote est inconscient après un accident. Son véhicule ne brûle pas et n'est pas dans l'eau. Faut-il le sortir immédiatement ?",
    options: [
      "Oui, toujours — l'inconscient doit être sorti au plus vite",
      "Non, sauf danger immédiat (feu, noyade) — tout mouvement non contrôlé peut aggraver les blessures",
      "Oui, mais uniquement si le médecin est présent",
      "Non, on attend toujours les pompiers avant tout geste",
    ],
    correct: 1,
    explanation: "On ne sort PAS un pilote inconscient d'un véhicule sauf danger immédiat (incendie, risque de noyade). Un mouvement non contrôlé peut aggraver une blessure cervicale ou dorsale. La priorité est de sécuriser la zone et d'attendre les professionnels de santé.",
  },
  {
    id: 5,
    question: "Le drapeau jaune et rouge rayé peut-il être présenté à l'initiative du commissaire, sans ordre du DC ?",
    options: [
      "Non, il faut toujours l'ordre du DC",
      "Oui, dès qu'il constate que la piste est rendue glissante ou dangereuse",
      "Oui, mais uniquement après 30 secondes d'attente radio",
      "Non, seul le Chef de poste peut le présenter",
    ],
    correct: 1,
    explanation: "Le drapeau jaune et rouge rayé peut être présenté À LA PROPRE INITIATIVE du commissaire lorsqu'il constate que la piste est rendue glissante (huile, eau, débris). C'est l'une des rares actions que le commissaire peut initier sans ordre préalable.",
  },
  {
    id: 6,
    question: "Lors d'un drapeau rouge en circuit, à quel moment les interventions médicales lourdes sur la piste peuvent-elles débuter ?",
    options: [
      "Immédiatement après le déclenchement du drapeau rouge",
      "Une fois que tous les concurrents ont quitté la portion concernée",
      "Simultanément au ralentissement des concurrents",
      "Uniquement après aval du médecin chef de course",
    ],
    correct: 1,
    explanation: "Les interventions médicales lourdes (extraction, soins sur piste) ne peuvent débuter qu'une fois que TOUS les concurrents ont quitté la portion de piste concernée. Intervenir pendant que des véhicules circulent encore expose l'équipe de secours à un sur-accident.",
  },
  {
    id: 7,
    question: "Si un incendie de véhicule ne peut pas être maîtrisé avec l'extincteur disponible, le commissaire doit :",
    options: [
      "Continuer à vider l'extincteur coûte que coûte",
      "Reculer à distance de sécurité et maintenir les signaux de danger",
      "Tenter d'éteindre le feu avec de la terre ou du sable",
      "Laisser tomber les signaux et fuir le plus loin possible",
    ],
    correct: 1,
    explanation: "Si l'extincteur est insuffisant, le commissaire recule à distance de sécurité. Il maintient les signaux de danger (drapeau rouge/jaune) pour protéger les autres concurrents et laisse l'intervention aux professionnels (pompiers, Medical Car). Sa propre sécurité est prioritaire.",
  },
  {
    id: 8,
    question: "La combinaison en coton est obligatoire en circuit asphalte. Pourquoi les matières synthétiques sont-elles proscrites ?",
    options: [
      "Parce qu'elles sont trop légères et se déchirent facilement au contact d'une carrosserie",
      "Parce qu'elles fondent à haute température et peuvent coller à la peau, aggravant les brûlures",
      "Parce que la FFSA n'a pas les moyens de les homologuer",
      "Parce qu'elles ne permettent pas d'accrocher les insignes officiels",
    ],
    correct: 1,
    explanation: "Les matières synthétiques (nylon, polyester) fondent à haute température et peuvent coller à la peau en cas de contact avec un liquide enflammé ou une chaleur intense, aggravant gravement les brûlures. Le coton brûle mais ne fond pas, offrant une meilleure protection.",
  },
  {
    id: 9,
    question: "Lors d'un Safety Car, un commissaire peut-il aller déplacer des débris sur la piste ?",
    options: [
      "Oui, dès que le SC est déployé",
      "Non, uniquement sur autorisation explicite du DC",
      "Oui, si aucun concurrent n'est visible dans sa zone",
      "Oui, après le premier tour de SC",
    ],
    correct: 1,
    explanation: "Même sous Safety Car, un commissaire ne peut intervenir sur la piste que sur AUTORISATION EXPLICITE du DC. Les voitures circulent encore à vitesse réduite — le danger pour un commissaire sur la piste reste réel.",
  },
  {
    id: 10,
    question: "Le principe de sécurité fondamental du commissaire en bord de piste est :",
    options: [
      "Toujours rester derrière la barrière de sécurité",
      "Ne jamais s'exposer à la trajectoire des véhicules sans garantie de sécurité",
      "Porter un casque en permanence",
      "Ne jamais intervenir seul, toujours en binôme",
    ],
    correct: 1,
    explanation: "Le principe cardinal est de ne jamais s'exposer à la trajectoire des véhicules en mouvement sans garantie de sécurité. Le commissaire doit toujours avoir une issue de repli et ne s'avancer sur la piste que lorsque la zone est sécurisée.",
  },
  {
    id: 11,
    question: "Après un accident sans feu, un pilote conscient et indemne sort seul de sa voiture. Quelle est la priorité ?",
    options: [
      "Lui administrer les premiers secours sur place",
      "L'éloigner immédiatement de la trajectoire des véhicules et le mettre en lieu sûr",
      "L'inviter à déplacer son véhicule lui-même",
      "Appeler le SAMU en priorité",
    ],
    correct: 1,
    explanation: "La priorité est de mettre le pilote en sécurité hors de la trajectoire des véhicules. Un pilote qui sort seul, même indemne, peut être en état de choc et se retrouver sur la piste sans en avoir conscience. On l'éloigne d'abord, on évalue ensuite.",
  },
  {
    id: 12,
    question: "Lors d'une extraction d'un pilote blessé (suspicion de blessure au cou ou au dos), le principe essentiel est :",
    options: [
      "Extraire le plus vite possible, quelle que soit la méthode",
      "Maintenir l'axe tête-cou-tronc et coordonner plusieurs personnes pour l'extraction",
      "Laisser le pilote dans le véhicule jusqu'à l'arrivée des pompiers",
      "Un seul commissaire gère l'extraction pour éviter les conflits de coordination",
    ],
    correct: 1,
    explanation: "Toute extraction avec suspicion de blessure cervicale ou dorsale impose de maintenir l'axe tête-cou-tronc en permanence. Plusieurs personnes coordonnées sont nécessaires. Une extraction mal exécutée peut transformer une blessure grave en handicap permanent.",
  },
  {
    id: 13,
    question: "Avant le départ d'une épreuve de circuit asphalte FFSA, quand l'ambulance médicale doit-elle être en position ?",
    options: [
      "Au moment du premier tour de formation",
      "Avant le départ du premier concurrent",
      "Dès l'ouverture de la voie des stands",
      "Lors de la mise en grille des concurrents",
    ],
    correct: 1,
    explanation: "L'ambulance et les véhicules médicaux doivent être EN POSITION avant le départ du premier concurrent. Aucun concurrent ne doit prendre le départ si les moyens médicaux et de secours ne sont pas opérationnels et positionnés.",
  },
  {
    id: 14,
    question: "Si un commissaire aperçoit des débris sur la trajectoire pendant la course, peut-il les ramasser seul sans autorisation ?",
    options: [
      "Oui, si la voie est libre à ce moment-là",
      "Non, il ne peut accéder à la piste que sur autorisation du DC",
      "Oui, uniquement sous drapeau jaune",
      "Oui, si son Chef de poste est d'accord",
    ],
    correct: 1,
    explanation: "Le commissaire ne peut JAMAIS accéder à la piste sans autorisation du DC, même pour retirer des débris. Il signale d'abord la situation par les drapeaux appropriés (jaune et rouge rayé), alerte le DC, et attend l'autorisation avant toute intervention physique sur la piste.",
  },
  {
    id: 15,
    question: "La voiture médicale (Medical Car) entre sur la piste :",
    options: [
      "Automatiquement dès qu'un drapeau rouge est déclenché",
      "Sur ordre du DC, pour intervenir sur un pilote blessé sur la piste",
      "En suivant systématiquement le Safety Car",
      "Uniquement quand les pompiers sont déjà sur place",
    ],
    correct: 1,
    explanation: "La voiture médicale entre sur la piste sur ordre du DC, lorsqu'une intervention médicale est requise sur la piste même. En début de course, elle peut suivre le Safety Car au départ. Elle ne sort pas de façon automatique à chaque drapeau rouge.",
  },
  {
    id: 16,
    question: "En cas de déversement de carburant après un accident, quelle précaution est impérative ?",
    options: [
      "Ignorer — le carburant moderne ne s'enflamme pas facilement",
      "Éviter toute source d'étincelle, maintenir la zone éloignée et alerter le DC",
      "Arroser immédiatement avec de l'eau pour diluer",
      "Répandre du sable sur le carburant pour l'absorber avant d'agir",
    ],
    correct: 1,
    explanation: "Le carburant répandu présente un risque d'incendie majeur. Il faut éviter TOUTE source d'étincelle (clés à molette sur asphalte, cigarette, téléphone...), maintenir la zone dégagée des personnes non indispensables et alerter le DC immédiatement.",
  },
  {
    id: 17,
    question: "Lors d'une intervention médicale sur un pilote blessé, quel est le rôle du commissaire de piste ?",
    options: [
      "Prendre la direction des opérations médicales",
      "Sécuriser la zone, maintenir les signaux de danger et laisser les professionnels de santé intervenir",
      "Administrer les premiers soins médicaux en attendant le médecin",
      "Transporter le blessé vers le poste médical le plus proche",
    ],
    correct: 1,
    explanation: "Le commissaire de piste n'est pas médecin. Son rôle lors d'une intervention médicale est de sécuriser la zone (signaux de danger, éloignement des curieux) et de laisser les professionnels de santé travailler. Intervenir à leur place peut aggraver la situation.",
  },
  {
    id: 18,
    question: "Que doit faire le commissaire si sa radio tombe en panne pendant un incident actif dans sa zone ?",
    options: [
      "Quitter son poste pour alerter le commissaire le plus proche",
      "Maintenir les signaux visuels adaptés et utiliser tout moyen alternatif (gestes vers postes voisins)",
      "Arrêter de présenter des signaux — sans radio il n'est plus habilité",
      "Retourner au paddock pour chercher une radio de rechange",
    ],
    correct: 1,
    explanation: "En cas de panne radio, on ne quitte JAMAIS son poste pendant un incident actif. On maintient les signaux visuels et on essaie d'alerter les postes voisins par gestes. Les signaux visuels protègent immédiatement les concurrents qui arrivent.",
  },
  {
    id: 19,
    question: "Lors d'un accident impliquant un pilote de moto, le commissaire doit être particulièrement vigilant sur :",
    options: [
      "Le risque de fuite d'huile moteur uniquement",
      "Ne pas retirer le casque du pilote sauf danger immédiat — risque de blessure cervicale grave",
      "Immédiatement retirer le casque pour vérifier sa conscience",
      "Déplacer le pilote hors de la route avant tout geste de secours",
    ],
    correct: 1,
    explanation: "En moto, retirer le casque d'un pilote blessé peut provoquer ou aggraver une lésion cervicale grave. Le casque ne doit être retiré QUE si le pilote présente un danger vital immédiat (obstruction des voies respiratoires, vomissements) et par des personnes formées à ce geste.",
  },
  {
    id: 20,
    question: "Quelle est la règle absolue concernant le commissaire et la trajectoire des véhicules en mouvement ?",
    options: [
      "Il peut la traverser rapidement si aucun véhicule n'est visible",
      "Ne jamais tourner le dos aux véhicules en mouvement et ne jamais s'exposer sans sécurité garantie",
      "Il peut l'observer depuis n'importe quelle position s'il est équipé d'un gilet réfléchissant",
      "Il doit s'allonger au sol pour présenter les signaux depuis la zone de dégagement",
    ],
    correct: 1,
    explanation: "La règle absolue est de ne JAMAIS tourner le dos aux véhicules en mouvement et de ne jamais s'exposer à la trajectoire sans garantie de sécurité. Un commissaire qui ne voit pas les véhicules arriver ne peut pas se protéger. Cette règle s'applique même lors de l'intervention sur un autre incident.",
  },
];

export default function QuizSecuritePage() {
  return (
    <QuizEngine
      title="Quiz sécurité & interventions"
      questions={questions}
      backHref="/devenir-commissaire/quiz"
      backLabel="Retour aux quiz"
      reviewHref="/devenir-commissaire/procedures"
      reviewLabel="Revoir les procédures"
      glowColor="bg-orange-500/5"
    />
  );
}
