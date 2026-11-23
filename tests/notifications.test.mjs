import test from 'node:test';
import assert from 'node:assert/strict';
import {notifyPending,notificationMessage,RECIPIENT} from '../server/notifications.mjs';
import worker from '../api/notifications.mjs';
const job={requestId:'c6151338-c0aa-471e-93e7-9996131b7ce1',leaseId:'c6151338-c0aa-471e-93e7-9996131b7ce2',name:'Testperson',company:'Testföretag\r\nHeader',email:'test@example.test',message:'Testmeddelande med <taggar>.',package:'Bas',receivedAt:'2026-11-23T12:00:00Z',to:'wrong@example.test'};
test('notification delivery has a fixed recipient, reply-to, stored receipt and retry on SMTP failure',async()=>{
 const names=['SUPABASE_URL','SUPABASE_PUBLISHABLE_KEY','NOTIFICATION_TOKEN','SMTP_USER','SMTP_APP_PASSWORD'];
 const originals=Object.fromEntries(names.map(n=>[n,process.env[n]]));const originalFetch=globalThis.fetch,originalError=console.error;
 try{
  Object.assign(process.env,{SUPABASE_URL:'https://example.invalid',SUPABASE_PUBLISHABLE_KEY:'test-key',NOTIFICATION_TOKEN:'test-token',SMTP_USER:'sender@example.test',SMTP_APP_PASSWORD:'test-only'});
  let completions=[],sent=[],closed=false;
  globalThis.fetch=async(url,options)=>{
   assert.equal(options.headers['x-notification-token'],'test-token');
   const b=JSON.parse(options.body);
   if(b.action==='claimNotifications')return Response.json({ok:true,jobs:[job]});
   completions.push(b);return Response.json({ok:true});
  };
  const result=await notifyPending({createTransport:()=>({sendMail:async message=>{sent.push(message);return {accepted:[RECIPIENT],messageId:message.messageId};},close(){closed=true;}})});
  assert.equal(result.sent,1);assert.equal(sent[0].to,'peterbetg12345@gmail.com');assert.equal(sent[0].replyTo.address,job.email);
  assert.equal(/[\r\n]/.test(sent[0].subject),false);assert.equal(closed,true);assert.equal(completions[0].delivered,true);
  assert.equal(notificationMessage(job,'sender@example.test').messageId,sent[0].messageId);
  console.error=()=>{};completions=[];
  const failed=await notifyPending({createTransport:()=>({sendMail:async()=>{throw Object.assign(new Error('temporary SMTP failure'),{code:'ETIMEDOUT'});},close(){}})});
  assert.equal(failed.failed,1);assert.equal(completions[0].delivered,false);assert.equal(completions[0].resultCode,'ETIMEDOUT');
  const response={status(code){this.code=code;return this;},json(body){this.body=body;return this;},setHeader(){}};
  await worker({method:'POST',headers:{authorization:'Bearer wrong'}},response);assert.equal(response.code,401);
 }finally{for(const n of names){if(originals[n]===undefined)delete process.env[n];else process.env[n]=originals[n];}globalThis.fetch=originalFetch;console.error=originalError;}
});
