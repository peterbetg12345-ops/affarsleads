'use strict';
(() => {
  // Count public production pages only. No form values or custom events.
  const hosts = new Set(['affarsleads.se', 'www.affarsleads.se']);
  const paths = new Set(['/', '/index.html', '/integritet.html']);
  if (!hosts.has(location.hostname) || !paths.has(location.pathname)
    || navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;

  window.va = window.va || function () {
    (window.vaq = window.vaq || []).push(arguments);
  };
  window.va('beforeSend', event => {
    if (event.type !== 'pageview') return null;
    try {
      const url = new URL(event.url);
      if (!hosts.has(url.hostname) || !paths.has(url.pathname)) return null;
      // Never send query parameters or fragments, including campaign tokens.
      url.search = '';
      url.hash = '';
      return {...event, url: url.toString()};
    } catch {
      return null;
    }
  });
  const script = document.createElement('script');
  script.defer = true;
  script.src = '/_vercel/insights/script.js';
  document.head.appendChild(script);
})();
