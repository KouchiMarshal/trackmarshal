import Anthropic from "@anthropic-ai/sdk";

// Construction paresseuse : le SDK lève une erreur si ANTHROPIC_API_KEY est
// absent. On ne crée donc le client qu'au premier appel réel (après le
// garde-fou de configuration dans les routes), jamais au chargement du module.
let _client: Anthropic | null = null;
export function getAnthropic(): Anthropic {
  if (!_client) _client = new Anthropic();
  return _client;
}

// Modèle par défaut pour les fonctionnalités IA du site.
export const AI_MODEL = "claude-opus-4-8";

/**
 * Base de connaissances « commissaire de piste » (France, FFSA/FFM).
 * Sert de socle factuel au chatbot pédagogique et au générateur de quiz.
 * Volontairement synthétique : couvre les fondamentaux enseignés dans
 * l'espace pédagogique du site.
 */
export const MARSHAL_KNOWLEDGE = `
RÔLE DU COMMISSAIRE DE PISTE
Le commissaire de piste est un bénévole agréé qui assure la sécurité d'une épreuve de sport automobile ou motocycliste : surveillance d'un secteur, signalisation par drapeaux, intervention en cas d'incident, information du poste de direction de course (PC course / Race Control). Il travaille en poste, sous l'autorité d'un chef de poste, lui-même en liaison avec la direction de course.

POSTES ET FONCTIONS
- Commissaire de piste : signalisation, surveillance, première intervention.
- Commissaire chef de poste : coordonne son poste, communique avec le PC course.
- Commissaire technique : contrôle la conformité des véhicules (hors bord de piste).
- Commissaire signaleur, commissaire d'intervention, commissaire incendie selon l'organisation.

LES DRAPEAUX (signalisation piste)
- Rouge : arrêt immédiat de la séance, ralentir et rejoindre stands/grille selon consignes.
- Jaune fixe (bras tendu) : danger en amont, ralentir, interdiction de dépasser.
- Jaune agité (vigoureusement) : danger immédiat sur ou près de la piste, prêt à s'arrêter, interdiction de dépasser.
- Double jaune agité : danger majeur, piste partiellement/totalement obstruée.
- Vert : piste dégagée, fin de la zone de danger, reprise normale.
- Bleu (agité) : un concurrent plus rapide vous suit et va vous dépasser (laisser passer).
- Jaune à bandes rouges (verticales) : adhérence réduite (huile, eau, gravillons).
- Blanc : véhicule lent sur la portion de piste concernée.
- Noir (avec n° de voiture) : le pilote doit rejoindre son stand (sanction/exclusion).
- Noir à rond orange (n° de voiture) : problème mécanique/danger, rejoindre les stands.
- Noir/blanc divisé en diagonale (n° de voiture) : avertissement pour conduite antisportive.
- Damier : fin de la séance / de la course.

PROCÉDURES & NEUTRALISATIONS (circuit)
- Safety Car (SC) : neutralisation derrière une voiture de sécurité, regroupement, pas de dépassement.
- Virtual Safety Car (VSC) : neutralisation virtuelle, respect d'un temps/délta imposé, pas de SC physique.
- FCY (Full Course Yellow) : tout le circuit sous régime jaune, allure très réduite.
- Code 60 / Code 80 : vitesse limitée (60 ou 80 km/h) sur tout le circuit pendant une intervention.
- Procédures de départ : départ arrêté (feux), départ lancé (derrière SC ou en formation).

INSTITUTIONS
- FIA : fédération internationale automobile.
- FFSA : Fédération Française du Sport Automobile (auto).
- FFM : Fédération Française de Motocyclisme (moto).
- ASA : Association Sportive Automobile (clubs locaux affiliés FFSA).
- Une licence commissaire en cours de validité est requise pour officier.

ÉQUIPEMENT & TENUE
- Combinaison ignifugée / tenue conforme selon le poste, gants, chaussures fermées.
- Drapeaux, extincteur, radio, balai, pelle, kit absorbant selon le poste.
- EPI adaptés ; respect strict des zones de sécurité.

SÉCURITÉ & INTERVENTION
- Ne jamais traverser la piste sans visibilité et accord ; toujours un œil sur la course.
- Approche d'un véhicule accidenté : couper le contact si possible, sécuriser, baliser, alerter le PC.
- Incendie : extincteur, alerter, intervention coordonnée.
- Toujours rester en retrait des trajectoires, anticiper, communiquer.

SPÉCIFICITÉS RALLYE
- Épreuve sur routes fermées (ES — épreuves spéciales) avec liaisons entre les ES.
- Reconnaissances, road book, notes (pace notes).
- Postes commissaires répartis le long de l'ES, zones spectateurs à faire respecter.
`.trim();

// Mention légale à respecter dans toutes les réponses IA.
export const NO_OFFICIAL_PARTNERSHIP =
  "TrackMarshal n'est pas officiellement partenaire de la FFSA ni de la FFM. " +
  "Ne jamais laisser entendre une affiliation ou un agrément officiel de ces fédérations.";
