import test from 'node:test';
import assert from 'node:assert/strict';

test('Supabase gateway validates, hashes IP and acknowledges only a saved matching request', async () => {
  const originalDeno = globalThis.Deno;
  const originalFetch = globalThis.fetch;
  let handler;
  const env = { SUPABASE_URL: 'https://example.invalid', SUPABASE_PUBLISHABLE_KEYS: JSON.stringify({default:'test-publishable'}), SUPABASE_SECRET_KEYS: JSON.stringify({default:'test-service'}) };
  globalThis.Deno = { env: { get: key => env[key] }, serve: callback => { handler = callback; } };
  try {
    await import('../supabase/functions/affarsleads-contact/index.ts');
    const input = { requestId: '00000000-0000-4000-8000-000000000001', name: 'Testperson', company: 'Testbolag', email: 'test@example.test', message: 'En förfrågan för ett tekniskt test.', package: 'Bas', clientIp: '192.0.2.10' };
    const request = (body = input, token = 'test-publishable', method = 'POST') => handler(new Request('https://example.invalid/contact', {
      method, headers: { apikey: token, 'Content-Type': 'application/json' },
      ...(method === 'POST' ? { body: JSON.stringify(body) } : {})
    }));
    let forwarded;
    globalThis.fetch = async (url, options) => {
      assert.equal(url, 'https://example.invalid/rest/v1/rpc/submit_affarsleads_enquiry');
      assert.equal(options.headers.apikey, 'test-service');
      assert.equal(options.headers.Authorization, undefined);
      forwarded = JSON.parse(options.body);
      return Response.json({ ok: true, requestId: input.requestId });
    };
    const success = await request();
    assert.equal(success.status, 200);
    assert.equal((await success.json()).requestId, input.requestId);
    assert.equal(forwarded.payload.email, input.email);
    assert.match(forwarded.client_hash, /^[a-f0-9]{64}$/);
    assert.equal(JSON.stringify(forwarded).includes(input.clientIp), false);
    assert.equal((await request(input, 'wrong-key')).status, 401);
    assert.equal((await request(input, 'test-publishable', 'GET')).status, 405);
    assert.equal((await request({ ...input, email: 'invalid' })).status, 400);
    assert.equal((await request({ ...input, clientIp: '' })).status, 400);
    assert.equal((await request({ ...input, package: 'unknown' })).status, 400);
    globalThis.fetch = async () => Response.json({ ok: true, requestId: 'different' });
    assert.equal((await request()).status, 502);
    globalThis.fetch = async () => Response.json({ ok: false, rateLimited: true });
    assert.equal((await request()).status, 429);
    globalThis.fetch = async () => new Response('', { status: 503 });
    assert.equal((await request()).status, 502);
    globalThis.fetch = async () => { throw new Error('timeout'); };
    assert.equal((await request()).status, 502);
  } finally {
    globalThis.fetch = originalFetch;
    if (originalDeno === undefined) delete globalThis.Deno;
    else globalThis.Deno = originalDeno;
  }
});
