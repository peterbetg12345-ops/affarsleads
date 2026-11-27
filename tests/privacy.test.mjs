import test from 'node:test';
import assert from 'node:assert/strict';
import {readChoice, rememberChoice, privacyBlocked, filterPageview} from '../app/components/privacy-model.mjs';

test('existing choices persist and unavailable cookies do not prevent an explicit choice', () => {
  assert.equal(readChoice({cookie: 'other=1; afl_stats_v1=yes'}), 'yes');
  assert.equal(readChoice({cookie: 'afl_stats_v1=invalid'}), null);
  const unavailable = {get cookie() {throw Error('denied');}, set cookie(_) {throw Error('denied');}};
  assert.equal(readChoice(unavailable), null);
  assert.equal(rememberChoice(unavailable, 'yes'), 'yes');
  assert.equal(rememberChoice(unavailable, 'no'), 'no');
  const document = {cookie: ''};
  rememberChoice(document, 'yes');
  assert.match(document.cookie, /Max-Age=15552000; Path=\/; SameSite=Lax; Secure/);
});

test('privacy signals block analytics and pageview filtering strips personal URL content', () => {
  assert.equal(privacyBlocked({globalPrivacyControl: true}), true);
  assert.equal(privacyBlocked({doNotTrack: '1'}), true);
  assert.equal(privacyBlocked({doNotTrack: '0'}), false);
  const event = {type: 'pageview', url: 'https://affarsleads.se/?email=private@example.test#kontakt'};
  assert.equal(filterPageview(event, false), null);
  assert.equal(filterPageview(event, true).url, 'https://affarsleads.se/');
  for (const url of ['https://preview.vercel.app/', 'https://affarsleads.se/api/contact', 'http://affarsleads.se/', 'invalid']) {
    assert.equal(filterPageview({...event, url}, true), null);
  }
  assert.equal(filterPageview({type: 'event', url: event.url}, true), null);
});
