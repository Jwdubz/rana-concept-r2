(()=>{
const t=document.querySelector('.title');let i=0;
t.querySelectorAll('.w').forEach(w=>{const s=w.textContent;w.textContent='';[...s].forEach(c=>{const e=document.createElement('span');e.className='ch';e.textContent=c;e.style.setProperty('--i',i++);w.appendChild(e)})});
const nav=document.querySelector('.nav'),bench=document.querySelector('.bench'),fr=document.querySelector('.bench-frame'),bv=document.querySelector('.bench-film');
let on=false;
function tick(){
 nav.classList.toggle('solid',scrollY>innerHeight*.6);
 const r=bench.getBoundingClientRect(),span=r.height-innerHeight,p=Math.min(1,Math.max(0,-r.top/span));
 const g=Math.min(1,p/.4),mob=innerWidth<800,s0=mob?.82:.5,ease=1-Math.pow(1-g,3);
 fr.style.setProperty('--s',(s0+(1-s0)*ease).toFixed(4));fr.style.setProperty('--r',(28*(1-ease)).toFixed(1));
 
}
addEventListener('scroll',tick,{passive:true});addEventListener('resize',tick);tick();
const tryBench=()=>{const r=bv.getBoundingClientRect();if(r.bottom>0&&r.top<innerHeight){if(bv.paused)bv.play().catch(()=>{})}else if(!bv.paused)bv.pause()};
new IntersectionObserver(es=>es.forEach(e=>{e.isIntersecting?bv.play().catch(()=>{}):bv.pause()}),{threshold:0}).observe(bench);addEventListener("scroll",tryBench,{passive:true});["touchstart","click"].forEach(t=>addEventListener(t,tryBench,{once:true,passive:true}));tryBench();
document.querySelectorAll('.cut .ph').forEach(p=>p.addEventListener('pointermove',e=>{const b=p.getBoundingClientRect();p.style.setProperty('--mx',(e.clientX-b.left)+'px');p.style.setProperty('--my',(e.clientY-b.top)+'px')}));
const hv=document.querySelector('.hero-film');hv.play&&hv.play().catch(()=>{});
})();
