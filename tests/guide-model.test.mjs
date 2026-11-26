import test from 'node:test';
import assert from 'node:assert/strict';
import {recommendPackage,guideSummary,guideMessage,estimateWorkload,estimatePricing} from '../guide-model.mjs';

test('guide assigns the next package capacity and quotes custom volumes separately',()=>{
 assert.equal(recommendPackage(1000).package,'Bas');
 assert.equal(recommendPackage(2000).package,'Bas');
 assert.equal(recommendPackage(2001).package,'Tillväxt');
 assert.equal(recommendPackage(3500).package,'Tillväxt');
 assert.equal(recommendPackage(4000).package,'Tillväxt');
 assert.equal(recommendPackage(4001).package,'Premium');
 assert.equal(recommendPackage(8000).package,'Premium');
 assert.equal(recommendPackage(8001).label,'Anpassat');
 assert.equal(recommendPackage(10000).monthlyPrice,null);
 assert.equal(recommendPackage(15000).label,'Anpassat');
 assert.equal(recommendPackage(15000).package,'');
 assert.equal(recommendPackage(9000,true).package,'');
});
test('monthly and three-month agreements keep the monthly price and waive only setup',()=>{
 for(const [contacts,price,setup] of [[2000,11990,3000],[4000,19990,5000],[8000,29990,7500]]){
  const monthly=estimatePricing(contacts,'monthly');
  assert.equal(monthly.monthlyPrice,price);assert.equal(monthly.setupFee,setup);
  assert.equal(monthly.firstMonthTotal,price+setup);assert.equal(monthly.commitmentMonths,1);
  const quarterly=estimatePricing(contacts,'quarterly');
  assert.equal(quarterly.monthlyPrice,price);assert.equal(quarterly.setupFee,0);
  assert.equal(quarterly.firstMonthTotal,price);assert.equal(quarterly.commitmentMonths,3);
 }
 assert.equal(estimatePricing(10000).firstMonthTotal,null);
 assert.equal(estimatePricing(10000,'quarterly').setupFee,0);
 assert.equal(estimatePricing(2000,'monthly',true).monthlyPrice,null);
});
test('enquiry preserves custom audience, industry, market, volume, package and notes',()=>{
 const state={audience:'Annan målgrupp',otherAudience:'HR-chefer',industry:'IT',market:'Annan marknad',otherMarket:'Storbritannien',volume:6000,needsHelp:false};
 const summary=guideSummary(state);assert.equal(summary.audience,'HR-chefer');assert.equal(summary.market,'Storbritannien');
 const message=guideMessage(state,'Vi säljer ett rekryteringsverktyg.');
 for(const part of ['HR-chefer','IT','Storbritannien','6','000','Premium','29','990','7','500','rekryteringsverktyg','Uppföljningar ingår','Avtalsval: Månadsvis'])assert.ok(message.includes(part),part);
 const helpMessage=guideMessage({...state,needsHelp:true});
 assert.ok(helpMessage.includes('Hjälp oss välja omfattning'));assert.ok(helpMessage.includes('Rekommenderat paket: Hjälp att välja'));
 const quarterlyMessage=guideMessage({...state,agreement:'quarterly'});
 assert.ok(quarterlyMessage.includes('3 månaders bindningstid'));
 assert.ok(quarterlyMessage.includes('Uppstart, engångsavgift: 0 kr'));
 const customMessage=guideMessage({...state,volume:10000});
 assert.ok(customMessage.includes('Rekommenderat paket: Anpassat'));
 assert.ok(customMessage.includes('Månadspris: Enligt offert'));
});

test('planned messages reflect the chosen follow-up count without assuming conversions',()=>{
 assert.deepEqual(estimateWorkload(3000,2),{contacts:3000,followUps:2,maxMessages:9000});
 assert.equal(estimateWorkload(6000,0).maxMessages,6000);
 assert.equal(estimateWorkload(9000,4).maxMessages,45000);
 assert.equal(estimateWorkload(15000,4).maxMessages,75000);
 assert.equal(estimateWorkload(3000,2,true),null);
 const state={audience:'Marknadschefer',otherAudience:'',industry:'IT',market:'Norge',otherMarket:'',volume:6000,followUps:3,needsHelp:false};
 const message=guideMessage(state);
 assert.ok(message.includes('Första mejlet + 3 uppföljningar'));
 assert.ok(message.includes('24'));
 assert.ok(guideMessage({...state,followUps:0}).includes('Endast första mejlet'));
});
