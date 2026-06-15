import PublicNavbar from "@/components/layout/public-navbar";
import PublicFooter from "@/components/layout/public-footer";

export default function MentionsLegalesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <PublicNavbar />

      <section className="mx-auto max-w-3xl px-4 pb-24 pt-40 sm:px-6 lg:px-8">
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-[#FF5A1F]">Légal</p>
        <h1 className="mt-4 text-4xl font-black lg:text-6xl">Mentions légales</h1>
        <p className="mt-4 text-sm text-zinc-500">Dernière mise à jour : juin 2026</p>

        <div className="mt-12 space-y-10 text-zinc-300 leading-relaxed">

          <div>
            <h2 className="text-xl font-black text-white mb-4">1. Éditeur du site</h2>
            <p>Le site <strong>TrackMarshal</strong> (accessible à l'adresse <strong>www.trackmarshal.app</strong>) est édité par :</p>
            <ul className="mt-3 space-y-1 text-zinc-400">
              <li><strong className="text-white">Nom :</strong> Kevin Foussard</li>
              <li><strong className="text-white">Statut :</strong> Particulier</li>
              <li><strong className="text-white">Ville :</strong> Alençon, France</li>
              <li><strong className="text-white">Email :</strong>{" "}
                <a href="mailto:contact.trackmarshal@gmail.com" className="text-[#FF5A1F] hover:underline">
                  contact.trackmarshal@gmail.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">2. Directeur de la publication</h2>
            <p>Kevin Foussard</p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">3. Hébergement</h2>
            <p>Le site est hébergé par :</p>
            <ul className="mt-3 space-y-1 text-zinc-400">
              <li><strong className="text-white">Société :</strong> Vercel Inc.</li>
              <li><strong className="text-white">Adresse :</strong> 340 Pine Street Suite 701, San Francisco, CA 94104, États-Unis</li>
              <li><strong className="text-white">Site web :</strong>{" "}
                <a href="https://vercel.com" target="_blank" rel="noopener noreferrer" className="text-[#FF5A1F] hover:underline">
                  vercel.com
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">4. Propriété intellectuelle</h2>
            <p>
              L'ensemble des contenus présents sur TrackMarshal (textes, images, logos, design) sont la propriété exclusive
              d'Kevin Foussard ou de leurs auteurs respectifs. Toute reproduction, représentation ou diffusion, totale ou
              partielle, sans autorisation écrite préalable est interdite.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">5. Données personnelles</h2>
            <p>
              Le traitement des données personnelles collectées sur TrackMarshal est décrit dans notre{" "}
              <a href="/confidentialite" className="text-[#FF5A1F] hover:underline">Politique de confidentialité</a>.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">6. Cookies</h2>
            <p>
              TrackMarshal utilise uniquement des cookies strictement nécessaires au fonctionnement du service
              (authentification, session). Aucun cookie de traçage ou publicitaire n'est utilisé.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-black text-white mb-4">7. Contact</h2>
            <p>
              Pour toute question relative aux présentes mentions légales, vous pouvez nous contacter à :{" "}
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
