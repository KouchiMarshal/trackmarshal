<div className="mx-auto max-w-7xl rounded-[40px] border border-white/10 bg-[#050505] p-12 text-white">

  <div className="flex items-start justify-between gap-8">

    <div>

      <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

        Panel Organisateur

      </p>

      <h2 className="mt-4 text-7xl font-black leading-none">

        Modifier l'Événement

      </h2>

      <p className="mt-6 max-w-3xl text-xl leading-relaxed text-zinc-400">

        Gérez l’identité de votre événement, les besoins en commissaires,
        la logistique et le planning depuis un dashboard premium unique.

      </p>

    </div>

    <button
      onClick={() => setIsOpen(false)}
      className="rounded-2xl border border-white/10 bg-white/5 px-6 py-4 transition hover:bg-white/10"
    >
      Fermer
    </button>

  </div>

  <div className="mt-14 space-y-14">

    {/* INFORMATIONS */}

    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

      <div className="mb-10">

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Informations

        </p>

        <h3 className="mt-3 text-3xl font-black">

          Informations Générales

        </h3>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Nom de l'Événement

          </p>

          <input
            placeholder="24 Heures du Mans"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Discipline

          </p>

          <input
            placeholder="Endurance"
            value={discipline}
            onChange={(e) => setDiscipline(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Circuit / Lieu

          </p>

          <input
            placeholder="Circuit du Mans"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Pays

          </p>

          <input
            placeholder="France"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Date de l'Événement

          </p>

          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

      </div>

    </div>

    {/* STAFF */}

    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

      <div className="mb-10">

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Staff

        </p>

        <h3 className="mt-3 text-3xl font-black">

          Gestion des Commissaires

        </h3>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Commissaires Recherchés

          </p>

          <input
            placeholder="150"
            value={marshalsNeeded}
            onChange={(e) => setMarshalsNeeded(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Contact Organisateur

          </p>

          <input
            placeholder="contact@event.com"
            value={organizerContact}
            onChange={(e) => setOrganizerContact(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

      </div>

    </div>

    {/* LOGISTIQUE */}

    <div className="rounded-[32px] border border-white/10 bg-white/5 p-8">

      <div className="mb-10">

        <p className="text-sm uppercase tracking-[0.3em] text-[#FF5A1F]">

          Logistique

        </p>

        <h3 className="mt-3 text-3xl font-black">

          Hébergement & Repas

        </h3>

      </div>

      <div className="grid gap-8 md:grid-cols-2">

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Hébergement

          </p>

          <input
            placeholder="Hôtel fourni"
            value={accommodation}
            onChange={(e) => setAccommodation(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

        <div>

          <p className="mb-3 text-sm uppercase tracking-[0.2em] text-zinc-500">

            Repas

          </p>

          <input
            placeholder="Petit déjeuner et déjeuner inclus"
            value={meals}
            onChange={(e) => setMeals(e.target.value)}
            className="h-16 w-full rounded-2xl border border-white/10 bg-black/40 px-6 text-lg text-white outline-none transition focus:border-[#FF5A1F]"
          />

        </div>

      </div>

    </div>

  </div>