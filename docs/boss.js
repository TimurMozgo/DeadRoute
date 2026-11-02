'use strict';
// Original Enimies_4 sheets, scaled with nearest-neighbour rendering, no replacement art.
let brute=null;
function spawnBrute(){if(stage!==5)return;let x=176,y=clamp(player.y-240,140,950);while(blocked(x,y,18)&&y<800)y+=16;brute={...actor(x,y,4),boss:true,hp:850,maxHp:850,speed:37,phase:'approach',timer:0,attack:0,slam:0};if(checkpoint){brute.x=176;brute.y=Math.max(cam+viewH+60,600);brute.enteringRound=true;pendingEnemies.unshift(brute);}else enemies.push(brute);total++;showNotice('ЗАРАЖЁННЫЙ ГРОМИЛА · ПОСЛЕ РЁВА ОТХОДИ');hud();}
function updateBrute(b,dt){b.hit=Math.max(0,b.hit-dt);b.slam=Math.max(0,b.slam-dt);b.anim+=dt*(b.phase==='windup'?3:6);b.timer=Math.max(0,b.timer-dt);b.attack=Math.max(0,b.attack-dt);if(b.phase==='approach'&&attackCheckpoint(b,dt))return;
 if(b.phase==='windup'){b.moving=false;if(b.timer<=0){b.phase='recover';b.timer=b.hp<b.maxHp*.5?1.2:1.8;b.slam=.4;b.attack=.4;audio.play('bruteImpact');shake=7;for(const a of attackableSurvivors())if(dist(a,b)<64)hurt(a,32);for(let i=0;i<20;i++){const angle=i/20*Math.PI*2;particles.push({x:b.x,y:b.y,vx:Math.cos(angle)*90,vy:Math.sin(angle)*70,life:.4,max:.4,size:3,color:'#b99b76'});}}return;}
 if(b.phase==='recover'){b.moving=false;if(b.timer<=0)b.phase='approach';return;}
 const a=attackableSurvivors().sort((a,c)=>dist(b,a)-dist(b,c))[0];if(dist(b,a)<70&&visible(b,a)){b.phase='windup';b.timer=1.4;b.moving=false;audio.play('bruteRoar');showNotice('ГРОМИЛА РЕВЁТ · ВЫЙДИ ИЗ КРАСНОГО КРУГА');return;}
 const v=navigation(b,a);move(b,v.x*(b.hp<b.maxHp*.5?45:b.speed)*dt,v.y*(b.hp<b.maxHp*.5?45:b.speed)*dt);
}
function drawBruteWarning(){for(const b of enemies.filter(e=>e.boss&&e.hp>0)){if(b.phase==='windup'||b.slam>0){ctx.save();ctx.fillStyle=b.slam>0?'#e8b37155':'#a442343d';ctx.strokeStyle='#e28a66';ctx.lineWidth=2;ctx.beginPath();ctx.arc(b.x,b.y,64,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.restore();}}}
function bossHud(){const bar=$('bossbar'),bosses=enemies.filter(e=>e.boss&&e.hp>0);if(!bosses.length){bar.classList.add('hidden');return;}bar.classList.remove('hidden');$('bosshp').style.width=(bosses.reduce((n,b)=>n+b.hp,0)/bosses.reduce((n,b)=>n+b.maxHp,0)*100)+'%';$('bossstate').textContent=bosses.some(b=>b.phase==='windup')?'РЁВ — ОТХОДИ!':'ГРОМИЛЫ · '+bosses.length;}
