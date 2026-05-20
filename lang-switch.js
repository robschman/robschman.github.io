/*
 * Beauty Routine — Language Detection & Switcher
 * ================================================
 * - Liest gespeicherte Sprache aus localStorage (key: 'routine_lang')
 * - Bei erster Anwesenheit: erkennt aus navigator.language
 *   → de/de-AT/de-CH/de-DE → 'de', alles andere → 'en'
 * - Vergleicht mit der Sprache der aktuellen Seite (<html lang="...">)
 *   und leitet ggf. auf die passende Übersetzung weiter
 * - Mapping zwischen DE- und EN-Pfaden in PATH_MAP unten
 * - Setzt einen <a>-Link mit der Klasse '.lang-switch-btn'
 *   automatisch auf das richtige Ziel
 *
 * Einbinden in jeder mehrsprachigen HTML-Seite:
 *   <script src="/lang-switch.js" defer></script>
 */

(function () {
  'use strict';

  // Mapping: DE-Pfad ↔ EN-Pfad
  // Jede Seite muss einen Eintrag haben, damit der Switcher das Gegenstück
  // findet. Die Schlüssel sind die Pfade ab dem Hostnamen (inkl. führendem /).
  const PATH_MAP = {
    '/':                                             '/en/',
    '/index.html':                                   '/en/index.html',
    '/about.html':                                   '/en/about.html',
    '/blog/':                                        '/en/blog/',
    '/blog/index.html':                              '/en/blog/index.html',
    '/blog/skincare-reihenfolge.html':               '/en/blog/skincare-order.html',
    '/blog/morgenroutine-abendroutine.html':         '/en/blog/morning-vs-evening.html',
    '/blog/sonnencreme-richtig.html':                '/en/blog/sunscreen-daily.html',
    '/blog/akne-was-hilft.html':                     '/en/blog/acne-what-works.html',
    '/blog/anti-aging-grundlagen.html':              '/en/blog/anti-aging-basics.html',
  };

  // Reverse-Lookup: EN → DE
  const REVERSE_MAP = {};
  for (const k in PATH_MAP) REVERSE_MAP[PATH_MAP[k]] = k;

  function getStoredLang() {
    try { return localStorage.getItem('routine_lang'); }
    catch (e) { return null; }
  }
  function setStoredLang(lang) {
    try { localStorage.setItem('routine_lang', lang); } catch (e) {}
  }

  function detectBrowserLang() {
    const nav = (navigator.language || navigator.userLanguage || 'en')
      .toLowerCase();
    // Deutsch: de, de-AT, de-CH, de-DE, de-LU, de-LI
    return nav.startsWith('de') ? 'de' : 'en';
  }

  function getPageLang() {
    const html = document.documentElement;
    const lang = (html.getAttribute('lang') || 'de').toLowerCase();
    return lang.startsWith('de') ? 'de' : 'en';
  }

  function normalizePath(path) {
    // / → /
    // /blog → /blog/  (Trailing-Slash für Verzeichnisse)
    if (path.endsWith('/index.html')) {
      path = path.replace(/index\.html$/, '');
    }
    return path;
  }

  function getCounterpartPath() {
    const path = normalizePath(window.location.pathname);
    // Suche zuerst direkten Treffer
    if (PATH_MAP[path]) return PATH_MAP[path];
    if (REVERSE_MAP[path]) return REVERSE_MAP[path];
    // Mit /index.html-Suffix probieren
    const withIndex = path.endsWith('/') ? path + 'index.html' : path;
    if (PATH_MAP[withIndex]) return PATH_MAP[withIndex];
    if (REVERSE_MAP[withIndex]) return REVERSE_MAP[withIndex];
    return null;
  }

  // ─── Auto-Redirect beim ersten Aufruf ─────────────────────────
  function maybeAutoRedirect() {
    const pageLang = getPageLang();
    let storedLang = getStoredLang();
    // Wenn noch keine Sprache gespeichert: Browser-Sprache übernehmen
    if (!storedLang) {
      storedLang = detectBrowserLang();
      setStoredLang(storedLang);
    }
    // Sprachen stimmen überein → nichts tun
    if (storedLang === pageLang) return;
    // Sprachen unterschiedlich → auf das Gegenstück umleiten
    const counterpart = getCounterpartPath();
    if (counterpart && counterpart !== window.location.pathname) {
      window.location.replace(counterpart + window.location.search + window.location.hash);
    }
  }

  // ─── Sprach-Schalter (Flag-Buttons) initialisieren ─────────────
  function initSwitcher() {
    // Erwartet einen Container mit class="lang-switch" und zwei
    // Buttons darin mit data-target-lang="de" und data-target-lang="en"
    const buttons = document.querySelectorAll('.lang-switch [data-target-lang]');
    if (!buttons.length) return;
    const pageLang = getPageLang();
    const counterpart = getCounterpartPath();
    buttons.forEach(btn => {
      const target = btn.getAttribute('data-target-lang');
      if (target === pageLang) {
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'true');
      }
      btn.addEventListener('click', e => {
        e.preventDefault();
        setStoredLang(target);
        if (target === pageLang) return; // schon hier
        if (counterpart) {
          window.location.href = counterpart;
        }
      });
    });
  }

  // ─── Start ────────────────────────────────────────────────────
  // Auto-Redirect MUSS so früh wie möglich laufen, damit der Nutzer
  // nicht erst die falsche Sprache aufblitzen sieht.
  maybeAutoRedirect();

  // Switcher-Initialisierung nach DOM-Ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSwitcher);
  } else {
    initSwitcher();
  }
})();
