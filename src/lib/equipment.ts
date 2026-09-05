// Liste d'équipement recommandé, partagée entre la page publique (affichage
// par défaut si la base est vide) et l'import initial côté admin.
export type EquipmentItem = { title: string; tip: string; url: string | null };

export const DEFAULT_EQUIPMENT: EquipmentItem[] = [
  { title: "Combinaison ignifugée orange", tip: "En coton, couleur orange réglementaire, avec bandes de visibilité pour le nocturne.", url: "https://amzn.to/46HC5Nt" },
  { title: "Gants de protection", tip: "Gants type soudeur ou cuir épais ; diélectriques si véhicules électriques/hybrides.", url: "https://amzn.to/4qWKaHm" },
  { title: "Chaussures montantes / bottes", tip: "Bon maintien de cheville, semelle fermée ; bottes imperméables pour la pluie.", url: null },
  { title: "Extincteur portatif", tip: "Poudre ABC, à portée de main en poste.", url: null },
  { title: "Coupe-sangle & sifflet", tip: "Pour dégager rapidement un pilote et se signaler.", url: null },
  { title: "Radio & oreillette", tip: "Souvent fournie, mais une oreillette perso améliore le confort en poste.", url: null },
  { title: "Lampe frontale", tip: "Indispensable pour les épreuves de nuit et les liaisons.", url: null },
  { title: "Chaise pliante", tip: "Pour les longues journées en poste ; légère, compacte et vite déployée entre deux passages.", url: "https://amzn.to/3SUPjTM" },
  { title: "Cafetière portative sur batterie", tip: "Le petit plus pour les matins froids en bord de piste : un café chaud sans prise de courant.", url: "https://amzn.to/3SIJfOl" },
  { title: "Veste de pluie", tip: "Imperméable et respirante : les épreuves ne s'arrêtent pas sous la pluie, toi non plus.", url: "https://amzn.to/4x5Bznh" },
  { title: "Sac commissaire", tip: "Pour tout emporter, prêt dès la veille de l'épreuve.", url: "https://amzn.to/4hbiDi9" },
];
