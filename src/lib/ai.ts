// Intégration IA via Google Gemini (offre gratuite, sans SDK : appels REST).
// Clé requise : process.env.GEMINI_API_KEY (Google AI Studio).

// Modèle configurable via variable d'environnement (permet d'en changer
// sans toucher au code si le quota gratuit varie selon le modèle/compte).
export const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";
const BASE = "https://generativelanguage.googleapis.com/v1beta/models";

// Modèles à essayer dans l'ordre : le principal, puis une bascule en cas de
// surcharge temporaire (503/429). Tous deux gratuits sur le compte cible.
const FALLBACK_MODELS = ["gemini-2.5-flash"];
function modelChain(): string[] {
  return Array.from(new Set([GEMINI_MODEL, ...FALLBACK_MODELS]));
}

const TRANSIENT = new Set([429, 500, 502, 503, 504]);
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export function hasGeminiKey(): boolean {
  return !!process.env.GEMINI_API_KEY;
}

export type GeminiRole = "user" | "model";
export type GeminiContent = { role: GeminiRole; parts: { text: string }[] };

/**
 * Appel streaming (SSE) — renvoie la première réponse fetch OK, en basculant
 * sur un modèle de secours si le principal est temporairement indisponible.
 */
export async function geminiStream(opts: {
  system: string;
  contents: GeminiContent[];
  maxOutputTokens?: number;
  temperature?: number;
}): Promise<Response> {
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: opts.system }] },
    contents: opts.contents,
    generationConfig: {
      maxOutputTokens: opts.maxOutputTokens ?? 1024,
      temperature: opts.temperature ?? 0.6,
    },
  });

  let last: Response | null = null;
  // Une tentative par modèle, bascule rapide en cas de surcharge.
  for (const model of modelChain()) {
    const res = await fetch(`${BASE}/${model}:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body,
    });
    if (res.ok) return res;
    last = res;
    if (TRANSIENT.has(res.status)) await sleep(250); // petite pause avant la bascule
  }
  return last!;
}

/**
 * Appel non-streaming en mode JSON (responseMimeType uniquement, sans schéma
 * strict : plus robuste selon les modèles). Le format attendu est décrit dans
 * le prompt. Renvoie l'objet JSON parsé.
 */
export async function geminiJSON(opts: {
  system: string;
  prompt: string;
  maxOutputTokens?: number;
  temperature?: number;
}): Promise<any> {
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: opts.system }] },
    contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
    generationConfig: {
      responseMimeType: "application/json",
      maxOutputTokens: opts.maxOutputTokens ?? 6000,
      temperature: opts.temperature ?? 0.8,
    },
  });

  let lastErr: Error | null = null;
  // Une tentative par modèle, bascule rapide en cas de surcharge.
  for (const model of modelChain()) {
    const res = await fetch(`${BASE}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body,
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!text) {
        const reason = data?.candidates?.[0]?.finishReason || "inconnue";
        lastErr = new Error(`Réponse vide (finishReason: ${reason}).`);
        continue; // modèle suivant
      }
      const cleaned = text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
      return JSON.parse(cleaned);
    }

    const detail = await res.text().catch(() => "");
    lastErr = new Error(`Gemini ${res.status}: ${detail.slice(0, 200)}`);
    if (TRANSIENT.has(res.status)) await sleep(250); // petite pause avant la bascule
  }
  throw lastErr ?? new Error("Échec de génération Gemini.");
}

/** Appel non-streaming renvoyant du texte brut (avec bascule de modèle). */
export async function geminiText(opts: {
  system: string;
  prompt: string;
  maxOutputTokens?: number;
  temperature?: number;
}): Promise<string> {
  const body = JSON.stringify({
    system_instruction: { parts: [{ text: opts.system }] },
    contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
    generationConfig: {
      maxOutputTokens: opts.maxOutputTokens ?? 1500,
      temperature: opts.temperature ?? 0.7,
    },
  });

  let lastErr: Error | null = null;
  for (const model of modelChain()) {
    const res = await fetch(`${BASE}/${model}:generateContent`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
      body,
    });

    if (res.ok) {
      const data = await res.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (text) return String(text).trim();
      lastErr = new Error("Réponse Gemini vide.");
      continue;
    }

    const detail = await res.text().catch(() => "");
    lastErr = new Error(`Gemini ${res.status}: ${detail.slice(0, 200)}`);
    if (TRANSIENT.has(res.status)) await sleep(250);
  }
  throw lastErr ?? new Error("Échec de génération Gemini.");
}

/**
 * Base de connaissances « commissaire de piste » (France, FFSA/FFM).
 * Socle factuel du chatbot pédagogique et du générateur de quiz.
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

export const NO_OFFICIAL_PARTNERSHIP =
  "TrackMarshal n'est pas officiellement partenaire de la FFSA ni de la FFM. " +
  "Ne jamais laisser entendre une affiliation ou un agrément officiel de ces fédérations.";
