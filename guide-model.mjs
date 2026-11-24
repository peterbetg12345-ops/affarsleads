export function recommendPackage(volume, needsHelp = false) {
  if (needsHelp) return {package:'',title:'Vi hjälper er välja rätt omfattning',description:'Vi tar fram ett startförslag tillsammans utifrån er målgrupp och ert erbjudande.'};
  const count = Math.max(1000, Math.min(15000, Number(volume) || 3000));
  const selected = count <= 3000 ? 'Bas' : count <= 9000 ? 'Tillväxt' : 'Premium';
  const descriptions = {
    Bas:'En fokuserad start med utrymme att lära känna målgruppen och utveckla budskapet.',
    Tillväxt:'Mer utrymme att bearbeta relevanta kontakter och arbeta löpande med uppföljning.',
    Premium:'Ett anpassat upplägg där vi planerar omfattning och genomförande tillsammans.'
  };
  return {package:selected,title:`${selected} passar er valda omfattning`,description:descriptions[selected]};
}

export function guideSummary(state) {
  const audience = state.audience === 'Annan målgrupp' && state.otherAudience.trim() ? state.otherAudience.trim() : state.audience;
  const market = state.market === 'Annan marknad' && state.otherMarket.trim() ? state.otherMarket.trim() : state.market;
  const volume = state.needsHelp ? 'Hjälp oss välja omfattning' : `Cirka ${Number(state.volume).toLocaleString('sv-SE')} kontakter per månad`;
  const followUps=Math.max(0,Math.min(4,Math.round(Number(state.followUps ?? 2)||0)));
  const processing=followUps===0?'Endast första mejlet':`Första mejlet + ${followUps} ${followUps===1?'uppföljning':'uppföljningar'}`;
  return {audience,market,volume,industry:state.industry.trim(),processing};
}

export function estimateWorkload(volume, followUps = 2, needsHelp = false) {
  if(needsHelp)return null;
  const contacts=Math.max(1000,Math.min(15000,Number(volume)||3000));
  const followUpCount=Math.max(0,Math.min(4,Math.round(Number(followUps)||0)));
  return {contacts,followUps:followUpCount,maxMessages:contacts*(1+followUpCount)};
}

export function guideMessage(state, notes = '') {
  const summary = guideSummary(state);
  const recommendation = recommendPackage(state.volume,state.needsHelp);
  return [
    'Förfrågan från uppläggskalkylatorn på Affärsleads.se.',
    `Målgrupp: ${summary.audience}`,
    ...(summary.industry ? [`Bransch: ${summary.industry}`] : []),
    `Marknad: ${summary.market}`,
    `Önskad bearbetning: ${summary.volume}`,
    `Bearbetning: ${summary.processing}`,
    ...(!state.needsHelp ? [`Planerade mejl, maxscenario: ${estimateWorkload(state.volume,state.followUps).maxMessages.toLocaleString('sv-SE')} per månad`] : []),
    `Rekommenderat paket: ${recommendation.package || 'Hjälp att välja'}`,
    ...(notes.trim() ? ['',`Mer om företaget och erbjudandet:\n${notes.trim()}`] : [])
  ].join('\n');
}
