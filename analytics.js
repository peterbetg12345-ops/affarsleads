'use strict';
(() => {
  const hosts = new Set(['affarsleads.se', 'www.affarsleads.se']);
  const paths = new Set(['/', '/index.html', '/integritet.html']);
  const panel = document.querySelector('#analytics-consent');
  const settings = document.querySelector('[data-analytics-settings]');
  if (!panel || !settings || !hosts.has(location.hostname) || !paths.has(location.pathname)) return;
  const cookieName = 'afl_stats_v1';
  const blocked = navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
  let analytics = null;
  let loading = false;
  let returnFocus = false;
  let transientChoice = null;
  function savedChoice() {
    try {
      const entry = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(cookieName + '='));
      const value = entry ? entry.slice(cookieName.length + 1) : '';
      return value === 'yes' || value === 'no' ? value : '';
    } catch { return ''; }
  }
  function choice() { return transientChoice ?? savedChoice(); }
  function rememberChoice(value) {
    try {
      document.cookie = cookieName + '=' + value + '; Max-Age=15552000; Path=/; SameSite=Lax; Secure';
      transientChoice = savedChoice() === value ? null : value;
    } catch {
      // Honor this explicit choice for the current page, then ask again next visit.
      transientChoice = value;
    }
  }
  function permitted() { return choice() === 'yes' && !blocked; }
  function beforeSend(event) {
    if (!permitted() || event.type !== 'pageview') return null;
    try {
      const url = new URL(event.url);
      if (url.protocol !== 'https:' || !hosts.has(url.hostname) || !paths.has(url.pathname)) return null;
      url.search = '';
      url.hash = '';
      return {...event, url: url.toString()};
    } catch { return null; }
  }
  function loadAnalytics() {
    if (!permitted() || loading) return;
    if (analytics) {
      analytics.pageview({path: location.pathname});
      return;
    }
    loading = true;
    import('/assets/vercel-analytics.mjs').then(module => {
      loading = false;
      if (!permitted()) return;
      module.inject({mode: 'production', beforeSend}, module.analyticsConfiguration);
      analytics = module;
    }).catch(error => {
      loading = false;
      console.error('[Affärsleads] Besöksstatistiken kunde inte laddas.', error);
    });
  }
  function show() {
    panel.hidden = false;
    settings.setAttribute('aria-expanded', 'true');
  }
  function hide() {
    panel.hidden = true;
    settings.setAttribute('aria-expanded', 'false');
    if (returnFocus) { settings.focus(); returnFocus = false; }
  }
  settings.hidden = false;
  panel.querySelector('[data-analytics-browser-choice]').hidden = !blocked;
  settings.addEventListener('click', () => {
    returnFocus = true;
    show();
    panel.querySelector('[data-analytics-choice]').focus();
  });
  panel.querySelectorAll('[data-analytics-choice]').forEach(button => {
    button.addEventListener('click', () => {
      const wasPermitted = permitted();
      const value = button.dataset.analyticsChoice === 'yes' ? 'yes' : 'no';
      rememberChoice(value);
      hide();
      if (value === 'yes' && (!wasPermitted || !analytics)) loadAnalytics();
    });
  });
  if (choice()) { hide(); loadAnalytics(); }
  else show();
})();
