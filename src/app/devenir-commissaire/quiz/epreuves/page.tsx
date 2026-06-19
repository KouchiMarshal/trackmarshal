import QuizEngine, { QuizQuestion } from "@/components/quiz/QuizEngine";

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "En circuit asphalte, combien de commissaires sont généralement mobilisés pour une épreuve nationale ?",
    options: [
      "10 à 20 commissaires",
      "60 à 150 commissaires",
      "200 à 300 commissaires",
      "Moins de 10 commissaires",
    ],
    correct: 1,
    explanation: "Un circuit asphalte national mobilise généralement 60 à 150 commissaires selon la taille du circuit et le niveau de l'épreuve. Un événement comme les 24 Heures du Mans en mobilise plus de 400.",
  },
  {
    id: 2,
    question: "En Karting, quelle est la particularité opérationnelle principale pour les commissaires de piste ?",
    options: [
      "Cadence très faible — les karts passent lentement et rarement",
      "Cadence très élevée (peloton serré) et incidents fréquents à gérer rapidement",
      "Aucune intervention physique requise — tout se gère par radio",
      "Les commissaires travaillent uniquement depuis la tour de contrôle",
    ],
    correct: 1,
    explanation: "En Karting, la cadence de passage est très élevée (peloton souvent groupé) et les incidents sont fréquents. Les commissaires doivent réagir rapidement. Les karts sont plus légers, ce qui facilite les interventions physiques.",
  },
  {
    id: 3,
    question: "En course de côte, comment les véhicules s'élancent-ils sur la montée ?",
    options: [
      "En groupe de 3 à 5 simultanément, côte à côte",
      "Un par un à intervalles réguliers",
      "En deux vagues successives de 10 véhicules",
      "En convoi derrière une voiture ouvreuse",
    ],
    correct: 1,
    explanation: "En course de côte, les véhicules s'élancent un par un à intervalles réguliers. Les commissaires sont positionnés tout le long de la montée, avec des risques de sortie de route sans garde-fou sur certains passages.",
  },
  {
    id: 4,
    question: "En Rallye, quelle est la principale spécificité du passage des voitures sur les spéciales ?",
    options: [
      "Toutes les voitures passent en même temps dans un peloton groupé",
      "Les voitures passent une à une à intervalles, avec de longues périodes d'attente entre les groupes",
      "Les voitures passent en flux continu pendant toute la durée de la spéciale",
      "Les voitures ne passent qu'une seule fois par sens de la spéciale",
    ],
    correct: 1,
    explanation: "En rallye, les voitures passent une à une à intervalles réguliers (1 à 3 minutes selon les épreuves). Les commissaires doivent gérer de longues périodes d'attente entre les groupes, et parfois sans liaison radio directe.",
  },
  {
    id: 5,
    question: "En Autocross / Rallycross, quelle est la principale contrainte pour le commissaire ?",
    options: [
      "La piste trop longue pour intervenir rapidement",
      "Projections importantes de graviers et de boue, visibilité réduite par la poussière",
      "Les véhicules circulent trop lentement",
      "L'absence totale de communication radio entre les postes",
    ],
    correct: 1,
    explanation: "En Autocross/Rallycross, les pistes sont en terre, gravier ou mixte. Plusieurs voitures circulent simultanément sur des circuits courts. Les projections de gravillons et de boue sont importantes, et la poussière réduit la visibilité.",
  },
  {
    id: 6,
    question: "En Drift, quelle est la vigilance particulière des commissaires de piste ?",
    options: [
      "Les grandes vitesses en ligne droite",
      "La fumée de pneus permanente (masque recommandé) et les trajectoires larges et imprévisibles",
      "L'absence de spectateurs rendant la discipline peu surveillée",
      "Les dépassements dangereux entre concurrents",
    ],
    correct: 1,
    explanation: "En Drift, la fumée de pneus est permanente (masque recommandé), les trajectoires sont larges et imprévisibles, et le public peut être très proche de la piste. La vigilance est accrue sur les zones de sécurité autour de la piste.",
  },
  {
    id: 7,
    question: "En rallye, combien de commissaires sont généralement mobilisés par épreuve spéciale ?",
    options: [
      "5 à 10 commissaires",
      "20 à 60 commissaires",
      "100 à 200 commissaires",
      "Moins de 5 commissaires",
    ],
    correct: 1,
    explanation: "Une épreuve spéciale de rallye mobilise généralement 20 à 60 commissaires selon la longueur et la configuration de la spéciale. Un rallye complet peut mobiliser 200 à 400 commissaires sur l'ensemble de ses spéciales.",
  },
  {
    id: 8,
    question: "En course de côte, quelle est la durée type d'une épreuve ?",
    options: [
      "30 minutes maximum",
      "1 à 2 jours",
      "3 à 5 jours",
      "1 semaine complète",
    ],
    correct: 1,
    explanation: "Une course de côte se déroule généralement sur 1 à 2 jours, avec plusieurs manches chronométrées (montées). Les commissaires sont positionnés sur toute la route montante avec dénivelé.",
  },
  {
    id: 9,
    question: "Un commissaire actif en France participe en moyenne à combien d'épreuves par saison ?",
    options: [
      "2 à 4 épreuves",
      "8 à 15 épreuves",
      "20 à 25 épreuves",
      "1 seule épreuve",
    ],
    correct: 1,
    explanation: "Un commissaire actif participe en moyenne à 8 à 15 épreuves par saison. Ce chiffre varie selon la disponibilité, la région et l'implication dans différentes disciplines (circuit, rallye, côte...).",
  },
  {
    id: 10,
    question: "Qu'est-ce qu'une « zone de dégagement » en bord de piste ?",
    options: [
      "La zone réservée aux spectateurs derrière les barrières",
      "L'espace aménagé en dehors de la piste pour arrêter les véhicules sortant de trajectoire",
      "Le passage entre le paddock et la pit lane",
      "La zone de contrôle technique avant la course",
    ],
    correct: 1,
    explanation: "La zone de dégagement est l'espace aménagé en dehors de la piste pour arrêter les véhicules sortant de trajectoire. Elle peut être en asphalte, gravier ou herbe selon le niveau d'homologation du circuit.",
  },
  {
    id: 11,
    question: "Qu'est-ce qu'un « pit stop » ?",
    options: [
      "La procédure de départ en côte (pente)",
      "L'arrêt d'un concurrent aux stands pour ravitaillement, changement de pneus ou réparations",
      "La traversée de la pit lane sans s'arrêter (pénalité drive-through)",
      "L'arrêt du Safety Car dans la pit lane",
    ],
    correct: 1,
    explanation: "Le pit stop est l'arrêt d'un concurrent aux stands pendant la course pour ravitaillement, changement de pneus ou réparations. Sa durée peut être stratégiquement cruciale en compétition.",
  },
  {
    id: 12,
    question: "Qu'est-ce qu'un « out lap » ?",
    options: [
      "Le dernier tour de course avant l'arrivée",
      "Le tour de sortie des stands pour rejoindre la piste et réchauffer les pneus avant un tour rapide",
      "Le tour de reconnaissance effectué avant les qualifications",
      "Le tour de rentrée aux stands après le damier",
    ],
    correct: 1,
    explanation: "L'out lap est le tour de sortie des stands permettant au concurrent de rejoindre la piste et de réchauffer pneus et freins avant d'entamer un tour chronométré rapide. Il est suivi du flying lap (tour lancé).",
  },
  {
    id: 13,
    question: "Que désignent les « track limits » (ou « cut ») en compétition ?",
    options: [
      "Les limites de vitesse imposées sur certaines portions de la piste",
      "Le franchissement des limites de la piste par un concurrent, pouvant entraîner une pénalité ou l'annulation d'un temps",
      "Les zones interdites aux commissaires le long du circuit",
      "L'espace réglementaire entre deux postes de commissaires",
    ],
    correct: 1,
    explanation: "Les track limits (ou cut) désignent le franchissement des limites de la piste par un concurrent, généralement matérialisées par des lignes blanches ou des vibreurs. Peut entraîner une pénalité ou l'annulation d'un temps selon le règlement.",
  },
  {
    id: 14,
    question: "Qu'est-ce qu'un « bac à graviers » ?",
    options: [
      "Un dispositif de contrôle du poids des véhicules",
      "Une zone de dégagement remplie de graviers pour ralentir les véhicules sortant de la trajectoire",
      "Un type d'obstacle artificiel ajouté sur la piste pour créer une chicane",
      "Le nom du revêtement spécial utilisé dans les zones de freinage",
    ],
    correct: 1,
    explanation: "Le bac à graviers est une zone de dégagement remplie de graviers disposée en dehors de la piste pour ralentir les véhicules qui sortent de trajectoire. Il tend à être remplacé par des zones en asphalte sur les circuits modernes.",
  },
  {
    id: 15,
    question: "Qu'est-ce qu'une « chicane » sur un circuit ?",
    options: [
      "Un type de drapeau spécifique utilisé en rallye",
      "Une série de virages alternatifs ajoutés pour réduire la vitesse à un endroit précis",
      "Le nom du poste de commissaires situé en courbe serrée",
      "Une zone de dépassement autorisé sur ligne droite",
    ],
    correct: 1,
    explanation: "Une chicane est une série de virages alternatifs ajoutés volontairement sur un circuit pour réduire la vitesse à un endroit précis, souvent en remplacement d'une zone dangereuse ou pour homologuer un circuit plus sûr.",
  },
  {
    id: 16,
    question: "En rallye, qu'est-ce que le « scratch » sur une épreuve spéciale ?",
    options: [
      "Le meilleur temps absolu sur la spéciale, toutes catégories confondues",
      "Le temps de référence servant à calculer les pénalités de retard",
      "La vitesse moyenne calculée sur l'ensemble de la spéciale",
      "Le premier concurrent à l'arrivée dans sa catégorie seulement",
    ],
    correct: 0,
    explanation: "Le scratch est le meilleur temps absolu réalisé sur une épreuve spéciale, toutes catégories confondues. Le concurrent qui réalise le scratch est le plus rapide de la spéciale, peu importe sa catégorie.",
  },
  {
    id: 17,
    question: "Qu'est-ce qu'une épreuve spéciale (ES) en rallye ?",
    options: [
      "Une manche comptant double pour le championnat",
      "Une portion de route fermée à la circulation sur laquelle les équipages s'affrontent en temps",
      "Une épreuve de qualifications effectuée la veille du rallye",
      "Un secteur chronométré ouvert à la circulation normale",
    ],
    correct: 1,
    explanation: "L'épreuve spéciale (ES) est une portion de route fermée à la circulation sur laquelle les équipages s'affrontent en temps, partant un à un à intervalles. Elle est chronométrée du départ à l'arrivée.",
  },
  {
    id: 18,
    question: "Quel officiel est spécifiquement chargé de contrôler la conformité TECHNIQUE des véhicules ?",
    options: [
      "Le Directeur de course",
      "Le Steward (commissaire sportif)",
      "Le Délégué technique (commissaire technique)",
      "Le Chef de poste",
    ],
    correct: 2,
    explanation: "Le Délégué technique (ou commissaire technique) est chargé de vérifier la conformité des véhicules au règlement technique. Il intervient avant la course lors du contrôle technique et après la course en parc fermé.",
  },
  {
    id: 19,
    question: "Qu'est-ce qu'un « lap record » sur un circuit ?",
    options: [
      "Le nombre de tours réglementaire imposé pour la course",
      "Le meilleur temps jamais réalisé sur ce circuit en compétition",
      "Le tour de reconnaissance officiel effectué avant chaque course",
      "La limite réglementaire de tours autorisée sous Safety Car",
    ],
    correct: 1,
    explanation: "Le lap record est le meilleur temps jamais réalisé sur un circuit en compétition (record absolu). Le fastest lap est le tour le plus rapide d'une course spécifique — il peut différer du lap record absolu.",
  },
  {
    id: 20,
    question: "La combinaison en coton est OBLIGATOIRE pour le commissaire en circuit asphalte. Pourquoi les matières synthétiques sont-elles proscrites ?",
    options: [
      "Parce qu'elles sont trop légères et se déchirent facilement",
      "Parce qu'elles fondent sous la chaleur et peuvent aggraver les brûlures en cas d'accident",
      "Parce que la FFSA n'a pas les moyens de les contrôler",
      "Parce qu'elles ne permettent pas d'accrocher les insignes et badges officiels",
    ],
    correct: 1,
    explanation: "Les matières synthétiques (nylon, polyester...) fondent à haute température et peuvent coller à la peau, aggravant gravement les brûlures en cas de contact avec des liquides enflammés ou une chaleur intense. Le coton brûle mais ne fond pas, offrant une meilleure protection.",
  },
];

export default function QuizEpreuvesPage() {
  return (
    <QuizEngine
      title="Quiz épreuves & rôles"
      questions={questions}
      backHref="/devenir-commissaire/quiz"
      backLabel="Retour aux quiz"
      reviewHref="/devenir-commissaire/epreuves"
      reviewLabel="Revoir les types d'épreuves"
      glowColor="bg-green-500/5"
    />
  );
}
