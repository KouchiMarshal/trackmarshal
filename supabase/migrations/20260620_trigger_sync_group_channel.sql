-- Automatically adds a newly accepted marshal to the event's group channel (if one exists).
-- Fires on every UPDATE where status transitions TO "accepted".

CREATE OR REPLACE FUNCTION sync_marshal_to_group_channel()
RETURNS TRIGGER AS $$
DECLARE
  v_conv_id UUID;
  v_event_title TEXT;
BEGIN
  IF NEW.status = 'accepted' AND (OLD.status IS NULL OR OLD.status <> 'accepted') THEN

    SELECT c.id, e.title
    INTO v_conv_id, v_event_title
    FROM conversations c
    JOIN events e ON e.id = c.event_id
    WHERE c.event_id = NEW.event_id
      AND c.is_group = TRUE
    LIMIT 1;

    IF v_conv_id IS NOT NULL THEN
      INSERT INTO conversation_members (conversation_id, user_id)
      VALUES (v_conv_id, NEW.marshal_id)
      ON CONFLICT DO NOTHING;

      INSERT INTO notifications (user_id, title, message, type, link, read)
      VALUES (
        NEW.marshal_id,
        'Canal d''équipe — ' || v_event_title,
        'Vous avez été ajouté au canal d''équipe de l''événement "' || v_event_title || '".',
        'new_message',
        '/dashboard/messages',
        FALSE
      );
    END IF;

  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_application_accepted ON applications;

CREATE TRIGGER on_application_accepted
  AFTER UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION sync_marshal_to_group_channel();
