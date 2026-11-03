'use strict';
const ICON_PATHS={
 arrow:'<path d="M12 21V4m-7 7 7-7 7 7"/>',
 heart:'<path fill="currentColor" stroke="none" d="M12 21 3 12C-2 5 7-1 12 6c5-7 14-1 9 6Z"/><path stroke="#251715" d="m4 12 4 0 2-4 3 8 2-4h5"/>',
 ammo:'<path fill="currentColor" d="M4 8 7 3l3 5v13H4Zm10 0 3-5 3 5v13h-6Z"/><path stroke="#241e18" d="M4 16h6m4 0h6"/>',
 supplies:'<path d="M12 2v20M18 6c-2-3-12-3-12 2 0 5 12 3 12 8 0 5-10 5-13 1"/>',
 grenade:'<path fill="currentColor" d="M9 8h7l4 7-2 7H6l-2-7Z"/><path d="M10 8V3h7l4 6M16 3V1h4"/><path stroke="#241e18" d="M5 15h14M12 9v12"/>',
 reload:'<path d="M20 9A8 8 0 0 0 6 5L3 8m0-5v5h5M4 15a8 8 0 0 0 14 4l3-3m0 5v-5h-5"/>',
 sound:'<path d="M3 9h4l5-5v16l-5-5H3ZM16 8c3 2 3 6 0 8m3-11c5 4 5 10 0 14"/>',
 muted:'<path d="M3 9h4l5-5v16l-5-5H3Zm13 0 6 6m0-6-6 6"/>',
 pause:'<path stroke-width="5" d="M7 4v16M17 4v16"/>',
 hire:'<path d="M7 8V5l5-3 5 3v3M5 8h14M8 10v3l4 3 4-3v-3M3 22v-4l5-2m8 0 5 2v4"/><path d="M10 20h4m-2-2v4"/>',
 damage:'<path d="M3 8h16v5h-8l-2 8H4l3-8H3Zm16 1h3v3h-3M8 5h8m-4-3v3"/>',
 heal:'<path d="M3 7h18v14H3ZM8 7V3h8v4"/><path stroke-width="3" d="M12 10v8m-4-4h8"/>',
 skull:'<path d="M6 17 3 14V7l4-4h10l4 4v7l-3 3v4H6Z"/><path fill="currentColor" d="M6 9h4v4H6Zm8 0h4v4h-4Z"/><path d="m10 17 2-3 2 3m-4 1v3m4-3v3"/>'
};
function icon(name){return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" stroke-linecap="square" aria-hidden="true">${ICON_PATHS[name]||ICON_PATHS.supplies}</svg>`;}
function mountIcons(){document.querySelectorAll('[data-icon]').forEach(e=>e.innerHTML=icon(e.dataset.icon));}
const LEVELS=[
 {name:'ЖИЛОЙ КВАРТАЛ',tag:'ДОМА БЕЗ ЛЮДЕЙ',count:22,road:'#404646',facade:'#657b6a',sky:'#73857a',style:'residential',barriers:[[110,398],[216,740]],cars:[[221,552],[104,925]]},
 {name:'РЫНОЧНЫЙ ПРОЕЗД',tag:'ЗДЕСЬ НИКТО НЕ ТОРГУЕТ',count:30,road:'#49433c',facade:'#82705c',sky:'#9c8970',style:'market',barriers:[[112,280],[211,680],[112,950]],cars:[[224,445]]},
 {name:'ЗАРОСШИЙ ПАРК',tag:'НЕ СВОРАЧИВАЙ С ТРОПЫ',count:38,road:'#3d493d',facade:'#536c50',sky:'#77977b',style:'park',barriers:[[106,510],[222,820]],cars:[]},
 {name:'ПРОМЗОНА',tag:'СЛЫШНО ТОЛЬКО ЭХО',count:46,road:'#3c444a',facade:'#657782',sky:'#8d9eab',style:'industrial',barriers:[[109,240],[217,530],[109,860]],cars:[[222,1000]]},
 {name:'ПОСЛЕДНИЙ БЛОКПОСТ',tag:'ПРОБЕЙСЯ К ЭВАКУАЦИИ',count:56,road:'#45443f',facade:'#727462',sky:'#b39470',style:'checkpoint',barriers:[[105,300],[220,490],[105,720],[220,930]],cars:[[101,1020],[221,180]]}
];
function paintDistrict(g,level){
 const rect=(x,y,w,h,color)=>{g.fillStyle=color;g.fillRect(Math.round(x),Math.round(y),w,h);};
 const obstacle=(x,y,w,h)=>obstacles.push({x,y,w,h});
 const label=(s,x,y,size=7,color='#c7c6a8')=>{g.fillStyle=color;g.font=`bold ${size}px monospace`;g.textAlign='center';g.fillText(s,x,y);};
 function tree(x,y){rect(x+3,y+10,25,31,'#111e1d55');tile(g,288,64,32,48,x,y);}
 function bench(x,y){rect(x+3,y+5,28,14,'#17201c88');for(let n=0;n<3;n++)rect(x,y+n*4,28,3,'#927f58');rect(x+4,y+11,3,7,'#303a30');rect(x+21,y+11,3,7,'#303a30');}
 function lamp(x,y){rect(x+2,y,2,39,'#242f2d');rect(x-4,y-3,14,4,'#79816b');rect(x-2,y+1,9,3,'#e6c48c');rect(x-7,y+38,18,3,'#252e2a');const light=g.createRadialGradient(x+3,y+13,1,x+3,y+13,41);light.addColorStop(0,'#edc88c24');light.addColorStop(1,'#edc88c00');g.fillStyle=light;g.fillRect(x-40,y-30,86,90);}
 function car(x,y,color='#6a8176'){obstacle(x,y,31,54);rect(x+4,y+4,32,54,'#17201c99');rect(x,y,31,54,'#192825');rect(x+2,y+1,27,50,color);rect(x+5,y+9,21,10,'#253a40');rect(x+6,y+10,18,2,'#839390');rect(x+6,y+38,19,9,'#24373b');rect(x+6,y+24,20,1,'#b0ac8766');rect(x+2,y+1,5,3,'#d6c5a0');rect(x+24,y+1,5,3,'#d6c5a0');rect(x+2,y+49,5,3,'#925b48');rect(x+24,y+49,5,3,'#925b48');rect(x+9,y+11,2,5,'#9aa594');}
 g.fillStyle=level.road;g.fillRect(0,0,W,H);
 for(let i=0;i<2300;i++)rect(rand()*W,rand()*H,rand()>.7?3:1,1,rand()>.5?'#82857825':'#111d1c40');
 // Cracked asphalt, oil and dried blood are pre-rendered, never randomized per frame.
 for(let i=0;i<45;i++){let x=90+rand()*170,y=100+rand()*1050;g.strokeStyle='#1c282957';g.beginPath();g.moveTo(x,y);for(let n=0;n<4;n++){x+=rand()*12-6;y+=rand()*8;g.lineTo(x,y);}g.stroke();}
 for(let i=0;i<18;i++){const x=98+rand()*150,y=100+rand()*1000;g.fillStyle=i%3?'#26313265':'#592f2b70';g.beginPath();g.ellipse(x,y,4+rand()*15,3+rand()*6,rand(),0,Math.PI*2);g.fill();}
 for(let y=0;y<H;y+=16)for(const x of [64,80,256,272]){rect(x,y,15,15,(y/16+x/16)%3===0?'#8c8876':'#777c70');rect(x,y,15,1,'#aaa68b');}
 if(level.style!=='park'){
 for(let y=60;y<H;y+=64)rect(174,y,3,24,'#a8aa8b70');
 for(const y of [190,655,1055])for(let x=101;x<253;x+=22)rect(x,y,12,27,'#b2b39799');
 }
 for(let row=0;row<4;row++)for(let side=0;side<2;side++){
 const x=side?282:-6,y=110+row*265+(side?32:0),bw=76,bh=150+row%2*24;
 if(level.style==='park'){rect(x,y,bw,180,'#4d5f3c');for(let t=0;t<3;t++)tree(x+14+(t%2)*20,y+t*48);bench(side?302:20,y+180);continue;}
 obstacle(x,y,bw,bh);rect(x+6,y+7,bw,bh,'#15201e80');rect(x,y,bw,bh,level.facade);rect(x+4,y+4,bw-8,48,'#414851');rect(x,y,bw,3,'#999482');rect(x,y,3,55,'#999482');rect(x+bw-3,y,3,55,'#999482');rect(x+14,y+15,23,16,'#696e6a');rect(x+16,y+17,19,2,'#353e3e');rect(x+16,y+22,19,2,'#353e3e');
 for(let iy=y+65;iy<y+bh-30;iy+=29)for(let ix=x+10;ix<x+bw-10;ix+=25){rect(ix,iy,12,16,'#26383b');rect(ix+2,iy+2,8,10,(row+side)%3?'#75938e':'#b2a479');rect(ix-1,iy+16,14,2,'#a1a18a');if((row+side)%2){rect(ix-2,iy+4,16,3,'#81745a');rect(ix-2,iy+10,16,3,'#81745a');}}
 rect(x+29,y+bh-27,18,27,'#253a31');rect(x+32,y+bh-24,12,21,'#53675a');rect(x+40,y+bh-12,2,2,'#a79c74');
 if(row===1||level.style==='market'){rect(x+2,y+bh-44,72,13,row%2?'#7b4238':'#4b6566');label(level.style==='market'?'MARKET':side?'PHARMACY':'CLOSED',x+38,y+bh-35,6);for(let n=0;n<6;n++)rect(x+2+n*12,y+bh-31,8,6,'#b5aa8b');}
 if(level.style==='industrial'){rect(x+8,y+65,60,65,'#444d4f');for(let n=0;n<8;n++)rect(x+8,y+66+n*8,60,2,'#858c83');label('WAREHOUSE',x+38,y+145,6);}
 for(let d=0;d<12;d++)rect(x+rand()*bw,y+55+rand()*(bh-60),4,2,'#1f353144');
 }
 for(const y of [325,590,1120])for(const x of [17,301]){if(level.style!=='industrial'){rect(x-10,y-8,40,58,'#57633e');tree(x-5,y);}else{rect(x-9,y,44,50,'#6e6250');for(let n=0;n<5;n++)rect(x-8+n*9,y,2,50,'#363f3e');} }
 for(const [x,y] of [[77,320],[263,500],[77,815],[263,1120]])lamp(x,y);
 for(const [x,y] of [[23,540],[298,845]])bench(x,y);
 for(const [x,y] of level.barriers){obstacle(x,y,31,16);rect(x+2,y+5,33,17,'#080e0bbb');rect(x-1,y-1,33,16,'#141b19');rect(x,y,31,14,'#ffd34e');g.save();g.beginPath();g.rect(x,y,31,14);g.clip();for(let n=0;n<5;n++){g.fillStyle='#19211f';g.beginPath();g.moveTo(x+n*9,y);g.lineTo(x+n*9+5,y);g.lineTo(x+n*9-1,y+14);g.lineTo(x+n*9-6,y+14);g.fill();}g.restore();rect(x,y,31,2,'#fff0a0');rect(x,y+12,31,2,'#e9a92c');rect(x,y,2,14,'#ffe587');rect(x+29,y,2,14,'#ffe587');rect(x+1,y+14,4,5,'#c1c9b9');rect(x+26,y+14,4,5,'#c1c9b9');rect(x-1,y+18,8,2,'#58655a');rect(x+24,y+18,8,2,'#58655a');rect(x+2,y+4,3,3,'#fff6cc');rect(x+26,y+4,3,3,'#fff6cc');}
 level.cars.forEach(([x,y],i)=>car(x,y,i%2?'#776751':'#576f6b'));
 // Dustbins, wooden crates, discarded bags, drains, warning posters and traffic cones.
 for(const [x,y] of [[72,245],[260,385],[73,700],[260,970]]){rect(x,y,12,17,'#344b40');rect(x-1,y-2,14,4,'#627663');rect(x+3,y+3,2,10,'#1b3027');}
 for(const [x,y] of [[34,315],[310,520],[38,1090]]){rect(x,y,20,18,'#8c7953');rect(x+2,y+2,16,14,'#625f43');g.strokeStyle='#af9561';g.strokeRect(x+1,y+1,18,16);g.beginPath();g.moveTo(x+1,y+1);g.lineTo(x+18,y+16);g.stroke();}
 for(const y of [370,765,1080]){rect(95,y,13,9,'#242f2d');for(let i=0;i<4;i++)rect(97+i*3,y+1,1,7,'#69716a');}
 for(const [x,y] of [[242,350],[105,620],[242,990]]){rect(x-4,y+9,12,3,'#232c28');g.fillStyle='#c3834f';g.beginPath();g.moveTo(x+2,y);g.lineTo(x-2,y+10);g.lineTo(x+6,y+10);g.fill();rect(x,y+5,5,2,'#bcbc99');}
 for(let i=0;i<80;i++){const x=97+rand()*156,y=100+rand()*1100;rect(x,y,3,2,i%4?'#9a927455':'#bfbaa1');}
 if(level.style==='market'){for(const y of [350,600,880])for(const x of [20,300]){rect(x-6,y,38,24,'#7b6650');rect(x-8,y-7,42,10,'#885048');rect(x-5,y+24,3,10,'#3a392b');rect(x+25,y+24,3,10,'#3a392b');for(let n=0;n<4;n++)rect(x+n*7,y+2,5,5,'#a7955f');}}
 if(level.style==='park'){for(let y=80;y<1200;y+=100){rect(106,y,140,3,'#79826a40');}for(const y of [260,720]){rect(144,y,62,30,'#617565');rect(150,y+5,50,20,'#3a5353');rect(154,y+8,40,1,'#90a194');} }
 if(level.style==='checkpoint'){for(const y of [140,600,900]){rect(15,y,45,33,'#566044');rect(294,y,45,33,'#566044');for(let n=0;n<5;n++){rect(14+n*9,y+31,7,9,'#959077');rect(293+n*9,y+31,7,9,'#959077');}}rect(99,90,154,15,'#b3985b');label('EVACUATION',176,101,9,'#302f23');}
 rect(97,27,158,25,'#17231e');g.strokeStyle='#8b9877';g.strokeRect(97,27,158,25);label(stage<LEVELS.length?`SECTOR ${String(stage+1).padStart(2,'0')} / NORTH`:'EVAC / LAST STOP',176,43,8);
 g.fillStyle='#b5bb94';g.beginPath();g.moveTo(176,69);g.lineTo(170,79);g.lineTo(182,79);g.fill();
}
