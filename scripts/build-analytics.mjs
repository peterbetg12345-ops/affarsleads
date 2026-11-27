import {mkdir, readFile, writeFile} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

const root = new URL('../', import.meta.url);
const destination = new URL('assets/vercel-analytics.mjs', root);
const sdk = await readFile(fileURLToPath(import.meta.resolve('@vercel/analytics')), 'utf8');
const configuration = {};
const origins = new Set(['https://affarsleads.se', 'https://www.affarsleads.se', 'https://va.vercel-scripts.com', 'https://vitals.vercel-insights.com']);
const raw = process.env.VERCEL_OBSERVABILITY_CLIENT_CONFIG;
if (raw) {
  const analytics = JSON.parse(raw).analytics;
  if (analytics && typeof analytics === 'object') {
    for (const key of ['scriptSrc', 'viewEndpoint', 'eventEndpoint', 'sessionEndpoint']) {
      const value = analytics[key];
      if (value === undefined) continue;
      if (typeof value !== 'string' || /[\r\n]/.test(value)) throw new Error(`Invalid analytics setting: ${key}`);
      const url = new URL(value, 'https://affarsleads.se/');
      console.log(`Analytics intake ${key}: ${url.origin}${url.pathname}`);
      if (!origins.has(url.origin) || url.username || url.password) throw new Error(`Unexpected analytics origin: ${url.origin}`);
      configuration[key] = url.origin === 'https://affarsleads.se' ? url.pathname + url.search : url.href;
    }
  }
}
// Publish only public intake paths, never unrelated build environment data.
const publicConfig = JSON.stringify({analytics: configuration});
const license = await readFile(new URL('node_modules/@vercel/analytics/LICENSE', root), 'utf8');
await mkdir(new URL('assets/', root), {recursive: true});
await writeFile(destination, `/* @vercel/analytics, MIT license: /assets/vercel-analytics-LICENSE.txt */\n${sdk.replace(/^\/\/# sourceMappingURL=.*$/gm, '')}\nexport const analyticsConfiguration = ${JSON.stringify(publicConfig)};\n`);
await writeFile(new URL('assets/vercel-analytics-LICENSE.txt', root), license);
console.log(`Vercel Analytics built: ${Object.keys(configuration).length ? 'deployment intake configuration' : 'standard same-origin intake'}`);
