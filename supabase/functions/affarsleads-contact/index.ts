// Modern API keys are checked below; deploy with verify_jwt=false.
// Neither Supabase credential is sent to the visitor's browser.
const json = (status: number, body: unknown) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
});

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return json(405, { ok: false });
  let key: string | undefined, serviceKey: string | undefined;
  try {
    key = JSON.parse(Deno.env.get('SUPABASE_PUBLISHABLE_KEYS') || '{}').default;
    serviceKey = JSON.parse(Deno.env.get('SUPABASE_SECRET_KEYS') || '{}').default;
  } catch {
    return json(503, { ok: false });
  }
  const url = Deno.env.get('SUPABASE_URL');
  if (!key || !serviceKey || !url) return json(503, { ok: false });
  // A publishable key is an API gate, not visitor authentication. The only
  // operation offered is a validated, rate-limited contact submission.
  if (req.headers.get('apikey') !== key) return json(401, { ok: false });
  if (!req.headers.get('Content-Type')?.toLowerCase().startsWith('application/json')) return json(415, { ok: false });
  try {
    const text = await req.text();
    if (new TextEncoder().encode(text).length > 12000) return json(413, { ok: false });
    const input = JSON.parse(text);
    if (input.action === 'claimNotifications' || input.action === 'completeNotification') {
      const token = req.headers.get('x-notification-token') || '';
      const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(token));
      const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
      if (hash !== '38dc14e86379bf0b029a853533d8e8f02f90efb2af5b3ab316952ad732c2270c') return json(401, {ok:false});
      const claiming = input.action === 'claimNotifications';
      if (!claiming && (!/^[a-f0-9-]{36}$/.test(input.requestId || '') || !/^[a-f0-9-]{36}$/.test(input.leaseId || '') || typeof input.delivered !== 'boolean')) return json(400,{ok:false});
      const result = await fetch(url + '/rest/v1/rpc/' + (claiming ? 'claim_affarsleads_notifications' : 'complete_affarsleads_notification'), {
        method:'POST', headers:{'Content-Type':'application/json','apikey':serviceKey},
        body:JSON.stringify(claiming ? {batch_size:Math.max(1,Math.min(Number(input.limit)||1,10))} : {request_uuid:input.requestId,lease_uuid:input.leaseId,delivered:input.delivered,result_code:String(input.resultCode||'').slice(0,254)}),
        signal:AbortSignal.timeout(10000)
      });
      if (!result.ok) return json(502,{ok:false});
      const value=await result.json();
      return claiming ? json(200,{ok:true,jobs:value}) : json(value===true?200:409,{ok:value===true});
    }
    for (const field of ['name', 'company', 'email', 'message', 'requestId', 'clientIp']) {
      if (typeof input[field] !== 'string') return json(400, { ok: false });
    }
    input.requestId = input.requestId.toLowerCase();
    const name = input.name.trim(), company = input.company.trim();
    const email = input.email.trim(), message = input.message.trim();
    if (!name || name.length > 120 || !company || company.length > 160
      || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      || message.length < 10 || message.length > 3000
      || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.requestId)
      || !['', 'Bas', 'Tillväxt', 'Premium'].includes(input.package)
      || !input.clientIp || input.clientIp.length > 128) return json(400, { ok: false });
    // Salt the rate-limit identifier; never persist the raw IP address.
    const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`${serviceKey}:${input.clientIp}`));
    const clientHash = Array.from(new Uint8Array(hash), b => b.toString(16).padStart(2, '0')).join('');
    const response = await fetch(`${url}/rest/v1/rpc/submit_affarsleads_enquiry`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': serviceKey },
      body: JSON.stringify({
        payload: { name, company, email, message, requestId: input.requestId, package: input.package },
        client_hash: clientHash
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) return json(502, { ok: false });
    const saved = await response.json();
    if (saved.rateLimited === true) return json(429, { ok: false });
    if (saved.ok !== true || saved.requestId !== input.requestId) return json(502, { ok: false });
    return json(200, { ok: true, requestId: saved.requestId });
  } catch {
    // No enquiry contents or credentials in runtime logs.
    return json(502, { ok: false });
  }
});
