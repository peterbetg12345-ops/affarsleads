import {timingSafeEqual} from 'node:crypto';
import {notifyPending} from '../server/notifications.mjs';

export default async function handler(req,res){
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({ok:false});}
  const expected=process.env.NOTIFICATION_TOKEN;
  if(!expected)return res.status(503).json({ok:false});
  const supplied=Buffer.from(String(req.headers.authorization || ''));
  const wanted=Buffer.from(`Bearer ${expected}`);
  if(supplied.length!==wanted.length || !timingSafeEqual(supplied,wanted))return res.status(401).json({ok:false});
  try {
    const result=await notifyPending({limit:2});
    return res.status(result.configured?200:503).json({ok:result.configured,sent:result.sent});
  }catch{return res.status(502).json({ok:false});}
}
