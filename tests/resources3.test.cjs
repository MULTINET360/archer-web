const assert=require('node:assert/strict');const fs=require('node:fs');const vm=require('node:vm');const path=require('node:path');
const root=path.join(__dirname,'..','dist'),ctx={window:{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'catalog.js'),'utf8'),ctx);
vm.runInNewContext(fs.readFileSync(path.join(root,'resources3-assets.js'),'utf8'),ctx);
const catalog=ctx.window.CATALOG,before=catalog.map(p=>({id:p.id,variants:JSON.stringify(p.variants)}));
const source=fs.readFileSync(path.join(root,'resources3.js'),'utf8');
// Execute the actual family-image mapping without routing or a browser.
vm.runInNewContext('const C=window.CATALOG;'+source.split('setHeaderBrand=function')[0],ctx);
for(const [i,p] of catalog.entries()){assert.equal(p.id,before[i].id);assert.equal(JSON.stringify(p.variants),before[i].variants,'Family imagery must not change formats, prices or per-format images');assert.ok(fs.existsSync(path.join(root,p.image)),p.image)}
assert.match(catalog.find(p=>p.id==='antigrasa').image,/resources3.*antigrasa/);
for(const file of Object.values(ctx.window.RESOURCE3_ASSETS))assert.ok(fs.existsSync(path.join(root,file)),file);
const css=fs.readFileSync(path.join(root,'resources3.css'),'utf8');for(const match of css.matchAll(/url\('([^']+)'\)/g))assert.ok(fs.existsSync(path.join(root,match[1])),match[1]);
const core=require('../dist/shop-core.js');const cart=[{variantId:'antigrasa-1',quantity:2}],data={name:'Test',phone:'70000000',location:'Test',invoice:'si',business:'Test',taxId:'1234567',paymentReported:true,deliveryMethod:'pickup'};
const msg=core.orderMessage(cart,catalog,data);assert.match(msg,/PENDIENTE DE VERIFICACIÓN BANCARIA/);assert.match(msg,/Recojo en planta/);assert.ok(!msg.includes('undefined'));
const quote=core.orderMessage([{variantId:'lavandina-8',quantity:1}],catalog,data);assert.ok(!quote.includes('REPORTADO POR EL CLIENTE'));assert.match(quote,/pendientes de cotización/);
console.log('PASS: resource files, family imagery preserves every variant/price, unpaid quote flow and manual payment verification.');
