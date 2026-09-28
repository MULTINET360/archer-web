(function(root){
  'use strict';
  const finalCents=cents=>cents;
  const referenceCents=(cents,markup=30)=>cents===null?null:Math.round(cents*(100+markup)/100);
  function normalizeCart(raw,catalog){
    if(!Array.isArray(raw))return [];
    const valid=new Map(catalog.flatMap(p=>p.variants.map(v=>[v.id,v]))), result=new Map();
    for(const row of raw){if(!row||!valid.has(row.variantId)||!Number.isInteger(row.quantity)||row.quantity<1)continue;
      result.set(row.variantId,{variantId:row.variantId,quantity:Math.min(99,(result.get(row.variantId)?.quantity||0)+row.quantity)});
    }return [...result.values()];
  }
  function lines(cart,catalog,markup=30){return normalizeCart(cart,catalog).map(row=>{const product=catalog.find(p=>p.variants.some(v=>v.id===row.variantId));const variant=product.variants.find(v=>v.id===row.variantId);return {...row,product,variant,unitCents:finalCents(variant.listCents)};});}
  function totals(cart,catalog,markup=30){const rows=lines(cart,catalog,markup);return {count:rows.reduce((s,r)=>s+r.quantity,0),referenceCents:rows.reduce((s,r)=>s+(referenceCents(r.variant.listCents,markup)||0)*r.quantity,0),listCents:rows.reduce((s,r)=>s+(r.variant.listCents||0)*r.quantity,0),totalCents:rows.reduce((s,r)=>s+(r.unitCents||0)*r.quantity,0),hasQuote:rows.some(r=>r.unitCents===null)};}
  const money=cents=>'Bs '+(cents/100).toLocaleString('es-BO',{minimumFractionDigits:2,maximumFractionDigits:2});
  function orderMessage(cart,catalog,data,markup=30){const rows=lines(cart,catalog,markup),t=totals(cart,catalog,markup);return [
    '*NUEVO PEDIDO WEB · ARCHER*',`Cliente: ${data.name}`,`Teléfono: ${data.phone}`,'', '*PRODUCTOS*',
    ...rows.map((r,i)=>`${i+1}. ${r.product.brand} ${r.product.name} — ${r.variant.label}${r.variant.sku?' | Código: '+r.variant.sku:''}\nCantidad: ${r.quantity} | ${r.unitCents===null?'Precio por cotizar':`Unidad: ${money(r.unitCents)} | Subtotal: ${money(r.unitCents*r.quantity)}`}`),
    '',`${t.hasQuote?'Subtotal conocido':'Total de productos a pagar'}: ${money(t.totalCents)}`,t.hasQuote?'Hay productos pendientes de cotización.':'','Envío: costo y cobertura por coordinar. No incluido en el total.','Estado del pago: PENDIENTE DE COORDINACIÓN','',
    '*ENTREGA*',`Departamento: ${data.department}`,`Ciudad / municipio: ${data.city}`,`Dirección: ${data.address}`,`Ubicación / referencia: ${data.location}`,data.notes?'Notas: '+data.notes:'','',
    '*FACTURACIÓN*',data.invoice==='si'?`Razón social: ${data.business}\nNIT / CI: ${data.taxId}`:'Factura: no solicitada en el formulario','',
    'Solicito confirmar disponibilidad, entrega y forma de pago antes de finalizar la compra.'
  ].filter(x=>x!=='').join('\n');}
  const api={finalCents,referenceCents,normalizeCart,lines,totals,money,orderMessage};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ShopCore=api;
})(typeof window==='undefined'?globalThis:window);
