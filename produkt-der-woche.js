// ════════════════════════════════════════════════════════════════════════
//  PRODUKT DER WOCHE  —  laeuft nur noch JEDE ZWEITE WOCHE
//  (Regel ab 09.09.2026: nicht mehr jede Woche ein Produkt, sondern nur in
//   Woche 1 und Woche 3 eines Blocks. In Woche 2 und 4 ist der Knopf bewusst aus.)
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
  // Geplant am 29.09.2026 (Robert: jede zweite Woche; Cicaplast nach hinten, weil Amazon
  // am 29.09. nicht selbst verkaufte und „Hoher Preis“ anzeigte).
  // ── Woche 4 (29.09.-04.10.): bewusst KEIN Produkt (jede zweite Woche) ──
  // ── Woche 1 (06.-11.10.) ──────────────────────────────
  {
    name:      "Jean & Len Body Butter",
    asin:      "B0DS2V2N7B",
    foto:      "/picks/foto-koerperbutter.jpg",
    text:      { de: "Kalt drau\u00dfen? Reichhaltige K\u00f6rperbutter f\u00fcr Beine und Arme \ud83e\udde1", en: "Cold outside? Rich body butter for legs and arms \ud83e\udde1" },
    startetAm: "2026-10-06T22:00:00",   // Di 22:00
    endetAm:   "2026-10-11T22:00:00"    // So 22:00
  },
  // ── Woche 2 (13.-18.10.): bewusst KEIN Produkt ────────────
  // ── Woche 3 (20.-25.10.) ──────────────────────────────
  {
    name:      "Mixa Ceramide Moisture Creme",
    asin:      "B0BCLKDL4S",
    foto:      "/picks/foto-ceramid.jpg",
    text:      { de: "K\u00e4ltere Tage? Ceramide f\u00fcr die Hautbarriere \ud83e\udd0d", en: "Colder days? Ceramides for your skin barrier \ud83e\udd0d" },
    startetAm: "2026-10-20T22:00:00",   // Di 22:00
    endetAm:   "2026-10-25T22:00:00"    // So 22:00
  },
  // ── Woche 4 (27.10.-01.11.): bewusst KEIN Produkt ─────────
  // ── Woche 1 des nächsten Blocks (03.-08.11.) ──────────
  //    Am Mo 02.11. bei Amazon neu prüfen: am 29.09. keine Buy Box und „Hoher Preis“.
  //    Ist das noch so, diesen Eintrag durch ein anderes Produkt ersetzen.
  {
    name:      "La Roche-Posay Cicaplast Baume B5+",
    asin:      "B00ST2GSRK",
    foto:      "/picks/foto-cicaplast.jpg",
    text:      { de: "Herbstwind und Heizungsluft? Panthenol-Balsam f\u00fcr gestresste Haut \ud83c\udf42", en: "Autumn wind and dry heating air? Panthenol balm for stressed skin \ud83c\udf42" },
    startetAm: "2026-11-03T22:00:00",   // Di 22:00
    endetAm:   "2026-11-08T22:00:00"    // So 22:00
  }
  // ── danach (ab 10.11.): nächsten Block planen – die Aufgaben-Tafel erinnert ──
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
