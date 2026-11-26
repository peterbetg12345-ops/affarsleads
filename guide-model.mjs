export const PACKAGES = [
  {name:'Bas',contacts:2000,monthlyPrice:11990,setupFee:3000},
  {name:'Tillväxt',contacts:4000,monthlyPrice:19990,setupFee:5000},
  {name:'Premium',contacts:8000,monthlyPrice:29990,setupFee:7500}
];

const contactCount = volume => Math.max(2000, Math.min(15000, Number(volume) || 2000));
const isQuarterly = agreement => agreement === 'quarterly';

export function recommendPackage(volume, needsHelp = false) {
  if (needsHelp) return {package:'',label:'Vi väljer ihop',monthlyPrice:null,setupFee:null,contacts:null};
  const selected = PACKAGES.find(plan => contactCount(volume) <= plan.contacts);
  // Custom enquiries use the existing optional package field; their scope is kept in the message.
  if (!selected) return {package:'',label:'Anpassat',monthlyPrice:null,setupFee:null,contacts:null};
  return {...selected,package:selected.name,label:selected.name};
}

export function estimatePricing(volume, agreement = 'monthly', needsHelp = false) {
  const plan = recommendPackage(volume, needsHelp);
  const setupFee = isQuarterly(agreement) ? 0 : plan.setupFee;
  return {...plan,setupFee,commitmentMonths:isQuarterly(agreement)?3:1,
    firstMonthTotal:plan.monthlyPrice === null || setupFee === null ? null : plan.monthlyPrice + setupFee};
}

export function guideSummary(state) {
  const audience = state.audience === 'Annan målgrupp' && state.otherAudience.trim() ? state.otherAudience.trim() : state.audience;
  const market = state.market === 'Annan marknad' && state.otherMarket.trim() ? state.otherMarket.trim() : state.market;
  const volume = state.needsHelp ? 'Hjälp oss välja omfattning' : `${contactCount(state.volume).toLocaleString('sv-SE')} nya unika kontakter per månad`;
  const followUps=Math.max(0,Math.min(4,Math.round(Number(state.followUps ?? 2)||0)));
  const processing=followUps===0?'Endast första mejlet':`Första mejlet + ${followUps} ${followUps===1?'uppföljning':'uppföljningar'}`;
  const agreement=isQuarterly(state.agreement)?'3 månaders bindningstid, därefter månadsvis. Ingen uppstartsavgift.':'Månadsvis avtal med uppstartsavgift. Ingen bindningstid utöver påbörjad avtalsmånad.';
  return {audience,market,volume,industry:state.industry.trim(),processing,agreement};
}

export function estimateWorkload(volume, followUps = 2, needsHelp = false) {
  if(needsHelp)return null;
  const contacts=contactCount(volume);
  const followUpCount=Math.max(0,Math.min(4,Math.round(Number(followUps)||0)));
  return {contacts,followUps:followUpCount,maxMessages:contacts*(1+followUpCount)};
}

export function guideMessage(state, notes = '') {
  const summary = guideSummary(state);
  const recommendation = recommendPackage(state.volume,state.needsHelp);
  const pricing = estimatePricing(state.volume,state.agreement,state.needsHelp);
  const money=value=>`${value.toLocaleString('sv-SE')} kr`;
  return [
    'Förfrågan från uppläggskalkylatorn på Affärsleads.se.',
    `Målgrupp: ${summary.audience}`,
    ...(summary.industry ? [`Bransch: ${summary.industry}`] : []),
    `Marknad: ${summary.market}`,
    `Önskad bearbetning: ${summary.volume}`,
    `Bearbetning: ${summary.processing}. Uppföljningar ingår.`,
    ...(!state.needsHelp ? [`Mejl i sekvensen, maxscenario: ${estimateWorkload(state.volume,state.followUps).maxMessages.toLocaleString('sv-SE')} (kan löpa över ett månadsskifte)`] : []),
    `Rekommenderat paket: ${state.needsHelp?'Hjälp att välja':recommendation.label}`,
    ...(pricing.contacts ? [`Paketets kontaktvolym: upp till ${pricing.contacts.toLocaleString('sv-SE')} nya unika kontakter per månad`] : []),
    `Avtalsval: ${summary.agreement}`,
    `Månadspris: ${pricing.monthlyPrice===null?'Enligt offert':money(pricing.monthlyPrice)} exkl. moms`,
    `Uppstart, engångsavgift: ${pricing.setupFee===null?'Enligt offert':money(pricing.setupFee)} exkl. moms`,
    ...(pricing.firstMonthTotal===null?[]:[`Första kampanjmånaden inklusive uppstart: ${money(pricing.firstMonthTotal)} exkl. moms`]),
    'Kampanjmånaden och eventuell tremånadersperiod börjar när utskicken startar. Uppsägning före nästa avtalsmånad.',
    ...(notes.trim() ? ['',`Mer om företaget och erbjudandet:\n${notes.trim()}`] : [])
  ].join('\n');
}
