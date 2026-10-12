(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
let paused=false;
// title facet-in
const t=$('.title');let i=0;
t.querySelectorAll('.w').forEach(w=>{const s=w.textContent;w.textContent='';[...s].forEach(c=>{const e=document.createElement('span');e.className='ch';e.textContent=c;e.style.setProperty('--i',i++);w.appendChild(e)})});
// videos: phone gets its own portrait cut
const mq=matchMedia('(max-width:700px)');
const vids=$$('video[data-src-d]');
function setSrc(){vids.forEach(v=>{const m=mq.matches,src=m?v.dataset.srcM:v.dataset.srcD;if(v.dataset.cur===src)return;v.dataset.cur=src;if(m&&v.dataset.posterM)v.poster=v.dataset.posterM;v.src=src;v.load();if(!paused)v.play().catch(()=>{})})}
setSrc();mq.addEventListener?mq.addEventListener('change',setSrc):mq.addListener(setSrc);
const vis=new Map();
const io=new IntersectionObserver(es=>es.forEach(e=>{vis.set(e.target,e.isIntersecting);if(e.isIntersecting&&!paused)e.target.play().catch(()=>{});else e.target.pause()}),{threshold:0});
vids.forEach(v=>io.observe(v));
['touchstart','click'].forEach(ev=>addEventListener(ev,()=>{if(!paused)vids.forEach(v=>{if(vis.get(v)&&v.paused)v.play().catch(()=>{})})},{once:true,passive:true}));
// reveals
$$('.rv-lines').forEach(h=>{const parts=h.innerHTML.split(/<br\s*\/?>/i);h.innerHTML=parts.map((p,k)=>`<span class="ln"><span style="--d:${k}">${p}</span></span>`).join('')});
const rio=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');rio.unobserve(e.target)}}),{threshold:.15,rootMargin:'0px 0px -6% 0px'});
$$('.rv,.rv-lines').forEach(el=>rio.observe(el));
// scroll: nav, bench scale, gem light, card glints
const nav=$('.nav'),bench=$('.bench'),fr=$('.bench-frame'),gem=$('.gem'),facets=$$('.gem-f path'),glint=$('.gem-glint'),cards=$$('.cut .ph');
let px=.5,py=.5;
function frame(){
 nav.classList.toggle('solid',scrollY>innerHeight*.6);
 if(!mq.matches){const r=bench.getBoundingClientRect(),span=r.height-innerHeight,p=Math.min(1,Math.max(0,-r.top/span));const g=Math.min(1,p/.4),ease=1-Math.pow(1-g,3),s0=innerWidth<800?.82:.5;fr.style.setProperty('--s',(s0+(1-s0)*ease).toFixed(4));fr.style.setProperty('--r',(28*(1-ease)).toFixed(1))}
 if(paused)return;
 // signature: the gem catches light as you scroll past it (and follows the pointer)
 const gr=gem.getBoundingClientRect(),gp=1-(gr.top+gr.height/2)/innerHeight; // 0 bottom ->1 top
 const ang=gp*Math.PI*2+(px-.5)*2;
 facets.forEach((f,k)=>{const a=k/facets.length*Math.PI*2;f.style.setProperty('--f',Math.max(0,Math.cos(a-ang)).toFixed(3))});
 glint.setAttribute('x',(-120+Math.min(1.2,Math.max(-.2,gp))*300).toFixed(1));
 gem.style.transform=`rotate(${((gp-.5)*16).toFixed(2)}deg)`;
 cards.forEach(c=>{const b=c.getBoundingClientRect();c.style.setProperty('--sx',Math.min(1,Math.max(0,1-(b.top+b.height/2)/innerHeight+((b.left+b.width/2)/innerWidth-.5)*.5)).toFixed(3))});
}
let raf=0;const req=()=>{if(!raf)raf=requestAnimationFrame(()=>{raf=0;frame()})};
addEventListener('scroll',req,{passive:true});addEventListener('resize',req);addEventListener('pointermove',e=>{px=e.clientX/innerWidth;py=e.clientY/innerHeight;req()},{passive:true});frame();
cards.forEach(p=>p.addEventListener('pointermove',e=>{const b=p.getBoundingClientRect();p.style.setProperty('--mx',(e.clientX-b.left)+'px');p.style.setProperty('--my',(e.clientY-b.top)+'px')}));
// drag-scroll row (mouse); touch uses native swipe
const row=$('.cut-row');let down=false,sx=0,sl=0,moved=0;
row.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse')return;down=true;moved=0;sx=e.clientX;sl=row.scrollLeft});
addEventListener('pointermove',e=>{if(!down)return;const d=e.clientX-sx;if(Math.abs(d)>4){moved=1;row.classList.add('drag')}row.scrollLeft=sl-d;req()});
addEventListener('pointerup',()=>{if(!down)return;down=false;setTimeout(()=>row.classList.remove('drag'),0)});
row.addEventListener('click',e=>{if(moved){e.preventDefault();moved=0}},true);
row.addEventListener('scroll',req,{passive:true});
// pause control
const pb=$('.pause');
pb.addEventListener('click',()=>{paused=!paused;document.documentElement.classList.toggle('paused',paused);pb.setAttribute('aria-pressed',paused);pb.setAttribute('aria-label',paused?'Play motion':'Pause motion');$('.pause-t').textContent=paused?'Play':'Pause';vids.forEach(v=>paused?v.pause():(vis.get(v)&&v.play().catch(()=>{})));if(!paused)req()});
})();
