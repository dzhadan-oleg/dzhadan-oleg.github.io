(() => {
 const ownOrigin=new URL(document.baseURI).origin;
 const caseName=/^(agents|websites|everyday|tech)(-story)?\.html$/;
 const isCase=url=>url.origin===ownOrigin&&caseName.test(url.pathname.split('/').pop());
 const embedded=new URLSearchParams(location.search).has('embed');
 if(embedded)document.body.classList.add('case-embedded');
 let sheet,frame,closeButton,opener,savedY,bodyStyle,rootBehavior;
 function close(){if(sheet?.open)sheet.close();}
 function openCase(raw,title,previewWidth){
  const url=new URL(raw,document.baseURI);if(!isCase(url))return;
  if(!sheet){
   sheet=document.createElement('dialog');sheet.className='case-sheet';sheet.setAttribute('aria-label','Подробности проекта');
   sheet.innerHTML='<div class="case-sheet-bar"><span class="case-sheet-label">Проект</span><button type="button" autofocus>Свернуть ↓</button></div><iframe class="case-sheet-frame" title="Подробности проекта"></iframe>';
   document.body.append(sheet);frame=sheet.querySelector('iframe');closeButton=sheet.querySelector('button');
   closeButton.addEventListener('click',close);
   sheet.addEventListener('click',e=>{if(e.target===sheet)close()});
   sheet.addEventListener('close',()=>{
    frame.src='about:blank';document.body.style.cssText=bodyStyle;
    document.documentElement.style.scrollBehavior='auto';window.scrollTo(0,savedY);
    opener?.focus({preventScroll:true});document.documentElement.style.scrollBehavior=rootBehavior;
   });
  }
  if(!sheet.open){
   const mobilePreview=Number.isFinite(previewWidth)&&previewWidth<=680;
   sheet.toggleAttribute('data-mobile-preview',mobilePreview);
   sheet.style.width=mobilePreview?'min('+previewWidth+'px, 100%)':'';
   opener=document.activeElement;savedY=scrollY;bodyStyle=document.body.style.cssText;rootBehavior=document.documentElement.style.scrollBehavior;
   document.body.style.position='fixed';document.body.style.top=-savedY+'px';document.body.style.width='100%';document.body.style.overflow='hidden';
   sheet.showModal();closeButton.focus({preventScroll:true});
  }
  sheet.querySelector('.case-sheet-label').textContent=title||'Проект';
  url.searchParams.set('embed','1');frame.src=url.href;
 }
 document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');if(!a||e.defaultPrevented||e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;
  const url=new URL(a.getAttribute('href'),document.baseURI);
  if(!isCase(url))return;
  e.preventDefault();
  const title=a.querySelector('h3')?.textContent||a.textContent.trim();
  if(window!==parent&&(embedded||document.body.hasAttribute('data-review-preview'))){parent.postMessage({type:embedded?'portfolio-case-change':'portfolio-case-request',url:url.href,title},ownOrigin);}
  else openCase(url.href,title);
 });
 if(embedded){
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();parent.postMessage({type:'portfolio-case-close'},ownOrigin)}});
  document.addEventListener('click',e=>{const a=e.target.closest('a[href]');if(a&&/^(index|story)\.html/.test(a.getAttribute('href'))){e.preventDefault();parent.postMessage({type:'portfolio-case-close'},ownOrigin)}});
 }
 window.addEventListener('message',e=>{
  if(e.origin!==ownOrigin||e.source!==frame?.contentWindow)return;
  if(e.data?.type==='portfolio-case-close')close();
  if(e.data?.type==='portfolio-case-change')openCase(e.data.url,e.data.title);
 });
 window.addEventListener('portfolio-open-case',e=>openCase(e.detail.url,e.detail.title,e.detail.previewWidth));
})();
