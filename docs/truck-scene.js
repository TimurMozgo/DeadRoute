'use strict';
let truckScene=null;
const TRUCK_LINES=[['ВОДИТЕЛЬ','Живые! Мы за вами. Все здесь?'],['ВАНЯ (Я)','Да! Заберите нас — они уже у баррикады!'],['ВОДИТЕЛЬ','Прикрываем вас. Разворачиваюсь — заходите сзади!']];
function beginTruckScene(){if(truckScene)return;truckScene={time:0,horn:false,crew:[player,...allies.filter(a=>a.hp>0)].map((a,i)=>({...a,seat:i,hit:0,shot:0,reload:0,building:false,repairing:false})),boarded:0};state='evacuation';input.x=input.y=0;keys.clear();interactHeld=false;allies.forEach(a=>{a.repairSite=null;a.repairing=false;a.building=false;});audio.stopAction();audio.stopEngine();audio.stopDread();audio.stopRound();audio.stopReload();$('controls').style.display='none';$('bossbar').classList.add('hidden');$('notice').style.opacity=0;$('phase').textContent='ЭВАКУАЦИЯ';$('missionhint').textContent='ГРУЗОВИК ПРИБЫЛ';}
function truckHorn(){audio.tone(330,330,.8,.12,'triangle');audio.tone(440,440,.8,.08,'triangle');audio.tone(330,330,.45,.1,'triangle',1);}
function updateTruckScene(dt){const s=truckScene;if(!s)return;const old=s.time;s.time+=dt;if(old<4&&s.time>=4){truckHorn();s.horn=true;}s.boarded=Math.min(s.crew.length,Math.max(0,Math.floor((s.time-22)/1.15)));if(s.time>=22+s.crew.length*1.15+6&&!s.musicStopped){s.musicStopped=true;try{localStorage.setItem('dead-route-evacuated-v1',JSON.stringify({version:1,crew:s.crew.map((a,i)=>({name:i===0?'ВАНЯ (Я)':a.name,type:a.type})),savedAt:Date.now()}));}catch{}music.stop(1.5);}if(s.time>=22+s.crew.length*1.15+9&&!s.radioPlayed){s.radioPlayed=true;audio.effect('radio-static',.32);}if(s.time>=22+s.crew.length*1.15+23){end(true);}}
function truckRect(x,y,w,h,color){ctx.fillStyle=color;ctx.fillRect(Math.round(x),Math.round(y),w,h);}
// Small code-drawn pixel vehicle, with the kit's original survivor sprites in the cab and bed.
function drawRescueTruck(x,y,angle,passengers){ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);ctx.fillStyle='#0008';ctx.fillRect(-35,-70,74,150);
 for(const yy of [-47,32]){truckRect(-34,yy,10,23,'#111713');truckRect(24,yy,10,23,'#111713');truckRect(-33,yy+3,3,17,'#48504a');truckRect(30,yy+3,3,17,'#48504a');}
 truckRect(-27,-68,54,137,'#26352e');truckRect(-25,-66,50,42,'#69775b');truckRect(-22,-62,44,14,'#9a9d76');truckRect(-21,-44,42,17,'#1b3035');truckRect(-19,-42,17,11,'#577073');truckRect(3,-42,16,11,'#577073');
 // Driver and second rescuer seen through the windshield.
 for(const xx of [-11,10]){truckRect(xx-3,-39,7,6,'#b19c7e');truckRect(xx-4,-42,8,4,'#343b32');}
 truckRect(-27,-70,54,5,'#8b8c70');truckRect(-24,-69,9,4,'#fff3ae');truckRect(15,-69,9,4,'#fff3ae');
 const beam=ctx.createLinearGradient(0,-70,0,-200);beam.addColorStop(0,'#f5e9b440');beam.addColorStop(1,'#f5e9b400');ctx.fillStyle=beam;ctx.beginPath();ctx.moveTo(-24,-70);ctx.lineTo(-65,-210);ctx.lineTo(65,-210);ctx.lineTo(24,-70);ctx.fill();
 truckRect(-25,-20,50,85,'#111f1a');for(let yy=-17;yy<62;yy+=10)truckRect(-23,yy,46,2,'#58634c');truckRect(-29,-23,6,89,'#7d8060');truckRect(23,-23,6,89,'#7d8060');truckRect(-28,62,56,7,'#697456');truckRect(-27,66,8,3,'#ab493b');truckRect(19,66,8,3,'#ab493b');
 passengers.forEach((a,i)=>{ctx.save();ctx.translate((i%2?12:-12),i<2?9:28+Math.floor((i-2)/2)*15);ctx.rotate(-angle);ctx.scale(.6,.6);sprite({...a,x:0,y:0,anim:clock*3,face:i%2?-1:1,hit:0},'c','Idle');ctx.restore();});ctx.restore();}
function truckText(text,x,y,width){const words=text.split(' ');let line='';for(const word of words){const next=line?line+' '+word:word;if(ctx.measureText(next).width>width&&line){ctx.fillText(line,x,y);y+=19;line=word;}else line=next;}if(line)ctx.fillText(line,x,y);}
function drawTruckScene(){const s=truckScene;if(!s)return;const t=s.time,loadEnd=22+s.crew.length*1.15,centerY=Math.max(245,viewH*.43),ease=v=>{v=clamp(v,0,1);return v*v*(3-2*v);};ctx.setTransform(scale,0,0,scale,0,0);ctx.clearRect(0,0,W,viewH);ctx.fillStyle='#080f10';ctx.fillRect(0,0,W,viewH);ctx.drawImage(map,0,0,W,Math.min(H,viewH),0,0,W,Math.min(H,viewH));ctx.fillStyle='#02080bba';ctx.fillRect(0,0,W,viewH);
 // The rescue scene frames the open road, away from the construction line.
 truckRect(80,0,192,viewH,'#242c2a');for(let y=0;y<viewH;y+=66)truckRect(174,y,4,27,'#66664f');truckRect(74,0,5,viewH,'#50594c');truckRect(273,0,5,viewH,'#50594c');
 let ty=-170+(centerY+170)*ease(t/4),angle=Math.PI,tx=W/2;
 if(t>=16&&t<20){const k=ease((t-16)/4);angle=Math.PI*(1-k);tx=W/2+Math.sin(k*Math.PI)*39;ty=centerY-Math.sin(k*Math.PI)*28;}
 else if(t>=20){angle=0;ty=centerY+35*ease((t-20)/2);}
 if(t>=loadEnd+1)ty-= (centerY+260)*ease((t-loadEnd-1)/5);
 const guards=[{type:2,face:1},{type:4,face:-1}],loaded=s.crew.slice(0,s.boarded);drawRescueTruck(tx,ty+Math.sin(t*18)*.4,angle,[...guards,...loaded]);
 if(t<loadEnd){s.crew.forEach((a,i)=>{if(i<s.boarded)return;const from={x:115+(i%4)*38,y:centerY+165+Math.floor(i/4)*37},k=ease((t-22-i*1.15)/1.15),dest={x:tx,y:ty+62};sprite({...a,x:from.x+(dest.x-from.x)*k,y:from.y+(dest.y-from.y)*k,anim:t*9,face:1},'c',k>0?'Walk':'Idle');});}
 ctx.textAlign='center';ctx.font='bold 15px sans-serif';ctx.fillStyle='#efe2b5';ctx.fillText(t<4?'ОНИ ПРИЕХАЛИ':t<16?'ЭВАКУАЦИЯ':t<22?'ПОДАЁТ ГРУЗОВИК К ПОСАДКЕ':t<loadEnd?'ВСЕ В КУЗОВ!':'ДЕРЖИТЕСЬ. МЫ ВЫБРАЛИСЬ.',W/2,95);
 if(t>=4&&t<16){const n=Math.min(2,Math.floor((t-4)/4)),line=TRUCK_LINES[n],letters=Math.floor(((t-4)%4)*29);truckRect(18,viewH-160,W-36,114,'#0b1412ed');ctx.strokeStyle='#7a8762';ctx.strokeRect(18,viewH-160,W-36,114);ctx.textAlign='left';ctx.fillStyle='#c4d49d';ctx.font='bold 11px sans-serif';ctx.fillText(line[0],32,viewH-136);ctx.font='13px sans-serif';ctx.fillStyle='#e2dfcf';truckText(line[1].slice(0,letters),32,viewH-111,W-64);}
 if(t>=loadEnd+5){ctx.fillStyle='rgba(1,5,7,'+clamp((t-loadEnd-5)/2,0,1)+')';ctx.fillRect(0,0,W,viewH);ctx.fillStyle='#e0e1ca';ctx.font='bold 15px sans-serif';ctx.textAlign='center';if(t<loadEnd+9)ctx.fillText('ЗА ПЕРИМЕТРОМ. В БЕЗОПАСНОСТИ.',W/2,viewH/2);else if(t<loadEnd+18){ctx.fillStyle='#9eae92';ctx.font='bold 11px sans-serif';ctx.fillText('РАЦИЯ · НЕИЗВЕСТНЫЙ ГОЛОС',W/2,viewH/2-52);ctx.fillStyle='#e0e1ca';ctx.font='15px sans-serif';ctx.textAlign='left';truckText('Четвёртый пост… Кто-нибудь слышит? Не открывайте ворота. Повторяю: не открывайте…'.slice(0,Math.floor((t-loadEnd-9)*22)),28,viewH/2-15,W-56);}else{ctx.font='bold 17px sans-serif';ctx.fillText('КОНЕЦ ПЕРВОЙ ГЛАВЫ',W/2,viewH/2-12);ctx.font='14px sans-serif';ctx.fillText('Маршрут продолжается…',W/2,viewH/2+23);}}
}

let bossOmen=null;
function beginBossOmen(){horror.omenPlayed=true;horror.nextScare=mission.clock+35;bossOmen={time:0,voice:audio.effect('park-monster-roar',.48)};state='omen';input.x=input.y=0;keys.clear();audio.stopAction();interactHeld=false;player.moving=false;$('bossomen').classList.remove('hidden');$('omenname').textContent='ГДЕ-ТО В ТЕМНОТЕ';$('omentext').textContent='…';}
function updateBossOmen(dt){bossOmen.time+=dt;const length=audio.effectBuffers?.['park-monster-roar']?.duration||6.485;const t=bossOmen.time-length-.35;const members=allies.filter(a=>a.hp>0);const lines=[['ВАНЯ (Я)','Вы тоже это слышали? Что это было?..'],[members[0]?.name||'ВАНЯ (Я)','Слишком громко для обычного зомби. И шаги тяжёлые.'],[members[1]?.name||'ВАНЯ (Я)','Держимся вместе. Не хочу встречаться с тем, кто так рычит.']];if(t>=0){const i=Math.min(2,Math.floor(t/4.5));$('omenname').textContent=lines[i][0];$('omentext').textContent=lines[i][1].slice(0,Math.floor((t-i*4.5)*30));}if(t>=13.5){try{bossOmen.voice?.stop();}catch{}bossOmen=null;$('bossomen').classList.add('hidden');state='combat';}}

let siegeWarning=null;
function stopSiegeWarning(){if(siegeWarning){for(const source of siegeWarning.sources){try{source?.stop();}catch{}}siegeWarning=null;}}
function beginSiegeWarning(count){if(siegeWarning)return;audio.stopAction();audio.stopReload();audio.stopEngine();music.play('siege-music',.22);mission.power=false;mission.integrity=0;mission.repairDelay=0;audio.noise(.22,.12,700);shake=3;
 const members=allies.filter(a=>a.hp>0),name=(preferred,index)=>members.find(a=>a.name===preferred)?.name||members[index]?.name||'ВАНЯ (Я)';
 const fresh=members.filter(a=>!['МАРК','ВЕРА'].includes(a.name));const speaker=(preferred,index)=>members.find(a=>a.name===preferred)?.name||fresh[index%Math.max(1,fresh.length)]?.name||name(preferred,index);const lev=speaker('ЛЕВ',0),nika=speaker('НИКА',1),roman=speaker('РОМАН',2),me='ВАНЯ (Я)';
 const beats=[
 {duration:(audio.effectBuffers?.['monster-scream']?.duration||3.8)+.7,name:'ИЗ ТЕМНОТЫ',text:'За баррикадой раздаётся пронзительный крик.',sound:'monster-scream',volume:.6},
 {duration:(audio.effectBuffers?.['brute-roar']?.duration||1.6)+.8,name:'ЕЩЁ БЛИЖЕ',text:'Из темноты отвечает низкий рёв.',sound:'brute-roar',volume:.65},
 {duration:3,name:lev,text:'ГЕНЕРАТОР СДОХ… НИКА, ЧТО ТАМ?'},
 {duration:3,name:nika,text:'ТРОЕ ОГРОМНЫХ. ИДУТ ПРЯМО НА НАС!'},
 {duration:4,name:lev,text:'ВАНЯ, ЗАВОДИ ГЕНЕРАТОР! МЫ ИХ НЕ ВИДИМ!'}];
 siegeWarning={count,index:0,time:0,beats,sources:[]};state='siegewarning';input.x=input.y=0;keys.clear();interactHeld=false;player.moving=false;allies.forEach(a=>{a.moving=false;a.shot=0;a.building=false;a.repairing=false;});$('bossomen').classList.remove('hidden');$('phase').textContent='ГЕНЕРАТОР СЛОМАН';$('missionhint').textContent='ПРОЖЕКТОРЫ ПОГАСЛИ · ДЕРЖИТЕСЬ ВМЕСТЕ';$('notice').style.opacity=0;showSiegeBeat();}
function showSiegeBeat(){const s=siegeWarning,b=s.beats[s.index];for(const source of s.sources){try{source?.stop();}catch{}}s.sources=[];$('omenname').textContent=b.name;$('omentext').textContent='';if(b.sound)s.sources.push(audio.effect(b.sound,b.volume));}
function updateSiegeWarning(dt){const s=siegeWarning;if(!s)return;s.time+=dt;const b=s.beats[s.index];$('omentext').textContent=b.text.slice(0,Math.floor(s.time*(b.sound?30:22)));if(s.time<b.duration)return;s.index++;s.time=0;if(s.index<s.beats.length){showSiegeBeat();return;}
 const count=s.count;stopSiegeWarning();$('bossomen').classList.add('hidden');state='combat';spawnPressure(count,'checkpoint');for(let i=0;i<3;i++)spawnBrute();entryDelay=1;showNotice('ГРОМИЛЫ ИДУТ · ГЕНЕРАТОР НУЖНО ПОЧИНИТЬ');}
