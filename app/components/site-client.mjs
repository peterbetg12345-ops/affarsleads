export function initSite() {
const controller = new AbortController();
const on = (target, type, listener, options = {}) => target.addEventListener(type, listener, {...options, signal: controller.signal});
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
on(menuButton, 'click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => on(link, 'click', closeMenu));
on(document, 'keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
const form = document.querySelector('#contact-form');
let selectedPackageMessage = '';
document.querySelectorAll('a[data-package]').forEach(link => {
  on(link, 'click', () => {
    const message = form.elements.namedItem('message');
    if (!message.value.trim() || message.value === selectedPackageMessage) {
      selectedPackageMessage = `Vi vill veta mer om ${link.dataset.packageName || link.dataset.package}.\n\nVårt företag och de kunder vi vill nå: `;
      message.value = selectedPackageMessage;
    }
    form.elements.namedItem('package').value = link.dataset.package;
  });
});
document.querySelectorAll('[data-enquiry-form]').forEach(form => {
const status = form.querySelector('[data-form-status]');
const submitButton = form.querySelector('button[type="submit"]');
const defaultButtonText = submitButton.textContent;
let pendingRequestId = null;
let pendingPayload = null;
on(form, 'submit', async event => {
  event.preventDefault();
  if (form.getAttribute('aria-busy') === 'true') return;
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const company = String(data.get('company') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  if (!name || !company || !email || message.length < 10) {
    status.textContent = 'Fyll i alla fält och beskriv kort vilka kunder ni vill nå.';
    return;
  }
  const payload = {name, company, email, message, package:String(data.get('package') || ''), website:String(data.get('website') || '')};
  const payloadKey = JSON.stringify(payload);
  if (!pendingRequestId || pendingPayload !== payloadKey) {
    pendingRequestId = crypto.randomUUID();
    pendingPayload = payloadKey;
  }
  form.setAttribute('aria-busy', 'true');
  submitButton.disabled = true;
  submitButton.textContent = 'Skickar…';
  status.dataset.state = 'pending';
  status.textContent = 'Din förfrågan skickas.';
  try {
    const response = await fetch('/api/contact', {
      method:'POST', headers:{'Content-Type':'application/json'},
      body:JSON.stringify({...payload, requestId:pendingRequestId}),
      signal:AbortSignal.timeout(20000)
    });
    const result = await response.json();
    if (!response.ok || result.ok !== true) throw new Error('Submission failed');
    form.reset();
    pendingRequestId = null;
    pendingPayload = null;
    if (form.id === 'contact-form') selectedPackageMessage = '';
    status.dataset.state = 'success';
    status.textContent = 'Tack! Vi har tagit emot din förfrågan och återkommer till dig.';
  } catch {
    status.dataset.state = 'error';
    status.textContent = 'Det gick inte att bekräfta att förfrågan kom fram. Dina uppgifter finns kvar. Försök igen eller mejla peter@affarsleads.se.';
  } finally {
    form.removeAttribute('aria-busy');
    submitButton.disabled = false;
    submitButton.textContent = defaultButtonText;
  }
});

});

return () => controller.abort();
}
