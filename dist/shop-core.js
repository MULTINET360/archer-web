(function(root){
  'use strict';
  const finalCents=(cents,markup=30)=>cents===null?null:Math.round(cents*(100+markup)/100);
  const deliveryPolicy={latitude:-17.3790928,longitude:-66.1274267,mapUrl:'https://maps.app.goo.gl/mx8mSXiLFT8w9iPS7'};
  function delivery(total,data={}){
    if(data.deliveryMethod==='pickup')return {feeCents:0,label:'Recojo en planta',distanceKm:null};
    if(data.latitude==null||data.longitude==null||String(data.latitude).trim()===''||String(data.longitude).trim()==='')return {feeCents:null,label:'Marca tu ubicación para calcular el delivery',distanceKm:null};
    const lat=Number(data.latitude),lng=Number(data.longitude);
    if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180)return {feeCents:null,label:'Ubicación pendiente',distanceKm:null};
    const rad=n=>n*Math.PI/180,a=Math.sin(rad(lat-deliveryPolicy.latitude)/2)**2+Math.cos(rad(lat))*Math.cos(rad(deliveryPolicy.latitude))*Math.sin(rad(lng-deliveryPolicy.longitude)/2)**2;
    const distanceKm=6371*2*Math.asin(Math.sqrt(Math.min(1,a)));
    if(distanceKm>15)return {feeCents:null,label:'Más de 15 km: envío por cotizar',distanceKm};
    const feeCents=total>35000?0:distanceKm<=5?1000:distanceKm<=10?1500:2000;
    return {feeCents,label:feeCents===0?'Delivery gratis por compra mayor a Bs 350':'Delivery',distanceKm};
  }
  const referenceCents=(cents,markup=30)=>cents===null?null:Math.round(cents*(100+markup)/100);
  function normalizeCart(raw,catalog){
    if(!Array.isArray(raw))return [];
    const valid=new Map(catalog.flatMap(p=>p.variants.map(v=>[v.id,v]))), result=new Map();
    for(const row of raw){if(!row||!valid.has(row.variantId)||!Number.isInteger(row.quantity)||row.quantity<1)continue;
      result.set(row.variantId,{variantId:row.variantId,quantity:Math.min(99,(result.get(row.variantId)?.quantity||0)+row.quantity)});
    }return [...result.values()];
  }
  function lines(cart,catalog,markup=30){return normalizeCart(cart,catalog).map(row=>{const product=catalog.find(p=>p.variants.some(v=>v.id===row.variantId));const variant=product.variants.find(v=>v.id===row.variantId);return {...row,product,variant,unitCents:finalCents(variant.listCents,markup)};});}
  function totals(cart,catalog,markup=30){const rows=lines(cart,catalog,markup);return {count:rows.reduce((s,r)=>s+r.quantity,0),referenceCents:rows.reduce((s,r)=>s+(referenceCents(r.variant.listCents,markup)||0)*r.quantity,0),listCents:rows.reduce((s,r)=>s+(r.variant.listCents||0)*r.quantity,0),totalCents:rows.reduce((s,r)=>s+(r.unitCents||0)*r.quantity,0),hasQuote:rows.some(r=>r.unitCents===null)};}
  const money=cents=>'Bs '+(cents/100).toLocaleString('es-BO',{minimumFractionDigits:2,maximumFractionDigits:2});
  function orderMessage(cart,catalog,data,markup=30){const rows=lines(cart,catalog,markup),t=totals(cart,catalog,markup),d=delivery(t.totalCents,data),payable=!t.hasQuote&&d.feeCents!==null;return [
    '*NUEVO PEDIDO WEB · ARCHER*',`Cliente: ${data.name}`,`Teléfono: ${data.phone}`,'', '*PRODUCTOS*',
    ...rows.map((r,i)=>`${i+1}. ${r.product.brand} ${r.product.name} — ${r.variant.label}${r.variant.sku?' | Código: '+r.variant.sku:''}\nCantidad: ${r.quantity} | ${r.unitCents===null?'Precio por cotizar':`Unidad: ${money(r.unitCents)} | Subtotal: ${money(r.unitCents*r.quantity)}`}`),
    '',`${t.hasQuote?'Subtotal conocido':'Total de productos a pagar'}: ${money(t.totalCents)}`,t.hasQuote?'Hay productos pendientes de cotización.':'',`Entrega: ${d.label}${d.feeCents===null?'': ' · '+money(d.feeCents)}`,d.distanceKm===null?'':`Radio desde planta: ${d.distanceKm.toFixed(2)} km`,payable?`TOTAL A PAGAR: ${money(t.totalCents+d.feeCents)}`:'Total pendiente de confirmación. No pagar todavía.','Impuestos incluidos.',data.paymentReported&&payable?'Estado del pago: REPORTADO POR EL CLIENTE · PENDIENTE DE VERIFICACIÓN BANCARIA':'Estado del pago: PENDIENTE DE COORDINACIÓN','',
    '*ENTREGA*',data.department?`Departamento: ${data.department}`:'',data.city?`Ciudad / municipio: ${data.city}`:'',data.address?`Dirección: ${data.address}`:'',`Ubicación / referencia: ${data.deliveryMethod==='pickup'?'Recojo en planta · '+deliveryPolicy.mapUrl:data.location||'Pendiente'}`,data.latitude&&data.longitude&&Number.isFinite(Number(data.latitude))&&Number.isFinite(Number(data.longitude))?'Punto de entrega: https://www.google.com/maps?q='+encodeURIComponent(data.latitude+','+data.longitude):'',data.notes?'Notas: '+data.notes:'','',
    '*FACTURACIÓN*',data.invoice==='si'?`Razón social: ${data.business}\nNIT / CI: ${data.taxId}`:'Factura: no solicitada en el formulario','',
    data.paymentReported&&payable?'Adjuntaré el comprobante en este chat. Verificar el abono y el importe antes de facturar. Esta solicitud no acredita un pago confirmado.':'Solicito confirmar disponibilidad, entrega y forma de pago antes de finalizar la compra.'
  ].filter(x=>x!=='').join('\n');}
  const api={finalCents,referenceCents,normalizeCart,lines,totals,money,orderMessage,delivery,deliveryPolicy};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ShopCore=api;
})(typeof window==='undefined'?globalThis:window);
