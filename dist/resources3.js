/* Resource pack 3: corporate identity and family photography. */
const R3=window.RESOURCE3_ASSETS;
const resource3=key=>R3[key];
const multiLogo=resource3('Logotipos MULTI INTERNACIONAL/Logotipo 1.1.png');
const familyImages={
 'antigrasa':'Archer Antigrasa.png','limpia-hornos':'Archer Limpia Hornos.png',
 'limpia-vidrios':'Archer Limpia Vidrios.png','multiuso':'Archer Limpiador Multiuso.png',
 'lustra-muebles':'Archer Lustra Mueble.png','vajillero':'Archer Detergente Vajillero.png',
 'desinfectante-pisos':'Archer Desinfectante de Piso Brisa de Mar.png',
 'classic-emulsion':'Classic Emulsión Corporal.png','classic-pepinos':'Classic Leche de Pepinos.png',
 'classic-jabon':'Classic Jabón Liquido Clásico.png',
 'classic-alcohol':'Classic Alcohol Liquido Antibacterial con Glicerina.png',
 'classic-sanitizador':'Classic Sanitizador de manos Frutos rojos.png',
 'biosilk-shampoo':'Biosilk shampoos.png'
};
for(const p of C){if(familyImages[p.id])p.image=resource3('Imagen Productos/'+familyImages[p.id])}
setHeaderBrand=function(){const a=document.querySelector('.header .logo');a.querySelector('img').src=multiLogo;a.querySelector('img').alt='Multi Internacional S.R.L.';a.setAttribute('aria-label','Multi Internacional, inicio')};
benefitStrip=function(){return `<div class="shell revision-benefits">${[['Fabricación Boliviana Azul.png','Fabricación boliviana','De nuestra fábrica a tu día a día'],['El formato que necesitas Azul.png','El formato que necesitas','Elige entre nuestras presentaciones'],['Atención por WhatsApp Azul.png','Atención por WhatsApp','Te acompañamos en tu pedido']].map(([file,title,text])=>`<div><img src="${resource3('Iconos/'+file)}" alt=""><span><b>${title}</b><small>${text}</small></span></div>`).join('')}</div>`};
const r3CategoryCards=categoryCards;
const r3Home=home;
home=function(){return r3Home().replace('<section class="section shell">',`<section class="shell resource3-promotion"><a href="#tienda"><img src="${resource3('Promoción/Promoción snt.png')}" alt="Descubre los productos de limpieza Archer" loading="lazy"><span>Encuentra lo que necesitas para limpiar tu hogar <b>Ver productos ↗</b></span></a></section><section class="section shell">`)};
categoryCards=function(names=['hogar','personal','institucional'],brand=''){let html=r3CategoryCards(names,brand);let i=0;return html.replace(/class="revision-category"/g,()=>`class="revision-category category-${names[i++]}"`)};
const r3Shop=shop;
shop=function(params){return r3Shop(params).replace('class="revision-shop-hero"',`class="revision-shop-hero category-${esc(params.get('categoria')||'todos')}"`)};
const r3FilterShop=filterShop;
filterShop=function(){r3FilterShop();const hero=document.querySelector('.revision-shop-hero');if(!hero)return;const brand=document.getElementById('brand-filter').value;const params=new URLSearchParams({categoria:shopCategory,marca:brand});const template=document.createElement('template');template.innerHTML=shop(params);hero.replaceWith(template.content.querySelector('.revision-shop-hero'));document.body.dataset.brand=brand.toLowerCase()};
const r3International=international;
international=function(){return r3International().replace('</section>',`</section><section class="shell regional-presence"><div><span class="eyebrow">NEGOCIOS INTERNACIONALES</span><h2>Conectamos con Sudamérica.</h2><p>Conoce nuestras marcas y conversa con el equipo sobre distribución y oportunidades comerciales en la región.</p><a class="button navy" href="#internacionales-contacto">Contactar al equipo ↗</a></div><img src="${resource3('Mapa 3D de Sudamérica.png')}" alt="Mapa ilustrativo de Sudamérica" loading="lazy"></section>`)};
const r3Card=card;
card=function(p,institutional=false){return r3Card(p,institutional).replace('class="product-card"',`class="product-card product-brand-${p.brand.toLowerCase()}"`)};
const r3ShowBrand=showBrand;
showBrand=function(index){r3ShowBrand(index);document.querySelector('.brand-slide')?.setAttribute('data-brand',brands[brandIndex].name.toLowerCase())};
const r3OpenProduct=openProduct;
openProduct=function(id,institutional=false){r3OpenProduct(id,institutional);productDialog.dataset.brand=selectedProduct.brand.toLowerCase();const select=document.getElementById('variant-select');const option=document.createElement('option');option.value='';option.textContent='Selecciona aroma y presentación';option.disabled=true;select.prepend(option);select.value='';select.required=true;document.getElementById('detail-image').src=institutional?selectedVariant.image:selectedProduct.image;document.getElementById('detail-image').alt=(institutional?'Formato 5 L ':'Familia ')+selectedProduct.brand+' '+selectedProduct.name;document.getElementById('detail-price').innerHTML='<p>Elige una presentación para ver su imagen y precio.</p>';const add=document.getElementById('add-product');add.disabled=true;add.textContent='Elige tu presentación';const caption=productDialog.querySelector('.detail-art-caption');if(caption)caption.textContent=(institutional?'Formato institucional · ':'Familia de productos · ')+selectedProduct.brand};
const r3UpdateVariant=updateVariant;
updateVariant=function(){r3UpdateVariant();document.getElementById('add-product').disabled=false;const caption=productDialog.querySelector('.detail-art-caption');if(caption)caption.textContent=selectedProduct.brand+' · '+selectedVariant.label};
const r3Route=route;
route=function(){r3Route();setHeaderBrand();const [page,query]=(location.hash.slice(1)||'inicio').split('?');document.body.dataset.page=page;const params=new URLSearchParams(query);document.body.dataset.brand=(params.get('marca')||params.get('nombre')||'').toLowerCase();document.title=document.title.replace(/\| Archer$/,'| Multi Internacional').replace(/^Archer \|/,'Multi Internacional |')};
window.removeEventListener('hashchange',r3Route);window.addEventListener('hashchange',route);
const footerFamily=document.querySelector('.footer-family');if(footerFamily){const corporate=document.createElement('a');corporate.href='#inicio';corporate.className='footer-corporate';corporate.innerHTML=`<img src="${multiLogo}" alt="Multi Internacional S.R.L.">`;footerFamily.prepend(corporate)}
route();
