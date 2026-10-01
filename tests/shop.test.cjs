const assert=require('node:assert/strict');
const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.join(__dirname,'..','dist');const ctx={window:{}};vm.runInNewContext(fs.readFileSync(path.join(root,'catalog.js'),'utf8'),ctx);const C=ctx.window.CATALOG;const S=require('../dist/shop-core.js');
assert.equal(S.finalCents(8190),8190);assert.equal(S.finalCents(1760),1760);assert.equal(S.finalCents(2375),2375);assert.equal(S.finalCents(null),null);
assert.equal(S.referenceCents(8190),10647);assert.equal(S.referenceCents(1760),2288);assert.equal(S.referenceCents(null),null);
const cart=[{variantId:'antigrasa-3',quantity:2},{variantId:'classic-shampoo-1',quantity:1}];
const t=S.totals(cart,C);assert.equal(t.count,3);assert.equal(t.listCents,18721);assert.equal(t.totalCents,18721);assert.equal(t.hasQuote,false);assert.equal(t.referenceCents,24337);
assert.equal(S.normalizeCart([{variantId:'bad',quantity:1},{variantId:'antigrasa-1',quantity:-1}],C).length,0);
assert.equal(S.normalizeCart([{variantId:'antigrasa-1',quantity:1.5}],C).length,0);
assert.equal(S.normalizeCart([{variantId:'antigrasa-1',quantity:98},{variantId:'antigrasa-1',quantity:4}],C)[0].quantity,99);
assert.equal(S.totals([{variantId:'lavandina-8',quantity:1}],C).hasQuote,true);
assert.equal(S.totals([{variantId:'lavandina-8',quantity:1}],C).totalCents,0);
const data={name:'Cliente de prueba',phone:'70000000',department:'Cochabamba',city:'Ciudad de prueba',address:'Dirección de prueba',location:'Referencia de prueba',invoice:'si',business:'Empresa de prueba',taxId:'1234567',notes:'Pedido de prueba; no enviar'};
const msg=S.orderMessage(cart,C,data);for(const text of ['Total de productos a pagar: Bs 187,21','Cantidad: 2','Código: 50020','NIT / CI: 1234567','Referencia de prueba','PENDIENTE DE COORDINACIÓN'])assert.ok(msg.includes(text),text);
assert.ok(!msg.includes('Descuento'));assert.ok(!msg.includes('Ahorro'));
const ids=new Set();for(const p of C){assert.ok(fs.existsSync(path.join(root,p.image)),p.image);for(const v of p.variants){assert.ok(!ids.has(v.id),v.id);ids.add(v.id);assert.ok(fs.existsSync(path.join(root,v.image)),v.image);assert.ok(v.listCents===null||(Number.isInteger(v.listCents)&&v.listCents>0),v.id)}}
console.log(`PASS: list-price checkout, reference markup rounding, totals, quote-only items, invalid carts, order message, ${C.length} families / ${ids.size} variants and image references.`);

const simple=S.orderMessage(cart,C,{name:"Prueba",phone:"70000000",location:"Ciudad y direccion",invoice:"si",business:"Prueba",taxId:"1234567",notes:""}); assert.ok(!simple.includes("undefined"));assert.ok(!simple.includes("Notas:"));assert.ok(simple.includes("Ciudad y direccion"));assert.equal(S.referenceCents(10000),13000);
