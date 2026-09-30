// Run: node check-shopping.cjs — no dependencies.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/shopping.html','utf8');
const data=JSON.parse(html.match(/<script id="products" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.equal(data.length,20);assert.equal(new Set(data.map(p=>p.key)).size,20);
for(const p of data){assert(p.limit>0&&p.au>0);assert(p.function&&p.reason.length<85);assert(new URL(p.url).protocol==='https:');assert(fs.statSync(__dirname+`/img/shop-${p.key}-S.webp`).size>1000);}
const nodes={'products':{textContent:JSON.stringify(data)},'gift-rows':{},'supplement-rows':{}};
const code=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
vm.runInNewContext(code,{document:{getElementById:id=>nodes[id]},navigator:{},location:{protocol:'file:'}});
assert.equal((nodes['gift-rows'].innerHTML.match(/<tr>/g)||[]).length,11);
assert.equal((nodes['supplement-rows'].innerHTML.match(/<tr>/g)||[]).length,9);
for(const group of ['', 'supplement'])assert.deepEqual(data.filter(p=>(p.group||'')===group&&p.rank).map(p=>p.rank).sort(),[1,2,3,4,5]);
assert(nodes['supplement-rows'].innerHTML.indexOf('스위스 비타민D')<nodes['supplement-rows'].innerHTML.indexOf('스위스 고함량 피쉬오일'));
assert(nodes['gift-rows'].innerHTML.includes('<details>'));
assert(nodes['supplement-rows'].innerHTML.includes('A$19.00'));
assert(nodes['gift-rows'].innerHTML.includes('20,900원'));
assert(fs.readFileSync(__dirname+'/index.html','utf8').includes('href="shopping.html"'));
console.log('PASS: 20 products, photos, prices, top-five ordering, concise copy and navigation');
