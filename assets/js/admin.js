/* =========================================================
   admin.js — WordPress-style control panel for the site
   Login: admin / admin (changeable in Settings → Admin Access)
   All content is stored in localStorage via the TW layer.
   ========================================================= */
const $  = (s,r=document)=>r.querySelector(s);
const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
const esc = s => String(s==null?'':s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const CRED_KEY='TW_ADMIN_CRED';

function creds(){
  try{ return JSON.parse(localStorage.getItem(CRED_KEY)) || {u:'admin',p:'admin'} }
  catch(e){ return {u:'admin',p:'admin'} }
}
function toast(msg,bad){
  const n=$('#notice'); n.textContent=msg; n.classList.toggle('err',!!bad); n.classList.add('on');
  clearTimeout(n._t); n._t=setTimeout(()=>n.classList.remove('on'),2400);
}
function save(){ TW.save(); $('#savedAt').textContent='Saved '+new Date().toLocaleTimeString(); }

/* ---------- Auth ---------- */
$('#loginForm').onsubmit=e=>{
  e.preventDefault();
  const c=creds();
  if($('#u').value.trim()===c.u && $('#p').value===c.p){
    sessionStorage.setItem('TW_ADMIN_IN','1'); openPanel();
  } else $('#loginErr').classList.remove('hidden');
};
$('#logout').onclick=e=>{e.preventDefault();sessionStorage.removeItem('TW_ADMIN_IN');location.reload()};

const MENU=[['dashboard','📊 Dashboard'],['products','📦 Products'],['categories','🗂 Categories'],
            ['content','🎨 Homepage & Content'],['leads','📥 Enquiries'],['settings','⚙️ Site Settings'],['tools','🧰 Tools & Backup']];

function openPanel(){
  $('#login').classList.add('hidden'); $('#panel').classList.remove('hidden');
  TW.load();
  $('#nav').innerHTML=MENU.map(m=>`<a href="#${m[0]}" data-r="${m[0]}">${m[1]}</a>`).join('');
  addEventListener('hashchange',route); route();
}
function route(){
  const r=(location.hash.replace('#','')||'dashboard').split('/');
  $$('#nav a').forEach(a=>a.classList.toggle('on',a.dataset.r===r[0]));
  const m=MENU.find(x=>x[0]===r[0]);
  $('#crumb').textContent = m ? m[1].replace(/^\S+\s/,'') : (r[0]==='product'?'Products › Edit':'Dashboard');
  ({dashboard:vDash,products:vProducts,product:vProductEdit,categories:vCats,
    content:vContent,leads:vLeads,settings:vSettings,tools:vTools}[r[0]]||vDash)(r[1]);
  scrollTo(0,0);
}

/* ---------- Dashboard ---------- */
function vDash(){
  const db=TW.load(), nl=db.leads.filter(l=>l.status==='New').length;
  $('#view').innerHTML=`
  <h1>Dashboard</h1>
  <p style="color:var(--ad-mute);margin-top:-6px">Everything on the public website is edited from here. Changes save instantly to this browser — use <b>Tools &amp; Backup</b> to export a file you can hand to your developer or load on another machine.</p>
  <div class="tiles">
    <div class="tile"><b>${db.products.length}</b><span>Products live</span></div>
    <div class="tile a"><b>${db.categories.length}</b><span>Categories</span></div>
    <div class="tile g"><b>${db.products.filter(p=>p.featured).length}</b><span>Featured products</span></div>
    <div class="tile r"><b>${nl}</b><span>New enquiries</span></div>
  </div>
  <div class="card"><h3>Quick actions</h3><div class="inner" style="display:flex;gap:10px;flex-wrap:wrap">
    <a class="b" href="#product/new">+ Add New Product</a>
    <a class="b sec" href="#categories">Manage Categories</a>
    <a class="b sec" href="#content">Edit Homepage</a>
    <a class="b sec" href="#leads">View Enquiries (${db.leads.length})</a>
    <a class="b sec" href="#settings">Phone / Address / Map</a>
  </div></div>
  <div class="card"><h3>Latest enquiries</h3><div class="inner" style="padding:0">
    ${db.leads.length?`<table class="wp"><thead><tr><th>Date</th><th>Name</th><th>Phone</th><th>Product</th><th>Source</th><th>Status</th></tr></thead><tbody>
    ${db.leads.slice(0,6).map(l=>`<tr><td>${new Date(l.date).toLocaleString()}</td><td><b>${esc(l.name)}</b></td>
      <td><a href="tel:${esc(l.phone)}">${esc(l.phone)}</a></td><td>${esc(l.product||'—')}</td><td>${esc(l.source||'')}</td>
      <td><span class="pill ${l.status==='New'?'':'grey'}">${esc(l.status)}</span></td></tr>`).join('')}
    </tbody></table>`:'<div class="inner" style="color:var(--ad-mute)">No enquiries yet. They appear here the moment a visitor submits any form on the website.</div>'}
  </div></div>
  <div class="card"><h3>Recently edited products</h3><div class="inner" style="padding:0">
    <table class="wp"><tbody>${db.products.slice(0,5).map(p=>`<tr>
      <td style="width:70px"><img class="tn" src="${p.images[0]}"></td>
      <td><b>${esc(p.name)}</b><br><span style="color:var(--ad-mute);font-size:.8rem">${esc(p.sku||'')}</span></td>
      <td>${esc((TW.cat(p.cat)||{}).name||'')}</td>
      <td style="text-align:right"><a class="b sec sm" href="#product/${p.id}">Edit</a></td></tr>`).join('')}
    </tbody></table>
  </div></div>`;
}

/* ---------- Products list ---------- */
function vProducts(){
  const db=TW.load();
  $('#view').innerHTML=`
  <div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;margin-bottom:14px">
    <h1 style="margin:0">Products</h1>
    <a class="b" href="#product/new">+ Add New</a>
    <input class="search-ad" id="ps" placeholder="Search products…" style="margin-left:auto">
    <select class="search-ad" id="pc" style="min-width:180px">
      <option value="">All categories</option>${db.categories.map(c=>`<option value="${c.id}">${esc(c.name)}</option>`).join('')}
    </select>
  </div>
  <div class="card"><div class="inner" style="padding:0"><table class="wp">
    <thead><tr><th style="width:70px">Image</th><th>Product</th><th>Category</th><th>Brand</th><th>SKU</th><th>Featured</th><th style="text-align:right">Actions</th></tr></thead>
    <tbody id="ptb"></tbody></table></div></div>`;
  const draw=()=>{
    const q=$('#ps').value.toLowerCase(), c=$('#pc').value;
    const rows=db.products.filter(p=>(!c||p.cat===c)&&(!q||(p.name+p.brand+p.sku+p.model).toLowerCase().includes(q)));
    $('#ptb').innerHTML=rows.length?rows.map(p=>`<tr>
      <td><img class="tn" src="${p.images[0]}"></td>
      <td><b><a href="#product/${p.id}">${esc(p.name)}</a></b><br><span style="color:var(--ad-mute);font-size:.8rem">${esc(p.short.slice(0,70))}…</span></td>
      <td>${esc((TW.cat(p.cat)||{}).name||'—')}<br><span style="color:var(--ad-mute);font-size:.78rem">${esc((TW.sub(p.cat,p.sub)||{}).name||'')}</span></td>
      <td>${esc(p.brand||'—')}</td><td>${esc(p.sku||'—')}</td>
      <td><span class="pill ${p.featured?'amber':'grey'}">${p.featured?'Featured':'Normal'}</span></td>
      <td style="text-align:right;white-space:nowrap">
        <a class="b sec sm" href="product.html?id=${p.id}" target="_blank">View</a>
        <a class="b sm" href="#product/${p.id}">Edit</a>
        <button class="b danger sm" data-del="${p.id}">Delete</button></td></tr>`).join('')
      :`<tr><td colspan="7" style="padding:26px;color:var(--ad-mute)">No products match.</td></tr>`;
    $$('[data-del]').forEach(b=>b.onclick=()=>{
      const p=TW.prod(b.dataset.del);
      if(!confirm('Delete "'+p.name+'"? This cannot be undone.')) return;
      db.products=db.products.filter(x=>x.id!==b.dataset.del); TW.db.products=db.products; save(); toast('Product deleted'); draw();
    });
  };
  $('#ps').oninput=draw; $('#pc').onchange=draw; draw();
}

/* ---------- Product editor ---------- */
function vProductEdit(id){
  const db=TW.load(), isNew=(!id||id==='new');
  const p = isNew ? {id:TW.uid('p'),name:'',slug:'',cat:db.categories[0].id,sub:db.categories[0].subs[0].id,
    brand:'',model:'',sku:'',featured:false,badge:'',stock:'In Stock',moq:'1 Unit',short:'',desc:'',
    images:[twPlaceholder('New Product','steel')],specs:[['','']],features:[''],applications:[''],includes:'',tags:[]}
    : JSON.parse(JSON.stringify(TW.prod(id)));
  if(!p){ location.hash='#products'; return; }

  $('#view').innerHTML=`
  <div style="display:flex;align-items:center;gap:12px;margin-bottom:14px;flex-wrap:wrap">
    <h1 style="margin:0">${isNew?'Add New Product':'Edit Product'}</h1>
    <a class="b ghost" href="#products">← Back to list</a>
    <div style="margin-left:auto;display:flex;gap:8px">
      ${isNew?'':`<a class="b sec" href="product.html?id=${p.id}" target="_blank">Preview ↗</a>`}
      <button class="b" id="savep">💾 ${isNew?'Publish Product':'Update Product'}</button>
    </div>
  </div>
  <div style="display:grid;grid-template-columns:1fr 320px;gap:18px;align-items:start" class="pe-grid">
    <div>
      <div class="card"><h3>Basic information</h3><div class="inner">
        <div class="f"><label>Product name *</label><input id="f_name" value="${esc(p.name)}" placeholder="e.g. 26mm SDS-Plus Rotary Hammer 800W"></div>
        <div class="grid3">
          <div class="f"><label>Brand</label><input id="f_brand" value="${esc(p.brand)}"></div>
          <div class="f"><label>Model no.</label><input id="f_model" value="${esc(p.model)}"></div>
          <div class="f"><label>SKU / Item code</label><input id="f_sku" value="${esc(p.sku)}"></div>
        </div>
        <div class="f"><label>Short description (shows on product cards)</label>
          <textarea id="f_short" style="min-height:64px">${esc(p.short)}</textarea>
          <div class="help">One or two lines. Keep it under about 140 characters.</div></div>
        <div class="f"><label>Full description (product page)</label>
          <textarea id="f_desc" style="min-height:180px">${esc(p.desc)}</textarea>
          <div class="help">Leave a blank line between paragraphs.</div></div>
      </div></div>

      <div class="card"><h3>Technical specifications</h3><div class="inner">
        <div id="specs"></div>
        <button class="b sec sm" id="addSpec">+ Add specification row</button>
        <div class="help" style="margin-top:8px">These render as the specification table on the product page.</div>
      </div></div>

      <div class="card"><h3>Key features</h3><div class="inner">
        <div id="feats"></div><button class="b sec sm" id="addFeat">+ Add feature</button>
      </div></div>

      <div class="card"><h3>Applications</h3><div class="inner">
        <div id="apps"></div><button class="b sec sm" id="addApp">+ Add application</button>
      </div></div>
    </div>

    <div>
      <div class="card"><h3>Publish</h3><div class="inner">
        <div class="f"><label>Category *</label><select id="f_cat"></select></div>
        <div class="f"><label>Sub-category</label><select id="f_sub"></select></div>
        <div class="f"><label><input type="checkbox" id="f_feat" ${p.featured?'checked':''} style="width:auto;margin-right:6px">Show in Featured / Special range</label></div>
        <div class="f"><label>Badge text</label><input id="f_badge" value="${esc(p.badge)}" placeholder="Best Seller, New, IS Certified…"></div>
        <div class="grid2">
          <div class="f"><label>Availability</label><input id="f_stock" value="${esc(p.stock)}"></div>
          <div class="f"><label>MOQ</label><input id="f_moq" value="${esc(p.moq)}"></div>
        </div>
        <div class="f"><label>Supplied with</label><input id="f_inc" value="${esc(p.includes||'')}"></div>
        <div class="f"><label>Search tags</label><input id="f_tags" value="${esc((p.tags||[]).join(', '))}" placeholder="comma, separated">
          <div class="help">Helps visitors find this via site search.</div></div>
        <button class="b" id="savep2" style="width:100%;justify-content:center">💾 Save Product</button>
      </div></div>

      <div class="card"><h3>Product images</h3><div class="inner">
        <div class="imgs" id="imgs"></div>
        <div class="f"><label>Upload from computer</label><input type="file" id="upl" accept="image/*" multiple>
          <div class="help">Images are stored in this browser. Keep each file under ~400 KB.</div></div>
        <div class="f"><label>…or paste an image URL</label>
          <div class="row-1"><input id="imgUrl" placeholder="https://…"><button class="b sec sm" id="addUrl">Add</button></div></div>
        <button class="b ghost sm" id="addPh">Add placeholder image</button>
      </div></div>
    </div>
  </div>`;

  /* selects */
  const catSel=$('#f_cat'), subSel=$('#f_sub');
  catSel.innerHTML=db.categories.map(c=>`<option value="${c.id}" ${c.id===p.cat?'selected':''}>${esc(c.name)}</option>`).join('');
  const fillSubs=()=>{
    const c=TW.cat(catSel.value);
    subSel.innerHTML=c.subs.map(s=>`<option value="${s.id}" ${s.id===p.sub?'selected':''}>${esc(s.name)}</option>`).join('');
  };
  catSel.onchange=fillSubs; fillSubs();

  /* repeaters */
  const drawSpecs=()=>{
    $('#specs').innerHTML=p.specs.map((r,i)=>`<div class="row-2">
      <input data-s="k" data-i="${i}" value="${esc(r[0])}" placeholder="Parameter (e.g. Rated Power)">
      <input data-s="v" data-i="${i}" value="${esc(r[1])}" placeholder="Value (e.g. 800 W)">
      <button class="b danger sm" data-rs="${i}">×</button></div>`).join('');
    $$('[data-s]').forEach(i=>i.oninput=()=>p.specs[+i.dataset.i][i.dataset.s==='k'?0:1]=i.value);
    $$('[data-rs]').forEach(b=>b.onclick=()=>{p.specs.splice(+b.dataset.rs,1);drawSpecs()});
  };
  const drawList=(key,el,ph)=>{
    $(el).innerHTML=p[key].map((v,i)=>`<div class="row-1">
      <input data-l="${key}" data-i="${i}" value="${esc(v)}" placeholder="${ph}">
      <button class="b danger sm" data-rl="${key}|${i}">×</button></div>`).join('');
    $$(`[data-l="${key}"]`).forEach(i=>i.oninput=()=>p[key][+i.dataset.i]=i.value);
    $$('[data-rl]').forEach(b=>b.onclick=()=>{const[k,i]=b.dataset.rl.split('|');p[k].splice(+i,1);
      drawList(k,k==='features'?'#feats':'#apps',ph)});
  };
  const drawImgs=()=>{
    $('#imgs').innerHTML=p.images.map((im,i)=>`<div class="it"><img src="${im}"><button data-ri="${i}">×</button></div>`).join('')
      || '<div class="drop">No images yet — add at least one.</div>';
    $$('[data-ri]').forEach(b=>b.onclick=()=>{p.images.splice(+b.dataset.ri,1);drawImgs()});
  };
  drawSpecs(); drawList('features','#feats','Feature'); drawList('applications','#apps','Application'); drawImgs();
  $('#addSpec').onclick=()=>{p.specs.push(['','']);drawSpecs()};
  $('#addFeat').onclick=()=>{p.features.push('');drawList('features','#feats','Feature')};
  $('#addApp').onclick=()=>{p.applications.push('');drawList('applications','#apps','Application')};
  $('#addPh').onclick=()=>{p.images.push(twPlaceholder($('#f_name').value||'Product','steel'));drawImgs()};
  $('#addUrl').onclick=()=>{const v=$('#imgUrl').value.trim();if(v){p.images.push(v);$('#imgUrl').value='';drawImgs()}};
  $('#upl').onchange=e=>{
    [...e.target.files].forEach(f=>{
      const r=new FileReader();
      r.onload=()=>{p.images.push(r.result);drawImgs()};
      r.readAsDataURL(f);
    });
  };

  const doSave=()=>{
    p.name=$('#f_name').value.trim();
    if(!p.name){toast('Product name is required',1);return}
    p.brand=$('#f_brand').value.trim(); p.model=$('#f_model').value.trim(); p.sku=$('#f_sku').value.trim();
    p.short=$('#f_short').value.trim(); p.desc=$('#f_desc').value.trim();
    p.cat=catSel.value; p.sub=subSel.value; p.featured=$('#f_feat').checked;
    p.badge=$('#f_badge').value.trim(); p.stock=$('#f_stock').value.trim(); p.moq=$('#f_moq').value.trim();
    p.includes=$('#f_inc').value.trim();
    p.tags=$('#f_tags').value.split(',').map(x=>x.trim()).filter(Boolean);
    p.slug=p.name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
    p.specs=p.specs.filter(r=>r[0]||r[1]);
    p.features=p.features.filter(Boolean); p.applications=p.applications.filter(Boolean);
    if(!p.images.length) p.images=[twPlaceholder(p.name,'steel')];
    const i=db.products.findIndex(x=>x.id===p.id);
    if(i>=0) db.products[i]=p; else db.products.unshift(p);
    save(); toast('Product saved'); location.hash='#products';
  };
  $('#savep').onclick=doSave; $('#savep2').onclick=doSave;
}

/* ---------- Categories ---------- */
function vCats(){
  const db=TW.load();
  $('#view').innerHTML=`
  <h1>Categories &amp; Sub-categories</h1>
  <p style="color:var(--ad-mute);margin-top:-6px">These drive the navigation menu, the catalogue filters and the homepage category grid.</p>
  <div class="card"><h3>Add a new category</h3><div class="inner">
    <div class="grid3">
      <div class="f"><label>Name</label><input id="nc_name" placeholder="e.g. Hydraulics"></div>
      <div class="f"><label>Icon (emoji)</label><input id="nc_icon" value="🔧" maxlength="4"></div>
      <div class="f"><label>&nbsp;</label><button class="b" id="addCat" style="width:100%;justify-content:center">+ Add Category</button></div>
    </div>
    <div class="f"><label>Description</label><textarea id="nc_desc" style="min-height:60px"></textarea></div>
  </div></div>
  <div id="catList"></div>`;

  const draw=()=>{
    $('#catList').innerHTML=db.categories.map(c=>`
    <div class="card"><h3>${c.icon} ${esc(c.name)} <span style="color:var(--ad-mute);font-weight:400">· ${TW.countIn(c.id)} products · slug: ${esc(c.slug)}</span></h3>
    <div class="inner">
      <div class="grid3">
        <div class="f"><label>Name</label><input data-c="name" data-id="${c.id}" value="${esc(c.name)}"></div>
        <div class="f"><label>Icon</label><input data-c="icon" data-id="${c.id}" value="${esc(c.icon)}"></div>
        <div class="f"><label>Slug (URL)</label><input data-c="slug" data-id="${c.id}" value="${esc(c.slug)}"></div>
      </div>
      <div class="f"><label>Description</label><textarea data-c="desc" data-id="${c.id}" style="min-height:56px">${esc(c.desc)}</textarea></div>
      <div class="grid2">
        <div class="f"><label>Category image</label><input type="file" accept="image/*" data-cimg="${c.id}"></div>
        <div class="f"><label>Preview</label><img src="${c.img}" style="height:64px;border:1px solid var(--ad-line);border-radius:3px"></div>
      </div>
      <h3 style="margin-top:10px">Sub-categories</h3>
      <div id="subs-${c.id}">${c.subs.map(s=>`<div class="row-1">
        <input data-sub="${c.id}|${s.id}" value="${esc(s.name)}">
        <button class="b danger sm" data-rsub="${c.id}|${s.id}">Delete</button></div>`).join('')}</div>
      <div class="row-1" style="margin-top:8px"><input id="ns-${c.id}" placeholder="New sub-category name">
        <button class="b sec sm" data-addsub="${c.id}">+ Add</button></div>
      <div style="margin-top:12px;display:flex;gap:8px">
        <a class="b sec sm" href="products.html?cat=${c.slug}" target="_blank">View on site ↗</a>
        <button class="b danger sm" data-delcat="${c.id}">Delete category</button>
      </div>
    </div></div>`).join('');

    $$('[data-c]').forEach(i=>i.oninput=()=>{
      const c=TW.cat(i.dataset.id); c[i.dataset.c]=i.value; save();
    });
    $$('[data-cimg]').forEach(inp=>inp.onchange=e=>{
      const f=e.target.files[0]; if(!f)return;
      const r=new FileReader(); r.onload=()=>{TW.cat(inp.dataset.cimg).img=r.result;save();toast('Image updated');draw()};
      r.readAsDataURL(f);
    });
    $$('[data-sub]').forEach(i=>i.oninput=()=>{
      const [cid,sid]=i.dataset.sub.split('|'); TW.sub(cid,sid).name=i.value; save();
    });
    $$('[data-rsub]').forEach(b=>b.onclick=()=>{
      const [cid,sid]=b.dataset.rsub.split('|'); const c=TW.cat(cid);
      if(db.products.some(p=>p.sub===sid)&&!confirm('Products use this sub-category. Delete anyway?'))return;
      c.subs=c.subs.filter(s=>s.id!==sid); save(); draw(); toast('Sub-category removed');
    });
    $$('[data-addsub]').forEach(b=>b.onclick=()=>{
      const cid=b.dataset.addsub, v=$('#ns-'+cid).value.trim(); if(!v)return;
      TW.cat(cid).subs.push({id:TW.uid('s'),name:v}); save(); draw(); toast('Sub-category added');
    });
    $$('[data-delcat]').forEach(b=>b.onclick=()=>{
      const id=b.dataset.delcat;
      if(TW.countIn(id)){toast('Move or delete its products first',1);return}
      if(!confirm('Delete this category?'))return;
      db.categories=db.categories.filter(c=>c.id!==id); TW.db.categories=db.categories; save(); draw(); toast('Category deleted');
    });
  };
  $('#addCat').onclick=()=>{
    const n=$('#nc_name').value.trim(); if(!n){toast('Enter a category name',1);return}
    db.categories.push({id:TW.uid('c'),name:n,icon:$('#nc_icon').value||'🔧',
      slug:n.toLowerCase().replace(/[^a-z0-9]+/g,'-'),desc:$('#nc_desc').value,
      img:twPlaceholder(n,'steel'),subs:[{id:TW.uid('s'),name:'General'}]});
    save(); $('#nc_name').value=$('#nc_desc').value=''; draw(); toast('Category added');
  };
  draw();
}

/* ---------- Homepage & content ---------- */
function vContent(){
  const s=TW.s, pg=TW.pages;
  $('#view').innerHTML=`
  <h1>Homepage &amp; Content</h1>
  <div class="tabs-ad" id="ctabs">
    ${['Hero slider','Why-us blocks','Stats','About','CTA band','Brand strip','Testimonials','FAQs','Services','Industries']
      .map((t,i)=>`<button data-t="${i}" class="${i?'':'on'}">${t}</button>`).join('')}
  </div>
  <div id="cpane"></div>`;

  const panes=[hero,usps,stats,about,cta,marq,testi,faqs,svcs,inds];
  $$('#ctabs button').forEach(b=>b.onclick=()=>{
    $$('#ctabs button').forEach(x=>x.classList.remove('on')); b.classList.add('on'); panes[+b.dataset.t]();
  });
  hero();

  function wrapCard(title,inner){ $('#cpane').innerHTML=`<div class="card"><h3>${title}</h3><div class="inner">${inner}</div></div>`; }

  function hero(){
    wrapCard('Hero slider — homepage top',
      `<div id="hs"></div><button class="b sec sm" id="addSlide">+ Add slide</button>`);
    const draw=()=>{
      $('#hs').innerHTML=s.heroSlides.map((sl,i)=>`
        <div style="border:1px solid var(--ad-line);border-radius:4px;padding:14px;margin-bottom:12px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px">
            <b>Slide ${i+1}</b><button class="b danger sm" data-rs="${i}">Remove</button></div>
          <div class="f"><label>Eyebrow / kicker</label><input data-h="kicker" data-i="${i}" value="${esc(sl.kicker)}"></div>
          <div class="f"><label>Headline (wrap a word in &lt;em&gt;…&lt;/em&gt; to highlight it amber)</label>
            <input data-h="title" data-i="${i}" value="${esc(sl.title)}"></div>
          <div class="f"><label>Sub-text</label><textarea data-h="text" data-i="${i}" style="min-height:60px">${esc(sl.text)}</textarea></div>
          <div class="grid2">
            <div class="f"><label>Background image</label><input type="file" accept="image/*" data-hi="${i}"></div>
            <div class="f"><label>Preview</label><img src="${sl.img}" style="height:60px;border:1px solid var(--ad-line)"></div>
          </div>
        </div>`).join('');
      $$('[data-h]').forEach(i=>i.oninput=()=>{s.heroSlides[+i.dataset.i][i.dataset.h]=i.value;save()});
      $$('[data-hi]').forEach(inp=>inp.onchange=e=>{
        const f=e.target.files[0];if(!f)return;const r=new FileReader();
        r.onload=()=>{s.heroSlides[+inp.dataset.hi].img=r.result;save();draw();toast('Slide image updated')};r.readAsDataURL(f);
      });
      $$('[data-rs]').forEach(b=>b.onclick=()=>{s.heroSlides.splice(+b.dataset.rs,1);save();draw()});
    };
    $('#addSlide').onclick=()=>{s.heroSlides.push({kicker:'New slide',title:'Your <em>headline</em> here',
      text:'Supporting line.',img:twPlaceholder('New Slide','dark')});save();draw()};
    draw();
  }
  function usps(){
    wrapCard('“Why buy from us” blocks',`<div id="ub"></div><button class="b sec sm" id="addU">+ Add block</button>`);
    const draw=()=>{
      $('#ub').innerHTML=s.usps.map((u,i)=>`<div class="grid3" style="align-items:end;border-bottom:1px solid var(--ad-line);padding-bottom:10px;margin-bottom:10px">
        <div class="f"><label>Icon</label><input data-u="i" data-i="${i}" value="${esc(u.i)}"></div>
        <div class="f"><label>Title</label><input data-u="t" data-i="${i}" value="${esc(u.t)}"></div>
        <div class="f"><label>&nbsp;</label><button class="b danger sm" data-ru="${i}">Remove</button></div>
        <div class="f" style="grid-column:1/-1"><label>Description</label><textarea data-u="d" data-i="${i}" style="min-height:54px">${esc(u.d)}</textarea></div>
      </div>`).join('');
      $$('[data-u]').forEach(i=>i.oninput=()=>{s.usps[+i.dataset.i][i.dataset.u]=i.value;save()});
      $$('[data-ru]').forEach(b=>b.onclick=()=>{s.usps.splice(+b.dataset.ru,1);save();draw()});
    };
    $('#addU').onclick=()=>{s.usps.push({i:'⭐',t:'New reason',d:'Describe it.'});save();draw()};draw();
  }
  function stats(){
    wrapCard('Counter statistics',`<div id="sb"></div><button class="b sec sm" id="addS">+ Add stat</button>`);
    const draw=()=>{
      $('#sb').innerHTML=s.stats.map((x,i)=>`<div class="row-2">
        <input data-st="n" data-i="${i}" value="${esc(x.n)}" placeholder="22+">
        <input data-st="l" data-i="${i}" value="${esc(x.l)}" placeholder="Years in trade">
        <button class="b danger sm" data-rst="${i}">×</button></div>`).join('');
      $$('[data-st]').forEach(i=>i.oninput=()=>{s.stats[+i.dataset.i][i.dataset.st]=i.value;save()});
      $$('[data-rst]').forEach(b=>b.onclick=()=>{s.stats.splice(+b.dataset.rst,1);save();draw()});
    };
    $('#addS').onclick=()=>{s.stats.push({n:'0',l:'New stat'});save();draw()};draw();
  }
  function about(){
    wrapCard('About section (homepage + About page)',`
      <div class="f"><label>Heading</label><input id="ab_t" value="${esc(s.about.title)}"></div>
      <div class="f"><label>Body (blank line between paragraphs)</label><textarea id="ab_b" style="min-height:150px">${esc(s.about.body)}</textarea></div>
      <div class="f"><label>Bullet points (one per line)</label><textarea id="ab_p" style="min-height:100px">${esc(s.about.points.join('\n'))}</textarea></div>
      <div class="grid2">
        <div class="f"><label>Corner stamp text</label><input id="ab_s" value="${esc(s.about.stamp)}"></div>
        <div class="f"><label>Image</label><input type="file" accept="image/*" id="ab_i"></div>
      </div>
      <img src="${s.about.img}" style="height:80px;border:1px solid var(--ad-line)">`);
    $('#ab_t').oninput=e=>{s.about.title=e.target.value;save()};
    $('#ab_b').oninput=e=>{s.about.body=e.target.value;save()};
    $('#ab_p').oninput=e=>{s.about.points=e.target.value.split('\n').filter(Boolean);save()};
    $('#ab_s').oninput=e=>{s.about.stamp=e.target.value;save()};
    $('#ab_i').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
      r.onload=()=>{s.about.img=r.result;save();about();toast('Image updated')};r.readAsDataURL(f)};
  }
  function cta(){
    wrapCard('Call-to-action band',`
      <div class="f"><label>Title</label><input id="ct_t" value="${esc(s.ctaBand.title)}"></div>
      <div class="f"><label>Text</label><textarea id="ct_x" style="min-height:70px">${esc(s.ctaBand.text)}</textarea></div>
      <div class="f"><label>Background image</label><input type="file" accept="image/*" id="ct_i"></div>
      <img src="${s.ctaBand.img}" style="height:70px;border:1px solid var(--ad-line)">`);
    $('#ct_t').oninput=e=>{s.ctaBand.title=e.target.value;save()};
    $('#ct_x').oninput=e=>{s.ctaBand.text=e.target.value;save()};
    $('#ct_i').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();
      r.onload=()=>{s.ctaBand.img=r.result;save();cta()};r.readAsDataURL(f)};
  }
  function marq(){
    wrapCard('Scrolling brand strip',`<div class="f"><label>Brand names (one per line)</label>
      <textarea id="mq" style="min-height:180px">${esc(s.marquee.join('\n'))}</textarea></div>`);
    $('#mq').oninput=e=>{s.marquee=e.target.value.split('\n').filter(Boolean);save()};
  }
  function testi(){
    wrapCard('Testimonials',`<div id="tb"></div><button class="b sec sm" id="addT">+ Add testimonial</button>`);
    const draw=()=>{
      $('#tb').innerHTML=pg.testimonials.map((t,i)=>`<div style="border-bottom:1px solid var(--ad-line);padding-bottom:10px;margin-bottom:10px">
        <div class="grid3"><div class="f"><label>Name</label><input data-tt="n" data-i="${i}" value="${esc(t.n)}"></div>
        <div class="f"><label>Role / company</label><input data-tt="r" data-i="${i}" value="${esc(t.r)}"></div>
        <div class="f"><label>&nbsp;</label><button class="b danger sm" data-rt="${i}">Remove</button></div></div>
        <div class="f"><label>Quote</label><textarea data-tt="t" data-i="${i}" style="min-height:60px">${esc(t.t)}</textarea></div></div>`).join('');
      $$('[data-tt]').forEach(i=>i.oninput=()=>{pg.testimonials[+i.dataset.i][i.dataset.tt]=i.value;save()});
      $$('[data-rt]').forEach(b=>b.onclick=()=>{pg.testimonials.splice(+b.dataset.rt,1);save();draw()});
    };
    $('#addT').onclick=()=>{pg.testimonials.push({n:'Name',r:'Role, Company',t:'Quote'});save();draw()};draw();
  }
  function faqs(){
    wrapCard('FAQs (About page)',`<div id="fb"></div><button class="b sec sm" id="addF">+ Add FAQ</button>`);
    const draw=()=>{
      $('#fb').innerHTML=pg.faqs.map((f,i)=>`<div style="border-bottom:1px solid var(--ad-line);padding-bottom:10px;margin-bottom:10px">
        <div class="row-1"><input data-fq="q" data-i="${i}" value="${esc(f.q)}" placeholder="Question">
        <button class="b danger sm" data-rf="${i}">×</button></div>
        <div class="f" style="margin-top:8px"><textarea data-fq="a" data-i="${i}" style="min-height:64px">${esc(f.a)}</textarea></div></div>`).join('');
      $$('[data-fq]').forEach(i=>i.oninput=()=>{pg.faqs[+i.dataset.i][i.dataset.fq]=i.value;save()});
      $$('[data-rf]').forEach(b=>b.onclick=()=>{pg.faqs.splice(+b.dataset.rf,1);save();draw()});
    };
    $('#addF').onclick=()=>{pg.faqs.push({q:'New question',a:'Answer'});save();draw()};draw();
  }
  function svcs(){
    wrapCard('Services page blocks',`<div id="vb"></div><button class="b sec sm" id="addV">+ Add service</button>`);
    const draw=()=>{
      $('#vb').innerHTML=pg.services.map((x,i)=>`<div class="grid3" style="align-items:end;border-bottom:1px solid var(--ad-line);padding-bottom:10px;margin-bottom:10px">
        <div class="f"><label>Icon</label><input data-sv="i" data-i="${i}" value="${esc(x.i)}"></div>
        <div class="f"><label>Title</label><input data-sv="t" data-i="${i}" value="${esc(x.t)}"></div>
        <div class="f"><label>&nbsp;</label><button class="b danger sm" data-rv="${i}">Remove</button></div>
        <div class="f" style="grid-column:1/-1"><textarea data-sv="d" data-i="${i}" style="min-height:54px">${esc(x.d)}</textarea></div></div>`).join('');
      $$('[data-sv]').forEach(i=>i.oninput=()=>{pg.services[+i.dataset.i][i.dataset.sv]=i.value;save()});
      $$('[data-rv]').forEach(b=>b.onclick=()=>{pg.services.splice(+b.dataset.rv,1);save();draw()});
    };
    $('#addV').onclick=()=>{pg.services.push({i:'🔧',t:'New service',d:'Describe it.'});save();draw()};draw();
  }
  function inds(){
    wrapCard('Industries served',`<div class="f"><label>One per line</label>
      <textarea id="ind" style="min-height:200px">${esc(pg.industries.join('\n'))}</textarea></div>`);
    $('#ind').oninput=e=>{pg.industries=e.target.value.split('\n').filter(Boolean);save()};
  }
}

/* ---------- Leads ---------- */
function vLeads(){
  const db=TW.load();
  $('#view').innerHTML=`
  <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:14px">
    <h1 style="margin:0">Enquiries</h1>
    <span class="pill">${db.leads.filter(l=>l.status==='New').length} new</span>
    <div style="margin-left:auto;display:flex;gap:8px">
      <button class="b sec" id="csv">⬇ Export CSV</button>
      <button class="b danger" id="clr">Clear all</button>
    </div>
  </div>
  <div class="card"><div class="inner" style="padding:0"><table class="wp">
    <thead><tr><th>Date</th><th>Contact</th><th>Requirement</th><th>Source</th><th>Status</th><th></th></tr></thead>
    <tbody id="ltb"></tbody></table></div></div>`;
  const draw=()=>{
    $('#ltb').innerHTML=db.leads.length?db.leads.map(l=>`<tr>
      <td style="white-space:nowrap">${new Date(l.date).toLocaleDateString()}<br><span style="color:var(--ad-mute);font-size:.78rem">${new Date(l.date).toLocaleTimeString()}</span></td>
      <td><b>${esc(l.name||'')}</b><br><a href="tel:${esc(l.phone||'')}">${esc(l.phone||'')}</a>
        ${l.email?`<br><a href="mailto:${esc(l.email)}">${esc(l.email)}</a>`:''}
        ${l.company?`<br><span style="color:var(--ad-mute);font-size:.8rem">${esc(l.company)}</span>`:''}
        ${l.city?`<br><span style="color:var(--ad-mute);font-size:.8rem">${esc(l.city)}</span>`:''}</td>
      <td>${l.product?`<b>${esc(l.product)}</b><br>`:''}${l.qty?`Qty: ${esc(l.qty)}<br>`:''}
        <span style="color:var(--ad-mute)">${esc(l.message||'')}</span></td>
      <td>${esc(l.source||'')}</td>
      <td><select data-ls="${l.id}" style="padding:4px">
        ${['New','Contacted','Quoted','Won','Lost'].map(o=>`<option ${l.status===o?'selected':''}>${o}</option>`).join('')}</select></td>
      <td><button class="b danger sm" data-dl="${l.id}">×</button></td></tr>`).join('')
      :`<tr><td colspan="6" style="padding:30px;color:var(--ad-mute)">No enquiries yet.</td></tr>`;
    $$('[data-ls]').forEach(s=>s.onchange=()=>{db.leads.find(l=>l.id===s.dataset.ls).status=s.value;save();toast('Status updated')});
    $$('[data-dl]').forEach(b=>b.onclick=()=>{TW.db.leads=db.leads=db.leads.filter(l=>l.id!==b.dataset.dl);save();draw()});
  };
  $('#csv').onclick=()=>{
    const cols=['date','name','phone','email','company','city','product','qty','message','source','status'];
    const csv=[cols.join(',')].concat(db.leads.map(l=>cols.map(c=>`"${String(l[c]==null?'':l[c]).replace(/"/g,'""')}"`).join(','))).join('\n');
    dl(new Blob([csv],{type:'text/csv'}),'toolwerk-enquiries.csv');
  };
  $('#clr').onclick=()=>{if(confirm('Delete all enquiries?')){db.leads.length=0;save();draw()}};
  draw();
}

/* ---------- Settings ---------- */
function vSettings(){
  const s=TW.s, c=creds();
  $('#view').innerHTML=`
  <h1>Site Settings</h1>
  <div class="card"><h3>Business identity</h3><div class="inner">
    <div class="grid2">
      <div class="f"><label>Brand name</label><input id="s_brand" value="${esc(s.brand)}"></div>
      <div class="f"><label>Brand sub-line</label><input id="s_bsub" value="${esc(s.brandSub)}"></div>
    </div>
    <div class="f"><label>Tagline</label><input id="s_tag" value="${esc(s.tagline)}"></div>
    <div class="f"><label>GSTIN</label><input id="s_gst" value="${esc(s.gst)}"></div>
  </div></div>
  <div class="card"><h3>Contact &amp; call-to-action details</h3><div class="inner">
    <div class="grid3">
      <div class="f"><label>Primary phone</label><input id="s_ph" value="${esc(s.phone)}"><div class="help">Used by every “Call Now” button.</div></div>
      <div class="f"><label>Secondary phone</label><input id="s_ph2" value="${esc(s.phone2)}"></div>
      <div class="f"><label>WhatsApp number</label><input id="s_wa" value="${esc(s.whatsapp)}"><div class="help">Country code, digits only: 919810000000</div></div>
    </div>
    <div class="grid2">
      <div class="f"><label>Email</label><input id="s_em" value="${esc(s.email)}"></div>
      <div class="f"><label>Business hours</label><input id="s_hr" value="${esc(s.hours)}"></div>
    </div>
    <div class="f"><label>Address</label><textarea id="s_ad" style="min-height:60px">${esc(s.address)}</textarea></div>
    <div class="f"><label>Google Maps embed URL</label><input id="s_map" value="${esc(s.mapEmbed)}">
      <div class="help">Google Maps → Share → Embed a map → copy the URL inside src="…".</div></div>
  </div></div>
  <div class="card"><h3>Social links</h3><div class="inner"><div class="grid2">
    <div class="f"><label>Facebook</label><input id="s_fb" value="${esc(s.social.fb)}"></div>
    <div class="f"><label>LinkedIn</label><input id="s_in" value="${esc(s.social.in)}"></div>
    <div class="f"><label>YouTube</label><input id="s_yt" value="${esc(s.social.yt)}"></div>
    <div class="f"><label>Instagram</label><input id="s_ig" value="${esc(s.social.ig)}"></div>
  </div></div></div>
  <div class="card"><h3>Admin access</h3><div class="inner">
    <div class="grid2">
      <div class="f"><label>Username</label><input id="a_u" value="${esc(c.u)}"></div>
      <div class="f"><label>Password</label><input id="a_p" value="${esc(c.p)}"></div>
    </div>
    <button class="b" id="saveCred">Update credentials</button>
    <div class="help" style="margin-top:8px">Stored in this browser only. This is a front-end gate, not server security — for a public site, ask your developer to move the admin behind a real server login.</div>
  </div></div>`;
  const bind=(id,fn)=>$(id).oninput=e=>{fn(e.target.value);save()};
  bind('#s_brand',v=>s.brand=v); bind('#s_bsub',v=>s.brandSub=v); bind('#s_tag',v=>s.tagline=v);
  bind('#s_gst',v=>s.gst=v); bind('#s_ph',v=>s.phone=v); bind('#s_ph2',v=>s.phone2=v);
  bind('#s_wa',v=>s.whatsapp=v); bind('#s_em',v=>s.email=v); bind('#s_hr',v=>s.hours=v);
  bind('#s_ad',v=>s.address=v); bind('#s_map',v=>s.mapEmbed=v);
  bind('#s_fb',v=>s.social.fb=v); bind('#s_in',v=>s.social.in=v);
  bind('#s_yt',v=>s.social.yt=v); bind('#s_ig',v=>s.social.ig=v);
  $('#saveCred').onclick=()=>{
    localStorage.setItem(CRED_KEY,JSON.stringify({u:$('#a_u').value.trim()||'admin',p:$('#a_p').value||'admin'}));
    toast('Admin credentials updated');
  };
}

/* ---------- Tools ---------- */
function dl(blob,name){
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=name;
  document.body.appendChild(a); a.click(); a.remove();
}
function vTools(){
  $('#view').innerHTML=`
  <h1>Tools &amp; Backup</h1>
  <div class="card"><h3>Export</h3><div class="inner">
    <p style="color:var(--ad-mute)">Content lives in this browser's storage. Export a backup before clearing browser data, moving to another machine, or handing the site to a developer for deployment.</p>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <button class="b" id="ex">⬇ Export all content (JSON)</button>
      <button class="b sec" id="exSeed">⬇ Export as data-seed.js</button>
    </div>
    <div class="help" style="margin-top:8px">Replace the SEED block in <code>assets/js/data.js</code> with the seed file to make your content the permanent default for every visitor.</div>
  </div></div>
  <div class="card"><h3>Import</h3><div class="inner">
    <div class="f"><label>Restore from a JSON backup</label><input type="file" id="imp" accept="application/json"></div>
    <div class="help">This replaces all current products, categories, content and enquiries.</div>
  </div></div>
  <div class="card"><h3>Reset</h3><div class="inner">
    <p style="color:var(--ad-mute)">Discard every change made in this browser and return to the shipped demo content.</p>
    <button class="b danger" id="rst">Reset to factory content</button>
  </div></div>
  <div class="card"><h3>How this site is deployed</h3><div class="inner" style="color:var(--ad-mute)">
    <p>The site is plain HTML, CSS and JavaScript — upload the whole folder to any hosting (cPanel, Hostinger, Netlify, Vercel, S3) and it runs. No database or PHP needed.</p>
    <p><b>Important:</b> product edits made here are saved in <i>your</i> browser. To publish them to all visitors, export the seed file above and replace the seed block in <code>assets/js/data.js</code>, then re-upload that one file. When you want live multi-user editing instead, the same admin screens can be pointed at a small server API — the data shapes are already designed for it.</p>
  </div></div>`;
  $('#ex').onclick=()=>dl(new Blob([JSON.stringify(TW.load(),null,2)],{type:'application/json'}),'toolwerk-content.json');
  $('#exSeed').onclick=()=>dl(new Blob(['const TW_SEED = '+JSON.stringify(TW.load(),null,2)+';'],{type:'text/javascript'}),'data-seed.js');
  $('#imp').onchange=e=>{
    const f=e.target.files[0]; if(!f)return;
    const r=new FileReader();
    r.onload=()=>{try{
      const d=JSON.parse(r.result);
      if(!d.products||!d.categories) throw 0;
      TW.db=d; save(); toast('Content imported'); location.hash='#dashboard'; route();
    }catch(err){toast('That file is not a valid backup',1)}};
    r.readAsText(f);
  };
  $('#rst').onclick=()=>{if(confirm('Reset everything to the shipped demo content?')){TW.reset();toast('Reset complete');route()}};
}

/* ---------- Auto-resume an open session (runs last, after all views are defined) ---------- */
if(sessionStorage.getItem('TW_ADMIN_IN')) openPanel();
