"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  ClipboardCheck,
  Copy,
  FileSpreadsheet,
  FileText,
  Link2,
  MapPin,
  MessageSquare,
  Pencil,
  Users,
  Trash2,
  X,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import OrganizerSidebar from "@/components/layout/organizer-sidebar";
import NotificationBell from "@/components/notifications/notification-bell";
import { formatDateRange } from "@/lib/formatDate";
import { Toast, type ToastData } from "@/components/ui/toast";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { sendEmail } from "@/lib/sendEmail";

export default function OrganizerEventDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params?.id as string;

  const [filter, setFilter] = useState("all");
  const [toast, setToast] = useState<ToastData>(null);
  const [event, setEvent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [bulkLoading, setBulkLoading] = useState(false);
  const [inviteCopied, setInviteCopied] = useState(false);

  // Feature 1: Messagerie groupée
  const [showGroupMsg, setShowGroupMsg] = useState(false);
  const [groupMsg, setGroupMsg] = useState("");
  const [sendingGroupMsg, setSendingGroupMsg] = useState(false);

  // Feature 4: Rappels automatiques
  const [sendingReminders, setSendingReminders] = useState(false);

  // Canal de groupe
  const [creatingGroupChannel, setCreatingGroupChannel] = useState(false);

  // Feature 2: Attribution de postes
  const [postValues, setPostValues] = useState<Record<string, string>>({});
  const [postSaving, setPostSaving] = useState<Record<string, boolean>>({});

  // Feature 5: Bilan post-événement
  const [bilanAttended, setBilanAttended] = useState<Record<string, boolean | null>>({});
  const [bilanNotes, setBilanNotes] = useState<Record<string, string>>({});
  const [bilanSaving, setBilanSaving] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!eventId) return;
    loadEvent();
    const channel = supabase
      .channel(`organizer-event-${eventId}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "applications", filter: `event_id=eq.${eventId}` }, () => {
        loadEvent();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [eventId]);

  async function loadEvent() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); setLoading(false); return; }

      const { data: eventData } = await supabase
        .from("events")
        .select("*")
        .eq("id", eventId)
        .eq("organizer_id", user.id)
        .maybeSingle();

      setEvent(eventData ?? null);

      const { data: appsRaw } = await supabase
        .from("applications")
        .select("*")
        .eq("event_id", eventId)
        .order("created_at", { ascending: false });

      const appsData = appsRaw || [];

      if (appsData.length > 0) {
        const profileIds = [...new Set(appsData.map((a: any) => a.marshal_id))];
        const { data: profilesData } = await supabase
          .from("profiles")
          .select("id, full_name, email, phone, city, country, experience, years_experience, avatar_url, license_type, license_number, license_url, license_verified, license_type_2, license_number_2, license_verified_2, languages, specialties, disciplines, asa")
          .in("id", profileIds);

        const profilesMap: Record<string, any> = {};
        (profilesData || []).forEach((p: any) => { profilesMap[p.id] = p; });

        const appsWithProfiles = appsData.map((a: any) => ({
          ...a,
          profiles: profilesMap[a.marshal_id] || null,
        }));

        setApplications(appsWithProfiles);

        const initPosts: Record<string, string> = {};
        const initAttended: Record<string, boolean | null> = {};
        const initNotes: Record<string, string> = {};
        appsWithProfiles.forEach((a: any) => {
          initPosts[a.id] = a.post || "";
          initAttended[a.id] = a.attended ?? null;
          initNotes[a.id] = a.attended_note || "";
        });
        setPostValues(initPosts);
        setBilanAttended(initAttended);
        setBilanNotes(initNotes);
      } else {
        setApplications([]);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  }

  function copyInviteLink() {
    if (!event?.slug) {
      setToast({ message: "Slug de l'événement introuvable.", type: "error" });
      return;
    }
    const url = `https://www.trackmarshal.app/events/${event.slug}?invite=1`;
    const finish = () => {
      setInviteCopied(true);
      setToast({ message: "Lien d'invitation copié !", type: "success" });
      setTimeout(() => setInviteCopied(false), 2500);
    };
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).then(finish).catch(() => fallbackCopy(url, finish));
    } else {
      fallbackCopy(url, finish);
    }
  }

  function fallbackCopy(text: string, onDone: () => void) {
    const el = document.createElement("textarea");
    el.value = text;
    el.style.cssText = "position:fixed;opacity:0;pointer-events:none";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try { document.execCommand("copy"); onDone(); } catch { /* silent */ }
    document.body.removeChild(el);
  }

  async function deleteEvent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("events").delete().eq("id", eventId).eq("organizer_id", user.id);
    router.push("/organizer/events");
  }

  async function cloneEvent() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !event) return;
    const slug = `${event.slug || event.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-copie-${Date.now()}`;
    const { data, error } = await supabase.from("events").insert({
      title: `${event.title} (copie)`,
      slug,
      organizer_id: user.id,
      location: event.location,
      country: event.country,
      event_date: event.event_date,
      event_end_date: event.event_end_date || null,
      discipline: event.discipline,
      description: event.description,
      briefing: event.briefing,
      marshals_needed: event.marshals_needed,
      hotel: event.hotel,
      hotel_detail: event.hotel_detail,
      repas: event.repas,
      repas_type: event.repas_type,
      defraiement: event.defraiement,
      defraiement_amount: event.defraiement_amount,
      pass_accompagnant: event.pass_accompagnant,
      pass_accompagnant_count: event.pass_accompagnant_count,
      organizer_contact: event.organizer_contact,
      schedule: event.schedule,
    }).select().single();
    if (error) { setToast({ message: error.message, type: "error" }); return; }
    setToast({ message: "Événement dupliqué avec succès !", type: "success" });
    setTimeout(() => router.push(`/organizer/events/${data.id}`), 1000);
  }

  async function savePost(appId: string, post: string) {
    setPostSaving((prev) => ({ ...prev, [appId]: true }));
    const { error } = await supabase
      .from("applications")
      .update({ post: post || null })
      .eq("id", appId);
    setPostSaving((prev) => ({ ...prev, [appId]: false }));
    if (error) {
      setToast({ message: "Erreur lors de la sauvegarde du poste.", type: "error" });
    } else {
      setToast({ message: "Poste enregistré.", type: "success" });
      if (post) {
        const app = applications.find((a: any) => a.id === appId);
        if (app?.marshal_id) {
          await supabase.from("notifications").insert({
            user_id: app.marshal_id,
            title: `Poste assigné : ${post}`,
            message: `Vous avez été assigné au poste "${post}" pour l'événement "${event?.title}".`,
            type: "post_assigned",
            link: `/events/${event?.slug}`,
            read: false,
          });
        }
      }
    }
  }

  async function sendGroupMessage() {
    if (!groupMsg.trim()) return;
    setSendingGroupMsg(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/organizer/send-group-message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ eventId, message: groupMsg.trim() }),
      });
      const data = await res.json();
      if (data.ok) {
        setToast({ message: `Message envoyé à ${data.sent} commissaire(s) !`, type: "success" });
        setGroupMsg("");
        setShowGroupMsg(false);
      } else {
        setToast({ message: data.error || "Erreur lors de l'envoi.", type: "error" });
      }
    } catch {
      setToast({ message: "Erreur réseau.", type: "error" });
    }
    setSendingGroupMsg(false);
  }

  async function createGroupChannel() {
    setCreatingGroupChannel(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/organizer/create-group-channel", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session?.access_token}` },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (data.ok) {
        setToast({ message: "Canal d'équipe créé ! Redirection...", type: "success" });
        setTimeout(() => router.push("/organizer/messages"), 800);
      } else {
        setToast({ message: data.error || "Erreur lors de la création.", type: "error" });
      }
    } catch {
      setToast({ message: "Erreur réseau.", type: "error" });
    }
    setCreatingGroupChannel(false);
  }

  async function sendReminders() {
    setSendingReminders(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/organizer/send-reminders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.access_token}`,
        },
        body: JSON.stringify({ eventId }),
      });
      const data = await res.json();
      if (data.ok) {
        setToast({ message: `Rappels envoyés à ${data.sent} commissaire(s) !`, type: "success" });
      } else {
        setToast({ message: data.error || "Erreur lors de l'envoi.", type: "error" });
      }
    } catch {
      setToast({ message: "Erreur réseau.", type: "error" });
    }
    setSendingReminders(false);
  }

  async function saveBilan(appId: string) {
    setBilanSaving((prev) => ({ ...prev, [appId]: true }));
    const { error } = await supabase
      .from("applications")
      .update({
        attended: bilanAttended[appId] ?? null,
        attended_note: bilanNotes[appId] || null,
      })
      .eq("id", appId);
    setBilanSaving((prev) => ({ ...prev, [appId]: false }));
    if (error) {
      setToast({ message: "Erreur lors de la sauvegarde.", type: "error" });
    } else {
      setToast({ message: "Présence enregistrée.", type: "success" });
    }
  }

  function escapeHtml(val: string | null | undefined): string {
    if (!val) return "—";
    return String(val)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  function escapeCSV(val: any): string {
    if (val === null || val === undefined) return "";
    const str = String(val).replace(/"/g, '""');
    return str.includes(",") || str.includes("\n") || str.includes('"') ? `"${str}"` : str;
  }

  function exportCSV() {
    const accepted = applications.filter((a) => a.status === "accepted");
    const headers = ["Nom", "Email", "Téléphone", "Ville", "Pays", "Années d'expérience", "Type licence", "Numéro licence", "ASA", "Licence vérifiée", "Type licence 2", "Numéro licence 2", "Licence 2 vérifiée", "Rôle postulé", "Poste", "Langues", "Spécialités", "Disciplines", "Expérience"];
    const rows = accepted.map((app) => {
      const p = app.profiles || {};
      return [
        p.full_name, p.email, p.phone, p.city, p.country,
        p.years_experience, p.license_type, p.license_number, p.asa || "",
        p.license_verified ? "Oui" : "Non",
        p.license_type_2 || "", p.license_number_2 || "",
        p.license_type_2 ? (p.license_verified_2 ? "Oui" : "Non") : "",
        app.desired_role || "",
        app.post,
        p.languages, p.specialties, p.disciplines, p.experience,
      ].map(escapeCSV);
    });
    const csvContent = "﻿" + [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${event.title.replace(/[^a-z0-9]/gi, "_")}_commissaires.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportPDF() {
    const accepted = applications.filter((a) => a.status === "accepted");
    const rows = accepted.map((app) => {
      const p = app.profiles || {};
      return `
        <tr>
          <td>${escapeHtml(p.full_name)}</td>
          <td>${escapeHtml(p.email)}</td>
          <td>${escapeHtml(p.phone)}</td>
          <td>${escapeHtml(p.city)}${p.country ? `, ${escapeHtml(p.country)}` : ""}</td>
          <td>${escapeHtml(p.years_experience)}</td>
          <td>${escapeHtml(p.license_type)}${p.license_type_2 ? `<br/><span style="color:#aaa;font-size:10px;">${escapeHtml(p.license_type_2)}</span>` : ""}</td>
          <td>${escapeHtml(p.license_number)}${p.asa ? `<br/><span style="color:#888;font-size:10px;">ASA: ${escapeHtml(p.asa)}</span>` : ""}${p.license_number_2 ? `<br/><span style="color:#aaa;font-size:10px;">${escapeHtml(p.license_number_2)}</span>` : ""}</td>
          <td>${p.license_verified ? "✔ Vérifiée" : "En attente"}${p.license_type_2 ? `<br/><span style="font-size:10px;">${p.license_verified_2 ? "✔ Vérifiée" : "En attente"}</span>` : ""}</td>
          <td>${escapeHtml(app.desired_role)}</td>
          <td>${escapeHtml(app.post)}</td>
          <td>${escapeHtml(p.languages)}</td>
        </tr>
      `;
    }).join("");

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Commissaires acceptés — ${event.title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 20px; }
        h1 { font-size: 18px; margin-bottom: 4px; }
        p { color: #555; margin-bottom: 16px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #FF5A1F; color: #fff; padding: 8px 6px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; }
        td { padding: 7px 6px; border-bottom: 1px solid #eee; vertical-align: top; }
        tr:nth-child(even) td { background: #fafafa; }
      </style>
    </head><body>
      <h1>${escapeHtml(event.title)}</h1>
      <p>Commissaires acceptés — exporté le ${new Date().toLocaleDateString("fr-FR")}</p>
      <table>
        <thead><tr>
          <th>Nom</th><th>Email</th><th>Téléphone</th><th>Localisation</th>
          <th>Exp.</th><th>Type licence</th><th>N° licence</th><th>Vérifiée</th><th>Rôle postulé</th><th>Poste</th><th>Langues</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 300);
    }
  }

  // Feature 3: Feuille d'émargement
  function exportEmargement() {
    const accepted = applications.filter((a) => a.status === "accepted");

    // Build list of event days
    const days: Date[] = [];
    const startDay = new Date(event.event_date);
    const endDay = event.event_end_date ? new Date(event.event_end_date) : new Date(event.event_date);
    for (let d = new Date(startDay); d <= endDay; d.setDate(d.getDate() + 1)) {
      days.push(new Date(d));
    }
    const isMultiDay = days.length > 1;

    const dayHeaders = isMultiDay
      ? days.map((d) => `<th style="width:100px;text-align:center;">${d.toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}<br/><span style="font-size:9px;font-weight:normal;letter-spacing:0;opacity:0.7;text-transform:none;">Signature</span></th>`).join("")
      : `<th style="width:120px;">Signature</th>`;

    const rows = accepted.map((app, idx) => {
      const p = app.profiles || {};
      const signatureCells = isMultiDay
        ? days.map(() => `<td style="height:56px;"></td>`).join("")
        : `<td style="height:56px;"></td>`;
      return `
        <tr>
          <td style="text-align:center;">${idx + 1}</td>
          <td><strong>${escapeHtml(p.full_name)}</strong><br/><span style="color:#888;font-size:10px;">${escapeHtml(p.license_type)} ${escapeHtml(p.license_number)}${p.asa ? ` — ${escapeHtml(p.asa)}` : ""}${p.license_type_2 ? ` · ${escapeHtml(p.license_type_2)}` : ""}${app.desired_role ? `<br/><em style="color:#FF5A1F;font-style:normal;font-weight:bold;">${escapeHtml(app.desired_role)}</em>` : ""}</span></td>
          <td>${escapeHtml(app.post) !== "—" ? escapeHtml(app.post) : '<span style="color:#bbb;">—</span>'}</td>
          ${signatureCells}
        </tr>
      `;
    }).join("");

    const eventDate = formatDateRange(event.event_date, event.event_end_date);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Feuille d'émargement — ${event.title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 20px; }
        .header { border-bottom: 3px solid #FF5A1F; padding-bottom: 12px; margin-bottom: 20px; }
        .header h1 { font-size: 20px; margin: 0 0 4px; }
        .badge { display: inline-block; background: #FF5A1F; color: #fff; padding: 3px 10px; border-radius: 20px; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        table { width: 100%; border-collapse: collapse; margin-top: 12px; }
        th { background: #111; color: #fff; padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; letter-spacing: 0.08em; }
        td { padding: 10px 8px; border-bottom: 1px solid #ddd; vertical-align: middle; }
        tr:nth-child(even) td { background: #f9f9f9; }
        .footer { margin-top: 24px; font-size: 10px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
      </style>
    </head><body>
      <div class="header">
        <span class="badge">🏁 TrackMarshal</span>
        <h1>${escapeHtml(event.title)}</h1>
        <p style="margin:0;color:#555;">📅 ${eventDate} &nbsp;·&nbsp; 📍 ${escapeHtml(event.location)}</p>
      </div>
      <p style="color:#555;">Feuille d'émargement — ${accepted.length} commissaire(s) accepté(s)</p>
      <table>
        <thead><tr>
          <th style="width:32px;">#</th>
          <th>Commissaire</th>
          <th>Poste assigné</th>
          ${dayHeaders}
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">Document généré le ${new Date().toLocaleDateString("fr-FR")} via TrackMarshal</div>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 300);
    }
  }

  // Feature 5: Bilan PDF
  function exportBilanPDF() {
    const accepted = applications.filter((a) => a.status === "accepted");
    const present = accepted.filter((a) => bilanAttended[a.id] === true).length;
    const absent = accepted.filter((a) => bilanAttended[a.id] === false).length;

    const rows = accepted.map((app) => {
      const p = app.profiles || {};
      const att = bilanAttended[app.id];
      const note = bilanNotes[app.id];
      return `
        <tr>
          <td><strong>${escapeHtml(p.full_name)}</strong><br/><span style="color:#888;font-size:10px;">${escapeHtml(p.license_type)}${p.asa ? ` — ${escapeHtml(p.asa)}` : ""}${p.license_type_2 ? ` · ${escapeHtml(p.license_type_2)}` : ""}${app.desired_role ? `<br/><em style="color:#FF5A1F;font-style:normal;font-weight:bold;">${escapeHtml(app.desired_role)}</em>` : ""}</span></td>
          <td>${escapeHtml(app.post)}</td>
          <td style="text-align:center;font-weight:bold;color:${att === true ? "#16a34a" : att === false ? "#dc2626" : "#888"}">
            ${att === true ? "✔ Présent" : att === false ? "✗ Absent" : "—"}
          </td>
          <td style="color:#555;font-size:10px;">${escapeHtml(note)}</td>
        </tr>
      `;
    }).join("");

    const eventDate = formatDateRange(event.event_date, event.event_end_date);

    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"/>
      <title>Bilan — ${event.title}</title>
      <style>
        body { font-family: Arial, sans-serif; font-size: 11px; color: #111; margin: 20px; }
        .header { border-bottom: 3px solid #FF5A1F; padding-bottom: 12px; margin-bottom: 20px; }
        .badge { display: inline-block; background: #FF5A1F; color: #fff; padding: 3px 10px; border-radius: 20px; font-weight: bold; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .stats { display: flex; gap: 24px; margin-bottom: 20px; flex-wrap: wrap; }
        .stat { background: #f5f5f5; border-radius: 12px; padding: 12px 20px; }
        .stat h3 { margin: 0; font-size: 24px; }
        .stat p { margin: 0; color: #888; font-size: 11px; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #111; color: #fff; padding: 10px 8px; text-align: left; font-size: 10px; text-transform: uppercase; }
        td { padding: 10px 8px; border-bottom: 1px solid #ddd; vertical-align: top; }
        tr:nth-child(even) td { background: #f9f9f9; }
        .footer { margin-top: 24px; font-size: 10px; color: #aaa; text-align: center; border-top: 1px solid #eee; padding-top: 12px; }
      </style>
    </head><body>
      <div class="header">
        <span class="badge">🏁 TrackMarshal</span>
        <h1 style="font-size:20px;margin:4px 0;">Bilan post-événement — ${escapeHtml(event.title)}</h1>
        <p style="color:#555;margin:0;">📅 ${eventDate} &nbsp;·&nbsp; 📍 ${escapeHtml(event.location)}</p>
      </div>
      <div class="stats">
        <div class="stat"><h3 style="color:#FF5A1F;">${accepted.length}</h3><p>Commissaires</p></div>
        <div class="stat"><h3 style="color:#16a34a;">${present}</h3><p>Présents</p></div>
        <div class="stat"><h3 style="color:#dc2626;">${absent}</h3><p>Absents</p></div>
        <div class="stat"><h3 style="color:#888;">${accepted.length - present - absent}</h3><p>Non renseigné</p></div>
      </div>
      <table>
        <thead><tr>
          <th>Commissaire</th><th>Poste</th><th>Présence</th><th>Note</th>
        </tr></thead>
        <tbody>${rows}</tbody>
      </table>
      <div class="footer">Bilan généré le ${new Date().toLocaleDateString("fr-FR")} via TrackMarshal</div>
    </body></html>`;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.focus();
      setTimeout(() => { win.print(); }, 300);
    }
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
        Chargement...
      </main>
    );
  }

  if (!event) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-zinc-50 text-zinc-900">
        <div className="text-center">
          <h1 className="text-4xl font-black text-zinc-900">Événement introuvable</h1>
          <Link href="/organizer/events" className="mt-6 inline-flex rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold text-white">
            Retour aux événements
          </Link>
        </div>
      </main>
    );
  }

  const acceptedCount = applications.filter((a) => a.status === "accepted").length;
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const withdrawalCount = applications.filter((a) => a.withdrawal_reason).length;
  const remaining = Math.max(0, (event.marshals_needed || 0) - acceptedCount);
  const eventEndDate = event.event_end_date ? new Date(event.event_end_date) : new Date(event.event_date);
  const isEventPast = eventEndDate < new Date();

  const filteredApplications = applications.filter((app) => {
    if (filter === "all") return true;
    if (filter === "withdrawal") return !!app.withdrawal_reason;
    return app.status === filter;
  });

  async function bulkUpdateStatus(status: "accepted" | "rejected") {
    if (selected.length === 0) return;
    setBulkLoading(true);
    await supabase.from("applications").update({ status }).in("id", selected);
    setSelected([]);
    setBulkLoading(false);
    loadEvent();
    setToast({ message: `${selected.length} candidature(s) ${status === "accepted" ? "acceptée(s)" : "refusée(s)"}`, type: "success" });
  }

  return (
    <main className="min-h-screen bg-zinc-50 text-zinc-900">

      <Toast toast={toast} onClose={() => setToast(null)} />
      <ConfirmModal
        open={confirmDelete}
        title="Supprimer l'événement"
        message={`Êtes-vous sûr de vouloir supprimer "${event?.title}" ? Cette action est irréversible et supprimera toutes les candidatures associées.`}
        confirmText="Supprimer définitivement"
        danger
        onConfirm={() => { setConfirmDelete(false); deleteEvent(); }}
        onCancel={() => setConfirmDelete(false)}
      />

      {/* Modal messagerie groupée */}
      {showGroupMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-lg rounded-3xl border border-zinc-200 bg-white shadow-xl p-6 lg:p-8">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-2xl font-black text-zinc-900">💬 Message groupé</h2>
              <button onClick={() => setShowGroupMsg(false)} className="rounded-xl p-2 text-zinc-500 hover:bg-zinc-100 transition">
                <X size={20} />
              </button>
            </div>
            <p className="mb-4 text-sm text-zinc-600">
              Ce message sera envoyé à tous les commissaires <span className="font-bold text-green-600">acceptés</span> ({acceptedCount}) dans leur conversation individuelle.
            </p>
            <textarea
              value={groupMsg}
              onChange={(e) => setGroupMsg(e.target.value)}
              rows={6}
              placeholder="Votre message pour tous les commissaires acceptés..."
              className="w-full rounded-2xl border border-zinc-300 bg-zinc-50 p-4 text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F] resize-none"
            />
            <div className="mt-4 flex gap-3 justify-end">
              <button
                onClick={() => setShowGroupMsg(false)}
                className="rounded-2xl border border-zinc-200 px-5 py-3 font-bold text-zinc-600 hover:text-zinc-900 transition"
              >
                Annuler
              </button>
              <button
                onClick={sendGroupMessage}
                disabled={sendingGroupMsg || !groupMsg.trim()}
                className="flex items-center gap-2 rounded-2xl bg-[#FF5A1F] px-6 py-3 font-bold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                <MessageSquare size={16} />
                {sendingGroupMsg ? "Envoi..." : "Envoyer"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex min-h-screen">
        <OrganizerSidebar />

        <div className="flex-1 overflow-auto pb-24 lg:pb-0">

          {/* Hero banner */}
          <div className="relative h-[280px] overflow-hidden lg:h-[420px]">
            <img
              src={event.image_url || "https://images.unsplash.com/photo-1503376780353-7e6692767b70?q=80&w=2070&auto=format&fit=crop"}
              alt={event.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

            <div className="absolute inset-0 flex flex-col justify-between p-4 lg:p-10">
              <div className="flex justify-between">
                <Link
                  href="/organizer/events"
                  className="flex items-center gap-2 rounded-2xl border border-white/20 bg-black/40 px-4 py-2 text-sm text-white backdrop-blur-xl lg:px-5 lg:py-3"
                >
                  <ArrowLeft size={16} />
                  Retour
                </Link>
                <div className="flex items-center gap-2 lg:gap-3">
                  <NotificationBell />
                  <button
                    onClick={copyInviteLink}
                    className="flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/30 lg:px-5 lg:py-3"
                  >
                    <Link2 size={16} />
                    <span className="hidden sm:inline">{inviteCopied ? "Lien copié !" : "Lien d'invitation"}</span>
                  </button>
                  <button
                    onClick={cloneEvent}
                    className="hidden items-center gap-2 rounded-2xl bg-white/20 px-5 py-3 font-bold text-white backdrop-blur-xl transition hover:bg-white/30 lg:flex"
                  >
                    <Copy size={18} />
                    Cloner
                  </button>
                  <Link
                    href={`/organizer/events/${eventId}/edit`}
                    className="flex items-center gap-2 rounded-2xl bg-white/20 px-4 py-2 text-sm font-bold text-white backdrop-blur-xl transition hover:bg-white/30 lg:px-5 lg:py-3"
                  >
                    <Pencil size={16} />
                    <span className="hidden sm:inline">Modifier</span>
                  </Link>
                  <button
                    onClick={() => setConfirmDelete(true)}
                    className="flex items-center gap-2 rounded-2xl bg-red-500 px-4 py-2 text-sm font-bold text-white lg:px-5 lg:py-3"
                  >
                    <Trash2 size={16} />
                    <span className="hidden sm:inline">Supprimer</span>
                  </button>
                </div>
              </div>

              <div>
                <div className="mb-3 inline-flex rounded-full bg-[#FF5A1F] px-4 py-2 text-sm font-bold text-white">
                  {event.discipline}
                </div>
                <h1 className="max-w-5xl text-3xl font-black text-white lg:text-7xl">{event.title}</h1>
                <div className="mt-4 flex flex-wrap gap-4 text-zinc-200 lg:mt-6 lg:gap-6">
                  <div className="flex items-center gap-2 text-sm lg:text-base">
                    <CalendarDays size={16} />
                    {formatDateRange(event.event_date, event.event_end_date)}
                  </div>
                  <div className="flex items-center gap-2 text-sm lg:text-base">
                    <MapPin size={16} />
                    {event.location}, {event.country}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mx-auto max-w-[1700px] p-4 lg:p-10">

            {/* Stats grid */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-5 lg:gap-6">
              <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                <p className="text-sm text-zinc-500">Candidatures</p>
                <h2 className="mt-3 text-4xl font-black text-zinc-900 lg:text-5xl">{applications.length}</h2>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                <p className="text-sm text-zinc-500">Acceptés</p>
                <h2 className="mt-3 text-4xl font-black text-green-600 lg:text-5xl">{acceptedCount}</h2>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                <p className="text-sm text-zinc-500">En attente</p>
                <h2 className="mt-3 text-4xl font-black text-yellow-600 lg:text-5xl">{pendingCount}</h2>
              </div>
              <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                <p className="text-sm text-zinc-500">Places restantes</p>
                <h2 className="mt-3 text-4xl font-black text-[#FF5A1F] lg:text-5xl">{remaining}</h2>
              </div>
              <div
                onClick={() => withdrawalCount > 0 ? setFilter("withdrawal") : undefined}
                className={`rounded-3xl border p-5 lg:p-8 transition ${withdrawalCount > 0 ? "cursor-pointer border-orange-200 bg-orange-50 hover:bg-orange-100" : "border-zinc-200 bg-white shadow-sm"}`}
              >
                <p className="text-sm text-zinc-500">Annulations</p>
                <h2 className={`mt-3 text-4xl font-black lg:text-5xl ${withdrawalCount > 0 ? "text-orange-500" : "text-zinc-900"}`}>{withdrawalCount}</h2>
                {withdrawalCount > 0 && <p className="mt-1 text-xs text-orange-500">⚠ Voir demandes</p>}
              </div>
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1fr_420px] lg:mt-8">

              {/* Applications panel */}
              <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">

                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Users size={22} className="text-zinc-700" />
                    <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Candidatures</h2>
                  </div>

                  {acceptedCount > 0 && (
                    <div className="flex flex-wrap items-center gap-2">
                      <Link
                        href={`/organizer/events/${eventId}/reviews`}
                        className="flex items-center gap-1.5 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-3 py-2 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/20"
                      >
                        ⭐ Évaluer
                      </Link>
                      <Link
                        href={`/organizer/events/${eventId}/documents`}
                        className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                      >
                        📁 Documents
                      </Link>
                      <button
                        onClick={() => setShowGroupMsg(true)}
                        className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                      >
                        <MessageSquare size={14} />
                        Message
                      </button>
                      <button
                        onClick={createGroupChannel}
                        disabled={creatingGroupChannel}
                        className="flex items-center gap-1.5 rounded-2xl border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-3 py-2 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/20 disabled:opacity-50"
                      >
                        🏁 {creatingGroupChannel ? "..." : "Canal d'équipe"}
                      </button>
                      <button
                        onClick={sendReminders}
                        disabled={sendingReminders}
                        className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F] disabled:opacity-50"
                      >
                        <Bell size={14} />
                        {sendingReminders ? "..." : "Rappels"}
                      </button>
                      <button
                        onClick={exportEmargement}
                        className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                      >
                        <ClipboardCheck size={14} />
                        Émargement
                      </button>
                      <button
                        onClick={exportCSV}
                        className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                      >
                        <FileSpreadsheet size={14} />
                        CSV
                      </button>
                      <button
                        onClick={exportPDF}
                        className="flex items-center gap-1.5 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                      >
                        <FileText size={14} />
                        PDF
                      </button>
                    </div>
                  )}
                </div>

                {selected.length > 0 && (
                  <div className="mt-5 flex flex-wrap items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                    <span className="text-sm font-bold text-zinc-600">{selected.length} sélectionné(s)</span>
                    <button
                      onClick={() => bulkUpdateStatus("accepted")}
                      disabled={bulkLoading}
                      className="rounded-2xl bg-green-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-green-500 disabled:opacity-60"
                    >
                      Accepter
                    </button>
                    <button
                      onClick={() => bulkUpdateStatus("rejected")}
                      disabled={bulkLoading}
                      className="rounded-2xl bg-red-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-red-500 disabled:opacity-60"
                    >
                      Refuser
                    </button>
                    <button onClick={() => setSelected([])} className="text-sm text-zinc-500 hover:text-zinc-900 transition">
                      Désélectionner
                    </button>
                  </div>
                )}

                <div className="mt-5 mb-4 flex flex-wrap gap-2">
                  {[
                    { key: "all", label: "Toutes", activeClass: "bg-[#FF5A1F] text-white" },
                    { key: "pending", label: "En attente", activeClass: "bg-yellow-500 text-white" },
                    { key: "accepted", label: "Acceptées", activeClass: "bg-green-600 text-white" },
                    { key: "rejected", label: "Refusées", activeClass: "bg-red-600 text-white" },
                    ...(withdrawalCount > 0 ? [{ key: "withdrawal", label: `⚠ Annulations (${withdrawalCount})`, activeClass: "bg-orange-500 text-white" }] : []),
                  ].map(({ key, label, activeClass }) => (
                    <button
                      key={key}
                      onClick={() => setFilter(key)}
                      className={`rounded-2xl px-3 py-2 text-sm font-bold transition lg:px-4 ${filter === key ? activeClass : "border border-zinc-200 bg-zinc-50 text-zinc-600 hover:bg-zinc-100"}`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                {filteredApplications.length === 0 ? (
                  <div className="mt-8 rounded-3xl border border-dashed border-zinc-300 p-10 text-center">
                    <h3 className="text-xl font-black text-zinc-900">Aucune candidature</h3>
                    <p className="mt-4 text-zinc-500">Votre événement est en ligne. Les commissaires peuvent désormais postuler.</p>
                  </div>
                ) : (
                  <div className="mt-4 space-y-4">
                    {filteredApplications.map((app) => (
                      <div
                        key={app.id}
                        className={`rounded-3xl border bg-white p-4 transition lg:p-6 ${selected.includes(app.id) ? "border-[#FF5A1F]/50 bg-[#FF5A1F]/5" : "border-zinc-200"}`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div className="flex gap-3 lg:gap-4">
                            <input
                              type="checkbox"
                              checked={selected.includes(app.id)}
                              onChange={(e) => setSelected(prev => e.target.checked ? [...prev, app.id] : prev.filter(id => id !== app.id))}
                              className="mt-1 h-5 w-5 cursor-pointer accent-[#FF5A1F] shrink-0"
                            />
                            <Link href={`/organizer/commissaires/${app.marshal_id}`}>
                              <img
                                src={app.profiles?.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(app.profiles?.full_name || "Marshal")}`}
                                alt=""
                                className="h-14 w-14 rounded-full transition hover:opacity-80 lg:h-16 lg:w-16"
                              />
                            </Link>
                            <div className="min-w-0 flex-1">
                              <Link href={`/organizer/commissaires/${app.marshal_id}`} className="transition hover:text-[#FF5A1F]">
                                <h3 className="text-xl font-black text-zinc-900 lg:text-2xl">{app.profiles?.full_name}</h3>
                              </Link>
                              <p className="mt-1 text-sm text-zinc-600">
                                📍 {app.profiles?.city || "Ville inconnue"}{app.profiles?.country ? `, ${app.profiles.country}` : ""}
                              </p>
                              <p className="text-sm text-zinc-600">📧 {app.profiles?.email || "-"}</p>
                              <p className="text-sm text-zinc-600">📞 {app.profiles?.phone || "-"}</p>
                              {app.profiles?.license_type && (
                                <p className="text-sm text-zinc-600">
                                  🏁 {app.profiles.license_type}
                                  {app.profiles.license_number ? ` · N° ${app.profiles.license_number}` : ""}
                                  {app.profiles.asa ? ` — ${app.profiles.asa}` : ""}
                                </p>
                              )}
                              <p className="mt-2 text-sm font-semibold text-zinc-700">🏁 Expérience :</p>
                              <p className="whitespace-pre-line text-sm text-zinc-600">{app.profiles?.experience || "Aucune"}</p>
                              <p className="mt-2 text-sm text-zinc-700">⏳ {app.profiles?.years_experience || "-"} ans</p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                <span className={`rounded-full px-3 py-1 text-xs font-bold lg:text-sm ${
                                  app.status === "accepted" ? "bg-green-100 text-green-700"
                                  : app.status === "rejected" ? "bg-red-100 text-red-700"
                                  : "bg-yellow-100 text-yellow-700"
                                }`}>
                                  {app.status === "accepted" ? "Accepté" : app.status === "rejected" ? "Refusé" : "En attente"}
                                </span>
                                {app.desired_role && (
                                  <span className="rounded-full border border-[#FF5A1F]/30 bg-[#FF5A1F]/10 px-3 py-1 text-xs font-bold text-[#FF5A1F] lg:text-sm">
                                    {app.desired_role}
                                  </span>
                                )}
                                {app.status === "accepted" && event?.briefing && (
                                  <span className={`rounded-full px-3 py-1 text-xs font-bold lg:text-sm ${app.briefing_acknowledged ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                                    {app.briefing_acknowledged ? "✓ Briefing lu" : "📋 Briefing non confirmé"}
                                  </span>
                                )}
                                {app.withdrawal_reason && (
                                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-bold text-orange-600 lg:text-sm">
                                    ⚠ Demande d'annulation
                                  </span>
                                )}
                              </div>
                              {app.withdrawal_reason && (
                                <div className="mt-3 rounded-2xl border border-orange-200 bg-orange-50 p-3">
                                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-orange-600">Raison de l'annulation</p>
                                  <p className="mt-1 whitespace-pre-wrap text-sm text-zinc-700">{app.withdrawal_reason}</p>
                                  <div className="mt-3 flex gap-2">
                                    <button
                                      onClick={async () => {
                                        await supabase.from("applications").delete().eq("id", app.id);
                                        await supabase.from("notifications").insert({
                                          user_id: app.marshal_id,
                                          title: "Votre demande d'annulation a été approuvée",
                                          type: "application_rejected",
                                          link: `/events/${event.slug}`,
                                        });
                                        loadEvent();
                                      }}
                                      className="rounded-xl bg-orange-500 px-3 py-2 text-xs font-bold text-white transition hover:bg-orange-600"
                                    >
                                      ✓ Approuver l'annulation
                                    </button>
                                    <button
                                      onClick={async () => {
                                        await supabase.from("applications").update({ withdrawal_reason: null, withdrawal_requested_at: null }).eq("id", app.id);
                                        await supabase.from("notifications").insert({
                                          user_id: app.marshal_id,
                                          title: "Votre demande d'annulation a été refusée",
                                          type: "application_accepted",
                                          link: `/events/${event.slug}`,
                                        });
                                        loadEvent();
                                      }}
                                      className="rounded-xl border border-orange-200 bg-white px-3 py-2 text-xs font-bold text-orange-600 transition hover:bg-orange-50"
                                    >
                                      ✗ Refuser la demande
                                    </button>
                                  </div>
                                </div>
                              )}

                              {/* Feature 2: Attribution de poste */}
                              {app.status === "accepted" && (
                                <div className="mt-4">
                                  <label className="mb-1.5 block text-xs font-bold uppercase tracking-widest text-zinc-500">
                                    Poste assigné
                                  </label>
                                  <div className="flex gap-2">
                                    <input
                                      type="text"
                                      value={postValues[app.id] ?? ""}
                                      onChange={(e) => setPostValues(prev => ({ ...prev, [app.id]: e.target.value }))}
                                      placeholder="ex : Poste 12, Direction de course..."
                                      className="flex-1 rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F]"
                                    />
                                    <button
                                      onClick={() => savePost(app.id, postValues[app.id] ?? "")}
                                      disabled={postSaving[app.id]}
                                      className="rounded-xl bg-[#FF5A1F]/20 px-3 py-2 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/30 disabled:opacity-50"
                                    >
                                      {postSaving[app.id] ? "..." : "OK"}
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="flex flex-row gap-2 sm:flex-col sm:shrink-0">
                            <Link
                              href={`/organizer/commissaires/${app.marshal_id}`}
                              className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-center text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F]"
                            >
                              Voir profil
                            </Link>
                            <div className="flex gap-2">
                              <button
                                disabled={app.status === "accepted" || !!app.withdrawal_reason}
                                onClick={async () => {
                                  const cappedCount = applications.filter((a) => a.status === "accepted" && a.id !== app.id).length;
                                  if (cappedCount >= event.marshals_needed) {
                                    setToast({ message: "Le nombre maximum de commissaires est atteint. Refusez d'abord un autre commissaire.", type: "error" });
                                    return;
                                  }
                                  const { error: updateError } = await supabase
                                    .from("applications").update({ status: "accepted" }).eq("id", app.id);
                                  if (updateError) {
                                    setToast({ message: `Erreur : ${updateError.message}`, type: "error" });
                                    return;
                                  }
                                  // Optimistic update
                                  setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "accepted" } : a));
                                  await supabase.from("notifications").insert({
                                    user_id: app.marshal_id,
                                    title: "Votre candidature a été acceptée",
                                    message: `Votre candidature pour "${event.title}" a été acceptée.`,
                                    type: "application_accepted",
                                    link: `/events/${event.slug}`,
                                    read: false,
                                  });
                                  if (app.profiles?.email) {
                                    sendEmail(app.profiles.email, "application_accepted", {
                                      eventTitle: event.title,
                                      eventDate: formatDateRange(event.event_date, event.event_end_date),
                                      eventLocation: event.location,
                                    });
                                  }
                                  const { data: { user: currentUser } } = await supabase.auth.getUser();
                                  if (currentUser) {
                                    const { data: myMemberships } = await supabase
                                      .from("conversation_members").select("conversation_id").eq("user_id", currentUser.id);
                                    const myConvIds = (myMemberships || []).map((m: any) => m.conversation_id);
                                    let alreadyExists = false;
                                    if (myConvIds.length > 0) {
                                      const { data: shared } = await supabase
                                        .from("conversation_members").select("conversation_id")
                                        .eq("user_id", app.marshal_id).in("conversation_id", myConvIds);
                                      alreadyExists = (shared || []).length > 0;
                                    }
                                    if (!alreadyExists) {
                                      const { data: convData } = await supabase
                                        .from("conversations")
                                        .insert({ title: `${event.title} — ${app.profiles?.full_name || "Commissaire"}` })
                                        .select().single();
                                      if (convData?.id) {
                                        await supabase.from("conversation_members").insert([
                                          { conversation_id: convData.id, user_id: currentUser.id },
                                          { conversation_id: convData.id, user_id: app.marshal_id },
                                        ]);
                                      }
                                    }
                                  }
                                  setToast({ message: "Candidature acceptée.", type: "success" });
                                }}
                                className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${app.status === "accepted" ? "cursor-not-allowed bg-zinc-200 text-zinc-400" : "bg-green-600 text-white hover:bg-green-500"}`}
                              >
                                Accepter
                              </button>
                              {!app.withdrawal_reason && (
                                <button
                                  disabled={app.status === "rejected"}
                                  onClick={async () => {
                                    const { error: updateError } = await supabase
                                      .from("applications").update({ status: "rejected" }).eq("id", app.id);
                                    if (updateError) {
                                      setToast({ message: `Erreur : ${updateError.message}`, type: "error" });
                                      return;
                                    }
                                    // Optimistic update
                                    setApplications((prev) => prev.map((a) => a.id === app.id ? { ...a, status: "rejected" } : a));
                                    await supabase.from("notifications").insert({
                                      user_id: app.marshal_id,
                                      title: "Votre candidature a été refusée",
                                      message: `Votre candidature pour "${event.title}" n'a pas été retenue.`,
                                      type: "application_rejected",
                                      link: `/events/${event.slug}`,
                                      read: false,
                                    });
                                    if (app.profiles?.email) {
                                      sendEmail(app.profiles.email, "application_rejected", { eventTitle: event.title });
                                    }
                                    setToast({ message: "Candidature refusée.", type: "success" });
                                  }}
                                  className={`rounded-2xl px-4 py-2 text-sm font-bold transition ${app.status === "rejected" ? "cursor-not-allowed bg-zinc-200 text-zinc-400" : "bg-red-600 text-white hover:bg-red-500"}`}
                                >
                                  Refuser
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sidebar info panel */}
              <div className="space-y-6">
                <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                  <h3 className="text-xl font-black text-zinc-900">Description</h3>
                  <p className="mt-4 whitespace-pre-wrap text-zinc-700">{event.briefing || event.description || "Aucune description disponible."}</p>
                </div>

                {event.schedule && (
                  <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                    <h3 className="text-xl font-black text-zinc-900">Planning détaillé</h3>
                    <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-zinc-700">{event.schedule}</p>
                  </div>
                )}

                <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                  <h3 className="text-xl font-black text-zinc-900">Avantages</h3>
                  <div className="mt-4 flex flex-col gap-3 text-zinc-700">
                    {event.hotel && (
                      <div>🏨 {event.hotel_detail || "Hébergement inclus"}</div>
                    )}
                    {event.pass_accompagnant && (
                      <div>🎟️ {event.pass_accompagnant_count} pass accompagnant(s)</div>
                    )}
                    {event.defraiement && (
                      <div>💰 Défraiement : {event.defraiement_amount}</div>
                    )}
                    {event.repas && (
                      <div>🍽️ {event.repas_type}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 5: Bilan post-événement */}
            {isEventPast && acceptedCount > 0 && (
              <div className="mt-6 lg:mt-8">
                <div className="rounded-3xl border border-zinc-200 bg-white shadow-sm p-5 lg:p-8">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <ClipboardCheck className="text-[#FF5A1F]" size={24} />
                      <h2 className="text-2xl font-black text-zinc-900 lg:text-3xl">Bilan post-événement</h2>
                    </div>
                    <button
                      onClick={exportBilanPDF}
                      className="flex items-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-2 text-sm font-bold text-zinc-700 transition hover:border-[#FF5A1F]/40 hover:text-[#FF5A1F] lg:px-5 lg:py-3"
                    >
                      <FileText size={15} />
                      Exporter le bilan
                    </button>
                  </div>

                  <p className="mb-5 text-sm text-zinc-600">
                    Marquez la présence de chaque commissaire. Ces données sont sauvegardées et permettent de générer un rapport de participation.
                  </p>

                  <div className="space-y-3">
                    {applications.filter((a) => a.status === "accepted").map((app) => {
                      const p = app.profiles || {};
                      const attended = bilanAttended[app.id];
                      return (
                        <div key={app.id} className="flex flex-col gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center">
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <img
                              src={p.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.full_name || "Marshal")}`}
                              alt=""
                              className="h-10 w-10 rounded-full shrink-0"
                            />
                            <div className="min-w-0">
                              <p className="font-bold text-zinc-900 truncate">{p.full_name}</p>
                              <p className="text-xs text-zinc-500 truncate">{app.post || "Aucun poste assigné"}</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 lg:gap-3">
                            <button
                              onClick={() => setBilanAttended(prev => ({ ...prev, [app.id]: true }))}
                              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${
                                attended === true ? "bg-green-600 text-white" : "border border-zinc-200 bg-white text-zinc-500 hover:border-green-300 hover:text-green-600"
                              }`}
                            >
                              <CheckCircle2 size={14} />
                              Présent
                            </button>
                            <button
                              onClick={() => setBilanAttended(prev => ({ ...prev, [app.id]: false }))}
                              className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-bold transition ${
                                attended === false ? "bg-red-600 text-white" : "border border-zinc-200 bg-white text-zinc-500 hover:border-red-300 hover:text-red-500"
                              }`}
                            >
                              <XCircle size={14} />
                              Absent
                            </button>
                            <input
                              type="text"
                              value={bilanNotes[app.id] ?? ""}
                              onChange={(e) => setBilanNotes(prev => ({ ...prev, [app.id]: e.target.value }))}
                              placeholder="Note..."
                              className="rounded-xl border border-zinc-300 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-[#FF5A1F] w-32 lg:w-48"
                            />
                            <button
                              onClick={() => saveBilan(app.id)}
                              disabled={bilanSaving[app.id] || attended === null}
                              className="rounded-xl bg-[#FF5A1F]/20 px-3 py-2 text-sm font-bold text-[#FF5A1F] transition hover:bg-[#FF5A1F]/30 disabled:opacity-40"
                            >
                              {bilanSaving[app.id] ? "..." : "Enregistrer"}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}
