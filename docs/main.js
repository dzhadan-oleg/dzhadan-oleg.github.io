const progress=document.querySelector('.progress');
function setProgress(){const total=document.documentElement.scrollHeight-innerHeight;if(progress)progress.style.width=(total>0?100*scrollY/total:0)+'%'}
addEventListener('scroll',setProgress,{passive:true});addEventListener('resize',setProgress);setProgress();
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.remove('pending');observer.unobserve(entry.target)}})},{threshold:.08});document.querySelectorAll('.scenario-media,.project-art,.repo,.flow').forEach(el=>{el.classList.add('scroll-in','pending');observer.observe(el)});}
document.querySelectorAll('[data-play]').forEach(button=>button.addEventListener('click',()=>{const video=document.getElementById(button.dataset.play);if(video.paused){video.play().then(()=>button.textContent=button.dataset.pauseLabel||'Приостановить анимацию').catch(()=>{button.textContent=button.dataset.playLabel||'Воспроизвести анимацию'})}else{video.pause();button.textContent=button.dataset.playLabel||'Посмотреть анимацию'}}));
document.querySelectorAll('video').forEach(video=>video.addEventListener('ended',()=>{const button=document.querySelector('[data-play="'+video.id+'"]');if(button)button.textContent=button.dataset.playLabel||'Посмотреть анимацию'}));

document.querySelectorAll('[data-screen-src]').forEach(button=>button.addEventListener('click',()=>{
 const group=button.closest('.screen-demo');if(!group)return;
 const image=group.querySelector('.phone img');image.src=button.dataset.screenSrc;image.alt=button.dataset.screenAlt||button.textContent;
 group.querySelectorAll('[data-screen-src]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
 const caption=group.querySelector('figcaption');if(caption)caption.textContent=button.dataset.screenCaption||'';
}));

// Animate captured pages only while their preview is visible.
document.querySelectorAll('[data-scroll-preview]').forEach(preview=>{
 const img=preview.querySelector('img'), windowEl=preview.querySelector('.web-scroll-window');
 const toggle=preview.querySelector('[data-scroll-toggle]'), reset=preview.querySelector('[data-scroll-reset]'), range=preview.querySelector('input');
 let animation=null, frame=0,started=false,visible=false,autoTimer=0;
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const duration=()=>Math.min(50000,Math.max(14000,(img.clientHeight-windowEl.clientHeight)*20));
 function cancelAuto(){clearTimeout(autoTimer);autoTimer=0;}
 function scheduleAuto(){if(autoTimer||started||!visible||document.hidden||reduced.matches||!img.complete||!img.naturalWidth)return;autoTimer=setTimeout(()=>{autoTimer=0;if(visible&&!document.hidden&&!started)play();},4000);}
 function pause(){cancelAuto();if(animation)animation.pause();cancelAnimationFrame(frame);toggle.textContent='Смотреть скролл';}
 function prepare(){const pos=Number(range.value)/100;if(animation)animation.cancel();const travel=Math.max(0,img.clientHeight-windowEl.clientHeight);animation=img.animate([{transform:'translateY(0)'},{transform:`translateY(-${travel}px)`}],{duration:duration(),fill:'both',easing:'linear'});animation.pause();animation.currentTime=pos*duration();animation.onfinish=()=>{range.value='100';toggle.textContent='Смотреть ещё раз';cancelAnimationFrame(frame);};}
 function tick(){if(!animation||animation.playState!=='running')return;range.value=String(100*Number(animation.currentTime||0)/duration());frame=requestAnimationFrame(tick);}
 function play(){cancelAuto();if(!animation)prepare();if(Number(range.value)>=99.9){range.value='0';animation.currentTime=0;}animation.play();started=true;toggle.textContent='Пауза';tick();}
 toggle.addEventListener('click',()=>animation?.playState==='running'?pause():play());
 reset.addEventListener('click',()=>{started=true;pause();range.value='0';if(animation)animation.currentTime=0;});
 range.addEventListener('input',()=>{started=true;pause();if(!animation)prepare();animation.currentTime=Number(range.value)/100*duration();});
 const observer=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(!visible)pause();else scheduleAuto();},{threshold:.25});observer.observe(preview);
 img.addEventListener('load',()=>{prepare();scheduleAuto();});
 new ResizeObserver(()=>{const running=animation?.playState==='running';prepare();if(running&&visible)play();}).observe(windowEl);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else scheduleAuto();});
});
// Keep section navigation inside both the review frame and the case sheet.
document.querySelectorAll('.web-case-nav a[href^="#"]').forEach(link=>link.addEventListener('click',event=>{const target=document.querySelector(link.getAttribute('href'));if(target){event.preventDefault();target.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'start'});}}));

// Draw the highlighted file route from current element positions.
document.querySelectorAll('.repo-file-tree').forEach(tree=>{
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg');
 svg.classList.add('repo-flow');svg.setAttribute('aria-hidden','true');
 const base=document.createElementNS(ns,'path'),pulse=document.createElementNS(ns,'path');
 base.classList.add('repo-flow-base');pulse.classList.add('repo-flow-pulse');pulse.setAttribute('pathLength','100');svg.append(base,pulse);tree.prepend(svg);
 function draw(){
  const origin=tree.getBoundingClientRect(),root=tree.querySelector('.repo-root').getBoundingClientRect();
  const nodes=[...tree.querySelectorAll('.repo-selected > .repo-node')].map(n=>n.getBoundingClientRect());
  svg.setAttribute('viewBox',`0 0 ${origin.width} ${origin.height}`);
  let last=root,d='';
  nodes.forEach((r,i)=>{const x=r.left-origin.left-14,y=r.top-origin.top+19,from=last.bottom-origin.top;
   d+=`M ${x} ${from} V ${y} H ${r.left-origin.left} `;last=r;
  });base.setAttribute('d',d);pulse.setAttribute('d',d);
 }
 new ResizeObserver(draw).observe(tree);draw();document.fonts.ready.then(draw);
});
