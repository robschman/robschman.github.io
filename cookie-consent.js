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
      loadAdSense();
    } else {
      denyConsent();
    }
  }

  // ── Banner CSS ──
  var css = `
    #bra-cookie-banner {
      position: fixed; bottom: 0; left: 0; right: 0; z-index: 99999;
      background: rgba(255,255,255,0.97);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border-top: 1px solid rgba(233,30,140,0.15);
      box-shadow: 0 -8px 40px rgba(180,100,200,0.15);
      padding: 18px 20px;
      font-family: 'Poppins', system-ui, sans-serif;
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
      display: block; font-size: 13px; font-weight: 800; color: #333; margin-bottom: 3px;
    }
    #bra-cookie-banner .bra-text p {
      font-size: 11.5px; color: #666; line-height: 1.5; margin: 0;
    }
    #bra-cookie-banner .bra-text a {
      color: #e91e8c; font-weight: 600; text-decoration: underline;
    }
    #bra-cookie-banner .bra-btns {
      display: flex; gap: 10px; flex-shrink: 0; flex-wrap: wrap;
    }
    #bra-cookie-banner .bra-accept {
      background: linear-gradient(135deg, #e91e8c, #9c27b0);
      color: white; border: none; border-radius: 50px;
      padding: 11px 24px; font-size: 12px; font-weight: 700;
      cursor: pointer; font-family: inherit;
      box-shadow: 0 4px 16px rgba(233,30,140,0.3);
      transition: transform 0.2s;
    }
    #bra-cookie-banner .bra-accept:hover { transform: translateY(-2px); }
    #bra-cookie-banner .bra-decline {
      background: transparent; color: #999;
      border: 1.5px solid #ddd; border-radius: 50px;
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

  // ── Banner HTML ──
  function showBanner() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var banner = document.createElement('div');
    banner.id = 'bra-cookie-banner';
    banner.innerHTML = `
      <div class="bra-inner">
        <div class="bra-icon">🍪</div>
        <div class="bra-text">
          <strong>Diese Website verwendet Cookies</strong>
          <p>Wir nutzen Google Analytics (Besucherstatistiken) und Google AdSense (Werbung).
          Diese Dienste setzen Cookies und können Daten in die USA übertragen (Google LLC, Data Privacy Framework).
          Weitere Infos in unserer <a href="/datenschutz.html">Datenschutzerklärung</a>.
          Ablehnen ist jederzeit möglich.</p>
        </div>
        <div class="bra-btns">
          <button class="bra-accept" id="bra-accept-btn">✓ Alle akzeptieren</button>
          <button class="bra-decline" id="bra-decline-btn">Nur notwendige</button>
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
