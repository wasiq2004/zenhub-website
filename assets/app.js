// year stamp
document.querySelectorAll('[data-yr]').forEach(el=>el.textContent=new Date().getFullYear());

// nav scroll state
const nav=document.getElementById('nav');
if(nav) addEventListener('scroll',()=>nav.classList.toggle('scrolled',scrollY>30));

// mobile menu
const burger=document.querySelector('.burger');
const menu=document.querySelector('.mobile-menu');
if(burger&&menu){
  burger.addEventListener('click',()=>{menu.classList.toggle('open');});
  menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>menu.classList.remove('open')));
}

// reveal on scroll
const io=new IntersectionObserver((es)=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}})},{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// custom cursor
const dot=document.querySelector('.cursor-dot'),ring=document.querySelector('.cursor-ring');
if(dot&&ring){
  let rx=0,ry=0,mx=0,my=0;
  addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.style.left=mx+'px';dot.style.top=my+'px';});
  (function loop(){rx+=(mx-rx)*.18;ry+=(my-ry)*.18;ring.style.left=rx+'px';ring.style.top=ry+'px';requestAnimationFrame(loop);})();
  const grow=()=>ring.classList.add('hover'),shrink=()=>ring.classList.remove('hover');
  document.querySelectorAll('a,button,input,textarea,select,[data-hover],.svc-row,.member,.product,.cell').forEach(el=>{
    el.addEventListener('mouseenter',grow);el.addEventListener('mouseleave',shrink);
  });
}

// hero glow parallax
const glow=document.querySelector('.hero-glow');
if(glow) addEventListener('mousemove',e=>{const x=(e.clientX/innerWidth-.5)*40,y=(e.clientY/innerHeight-.5)*40;glow.style.transform=`translate(${x}px,${y}px)`;});

// contact form — Web3Forms (AJAX submit, no redirect)
const cform=document.getElementById('cform');
if(cform){
  const note=document.getElementById('form-ok');
  const btn=cform.querySelector('button[type="submit"]');
  const setNote=(msg,color)=>{ if(note){ note.textContent=msg; note.style.color=color; note.style.display='block'; } };

  cform.addEventListener('submit',async(e)=>{
    e.preventDefault();
    const key=cform.querySelector('[name="access_key"]').value.trim();
    if(!key || key.startsWith('PASTE_')){
      setNote('⚠ Add your Web3Forms access key in the form to enable sending.','#ff9d6e');
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
        setNote('✕ Something went wrong: '+(data.message||'please try again or email us directly.'),'#ff9d6e');
      }
    }catch(err){
      setNote('✕ Network error — please email info.zenhubautomation@gmail.com directly.','#ff9d6e');
    }finally{
      btn.textContent=original; btn.disabled=false;
    }
  });
}
