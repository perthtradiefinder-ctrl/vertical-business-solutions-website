/* VBS-HERO-02. Approved marketing workflow; illustrative records and pricing. */
(() => {
 'use strict';
 const root=document.querySelector('.vbs-hero');if(!root)return;
 const $=s=>root.querySelector(s), $$=s=>[...root.querySelectorAll(s)];
 if(!window.gsap||!window.ScrollTrigger){root.querySelector('#vbs-stage-title').textContent='One connected workflow.';return;}
 const duration=17, query=new URLSearchParams(location.search), reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const stages=[{t:0,title:'An enquiry becomes a job brief.'},{t:2.5,title:'Site photos become usable information.'},{t:5,title:'The proposed finish takes shape.'},{t:8,title:'Every part becomes a priced quote.'},{t:11,title:'An approval becomes a scheduled job.'},{t:13.5,title:'The job finishes. The business closes it out.'}];
 const scene=$('#vbs-scene'),world=$('#vbs-world'),track=root,scrubber=$('#vbs-scrubber');
 let tl,scroll,playing=false,now=0,last=0,endHold=0,frame,visible=true,lastStage=-1,mobile=false;
 let booted=false,metrics={frames:0,longFrames:0,maxFrameMs:0},deltaSamples=[];
 // Deterministic physical pavers, concrete fragments and restrained light particles.
 for(let i=0;i<60;i++){let e=document.createElement('div');e.className='vbs-paver-tile';e.style.background=`linear-gradient(135deg,hsl(92 9% ${73+(i*7%9)}%),hsl(170 9% ${61+(i*3%7)}%))`;$('#vbs-paver-plane').append(e);}
 for(let i=0;i<14;i++){let e=document.createElement('div');e.className='vbs-fragment';e.style.left=(i*23%290)+'px';e.style.top=(i*37%174)+'px';$('#vbs-fragments').append(e);}
 for(let i=0;i<12;i++){let e=document.createElement('div');e.className='vbs-particle';$('#vbs-particles').append(e);}
 // Pavers in the real background share the photograph's exact driveway footprint.
 const svg=$('.vbs-finished-driveway'),ns='http://www.w3.org/2000/svg';
 $('#vbs-driveway-finish').setAttribute('d','M592 299L960 299L1780 864L-220 864Z');$('#vbs-finish-edge').setAttribute('d','M592 299L-220 864M960 299L1780 864');
 for(let row=0;row<22;row++)for(let col=0;col<12;col++){
  const y0=row/22,y1=(row+1)/22,at=(c,y)=>{const l=592+(-812)*y,r=960+820*y;return [l+(r-l)*c,299+565*y];};
  const points=[at(col/12+.002,y0+.002),at((col+1)/12-.002,y0+.002),at((col+1)/12-.002,y1-.002),at(col/12+.002,y1-.002)];
  const p=document.createElementNS(ns,'polygon');p.setAttribute('points',points.map(p=>p.join(',')).join(' '));p.setAttribute('fill',`hsl(100 5% ${65+(row*3+col*7)%9}%)`);p.setAttribute('stroke','#6c7874');p.setAttribute('stroke-width','.8');svg.append(p);
 }
 function sizeWorld(){mobile=matchMedia('(max-width:700px)').matches;const w=mobile?580:960,h=mobile?720:650;world.style.width=w+'px';world.style.height=h+'px';const scale=Math.min(scene.clientWidth/w,scene.clientHeight/h);world.style.transform=`translate(-50%,-50%) scale(${scale})`;}
 function ui(){let index=stages.findLastIndex(s=>now>=s.t);if(index<0)index=0;$('#vbs-stage-number').textContent=String(index+1).padStart(2,'0')+' / 06';$('#vbs-stage-title').textContent=stages[index].title;$$('.vbs-stage-nav button').forEach((b,i)=>{b.classList.toggle('vbs-active',i===index);if(i===index)b.setAttribute('aria-current','step');else b.removeAttribute('aria-current');});if(index!==lastStage){lastStage=index;$('#vbs-stage-announcement').textContent=stages[index].title;}scrubber.value=String(now);$('#vbs-time').textContent='00:'+String(Math.floor(now)).padStart(2,'0')+' / 00:17';$('#vbs-play').classList.toggle('vbs-is-active',playing);$('#vbs-pause').classList.toggle('vbs-is-active',!playing);}
 function seek(t){now=Math.min(duration,Math.max(0,Number(t)||0));tl?.time(now,false);ui();}
 function pause(){playing=false;last=0;ui();}
 function play(reset=false){if(reduced.matches)return;if(reset||now>=duration)seek(0);playing=true;last=0;endHold=0;ui();}
 function build(){
  const retained=now, wasPlaying=playing;tl?.kill();sizeWorld();gsap.set('.vbs-object',{autoAlpha:0,xPercent:-50,yPercent:-50,transformOrigin:'50% 50%'});gsap.set('.vbs-screen-pane',{autoAlpha:0,x:0});gsap.set('.vbs-phone-portal,.vbs-beam,.vbs-portal-scan,.vbs-finish-message',{opacity:0});gsap.set('.vbs-scene-heading',{opacity:1});gsap.set('.vbs-finished-driveway',{opacity:0});svg.setAttribute('preserveAspectRatio',mobile?'xMaxYMid slice':'xMidYMid slice');
  gsap.set('.vbs-paver-tile',{opacity:0,z:90,y:-18});gsap.set('.vbs-fragment',{opacity:0});gsap.set('.vbs-particle',{opacity:0});gsap.set('.vbs-calendar-slot,.vbs-approved-stamp,.vbs-job-created,.vbs-tap-ring',{opacity:0});gsap.set('.vbs-approve-button',{backgroundColor:'#68baee'});
  gsap.set('#vbs-base-plane',{z:-26});gsap.set('#vbs-sand-plane',{z:-12});gsap.set('#vbs-paver-plane',{z:2,opacity:1});gsap.set('#vbs-edging-plane',{z:4,opacity:0});gsap.set('#vbs-old-plane',{opacity:1,clipPath:'inset(0% 0% 0% 0%)'});gsap.set('#vbs-scan-plane',{opacity:0,x:0});gsap.set('.vbs-progress-line i',{scaleX:0});gsap.set('.vbs-compare-label',{opacity:0});
  const cx=mobile?290:480,cy=mobile?348:312,ix=mobile?104:160,iy=mobile?420:304,ox=mobile?478:775,oy=mobile?220:300;
  gsap.set('#vbs-phone',{autoAlpha:1,x:cx,y:cy,scale:mobile?1:.9,rotationY:-13,rotationX:4,rotationZ:-2});
  const pane=(selector,t)=>{tl.to('.vbs-screen-pane',{autoAlpha:0,x:12,duration:.22},t);tl.fromTo(selector,{autoAlpha:0,x:-12},{autoAlpha:1,x:0,duration:.32},t+.14);};
  const portal=(t,colour='#6bbdff')=>{tl.to('.vbs-phone-portal',{opacity:.85,borderColor:colour,duration:.14},t);tl.fromTo('.vbs-portal-scan',{opacity:.9,y:0},{opacity:0,y:265,duration:.48,ease:'none'},t+.06);tl.to('.vbs-phone-portal',{opacity:.12,duration:.38},t+.5);tl.to('#vbs-phone',{rotationY:-7,rotationX:2,duration:.2},t);tl.to('#vbs-phone',{rotationY:-13,rotationX:4,duration:.5},t+.3);};
  const input=(selector,t,{x=ix,y=iy,z=80,rotation=-7,hold=.26}={})=>{tl.set(selector,{autoAlpha:1,x:x-(mobile?110:220),y:y+25,z,scale:.83,rotationZ:rotation,rotationY:-12,clipPath:'inset(0% 0% 0% 0%)'},t);tl.to(selector,{x,y,scale:1,rotationY:0,duration:.42,ease:'power2.out'},t);tl.to(selector,{x:cx-15,y:cy,z:10,scale:.12,rotationZ:0,rotationY:35,clipPath:'inset(0% 0% 0% 100%)',duration:.56,ease:'power2.in'},t+.42+hold);tl.set(selector,{autoAlpha:0},t+1.0+hold);tl.fromTo('.vbs-beam-in',{opacity:.1,scaleX:0},{opacity:.75,scaleX:1,duration:.38},t+.4);tl.to('.vbs-beam-in',{opacity:0,duration:.25},t+1.05);portal(t+.66+hold);};
  const output=(selector,t,{x=ox,y=oy,scale=1,hold=.45,exit=true}={})=>{tl.set(selector,{autoAlpha:1,x:cx+12,y:cy,z:8,scale:.08,rotationY:-32,rotationZ:4,clipPath:'inset(0% 100% 0% 0%)'},t);tl.to(selector,{x,y,z:75,scale,rotationY:-7,rotationZ:0,clipPath:'inset(0% 0% 0% 0%)',duration:.64,ease:'power3.out'},t);tl.fromTo('.vbs-beam-out',{opacity:.1,scaleX:0},{opacity:.8,scaleX:1,duration:.38},t);tl.to('.vbs-beam-out',{opacity:0,duration:.3},t+.55);if(exit){tl.to(selector,{x:x+(mobile?170:330),y:y-25,z:-100,scale:.64,rotationY:-20,duration:.55,ease:'power2.in'},t+.64+hold);tl.set(selector,{autoAlpha:0},t+1.19+hold);}};
  tl=gsap.timeline({paused:true,defaults:{ease:'power2.inOut'}});
  tl.to('#vbs-phone',{y:cy-5,rotationZ:-1,duration:8.5,ease:'sine.inOut'},0).to('#vbs-phone',{y:cy,rotationZ:-2,duration:8.5,ease:'sine.inOut'},8.5);
  // 01: unstructured enquiry compresses into the screen; fields organise before the output emerges.
  input('#vbs-enquiry',0,{hold:.3});pane('#vbs-screen-enquiry',.84);
  ['#vbs-chip-name','#vbs-chip-location','#vbs-chip-area'].forEach((id,i)=>{tl.set(id,{autoAlpha:1,x:cx-95+i*17,y:cy-45+i*37,scale:.75,rotationZ:-12+i*9},.9+i*.08);tl.to(id,{x:cx,y:cy-37+i*37,scale:.34,rotationZ:0,duration:.4},1.02+i*.08);tl.to(id,{autoAlpha:0,duration:.09},1.42+i*.08);});
  tl.fromTo('#vbs-screen-enquiry .vbs-data-row',{x:-100,opacity:0},{x:0,opacity:1,stagger:.07,duration:.32},1.14);
  output('#vbs-brief',1.58,{hold:.25});
  // 02: site photographs retain separate depth, then scan and map inside the device.
  input('#vbs-photo3',2.5,{x:ix-7,y:iy-40,z:-45,rotation:-15,hold:.1});input('#vbs-photo2',2.63,{x:ix+3,y:iy+7,z:30,rotation:10,hold:.13});input('#vbs-photo1',2.78,{x:ix+14,y:iy+35,z:90,rotation:-5,hold:.2});pane('#vbs-screen-photos',3.5);
  tl.fromTo('.vbs-screen-scan',{y:0},{y:118,duration:.63,ease:'none'},3.72);tl.fromTo('.vbs-photo-grid',{scale:1.1,opacity:0},{scale:1,opacity:.65,duration:.45},3.84);
  output('#vbs-assessment',4.25,{y:oy-30,hold:.12});
  // 03: the scanned old site expands out of the screen; tiles assemble behind a moving scan plane.
  pane('#vbs-screen-makeover',5.04);portal(5.04);
  tl.set('#vbs-model',{autoAlpha:1,x:cx,y:cy,z:20,scale:.16,rotationY:0},4.95);tl.to('#vbs-model',{x:mobile?285:505,y:mobile?328:284,z:100,scale:mobile?.88:1.13,rotationY:-5,duration:.62},4.95);
  tl.set('#vbs-scan-plane',{opacity:1},5.54);tl.to('#vbs-scan-plane',{x:310,duration:1.18,ease:'none'},5.54);
  tl.to('#vbs-old-plane',{clipPath:'inset(0% 0% 0% 100%)',duration:1.18,ease:'none'},5.54);
  $$('.vbs-paver-tile').forEach((el,i)=>{let c=i%10,r=Math.floor(i/10);tl.to(el,{opacity:1,z:0,y:0,duration:.24,ease:'back.out(1.2)'},5.62+c*.103+r*.016);});
  $$('.vbs-fragment').forEach((el,i)=>{tl.set(el,{opacity:.8},5.59+(i%10)*.08);tl.to(el,{x:(i%2?1:-1)*(24+i*3),y:-25-i*2,z:90+i*4,rotation:i*20,opacity:0,duration:.4},5.6+(i%10)*.08);});
  tl.to('#vbs-edging-plane',{opacity:1,z:4,duration:.25},6.67).to('#vbs-scan-plane',{opacity:0,duration:.18},6.74);
  tl.to('.vbs-compare-label',{opacity:1,duration:.18},6.93);tl.fromTo('.vbs-compare-label i',{scaleX:.05},{scaleX:1,duration:.35},6.93);
  output('#vbs-concept',7.08,{y:mobile?175:265,hold:.12});
  // 04: keep the same physical model, separate the build layers, price them, then stream into the phone.
  pane('#vbs-screen-quote',8.1);tl.to('#vbs-model',{x:mobile?274:450,y:mobile?329:302,scale:mobile?.74:.95,z:80,duration:.35},8);
  tl.to('#vbs-paver-plane',{z:105,duration:.42},8.18);tl.to('#vbs-sand-plane',{z:22,duration:.42},8.18);tl.to('#vbs-base-plane',{z:-58,duration:.42},8.18);tl.to('#vbs-edging-plane',{x:95,z:45,duration:.42},8.18);
  const tagPositions=mobile?[[91,165],[90,250],[91,342],[468,175],[468,277],[468,365]]:[[185,173],[185,274],[185,379],[811,178],[811,275],[811,378]];
  ['pavers','sand','base','edging','labour','equipment'].forEach((name,i)=>{const id='#vbs-tag-'+name,[x,y]=tagPositions[i];tl.set(id,{autoAlpha:1,x:cx,y:cy,scale:.05,z:-10},8.25+i*.045);tl.to(id,{x,y,scale:mobile?.8:1,z:110,duration:.38},8.25+i*.045);tl.to(id,{x:cx,y:cy+8,scale:.05,z:0,rotationY:30,duration:.47,ease:'power2.in'},9.32+i*.065);tl.set(id,{autoAlpha:0},9.8+i*.065);});
  tl.set('#vbs-worker-icon',{autoAlpha:1,x:mobile?463:704,y:mobile?315:315,scale:.9},8.55);tl.set('#vbs-equipment-icon',{autoAlpha:1,x:mobile?465:706,y:mobile?413:425,scale:.8},8.6);
  tl.to(['#vbs-worker-icon','#vbs-equipment-icon'],{x:cx,y:cy,scale:.05,autoAlpha:0,duration:.45,stagger:.08},9.47);
  tl.to(['#vbs-paver-plane','#vbs-sand-plane','#vbs-base-plane'],{z:0,duration:.28},9.42);tl.to('#vbs-edging-plane',{x:0,z:4,duration:.28},9.42);
  tl.to('#vbs-model',{x:cx,y:cy,scale:.03,z:-2,autoAlpha:0,duration:.5,ease:'power2.in'},9.66);
  tl.fromTo('#vbs-screen-quote .vbs-quote-line',{x:-80,opacity:0},{x:0,opacity:1,duration:.2,stagger:.06},9.62);portal(9.64,'#efaa57');
  output('#vbs-quote',10.05,{y:mobile?213:290,hold:.35,exit:false});
  // 05: exact quote remains the review object; customer approval folds it into a job and calendar slot.
  pane('#vbs-screen-approval',11);tl.to('#vbs-quote',{x:cx+5,y:cy,scale:.08,z:10,rotationY:40,rotationZ:4,duration:.48,ease:'power2.in'},11.04);tl.set('#vbs-quote',{autoAlpha:0},11.53);portal(11.33);
  tl.fromTo('.vbs-tap-ring',{opacity:1,scale:.1},{opacity:0,scale:2.6,duration:.45},11.63);tl.to('.vbs-approve-button',{backgroundColor:'#64d7a5',duration:.2},11.77);tl.to('.vbs-approved-stamp',{opacity:1,scale:1.06,duration:.25},11.84);tl.to('.vbs-job-created',{opacity:1,duration:.2},12.03);portal(11.83,'#60d5a4');
  const calx=mobile?468:765,caly=mobile?278:304;
  tl.set('#vbs-calendar',{autoAlpha:1,x:calx+200,y:caly+40,z:-30,rotationY:-18},11.85);tl.to('#vbs-calendar',{x:calx,y:caly,z:15,rotationY:-5,duration:.55},11.85);
  output('#vbs-job',12.12,{x:calx,y:caly-125,scale:mobile?.72:.82,exit:false});tl.to('#vbs-job',{y:caly+10,z:20,scale:.45,rotationX:55,duration:.45,ease:'power2.in'},12.67);tl.to('#vbs-job',{autoAlpha:0,scale:.15,duration:.12},13.1);tl.to('.vbs-calendar-slot',{opacity:1,duration:.13},13.1);
  // 06: progress and closeout. The driveway in the SAME photograph visibly acquires its finish.
  tl.set('#vbs-job-progress',{autoAlpha:1,x:mobile?286:487,y:mobile?552:499,scale:.85,z:45},13.48);tl.to('.vbs-progress-line i',{scaleX:1,duration:1.28,ease:'none'},13.55);
  tl.to('#vbs-calendar',{x:calx+270,y:caly-30,scale:.65,z:-80,autoAlpha:0,duration:.55},13.66);
  tl.to('.vbs-finished-driveway',{opacity:.61,duration:1.1,ease:'power2.out'},14.12);
  pane('#vbs-screen-complete',14.72);portal(14.85,'#60d5a4');tl.to('#vbs-job-progress',{y:mobile?578:520,autoAlpha:0,duration:.35},14.99);
  output('#vbs-outcome-invoice',15.02,{x:mobile?470:768,y:mobile?209:234,scale:mobile?.93:1,exit:false});output('#vbs-outcome-customer',15.3,{x:mobile?477:779,y:mobile?291:306,scale:mobile?.93:1,exit:false});output('#vbs-outcome-revenue',15.58,{x:mobile?474:775,y:mobile?372:379,scale:mobile?.93:1,exit:false});
  tl.to('.vbs-finish-message',{opacity:1,y:0,duration:.45},16.0);tl.to('.vbs-scene-heading',{opacity:.65,duration:.35},16.1);
  // Particle streams are deterministic, lower-count on mobile and never fill the environment.
  const particleTimes=[.8,3.6,5.4,9.6,11.45,15.0];particleTimes.forEach(t=>{ $$('.vbs-particle').slice(0,mobile?4:10).forEach((p,i)=>{tl.fromTo(p,{opacity:0,x:cx-90-i*12,y:cy+(i%3-1)*15,z:30},{opacity:.8,x:cx+20,y:cy+(i%3-1)*7,duration:.22,ease:'none'},t+i*.024);tl.to(p,{opacity:0,x:cx+150+i*7,y:cy-12+i*3,duration:.3,ease:'none'},t+.22+i*.024);});});
  tl.to({}, {duration:.01},16.99);seek(retained);playing=wasPlaying;ui();
 }
 function tick(stamp){frame=requestAnimationFrame(tick);if(!playing||!visible||document.hidden){last=0;return;}if(last){const ms=stamp-last;metrics.frames++;metrics.maxFrameMs=Math.max(metrics.maxFrameMs,ms);if(ms>25)metrics.longFrames++;if(deltaSamples.length<2000)deltaSamples.push(ms);if(now>=duration){endHold+=ms;if(endHold>1100){seek(0);endHold=0;}}else seek(now+Math.min(ms,80)/1000);}last=stamp;}
 function setupScroll(){scroll?.kill();if(reduced.matches)return;let previousY=window.scrollY;scroll=ScrollTrigger.create({trigger:track,start:()=>`top ${parseFloat(getComputedStyle(root).getPropertyValue('--vbs-header'))}px`,end:'bottom bottom',onUpdate:self=>{if(window.scrollY!==previousY){previousY=window.scrollY;pause();seek(self.progress*duration);}}});}
 function staticMode(){pause();root.classList.add('vbs-no-animation');seek(17);gsap.set('#vbs-outcome-revenue',{autoAlpha:0});gsap.set('.vbs-finish-message',{opacity:0});$$('#vbs-play,#vbs-replay,#vbs-watch,#vbs-pause,#vbs-scrubber,.vbs-stage-nav button').forEach(b=>{b.disabled=true;b.title='Animation is disabled by your reduced-motion preference';});$('#vbs-stage-title').textContent='One connected workflow.';}
 $('#vbs-play').addEventListener('click',()=>play());$('#vbs-pause').addEventListener('click',pause);$('#vbs-replay').addEventListener('click',()=>play(true));$('#vbs-watch').addEventListener('click',()=>play(true));scrubber.addEventListener('input',e=>{const requested=Number(e.target.value);pause();seek(requested);});
 $$('.vbs-stage-nav button').forEach(b=>b.addEventListener('click',()=>{pause();seek(Number(b.dataset.time)+.02);}));
 $('#vbs-hero-demo').addEventListener('click',pause);$('#vbs-products-cta').addEventListener('click',pause);
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;if(visible&&!booted&&!query.has('capture')&&!reduced.matches){booted=true;play();}}, {threshold:.2}).observe(scene);
 let resizeTimer;new ResizeObserver(()=>{clearTimeout(resizeTimer);resizeTimer=setTimeout(()=>{build();setupScroll();if(reduced.matches)staticMode();},120);}).observe(scene);
 document.addEventListener('visibilitychange',()=>{last=0;});reduced.addEventListener('change',()=>location.reload());
 root.classList.remove('vbs-static');$$('button,input').forEach(b=>b.disabled=false);gsap.registerPlugin(ScrollTrigger);build();setupScroll();if(reduced.matches)staticMode();frame=requestAnimationFrame(tick);
 window.VBSHero={seek:t=>{pause();seek(t);},play:()=>play(),pause,duration,get state(){return {time:now,playing,mobile,reduced:reduced.matches}},get metrics(){return {...metrics,meanFrameMs:deltaSamples.length?deltaSamples.reduce((a,b)=>a+b,0)/deltaSamples.length:0}},resetMetrics(){metrics={frames:0,longFrames:0,maxFrameMs:0};deltaSamples=[];},destroy(){pause();cancelAnimationFrame(frame);scroll?.kill();tl?.kill();}};
})();
