import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendPackage,guideSummary,guideMessage} from '../guide-model.mjs';

test('guide package boundaries follow the existing indicative capacity',()=>{
 assert.equal(recommendPackage(1000).package,'Bas');
 assert.equal(recommendPackage(3000).package,'Bas');
 assert.equal(recommendPackage(3500).package,'Tillväxt');
 assert.equal(recommendPackage(9000).package,'Tillväxt');
 assert.equal(recommendPackage(9500).package,'Premium');
 assert.equal(recommendPackage(15000).package,'Premium');
 assert.equal(recommendPackage(9000,true).package,'');
});
test('enquiry preserves custom audience, industry, market, volume, package and notes',()=>{
 const state={audience:'Annan målgrupp',otherAudience:'HR-chefer',industry:'IT',market:'Annan marknad',otherMarket:'Storbritannien',volume:6000,needsHelp:false};
 const summary=guideSummary(state);assert.equal(summary.audience,'HR-chefer');assert.equal(summary.market,'Storbritannien');
 const message=guideMessage(state,'Vi säljer ett rekryteringsverktyg.');
 for(const part of ['HR-chefer','IT','Storbritannien','6','000','Tillväxt','rekryteringsverktyg'])assert.ok(message.includes(part));
 const helpMessage=guideMessage({...state,needsHelp:true});
 assert.ok(helpMessage.includes('Hjälp oss välja omfattning'));assert.ok(helpMessage.includes('Rekommenderat paket: Hjälp att välja'));
});
