// ══════════════════════════════════════════════════════════════
//  DSGVO Cookie Consent – Beauty Routine App
//  Google Consent Mode v2 (Pflicht für EWR-Publisher seit März 2024)
// ══════════════════════════════════════════════════════════════

(function () {
  var CONSENT_KEY = 'bra_cookie_consent'; // bra = beauty routine app

  // ── Google Consent Mode v2: Standardmäßig ALLES ablehnen ──
  // Muss VOR dem Laden von Analytics/AdSense gesetzt werden!
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    'ad_storage':              'denied',
    'analytics_storage':       'denied',
    'ad_user_data':            'denied',
    'ad_personalization':      'denied',
    'functionality_storage':   'denied',
    'personalization_storage': 'denied',
    'security_storage':        'granted',
    'wait_for_update':         500
  });

  // ── Scripts laden ──
  function loadAnalytics() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=G-L1FZJXJSP5';
    document.head.appendChild(s);
    s.onload = function () {
      gtag('js', new Date());
      gtag('config', 'G-L1FZJXJSP5', { 'anonymize_ip': true });
    };
  }

  function loadAdSense() {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4308220666561084';
    s.setAttribute('crossorigin', 'anonymous');
    document.head.appendChild(s);
  }

  // ── Consent Mode v2: Zustimmung updaten ──
  function grantConsent() {
    gtag('consent', 'update', {
      'ad_storage':              'granted',
      'analytics_storage':       'granted',
      'ad_user_data':            'granted',
      'ad_personalization':      'granted',
      'functionality_storage':   'granted',
      'personalization_storage': 'granted'
    });
  }

  function denyConsent() {
    gtag('consent', 'update', {
      'ad_storage':              'denied',
      'analytics_storage':       'denied',
      'ad_user_data':            'denied',
      'ad_personalization':      'denied',
      'functionality_storage':   'denied',
      'personalization_storage': 'denied'
    });
  }

  function applyConsent(val) {
    if (val === 'accepted') {
      grantConsent();
      loadAnalytics();
    } else {
      denyConsent();
    }
  }

  // ── Banner CSS ──
  var css = `
    #bra-cookie-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;
      background: rgba(251,246,240,0.97);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(189,108,10,0.18);
      box-shadow: 0 -8px 40px rgba(64,38,24,0.14);
      padding: 18px 20px;
      font-family: 'Mulish', system-ui, sans-serif;
      animation: braSlideUp 0.4s ease;
    }
    @keyframes braSlideUp {
      from { transform: translateY(100%); opacity: 0; }
      to   { transform: translateY(0);    opacity: 1; }
    }
    #bra-cookie-banner .bra-inner {
      max-width: 900px; margin: 0 auto;
      display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
    }
    #bra-cookie-banner .bra-icon { font-size: 28px; flex-shrink: 0; }
    #bra-cookie-banner .bra-text { flex: 1; min-width: 200px; }
    #bra-cookie-banner .bra-text strong {
      display: block; font-size: 13px; font-weight: 800; color: #3B302A; margin-bottom: 3px;
    }
    #bra-cookie-banner .bra-text p {
      font-size: 11.5px; color: #574B43; line-height: 1.5; margin: 0;
    }
    #bra-cookie-banner .bra-text a {
      color: #BD6C0A; font-weight: 700; text-decoration: underline;
    }
    #bra-cookie-banner .bra-btns {
      display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap;
    }
    #bra-cookie-banner .bra-accept {
      background: linear-gradient(135deg, #EF9320, #BD6C0A);
      color: white; border: none; border-radius: 50px;
      padding: 11px 24px; font-size: 12px; font-weight: 700;
      cursor: pointer; font-family: inherit;
      box-shadow: 0 4px 16px rgba(189,108,10,0.32);
      transition: transform 0.2s;
    }
    #bra-cookie-banner .bra-accept:hover { transform: translateY(-2px); }
    #bra-cookie-banner .bra-decline {
      background: #f5f5f5; color: #555;
      border: 1.5px solid #bbb; border-radius: 50px;
      padding: 11px 20px; font-size: 12px; font-weight: 600;
      cursor: pointer; font-family: inherit;
      transition: border-color 0.2s, color 0.2s;
    }
    #bra-cookie-banner .bra-decline:hover { border-color: #aaa; color: #555; }
    @media (max-width: 600px) {
      #bra-cookie-banner .bra-btns { width: 100%; }
      #bra-cookie-banner .bra-accept,
      #bra-cookie-banner .bra-decline { flex: 1; text-align: center; }
    }
  `;

  function hideBanner(banner) {
    banner.style.animation = 'none';
    banner.style.opacity = '0';
    banner.style.transform = 'translateY(100%)';
    banner.style.transition = 'all 0.3s ease';
    setTimeout(function () { banner.remove(); }, 300);
  }

  // ── Sprache erkennen (App = routine_lang, statische Seiten = html lang / URL) ──
  function braLang() {
    if (location.pathname.indexOf('/app.html') !== -1 || location.pathname.endsWith('/app')) {
      try { return localStorage.getItem('routine_lang') === 'en' ? 'en' : 'de'; } catch (e) { return 'de'; }
    }
    var hl = (document.documentElement.lang || '').toLowerCase();
    if (hl.indexOf('en') === 0 || location.pathname.indexOf('/en/') === 0) return 'en';
    return 'de';
  }
  var BRA_TXT = {
    de: {
      title: 'Diese Website verwendet Cookies',
      body: 'Wir nutzen Google Analytics für anonyme Besucherstatistiken. Der Dienst kann Daten in die USA übertragen (Google LLC, EU-US Data Privacy Framework). Weitere Infos in unserer <a href="/datenschutz.html">Datenschutzerklärung</a>. Ablehnen ist jederzeit möglich.',
      accept: '✓ Alle akzeptieren',
      decline: 'Nur notwendige'
    },
    en: {
      title: 'This website uses cookies',
      body: 'We use Google Analytics for anonymous visitor statistics. The service may transfer data to the USA (Google LLC, EU-US Data Privacy Framework). More info in our <a href="/datenschutz.html">privacy policy</a>. You can decline at any time.',
      accept: '✓ Accept all',
      decline: 'Only necessary'
    }
  };

  // ── Banner HTML ──
  function showBanner() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var txt = BRA_TXT[braLang()];
    var banner = document.createElement('div');
    banner.id = 'bra-cookie-banner';
    banner.innerHTML = `
      <div class="bra-inner">
        <div class="bra-icon">🍪</div>
        <div class="bra-text">
          <strong>${txt.title}</strong>
          <p>${txt.body}</p>
        </div>
        <div class="bra-btns">
          <button class="bra-accept" id="bra-accept-btn">${txt.accept}</button>
          <button class="bra-decline" id="bra-decline-btn">${txt.decline}</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    document.getElementById('bra-accept-btn').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      hideBanner(banner);
      applyConsent('accepted');
    });

    document.getElementById('bra-decline-btn').addEventListener('click', function () {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      hideBanner(banner);
      applyConsent('rejected');
    });
  }

  // ── Widerrufs-Button global verfügbar machen ──
  // Kann auf der Datenschutzseite eingebunden werden
  window.braRevokeConsent = function () {
    localStorage.removeItem(CONSENT_KEY);
    denyConsent();
    // Banner erneut anzeigen
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  };

  // ── Hauptlogik ──
  var saved = localStorage.getItem(CONSENT_KEY);
  if (saved) {
    applyConsent(saved);
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
