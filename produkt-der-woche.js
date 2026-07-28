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
    name:      "Mighty Patch Original",
    asin:      "B0C81Z1SQH",
    foto:      "/picks/foto-patch.jpg",
    text:      { de: "Über Nacht auf die Stelle kleben 🩹", en: "Just stick it on overnight 🩹" },
    startetAm: "2026-07-28T22:00:00",   // Di 22:00 (Wiener Zeit)
    endetAm:   "2026-08-02T22:00:00"    // So 22:00
  },
  // ── Woche 2 ──────────────────────────────────────────────
  {
    name:      "Sol de Janeiro Bum Bum Jet Set",
    asin:      "B089R5T26N",
    foto:      "/picks/foto-bodymist.jpg",
    text:      { de: "Sommerduft für unterwegs 🌴", en: "Summer scent to go 🌴" },
    startetAm: "2026-08-04T22:00:00",   // Di 22:00
    endetAm:   "2026-08-09T22:00:00"    // So 22:00
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
