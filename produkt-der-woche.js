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
//  ▸ Reihenfolge egal. ▸ Für die nächste Runde einfach beide Blöcke updaten.
// ════════════════════════════════════════════════════════════════════════
window.PRODUKTE_DER_WOCHE = [
  // ── Woche 1 ──────────────────────────────────────────────
  {
    name:      "Bioré UV Aqua Rich Watery Essence SPF50",
    asin:      "B01MTDFFQ5",
    foto:      "/picks/foto-biore.jpg",
    text:      { de: "Sonnenschutz ohne Weißfilm \u2013 auch im Herbst \u2600\ufe0f", en: "Sunscreen with no white cast \u2013 in autumn too \u2600\ufe0f" },
    startetAm: "2026-08-25T22:00:00",   // Di 22:00 (Wiener Zeit)
    endetAm:   "2026-08-30T22:00:00"    // So 22:00
  },
  // ── Woche 2 ──────────────────────────────────────────────
  {
    name:      "Beauty of Joseon Glow Deep Serum",
    asin:      "B09DLFCB69",
    foto:      "/picks/foto-glow.jpg",
    text:      { de: "Reisextrakt f\u00fcr den Glow nach dem Sommer \u2728", en: "Rice extract for that after-summer glow \u2728" },
    startetAm: "2026-09-01T22:00:00",   // Di 22:00
    endetAm:   "2026-09-06T22:00:00"    // So 22:00
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
