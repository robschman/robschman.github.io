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
  // ── Woche 2 (15.-20.09.): bewusst KEIN Produkt ────────────
  //    Neue Regel ab 09.09.2026. Die Nachtcreme stand hier und wurde
  //    entfernt; sie bleibt als Karte in cozy-picks.html erreichbar,
  //    worauf auch der Pinterest-Pin vom 16.09. zeigt.
  // ── Woche 3 des Blocks (22.-27.09.) ───────────────────────
  {
    name:      "Eucerin UreaRepair Plus Handcreme",
    asin:      "B06WWRSFSJ",
    foto:      "/picks/foto-handcreme.jpg",
    text:      { de: "Heizung an, H\u00e4nde rau? 5 % Urea halten die Feuchtigkeit \ud83e\udd0d", en: "Heating on, hands rough? 5% urea locks the moisture in \ud83e\udd0d" },
    startetAm: "2026-09-22T22:00:00",   // Di 22:00
    endetAm:   "2026-09-27T22:00:00"    // So 22:00
  }
  // ── Woche 4 (29.09.-04.10.): bewusst KEIN Produkt ─────────
  //    Neue Regel: nur jede zweite Woche. Knopf ist von selbst aus.
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
