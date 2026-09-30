// Run: node check-shopping.cjs — no dependencies.
const fs=require('node:fs'),assert=require('node:assert/strict'),vm=require('node:vm');
const html=fs.readFileSync(__dirname+'/shopping.html','utf8');
const data=JSON.parse(html.match(/<script id="products" type="application\/json">([\s\S]*?)<\/script>/)[1]);
assert.equal(data.length,15);assert.equal(new Set(data.map(p=>p.key)).size,15);
for(const p of data){assert(p.limit>0&&p.au>0);assert(new URL(p.url).protocol==='https:');assert(fs.statSync(__dirname+`/img/shop-${p.key}-S.webp`).size>1000);}
const nodes={'products':{textContent:JSON.stringify(data)},'gift-rows':{},'supplement-rows':{}};
const code=html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
vm.runInNewContext(code,{document:{getElementById:id=>nodes[id]},navigator:{},location:{protocol:'file:'}});
assert.equal((nodes['gift-rows'].innerHTML.match(/<tr>/g)||[]).length,11);
assert.equal((nodes['supplement-rows'].innerHTML.match(/<tr>/g)||[]).length,4);
assert(nodes['gift-rows'].innerHTML.includes('20,900원'));
assert(fs.readFileSync(__dirname+'/index.html','utf8').includes('href="shopping.html"'));
console.log('PASS: 15 products, photos, prices, rendering and navigation');
