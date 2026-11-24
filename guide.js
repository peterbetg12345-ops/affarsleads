import {recommendPackage,guideSummary,guideMessage,estimateWorkload} from './guide-model.mjs';

const calculator=document.querySelector('#upplagg');
const options=calculator.querySelector('#guide-options');
const leadForm=calculator.querySelector('#guide-contact-form');
const volume=options.elements.namedItem('volume');
const followUps=options.elements.namedItem('followUps');
const help=options.elements.namedItem('helpVolume');
const format=value=>Number(value).toLocaleString('sv-SE');
let previousPackage='';

function state(){
 const data=new FormData(options);
 return {audience:String(data.get('audience')||'Företagsägare och VD'),otherAudience:String(data.get('otherAudience')||''),industry:String(data.get('industry')||''),market:String(data.get('market')||'Sverige'),otherMarket:String(data.get('otherMarket')||''),volume:Number(volume.value),followUps:Number(followUps.value),needsHelp:help.checked};
}
function syncMessage(){
 const choices=state();
 leadForm.elements.namedItem('package').value=recommendPackage(choices.volume,choices.needsHelp).package;
 leadForm.elements.namedItem('message').value=guideMessage(choices,leadForm.elements.namedItem('notes').value);
}
function paintRange(input){
 const fill=(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100;
 input.style.setProperty('--range-fill',`${fill}%`);
}
function refresh(announce=false){
 const choices=state(),summary=guideSummary(choices),recommendation=recommendPackage(choices.volume,choices.needsHelp);
 const workload=estimateWorkload(choices.volume,choices.followUps,choices.needsHelp);
 volume.disabled=choices.needsHelp;
 calculator.querySelector('#guide-volume-output').textContent=choices.needsHelp?'Vi väljer tillsammans':format(choices.volume);
 calculator.querySelector('#guide-followup-output').textContent=String(choices.followUps);
 volume.setAttribute('aria-valuetext',choices.needsHelp?'Hjälp att välja omfattning':`${format(choices.volume)} kontakter per månad`);
 followUps.setAttribute('aria-valuetext',`${choices.followUps} ${choices.followUps===1?'uppföljning':'uppföljningar'}`);
 paintRange(volume);paintRange(followUps);
 calculator.querySelector('#guide-other-audience').hidden=choices.audience!=='Annan målgrupp';
 calculator.querySelector('#guide-other-market').hidden=choices.market!=='Annan marknad';
 calculator.querySelector('#calc-package').textContent=recommendation.package||'Vi väljer ihop';
 calculator.querySelector('#calc-result').dataset.package=recommendation.package||'custom';
 calculator.querySelector('#calc-contacts').textContent=workload?format(workload.contacts):'Anpassat';
 calculator.querySelector('#calc-messages').textContent=workload?format(workload.maxMessages):'Anpassat';
 calculator.querySelector('#calc-audience').textContent=summary.audience;
 calculator.querySelector('#calc-market').textContent=summary.market;
 calculator.querySelector('#calc-processing').textContent=summary.processing;
 calculator.querySelector('#calc-industry').textContent=summary.industry;
 calculator.querySelector('#calc-industry-row').hidden=!summary.industry;
 calculator.querySelectorAll('[data-volume]').forEach(button=>{
  const selected=!choices.needsHelp&&Number(button.dataset.volume)===choices.volume;
  button.setAttribute('aria-pressed',String(selected));
 });
 if(announce&&recommendation.package!==previousPackage){
  calculator.querySelector('#calc-announcement').textContent=recommendation.package?`Paketförslag: ${recommendation.package}.`:'Vi hjälper er välja rätt omfattning.';
 }
 previousPackage=recommendation.package;
 syncMessage();
}
options.addEventListener('input',()=>refresh());
options.addEventListener('change',()=>refresh(true));
options.addEventListener('submit',event=>event.preventDefault());
calculator.querySelectorAll('[data-volume]').forEach(button=>button.addEventListener('click',()=>{
 volume.value=button.dataset.volume;help.checked=false;refresh(true);
}));
calculator.querySelector('#calc-reset').addEventListener('click',()=>{options.reset();refresh(true);});
leadForm.addEventListener('submit',syncMessage,{capture:true});
leadForm.addEventListener('input',syncMessage);
refresh();
calculator.querySelector('.guide-fallback').hidden=true;
calculator.querySelector('.guide-interactive').hidden=false;
