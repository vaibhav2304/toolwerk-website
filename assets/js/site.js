/* =========================================================
   site.js — shared chrome, interactions, catalog & product
   ========================================================= */
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const telHref = p => 'tel:'+String(p).replace(/[^\d+]/g,'');
const waHref  = (n,t)=>'https://wa.me/'+String(n).replace(/\D/g,'')+'?text='+encodeURIComponent(t||'Hello, I would like an enquiry about your products.');

/* ---------------- Header ---------------- */
function buildHeader(active){
  const s=TW.s, cats=TW.cats;
  const cols = [0,1,2,3].map(i=>{
    const chunk = cats.filter((_,idx)=>idx%4===i);
    return `<div>${chunk.map(c=>`
      <h4><span class="dot"></span>${esc(c.name)}</h4>
      ${c.subs.map(sb=>`<a class="sub" href="products.html?cat=${c.slug}&sub=${sb.id}">${esc(sb.name)}</a>`).join('')}
      <a class="sub" style="font-weight:700;color:var(--amber-d)" href="products.html?cat=${c.slug}">View all ${esc(c.name)} →</a>`).join('')}</div>`;
  }).join('');

  const nav = [['index.html','Home','home'],['products.html','Products','products'],
               ['featured.html','Featured Range','featured'],['services.html','Services','services'],
               ['about.html','About','about'],['contact.html','Contact','contact']];

  $('#site-header').innerHTML = `
  <div class="topbar">
    <div class="wrap">
      <div class="tb-list hide-sm">
        <span>📍 ${esc(s.address.split(',').slice(-3).join(',').trim())}</span>
        <span>🕘 ${esc(s.hours)}</span>
      </div>
      <div class="tb-list">
        <a href="mailto:${esc(s.email)}">✉ ${esc(s.email)}</a>
        <a href="${telHref(s.phone)}" class="tb-badge">📞 ${esc(s.phone)}</a>
      </div>
    </div>
  </div>
  <header class="site-head" id="head">
    <div class="wrap nav">
      <a class="brand" href="index.html">
        <span class="mark">${esc(s.brand.charAt(0))}</span>
        <span>${esc(s.brand)}<small>${esc(s.brandSub)}</small></span>
      </a>
      <ul class="menu">
        ${nav.map(n=>{
          if(n[2]==='products') return `<li class="has-mega ${active===n[2]?'active':''}"><a href="${n[0]}">${n[1]} ▾</a>
            <div class="mega">${cols}
              <div class="mega-foot"><b>Can't find what you need? We stock 4,800+ SKUs.</b>
              <a class="btn btn-primary btn-sm" href="#" data-enquire="">Ask our team</a></div>
            </div></li>`;
          return `<li class="${active===n[2]?'active':''}"><a href="${n[0]}">${n[1]}</a></li>`;
        }).join('')}
      </ul>
      <div class="nav-cta">
        <a class="btn btn-outline btn-sm" href="${telHref(s.phone)}">📞 Call Now</a>
        <a class="btn btn-primary btn-sm" href="#" data-enquire="">Get Enquiry</a>
        <button class="burger" id="burger" aria-label="Open menu">☰</button>
      </div>
    </div>
  </header>
  <nav class="mobile-nav" id="mnav">
    <button class="mn-close" id="mclose" aria-label="Close">×</button>
    <div class="brand" style="color:#fff;margin-bottom:18px"><span class="mark">${esc(s.brand.charAt(0))}</span>${esc(s.brand)}</div>
    ${nav.map(n=>`<a href="${n[0]}">${n[1]}</a>`).join('')}
    <div style="margin:14px 0 8px;color:var(--amber);font-weight:800;font-size:.8rem;letter-spacing:.14em">CATEGORIES</div>
    <div class="m-sub">${cats.map(c=>`<a href="products.html?cat=${c.slug}">${c.icon} ${esc(c.name)}</a>`).join('')}</div>
    <div style="display:grid;gap:10px;margin-top:22px">
      <a class="btn btn-primary btn-block" href="${telHref(s.phone)}">📞 ${esc(s.phone)}</a>
      <a class="btn btn-ghost btn-block" href="#" data-enquire="">Send Enquiry</a>
    </div>
  </nav>
  <div class="scrim" id="scrim"></div>`;

  const mnav=$('#mnav'), scrim=$('#scrim');
  const close=()=>{mnav.classList.remove('open');scrim.classList.remove('on')};
  $('#burger').onclick=()=>{mnav.classList.add('open');scrim.classList.add('on')};
  $('#mclose').onclick=close; scrim.onclick=()=>{close(); $('.filters')?.classList.remove('open')};
  addEventListener('scroll',()=>$('#head').classList.toggle('scrolled',scrollY>10));
}

/* ---------------- Footer ---------------- */
function buildFooter(){
  const s=TW.s;
  $('#site-footer').innerHTML = `
  <footer class="site-foot">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <div class="brand"><span class="mark">${esc(s.brand.charAt(0))}</span><span>${esc(s.brand)}<small>${esc(s.brandSub)}</small></span></div>
          <p style="font-size:.9rem">${esc(s.tagline)}. Supplying industry across India with genuine equipment, real service backup and documentation you can put in front of an auditor.</p>
          <div class="social">
            <a href="${esc(s.social.fb)}" aria-label="Facebook">f</a><a href="${esc(s.social.in)}" aria-label="LinkedIn">in</a>
            <a href="${esc(s.social.yt)}" aria-label="YouTube">▶</a><a href="${esc(s.social.ig)}" aria-label="Instagram">◎</a>
          </div>
        </div>
        <div>
          <h4>Categories</h4>
          ${TW.cats.slice(0,6).map(c=>`<a href="products.html?cat=${c.slug}">${esc(c.name)}</a>`).join('')}
          <a href="products.html" style="color:var(--amber)">All products →</a>
        </div>
        <div>
          <h4>Company</h4>
          <a href="about.html">About Us</a><a href="services.html">Services</a>
          <a href="featured.html">Featured Range</a><a href="contact.html">Contact</a>
          <a href="admin.html">Admin Login</a>
        </div>
        <div>
          <h4>Get in touch</h4>
          <a href="${telHref(s.phone)}">📞 ${esc(s.phone)}</a>
          <a href="${telHref(s.phone2)}">📞 ${esc(s.phone2)}</a>
          <a href="mailto:${esc(s.email)}">✉ ${esc(s.email)}</a>
          <a href="${waHref(s.whatsapp)}">💬 WhatsApp us</a>
          <p style="font-size:.88rem;margin-top:10px">${esc(s.address)}</p>
          <p style="font-size:.82rem">GSTIN: ${esc(s.gst)}</p>
        </div>
      </div>
      <div class="foot-bottom">
        <span>© ${new Date().getFullYear()} ${esc(s.brand)}. All rights reserved.</span>
        <span>${esc(s.hours)} · Prices on enquiry — no public price list.</span>
      </div>
    </div>
  </footer>
  <div class="fab">
    <a class="wa" href="${waHref(s.whatsapp)}" aria-label="WhatsApp">💬</a>
    <a class="cl" href="${telHref(s.phone)}" aria-label="Call">📞</a>
  </div>
  <div class="mobile-bar">
    <a href="${telHref(s.phone)}">📞 Call</a>
    <a href="${waHref(s.whatsapp)}">💬 WhatsApp</a>
    <a class="amber" href="#" data-enquire="">✉ Enquire</a>
  </div>`;
}

/* ---------------- Enquiry modal (global lead capture) ---------------- */
function buildModal(){
  const d=document.createElement('div');
  d.className='modal'; d.id='enqModal';
  d.innerHTML=`<div class="sheet">
    <div class="mhead">
      <div><h3 id="enqTitle">Send an Enquiry</h3>
        <p>Share your requirement — our team reverts with availability, options and pricing within 4 working hours.</p></div>
      <button class="mclose" id="enqClose" aria-label="Close">×</button>
    </div>
    <div class="mbody">
      <div id="enqDone" class="form-ok" hidden>✔ Thank you — your enquiry is logged. Our team will call you shortly.</div>
      <form id="enqForm" class="form-grid">
        <div class="field"><label>Your Name *</label><input name="name" required placeholder="Full name"></div>
        <div class="field"><label>Mobile Number *</label><input name="phone" required pattern="[0-9+ ]{8,15}" placeholder="10-digit mobile"></div>
        <div class="field"><label>Email</label><input type="email" name="email" placeholder="you@company.com"></div>
        <div class="field"><label>Company</label><input name="company" placeholder="Company name"></div>
        <div class="field full"><label>Product / Requirement</label><input name="product" id="enqProduct" placeholder="e.g. 250A inverter welder"></div>
        <div class="field"><label>Quantity</label><input name="qty" placeholder="e.g. 5 units"></div>
        <div class="field"><label>City</label><input name="city" placeholder="City / State"></div>
        <div class="field full"><label>Message</label><textarea name="message" placeholder="Specifications, application, timeline…"></textarea></div>
        <div class="field full">
          <button class="btn btn-primary btn-block" type="submit">Submit Enquiry →</button>
          <p class="form-note">Or call <a href="${telHref(TW.s.phone)}"><b>${esc(TW.s.phone)}</b></a> · We never share your details.</p>
        </div>
      </form>
    </div></div>`;
  document.body.appendChild(d);
  const close=()=>d.classList.remove('on');
  $('#enqClose').onclick=close;
  d.addEventListener('click',e=>{if(e.target===d)close()});
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  $('#enqForm').addEventListener('submit',e=>{
    e.preventDefault();
    const f=new FormData(e.target), o={source:'Enquiry Modal'};
    f.forEach((v,k)=>o[k]=v);
    TW.addLead(o);
    $('#enqDone').hidden=false; e.target.reset();
    setTimeout(close,2600);
  });
  document.addEventListener('click',e=>{
    const t=e.target.closest('[data-enquire]');
    if(!t) return;
    e.preventDefault();
    const p=t.getAttribute('data-enquire');
    $('#enqProduct').value = p || '';
    $('#enqTitle').textContent = p ? 'Enquire: '+p : 'Send an Enquiry';
    $('#enqDone').hidden=true;
    d.classList.add('on');
  });
}

/* ---------------- Scroll reveal + parallax ---------------- */
function initMotion(){
  const io=new IntersectionObserver((es)=>es.forEach(en=>{
    if(en.isIntersecting){en.target.classList.add('in');io.unobserve(en.target)}
  }),{threshold:.12,rootMargin:'0px 0px -40px'});
  $$('[data-reveal]').forEach(el=>io.observe(el));

  const layers=$$('.pbg,.hero-bg');
  if(layers.length && !matchMedia('(prefers-reduced-motion:reduce)').matches){
    let tick=false;
    addEventListener('scroll',()=>{
      if(tick) return; tick=true;
      requestAnimationFrame(()=>{
        layers.forEach(l=>{
          const r=l.parentElement.getBoundingClientRect();
          if(r.bottom>-200 && r.top<innerHeight+200){
            const off=(r.top-innerHeight/2)*0.09;
            l.style.transform=`translate3d(0,${off.toFixed(1)}px,0) scale(1.12)`;
          }
        });
        tick=false;
      });
    },{passive:true});
  }
  // counters
  $$('[data-count]').forEach(el=>{
    const io2=new IntersectionObserver(es=>es.forEach(en=>{
      if(!en.isIntersecting) return; io2.disconnect();
      const raw=el.dataset.count, num=parseFloat(raw.replace(/[^\d.]/g,''));
      if(isNaN(num)){el.textContent=raw;return}
      const suf=raw.replace(/[\d.,]/g,''); let i=0, steps=44;
      const t=setInterval(()=>{i++; el.textContent=Math.round(num*i/steps).toLocaleString('en-IN')+suf;
        if(i>=steps){el.textContent=raw;clearInterval(t)}},22);
    }),{threshold:.5});
    io2.observe(el);
  });
}

/* ---------------- Product card ---------------- */
function cardHTML(p){
  const c=TW.cat(p.cat), s=TW.sub(p.cat,p.sub);
  return `<article class="prod-card" data-reveal>
    <a class="ph" href="product.html?id=${p.id}">
      ${p.badge?`<span class="badge">${esc(p.badge)}</span>`:''}
      <img src="${p.images[0]}" alt="${esc(p.name)}" loading="lazy">
    </a>
    <div class="body">
      <div class="brandline">${esc(p.brand||'')}${p.model?' · '+esc(p.model):''}</div>
      <h3><a href="product.html?id=${p.id}">${esc(p.name)}</a></h3>
      <p class="desc">${esc(p.short)}</p>
      <div class="meta"><span>${esc(c?c.name:'')}${s?' / '+esc(s.name):''}</span><span>${esc(p.stock||'')}</span></div>
      <div class="acts">
        <a class="btn btn-outline btn-sm" href="product.html?id=${p.id}">Details</a>
        <a class="btn btn-primary btn-sm" href="#" data-enquire="${esc(p.name)}">Enquire</a>
      </div>
    </div>
  </article>`;
}

/* ---------------- Rails ---------------- */
function initRails(){
  $$('.rail-wrap').forEach(w=>{
    const rail=$('.rail',w);
    $$('.rail-nav button',w).forEach(b=>b.onclick=()=>{
      rail.scrollBy({left:(b.dataset.dir==='next'?1:-1)*(rail.clientWidth*0.8),behavior:'smooth'});
    });
  });
}

/* ---------------- Catalog page ---------------- */
function initCatalog(){
  const q=new URLSearchParams(location.search);
  const state={cat:q.get('cat')||'',sub:q.get('sub')||'',q:q.get('q')||'',brand:'',sort:'featured'};

  const side=$('#filters'), grid=$('#grid'), count=$('#count'), chips=$('#chips');
  const brands=[...new Set(TW.prods.map(p=>p.brand).filter(Boolean))].sort();

  function renderFilters(){
    side.innerHTML=`
    <div class="fgroup">
      <h4>Categories</h4>
      <div><label style="font-weight:700"><input type="radio" name="cat" value="" ${!state.cat?'checked':''}> All Categories</label></div>
      ${TW.cats.map(c=>`
        <div class="f-cat ${state.cat===c.slug?'open':''}" data-slug="${c.slug}">
          <button type="button">${c.icon} ${esc(c.name)} <span style="color:var(--steel);font-weight:600">${TW.countIn(c.id)}</span></button>
          <div class="subs">
            <label><input type="radio" name="cat" value="${c.slug}" ${state.cat===c.slug&&!state.sub?'checked':''}> All ${esc(c.name)}</label>
            ${c.subs.map(s=>`<label><input type="radio" name="sub" value="${c.slug}|${s.id}" ${state.sub===s.id?'checked':''}> ${esc(s.name)}</label>`).join('')}
          </div>
        </div>`).join('')}
    </div>
    <div class="fgroup">
      <h4>Brand</h4>
      <label><input type="radio" name="brand" value="" ${!state.brand?'checked':''}> All brands</label>
      ${brands.map(b=>`<label><input type="radio" name="brand" value="${esc(b)}" ${state.brand===b?'checked':''}> ${esc(b)}</label>`).join('')}
    </div>
    <div class="fgroup">
      <button class="btn btn-outline btn-block btn-sm" id="clearF">Clear all filters</button>
      <div style="margin-top:14px;background:var(--ink);color:#fff;padding:16px;border-radius:4px">
        <b style="font-family:var(--font-head);font-size:1.15rem;display:block">Can't find it?</b>
        <p style="font-size:.85rem;color:var(--on-dark-mute);margin:6px 0 12px">We source non-catalogue and imported items on request.</p>
        <a class="btn btn-primary btn-sm btn-block" href="#" data-enquire="">Ask our team</a>
      </div>
    </div>`;
    $$('.f-cat > button',side).forEach(b=>b.onclick=()=>b.parentElement.classList.toggle('open'));
    $$('input[name=cat]',side).forEach(i=>i.onchange=()=>{state.cat=i.value;state.sub='';render()});
    $$('input[name=sub]',side).forEach(i=>i.onchange=()=>{const[c,s]=i.value.split('|');state.cat=c;state.sub=s;render()});
    $$('input[name=brand]',side).forEach(i=>i.onchange=()=>{state.brand=i.value;render()});
    $('#clearF').onclick=()=>{state.cat=state.sub=state.q=state.brand='';$('#q').value='';render()};
  }

  function render(){
    const cat=state.cat?TW.catBySlug(state.cat):null;
    let list=TW.prods.filter(p=>{
      if(cat && p.cat!==cat.id) return false;
      if(state.sub && p.sub!==state.sub) return false;
      if(state.brand && p.brand!==state.brand) return false;
      if(state.q){
        const hay=(p.name+' '+p.short+' '+p.brand+' '+p.model+' '+p.sku+' '+(p.tags||[]).join(' ')).toLowerCase();
        if(!hay.includes(state.q.toLowerCase())) return false;
      }
      return true;
    });
    const sorters={featured:(a,b)=>(b.featured?1:0)-(a.featured?1:0),
                   az:(a,b)=>a.name.localeCompare(b.name),
                   za:(a,b)=>b.name.localeCompare(a.name),
                   brand:(a,b)=>(a.brand||'').localeCompare(b.brand||'')};
    list.sort(sorters[state.sort]||sorters.featured);

    count.textContent=`${list.length} product${list.length!==1?'s':''} found`;
    grid.innerHTML = list.length ? list.map(cardHTML).join('')
      : `<div class="empty" style="grid-column:1/-1"><h3>No products match those filters</h3>
         <p style="color:var(--steel)">We stock over 4,800 SKUs — many are not listed online. Tell us what you need.</p>
         <a class="btn btn-primary" href="#" data-enquire="">Send a requirement</a></div>`;

    const active=[];
    if(cat) active.push(['Category: '+cat.name,()=>{state.cat='';state.sub=''}]);
    if(state.sub){const s=TW.sub(cat?cat.id:'',state.sub); if(s) active.push(['Type: '+s.name,()=>state.sub='']);}
    if(state.brand) active.push(['Brand: '+state.brand,()=>state.brand='']);
    if(state.q) active.push(['Search: '+state.q,()=>{state.q='';$('#q').value=''}]);
    chips.innerHTML=active.map((a,i)=>`<span class="chip">${esc(a[0])}<button data-i="${i}">×</button></span>`).join('');
    $$('#chips button').forEach(b=>b.onclick=()=>{active[+b.dataset.i][1]();render()});

    $('#catTitle').textContent = cat ? cat.name : (state.q?`Search: “${state.q}”`:'All Products');
    $('#catDesc').textContent  = cat ? cat.desc : 'Browse the complete range of industrial tools, equipment and machinery. Filter by category, type or brand — every item ships with warranty and full documentation.';
    $('#crumbNow').textContent = cat ? cat.name : 'All Products';

    const url=new URL(location); url.search='';
    if(state.cat)url.searchParams.set('cat',state.cat);
    if(state.sub)url.searchParams.set('sub',state.sub);
    if(state.q)url.searchParams.set('q',state.q);
    history.replaceState(null,'',url);
    renderFilters();
    initMotion();
  }

  $('#q').value=state.q;
  $('#searchForm').onsubmit=e=>{e.preventDefault();state.q=$('#q').value.trim();render()};
  $('#sort').onchange=e=>{state.sort=e.target.value;render()};
  $('#openFilters').onclick=()=>{side.classList.add('open');$('#scrim').classList.add('on')};
  render();
}

/* ---------------- Product detail ---------------- */
function initProduct(){
  const id=new URLSearchParams(location.search).get('id');
  const p=TW.prod(id);
  const root=$('#pdRoot');
  if(!p){ root.innerHTML=`<div class="wrap empty" style="margin:60px auto"><h2>Product not found</h2>
    <p style="color:var(--steel)">It may have been renamed or removed from the catalogue.</p>
    <a class="btn btn-primary" href="products.html">Browse all products</a></div>`; return; }

  document.title=`${p.name} — ${TW.s.brand}`;
  const c=TW.cat(p.cat), sb=TW.sub(p.cat,p.sub);
  const related=TW.prods.filter(x=>x.cat===p.cat&&x.id!==p.id).slice(0,4);

  root.innerHTML=`
  <div class="crumbs"><div class="wrap">
    <a href="index.html">Home</a> / <a href="products.html">Products</a> /
    <a href="products.html?cat=${c?c.slug:''}">${esc(c?c.name:'')}</a> /
    <span>${esc(p.name)}</span>
  </div></div>
  <div class="wrap pd">
    <div class="gallery" data-reveal>
      <div class="main"><img id="mainImg" src="${p.images[0]}" alt="${esc(p.name)}"></div>
      <div class="thumbs">${p.images.map((im,i)=>`<button class="${i?'':'on'}" data-i="${i}"><img src="${im}" alt=""></button>`).join('')}</div>
      <div class="trust">
        <span>✔ Genuine & warranted</span><span>🚚 Pan-India dispatch</span>
        <span>📄 GST invoice + test certificate</span><span>🛠 Service backup</span>
      </div>
    </div>
    <div data-reveal data-d="1">
      <div class="brandline">${esc(p.brand||'')}${p.model?' · Model '+esc(p.model):''}</div>
      <h1>${esc(p.name)}</h1>
      <p class="lead">${esc(p.short)}</p>
      <div class="skuline">
        <span>SKU: <b>${esc(p.sku||'—')}</b></span>
        <span>Category: <b>${esc(c?c.name:'')}${sb?' / '+esc(sb.name):''}</b></span>
        <span>Availability: <b style="color:var(--green)">${esc(p.stock||'On enquiry')}</b></span>
        <span>MOQ: <b>${esc(p.moq||'1')}</b></span>
      </div>
      <div class="buybox">
        <h3>Price on enquiry</h3>
        <p>Industrial pricing depends on configuration, quantity and delivery location. Send an enquiry and our team reverts with a firm quote, alternatives and a delivery date — usually within 4 working hours.</p>
        <div class="row">
          <a class="btn btn-primary" href="#" data-enquire="${esc(p.name)} (${esc(p.sku||'')})">✉ Send Enquiry</a>
          <a class="btn btn-dark" href="${telHref(TW.s.phone)}">📞 Call ${esc(TW.s.phone)}</a>
        </div>
        <div class="row">
          <a class="btn btn-outline" href="${waHref(TW.s.whatsapp,'Hi, I want details on '+p.name+' ('+(p.sku||'')+')')}">💬 WhatsApp this product</a>
        </div>
      </div>
      ${p.includes?`<p style="font-size:.9rem;margin-top:14px"><b>Supplied with:</b> ${esc(p.includes)}</p>`:''}
    </div>
  </div>

  <div class="wrap tabs" data-reveal>
    <div class="tabbar">
      <button class="on" data-t="desc">Description</button>
      <button data-t="spec">Technical Specifications</button>
      <button data-t="feat">Features</button>
      <button data-t="app">Applications</button>
      <button data-t="enq">Enquire</button>
    </div>
    <div class="tabpane on" id="t-desc">${p.desc.split('\n\n').map(x=>`<p>${esc(x)}</p>`).join('')}</div>
    <div class="tabpane" id="t-spec">
      <table class="spec"><tbody>
        ${(p.specs||[]).map(r=>`<tr><th>${esc(r[0])}</th><td>${esc(r[1])}</td></tr>`).join('')}
      </tbody></table>
      <p class="form-note">Specifications are indicative and may change with manufacturer revisions. Confirm critical dimensions with our team before ordering.</p>
    </div>
    <div class="tabpane" id="t-feat"><ul class="ticks">${(p.features||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul></div>
    <div class="tabpane" id="t-app"><ul class="ticks">${(p.applications||[]).map(f=>`<li>${esc(f)}</li>`).join('')}</ul></div>
    <div class="tabpane" id="t-enq">
      <div style="max-width:680px">
        <h3>Enquire about this product</h3>
        <div id="pdOk" class="form-ok" hidden>✔ Enquiry received. Our team will contact you shortly.</div>
        <form id="pdForm" class="form-grid">
          <div class="field"><label>Name *</label><input name="name" required></div>
          <div class="field"><label>Mobile *</label><input name="phone" required></div>
          <div class="field"><label>Email</label><input type="email" name="email"></div>
          <div class="field"><label>Quantity</label><input name="qty" placeholder="e.g. 2 units"></div>
          <div class="field full"><label>Message</label><textarea name="message" placeholder="Application, specification or delivery requirement"></textarea></div>
          <div class="field full"><button class="btn btn-primary btn-block">Submit Enquiry →</button></div>
        </form>
      </div>
    </div>
  </div>

  ${related.length?`<section class="section alt tight">
    <div class="wrap">
      <div class="rail-head"><div><span class="kicker">Same category</span><h2>Related Equipment</h2></div>
        <a class="btn btn-outline btn-sm" href="products.html?cat=${c.slug}">View all ${esc(c.name)}</a></div>
      <div class="prod-grid">${related.map(cardHTML).join('')}</div>
    </div></section>`:''}

  <section class="parallax">
    <div class="pbg" style="background-image:url('${TW.s.ctaBand.img}')"></div>
    <div class="wrap"><div style="max-width:640px">
      <span class="kicker">Need help choosing?</span>
      <h2>${esc(TW.s.ctaBand.title)}</h2>
      <p style="color:#E7ECF1">${esc(TW.s.ctaBand.text)}</p>
      <div class="hero-actions">
        <a class="btn btn-primary" href="#" data-enquire="">Talk to a specialist</a>
        <a class="btn btn-ghost" href="${telHref(TW.s.phone)}">📞 ${esc(TW.s.phone)}</a>
      </div>
    </div></div>
  </section>`;

  $$('.thumbs button').forEach(b=>b.onclick=()=>{
    $$('.thumbs button').forEach(x=>x.classList.remove('on'));
    b.classList.add('on'); $('#mainImg').src=p.images[+b.dataset.i];
  });
  $$('.tabbar button').forEach(b=>b.onclick=()=>{
    $$('.tabbar button').forEach(x=>x.classList.remove('on')); b.classList.add('on');
    $$('.tabpane').forEach(x=>x.classList.remove('on')); $('#t-'+b.dataset.t).classList.add('on');
  });
  $('#pdForm').onsubmit=e=>{
    e.preventDefault();
    const o={source:'Product Page',product:p.name+' ('+(p.sku||'')+')'};
    new FormData(e.target).forEach((v,k)=>o[k]=v);
    TW.addLead(o); $('#pdOk').hidden=false; e.target.reset();
  };
  initRails(); initMotion();
}

/* ---------------- Generic page form binder ---------------- */
function bindForm(sel,source,okSel){
  const f=$(sel); if(!f) return;
  f.onsubmit=e=>{
    e.preventDefault();
    const o={source};
    new FormData(f).forEach((v,k)=>o[k]=v);
    TW.addLead(o); $(okSel).hidden=false; f.reset();
    $(okSel).scrollIntoView({behavior:'smooth',block:'center'});
  };
}

/* ---------------- Boot ---------------- */
function boot(active){
  TW.load(); buildHeader(active); buildFooter(); buildModal(); initMotion(); initRails();
}
