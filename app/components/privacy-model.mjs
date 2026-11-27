export const COOKIE_NAME = 'afl_stats_v1';
const hosts = new Set(['affarsleads.se', 'www.affarsleads.se']);
const paths = new Set(['/', '/index.html', '/integritet.html']);
export function readChoice(document) {
  try {
    const entry = document.cookie.split(';').map(part => part.trim()).find(part => part.startsWith(`${COOKIE_NAME}=`));
    const choice = entry?.slice(COOKIE_NAME.length + 1);
    return choice === 'yes' || choice === 'no' ? choice : null;
  } catch {return null;}
}
export function rememberChoice(document, choice) {
  try {document.cookie = `${COOKIE_NAME}=${choice}; Max-Age=15552000; Path=/; SameSite=Lax; Secure`;} catch {}
  // React state keeps this choice even if browser storage is unavailable.
  return choice;
}
export function isPublicPage(location) {
  return location.protocol === 'https:' && hosts.has(location.hostname) && paths.has(location.pathname);
}
export function privacyBlocked(navigator) {
  return navigator.globalPrivacyControl === true || navigator.doNotTrack === '1';
}
export function filterPageview(event, permitted) {
  if (!permitted || event.type !== 'pageview') return null;
  try {
    const url = new URL(event.url);
    if (!isPublicPage(url)) return null;
    url.search = ''; url.hash = '';
    return {...event, url: url.toString()};
  } catch {return null;}
}
