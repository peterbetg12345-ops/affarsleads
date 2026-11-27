import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import vm from 'node:vm';
import {execFileSync} from 'node:child_process';

const root = new URL('../', import.meta.url);
const client = await readFile(new URL('analytics.js', root), 'utf8');
const sdk = await readFile(new URL('node_modules/@vercel/analytics/dist/index.mjs', root), 'utf8');
const configuration = JSON.stringify({analytics: {scriptSrc: '/intake/script.js', viewEndpoint: '/intake/view'}});

async function fixture({choice = '', dnt = false, host = 'affarsleads.se'} = {}) {
  const elements = new Map();
  function element(key) {
    if (!elements.has(key)) elements.set(key, {hidden: true, dataset: {}, listeners: {}, setAttribute() {}, focus() {}, addEventListener(type, fn) { this.listeners[type] = fn; }});
    return elements.get(key);
  }
  const yes = element('yes'), no = element('no');
  yes.dataset.analyticsChoice = 'yes'; no.dataset.analyticsChoice = 'no';
  const panel = element('#analytics-consent');
  panel.querySelector = selector => element(selector);
  panel.querySelectorAll = () => [yes, no];
  const scripts = [];
  let cookie = choice ? `afl_stats_v1=${choice}` : '';
  const document = {
    querySelector: element,
    createElement: () => ({dataset: {}}),
    head: {appendChild: script => scripts.push(script), querySelector: () => scripts[0] || null},
    get cookie() { return cookie; },
    set cookie(value) { cookie = value.split(';')[0]; }
  };
  const context = vm.createContext({window: {}, document, navigator: {doNotTrack: dnt ? '1' : '0'}, location: {hostname: host, pathname: '/'}, URL, console});
  let imports = 0;
  const module = new vm.SourceTextModule(`${sdk}\nexport const analyticsConfiguration = ${JSON.stringify(configuration)};`, {context});
  const script = new vm.Script(client, {importModuleDynamically: async () => {
    imports++;
    if (module.status === 'unlinked') await module.link(() => { throw Error('Unexpected dependency'); });
    if (module.status === 'linked') await module.evaluate();
    return module;
  }});
  script.runInContext(context);
  async function settle() { await new Promise(resolve => setImmediate(resolve)); }
  await settle();
  return {context, scripts, imports: () => imports, click: async value => { (value === 'yes' ? yes : no).listeners.click(); await settle(); }, beforeSend: () => context.window.vaq.find(args => args[0] === 'beforeSend')[1]};
}

test('No SDK or tracking script loads before consent or after rejection', async () => {
  const f = await fixture();
  assert.equal(f.imports(), 0);
  await f.click('no');
  assert.equal(f.imports(), 0);
  assert.equal(f.scripts.length, 0);
});

test('Approval loads the official SDK with deployment-specific collection paths', async () => {
  const f = await fixture();
  await f.click('yes');
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].src, '/intake/script.js');
  assert.equal(f.scripts[0].dataset.viewEndpoint, '/intake/view');
  assert.equal(f.scripts[0].dataset.sdkn, '@vercel/analytics');
});

test('Returning approved visitors load once; approving again does not duplicate tracking', async () => {
  const f = await fixture({choice: 'yes'});
  assert.equal(f.scripts.length, 1);
  await f.click('yes');
  assert.equal(f.imports(), 1);
  assert.equal(f.scripts.length, 1);
});

test('Privacy signals and preview hosts prevent tracking', async () => {
  for (const options of [{choice: 'yes', dnt: true}, {choice: 'yes', host: 'affarsleads.vercel.app'}]) {
    const f = await fixture(options);
    assert.equal(f.imports(), 0);
    assert.equal(f.scripts.length, 0);
  }
});

test('Page views strip query strings and fragments; form/custom events are dropped', async () => {
  const f = await fixture({choice: 'yes'});
  const filter = f.beforeSend();
  assert.equal(filter({type: 'pageview', url: 'https://affarsleads.se/?email=private@example.com#token'}).url, 'https://affarsleads.se/');
  assert.equal(filter({type: 'event', url: 'https://affarsleads.se/'}), null);
  assert.equal(filter({type: 'pageview', url: 'https://other.example/'}), null);
  await f.click('no');
  assert.equal(filter({type: 'pageview', url: 'https://affarsleads.se/'}), null);
});

test('Build includes only allowed public paths, never unrelated configuration', async () => {
  const env = {...process.env, VERCEL_OBSERVABILITY_CLIENT_CONFIG: JSON.stringify({analytics: {scriptSrc: '/deployment/script.js', viewEndpoint: '/deployment/view', privateKey: 'DO_NOT_EXPOSE'}, unrelatedSecret: 'DO_NOT_EXPOSE'})};
  execFileSync(process.execPath, ['scripts/build-analytics.mjs'], {cwd: root, env});
  const output = await readFile(new URL('assets/vercel-analytics.mjs', root), 'utf8');
  assert.ok(output.includes('/deployment/script.js'));
  assert.ok(!output.includes('DO_NOT_EXPOSE'));
  assert.throws(() => execFileSync(process.execPath, ['scripts/build-analytics.mjs'], {cwd: root, env: {...env, VERCEL_OBSERVABILITY_CLIENT_CONFIG: '{"analytics":{"scriptSrc":"https://other.example/script.js"}}'}, stdio: 'pipe'}));
  execFileSync(process.execPath, ['scripts/build-analytics.mjs'], {cwd: root, env: {...process.env, VERCEL_OBSERVABILITY_CLIENT_CONFIG: ''}});
});
