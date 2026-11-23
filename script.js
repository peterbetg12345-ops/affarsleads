'use strict';
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('#navigation');
function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  navigation.classList.toggle('is-open', open);
});
navigation.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});
document.querySelector('#year').textContent = String(new Date().getFullYear());
const form = document.querySelector('#contact-form');
const fallback = document.querySelector('#email-fallback');
const copyText = document.querySelector('#request-copy');
const status = document.querySelector('#form-status');
let selectedPackageMessage = '';
document.querySelectorAll('[data-package]').forEach(link => {
  link.addEventListener('click', () => {
    const message = form.elements.namedItem('message');
    if (!message.value.trim() || message.value === selectedPackageMessage) {
      selectedPackageMessage = `Vi vill veta mer om ${link.dataset.package}.\n\nVårt företag och de kunder vi vill nå: `;
      message.value = selectedPackageMessage;
    }
  });
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(form);
  const name = String(data.get('name') || '').trim();
  const company = String(data.get('company') || '').trim();
  const email = String(data.get('email') || '').trim();
  const message = String(data.get('message') || '').trim();
  if (!name || !company || !email || message.length < 10) {
    status.textContent = 'Fyll i alla fält och beskriv kort vilka kunder ni vill nå.';
    return;
  }
  const subject = `Förfrågan från ${company}`;
  const body = `Hej Peter!\n\n${message}\n\nNamn: ${name}\nFöretag: ${company}\nE-post: ${email}`;
  copyText.value = `Till: peter@affarsleads.se\nÄmne: ${subject}\n\n${body}`;
  fallback.hidden = false;
  status.textContent = 'Förfrågan är förberedd. Skicka mejlet i ditt e-postprogram för att kontakta Peter.';
  window.location.href = `mailto:peter@affarsleads.se?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
document.querySelector('#copy-request').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText(copyText.value);
    status.textContent = 'Förfrågan är kopierad. Klistra in den i ditt e-postprogram och skicka till Peter.';
  } catch {
    copyText.focus();
    copyText.select();
    status.textContent = 'Markera och kopiera texten i fältet nedan.';
  }
});
