import QuizEngine, { QuizQuestion } from "@/components/quiz/QuizEngine";

const questions: QuizQuestion[] = [
  {
    id: 1,
    question: "Lors du déploiement du Safety Car, les concurrents sont-ils autorisés à se dépasser ?",
    options: [
      "Oui, si la portion de piste est dégagée",
      "Non, tout dépassement est strictement interdit",
      "Oui, uniquement pour rejoindre leur position d'origine",
      "Oui, avec l'accord explicite du DC par radio",
    ],
    correct: 1,
    explanation: "Sous Safety Car, aucun dépassement n'est autorisé. Les concurrents doivent se regrouper derrière le premier concurrent dans l'ordre de course et suivre le Safety Car jusqu'à la relance.",
  },
  {
    id: 2,
    question: "À quelle vitesse maximum les concurrents circulent-ils sous Code 60 en FFSA circuit asphalte ?",
    options: [
      "50 km/h",
      "60 km/h",
      "80 km/h",
      "100 km/h",
    ],
    correct: 1,
    explanation: "Sous Code 60, la vitesse est limitée à 60 km/h, contrôlée par le chronométrage. C'est plus restrictif que le FCY (80 km/h). Chaque tour effectué sous Code 60 compte comme un tour de course normal.",
  },
  {
    id: 3,
    question: "Lors d'une FCY, quel panneau est simultanément présenté avec le drapeau jaune à tous les postes ?",
    options: [
      "Panneau « SC »",
      "Panneau « FCY »",
      "Panneau « SLOW »",
      "Panneau « 80 »",
    ],
    correct: 1,
    explanation: "Lors d'une FCY (Full Course Yellow), chaque poste agite un drapeau JAUNE ET présente simultanément le panneau « FCY ». La combinaison des deux signaux est obligatoire.",
  },
  {
    id: 4,
    question: "Lors du déclenchement d'un drapeau rouge en circuit asphalte FFSA, où les concurrents doivent-ils se rendre ?",
    options: [
      "S'arrêter immédiatement là où ils se trouvent",
      "Rejoindre les stands à vitesse réduite",
      "Se ranger sur la trajectoire la plus courte",
      "Continuer jusqu'à la fin de leur tour",
    ],
    correct: 1,
    explanation: "Lors d'un drapeau rouge, les concurrents doivent rejoindre les stands à vitesse très réduite sans dépasser. Aucune manœuvre dangereuse n'est autorisée. Les interventions médicales sur piste ne peuvent débuter qu'une fois la piste dégagée.",
  },
  {
    id: 5,
    question: "Le Virtual Safety Car (VSC) est-il utilisé dans les compétitions FFSA nationales ?",
    options: [
      "Oui, depuis la saison 2022",
      "Non, c'est une procédure propre à la FIA/F1",
      "Oui, uniquement sur les circuits homologués Grade 1",
      "Oui, il remplace le FCY depuis 2024",
    ],
    correct: 1,
    explanation: "Le VSC (Virtual Safety Car) est une procédure propre à la FIA/F1 et à certaines épreuves FIA internationales. Dans les compétitions FFSA nationales, son équivalent est le FCY (Full Course Yellow) à 80 km/h.",
  },
  {
    id: 6,
    question: "Lors d'un départ arrêté en FFSA, comment le signal de départ est-il donné ?",
    options: [
      "Par un drapeau vert agité par le directeur de course",
      "Par l'extinction des feux rouges",
      "Par un signal sonore (klaxon)",
      "Par un feu vert allumé",
    ],
    correct: 1,
    explanation: "Lors d'un départ arrêté, les feux rouges s'allument un à un puis s'éteignent simultanément pour donner le départ. L'extinction des feux est le signal officiel de départ.",
  },
  {
    id: 7,
    question: "Quelle procédure FFSA impose une limitation à 80 km/h sans déployer physiquement un véhicule de sécurité sur la piste ?",
    options: [
      "Safety Car (SC)",
      "Code 60",
      "Full Course Yellow (FCY)",
      "Virtual Safety Car (VSC)",
    ],
    correct: 2,
    explanation: "Le FCY (Full Course Yellow) impose 80 km/h à tous les concurrents sans qu'un véhicule de sécurité soit physiquement déployé. C'est une procédure de neutralisation légère, plus rapide à mettre en place que le SC.",
  },
  {
    id: 8,
    question: "Pendant le déploiement du Safety Car, le véhicule SC :",
    options: [
      "Rentre aux stands pendant l'intervention des commissaires",
      "Reste en piste et effectue des tours à vitesse réduite",
      "S'arrête en bord de piste à hauteur de l'incident",
      "Est remplacé par la voiture médicale (Medical Car)",
    ],
    correct: 1,
    explanation: "Le Safety Car reste en piste et effectue des tours à vitesse réduite avec le peloton regroupé derrière lui, jusqu'à ce que la piste soit dégagée et que le DC autorise la relance.",
  },
  {
    id: 9,
    question: "Lors du déclenchement d'un drapeau rouge, à quel moment les interventions médicales sur la piste peuvent-elles débuter ?",
    options: [
      "Immédiatement dès le déclenchement du drapeau rouge",
      "Une fois que tous les concurrents ont quitté la piste",
      "Simultanément au ralentissement des concurrents",
      "Uniquement après aval du médecin chef de course",
    ],
    correct: 1,
    explanation: "Les interventions médicales lourdes sur la piste ne peuvent commencer qu'une fois que tous les concurrents ont quitté la portion de piste concernée, pour éviter tout risque de sur-accident.",
  },
  {
    id: 10,
    question: "Quelle est la différence principale entre le FCY et le Code 60 en circuit asphalte FFSA ?",
    options: [
      "La vitesse imposée aux concurrents",
      "La durée maximale autorisée de la procédure",
      "Le nombre de postes qui affichent le signal",
      "Le type d'incident déclencheur",
    ],
    correct: 0,
    explanation: "La différence principale est la vitesse imposée : FCY = 80 km/h, Code 60 = 60 km/h. Les deux procédures concernent tous les postes, et les deux interdisent les dépassements. Le Code 60 est plus restrictif.",
  },
  {
    id: 11,
    question: "Lors d'un Safety Car, quel concurrent se trouve immédiatement derrière le véhicule SC ?",
    options: [
      "Toujours le vainqueur en titre de l'épreuve",
      "Le premier concurrent dans l'ordre de course",
      "La voiture médicale (Medical Car)",
      "Aucun concurrent — une zone tampon est maintenue",
    ],
    correct: 1,
    explanation: "Le premier concurrent dans l'ordre de course au moment du déploiement du SC se place immédiatement derrière la voiture de sécurité. Les autres suivent dans l'ordre de course.",
  },
  {
    id: 12,
    question: "Sous Code 60, chaque tour effectué à vitesse réduite :",
    options: [
      "Ne compte pas dans le nombre total de tours de course",
      "Compte comme un tour de course normal",
      "Compte pour la moitié d'un tour",
      "Dépend du règlement particulier de l'épreuve",
    ],
    correct: 1,
    explanation: "Sous Code 60, chaque tour effectué à 60 km/h compte comme un tour de course normal. La course n'est pas suspendue, simplement neutralisée à vitesse réduite.",
  },
  {
    id: 13,
    question: "En course de côte, un commissaire de piste peut-il présenter le drapeau rouge de sa propre initiative ?",
    options: [
      "Non, uniquement sur ordre du DC par radio",
      "Oui, en cas de danger immédiat mettant des vies en danger",
      "Oui, pour tout incident visible depuis son poste",
      "Non, jamais — même en situation d'urgence absolue",
    ],
    correct: 1,
    explanation: "En course de côte, le commissaire peut déclencher le drapeau rouge de sa propre initiative uniquement en cas de danger immédiat menaçant des vies. Il doit immédiatement en informer la direction de course par radio.",
  },
  {
    id: 14,
    question: "La voie des stands (pit lane) reste-t-elle ouverte sous Safety Car ?",
    options: [
      "Non, elle est fermée pendant toute la durée du SC",
      "Oui, sauf instruction contraire du DC",
      "Uniquement pour les interventions médicales obligatoires",
      "Fermée uniquement lors du premier tour de SC",
    ],
    correct: 1,
    explanation: "En circuit asphalte FFSA, la voie des stands reste ouverte sous Safety Car sauf instruction contraire du DC. Idem sous FCY. Les concurrents peuvent rentrer aux stands pour changer de pneus ou ravitailler.",
  },
  {
    id: 15,
    question: "Lors d'une FCY, le double drapeau jaune est agité :",
    options: [
      "À tous les postes pendant toute la durée de la FCY",
      "Uniquement au poste précédant le danger si l'incident est sur la trajectoire",
      "À tous les postes lors du premier tour uniquement",
      "Jamais en FCY — seul le drapeau jaune simple est utilisé",
    ],
    correct: 1,
    explanation: "Lors d'une FCY, le double drapeau jaune est agité UNIQUEMENT au poste précédant directement le danger si l'incident obstrue la trajectoire. Tous les autres postes présentent un simple jaune + panneau FCY.",
  },
  {
    id: 16,
    question: "Lors d'un départ lancé (formation lap), les concurrents :",
    options: [
      "Peuvent doubler librement pour trouver leur position d'origine",
      "Effectuent un tour de formation puis se positionnent sur la grille",
      "Partent dans l'ordre inverse du classement des qualifications",
      "Circulent à 80 km/h maximum pendant le tour",
    ],
    correct: 1,
    explanation: "Lors d'un départ lancé, les concurrents effectuent un tour de formation à allure réduite pour réchauffer les pneus, puis se positionnent sur la grille dans l'ordre de départ avant que les feux s'allument.",
  },
  {
    id: 17,
    question: "Lors du déclenchement du Code 60, le drapeau violet est d'abord :",
    options: [
      "Présenté fixe immédiatement à tous les postes",
      "Agité à tous les postes sur ordre du DC, puis tenu fixe",
      "Agité continuellement jusqu'à la fin de la procédure",
      "Présenté uniquement sur la ligne de départ/arrivée",
    ],
    correct: 1,
    explanation: "Le Code 60 se déclenche ainsi : le drapeau violet (avec cercle blanc « 60 ») est d'abord AGITÉ à tous les postes sur ordre du DC, puis TENU FIXE jusqu'à la fin de la procédure. La reprise est signalée par un vert agité pendant 1 tour.",
  },
  {
    id: 18,
    question: "La fin de la procédure FCY est signalée par :",
    options: [
      "Un drapeau vert fixe présenté à tous les postes",
      "Un drapeau vert agité pendant 1 tour à tous les postes",
      "Le simple retrait du panneau « FCY »",
      "Un signal radio uniquement, sans signal visuel sur piste",
    ],
    correct: 1,
    explanation: "La fin de FCY est signalée par un drapeau vert AGITÉ pendant 1 tour à TOUS les postes. La durée du vert (1 tour) permet à tous les concurrents de constater la reprise de course.",
  },
  {
    id: 19,
    question: "Lors d'un Safety Car, quelles sont les couleurs et le mode des feux spéciaux du véhicule SC ?",
    options: [
      "Bleus clignotants (comme un véhicule d'urgence standard)",
      "Orange clignotants",
      "Rouges fixes",
      "Blancs fixes et orange clignotants",
    ],
    correct: 1,
    explanation: "Le Safety Car est équipé de feux ORANGE CLIGNOTANTS lorsqu'il est déployé en piste. Ces feux s'éteignent sur la ligne de relance pour signaler aux pilotes que la relance est imminente.",
  },
  {
    id: 20,
    question: "Lors d'une neutralisation Safety Car, à quel signal les pilotes comprennent-ils que la relance est imminente ?",
    options: [
      "Le Safety Car allume des feux verts",
      "Le Safety Car éteint ses feux orange clignotants",
      "Un drapeau vert est montré à tous les postes simultanément",
      "Un signal sonore retentit depuis la ligne de départ/arrivée",
    ],
    correct: 1,
    explanation: "Le Safety Car ÉTEINT ses feux orange clignotants sur la ligne de relance pour signaler que la relance est imminente. Le drapeau vert est ensuite présenté uniquement sur cette ligne de relance.",
  },
];

export default function QuizProceduresPage() {
  return (
    <QuizEngine
      title="Quiz procédures"
      questions={questions}
      backHref="/devenir-commissaire/quiz"
      backLabel="Retour aux quiz"
      reviewHref="/devenir-commissaire/procedures"
      reviewLabel="Revoir les procédures"
      glowColor="bg-red-500/5"
    />
  );
}
