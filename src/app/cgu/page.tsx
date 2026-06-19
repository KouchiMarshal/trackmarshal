import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export default function CguPage() {
  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">
      <PublicNavbar />

      <section className="mx-auto max-w-3xl px-4 pb-24 pt-40 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Légal</p>
        <h1 className="mt-4 text-4xl font-black lg:text-6xl text-zinc-900">Conditions générales d'utilisation</h1>
        <p className="mt-4 text-sm text-zinc-500">Dernière mise à jour : juin 2026</p>

        <div className="mt-12 space-y-10 text-zinc-600 leading-relaxed">

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">1. Objet</h2>
            <p>
              Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de la plateforme
              <strong> TrackMarshal</strong> (www.trackmarshal.app), éditée par Kevin Foussard.
              TrackMarshal est une plateforme de mise en relation entre commissaires de piste motorsport et
              organisateurs d'événements sportifs.
            </p>
            <p className="mt-3">
              L'accès à la plateforme implique l'acceptation pleine et entière des présentes CGU.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">2. Accès à la plateforme</h2>
            <p>La plateforme est accessible :</p>
            <ul className="mt-3 space-y-2 text-zinc-500">
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>En consultation libre pour les pages publiques (événements, profils publics)</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Après création d'un compte pour les fonctionnalités de candidature, messagerie et gestion d'événements</li>
            </ul>
            <p className="mt-4">
              L'inscription est ouverte à toute personne physique majeure ou personne morale. En créant un compte,
              l'utilisateur garantit l'exactitude des informations fournies.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">3. Rôles utilisateurs</h2>
            <p>Deux types de comptes existent sur TrackMarshal :</p>
            <div className="mt-4 space-y-4">
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="font-black text-zinc-900">Commissaire de piste</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Peut créer un profil, renseigner ses licences et expériences, consulter les événements disponibles
                  et soumettre des candidatures. Peut recevoir des évaluations des organisateurs.
                </p>
              </div>
              <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="font-black text-zinc-900">Organisateur d'événements</p>
                <p className="mt-2 text-sm text-zinc-500">
                  Peut publier des événements, consulter les candidatures reçues, accepter ou refuser des commissaires,
                  envoyer des briefings et échanger via la messagerie intégrée.
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">4. Obligations des utilisateurs</h2>
            <p>Chaque utilisateur s'engage à :</p>
            <ul className="mt-4 space-y-2 text-zinc-500">
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Fournir des informations exactes et à jour sur son profil</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Ne pas usurper l'identité d'un tiers ou fournir de faux documents de licence</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Ne pas perturber le fonctionnement de la plateforme</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Ne pas publier de contenu illicite, diffamatoire, ou portant atteinte aux droits de tiers</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Respecter les autres utilisateurs dans les échanges via la messagerie</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Ne pas utiliser la plateforme à des fins commerciales non autorisées</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">5. Licences et vérifications</h2>
            <p>
              TrackMarshal propose une vérification manuelle des licences motorsport soumises par les commissaires.
              Cette vérification est effectuée à titre indicatif. TrackMarshal ne peut être tenu responsable
              de l'exactitude des informations de licence en cas de falsification par l'utilisateur.
            </p>
            <p className="mt-3">
              Les organisateurs demeurent responsables de la vérification des qualifications de leurs équipes
              conformément aux règlements des fédérations sportives concernées (FFSA, UFOLEP, etc.).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">6. Responsabilité</h2>
            <p>
              TrackMarshal est une plateforme de mise en relation. Elle ne participe pas directement à l'organisation
              des événements sportifs et ne peut être tenue responsable :
            </p>
            <ul className="mt-4 space-y-2 text-zinc-500">
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Des décisions prises par les organisateurs concernant les candidatures</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Des incidents survenant lors des événements</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>De la conformité des événements aux règlements fédéraux</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Des informations inexactes publiées par les utilisateurs</li>
            </ul>
            <p className="mt-4">
              TrackMarshal s'efforce d'assurer la disponibilité du service mais ne garantit pas une accessibilité
              ininterrompue. Des interruptions peuvent survenir pour maintenance ou en cas de force majeure.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">7. Compte et résiliation</h2>
            <p>
              L'utilisateur peut à tout moment demander la suppression de son compte en contactant{" "}
              <a href="mailto:contact.trackmarshal@gmail.com" className="text-[#FF5A1F] hover:underline">
                contact.trackmarshal@gmail.com
              </a>.
              Les données associées seront supprimées conformément à notre{" "}
              <a href="/confidentialite" className="text-[#FF5A1F] hover:underline">Politique de confidentialité</a>.
            </p>
            <p className="mt-3">
              TrackMarshal se réserve le droit de suspendre ou supprimer tout compte en cas de violation des présentes CGU,
              sans préavis ni indemnité.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">8. Propriété intellectuelle</h2>
            <p>
              Le contenu de la plateforme (design, textes, logo) est protégé par le droit d'auteur et appartient
              à Kevin Foussard. Les contenus publiés par les utilisateurs (descriptions d'événements, profils)
              restent la propriété de leurs auteurs. En les publiant sur TrackMarshal, ils accordent une licence
              d'affichage non exclusive à la plateforme.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">9. Modification des CGU</h2>
            <p>
              TrackMarshal se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront
              informés par email en cas de modification substantielle. La date de dernière mise à jour est indiquée
              en haut de cette page.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">10. Droit applicable</h2>
            <p>
              Les présentes CGU sont soumises au droit français. En cas de litige, et à défaut de résolution amiable,
              les tribunaux français seront compétents.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-zinc-900 mb-4">11. Contact</h2>
            <p>
              Pour toute question relative aux présentes CGU :{" "}
              <a href="mailto:contact.trackmarshal@gmail.com" className="text-[#FF5A1F] hover:underline">
                contact.trackmarshal@gmail.com
              </a>
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
