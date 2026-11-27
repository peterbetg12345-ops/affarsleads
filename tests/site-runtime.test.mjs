import test from 'node:test';
import assert from 'node:assert/strict';
import {JSDOM} from 'jsdom';
import {initSite} from '../app/components/site-client.mjs';
import {initCalculator} from '../app/components/calculator-client.mjs';

const origin = process.env.TEST_ORIGIN;
test('Next pages preserve forms, calculator behavior, cleanup and privacy-page navigation', {skip: !origin}, async () => {
  const response = await fetch(origin);
  assert.equal(response.status, 200);
  const markup = await response.text();
  const csp = response.headers.get('content-security-policy');
  const nonce = /'nonce-([^']+)'/.exec(csp)?.[1];
  assert.ok(nonce);
  assert.match(markup, new RegExp(`nonce="${nonce}"`));
  assert.ok(!csp.includes("'unsafe-inline'"));
  assert.ok(markup.includes('/_next/static/'));
  const names = ['window', 'document', 'FormData', 'AbortController'];
  const originals = Object.fromEntries(names.map(n => [n, globalThis[n]]));
  const originalFetch = globalThis.fetch;
  try {
    const dom = new JSDOM(markup, {url: 'https://affarsleads.se/'});
    for (const name of names) globalThis[name] = dom.window[name];
    const cleanSite = initSite();
    const cleanGuide = initCalculator();
    const $ = selector => document.querySelector(selector);
    assert.equal($('.guide-interactive').hidden, false);
    assert.equal($('.guide-fallback').hidden, true);
    $('[data-volume="4000"]').click();
    assert.equal($('#calc-package').textContent, 'Tillväxt');
    assert.match($('#calc-price').textContent, /19\s?990 kr/);
    assert.match($('#calc-setup').textContent, /5\s?000 kr/);
    $('input[value="quarterly"]').click();
    assert.match($('#calc-setup').textContent, /^0 kr/);
    $('[data-volume="10000"]').click();
    assert.equal($('#calc-price').textContent, 'Kontakta oss');
    assert.equal($('#guide-contact-form').elements.namedItem('package').value, '');
    const form = $('#guide-contact-form');
    for (const [name,value] of Object.entries({name:'Peter Test', company:'Test AB', email:'peter@example.test', notes:'Ett tekniskt test utan faktisk sändning'})) form.elements.namedItem(name).value = value;
    let payload;
    globalThis.fetch = async (url, options) => {
      assert.equal(url, '/api/contact');
      payload = JSON.parse(options.body);
      return {ok: true, json: async () => ({ok: true})};
    };
    form.dispatchEvent(new dom.window.Event('submit', {bubbles: true, cancelable: true}));
    await new Promise(resolve => setImmediate(resolve));
    assert.equal(payload.package, '');
    assert.match(payload.message, /10\s?000/);
    assert.match(payload.message, /tekniskt test/);
    assert.equal($('#guide-form-status').dataset.state, 'success');
    const button = $('.menu-toggle');
    button.click(); assert.equal(button.getAttribute('aria-expanded'), 'true');
    cleanGuide(); cleanSite();
    const cleanAgain = initSite();
    button.click(); assert.equal(button.getAttribute('aria-expanded'), 'false');
    cleanAgain(); dom.window.close();

    globalThis.fetch = originalFetch;
    const privacy = await originalFetch(`${origin}/integritet.html`);
    assert.equal(privacy.status, 200);
    const privacyDom = new JSDOM(await privacy.text(), {url: 'https://affarsleads.se/integritet.html'});
    for (const name of names) globalThis[name] = privacyDom.window[name];
    const cleanPrivacy = initSite();
    $('.menu-toggle').click();
    assert.equal($('.menu-toggle').getAttribute('aria-expanded'), 'true');
    cleanPrivacy(); privacyDom.window.close();
  } finally {
    globalThis.fetch = originalFetch;
    for (const name of names) globalThis[name] = originals[name];
  }
});
