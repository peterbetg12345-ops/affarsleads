const attempts = new Map();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUEST_BYTES = 12000;

function reply(res, status, body) {
  res.setHeader('Cache-Control', 'no-store');
  return res.status(status).json(body);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return reply(res, 405, {ok:false});
  }
  const allowed = new Set(['https://affarsleads.se', 'https://www.affarsleads.se']);
  if (process.env.VERCEL_URL) allowed.add(`https://${process.env.VERCEL_URL}`);
  if (!allowed.has(req.headers.origin)) return reply(res, 403, {ok:false});
  if (!String(req.headers['content-type'] || '').toLowerCase().startsWith('application/json')) {
    return reply(res, 415, {ok:false});
  }
  if (Number(req.headers['content-length']) > MAX_REQUEST_BYTES) return reply(res, 413, {ok:false});
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error('Invalid body');
    if (Buffer.byteLength(JSON.stringify(body), 'utf8') > MAX_REQUEST_BYTES) return reply(res, 413, {ok:false});
  } catch {
    return reply(res, 400, {ok:false});
  }
  for (const field of ['name','company','email','message','requestId']) {
    if (typeof body[field] !== 'string') return reply(res, 400, {ok:false});
  }
  const name=body.name.trim(), company=body.company.trim(), email=body.email.trim(), message=body.message.trim();
  const requestId=body.requestId.toLowerCase();
  const selectedPackage=typeof body.package === 'string' ? body.package : '';
  if (!name || name.length>120 || !company || company.length>160 || email.length>254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    || message.length<10 || message.length>3000 || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(requestId)
    || !['','Bas','Tillväxt','Premium'].includes(selectedPackage) || (body.website && String(body.website).trim())) {
    return reply(res, 400, {ok:false});
  }
  const now=Date.now();
  for (const [key,value] of attempts) if (now-value.start>WINDOW_MS) attempts.delete(key);
  const ip=String(req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown').split(',')[0].trim();
  const current=attempts.get(ip) || {start:now,count:0};
  if (current.count>=5 || attempts.size>10000) {
    res.setHeader('Retry-After', '600');
    return reply(res, 429, {ok:false});
  }
  const supabaseUrl=process.env.SUPABASE_URL;
  const supabaseKey=process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !supabaseKey) return reply(res, 503, {ok:false});
  current.count+=1;
  attempts.set(ip,current);
  try {
    const response=await fetch(`${supabaseUrl.replace(/\/$/, '')}/functions/v1/affarsleads-contact`, {
      method:'POST',headers:{'Content-Type':'application/json','apikey':supabaseKey},redirect:'error',
      body:JSON.stringify({requestId,name,company,email,message,package:selectedPackage,clientIp:ip}),
      signal:AbortSignal.timeout(15000)
    });
    if (response.status===429) {
      res.setHeader('Retry-After','600');
      return reply(res,429,{ok:false});
    }
    if (!response.ok) throw new Error('Storage rejected');
    const saved=await response.json();
    if (saved.ok!==true || saved.requestId!==requestId) throw new Error('No storage receipt');
    return reply(res, 200, {ok:true,requestId});
  } catch {
    console.error('Contact storage could not be confirmed', requestId);
    return reply(res, 502, {ok:false});
  }
}
