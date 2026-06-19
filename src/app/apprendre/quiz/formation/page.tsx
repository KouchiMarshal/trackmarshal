import QuizEngine, { QuizQuestion } from "@/components/quiz/QuizEngine";

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Que signifie FFSA ?",
    options: [
      "Fédération Française des Sports Automobiles",
      "Fédération Française du Sport Automobile",
      "Fédération Française de Sécurité Automobile",
      "Fédération Française des Sports d'Asphalte",
    ],
    correct: 1,
    explanation: "La FFSA (Fédération Française du Sport Automobile) organise et réglemente les compétitions automobiles en France. Elle délivre les licences des commissaires auto, de l'ENCOC jusqu'à l'EICOB.",
  },
  {
    id: 2,
    question: "Que signifie FIA ?",
    options: [
      "Fédération Internationale de l'Automobile",
      "Fédération Internationale des Aviateurs",
      "Fédération Internationale de l'Asphalte",
      "Fédération Internationale des Amateurs",
    ],
    correct: 0,
    explanation: "La FIA (Fédération Internationale de l'Automobile) est l'organisme mondial régissant le sport automobile international (F1, WRC, WEC...). Les commissaires titulaires de la licence EICOB peuvent officier sur ses épreuves.",
  },
  {
    id: 3,
    question: "Quelle fédération délivre les licences OFS et OFF pour les commissaires des compétitions MOTO en France ?",
    options: [
      "FFSA",
      "FIA",
      "FFM",
      "ASA",
    ],
    correct: 2,
    explanation: "La FFM (Fédération Française de Motocyclisme) est l'équivalent de la FFSA pour les compétitions moto. Elle délivre les licences OFS (Officiel de la Fédération Sportive) et OFF pour les commissaires moto.",
  },
  {
    id: 4,
    question: "Qu'est-ce qu'une ASA en sport automobile français ?",
    options: [
      "Une autorité nationale de surveillance des circuits",
      "Une Association Sportive Automobile locale, affiliée à la FFSA",
      "Une administration d'État délivrant les licences",
      "Une agence de sécurité indépendante",
    ],
    correct: 1,
    explanation: "L'ASA est une Association Sportive Automobile locale affiliée à la FFSA. C'est via l'ASA de sa région que le commissaire prend sa licence, intègre les équipes d'officiels et participe aux épreuves.",
  },
  {
    id: 5,
    question: "Quelle est la PREMIÈRE licence commissaire délivrée par la FFSA ?",
    options: [
      "EICOB",
      "ENCOC",
      "OFS",
      "Commissaire A",
    ],
    correct: 1,
    explanation: "L'ENCOC est la première licence commissaire FFSA (correspondant au niveau Commissaire C). Elle permet d'officier sur des épreuves nationales, généralement sous supervision d'un commissaire plus expérimenté.",
  },
  {
    id: 6,
    question: "Avec quelle licence peut-on officier sur des épreuves FIA à l'échelle internationale ?",
    options: [
      "ENCOC",
      "Commissaire B",
      "EICOB",
      "OFS",
    ],
    correct: 2,
    explanation: "L'EICOB est la licence supérieure du cursus FFSA. Elle permet d'officier sur des épreuves FIA dans toute l'Europe. Les commissaires EICOB peuvent notamment être désignés sur des manches de championnat du monde.",
  },
  {
    id: 7,
    question: "Avant d'obtenir la licence ENCOC, quelle étape de formation est obligatoire ?",
    options: [
      "Un stage pratique de 2 jours sur un circuit homologué",
      "Une formation en ligne (e-learning) sur la plateforme officielle FFSA",
      "La validation du brevet PSC1 (premiers secours)",
      "Un examen écrit en présentiel dans un centre FFSA",
    ],
    correct: 1,
    explanation: "La formation en ligne (e-learning) sur la plateforme officielle FFSA est obligatoire avant l'obtention de l'ENCOC. Elle couvre les fondamentaux du commissariat : drapeaux, procédures, sécurité, rôles.",
  },
  {
    id: 8,
    question: "En circuit asphalte FFSA, quelle tenue vestimentaire est OBLIGATOIRE pour le commissaire de piste ?",
    options: [
      "Combinaison ignifugée homologuée FIA",
      "Combinaison en coton",
      "Chasuble haute visibilité en matière synthétique",
      "Tenue libre imposée par l'organisateur",
    ],
    correct: 1,
    explanation: "La combinaison en COTON est obligatoire en circuit asphalte FFSA. Les matières synthétiques (nylon, polyester) sont proscrites car elles fondent sous la chaleur et peuvent aggraver des brûlures. Le coton protège des projections et de la chaleur.",
  },
  {
    id: 9,
    question: "Quel outil permet au commissaire de couper rapidement le harnais ou la ceinture d'un pilote blessé ?",
    options: [
      "Une pince multifonctions",
      "Un coupe-sangle / coupe-ceinture de sécurité",
      "Des ciseaux universels de pharmacie",
      "Un couteau à lame rétractable",
    ],
    correct: 1,
    explanation: "Le coupe-sangle (ou coupe-ceinture de sécurité) est un équipement INDISPENSABLE du commissaire de piste. Il permet de couper rapidement les sangles ou harnais d'un pilote en cas d'urgence, sans blesser le conducteur.",
  },
  {
    id: 10,
    question: "Qu'est-ce qu'un « briefing » en sport automobile ?",
    options: [
      "Le document officiel des résultats de la course",
      "La réunion obligatoire avant chaque épreuve, où le DC présente procédures et consignes",
      "La procédure d'évacuation d'un véhicule accidenté",
      "Le classement provisoire publié après les qualifications",
    ],
    correct: 1,
    explanation: "Le briefing est une réunion obligatoire avant chaque épreuve, rassemblant tous les officiels. Le directeur de course y présente les procédures spécifiques de la journée, les zones de danger, les signaux particuliers et les consignes de sécurité.",
  },
  {
    id: 11,
    question: "Le « Steward » (commissaire sportif) et le commissaire de piste ont-ils le même rôle ?",
    options: [
      "Oui, c'est le même rôle avec un titre différent selon les disciplines",
      "Non — le Steward juge les incidents et inflige des pénalités, il n'intervient pas physiquement sur la piste",
      "Oui, mais le Steward travaille uniquement depuis la ligne de départ/arrivée",
      "Non — le Steward est le responsable médical de l'épreuve",
    ],
    correct: 1,
    explanation: "Les Stewards sont des commissaires SPORTIFS chargés de juger les incidents et d'infliger des pénalités. Ils n'interviennent jamais physiquement sur la piste — c'est exclusivement le rôle du commissaire de piste.",
  },
  {
    id: 12,
    question: "Qu'est-ce que « l'homologation » d'un circuit ou d'un équipement ?",
    options: [
      "L'inscription du circuit au calendrier officiel FFSA",
      "La validation officielle qu'un circuit, véhicule ou équipement est conforme aux normes requises pour la compétition",
      "Le classement officiel après une épreuve",
      "La procédure administrative d'ouverture d'un circuit au public",
    ],
    correct: 1,
    explanation: "L'homologation est la validation officielle par la FFSA ou la FIA qu'un circuit, un véhicule ou un équipement de sécurité est conforme aux normes réglementaires pour être utilisé en compétition.",
  },
  {
    id: 13,
    question: "Qu'est-ce que l'« autoclave » sur un circuit ?",
    options: [
      "Un dispositif de gonflage des pneus en bord de piste",
      "La zone fermée et sécurisée entre les stands et la piste, réservée aux commissaires et personnels autorisés",
      "Un système de refroidissement des freins utilisé par les mécaniciens",
      "La zone de pesée officielle après la course",
    ],
    correct: 1,
    explanation: "L'autoclave est la zone fermée entre les stands et la piste, réservée aux commissaires et personnels autorisés pendant la compétition. Les spectateurs ne peuvent pas y accéder pour des raisons de sécurité.",
  },
  {
    id: 14,
    question: "Qu'est-ce qu'un « Drive-through » en tant que pénalité sportive ?",
    options: [
      "Un arrêt aux stands pour ravitaillement obligatoire imposé par le règlement",
      "Une pénalité obligeant le concurrent à traverser la pit lane à vitesse limitée, sans s'arrêter",
      "Une technique de dépassement autorisée dans certaines zones",
      "La procédure de sortie du Safety Car de la pit lane",
    ],
    correct: 1,
    explanation: "Le Drive-through est une pénalité : le concurrent doit traverser toute la pit lane à la vitesse limitée sans s'arrêter. Il doit être effectué dans un délai défini après notification. Sanction moins sévère que le Stop and Go.",
  },
  {
    id: 15,
    question: "Qu'est-ce qu'un « Stop and Go » ?",
    options: [
      "La procédure de départ sur pente en course de côte",
      "Une pénalité obligeant le concurrent à s'immobiliser dans sa boîte de stands pendant un temps défini",
      "La procédure d'arrêt du Safety Car dans la pit lane",
      "Un arrêt volontaire pendant la course pour changer de stratégie",
    ],
    correct: 1,
    explanation: "Le Stop and Go est une pénalité plus sévère que le Drive-through. Le concurrent doit s'immobiliser dans sa boîte de stands pendant un temps défini (10 secondes, 30 secondes...) avant de repartir, moteur allumé.",
  },
  {
    id: 16,
    question: "Qu'est-ce que la « reconnaissance » en rallye ?",
    options: [
      "Le passage des équipages sur les spéciales à vitesse de course, la veille de l'épreuve",
      "Le passage des équipages sur les spéciales à vitesse réduite pour prendre des notes (pace notes), sur route ouverte",
      "La vérification administrative des licences des pilotes",
      "La visite obligatoire des commissaires sur chaque spéciale avant l'épreuve",
    ],
    correct: 1,
    explanation: "La reconnaissance est le passage des équipages sur les spéciales avant l'épreuve, à vitesse réduite sur route ouverte. L'équipage prend des notes (pace notes) qui serviront pendant les spéciales chronométrées.",
  },
  {
    id: 17,
    question: "Qu'est-ce que le « parc fermé » ?",
    options: [
      "La zone réservée aux spectateurs VIP après la course",
      "La zone sécurisée où les véhicules sont parqués après la course — aucune intervention mécanique autorisée sans permission",
      "Le parking réservé aux commissaires et aux officiels",
      "La zone de contrôle technique effectué avant la mise en grille",
    ],
    correct: 1,
    explanation: "Le parc fermé est une zone sécurisée où les véhicules sont parqués après la course ou les qualifications. Aucune intervention mécanique n'est autorisée sans permission des commissaires techniques, pour garantir l'intégrité des résultats.",
  },
  {
    id: 18,
    question: "En Rallye, les commissaires travaillent généralement :",
    options: [
      "Depuis une tour de contrôle centrale avec vue sur toute la spéciale",
      "En postes isolés en forêt ou sur route, parfois sans liaison radio directe",
      "Toujours en équipe de 10 commissaires minimum par poste",
      "Uniquement depuis le paddock principal de l'épreuve",
    ],
    correct: 1,
    explanation: "En rallye, les commissaires travaillent souvent en postes isolés en forêt ou sur route. Les voitures passent une à une à intervalles. De longues périodes d'attente entre les groupes et une liaison radio parfois absente sont des réalités du terrain.",
  },
  {
    id: 19,
    question: "En circuit asphalte FFSA, le Directeur de course a la responsabilité :",
    options: [
      "Uniquement des départs et arrivées",
      "De l'organisation et de la sécurité globale — il prend toutes les décisions relatives au déroulement (SC, drapeau rouge, pénalités...)",
      "Uniquement du contrôle technique des véhicules",
      "De coordonner les postes de commissaires uniquement",
    ],
    correct: 1,
    explanation: "Le Directeur de course (DC) est l'officiel supérieur responsable de l'organisation et de la sécurité de la course. Il prend toutes les décisions relatives au déroulement de l'épreuve : Safety Car, drapeaux rouges, FCY, Code 60, pénalités...",
  },
  {
    id: 20,
    question: "Le « Chef de poste » est responsible de :",
    options: [
      "Diriger l'ensemble de la course depuis la direction de course",
      "Coordonner son équipe de commissaires, assurer la communication radio avec le DC et prendre les décisions d'intervention au poste",
      "Contrôler la conformité des véhicules en parc fermé",
      "Rédiger les rapports d'incidents et les transmettre aux stewards",
    ],
    correct: 1,
    explanation: "Le Chef de poste coordonne son équipe, maintient la communication radio avec la direction de course et prend les décisions d'intervention au niveau de son poste. Il est le lien essentiel entre la DC et les commissaires sur le terrain.",
  },
];

export default function QuizFormationPage() {
  return (
    <QuizEngine
      title="Quiz licences & institutions"
      questions={questions}
      backHref="/apprendre/quiz"
      backLabel="Retour aux quiz"
      reviewHref="/apprendre/devenir-commissaire"
      reviewLabel="Revoir : devenir commissaire"
      glowColor="bg-purple-500/5"
    />
  );
}
