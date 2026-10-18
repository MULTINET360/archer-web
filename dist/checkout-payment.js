/* A static QR is not a bank confirmation. Only staff verify payment. */
const QR_PAYMENT={image:'assets/pago-bnb-multi.png',payee:'Multi Internacional S.R.L.',expires:'2027-07-27T23:59:59-04:00'};
const deliveryTiles='https://tile.openstreetmap.org/{z}/{x}/{y}.png';
let deliveryMap=null,deliveryMarker=null,paymentCartSnapshot='';
const cartSignature=()=>JSON.stringify(S.normalizeCart(cart,C));
const qrAvailable=()=>Date.now()<=Date.parse(QR_PAYMENT.expires);
function deliveryPicker(){return `<div class="delivery-picker"><p>Marca tu dirección en el mapa para calcular el delivery. También puedes escribir una referencia debajo.</p><div class="map-actions"><button type="button" class="button navy small" id="locate-delivery">Usar mi ubicación</button><button type="button" class="text-button" id="confirm-map-center">Marcar centro del mapa</button></div><div id="delivery-map" role="region" aria-label="Mapa de entrega. Usa las flechas para moverte y el botón Marcar centro del mapa para seleccionar."></div><p class="micro" id="map-status" role="status">Toca el mapa para colocar el pin; puedes arrastrarlo para ajustar.</p><input type="hidden" name="latitude"><input type="hidden" name="longitude"><p class="micro">El mapa utiliza OpenStreetMap. La ubicación del dispositivo se solicita solo al pulsar el botón. La selección se comparte con Archer cuando envías tu pedido.</p></div>`}

function deliveryOptions(){return `<label class="field">¿Cómo quieres recibir tu pedido?<select name="deliveryMethod" id="delivery-method"><option value="delivery">Delivery a mi dirección</option><option value="pickup">Recojo en planta · Gratis</option></select></label><p class="micro"><a href="${S.deliveryPolicy.mapUrl}" target="_blank" rel="noopener">Ver ubicación de la planta ↗</a></p><p id="delivery-cost" role="status"></p>`}
function syncDelivery(){
 const form=document.getElementById('order-form');if(!form)return;
 const pickup=form.querySelector('[name=deliveryMethod]')?.value==='pickup';
 const location=form.querySelector('[name=location]');location.required=!pickup;location.closest('label').hidden=pickup;
 const picker=form.querySelector('.delivery-picker');if(picker)picker.hidden=pickup;
 orderDraft=Object.fromEntries(new FormData(form));
 const d=S.delivery(S.totals(cart,C).totalCents,orderDraft),status=document.getElementById('delivery-cost');
 if(status)status.textContent=d.label+(d.feeCents===null?'':' · '+money(d.feeCents))+(d.distanceKm===null?'':' · '+d.distanceKm.toFixed(2)+' km en línea recta desde planta');
 document.querySelectorAll('.order-aside .totals').forEach(el=>{el.outerHTML=summary()});
 if(!pickup&&deliveryMap)deliveryMap.invalidateSize();
}
document.addEventListener('change',event=>{if(event.target.id==='delivery-method')syncDelivery()});

const checkoutBeforePayment=checkout;
checkout=function(){return checkoutBeforePayment().replace('<div class="form-grid"><label class="field wide">Ubicación de entrega',deliveryOptions()+deliveryPicker()+'<div class="form-grid"><label class="field wide">Ubicación de entrega')};
function disposeDeliveryMap(){if(deliveryMap){deliveryMap.remove();deliveryMap=null;deliveryMarker=null}}
function initializeDeliveryMap(){
 const el=document.getElementById('delivery-map');if(!el)return;
 if(!window.L){document.getElementById('map-status').textContent='No se pudo cargar el mapa. Escribe tu dirección y solicita el costo de envío, o elige recojo en planta.';syncDelivery();return}
 deliveryMap=L.map(el,{scrollWheelZoom:false}).setView([S.deliveryPolicy.latitude,S.deliveryPolicy.longitude],12);
 L.tileLayer(deliveryTiles,{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(deliveryMap).on('tileerror',()=>{const status=document.getElementById('map-status');if(status)status.textContent='Algunas calles no pudieron cargarse. Puedes escribir tu dirección debajo.'});
 const lat=document.querySelector('[name=latitude]').value,lng=document.querySelector('[name=longitude]').value;
 if(lat!==''&&lng!==''&&Number.isFinite(Number(lat))&&Number.isFinite(Number(lng))){markDelivery(Number(lat),Number(lng),false);deliveryMap.setView([Number(lat),Number(lng)],16)}
 deliveryMap.on('click',event=>markDelivery(event.latlng.lat,event.latlng.lng));
 L.marker([S.deliveryPolicy.latitude,S.deliveryPolicy.longitude]).addTo(deliveryMap).bindPopup('Multi Internacional · Recojo en planta');
 syncDelivery();
}
function markDelivery(lat,lng,save=true){
 if(!deliveryMap||!Number.isFinite(lat)||!Number.isFinite(lng))return;
 if(!deliveryMarker){deliveryMarker=L.marker([lat,lng],{draggable:true,icon:L.divIcon({className:'delivery-pin',html:'<span aria-hidden="true">●</span>',iconSize:[32,40],iconAnchor:[16,38]}),title:'Punto de entrega: arrastra para ajustar'}).addTo(deliveryMap);deliveryMarker.on('dragend',()=>{const pos=deliveryMarker.getLatLng();markDelivery(pos.lat,pos.lng)})}else deliveryMarker.setLatLng([lat,lng]);
 if(save){document.querySelector('[name=latitude]').value=lat.toFixed(6);document.querySelector('[name=longitude]').value=lng.toFixed(6);document.querySelector('[name=location]').value='https://www.google.com/maps?q='+lat.toFixed(6)+','+lng.toFixed(6);orderDraft=Object.fromEntries(new FormData(document.getElementById('order-form')))}
 document.getElementById('map-status').textContent='Punto seleccionado. Comprueba que el pin esté en tu dirección de entrega.';syncDelivery();
}
const paymentPreviousRoute=route;
route=function(){disposeDeliveryMap();paymentCartSnapshot='';paymentPreviousRoute();initializeDeliveryMap()};
window.removeEventListener('hashchange',paymentPreviousRoute);window.addEventListener('hashchange',route);
const paymentPreviousRestore=restoreOrder;
restoreOrder=function(){disposeDeliveryMap();paymentCartSnapshot='';paymentPreviousRestore();initializeDeliveryMap()};
reviewOrder=function(data){
 orderDraft=data;disposeDeliveryMap();paymentCartSnapshot=cartSignature();const t=S.totals(cart,C),d=S.delivery(t.totalCents,data),amount=t.totalCents+(d.feeCents||0),canPay=!t.hasQuote&&d.feeCents!==null&&amount>0&&qrAvailable();
 const form=document.getElementById('order-form');form.id='payment-form';
 form.innerHTML=`<section class="form-section"><span class="eyebrow">REVISA TU PEDIDO</span><h2>Tu compra, paso a paso.</h2><dl class="review-details"><div><dt>Cliente</dt><dd>${esc(data.name)} · ${esc(data.phone)}</dd></div><div><dt>Entrega</dt><dd>${esc(d.label)}${data.deliveryMethod==='pickup'?'':' · '+esc(data.location)}</dd></div><div><dt>Factura</dt><dd>${esc(data.business)} · ${esc(data.taxId)}</dd></div>${data.notes?`<div><dt>Comentarios</dt><dd>${esc(data.notes)}</dd></div>`:''}</dl></section>${canPay?`<section class="qr-payment"><span class="eyebrow">PAGA DESDE TU APLICACIÓN BANCARIA</span><h2>Pago por QR BNB</h2><div class="payment-amount"><span>Total a pagar · productos y entrega</span><strong>${money(amount)}</strong><small>Productos: ${money(t.totalCents)} · Entrega: ${money(d.feeCents)} · Impuestos incluidos</small></div><img class="payment-qr" src="${QR_PAYMENT.image}" alt="QR BNB de Multi Internacional S.R.L. para pagar desde tu aplicación bancaria"><a class="text-link" href="${QR_PAYMENT.image}" download="QR-BNB-Multi.png">Descargar QR para mi aplicación bancaria ↓</a><ol><li>Escanea o importa el QR en tu aplicación bancaria.</li><li>Comprueba el destinatario: <b>${QR_PAYMENT.payee}</b>. El QR no fija el importe: ingresa exactamente <b>${money(amount)}</b>.</li><li>Realiza el pago y guarda el comprobante.</li><li>Continúa a WhatsApp y adjunta el comprobante en el chat. El equipo verificará el abono antes de facturar.</li></ol><p class="micro">QR válido hasta el 27 de julio de 2027. La página no recibe confirmaciones del banco.</p><label class="payment-declaration"><input type="checkbox" id="payment-reported" required> Ya realicé el pago y enviaré el comprobante por WhatsApp.</label><p class="payment-status" role="status">Pago pendiente de verificación por el equipo.</p><button type="submit" class="button full" id="prepare-verification" disabled>Continuar a verificación por WhatsApp ↗</button><div id="payment-handoff"></div></section>`:`<div class="confirmation-note"><h2>${t.hasQuote?'Primero confirmemos el precio.':'Consulta con nuestro equipo.'}</h2><p>${t.hasQuote?'Tu carrito incluye productos por cotizar. No pagues un subtotal: solicita el importe completo antes de realizar el pago.':d.feeCents===null?'Necesitamos confirmar el costo de entrega. Marca una ubicación dentro de cobertura, elige recojo en planta o solicita cotización. No pagues todavía.':'Este QR no está disponible para cobrar. Solicita un medio de pago vigente antes de pagar.'}</p><a class="button navy" href="${wa(S.orderMessage(cart,C,data))}" target="_blank" rel="noopener">Solicitar confirmación por WhatsApp ↗</a></div>`}<button type="button" class="text-button" id="edit-order">Volver a editar mis datos</button>`;
 form.scrollIntoView({behavior:'smooth',block:'start'});
};
document.addEventListener('click',event=>{
 if(event.target.closest('#send-order')&&(cartSignature()!==paymentCartSnapshot||!qrAvailable()||!document.getElementById('payment-reported')?.checked)){event.preventDefault();toast('Revisa de nuevo el pedido y el importe antes de continuar.');restoreOrder();return}
 if(event.target.closest('#confirm-map-center')&&deliveryMap){const pos=deliveryMap.getCenter();markDelivery(pos.lat,pos.lng)}
 if(event.target.closest('#locate-delivery')){
  const currentMap=deliveryMap,status=document.getElementById('map-status');if(!currentMap||!status)return;
  if(!navigator.geolocation){status.textContent='Tu navegador no ofrece ubicación. Marca el punto en el mapa o escribe tu dirección.';return}
  status.textContent='Buscando tu ubicación…';navigator.geolocation.getCurrentPosition(pos=>{if(deliveryMap!==currentMap)return;markDelivery(pos.coords.latitude,pos.coords.longitude);deliveryMap.setView([pos.coords.latitude,pos.coords.longitude],17)},()=>{if(deliveryMap===currentMap)status.textContent='No se obtuvo tu ubicación. Puedes marcar el punto manualmente o escribir tu dirección.'},{enableHighAccuracy:true,timeout:12000,maximumAge:60000});
 }
});
document.addEventListener('input',event=>{if(event.target.name==='location'){if(deliveryMarker){deliveryMarker.remove();deliveryMarker=null}document.querySelector('[name=latitude]').value='';document.querySelector('[name=longitude]').value='';orderDraft=Object.fromEntries(new FormData(document.getElementById('order-form')));syncDelivery()}});
document.addEventListener('change',event=>{if(event.target.id==='payment-reported'){document.getElementById('prepare-verification').disabled=!event.target.checked;document.getElementById('payment-handoff').innerHTML=''}});
document.addEventListener('submit',event=>{
 if(event.target.id!=='payment-form')return;event.preventDefault();
 if(cartSignature()!==paymentCartSnapshot){toast('Tu carrito cambió. Revisa el nuevo total antes de pagar.');restoreOrder();return}
 const t=S.totals(cart,C);if(t.hasQuote||S.delivery(t.totalCents,orderDraft||{}).feeCents===null||!qrAvailable()||!document.getElementById('payment-reported')?.checked)return;
 const data={...orderDraft,paymentReported:true};
 document.getElementById('payment-handoff').innerHTML=`<div class="confirmation-note"><b>Falta enviar tu comprobante.</b><p>Abre WhatsApp, envía el pedido y adjunta allí la imagen del comprobante. Este botón no confirma el pago ni envía una factura.</p></div><a class="button full whatsapp" id="send-order" href="${wa(S.orderMessage(cart,C,data))}" target="_blank" rel="noopener">Abrir WhatsApp y adjuntar comprobante ↗</a>`;
 document.getElementById('send-order').focus();
});
route();
