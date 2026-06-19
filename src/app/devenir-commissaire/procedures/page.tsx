"use client";

import { useState } from "react";
import Link from "next/link";
import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

type DisciplineRow = {
  name: string;
  status: string;
  statusColor: string;
  note: string;
};

type Procedure = {
  emoji: string;
  title: string;
  headerBg: string;
  headerText: string;
  contexte: string;
  role: string;
  etapes: string[];
  pointCritique: string;
  disciplines?: DisciplineRow[];
  motoDisciplines?: DisciplineRow[];
};

const STATUS = {
  oui: "border-green-400 bg-green-100 text-green-800",
  non: "border-zinc-300 bg-zinc-100 text-zinc-600",
  equivalent: "border-blue-400 bg-blue-100 text-blue-800",
  specifique: "border-[#FF5A1F] bg-orange-100 text-orange-800",
  adapte: "border-yellow-400 bg-yellow-100 text-yellow-800",
};

const AUTO_DISCIPLINES = ["Circuit asphalte", "Tout-terrain", "Rallye", "Course de côte", "Karting"];
const MOTO_DISCIPLINES = ["Vitesse", "Motocross", "Enduro", "Endurance TT"];

const procedures: Procedure[] = [
  {
    emoji: "🚗",
    title: "Safety Car (SC)",
    headerBg: "bg-yellow-50 border-yellow-200",
    headerText: "text-yellow-700",
    contexte:
      "Incident ou danger grave nécessitant une neutralisation de la course, sans justifier l'arrêt complet.",
    role: "Présenter le drapeau jaune agité + panneau SC sur TOUS les postes. Le drapeau vert n'est montré qu'à la ligne de relance.",
    etapes: [
      "Sur décision DC, le Safety Car sort des stands feux orange allumés.",
      "TOUS les postes présentent simultanément le drapeau jaune agité et le panneau « SC ».",
      "Un double drapeau jaune agité est présenté au poste précédant le lieu de l'incident.",
      "Les concurrents se rangent en file derrière le SC — tout dépassement est interdit.",
      "L'accès à la voie des stands reste ouvert ; la sortie est réglée par un feu vert (éteint quand le SC passe).",
      "Quand le DC rappelle le SC, ses feux orange s'éteignent. Drapeaux jaunes retirés — seuls restent les panneaux « SC ».",
      "Quand le SC rentre aux stands, panneaux « SC » retirés. Le drapeau VERT est montré UNIQUEMENT sur la ligne de relance.",
    ],
    pointCritique:
      "Le drapeau vert n'est présenté QUE sur la ligne de relance — JAMAIS sur tous les postes lors d'un SC.",
    disciplines: [
      {
        name: "Circuit asphalte",
        status: "OUI",
        statusColor: STATUS.oui,
        note: "SC obligatoire sur toute manifestation. Un 2ème SC est recommandé pour les circuits >7 km. Jaune agité + panneau SC partout. Vert uniquement sur la ligne de relance.",
      },
      {
        name: "Tout-terrain",
        status: "NON",
        statusColor: STATUS.non,
        note: "Pas de Safety Car sur les circuits tout-terrain. L'arrêt de course (drapeau rouge) est utilisé si nécessaire.",
      },
      {
        name: "Rallye",
        status: "NON",
        statusColor: STATUS.non,
        note: "Pas de Safety Car en rallye. Les voitures partent individuellement. Le drapeau rouge arrête la spéciale.",
      },
      {
        name: "Course de côte",
        status: "NON",
        statusColor: STATUS.non,
        note: "Pas de Safety Car. Les voitures montent une par une. La direction de course monte avec un drapeau rouge en cas de problème.",
      },
      {
        name: "Karting",
        status: "ÉQUIVALENT",
        statusColor: STATUS.equivalent,
        note: "Le karting utilise la procédure « SLOW » à la place du SC : panneau SLOW + jaune agité + feux orange clignotants sur la ligne. Vert agité à la reprise.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        status: "ÉQUIVALENT",
        statusColor: STATUS.equivalent,
        note: "En championnat de France (Superbike/Supersport), une Safety Bike ou voiture SC peut être déployée sur ordre DC. Non systématique en régional. Les commissaires présentent jaune agité + panneau SC. Vert uniquement à la ligne de relance.",
      },
      {
        name: "Motocross",
        status: "NON",
        statusColor: STATUS.non,
        note: "Pas de Safety Car en motocross. Le drapeau rouge gère les arrêts de course ou d'essais.",
      },
      {
        name: "Enduro",
        status: "NON",
        statusColor: STATUS.non,
        note: "Pas de Safety Car en enduro. La spéciale est neutralisée par drapeau rouge sur ordre DC si nécessaire.",
      },
      {
        name: "Endurance TT",
        status: "ÉQUIVALENT",
        statusColor: STATUS.equivalent,
        note: "Possible selon le règlement particulier. Procédure identique à la vitesse moto : jaune agité + panneau SC, vert uniquement sur la ligne de relance.",
      },
    ],
  },
  {
    emoji: "📋",
    title: "FCY — Full Course Yellow (Jaune Total)",
    headerBg: "bg-blue-50 border-blue-200",
    headerText: "text-blue-700",
    contexte:
      "Incident nécessitant une intervention sur la piste, sans justifier l'arrêt de la course ni le déploiement du SC.",
    role: "Sur ordre DC : agiter le drapeau jaune + présenter le panneau « FCY » sur TOUS les postes pendant toute la durée de l'intervention.",
    etapes: [
      "La direction de course déclare le régime FCY (Full Course Yellow) par radio.",
      "Chaque poste agite un drapeau JAUNE et présente simultanément le panneau « FCY ».",
      "Double drapeau jaune au poste précédant le danger si l'incident est sur la trajectoire.",
      "Les pilotes doivent réduire leur allure à 80 km/h maximum — contrôlé par le chronométrage.",
      "Tout dépassement est interdit. Les infractions peuvent être sanctionnées par les commissaires sportifs.",
      "Une fois le problème résolu, le DC autorise la reprise.",
      "Tous les postes remplacent jaune + FCY par un drapeau VERT agité pendant 1 tour.",
    ],
    pointCritique:
      "Limite de vitesse : 80 km/h maximum en FCY. Le contrôle est automatique par chronométrage.",
    disciplines: [
      {
        name: "Circuit asphalte",
        status: "OUI",
        statusColor: STATUS.oui,
        note: "Procédure FFSA standard. Jaune agité + panneau « FCY » sur tous les postes. Max 80 km/h. Double jaune au poste de l'incident si sur trajectoire. Fin = vert agité 1 tour.",
      },
      {
        name: "Tout-terrain",
        status: "NON",
        statusColor: STATUS.non,
        note: "Le FCY n'est pas utilisé sur les circuits tout-terrain. Le jaune agité gère les incidents ; le rouge arrête la course si nécessaire.",
      },
      {
        name: "Rallye",
        status: "NON",
        statusColor: STATUS.non,
        note: "Le FCY n'est pas utilisé en rallye. Les voitures partent individuellement ; les drapeaux jaunes gèrent les alertes poste par poste.",
      },
      {
        name: "Course de côte",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non applicable. Les voitures montent une par une — la notion de neutralisation collective n'existe pas.",
      },
      {
        name: "Karting",
        status: "NON",
        statusColor: STATUS.non,
        note: "Le karting utilise la procédure « SLOW » avec son propre panneau. Pas de FCY au sens circuit asphalte.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        status: "OUI",
        statusColor: STATUS.oui,
        note: "Utilisé en Championnat de France Superbike/Supersport. Jaune agité + panneau FCY sur tous les postes. Limite 80 km/h contrôlée par chronométrage. Fin = vert agité 1 tour à tous les postes.",
      },
      {
        name: "Motocross",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé. Le drapeau jaune agité gère les incidents poste par poste.",
      },
      {
        name: "Enduro",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé. Le drapeau jaune agité sur la portion concernée gère les incidents.",
      },
      {
        name: "Endurance TT",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé. Le drapeau rouge est la procédure d'arrêt si nécessaire.",
      },
    ],
  },
  {
    emoji: "🟣",
    title: "Code 60",
    headerBg: "bg-purple-50 border-purple-200",
    headerText: "text-purple-700",
    contexte:
      "Limitation de vitesse unique de 60 km/h imposée sur tout le circuit, alternative ou complément au FCY.",
    role: "Agiter le drapeau violet (cercle blanc « 60 ») sur ordre DC, simultanément à tous les postes — puis le maintenir fixe une fois les voitures ralenties.",
    etapes: [
      "Sur instruction DC, le drapeau Code 60 est AGITÉ sur la ligne de départ et à tous les postes.",
      "Le drapeau reste AGITÉ au moins 1 tour complet, jusqu'à ce que toutes les voitures soient visiblement à 60 km/h.",
      "Il est ensuite maintenu FIXE jusqu'au retrait ordonné par la direction de course.",
      "Les drapeaux jaunes continuent d'être agités au poste précédant l'incident — sans drapeau vert à la suite.",
      "Chaque tour effectué sous Code 60 compte comme un tour de course.",
      "Quand le DC retire le Code 60, le drapeau est immédiatement remplacé par un drapeau VERT agité à tous les postes.",
      "Les dépassements restent interdits jusqu'à l'affichage du drapeau vert.",
    ],
    pointCritique:
      "Code 60 uniquement si les vitesses peuvent être surveillées en direct. Limite : 60 km/h sur l'ensemble du circuit.",
    disciplines: [
      {
        name: "Circuit asphalte",
        status: "OUI",
        statusColor: STATUS.oui,
        note: "Utilisé quand deux drapeaux jaunes sont présentés lors des essais ou de la course. Drapeau violet + cercle blanc « 60 ». AGITÉ puis FIXE. Remplacé par vert agité à la reprise.",
      },
      {
        name: "Tout-terrain",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé sur les circuits tout-terrain.",
      },
      {
        name: "Rallye",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé en rallye.",
      },
      {
        name: "Course de côte",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non applicable en course de côte.",
      },
      {
        name: "Karting",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé. Le karting utilise la procédure « SLOW » avec feux clignotants oranges.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Non standardisé en FFM régional. En compétitions FIM internationales, une procédure de slow-down zone peut exister. Vérifier le règlement particulier.",
      },
      {
        name: "Motocross",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé en motocross.",
      },
      {
        name: "Enduro",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé en enduro.",
      },
      {
        name: "Endurance TT",
        status: "NON",
        statusColor: STATUS.non,
        note: "Non utilisé en Endurance TT.",
      },
    ],
  },
  {
    emoji: "🔴",
    title: "Drapeau rouge — Arrêt de séance",
    headerBg: "bg-red-50 border-red-200",
    headerText: "text-red-700",
    contexte:
      "Incident grave, obstacle majeur ou conditions dangereuses rendant impossible la poursuite de la course.",
    role: "Agiter vigoureusement le drapeau rouge et rester en position jusqu'à ordre de la direction.",
    etapes: [
      "La direction de course décrète l'arrêt — annonce radio simultanée sur tous les postes.",
      "Tous les commissaires présentent et agitent vigoureusement le drapeau rouge.",
      "Les pilotes ralentissent immédiatement et rejoignent les stands ou la grille selon instruction.",
      "Aucun dépassement autorisé.",
      "Les commissaires restent en position, drapeaux agités, jusqu'à ordre de la direction.",
      "Les équipes d'intervention peuvent accéder à la piste en sécurité.",
      "La séance peut être suspendue, reprise ou arrêtée définitivement.",
    ],
    pointCritique:
      "Ne quittez pas votre poste avant ordre explicite de la direction de course.",
    disciplines: [
      {
        name: "Circuit asphalte",
        status: "ORDRE DC",
        statusColor: STATUS.adapte,
        note: "Présenté uniquement sur ORDRE DC. Délégué à tous les postes. Essais → voitures rejoignent les stands ; Course → voitures rejoignent la ligne de drapeau rouge ou les stands dans l'ordre.",
      },
      {
        name: "Tout-terrain",
        status: "ORDRE DC",
        statusColor: STATUS.adapte,
        note: "Sur ORDRE DC uniquement. En finale, présenté seulement si danger imminent. Les voitures rejoignent le lieu indiqué par les commissaires.",
      },
      {
        name: "Rallye",
        status: "ORDRE DC + LED",
        statusColor: STATUS.adapte,
        note: "Délégué aux P.K. sur ordre DC. Déclenché AUSSI via le voyant LED rouge clignotant du boîtier de géolocalisation embarqué. L'équipage doit s'arrêter immédiatement et maintenir une vitesse réduite jusqu'à la fin de la spéciale.",
      },
      {
        name: "Course de côte",
        status: "PROPRE INITIATIVE",
        statusColor: STATUS.specifique,
        note: "Particularité : le commissaire le présente DE SA PROPRE INITIATIVE si accident grave ou obstruction totale. La procédure s'applique EN CASCADE depuis le poste jusqu'au départ. Les pilotes s'arrêtent là où ils se trouvent.",
      },
      {
        name: "Karting",
        status: "DC SEULEMENT",
        statusColor: STATUS.adapte,
        note: "Présenté AGITÉ sur la ligne de départ par la DC. Signal d'interruption : ralentir, ne plus se dépasser, rouler à allure réduite et s'arrêter à l'endroit défini au briefing. Les commissaires agitent leurs drapeaux jaunes.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        status: "ORDRE DC",
        statusColor: STATUS.adapte,
        note: "Sur ORDRE DC. Tous les commissaires agitent vigoureusement le rouge. Les motos rejoignent les stands à vitesse réduite. Aucun dépassement.",
      },
      {
        name: "Motocross",
        status: "ORDRE DC",
        statusColor: STATUS.adapte,
        note: "Sur ORDRE DC. Les commissaires agitent le rouge à tous les postes. Arrêt immédiat de la manche ou des essais. Les pilotes s'arrêtent à l'endroit indiqué par les commissaires.",
      },
      {
        name: "Enduro",
        status: "ORDRE DC",
        statusColor: STATUS.adapte,
        note: "Sur ordre du DC adjoint de spéciale ou DC central. Arrêt immédiat de la spéciale. Les pilotes s'immobilisent là où ils se trouvent et attendent les instructions.",
      },
      {
        name: "Endurance TT",
        status: "ORDRE DC",
        statusColor: STATUS.adapte,
        note: "Sur ORDRE DC. Arrêt de course ou d'essais. Procédure identique au motocross. Tous les commissaires agitent le rouge simultanément.",
      },
    ],
  },
  {
    emoji: "🚑",
    title: "Évacuation d'un véhicule",
    headerBg: "bg-orange-50 border-orange-200",
    headerText: "text-orange-700",
    contexte:
      "Véhicule immobilisé sur la piste ou dans une zone dangereuse, nécessitant une intervention des commissaires.",
    role: "Protéger la zone par drapeaux jaunes et coordonner l'intervention en sécurité.",
    etapes: [
      "Drapeau jaune agité sur votre poste et le poste précédent pour protéger la zone.",
      "Évaluation de la situation depuis le bord de piste — n'accédez PAS immédiatement.",
      "Attendez le ralentissement effectif du trafic avant toute intervention.",
      "Vérifiez que le moteur est coupé avant d'approcher le véhicule.",
      "Si le pilote est conscient, guidez-le vers un endroit sûr hors piste.",
      "Si le pilote est inconscient : NE PAS toucher ni déplacer — appelez les secours, signalez aux postes voisins. Deux exceptions absolues : incendie ou immersion — l'évacuation immédiate s'impose même sans secours (règle FFSA Gestion Incident).",
      "Une fois la zone sécurisée, assistez au remorquage du véhicule hors piste.",
      "Annoncez la fin d'intervention à la direction — passage au drapeau vert.",
    ],
    pointCritique:
      "Ne touchez pas un pilote inconscient sans personnel médical — sauf en cas d'incendie ou d'immersion (danger vital immédiat), où l'évacuation prime sur toute autre règle.",
    disciplines: [
      {
        name: "Circuit asphalte",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Grappins, sangles, manilles en état dans chaque poste. Attente impérative du ralentissement de la circulation. Véhicule remorqué hors piste dès que possible. Pour véhicules électriques : gants diélectriques obligatoires.",
      },
      {
        name: "Tout-terrain",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Règle : si un pilote est immobilisé plus de 10 secondes sur la piste ou les bas-côtés, il doit évacuer sous protection des commissaires. Tout pilote ayant reçu de l'aide ne peut pas continuer.",
      },
      {
        name: "Rallye",
        status: "SPÉCIFIQUE",
        statusColor: STATUS.specifique,
        note: "Le commissaire ne doit pas intervenir avant l'arrêt de la course (Art. 6.2). Signalisation en cascade vers le départ par drapeaux jaunes. Pilotes arrêtés attendent les instructions avant de redescendre.",
      },
      {
        name: "Course de côte",
        status: "SPÉCIFIQUE",
        statusColor: STATUS.specifique,
        note: "L'accès à la zone se fait uniquement sur ordre DC. La DC monte avec un drapeau rouge si intervention lourde est nécessaire. La redescente des voitures arrêtées se fait uniquement sur ordre DC.",
      },
      {
        name: "Karting",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Postes positionnés à l'intérieur et à l'extérieur du circuit. Le karting passe rapidement — intervention rapide mais hors trajectoire. Même règle : ne jamais bouger un pilote inconscient.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Mêmes principes qu'en circuit auto. Jaune agité pour protéger la zone. Commissaires de sécurité accèdent sur ordre DC après ralentissement effectif. Gants diélectriques si moto électrique.",
      },
      {
        name: "Motocross",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Zone protégée par drapeaux jaunes agités (PAS DE SAUT dans la zone). Commissaires d'angle évaluent depuis le bord. Intervention sur ordre DC après ralentissement. Ne jamais déplacer un pilote inconscient.",
      },
      {
        name: "Enduro",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Sur spéciale étroite, signalisation cascade vers l'arrière par drapeaux jaunes. Intervention limitée — attendre les secours pour tout pilote inconscient. Coordonner avec le commissaire de spéciale.",
      },
      {
        name: "Endurance TT",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Identique au motocross. Zone protégée par jaunes — PAS DE SAUT. Intervention des commissaires d'angle sur ordre DC uniquement.",
      },
    ],
  },
  {
    emoji: "🚦",
    title: "Procédure de départ",
    headerBg: "bg-green-50 border-green-200",
    headerText: "text-green-700",
    contexte:
      "Démarrage d'une session d'essais ou d'une course. La procédure varie sensiblement selon la discipline.",
    role: "Selon votre poste : vérifier le positionnement, présenter les drapeaux appropriés et quitter la piste avant le départ.",
    etapes: [
      "Présence obligatoire à la pré-grille ou au parc de départ selon les horaires annoncés au briefing.",
      "Tour de reconnaissance (circuit) ou contrôle de départ individuel (route) selon la discipline.",
      "Les commissaires de grille s'assurent que chaque voiture est bien positionnée.",
      "Présentation des drapeaux VERTS sur les postes (circuit) ou vérification des postes (route).",
      "Feux de départ ou signal du directeur de course selon la discipline.",
      "Les commissaires non affectés à la grille se placent en position de signalisation avant le départ.",
      "Quitter la piste AVANT le signal de départ — ne jamais rester en piste lors du départ.",
    ],
    pointCritique:
      "Quittez la piste AVANT le signal de départ — jamais après. Votre sécurité passe avant tout.",
    disciplines: [
      {
        name: "Circuit asphalte",
        status: "DÉPART ARRÊTÉ",
        statusColor: STATUS.oui,
        note: "Procédure classique : pré-grille (H-20 min), tour de reconnaissance, tour de formation, puis 5 feux rouges qui s'éteignent. Procédure allégée possible selon règlement. Départ sous Safety Car possible si mauvaises conditions.",
      },
      {
        name: "Tout-terrain",
        status: "COULOIR DE DÉPART",
        statusColor: STATUS.adapte,
        note: "Couloir de départ tracé sur 30 à 50 mètres après la ligne. Les concurrents doivent respecter ce couloir sous peine de pénalité. Départ par séries/manches successives.",
      },
      {
        name: "Rallye",
        status: "DÉPART INDIVIDUEL",
        statusColor: STATUS.specifique,
        note: "Chaque équipage part individuellement à son heure de départ. Aucun signal collectif. Commissaire vérifie la conformité et l'heure de départ de chaque voiture. Drapeau vert ou panneau GO selon organisation.",
      },
      {
        name: "Course de côte",
        status: "DÉPART INDIVIDUEL",
        statusColor: STATUS.specifique,
        note: "Un pilote à la fois. La DC ouvre la piste par une montée sans drapeau puis redescend avec le drapeau national. Les P.K. présentent le drapeau vert si tout est OK, ou rouge si problème. Départ arrêté individuel.",
      },
      {
        name: "Karting",
        status: "DÉPART ARRÊTÉ",
        statusColor: STATUS.oui,
        note: "Feux de départ sur la ligne. La DC présente les drapeaux de procédure (vert, rouge...). Commissaires à l'intérieur et à l'extérieur du circuit, en position avant l'extinction des feux.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        status: "DÉPART ARRÊTÉ",
        statusColor: STATUS.oui,
        note: "Tour de chauffe (warm-up lap) puis départ arrêté sur la ligne. Feux de départ identiques au circuit auto. Les commissaires quittent la piste AVANT l'extinction des feux.",
      },
      {
        name: "Motocross",
        status: "DÉPART DE MASSE",
        statusColor: STATUS.adapte,
        note: "Départ de masse depuis la ligne — portillon ou câble relevé simultanément. Les commissaires se positionnent hors de la zone de départ avant le signal. Aucun commissaire sur la piste au moment du départ.",
      },
      {
        name: "Enduro",
        status: "DÉPART À LA MONTRE",
        statusColor: STATUS.specifique,
        note: "Chaque pilote part à son heure selon son numéro de départ. Pas de signal collectif. Les commissaires de départ vérifient les heures et la conformité de chaque pilote.",
      },
      {
        name: "Endurance TT",
        status: "DÉPART DE MASSE",
        statusColor: STATUS.adapte,
        note: "Départ de masse comme en motocross. Portillon ou câble relevé. Les commissaires se positionnent aux angles avant le signal DC.",
      },
    ],
  },
  {
    emoji: "🏁",
    title: "Arrivée et parc fermé",
    headerBg: "bg-zinc-100 border-zinc-200",
    headerText: "text-zinc-700",
    contexte:
      "Fin de la course ou de la session et gestion des véhicules à l'arrivée.",
    role: "Présenter le drapeau damier au vainqueur puis aux suivants. Orienter les concurrents vers le parc fermé.",
    etapes: [
      "Agiter vigoureusement le drapeau damier au passage du premier concurrent.",
      "Présenter le damier à tous les concurrents suivants.",
      "Les concurrents sont sous régime de parc fermé dès le passage sous le damier.",
      "Aucune intervention mécanique n'est autorisée avant la levée du parc fermé.",
      "Orienter les concurrents vers la zone de parc fermé désignée au briefing.",
      "Les commissaires restent en poste jusqu'à ce que tous les concurrents aient passé la ligne.",
    ],
    pointCritique:
      "Les voitures sont en parc fermé dès le passage sous le damier — aucune intervention n'est autorisée.",
    disciplines: [
      {
        name: "Circuit asphalte",
        status: "STANDARD",
        statusColor: STATUS.oui,
        note: "Damier AGITÉ depuis la ligne d'arrivée. Les voitures sont en parc fermé dès le damier présenté. Voiture officielle damier après fin de toute partie d'épreuve.",
      },
      {
        name: "Tout-terrain",
        status: "STANDARD",
        statusColor: STATUS.oui,
        note: "Damier AGITÉ sur la ligne d'arrivée. Toutes les voitures sont en parc fermé dès présentation du damier. Aucune intervention jusqu'à l'affichage du classement officiel.",
      },
      {
        name: "Rallye",
        status: "VOITURE DC",
        statusColor: STATUS.adapte,
        note: "Le damier est apposé sur les portières de la voiture officielle DC. Son passage informe de la fin de la compétition mais PAS de la fin de la privatisation de la route.",
      },
      {
        name: "Course de côte",
        status: "VOITURE DC",
        statusColor: STATUS.adapte,
        note: "La DC monte pour la dernière fois et redescend en serre-file. Le damier indique la fin de toute partie d'épreuve. Le parc fermé final est situé en bas ou en haut de la côte selon l'organisation.",
      },
      {
        name: "Karting",
        status: "STANDARD",
        statusColor: STATUS.oui,
        note: "Damier AGITÉ depuis la ligne d'arrivée. Signal de fin de séance d'entraînement, d'essais et/ou de courses.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        status: "STANDARD",
        statusColor: STATUS.oui,
        note: "Drapeau damier agité depuis la ligne d'arrivée. Les motos sont sous régime de parc fermé dès le passage sous le damier. Aucune intervention mécanique autorisée.",
      },
      {
        name: "Motocross",
        status: "STANDARD",
        statusColor: STATUS.oui,
        note: "Damier agité sur la ligne d'arrivée. Fin de manche ou d'essais. Les pilotes se dirigent vers la zone de parc fermé désignée au briefing.",
      },
      {
        name: "Enduro",
        status: "ADAPTÉ",
        statusColor: STATUS.adapte,
        note: "Fin de la spéciale ou de l'épreuve selon le règlement. Les pilotes passent sous le damier à leur dernier passage. Parc fermé à l'arrivée.",
      },
      {
        name: "Endurance TT",
        status: "STANDARD",
        statusColor: STATUS.oui,
        note: "Damier agité sur la ligne d'arrivée. Procédure identique au motocross. Parc fermé dès le passage sous le damier.",
      },
    ],
  },
];

export default function ProceduresPage() {
  const [sportMode, setSportMode] = useState<"auto" | "moto">("auto");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);

  const currentDisciplines = sportMode === "auto" ? AUTO_DISCIPLINES : MOTO_DISCIPLINES;

  function handleSportMode(mode: "auto" | "moto") {
    setSportMode(mode);
    setSelectedDiscipline(null);
  }

  const visibleProcedures = selectedDiscipline
    ? procedures.filter((p) => {
        const discs = sportMode === "auto" ? p.disciplines : p.motoDisciplines;
        if (!discs) return true;
        const d = discs.find((d) => d.name === selectedDiscipline);
        return d?.status !== "NON";
      })
    : procedures;

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/devenir-commissaire" className="text-sm text-zinc-500 transition hover:text-zinc-900">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Sécurité</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Les procédures</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-600">
            Les procédures varient selon la discipline. Chaque carte détaille le fonctionnement
            général, puis les spécificités par type d&apos;épreuve.
          </p>

          {/* Sport mode toggle */}
          <div className="mt-8">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Sport</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleSportMode("auto")}
                className={`rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-[0.06em] transition ${
                  sportMode === "auto"
                    ? "bg-[#FF5A1F] text-white shadow-sm"
                    : "border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                }`}
              >
                🏎 Auto
              </button>
              <button
                onClick={() => handleSportMode("moto")}
                className={`rounded-xl px-4 py-2.5 text-sm font-black uppercase tracking-[0.06em] transition ${
                  sportMode === "moto"
                    ? "bg-[#FF5A1F] text-white shadow-sm"
                    : "border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                }`}
              >
                🏍 Moto
              </button>
            </div>
          </div>

          {/* Discipline filter */}
          <div className="mt-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">Filtrer par discipline</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDiscipline(null)}
                className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                  selectedDiscipline === null
                    ? "bg-[#FF5A1F] text-white"
                    : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                }`}
              >
                Toutes disciplines
              </button>
              {currentDisciplines.map((disc) => (
                <button
                  key={disc}
                  onClick={() => setSelectedDiscipline(selectedDiscipline === disc ? null : disc)}
                  className={`rounded-xl px-3 py-2 text-xs font-black tracking-[0.04em] transition ${
                    selectedDiscipline === disc
                      ? "bg-[#FF5A1F] text-white"
                      : "border border-zinc-300 bg-white text-zinc-600 hover:border-zinc-400 hover:text-zinc-900"
                  }`}
                >
                  {disc}
                </button>
              ))}
            </div>
          </div>

          {selectedDiscipline && (
            <p className="mt-4 text-sm text-zinc-500">
              {visibleProcedures.length} procédure{visibleProcedures.length !== 1 ? "s" : ""} applicable{visibleProcedures.length !== 1 ? "s" : ""} en <span className="font-bold text-zinc-900">{selectedDiscipline}</span>
            </p>
          )}

          {/* Légende */}
          <div className="mt-5 flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white shadow-sm px-4 py-3">
            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS.oui}`}>OUI / STANDARD</span>
            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS.adapte}`}>ADAPTÉ</span>
            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS.specifique}`}>SPÉCIFIQUE</span>
            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS.equivalent}`}>ÉQUIVALENT</span>
            <span className={`rounded border px-2 py-0.5 text-xs font-bold ${STATUS.non}`}>NON UTILISÉ</span>
          </div>

          {/* Procedure cards */}
          <div className="mt-10 space-y-6">
            {visibleProcedures.map((proc, idx) => {
              const currentDiscs = sportMode === "auto" ? proc.disciplines : proc.motoDisciplines;
              const disciplineToShow = selectedDiscipline
                ? currentDiscs?.find((d) => d.name === selectedDiscipline)
                : null;
              return (
              <div
                key={proc.title}
                className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm"
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
                  {/* Discipline highlight when filtered */}
                  {disciplineToShow && (
                    <div className="mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4">
                      <div className="mb-1.5 flex flex-wrap items-center gap-2">
                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-700">{disciplineToShow.name}</p>
                        <span className={`rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${disciplineToShow.statusColor}`}>
                          {disciplineToShow.status}
                        </span>
                      </div>
                      <p className="text-sm text-zinc-600">{disciplineToShow.note}</p>
                    </div>
                  )}

                  {/* Contexte */}
                  <div className="mb-6 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">Contexte</p>
                    <p className="mt-1 text-sm text-zinc-700">{proc.contexte}</p>
                  </div>

                  {/* Role du commissaire */}
                  <div className="mb-6 rounded-2xl border border-[#FF5A1F]/20 bg-orange-50 px-4 py-3">
                    <p className="text-xs font-bold uppercase tracking-[0.1em] text-[#FF5A1F]">Rôle du commissaire</p>
                    <p className="mt-1 text-sm text-zinc-700">{proc.role}</p>
                  </div>

                  {/* Etapes */}
                  <div>
                    <p className="mb-4 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">
                      {sportMode === "auto"
                        ? "Étapes — Circuit asphalte (procédure de référence)"
                        : "Étapes — procédure de référence"}
                    </p>
                    <ol className="space-y-3">
                      {proc.etapes.map((etape, i) => (
                        <li key={i} className="flex items-start gap-4">
                          <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-xs font-black text-zinc-600">
                            {i + 1}
                          </span>
                          <p className="text-zinc-600">{etape}</p>
                        </li>
                      ))}
                    </ol>
                  </div>

                  {/* Point critique */}
                  <div className="mt-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">
                    <span className="shrink-0 text-lg">⚠️</span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[0.1em] text-red-700">Point critique</p>
                      <p className="mt-1 text-sm font-bold text-zinc-900">{proc.pointCritique}</p>
                    </div>
                  </div>

                  {/* Par discipline */}
                  {!selectedDiscipline && currentDiscs && (
                    <div className="mt-6">
                      <p className="mb-3 text-xs font-bold uppercase tracking-[0.1em] text-zinc-500">Par type d&apos;épreuve</p>
                      <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {currentDiscs.map((d) => (
                          <div
                            key={d.name}
                            className="rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3"
                          >
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="text-xs font-black text-zinc-900">{d.name}</span>
                              <span className={`rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide ${d.statusColor}`}>
                                {d.status}
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
              );
            })}
          </div>

          {/* Avertissement réglementaire */}
          <div className="mt-12 flex items-start gap-3 rounded-[24px] border border-yellow-200 bg-yellow-50 p-6 lg:p-8">
            <span className="shrink-0 text-2xl">⚠️</span>
            <p className="leading-relaxed text-zinc-700">
              {sportMode === "auto"
                ? "Ces procédures sont basées sur les règlements standard FFSA 2025. Certaines épreuves ou championnats peuvent avoir des spécificités additionnelles."
                : "Ces procédures moto sont issues du Dossier Candidat Commissaire de Piste FFM (version janvier 2023) et des Règles Techniques et de Sécurité FFM. Certaines épreuves ou championnats peuvent avoir des spécificités additionnelles."
              }
              {" "}Consultez toujours le règlement particulier et écoutez attentivement le briefing de la direction de course.
            </p>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="shrink-0 text-lg">📄</span>
            <p className="text-sm leading-relaxed text-zinc-500">
              <span className="font-bold text-zinc-700">Sources :</span>{" "}
              {sportMode === "moto"
                ? "Dossier Candidat Commissaire de Piste FFM — Version janvier 2023 · Règles Techniques et de Sécurité FFM (Art. 8 Vitesse, Art. 6 Motocross, Art. Enduro/Endurance TT)."
                : "Règlement Sportif FFSA — Procédures Circuit Asphalte 2025 · Gestion des Incidents FFSA 2025 · Le Rapport en Course FFSA 2026 · Code Sportif International FIA 2025 (procédures Safety Car/FCY)."}
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
