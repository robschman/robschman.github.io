// ════════════════════════════════════════════════════════════════════════
//  PRODUKT DER WOCHE  —  hier wöchentlich (Dienstag) das neue Produkt eintragen
// ════════════════════════════════════════════════════════════════════════
//  So wechselst du (dauert ~1 Minute):
//    name    = Produktname (Marke), z.B. "Sommersprossen-Stift"
//    asin    = die Amazon-Nummer (aus SiteStripe / deinem Storefront-Bauplan), z.B. "B09PRQRNLP"
//    foto    = Bilddatei im Ordner /picks/  (z.B. "/picks/foto-sommersprossen.jpg")
//    text    = ein kurzer Satz, deutsch (de) + englisch (en). KEIN Heilversprechen.
//    endetAm = wann die Uhr abläuft = Sonntag 22:00. Format: "JAHR-MONAT-TAGT22:00:00"
//              (immer der KOMMENDE Sonntag, z.B. "2026-07-12T22:00:00")
//    aktiv   = true  → Button wird angezeigt
//              false → Button komplett aus (z.B. in der Pause Mo/Di, bis du das neue setzt)
//
//  Läuft die Uhr ab (Sonntag 22:00) ODER aktiv=false, verschwindet der Button
//  automatisch von selbst — kein abgelaufenes Produkt bleibt stehen.
// ════════════════════════════════════════════════════════════════════════
window.PRODUKT_DER_WOCHE = {
  aktiv:   true,
  name:    "Sommersprossen-Stift",
  asin:    "B09PRQRNLP",
  foto:    "/picks/foto-sommersprossen.jpg",
  text:    { de: "Natürliche Sommersprossen in Sekunden 🤎", en: "Natural freckles in seconds 🤎" },
  endetAm: "2026-07-12T22:00:00"   // Sonntag 22:00 Uhr (Wiener Zeit)
};
