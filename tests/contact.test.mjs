import test from 'node:test';
import assert from 'node:assert/strict';
import handler from '../server/contact-handler.mjs';

let serial=0;
const valid={name:'Testperson',company:'Testföretag',email:'test@example.test',message:'En förfrågan som enbart används i test.',requestId:'00000000-0000-4000-8000-000000000001',package:'Bas',website:''};
async function request(body=valid, headers={}, method='POST') {
  const result={headers:{}};
  const res={setHeader(k,v){result.headers[k]=v;},status(s){result.status=s;return this;},json(b){result.body=b;return this;}};
  await handler({method,headers:{origin:'https://affarsleads.se','content-type':'application/json','x-forwarded-for':`192.0.2.${++serial}`,...headers},body},res);
  return result;
}

test('contact endpoint confirms success only after receiving a saved record receipt',async()=>{
  const originalFetch=globalThis.fetch;
  const originalUrl=process.env.SUPABASE_URL;
  const originalKey=process.env.SUPABASE_PUBLISHABLE_KEY;
  const originalError=console.error;
  console.error=()=>{};
  try {
    delete process.env.SUPABASE_URL;
    assert.equal((await request()).status,503);
    process.env.SUPABASE_URL='https://example.invalid';
    process.env.SUPABASE_PUBLISHABLE_KEY='test-token';
    let forwarded;
    globalThis.fetch=async(url,options)=>{
      forwarded=JSON.parse(options.body);
      return {ok:true,json:async()=>({ok:true,requestId:valid.requestId})};
    };
    const success=await request();
    assert.equal(success.status,200);
    assert.equal(success.body.ok,true);
    assert.equal(forwarded.company,'Testföretag');
    assert.ok(forwarded.clientIp);
    assert.equal(forwarded.source,undefined);
    assert.equal(forwarded.website,undefined);
    assert.equal((await request({...valid,email:'invalid'})).status,400);
    assert.equal((await request({...valid,message:'   '})).status,400);
    assert.equal((await request({...valid,website:'spam.example'})).status,400);
    assert.equal((await request({...valid,package:'unknown'})).status,400);
    assert.equal((await request(valid,{origin:'https://other.example'})).status,403);
    assert.equal((await request(valid,{'content-type':'text/plain'})).status,415);
    assert.equal((await request(valid,{'content-length':'50000'})).status,413);
    assert.equal((await request('{not json}')).status,400);
    assert.equal((await request(valid,{},'GET')).status,405);
    globalThis.fetch=async()=>({ok:false,status:500});
    const rejected=await request();
    assert.equal(rejected.status,502);
    assert.equal(rejected.body.ok,false);
    globalThis.fetch=async()=>({ok:true,json:async()=>({accepted:true})});
    assert.equal((await request()).status,502);
    globalThis.fetch=async()=>({ok:true,json:async()=>({ok:true,requestId:'different'})});
    assert.equal((await request()).status,502);
    globalThis.fetch=async()=>({ok:false,status:429});
    assert.equal((await request()).status,429);
    globalThis.fetch=async()=>{throw new Error('network failure');};
    assert.equal((await request()).status,502);
    globalThis.fetch=async()=>({ok:true,json:async()=>({ok:true,requestId:valid.requestId})});
    const fixedIp={'x-forwarded-for':'198.51.100.1'};
    for(let i=0;i<5;i++) assert.equal((await request(valid,fixedIp)).status,200);
    assert.equal((await request(valid,fixedIp)).status,429);
  } finally {
    globalThis.fetch=originalFetch;
    console.error=originalError;
    if(originalUrl===undefined)delete process.env.SUPABASE_URL;
    else process.env.SUPABASE_URL=originalUrl;
    if(originalKey===undefined)delete process.env.SUPABASE_PUBLISHABLE_KEY;
    else process.env.SUPABASE_PUBLISHABLE_KEY=originalKey;
  }
});
