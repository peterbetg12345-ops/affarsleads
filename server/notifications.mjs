import nodemailer from 'nodemailer';

export const RECIPIENT = 'peterbetg12345@gmail.com';

export function notificationMessage(job, sender) {
  return {
    from: {name:'Affärsleads',address:sender},
    to: RECIPIENT,
    replyTo: {name:job.name,address:job.email},
    subject: `Ny förfrågan – ${job.company.replace(/[\r\n]/g,' ').slice(0,160)}`,
    messageId: `<affarsleads-${job.requestId}@affarsleads.se>`,
    text: `Ny förfrågan från affarsleads.se\n\nNamn: ${job.name}\nFöretag: ${job.company}\nE-post: ${job.email}\nPaket: ${job.package || 'Ej valt'}\nMottagen: ${job.receivedAt}\n\n${job.message}\n\nReferens: ${job.requestId}\n\nSvara på detta mejl för att kontakta kunden.`
  };
}

export async function notifyPending({limit=1, createTransport=nodemailer.createTransport}={}) {
  const {SUPABASE_URL:url,SUPABASE_PUBLISHABLE_KEY:key,NOTIFICATION_TOKEN:token,SMTP_USER:user,SMTP_APP_PASSWORD:password}=process.env;
  if (!url || !key || !token || !user || !password) return {configured:false,sent:0};
  const call=async body=>{
    const response=await fetch(`${url}/functions/v1/affarsleads-contact`,{
      method:'POST',headers:{'Content-Type':'application/json',apikey:key,'x-notification-token':token},
      body:JSON.stringify(body),signal:AbortSignal.timeout(10000)
    });
    if(!response.ok)throw new Error('Notification queue unavailable');
    const result=await response.json();
    if(result.ok!==true)throw new Error('Notification queue rejected');
    return result;
  };
  const {jobs}=await call({action:'claimNotifications',limit:Math.max(1,Math.min(limit,2))});
  if(!Array.isArray(jobs))throw new Error('Invalid notification queue');
  let sent=0,failed=0;
  const transport=createTransport({host:'smtp.gmail.com',port:465,secure:true,
    auth:{user,pass:password},connectionTimeout:8000,greetingTimeout:8000,socketTimeout:12000});
  try {
    for(const job of jobs){
      let accepted=false;
      try {
        const result=await transport.sendMail(notificationMessage(job,user));
        if(!result.accepted?.some(address=>String(address).toLowerCase()===RECIPIENT))throw new Error('Recipient not accepted');
        accepted=true;
        await call({action:'completeNotification',requestId:job.requestId,leaseId:job.leaseId,delivered:true,resultCode:result.messageId});
        sent++;
      } catch(error) {
        failed++;
        if(!accepted){
          const code=/^[A-Z0-9_]{1,40}$/.test(error?.code || '')?error.code:'SMTP_UNCONFIRMED';
          try {await call({action:'completeNotification',requestId:job.requestId,leaseId:job.leaseId,delivered:false,resultCode:code});}catch{/* The lease expires and the scheduled worker retries. */}
        }
        console.error('Notification remains pending',job.requestId);
      }
    }
  } finally {transport.close();}
  return {configured:true,sent,failed};
}
