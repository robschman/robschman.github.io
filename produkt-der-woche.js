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
    name:      "COSRX Snail 96 Essence",
    asin:      "B00PBX3L7K",
    foto:      "/picks/foto-snailmucin.jpg",
    text:      { de: "Der K-Beauty-Klassiker für zarte Haut 🐌", en: "The K-beauty classic for soft skin 🐌" },
    startetAm: "2026-08-11T22:00:00",   // Di 22:00 (Wiener Zeit)
    endetAm:   "2026-08-16T22:00:00"    // So 22:00
  },
  // ── Woche 2 ──────────────────────────────────────────────
  {
    name:      "Laneige Lip Sleeping Mask",
    asin:      "B09HN5CMBX",
    foto:      "/picks/foto-laneige.jpg",
    text:      { de: "Abends auftragen, morgens weiche Lippen 💋", en: "Apply at night, soft lips by morning 💋" },
    startetAm: "2026-08-18T22:00:00",   // Di 22:00
    endetAm:   "2026-08-23T22:00:00"    // So 22:00
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
