/* K-Coaching — bandeau de consentement cookies + Google Analytics (GA4)
   Google Analytics n'est chargé QU'APRÈS acceptation (conforme CNIL/RGPD).
   Le choix est mémorisé dans le navigateur (localStorage). */
(function () {
  var GA_ID = "G-H98ELVFMCZ";
  var KEY = "ck_consent";

  function loadGA() {
    if (window.__gaLoaded) return;
    window.__gaLoaded = true;
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { anonymize_ip: true });
  }

  var choice = null;
  try { choice = localStorage.getItem(KEY); } catch (e) {}
  if (choice === "accepted") { loadGA(); return; }
  if (choice === "refused") { return; }

  function save(v) {
    try { localStorage.setItem(KEY, v); } catch (e) {}
    var b = document.getElementById("ck-consent");
    if (b && b.parentNode) b.parentNode.removeChild(b);
  }

  function showBanner() {
    if (document.getElementById("ck-consent")) return;
    var bar = document.createElement("div");
    bar.id = "ck-consent";
    bar.setAttribute("style",
      "position:fixed;left:0;right:0;bottom:0;z-index:9999;background:#18181b;color:#fff;" +
      "padding:16px;font-family:-apple-system,'Segoe UI',Roboto,Arial,sans-serif;box-shadow:0 -4px 20px rgba(0,0,0,.2)");
    bar.innerHTML =
      "<div style=\"max-width:1000px;margin:0 auto;display:flex;flex-wrap:wrap;align-items:center;gap:12px;justify-content:center;text-align:center\">" +
        "<span style=\"font-size:14px;line-height:1.5;flex:1;min-width:240px\">🍪 Ce site utilise des cookies de mesure d'audience (Google Analytics) pour améliorer votre expérience. Vous pouvez accepter ou refuser.</span>" +
        "<span style=\"display:flex;gap:8px;flex-wrap:wrap;justify-content:center\">" +
          "<button id=\"ck-refuse\" style=\"background:transparent;border:1px solid rgba(255,255,255,.4);color:#fff;border-radius:999px;padding:9px 18px;font-weight:700;font-size:13px;cursor:pointer\">Refuser</button>" +
          "<button id=\"ck-accept\" style=\"background:#F18A2B;border:0;color:#fff;border-radius:999px;padding:9px 20px;font-weight:800;font-size:13px;cursor:pointer\">Accepter</button>" +
        "</span>" +
      "</div>";
    document.body.appendChild(bar);
    document.getElementById("ck-accept").onclick = function () { save("accepted"); loadGA(); };
    document.getElementById("ck-refuse").onclick = function () { save("refused"); };
  }

  if (document.body) showBanner();
  else document.addEventListener("DOMContentLoaded", showBanner);
})();
