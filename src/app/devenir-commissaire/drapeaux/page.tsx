"use client";

import { useState } from "react";
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
  motoDisciplines?: Discipline[];
};

const PRES = {
  agite: "border-[#FF5A1F]/50 bg-orange-50 text-[#FF5A1F]",
  fixe: "border-blue-300 bg-blue-50 text-blue-600",
  agiteFixe: "border-amber-400 bg-amber-50 text-amber-700",
  nonUtilise: "border-zinc-300 bg-zinc-100 text-zinc-400",
  propre: "border-red-300 bg-red-50 text-red-600",
  dc: "border-purple-300 bg-purple-50 text-purple-700",
  adapte: "border-yellow-400 bg-yellow-50 text-yellow-700",
};

const AUTO_DISCIPLINES = ["Circuit asphalte", "Tout-terrain", "Rallye", "Course de côte", "Karting"];
const MOTO_DISCIPLINES = ["Vitesse", "Motocross", "Enduro", "Endurance TT"];

const flags: Flag[] = [
  {
    name: "Drapeau rouge",
    img: "/flags/rouge.svg",
    situation: "Arrêt immédiat de la séance",
    description: "La session est interrompue : accident grave, obstruction de la piste ou conditions dangereuses. Tout dépassement est interdit. En auto, dimensions : 100×80 cm (plus grand que les autres drapeaux).",
    reaction: "Agiter vigoureusement. Maintenir jusqu'à ce qu'il n'y ait plus aucun concurrent en piste.",
    category: "Danger extrême",
    categoryColor: "bg-red-100 text-red-600 border-red-200",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Sur ORDRE DC uniquement. Rejoindre les stands à vitesse réduite. Les commissaires reçoivent l'ordre et agitent le drapeau.",
      },
      {
        name: "Motocross",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Interruption de course ou d'essais sur ORDRE DC. S'arrêter à l'endroit indiqué par les commissaires.",
      },
      {
        name: "Enduro",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Sur ordre du DC adjoint de spéciale ou du DC central. Arrêt immédiat de la spéciale.",
      },
      {
        name: "Endurance TT",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Arrêt course ou essais sur ORDRE DC. Même procédure qu'en motocross.",
      },
    ],
  },
  {
    name: "Drapeau jaune — 1 drapeau",
    img: "/flags/jaune.svg",
    situation: "Danger sur le bord ou une partie de la piste — ralentir, ne pas dépasser",
    description: "Un danger est présent sur le bord ou sur une partie de la piste (véhicule accidenté, commissaire à proximité, débris). Tout dépassement est formellement interdit jusqu'à la fin de la zone de danger. En moto, règle supplémentaire : PAS DE SAUT en motocross et endurance TT.",
    reaction: "Agiter vigoureusement au poste précédant le danger.",
    category: "Danger",
    categoryColor: "bg-amber-100 text-amber-700 border-amber-200",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Danger, ralentir, pas de dépassement. En cas de chute de pilote/moto sur piste → présenter simultanément le drapeau jaune ET le drapeau jaune bandes rouges.",
      },
      {
        name: "Motocross",
        presentation: "FIXE ou AGITÉ",
        presentationColor: PRES.agiteFixe,
        note: "FIXE = danger sur bord de piste, ralentir, pas de dépassement, PAS DE SAUT — roues au sol. AGITÉ = danger immédiat, ralentir fortement, pas de dépassement, PAS DE SAUT.",
      },
      {
        name: "Enduro",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Danger sur la portion. Ralentir, pas de dépassement. Présenté sur ordre du DC adjoint ou à l'appréciation du commissaire.",
      },
      {
        name: "Endurance TT",
        presentation: "FIXE ou AGITÉ",
        presentationColor: PRES.agiteFixe,
        note: "FIXE = danger sur bord de piste, pas de saut. AGITÉ = danger immédiat, pas de saut, être prêt à s'arrêter.",
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
    categoryColor: "bg-amber-100 text-amber-700 border-amber-200",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "2× AGITÉS",
        presentationColor: PRES.agite,
        note: "Pilote ou moto sur la piste. Les deux drapeaux sont agités simultanément par le commissaire.",
      },
      {
        name: "Motocross",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "En motocross, la distinction jaune simple/double ne s'applique pas de la même façon. Le jaune AGITÉ couvre les situations de danger immédiat.",
      },
      {
        name: "Enduro",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en enduro. Le jaune simple agité signale les situations de danger.",
      },
      {
        name: "Endurance TT",
        presentation: "2× AGITÉS",
        presentationColor: PRES.agite,
        note: "Pilote ou moto sur la piste — danger majeur. Même usage qu'en vitesse moto.",
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
    categoryColor: "bg-green-100 text-green-700 border-green-200",
    disciplines: [
      {
        name: "Circuit asphalte",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Ouverture de piste, début de séance, fin de zone FCY/Code 60 (1 tour) : présenté à TOUS les postes. Relance après Safety Car : présenté UNIQUEMENT sur la ligne de relance — jamais à tous les postes.",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Piste libre. Présenté lors du 1er tour d'essais, du tour de reconnaissance, du tour chauffe, et au poste suivant le dernier drapeau jaune.",
      },
      {
        name: "Motocross",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Piste libre. Début ou reprise de course ou d'essais.",
      },
      {
        name: "Enduro",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Piste libre sur cette portion de spéciale.",
      },
      {
        name: "Endurance TT",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Piste libre. Même usage qu'en motocross.",
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
    categoryColor: "bg-zinc-100 text-zinc-600 border-zinc-200",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Fin de course ou d'essais. Lorsque présenté depuis la voiture DC, indique aussi l'ouverture de la piste aux non-compétiteurs.",
      },
      {
        name: "Motocross",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Fin de course ou d'essais. Présenté sur la ligne d'arrivée.",
      },
      {
        name: "Enduro",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Fin de la spéciale ou de l'épreuve.",
      },
      {
        name: "Endurance TT",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Fin de course ou d'essais. Présenté sur la ligne d'arrivée.",
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
    categoryColor: "bg-blue-100 text-blue-700 border-blue-200",
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
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "AGITÉ par la D.C. : gardez votre ligne, vous allez être doublé par un ou plusieurs pilotes.",
      },
    ],
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Signal de dépassement — information, non obligatoire. Peut être présenté simultanément avec le damier si le leader rattrape un attardé.",
      },
      {
        name: "Motocross",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Le concurrent de tête rattrape un attardé. Garder sa trajectoire et laisser passer.",
      },
      {
        name: "Enduro",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en enduro.",
      },
      {
        name: "Endurance TT",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Concurrent de tête rattrape un attardé. Même usage qu'en motocross.",
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
    categoryColor: "bg-zinc-100 text-zinc-700 border-zinc-300",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Rentrer aux stands, ne peut plus repartir. UNIQUEMENT sur ordre DC. Tenu FIXE avec panneau numéro.",
      },
      {
        name: "Motocross",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Rentrer aux stands immédiatement. UNIQUEMENT sur ordre DC. Tenu FIXE avec panneau numéro.",
      },
      {
        name: "Enduro",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Rentrer à l'assistance. Sur ordre du DC. Tenu FIXE avec panneau numéro.",
      },
      {
        name: "Endurance TT",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Rentrer aux stands. Sur ordre DC. Même usage qu'en motocross.",
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
    categoryColor: "bg-orange-100 text-orange-600 border-orange-200",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Drapeau noir + disque orange + numéro : quitter la piste le plus rapidement possible. UNIQUEMENT sur ordre DC.",
      },
      {
        name: "Motocross",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Drapeau noir + cercle orange + numéro : quitter la piste immédiatement. UNIQUEMENT sur ordre DC.",
      },
      {
        name: "Enduro",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en enduro.",
      },
      {
        name: "Endurance TT",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en endurance TT.",
      },
    ],
  },
  {
    name: "Drapeau jaune et rouge rayé",
    img: "/flags/jaune-rouge.svg",
    situation: "Piste glissante ou contaminée en aval du poste",
    description: "Avertit les concurrents d'une détérioration de l'adhérence : huile, eau, débris ou autre substance glissante. En moto vitesse, il est présenté simultanément avec le drapeau jaune en cas de chute avec moto tombée sur la piste.",
    reaction: "Tenir FIXE au poste. Aucun drapeau vert n'est présenté à la suite de ce drapeau (sauf en karting).",
    category: "Avertissement",
    categoryColor: "bg-amber-100 text-amber-700 border-amber-200",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "FIXE",
        presentationColor: PRES.fixe,
        note: "Changement d'adhérence (huile, eau, débris — autre que la pluie). Présenté SIMULTANÉMENT avec le drapeau jaune en cas de chute avec moto tombée sur la piste.",
      },
      {
        name: "Motocross",
        presentation: "SUPERMOTARD",
        presentationColor: PRES.adapte,
        note: "Utilisé uniquement en courses mixtes supermotard (asphalte/terre) : piste glissante, changement d'adhérence. Non utilisé en motocross pur.",
      },
      {
        name: "Enduro",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en enduro.",
      },
      {
        name: "Endurance TT",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en Endurance TT.",
      },
    ],
  },
  {
    name: "Drapeau blanc",
    img: "/flags/blanc.svg",
    situation: "Véhicule lent sur la piste",
    description: "Signale la présence d'un véhicule circulant beaucoup plus lentement que les concurrents en piste. Important : en moto vitesse, le dépassement reste AUTORISÉ sous drapeau blanc (contrairement à l'auto). En circuit tout-terrain auto, présenté FIXE pour demander une assistance médicale.",
    reaction: "Agiter. En moto, le concurrent peut dépasser le véhicule lent sous ce drapeau.",
    category: "Information",
    categoryColor: "bg-zinc-100 text-zinc-600 border-zinc-200",
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
        note: "Signale un véhicule beaucoup plus lent sur la portion contrôlée par le poste. Son utilisation est facultative.",
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
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Véhicule au ralenti sur la piste. Le dépassement reste AUTORISÉ sous ce drapeau — différence majeure avec l'auto.",
      },
      {
        name: "Motocross",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en motocross.",
      },
      {
        name: "Enduro",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en enduro.",
      },
      {
        name: "Endurance TT",
        presentation: "NON UTILISÉ",
        presentationColor: PRES.nonUtilise,
        note: "Non utilisé en endurance TT.",
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
    categoryColor: "bg-zinc-100 text-zinc-600 border-zinc-200",
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
    categoryColor: "bg-purple-100 text-purple-700 border-purple-200",
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
  {
    name: "Blanc avec croix de Saint-André rouge",
    img: "/flags/blanc-croix-rouge.svg",
    situation: "Signal météo (Vitesse) ou appel secours / médical sur piste (Motocross / Endurance TT)",
    description: "Drapeau blanc barré d'une croix rouge diagonale (croix de Saint-André). En vitesse moto, signale que la pluie affecte l'adhérence sur cette section. En motocross et endurance TT, sert à appeler les secours (agité) ou indique la présence de personnel médical sur la piste (fixe). Ce drapeau est SPÉCIFIQUE à la moto — il n'est pas utilisé en auto.",
    reaction: "AGITÉ = appel secours / pluie sur section. FIXE = personnel médical sur piste. En cas de croix rouge agitée, prudence extrême, pas de dépassement, pas de saut.",
    category: "Moto uniquement",
    categoryColor: "bg-red-100 text-red-600 border-red-200",
    motoDisciplines: [
      {
        name: "Vitesse",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Présenté dès que des gouttes de pluie ou de la pluie affectent la surface du circuit sur cette section. Le commissaire doit AUSSITÔT avertir le directeur de course.",
      },
      {
        name: "Motocross",
        presentation: "AGITÉ ou FIXE",
        presentationColor: PRES.agiteFixe,
        note: "Si un pilote chute et se blesse à votre poste : ne bougez pas — appelez les secours avec la CROIX ROUGE AGITÉE — protégez avec le JAUNE AGITÉ — quand les secours arrivent : CROIX ROUGE FIXE. Le poste suivant présente le VERT si la piste est libre.",
      },
      {
        name: "Enduro",
        presentation: "AGITÉ",
        presentationColor: PRES.agite,
        note: "Appel secours sur la spéciale. Prudence extrême, ralentir immédiatement.",
      },
      {
        name: "Endurance TT",
        presentation: "AGITÉ ou FIXE",
        presentationColor: PRES.agiteFixe,
        note: "AGITÉ = appel secours, prudence, pas de saut. FIXE = personnel médical sur piste. Même usage qu'en motocross.",
      },
    ],
  },
];

export default function DrapeauxPage() {
  const [sportMode, setSportMode] = useState<"auto" | "moto">("auto");
  const [selectedDiscipline, setSelectedDiscipline] = useState<string | null>(null);

  const currentDisciplines = sportMode === "auto" ? AUTO_DISCIPLINES : MOTO_DISCIPLINES;

  const modeFlags = sportMode === "auto"
    ? flags.filter((f) => f.disciplines && f.disciplines.length > 0)
    : flags.filter((f) => f.motoDisciplines && f.motoDisciplines.length > 0);

  const visibleFlags = selectedDiscipline
    ? modeFlags.filter((f) => {
        const discs = sportMode === "auto" ? f.disciplines : f.motoDisciplines;
        const d = discs?.find((d) => d.name === selectedDiscipline);
        return d?.presentation !== "NON UTILISÉ";
      })
    : modeFlags;

  function handleSportMode(mode: "auto" | "moto") {
    setSportMode(mode);
    setSelectedDiscipline(null);
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="relative pt-36 pb-24">
        <div className="relative z-10 mx-auto max-w-[1100px] px-6 lg:px-10">

          <div className="mb-4">
            <Link href="/devenir-commissaire" className="text-sm text-zinc-400 transition hover:text-zinc-700">
              ← Espace pédagogique
            </Link>
          </div>

          <p className="text-xs font-bold uppercase tracking-[0.4em] text-[#FF5A1F]">Lexique</p>
          <h1 className="mt-4 text-4xl font-black text-zinc-900 lg:text-6xl">Les drapeaux</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-zinc-500">
            Chaque drapeau a une signification précise — et son usage varie selon la discipline.
            Un commissaire doit connaître les deux.
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
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Filtrer par discipline</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedDiscipline(null)}
                className={`rounded-xl px-3 py-2 text-xs font-black uppercase tracking-[0.08em] transition ${
                  selectedDiscipline === null
                    ? "bg-[#FF5A1F] text-white shadow-sm"
                    : "border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
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
                      ? "bg-[#FF5A1F] text-white shadow-sm"
                      : "border border-zinc-300 bg-white text-zinc-500 hover:border-zinc-400 hover:text-zinc-700"
                  }`}
                >
                  {disc}
                </button>
              ))}
            </div>
          </div>

          {/* Dimensions + légende */}
          <div className="mt-5 flex flex-wrap gap-3">
            {sportMode === "auto" && (
              <div className="rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-500 shadow-sm">
                <span className="font-bold text-zinc-800">Drapeau rouge :</span> 100 × 80 cm
                &nbsp;·&nbsp;
                <span className="font-bold text-zinc-800">Autres :</span> 80 × 60 cm
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-zinc-200 bg-white px-4 py-2 shadow-sm">
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.agite}`}>AGITÉ</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.fixe}`}>FIXE</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.agiteFixe}`}>AGITÉ+FIXE</span>
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.dc}`}>DC SEULEMENT</span>
              {sportMode === "auto" && (
                <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.propre}`}>PROPRE INITIATIVE</span>
              )}
              {sportMode === "moto" && (
                <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.adapte}`}>SUPERMOTARD</span>
              )}
              <span className={`rounded border px-2 py-0.5 text-xs font-bold ${PRES.nonUtilise}`}>NON UTILISÉ</span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Link
              href="/devenir-commissaire/quiz/drapeaux"
              className="inline-flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 shadow-sm"
            >
              🎯 Tester mes connaissances
            </Link>
          </div>

          {selectedDiscipline && (
            <p className="mt-4 text-sm text-zinc-500">
              {visibleFlags.length} drapeau{visibleFlags.length > 1 ? "x" : ""} utilisé{visibleFlags.length !== 1 ? "s" : ""} en <span className="font-bold text-zinc-800">{selectedDiscipline}</span>
            </p>
          )}

          <div className="mt-10 space-y-4">
            {visibleFlags.map((flag) => {
              const allDiscs = sportMode === "auto" ? flag.disciplines : flag.motoDisciplines;
              const disciplinesToShow = selectedDiscipline
                ? (allDiscs?.filter((d) => d.name === selectedDiscipline) ?? [])
                : allDiscs;
              return (
              <div
                key={flag.name}
                className="overflow-hidden rounded-[28px] border border-zinc-200 bg-white shadow-sm transition hover:shadow-md hover:border-zinc-300"
              >
                <div className="flex flex-col gap-6 p-6 sm:flex-row sm:items-start lg:p-8">

                  {/* Flag image */}
                  <div className="shrink-0">
                    <img
                      src={flag.img}
                      alt={flag.name}
                      className="h-20 w-32 rounded-2xl border border-zinc-200 object-cover shadow-sm sm:h-24 sm:w-36"
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start gap-3">
                      <h2 className="text-xl font-black text-zinc-900 lg:text-2xl">{flag.name}</h2>
                      <span className={`rounded-full border px-3 py-1 text-xs font-bold ${flag.categoryColor}`}>
                        {flag.category}
                      </span>
                    </div>

                    <p className="mt-2 text-base font-bold text-[#FF5A1F]">{flag.situation}</p>
                    <p className="mt-3 leading-relaxed text-zinc-600">{flag.description}</p>

                    <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Geste du commissaire</p>
                      <p className="mt-1 text-sm text-zinc-700">{flag.reaction}</p>
                    </div>

                    {/* Par discipline */}
                    {disciplinesToShow && disciplinesToShow.length > 0 && (
                      <div className="mt-5">
                        <p className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-zinc-400">Par type d&apos;épreuve</p>
                        <div className={`grid gap-2 ${selectedDiscipline ? "" : "sm:grid-cols-2 lg:grid-cols-3"}`}>
                          {disciplinesToShow.map((d) => (
                            <div
                              key={d.name}
                              className={`rounded-2xl border px-3 py-3 ${
                                selectedDiscipline
                                  ? "border-[#FF5A1F]/30 bg-orange-50"
                                  : "border-zinc-200 bg-zinc-50"
                              }`}
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="text-xs font-black text-zinc-800">{d.name}</span>
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
              );
            })}
          </div>

          <div className="mt-12 flex items-start gap-3 rounded-[24px] border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="shrink-0 text-lg">📄</span>
            <p className="text-sm leading-relaxed text-zinc-500">
              <span className="font-bold text-zinc-700">Sources auto :</span> Dépliant FFSA <em>Drapeaux et Signaux 2026</em> · Règlement Sportif FFSA — Procédures Circuit Asphalte 2025 · Règlement Sportif FFSA 2025 (rallye, course de côte, karting, tout-terrain).{" "}
              <span className="font-bold text-zinc-700">Sources moto :</span> Dossier Candidat Commissaire de Piste FFM — Version janvier 2023 · Règles Techniques et de Sécurité FFM (Art. 8 Vitesse, Art. 6 Motocross) · Dépliant FFM <em>Drapeaux en usage sur les épreuves motocyclistes</em>.
              Ces contenus sont fournis à titre pédagogique — consultez toujours le règlement particulier de l&apos;épreuve et le briefing de la direction de course.
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
