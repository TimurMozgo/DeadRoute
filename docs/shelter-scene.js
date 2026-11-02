'use strict';
let shelter=null;
const SHELTER_SHOTS=[
 {duration:10,text:'КОМАНДА НАШЛА УБЕЖИЩЕ.\nПОДНИМАЕМСЯ НА ПОСЛЕДНИЙ ЭТАЖ…',steps:true},
 {duration:11,image:'locked-door',click:true,dialogue:[{at:0,speaker:2,text:'Вот, давайте эту дверь откроем.'},{at:5,text:'Заперто. Попробуем другую.'}],text:''},
 {duration:2,steps:true,text:''},
 {duration:6,image:'door',click:true,dialogue:[{at:0,text:'А эта не заперта. Давайте зайдём.'}],text:''},
 {duration:4,sound:'shelter-door',text:''},
 {duration:14,image:'room',click:true,dialogue:[{at:0,text:'Мда, ну тут и бардак, конечно.'},{at:7,speaker:2,text:'Давайте уберёмся и ляжем отдохнём.'}],text:''},
 {duration:8,text:'Команда убралась и легла спать.\nНо что-то их вскоре потревожит…'},
 {duration:5,text:'Через пару часов они пришли сюда…'},
 {duration:2.784,sound:'glass',text:''},
 {duration:10,sound:'heartbeat',scratch:true,dialogue:[{at:1,text:'ОНИ ПЫТАЮТСЯ ОТКРЫТЬ ДВЕРЬ!'},{at:5,text:'Тихо… От двери отойдите.'}],text:''},
 {duration:10,image:'balcony-escape',click:true,scratch:true,scratchVolume:.16,runAfter:5,dialogue:[{at:0,text:'Балкон соединяется с соседней квартирой.'},{at:5,speaker:2,text:'Быстрее! Все за мной!'}],text:''},
 {duration:5,steps:true,running:true,sound:'shelter-breath-quiet',text:''},
 {duration:8,image:'park-exit-dark',click:true,dialogue:[{at:0,text:'Все здесь?.. Тогда вниз.'},{at:4,text:'Здесь оставаться нельзя. Идём к парку.'}],text:''},
 {duration:8,image:'park-exit-dark',text:'Через соседний подъезд команда выбралась к парку.\nДо рассвета ещё далеко…'}
];
function stopShelterSounds(keepBreath=false){if(!shelter)return;if(!keepBreath&&shelter.breath){try{shelter.breath.stop();}catch{}shelter.breath=null;}for(const s of shelter.sources){try{s.stop();}catch{}}shelter.sources=[];}
function shelterSound(name,volume=.5,limit){const source=audio.effect(name,volume);if(!source)return;shelter.sources.push(source);if(limit&&audio.ac)source.stop(audio.ac.currentTime+limit);}
function beginShelter(preview=false){audio.stopRound();audio.stopDread();audio.stopEngine();audio.stopAction();audio.stopReload();shelter={index:0,time:0,steps:0,sources:[],breath:null,breathStarted:false,reducedMotion:window.matchMedia?.('(prefers-reduced-motion: reduce)').matches||false,preview};const living=allies.filter(a=>a.hp>0&&a.name);shelter.names=preview?['МАРК','ВЕРА','ВАНЯ (Я)']:[living[0]?.name||'ВАНЯ (Я)',living[1]?.name||'ВАНЯ (Я)','ВАНЯ (Я)'];state='shelter';keys.clear();input.x=input.y=0;$('shelter').classList.remove('hidden');$('intro').classList.add('hidden');$('locationintro').style.opacity=0;showShelterShot();}
function showShelterShot(){stopShelterSounds(shelter.index===1);const shot=SHELTER_SHOTS[shelter.index];if(shot.image==='park-exit-dark'&&!shelter.preview&&!shelter.parkReady){enterShop();shelter.parkReady=true;state='shelter';$('shop').classList.add('hidden');}const sameImage=shot.image&&shot.image===SHELTER_SHOTS[shelter.index-1]?.image;if(!sameImage)shelter.cameraTime=0;$('shelterphoto').style.backgroundImage=shot.image?'url("assets/scenes/'+shot.image+'.png")':'none';$('shelterphoto').style.opacity=shot.image?'1':'0';$('sheltershade').style.opacity=shot.image?'1':'0';$('sheltertext').textContent='';$('sheltertext').setAttribute('aria-label',shot.text||'');$('shelterdialogue').style.display=shot.dialogue?'flex':'none';for(let i=0;i<2;i++){$('sheltername'+i).textContent=shelter.names[shot.dialogue?.[i]?.speaker??i];$('shelterline'+i).textContent='';$('shelterbubble'+i).style.visibility='hidden';}$('sheltershade').style.background='radial-gradient(ellipse at 50% 55%,transparent 12%,rgba(0,0,0,.12) 40%,rgba(0,0,0,.65) 100%)';if(shot.sound)shelterSound(shot.sound,shot.soundVolume??(shot.sound==='glass'?.55:shot.sound==='shelter-breath-quiet'?.16:.45));if(shot.click)shelterSound('shelter-click',.5,.35);if(shot.scratch)shelterSound('shelter-scratch',shot.scratchVolume??.45);}
function finishShelter(){const preview=shelter?.preview;stopShelterSounds();shelter=null;$('shelter').classList.add('hidden');if(preview){state='intro';$('intro').classList.remove('hidden');}else{state='shop';shopEnd=Date.now()+30000;shopSeconds=30;$('timer').textContent='30';$('shop').classList.remove('hidden');$('fade').style.opacity=0;hud();}}
function updateShelter(dt){if(!shelter||document.hidden)return;shelter.time+=dt;shelter.cameraTime=(shelter.cameraTime||0)+dt;const shot=SHELTER_SHOTS[shelter.index];const running=shot.running||(shot.runAfter!==undefined&&shelter.time>=shot.runAfter);if(shot.steps||running){shelter.steps-=dt;if(shelter.steps<=0){audio.play('step',running?2.3:1.3);shelter.steps=running?.27:.43;}}
 if(shelter.index===0&&shelter.time>=5&&!shelter.breathStarted){shelter.breathStarted=true;shelter.breath=audio.effect('shelter-breath-quiet',.16);}
 const t=shelter.time,ct=shelter.cameraTime,progress=Math.min(1,ct/(shot.image==='park-exit-dark'?16:shot.duration)),still=shelter.reducedMotion;
 const strength=(still?.15:1)*(shot.image==='locked-door'?1.8:shot.image==='door'?1.2:.35);
 let x=strength*((shot.image==='room'?-2+progress*4:0)+Math.sin(ct*1.8)*1.5),y=strength*Math.sin(ct*2.3)*1.1,roll=strength*Math.sin(ct*1.4)*.65,zoom=1.12+progress*.045;
 let stride=0;
 if(shot.image==='balcony-escape'){
 const runTime=shot.runAfter===undefined?0:Math.max(0,t-shot.runAfter);const rush=Math.min(1,runTime/5),ramp=Math.min(1,runTime);stride=(still?.12:1)*ramp;
 x+=Math.sin((ct-5)*Math.PI/.27)*1.3*stride;y+=Math.abs(Math.sin((ct-5)*Math.PI/.27))*2.1*stride;roll+=Math.sin((ct-5)*Math.PI/.54)*1.1*stride;
 zoom=1.12+progress*.025+rush*rush*.24;
 }else if(shot.image==='park-exit-dark'){
 const settle=Math.max(0,1-ct/3);stride=(still?.12:1)*settle;
 x+=Math.sin(ct*Math.PI/.27)*1.3*stride;y+=Math.abs(Math.sin(ct*Math.PI/.27))*1.8*stride;roll+=Math.sin(ct*Math.PI/.54)*stride;
 zoom=1.16+Math.min(1,ct/3)*.04;
 }
 $('shelterphoto').style.transformOrigin=shot.image==='balcony-escape'?'62% 38%':'50% 50%';
 $('shelterphoto').style.transform=`translate(${x}%,${y}%) rotate(${roll}deg) scale(${zoom})`;
 $('sheltershade').style.transform=`translate(${Math.sin(ct*1.1)*2*strength+x*.65}%,${Math.sin(ct*1.3)*1.5*strength+y*.6}%) scale(1.16)`;
 if(shot.dialogue){shot.dialogue.forEach((line,i)=>{const elapsed=t-line.at;$('shelterbubble'+i).style.visibility=elapsed>=0?'visible':'hidden';const typed=line.text.slice(0,Math.max(0,Math.floor(elapsed*26)));if($('shelterline'+i).textContent!==typed)$('shelterline'+i).textContent=typed;});}
 const text=(shot.text||'').slice(0,Math.floor(t*26));if($('sheltertext').textContent!==text)$('sheltertext').textContent=text;
 if(t>=shot.duration){shelter.index++;shelter.time=0;if(shelter.index>=SHELTER_SHOTS.length){finishShelter();return;}showShelterShot();}}


