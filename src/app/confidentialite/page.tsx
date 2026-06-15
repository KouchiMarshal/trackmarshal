import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export default function ConfidentialitePage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PublicNavbar />

      <section className="mx-auto max-w-3xl px-4 pb-24 pt-40 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Légal</p>
        <h1 className="mt-4 text-4xl font-black lg:text-6xl">Politique de confidentialité</h1>
        <p className="mt-4 text-sm text-zinc-500">Dernière mise à jour : juin 2026</p>

        <div className="mt-12 space-y-10 text-zinc-300 leading-relaxed">

          <div>
            <h2 className="text-xl font-black text-white mb-4">1. Qui sommes-nous ?</h2>
            <p>
              TrackMarshal (<strong>www.trackmarshall.app</strong>) est une plateforme qui connecte les commissaires
              de piste motorsport avec les organisateurs d'événements. Le responsable du traitement des données est
              <strong> Kevin Foussard</strong>, domiciliée à Alençon, France.
            </p>
            <p className="mt-3">Contact : <a href="mailto:contact.trackmarshal@gmail.com" className="text-[#FF5A1F] hover:underline">contact.trackmarshal@gmail.com</a></p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">2. Données collectées</h2>
            <p>Lors de votre utilisation de TrackMarshal, nous collectons les données suivantes :</p>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><span><strong className="text-white">Données d'identification :</strong> nom complet, adresse email</span></li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><span><strong className="text-white">Données de profil :</strong> photo de profil, ville, pays, biographie, années d'expérience, disciplines pratiquées</span></li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><span><strong className="text-white">Données de licence :</strong> type de licence, numéro de licence, copie du document de licence</span></li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><span><strong className="text-white">Données d'activité :</strong> candidatures soumises, messages échangés, événements publiés</span></li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><span><strong className="text-white">Données techniques :</strong> cookies de session (authentification uniquement)</span></li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">3. Finalités du traitement</h2>
            <p>Vos données sont utilisées pour :</p>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Créer et gérer votre compte utilisateur</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Permettre la mise en relation entre commissaires et organisateurs</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Vérifier les licences motorsport soumises</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Envoyer des notifications par email liées à votre activité (candidatures, messages, licences)</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Assurer la sécurité et le bon fonctionnement de la plateforme</li>
            </ul>
            <p className="mt-4">
              Base légale : <strong className="text-white">exécution du contrat</strong> (article 6.1.b RGPD) pour les données nécessaires au service,
              et <strong className="text-white">intérêt légitime</strong> (article 6.1.f RGPD) pour la sécurité de la plateforme.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">4. Durée de conservation</h2>
            <ul className="mt-3 space-y-2 text-zinc-400">
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Données de compte : conservées jusqu'à la suppression du compte</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Données de candidatures et messages : conservées pendant la durée de votre compte</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span>Après suppression : données effacées sous 30 jours</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">5. Sous-traitants</h2>
            <p>TrackMarshal fait appel aux prestataires suivants pour le traitement de vos données :</p>
            <div className="mt-4 space-y-4">
              {[
                { name: "Supabase Inc.", role: "Hébergement de la base de données et authentification", country: "États-Unis", url: "supabase.com" },
                { name: "Vercel Inc.", role: "Hébergement de l'application web", country: "États-Unis", url: "vercel.com" },
                { name: "Resend Inc.", role: "Envoi des emails transactionnels", country: "États-Unis", url: "resend.com" },
              ].map((p) => (
                <div key={p.name} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="font-black text-white">{p.name}</p>
                  <p className="mt-1 text-sm text-zinc-400">{p.role} — {p.country}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-zinc-500">
              Ces prestataires sont établis aux États-Unis. Les transferts sont encadrés par les clauses contractuelles types
              de la Commission européenne ou le Data Privacy Framework UE-États-Unis.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">6. Vos droits</h2>
            <p>Conformément au RGPD, vous disposez des droits suivants sur vos données :</p>
            <ul className="mt-4 space-y-2 text-zinc-400">
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><strong className="text-white">Accès</strong> — consulter les données que nous détenons sur vous</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><strong className="text-white">Rectification</strong> — corriger des données inexactes</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><strong className="text-white">Suppression</strong> — demander l'effacement de vos données</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><strong className="text-white">Portabilité</strong> — recevoir vos données dans un format structuré</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><strong className="text-white">Opposition</strong> — vous opposer à certains traitements</li>
              <li className="flex gap-3"><span className="text-[#FF5A1F] shrink-0">→</span><strong className="text-white">Limitation</strong> — limiter le traitement dans certains cas</li>
            </ul>
            <p className="mt-4">
              Pour exercer ces droits, contactez-nous à{" "}
              <a href="mailto:contact.trackmarshal@gmail.com" className="text-[#FF5A1F] hover:underline">contact.trackmarshal@gmail.com</a>.
              Nous répondrons dans un délai de 30 jours.
            </p>
            <p className="mt-3">
              Vous avez également le droit d'introduire une réclamation auprès de la{" "}
              <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer" className="text-[#FF5A1F] hover:underline">
                CNIL
              </a>{" "}
              (Commission Nationale de l'Informatique et des Libertés).
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">7. Cookies</h2>
            <p>
              TrackMarshal utilise uniquement des cookies strictement nécessaires au fonctionnement du service :
              cookie de session d'authentification (Supabase). Ce cookie est indispensable pour vous maintenir connecté
              et ne nécessite pas de consentement préalable.
            </p>
            <p className="mt-3">Aucun cookie publicitaire, analytique ou de traçage n'est utilisé.</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">8. Modifications</h2>
            <p>
              Nous pouvons mettre à jour cette politique à tout moment. La date de dernière mise à jour est indiquée
              en haut de cette page. En continuant à utiliser TrackMarshal après une mise à jour, vous acceptez
              la nouvelle politique.
            </p>
          </div>

        </div>
      </section>

      <PublicFooter />
    </main>
  );
}
