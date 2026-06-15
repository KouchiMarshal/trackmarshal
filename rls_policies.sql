-- =============================================
-- TrackMarshal — RLS Policies
-- À coller dans Supabase > SQL Editor > New query
-- =============================================

-- =============================================
-- PROFILES
-- =============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les profils (annuaire public, pages événements)
CREATE POLICY "profiles_select_all" ON profiles
  FOR SELECT USING (true);

-- Seul l'utilisateur peut modifier son propre profil
CREATE POLICY "profiles_update_own" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Insertion uniquement pour son propre id (inscription)
CREATE POLICY "profiles_insert_own" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Suppression de son propre profil
CREATE POLICY "profiles_delete_own" ON profiles
  FOR DELETE USING (auth.uid() = id);

-- =============================================
-- EVENTS
-- =============================================
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les événements
CREATE POLICY "events_select_all" ON events
  FOR SELECT USING (true);

-- Seuls les organisateurs peuvent créer un événement
CREATE POLICY "events_insert_organizer" ON events
  FOR INSERT WITH CHECK (
    auth.uid() = organizer_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'organizer')
  );

-- Seul l'organisateur propriétaire peut modifier
CREATE POLICY "events_update_own" ON events
  FOR UPDATE USING (auth.uid() = organizer_id);

-- Seul l'organisateur propriétaire peut supprimer
CREATE POLICY "events_delete_own" ON events
  FOR DELETE USING (auth.uid() = organizer_id);

-- =============================================
-- APPLICATIONS
-- =============================================
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Le commissaire voit ses propres candidatures,
-- l'organisateur voit celles de ses événements
CREATE POLICY "applications_select" ON applications
  FOR SELECT USING (
    auth.uid() = marshal_id OR
    EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid())
  );

-- Seuls les commissaires peuvent postuler
CREATE POLICY "applications_insert_marshal" ON applications
  FOR INSERT WITH CHECK (
    auth.uid() = marshal_id AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'marshal')
  );

-- L'organisateur peut changer le statut (accepter/refuser)
CREATE POLICY "applications_update_organizer" ON applications
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM events WHERE id = event_id AND organizer_id = auth.uid())
  );

-- Le commissaire peut retirer sa propre candidature
CREATE POLICY "applications_delete_own" ON applications
  FOR DELETE USING (auth.uid() = marshal_id);

-- =============================================
-- NOTIFICATIONS
-- =============================================
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Chaque utilisateur ne voit que ses propres notifications
CREATE POLICY "notifications_select_own" ON notifications
  FOR SELECT USING (auth.uid() = user_id);

-- Tout utilisateur connecté peut envoyer une notification (invitations, etc.)
CREATE POLICY "notifications_insert_auth" ON notifications
  FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- Seul le destinataire peut marquer comme lu
CREATE POLICY "notifications_update_own" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- Seul le destinataire peut supprimer
CREATE POLICY "notifications_delete_own" ON notifications
  FOR DELETE USING (auth.uid() = user_id);

-- =============================================
-- MESSAGES
-- =============================================
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Seuls l'expéditeur et le destinataire voient la conversation
CREATE POLICY "messages_select_participant" ON messages
  FOR SELECT USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Seul l'expéditeur peut envoyer (sender_id = soi-même)
CREATE POLICY "messages_insert_own" ON messages
  FOR INSERT WITH CHECK (auth.uid() = sender_id);

-- =============================================
-- REVIEWS
-- =============================================
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut lire les avis
CREATE POLICY "reviews_select_all" ON reviews
  FOR SELECT USING (true);

-- Seuls les organisateurs authentifiés peuvent laisser un avis
CREATE POLICY "reviews_insert_organizer" ON reviews
  FOR INSERT WITH CHECK (
    auth.uid() IS NOT NULL AND
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'organizer')
  );
