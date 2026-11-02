'use strict';
let horror=null,darkCanvas=null;
function safeQuestPoint(x,y){for(let n=0;n<70;n++){const p={x:clamp(x+(n%3-1)*24,40,W-40),y:clamp(y-Math.floor(n/3)*16,90,H-60)};if(!blocked(p.x,p.y,14))return p;}return {x:176,y:1100};}
function setupHorror(){audio.stopDread?.();horror={charge:1,restored:false,good:0,searched:0,blackout:0,nextScare:25,sequence:-1,evac:false,evacTime:0,evacWave:0,entryGroups:0,omenPlayed:false};
 horror.batteries=stage>=3?[[112,975],[240,760],[112,540],[240,310]].map(([x,y],i)=>({...safeQuestPoint(x,y),id:'battery'+i,searched:false})):[];
 horror.exit=safeQuestPoint(176,140);horror.entrance=safeQuestPoint(88,240);horror.shelterFound=false;horror.quality=[false,true,false,true];
 if(Math.random()<.5)horror.quality=[true,false,false,true];
 if(stage===1){mission.boxes=[{...safeQuestPoint(240,1020),id:'intel',label:'СВЕДЕНИЯ ОБ УБЕЖИЩЕ',searched:false},{...safeQuestPoint(112,600),id:'key',label:'КЛЮЧ ОТ УБЕЖИЩА',searched:false},{...safeQuestPoint(240,350),id:'supplies',label:'ПРИПАСЫ ДЛЯ ОТХОДА',searched:false}];}
}
function batteryTarget(){if(!horror||stage<3||horror.restored)return null;const b=horror.batteries.find(b=>!b.searched&&dist(player,b)<40&&visible(player,b));return b?{...b,kind:'battery',duration:3}:null;}
function searchBattery(id){const b=horror.batteries.find(b=>b.id===id);if(!b||b.searched)return;b.searched=true;const good=horror.quality[horror.searched++];if(good)horror.good++;if(horror.good>=2){horror.restored=true;horror.charge=1;showNotice('ИСПРАВНЫЕ БАТАРЕЙКИ · СВЕТ ОТРЯДА ВОССТАНОВЛЕН');}else showNotice(good?'ИСПРАВНЫЙ КОМПЛЕКТ 1 / 2':'БАТАРЕЙКИ РАЗРЯЖЕНЫ · ИЩИ ДАЛЬШЕ');audio.play('pickup');}
function updateHorror(dt){if(!horror||state!=='combat'||stage===5)return;const h=horror;
 if(stage===3&&!h.omenPlayed&&mission.clock>=15){beginBossOmen();return;}
 if(stage>=3&&!h.restored)h.charge=Math.max(0,h.charge-dt/55);
 h.blackout=Math.max(0,h.blackout-dt);
 if(stage>=3&&mission.clock>=h.nextScare&&h.sequence<0){h.nextScare=mission.clock+48;h.blackout=4;h.sequence=0;audio.stopDread?.();h.glass=audio.effect('glass',.65);showNotice('СВЕТ ПОГАС · ПРИСЛУШАЙСЯ');}
 if(h.sequence>=0){const old=h.sequence;h.sequence+=dt;const glassLength=audio.effectBuffers?.glass?.duration||2.784;if(old<glassLength&&h.sequence>=glassLength)h.heart=audio.effect('heartbeat',.55);if(old<glassLength+4&&h.sequence>=glassLength+4)spawnPressure(3+stage,'noise');if(h.sequence>=glassLength+11.4)h.sequence=-1;}
}
function horrorTasks(tasks,dt){const h=horror;if(!h||stage===5)return tasks;
 if(stage===1)tasks=[{text:'Найти сведения об убежище',done:mission.boxes[0].searched},{text:'Найти ключ от убежища',done:mission.boxes[1].searched},{text:'Спасти выжившего',done:survivors.some(c=>c.saved)},{text:'Собрать припасы для отхода',done:mission.boxes[2].searched}];
 if(stage>=3)tasks.push({text:'Исправные батарейки '+h.good+'/2',done:h.restored});
 if(stage===2){const ready=tasks.every(t=>t.done);if(ready)h.shelterFound=true;tasks.push({text:!h.shelterFound?'Найти адрес убежища в припасах':'Добраться до подъезда убежища',done:h.shelterFound&&dist(player,h.entrance)<42});}
 const baseDone=tasks.every(t=>t.done);
 if(stage===5&&baseDone&&!h.evac){h.evac=true;h.evacTime=0;h.baseTasks=tasks.map(t=>({...t,done:true}));audio.stopEngine?.();showNotice('К ТОЧКЕ ЭВАКУАЦИИ · ПРИКРОЙ ОТХОД');spawnPressure(5+stage,'escape');h.evacWave=1;}
 if(h.evac){tasks=h.baseTasks.map(t=>({...t}));if(dist(player,h.exit)<75){h.evacTime=Math.min(45,h.evacTime+dt);if(h.evacTime>=22&&h.evacWave===1){h.evacWave++;spawnPressure(4+stage,'escape');}}
 const hostile=[...enemies,...pendingEnemies].some(e=>e.hp>0&&e.waveTag==='escape');tasks.push({text:'Эвакуация: удержать точку '+Math.floor(h.evacTime)+'/45 с',done:h.evacTime>=45&&!hostile&&pendingEnemies.length===0});}
 return tasks;
}
function lightRadius(index=0){if(stage===5)return 125;if(stage<3)return 999;const h=horror;if(!h)return 100;const charge=h.restored?1:Math.max(0,h.charge-index*.12);return h.blackout>0?26:26+charge*90;}
function isLit(point){if(checkpoint){if(checkpoint.phase==='prep'||checkpoint.phase==='dusk')return true;if(mission.power&&checkpoint.sections.some(b=>dist(point,b)<210))return true;if(checkpoint.arrived&&dist(point,checkpoint.exit)<200)return true;}if(stage<3)return true;if(dist({x:player.x,y:player.y-12},{x:point.x,y:point.y-12})<lightRadius()*.7)return true;if(allies.some((a,i)=>a.hp>0&&dist({x:a.x,y:a.y-12},{x:point.x,y:point.y-12})<lightRadius(i+1)*.7))return true;return mission?.power&&horror?.blackout<=0&&dist(point,mission.generator)<155;}
function horrorGoal(){if(stage===5)return checkpointGoal();if(!horror)return null;if(horror.evac)return horror.exit;if(stage===2&&horror.shelterFound)return horror.entrance;if(stage>=3&&!horror.restored&&(horror.charge<.6||mission.boxes.every(b=>b.searched)))return horror.batteries.find(b=>!b.searched);return mission.boxes.find(b=>!b.searched)||survivors.find(c=>!c.saved&&c.hp>0)||(stage===3&&!mission.power?mission.generator:null);}
function drawHorrorProps(){if(!horror)return;if(stage===2&&horror.shelterFound){const p=horror.entrance;ctx.strokeStyle='#d7d4a1';ctx.lineWidth=2;ctx.strokeRect(p.x-19,p.y-25,38,36);ctx.fillStyle='#eee2b4';ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillText('ПОДЪЕЗД · УБЕЖИЩЕ',p.x+30,p.y-36);}for(const b of horror.batteries){if(b.searched)continue;questSprite('crate',b.x,b.y,24,24);ctx.fillStyle='#d8d8b1';ctx.font='bold 8px monospace';ctx.textAlign='center';ctx.fillText('БАТАРЕЙКИ?',b.x,b.y-31);}if(horror.evac){const p=horror.exit;ctx.strokeStyle='#d5dcb1';ctx.lineWidth=2;ctx.beginPath();ctx.arc(p.x,p.y,60,0,Math.PI*2);ctx.stroke();ctx.fillStyle='#ece3bc';ctx.fillText('ЭВАКУАЦИЯ',p.x,p.y-65);}}
function drawDarkness(){if(stage<3||!horror||checkpoint?.phase==='prep'){drawGoalHint();return;}if(!darkCanvas)darkCanvas=document.createElement('canvas');if(darkCanvas.width!==W||darkCanvas.height!==Math.ceil(viewH)){darkCanvas.width=W;darkCanvas.height=Math.ceil(viewH);}const g=darkCanvas.getContext('2d');g.globalCompositeOperation='source-over';g.clearRect(0,0,W,viewH);g.fillStyle='rgba(1,5,8,'+(checkpoint?.phase==='dusk'?Math.min(.995,checkpoint.dusk/8):.995)+')';g.fillRect(0,0,W,viewH);g.globalCompositeOperation='destination-out';
 const hole=(p,r)=>{const light=g.createRadialGradient(p.x,p.y-cam,6,p.x,p.y-cam,r);light.addColorStop(0,'rgba(0,0,0,1)');light.addColorStop(.55,'rgba(0,0,0,.92)');light.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=light;g.fillRect(p.x-r,p.y-cam-r,r*2,r*2);};
 hole({x:player.x,y:player.y-12},lightRadius());allies.forEach((a,i)=>{if(a.hp>0)hole({x:a.x,y:a.y-12},lightRadius(i+1));});if(mission.power&&horror.blackout<=0)hole(mission.generator,155);if(checkpoint){if(mission.power)checkpoint.sections.forEach(b=>hole(b,240));if(checkpoint.arrived)hole(checkpoint.exit,220);}g.globalCompositeOperation='source-over';ctx.drawImage(darkCanvas,0,0);
 drawGoalHint();
}
function drawGoalHint(){
 const goal=horrorGoal();if(goal){const angle=Math.atan2(goal.y-player.y,goal.x-player.x),y=viewH-174;ctx.save();ctx.translate(35,y);ctx.rotate(angle);ctx.fillStyle='#eddb9e';ctx.beginPath();ctx.moveTo(7,0);ctx.lineTo(-5,-5);ctx.lineTo(-5,5);ctx.closePath();ctx.fill();ctx.restore();ctx.font='bold 9px sans-serif';ctx.textAlign='center';ctx.fillStyle='#ece0bd';ctx.fillText((horror.evac?'ЭВАКУАЦИЯ':goal.id?.startsWith('battery')?'БАТАРЕЙКИ':'ЦЕЛЬ')+' · '+Math.round(dist(player,goal)/16)+' м',W/2,viewH-170);}
}
