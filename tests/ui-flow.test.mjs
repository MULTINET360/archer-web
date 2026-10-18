import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {parseHTML} from './support/linkedom.mjs';
const root=new URL('../dist/',import.meta.url);
const {window}=parseHTML(fs.readFileSync(new URL('index.html',root),'utf8'));
const {document}=window;
const proto=window.HTMLElement.prototype;
proto.showModal=function(){this.open=true};proto.close=function(){this.open=false};proto.scrollIntoView=function(){};proto.focus=function(){};
Object.defineProperty(window.HTMLSelectElement.prototype,'value',{get(){return [...this.querySelectorAll('option')].find(o=>o.hasAttribute('selected'))?.getAttribute('value')??[...this.querySelectorAll('option')].find(o=>o.hasAttribute('selected'))?.textContent??this.querySelector('option')?.getAttribute('value')??''},set(value){for(const o of this.querySelectorAll('option'))o.toggleAttribute('selected',(o.getAttribute('value')??o.textContent)===value)}});
const location={hash:'#inicio'};window.location=location;window.scrollTo=()=>{};window.matchMedia=()=>({matches:true});
const storage=new Map();const localStorage={getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)};
class FormData{constructor(form){this.rows=[...form.querySelectorAll('input,select,textarea')].filter(e=>e.name&&(e.type!=='checkbox'||e.checked)).map(e=>[e.name,e.value??''])}[Symbol.iterator](){return this.rows[Symbol.iterator]()}}
const context=vm.createContext({window,document,location,history:{replaceState(a,b,hash){location.hash=hash}},localStorage,matchMedia:window.matchMedia,navigator:{},URLSearchParams,FormData,console,setInterval:()=>1,clearInterval:()=>{},setTimeout:()=>1,clearTimeout:()=>{}});
for(const file of ['assets.js','catalog.js','shop-core.js','app.js','revision-assets.js','revision.js','checkout-payment.js','resources3-assets.js','resources3.js','technical-sheets.js'])vm.runInContext(fs.readFileSync(new URL(file,root),'utf8'),context,{filename:file});
const run=code=>vm.runInContext(code,context);
for(const hash of ['#inicio','#nosotros','#productos','#internacionales','#institucional','#tienda?categoria=hogar','#marca?nombre=Classic','#marca?nombre=Biosilk']){
 location.hash=hash;run('route()');assert.match(document.querySelector('.header .logo img').getAttribute('src'),/logotipo-1-1/);assert.ok(!document.querySelector('main').innerHTML.includes('src="undefined"'),hash);
}
location.hash='#tienda?categoria=hogar';run('route()');assert.ok(document.querySelector('.category-hogar.revision-shop-hero'));
run("shopCategory='personal';filterShop()");assert.ok(document.querySelector('.category-personal.revision-shop-hero'));
run("openProduct('antigrasa')");assert.match(document.getElementById('detail-image').getAttribute('src'),/resources3.*antigrasa/);assert.equal(document.getElementById('add-product').disabled,true);
const variant=run("C.find(p=>p.id==='antigrasa').variants[2]");document.getElementById('variant-select').value=variant.id;run("selectedVariant=selectedProduct.variants[2];updateVariant()");assert.equal(document.getElementById('detail-image').getAttribute('src'),variant.image);assert.equal(document.getElementById('add-product').disabled,false);
run("cart=[{variantId:'antigrasa-1',quantity:1}]");location.hash='#pedido';run('route()');assert.ok(document.getElementById('delivery-map'));assert.match(document.getElementById('map-status').textContent,/No se pudo cargar/);
run("reviewOrder({name:'Test',phone:'70000000',location:'Test',invoice:'si',business:'Test',taxId:'1234567',notes:'',deliveryMethod:'pickup'})");assert.ok(document.querySelector('.payment-qr'));assert.equal(document.getElementById('prepare-verification').disabled,true);assert.equal(document.getElementById('send-order'),null);
run("cart=[{variantId:'lavandina-8',quantity:1}];route();reviewOrder({name:'Test',phone:'70000000',location:'Test',invoice:'si',business:'Test',taxId:'1234567'})");assert.equal(document.querySelector('.payment-qr'),null);assert.match(document.getElementById('payment-form').textContent,/No pagues un subtotal/);
console.log('PASS: all routes load, Multi persists across brands, category theme follows filters, family-to-format selection, map fallback, payment guard and quote-only flow. DOM simulation; no visual or real bank verification.');

run("cart=[{variantId:'antigrasa-1',quantity:1}];route();reviewOrder({name:'Test',phone:'70000000',location:'Fuera de cobertura',latitude:'-18',longitude:'-66',invoice:'si',business:'Test',taxId:'1234567'})");
assert.equal(document.querySelector('.payment-qr'),null);assert.match(document.getElementById('payment-form').textContent,/costo de entrega/);
run("route();reviewOrder({name:'Test',phone:'70000000',location:'Planta',latitude:'-17.3790928',longitude:'-66.1274267',invoice:'si',business:'Test',taxId:'1234567'})");
assert.ok(document.querySelector('.payment-qr'));assert.match(document.querySelector('.payment-amount').textContent,/Entrega: Bs 10,00/);
run("route()");document.getElementById('delivery-method').value='pickup';run('syncDelivery()');assert.equal(document.querySelector('[name=location]').required,false);assert.equal(document.querySelector('.delivery-picker').hidden,true);
location.hash='#institucional';run('route()');assert.equal(document.querySelectorAll('[data-technical]').length,17);run("openTechnical('antigrasa')");assert.match(document.getElementById('product-dialog').textContent,/Desengrasante líquido/);assert.match(document.querySelector('.technical-detail img').getAttribute('src'),/5/);
run("openProduct('antigrasa',true)");assert.equal(document.querySelectorAll('#variant-select option').length,2);
console.log('PASS: delivery calculation shown in QR total, unknown delivery blocks payment, pickup removes address requirement, 17 technical sheets and institutional formats.');
