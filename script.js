(() => {
  const canvas = document.getElementById('networkCanvas');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.hero');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let width = 0, height = 0, running = !reducedMotion, frame = 0;
  // Illustrative Sri Lanka NOC topology. Node positions are visual map locations,
  // not live device coordinates or a live monitoring feed.
  const hubs = [
    {x:.679,y:.25,name:'JAFFNA',short:'JAF'},
    {x:.711,y:.43,name:'ANURADHAPURA',short:'ANU'},
    {x:.741,y:.59,name:'KURUNEGALA',short:'KUR'},
    {x:.793,y:.37,name:'TRINCOMALEE',short:'TRI'},
    {x:.825,y:.55,name:'BATTICALOA',short:'BAT'},
    {x:.753,y:.48,name:'KANDY',short:'KAN'},
    {x:.663,y:.73,name:'COLOMBO',short:'CMB',core:true},
    {x:.690,y:.86,name:'GALLE',short:'GAL'},
    {x:.724,y:.69,name:'RATNAPURA',short:'RAT'}
  ];
  const palette = {defense:['#38bdf8','#22c55e','#f59e0b','#f43f5e'],azure:['#38bdf8','#22d3ee','#22c55e']};
  let mode = 'defense', particles = [], ripples = [];
  function resize(){const r=hero.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);width=r.width;height=r.height;canvas.width=width*dpr;canvas.height=height*dpr;canvas.style.width=width+'px';canvas.style.height=height+'px';ctx.setTransform(dpr,0,0,dpr,0,0);particles=[];for(let i=0;i<24;i++)spawn(true)}
  function spawn(initial=false){const a=Math.floor(Math.random()*hubs.length),b=(a+1+Math.floor(Math.random()*(hubs.length-1)))%hubs.length;const start=hubs[a],end=hubs[b];particles.push({a:start,b:end,t:initial?Math.random():0,speed:.0025+Math.random()*.003,color:palette[mode][Math.floor(Math.random()*palette[mode].length)],size:1.1+Math.random()*1.4})}
  function point(p){const t=p.t,x=p.a.x+(p.b.x-p.a.x)*t,y=p.a.y+(p.b.y-p.a.y)*t-Math.sin(Math.PI*t)*.16;return{x:x*width,y:y*height}}
  function draw(){ctx.clearRect(0,0,width,height);
    // Draw the Sri Lanka NOC backbone and animated branch links.
    ctx.save();
    ctx.setLineDash([3,8]);
    hubs.forEach((h,i)=>{
      if(i===6) return;
      const core=hubs[6], x=core.x*width, y=core.y*height, tx=h.x*width, ty=h.y*height;
      ctx.beginPath(); ctx.moveTo(x,y); ctx.quadraticCurveTo((x+tx)/2-18,(y+ty)/2,tx,ty);
      ctx.strokeStyle='rgba(34,211,238,.27)'; ctx.lineWidth=1; ctx.stroke();
    });
    ctx.restore();
    hubs.forEach((h,i)=>{
      const x=h.x*width,y=h.y*height,core=!!h.core;
      ctx.beginPath();ctx.arc(x,y,core?5:2.8,0,Math.PI*2);
      ctx.fillStyle=core?'#22c55e':'#67e8f9';ctx.shadowBlur=core?20:12;ctx.shadowColor=ctx.fillStyle;ctx.fill();ctx.shadowBlur=0;
      if(core){ctx.beginPath();ctx.arc(x,y,11,0,Math.PI*2);ctx.strokeStyle='rgba(34,197,94,.55)';ctx.lineWidth=1;ctx.stroke()}
      ctx.fillStyle=core?'#c5ffe0':'#8daec2';ctx.font=core?'600 10px JetBrains Mono':'8px JetBrains Mono';
      ctx.fillText(h.name,x+(i%2===0?9:-58),y-8);
    });
    particles.forEach(p=>{const q=point(p);const prev={x:p.a.x*width+(p.b.x-p.a.x)*Math.max(0,p.t-.09)*width,y:p.a.y*height+(p.b.y-p.a.y)*Math.max(0,p.t-.09)*height-Math.sin(Math.PI*Math.max(0,p.t-.09))*.16*height};ctx.beginPath();ctx.moveTo(prev.x,prev.y);ctx.lineTo(q.x,q.y);ctx.strokeStyle=p.color;ctx.globalAlpha=.22;ctx.lineWidth=2.5;ctx.stroke();ctx.beginPath();ctx.arc(q.x,q.y,p.size,0,Math.PI*2);ctx.globalAlpha=1;ctx.fillStyle=p.color;ctx.shadowBlur=13;ctx.shadowColor=p.color;ctx.fill();ctx.shadowBlur=0;if(running)p.t+=p.speed;if(p.t>=1){ripples.push({x:p.b.x*width,y:p.b.y*height,r:2,alpha:.7,color:p.color});particles.splice(particles.indexOf(p),1);spawn()}});
    ripples.forEach(r=>{ctx.beginPath();ctx.arc(r.x,r.y,r.r,0,Math.PI*2);ctx.strokeStyle=r.color;ctx.globalAlpha=r.alpha;ctx.lineWidth=1;ctx.stroke();ctx.globalAlpha=1;if(running){r.r+=.8;r.alpha-=.012}});ripples=ripples.filter(r=>r.alpha>0);
    if(running)frame=requestAnimationFrame(draw);
  }
  function start(){if(!running){running=true;draw()}}function stop(){running=false;cancelAnimationFrame(frame)}
  resize();if(!reducedMotion)draw();else{running=false;drawStatic()}
  function drawStatic(){ctx.clearRect(0,0,width,height);hubs.forEach(h=>{ctx.beginPath();ctx.arc(h.x*width,h.y*height,h.core?5:3,0,7);ctx.fillStyle=h.core?'#22c55e':'#38bdf8';ctx.fill()})}
  window.addEventListener('resize',resize);window.addEventListener('resize',()=>{if(running){cancelAnimationFrame(frame);draw()}else drawStatic()});
  const toast=document.getElementById('toast');let toastTimer;
  function notify(message){toast.textContent=message;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),2600)}
  document.getElementById('copyEmail').addEventListener('click',async()=>{try{await navigator.clipboard.writeText('shafahd1911@gmail.com');document.getElementById('copyLabel').textContent='COPIED';notify('Email address copied to clipboard.')}catch{notify('Email: shafahd1911@gmail.com')}});
  document.getElementById('year').textContent=new Date().getFullYear();
  const menu=document.getElementById('menuToggle'),nav=document.getElementById('mainNav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.textContent=open?'×':'☰'});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.textContent='☰'}));
  document.querySelectorAll('.filter-btn').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));btn.classList.add('active');let count=0;document.querySelectorAll('.project-card').forEach(card=>{const show=btn.dataset.filter==='all'||card.dataset.category===btn.dataset.filter;card.hidden=!show;if(show)count++});document.getElementById('emptyState').hidden=count!==0}));
  const form=document.getElementById('contactForm');form.addEventListener('submit',e=>{e.preventDefault();let valid=true;form.querySelectorAll('input,textarea').forEach(field=>{field.classList.remove('invalid');if(!field.checkValidity()){field.classList.add('invalid');valid=false}});if(!valid){notify('Please check the highlighted fields and try again.');return}const data=new FormData(form);const subject=encodeURIComponent(data.get('subject'));const body=encodeURIComponent(`Name: ${data.get('name')}\nEmail: ${data.get('email')}\n\n${data.get('message')}`);notify('Opening your email app with the message...');window.location.href=`mailto:shafahd1911@gmail.com?subject=${subject}&body=${body}`});
})();