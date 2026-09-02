// ════════════════════════════════════════════════════════════════════════
//  PRODUKT DER WOCHE  —  jetzt als 2-WOCHEN-LISTE
//  (alle 2 Wochen am Dienstag beide Produkte für die nächsten 2 Wochen setzen)
// ════════════════════════════════════════════════════════════════════════
//  Jeder Eintrag:
//    name       = Produktname (Marke)
//    asin       = Amazon-Nummer (aus SiteStripe / Storefront-Bauplan)
//    foto       = Bilddatei im Ordner /picks/  (z.B. "/picks/foto-fusspeeling.jpg")
//    text       = kurzer Satz, deutsch (de) + englisch (en). KEIN Heilversprechen.
//    startetAm  = ab wann das Produkt läuft = Dienstag 22:00  "JAHR-MONAT-TAGT22:00:00"
//    endetAm    = bis wann = Sonntag 22:00 derselben Woche
//
//  Die App zeigt automatisch das Produkt, dessen Zeitfenster GERADE läuft.
//  Zwischen Sonntag 22:00 und dem nächsten Dienstag 22:00 (Mo/Di-Pause) sowie
//  nach Ablauf beider Wochen ist der Button von selbst aus — nichts zu tun.
//
//  ▸ Reihenfolge egal. ▸ Für die nächste Runde die abgelaufenen Blöcke
//    überschreiben. Das gerade laufende Produkt NICHT anfassen, sonst
//    verschwindet der Knopf mitten in der Woche.
// ════════════════════════════════════════════════════════════════════════
window.PRODUKTE_DER_WOCHE = [
  // ── laeuft gerade: bis So 06.09. 22:00 ───────────────────────
  {
    name:      "Beauty of Joseon Glow Deep Serum",
    asin:      "B09DLFCB69",
    foto:      "/picks/foto-glow.jpg",
    text:      { de: "Reisextrakt f\u00fcr den Glow nach dem Sommer \u2728", en: "Rice extract for that after-summer glow \u2728" },
    startetAm: "2026-09-01T22:00:00",   // Di 22:00
    endetAm:   "2026-09-06T22:00:00"    // So 22:00
  },
  // ── Woche 3 ──────────────────────────────────────────────
  {
    name:      "Weleda Mandel Reinigungsmilch",
    asin:      "B003CYUS26",
    foto:      "/picks/foto-reinigungsmilch.jpg",
    text:      { de: "Sanfter reinigen, wenn es k\u00fchler wird \ud83c\udf42", en: "Gentler cleansing as it gets cooler \ud83c\udf42" },
    startetAm: "2026-09-08T22:00:00",   // Di 22:00
    endetAm:   "2026-09-13T22:00:00"    // So 22:00
  },
  // ── Woche 4 ──────────────────────────────────────────────
  {
    name:      "Neutrogena Retinol Nachtcreme",
    asin:      "B09V95T26W",
    foto:      "/picks/foto-nachtcreme.jpg",
    text:      { de: "Reichhaltiger f\u00fcr k\u00fchlere N\u00e4chte \ud83c\udf19", en: "Richer care for cooler nights \ud83c\udf19" },
    startetAm: "2026-09-15T22:00:00",   // Di 22:00
    endetAm:   "2026-09-20T22:00:00"    // So 22:00
  }
];

// ── Auswahl-Logik: nimmt das Produkt, dessen Zeitfenster gerade läuft ─────
// (setzt window.PRODUKT_DER_WOCHE genau in der Form, die app.html erwartet —
//  App-Code bleibt unverändert.)
(function () {
  var now = Date.now(), active = null;
  for (var i = 0; i < window.PRODUKTE_DER_WOCHE.length; i++) {
    var p = window.PRODUKTE_DER_WOCHE[i];
    var s = new Date(p.startetAm).getTime();
    var e = new Date(p.endetAm).getTime();
    if (now >= s && now < e) { active = p; break; }
  }
  window.PRODUKT_DER_WOCHE = active
    ? { aktiv: true, name: active.name, asin: active.asin, foto: active.foto, text: active.text, endetAm: active.endetAm }
    : { aktiv: false };
})();
