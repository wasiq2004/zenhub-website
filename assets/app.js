// ===== year stamp =====
document.querySelectorAll('[data-yr]').forEach(el=>el.textContent=new Date().getFullYear());

// ===== INTRO: typewriter "WHERE AI CAN RUN BUSINESS" then lift away =====
(function intro(){
  const intro=document.getElementById('intro');
  const typed=document.getElementById('typed');
  if(!intro||!typed){document.body.classList.remove('intro-lock');return;}
  const text='WHERE AI CAN RUN BUSINESS';
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

  const finish=()=>{
    intro.classList.add('done');
    document.body.classList.remove('intro-lock');
    setTimeout(()=>intro.remove(),1100);
    kickReveals();
  };

  if(reduce){ typed.textContent=text; setTimeout(finish,500); return; }

  let i=0;
  (function type(){
    if(i<=text.length){ typed.textContent=text.slice(0,i); i++; setTimeout(type,70); }
    else { setTimeout(finish,900); }
  })();
  // safety: never trap the page
  setTimeout(()=>{ if(!intro.classList.contains('done')) finish(); },5200);
})();

// reveal the above-the-fold items once intro lifts
function kickReveals(){
  document.querySelectorAll('.hero .reveal').forEach((el,k)=>{
    setTimeout(()=>el.classList.add('in'),80*k);
  });
}

// ===== nav scroll state =====
const nav=document.getElementById('nav');
if(nav) addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));

// ===== mobile menu =====
const burger=document.querySelector('.burger');
const menu=document.querySelector('.mobile-menu');
if(burger&&menu){
  burger.addEventListener('click',()=>menu.classList.toggle('open'));
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
}

// ===== reveal on scroll =====
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// ===== hero glow parallax =====
const glow=document.querySelector('.hero-glow');
if(glow) addEventListener('mousemove',e=>{const x=(e.clientX/innerWidth-.5)*40,y=(e.clientY/innerHeight-.5)*40;glow.style.transform=`translate(${x}px,${y}px)`;});

// ===== HERO particle network (Three.js-style depth field, no dependency) =====
(function heroField(){
  const cv=document.getElementById('hero-canvas');
  if(!cv||matchMedia('(prefers-reduced-motion:reduce)').matches) return;
  const ctx=cv.getContext('2d');
  let w,h,dpr,pts=[],mx=.5,my=.5;
  const COLORS=['129,140,248','168,85,247','192,132,252'];

  function resize(){
    dpr=Math.min(devicePixelRatio||1,2);
    w=cv.clientWidth; h=cv.clientHeight;
    cv.width=w*dpr; cv.height=h*dpr; ctx.setTransform(dpr,0,0,dpr,0,0);
    const count=Math.min(90,Math.round(w*h/16000));
    pts=Array.from({length:count},()=>({
      x:Math.random()*w, y:Math.random()*h,
      z:Math.random()*.8+.2,
      vx:(Math.random()-.5)*.25, vy:(Math.random()-.5)*.25,
      c:COLORS[Math.floor(Math.random()*COLORS.length)]
    }));
  }
  addEventListener('mousemove',e=>{const r=cv.getBoundingClientRect();mx=(e.clientX-r.left)/r.width;my=(e.clientY-r.top)/r.height;});

  function frame(){
    ctx.clearRect(0,0,w,h);
    const px=(mx-.5)*30, py=(my-.5)*30;
    for(const p of pts){
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=w; if(p.x>w)p.x=0; if(p.y<0)p.y=h; if(p.y>h)p.y=0;
    }
    // links
    for(let i=0;i<pts.length;i++){
      const a=pts[i];
      for(let j=i+1;j<pts.length;j++){
        const b=pts[j];
        const dx=(a.x-b.x),dy=(a.y-b.y),d=Math.hypot(dx,dy);
        if(d<120){
          ctx.strokeStyle=`rgba(129,140,248,${(1-d/120)*.16*Math.min(a.z,b.z)})`;
          ctx.lineWidth=1;
          ctx.beginPath();
          ctx.moveTo(a.x+px*a.z,a.y+py*a.z);
          ctx.lineTo(b.x+px*b.z,b.y+py*b.z);
          ctx.stroke();
        }
      }
    }
    // dots
    for(const p of pts){
      const r=p.z*2.2;
      ctx.fillStyle=`rgba(${p.c},${.35+p.z*.45})`;
      ctx.beginPath();
      ctx.arc(p.x+px*p.z,p.y+py*p.z,r,0,7);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }
  resize(); addEventListener('resize',resize); frame();
})();

// ===== 3D tilt + cursor glare on cards =====
(function tiltCards(){
  const fine=matchMedia('(hover:hover)').matches && !matchMedia('(prefers-reduced-motion:reduce)').matches;
  // mark icons as floaters everywhere
  document.querySelectorAll('.picon,.why-ic,.aic').forEach(el=>el.classList.add('float-ic'));
  if(!fine) return;

  const cards=document.querySelectorAll('.why-card,.product,.agent-card');
  cards.forEach(card=>{
    card.classList.add('tilt','spot');
    let raf=null;
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const px=(e.clientX-r.left)/r.width;
      const py=(e.clientY-r.top)/r.height;
      if(raf) cancelAnimationFrame(raf);
      raf=requestAnimationFrame(()=>{
        const rx=(.5-py)*9, ry=(px-.5)*11;
        card.style.transform=`perspective(950px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) translateY(-6px)`;
        card.style.setProperty('--mx',(px*100).toFixed(1)+'%');
        card.style.setProperty('--my',(py*100).toFixed(1)+'%');
      });
    });
    card.addEventListener('pointerenter',()=>card.classList.add('lift'));
    card.addEventListener('pointerleave',()=>{
      card.classList.remove('lift');
      if(raf) cancelAnimationFrame(raf);
      card.style.transform='';
    });
  });
})();

// ===== magnetic primary buttons =====
(function magnetic(){
  if(!matchMedia('(hover:hover)').matches) return;
  document.querySelectorAll('.btn-primary,.nav-cta').forEach(btn=>{
    btn.addEventListener('pointermove',e=>{
      const r=btn.getBoundingClientRect();
      const x=(e.clientX-r.left-r.width/2)*.25;
      const y=(e.clientY-r.top-r.height/2)*.35;
      btn.style.transform=`translate(${x.toFixed(1)}px,${(y-2).toFixed(1)}px)`;
    });
    btn.addEventListener('pointerleave',()=>btn.style.transform='');
  });
})();

// ===== SMART PRODUCTS — tabbed showcase =====
(function prodTabs(){
  const tabs=document.querySelectorAll('#prod-tabs .prod-tab');
  const panels=document.querySelectorAll('#prod-stage .prod-panel');
  if(!tabs.length) return;
  tabs.forEach(tab=>{
    tab.addEventListener('click',()=>{
      const p=tab.dataset.p;
      tabs.forEach(t=>t.classList.toggle('is-active',t===tab));
      panels.forEach(panel=>{
        const on=panel.dataset.p===p;
        panel.classList.toggle('is-active',on);
      });
    });
  });
})();

// ===== AI AGENTS — 3D coverflow carousel =====
(function coverflow(){
  const root=document.getElementById('coverflow');
  if(!root) return;
  const stage=root.querySelector('.cf-stage');
  const cards=[...stage.querySelectorAll('.cf-card')];
  const dotsWrap=document.getElementById('cf-dots');
  const N=cards.length;
  if(!N) return;
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  let active=0, timer=null;

  // build dots
  const dots=cards.map((_,i)=>{
    const b=document.createElement('button');
    b.type='button'; b.setAttribute('aria-label','Go to agent '+(i+1));
    b.addEventListener('click',()=>{active=i;render();restart();});
    dotsWrap.appendChild(b); return b;
  });

  // circular offset normalised to nearest direction
  const norm=off=>{let o=((off%N)+N)%N;if(o>N/2)o-=N;return o;};

  function render(){
    const step=Math.min(250,Math.max(150,innerWidth*0.30));
    cards.forEach((card,i)=>{
      const o=norm(i-active), ao=Math.abs(o);
      const x=o*step, z=-ao*230, ry=-o*38, sc=Math.max(.6,1-ao*.16);
      const op=ao>2?0:1-ao*.34;
      card.style.transform=`translateX(${x}px) translateZ(${z}px) rotateY(${ry}deg) scale(${sc})`;
      card.style.opacity=op;
      card.style.zIndex=String(100-ao);
      card.style.pointerEvents=ao>2?'none':'auto';
      card.classList.toggle('is-active',o===0);
    });
    dots.forEach((d,i)=>d.classList.toggle('on',i===active));
  }
  const go=d=>{active=(active+d+N)%N;render();};

  // controls
  root.querySelector('.prev').addEventListener('click',()=>{go(-1);restart();});
  root.querySelector('.next').addEventListener('click',()=>{go(1);restart();});
  cards.forEach((c,i)=>c.addEventListener('click',()=>{if(norm(i-active)!==0){active=i;render();restart();}}));

  // autoplay
  function start(){if(reduce)return;stop();timer=setInterval(()=>go(1),2600);}
  function stop(){if(timer){clearInterval(timer);timer=null;}}
  function restart(){stop();start();}
  root.addEventListener('pointerenter',stop);
  root.addEventListener('pointerleave',start);
  // pause when off-screen
  new IntersectionObserver(es=>es.forEach(e=>e.isIntersecting?start():stop()),{threshold:.2}).observe(root);

  addEventListener('resize',render);
  render(); start();
})();

// ===== contact form — Web3Forms (AJAX submit, no redirect) =====
const cform=document.getElementById('cform');
if(cform){
  const note=document.getElementById('form-ok');
  const btn=cform.querySelector('button[type="submit"]');
  const setNote=(msg,color)=>{ if(note){ note.textContent=msg; note.style.color=color; note.style.display='block'; } };

  cform.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const key=cform.querySelector('[name="access_key"]').value.trim();
    if(!key || key.startsWith('PASTE_')){
      setNote('⚠ Add your Web3Forms access key in the form to enable sending.','#f0a35e');
      return;
    }
    const original=btn.textContent;
    btn.textContent='Sending…'; btn.disabled=true;
    setNote('Sending your message…','var(--muted)');
    try{
      const res=await fetch('https://api.web3forms.com/submit',{
        method:'POST',
        headers:{'Accept':'application/json'},
        body:new FormData(cform)
      });
      const data=await res.json();
      if(data.success){
        setNote('✓ Thanks! Your message has been sent — we’ll reply within one business day.','var(--accent)');
        cform.reset();
      }else{
        setNote('✕ Something went wrong: '+(data.message||'please try again or email us directly.'),'#f0a35e');
      }
    }catch(err){
      setNote('✕ Network error — please email info.zenhubautomation@gmail.com directly.','#f0a35e');
    }finally{
      btn.textContent=original; btn.disabled=false;
    }
  });
}
