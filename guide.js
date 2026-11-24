import {recommendPackage,guideSummary,guideMessage} from './guide-model.mjs';

const guide=document.querySelector('#upplagg');
const options=guide.querySelector('#guide-options');
const panels=[...guide.querySelectorAll('[data-guide-step]')];
const result=guide.querySelector('#guide-result');
const previous=guide.querySelector('#guide-back');
const next=guide.querySelector('#guide-next');
const navigation=guide.querySelector('.guide-navigation');
const progress=guide.querySelector('#guide-progress');
const progressLabel=guide.querySelector('#guide-progress-label');
const error=guide.querySelector('#guide-error');
const volume=options.elements.namedItem('volume');
const help=options.elements.namedItem('helpVolume');
const leadForm=guide.querySelector('#guide-contact-form');
let step=0;

function state(){
  const data=new FormData(options);
  return {audience:String(data.get('audience')||''),otherAudience:String(data.get('otherAudience')||''),industry:String(data.get('industry')||''),market:String(data.get('market')||''),otherMarket:String(data.get('otherMarket')||''),volume:Number(volume.value),needsHelp:help.checked};
}
function syncMessage(){
  const choices=state();
  leadForm.elements.namedItem('package').value=recommendPackage(choices.volume,choices.needsHelp).package;
  leadForm.elements.namedItem('message').value=guideMessage(choices,leadForm.elements.namedItem('notes').value);
}
function refreshVolume(){
  volume.disabled=help.checked;
  guide.querySelector('#guide-volume-output').textContent=help.checked?'Vi väljer omfattning tillsammans':`${Number(volume.value).toLocaleString('sv-SE')} kontakter / månad`;
  const recommendation=recommendPackage(volume.value,help.checked);
  guide.querySelector('#guide-package-preview').textContent=recommendation.package?`Passar ${recommendation.package}`:'Ett startförslag tillsammans';
  guide.querySelector('#guide-other-audience').hidden=state().audience!=='Annan målgrupp';
  guide.querySelector('#guide-other-market').hidden=state().market!=='Annan marknad';
  error.textContent='';
  syncMessage();
}
function showStep(focus=true){
  panels.forEach((panel,index)=>panel.hidden=index!==step);
  result.hidden=true;
  navigation.hidden=false;
  previous.hidden=step===0;
  next.textContent=step===2?'Visa mitt upplägg':'Nästa steg';
  progress.value=(step+1)/3*100;
  progressLabel.textContent=`Steg ${step+1} av 3`;
  guide.querySelectorAll('[data-progress-step]').forEach((item,index)=>{
    item.classList.toggle('is-current',index===step);
    if(index===step)item.setAttribute('aria-current','step');else item.removeAttribute('aria-current');
  });
  error.textContent='';
  if(focus)panels[step].querySelector('legend').focus();
}
function showResult(){
  panels.forEach(panel=>panel.hidden=true);
  navigation.hidden=true;
  result.hidden=false;
  progress.value=100;
  progressLabel.textContent='Klart – ert upplägg';
  const choices=state(),summary=guideSummary(choices),recommendation=recommendPackage(choices.volume,choices.needsHelp);
  guide.querySelector('#guide-result-title').textContent=recommendation.title;
  guide.querySelector('#guide-result-description').textContent=recommendation.description;
  for(const [key,value] of Object.entries(summary))guide.querySelector(`[data-summary="${key}"]`).textContent=value;
  guide.querySelector('#guide-industry-summary').hidden=!summary.industry;
  syncMessage();
  guide.querySelector('#guide-result-title').focus();
}
function advance(){
  const choices=state();
  if(step===0&&!choices.audience){error.textContent='Välj en målgrupp, eller välj att få hjälp.';return;}
  if(step===1&&!choices.market){error.textContent='Välj en marknad för ert upplägg.';return;}
  if(step<2){step++;showStep();}else showResult();
}
options.addEventListener('change',refreshVolume);
options.addEventListener('input',refreshVolume);
options.addEventListener('submit',event=>{event.preventDefault();advance();});
next.addEventListener('click',advance);
previous.addEventListener('click',()=>{if(step>0){step--;showStep();}});
guide.querySelector('#guide-edit').addEventListener('click',()=>{step=0;showStep();});
leadForm.addEventListener('submit',syncMessage,{capture:true});
leadForm.addEventListener('input',syncMessage);
refreshVolume();
showStep(false);
guide.querySelector('.guide-fallback').hidden=true;
guide.querySelector('.guide-interactive').hidden=false;
