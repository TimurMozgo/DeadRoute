'use strict';
// Deterministic PCM effects, with audible midrange for phone speakers.
function makeEffect(name,sr=44100){const duration={roar:1.65,search:4.0,ignition:3,engine:2,zombie:1.05,zstep:.23}[name];const out=new Float32Array(Math.ceil(sr*duration));let low=0,mid=0,seed=931;
 for(let i=0;i<out.length;i++){const t=i/sr;seed=(Math.imul(seed,1664525)+1013904223)>>>0;const noise=seed/2147483648-1;low+=.045*(noise-low);mid+=.25*(noise-mid);let v=0,env=Math.min(1,t/.025)*Math.min(1,(duration-t)/.09);
 if(name==='roar'||name==='zombie'){const big=name==='roar',f=big?69:96;const pulse=Math.sin(2*Math.PI*f*t+1.4*Math.sin(t*9));const grit=Math.tanh(pulse*5);v=(grit*.34+Math.sin(2*Math.PI*410*t+grit)*.20+Math.sin(2*Math.PI*790*t)*.11+(mid-low)*1.8)*(0.68+.32*Math.sin(t*33))*Math.pow(Math.sin(Math.PI*t/duration),.45);v*=big?.95:.58;}
 if(name==='search'){const rustle=.65+.18*Math.sin(t*29)+.12*Math.sin(t*71);v=(noise-mid)*rustle*.35+mid*.16;env=1;}
 if(name==='ignition'){const starter=Math.sin(2*Math.PI*(130+25*t)*t);const sputter=Math.pow(Math.max(0,Math.sin(t*(t<1.9?53:86))),7);v=t<2.1?(starter*.1+(mid*2+Math.sin(t*440)*.2)*sputter):(.22*Math.sin(t*2*Math.PI*68)+mid*.6)*(.65+.35*Math.sin(t*91));}
 if(name==='engine'){v=(Math.sin(t*2*Math.PI*64)*.22+Math.sin(t*2*Math.PI*128)*.13+mid*.3)*(.75+.25*Math.sin(t*2*Math.PI*24));env=1;}
 if(name==='zstep'){v=(low*2.8+mid*.35)*Math.exp(-t*28)+noise*.1*Math.exp(-Math.pow((t-.11)/.025,2));}
 out[i]=Math.tanh(v*1.6)*env*.85;
 }if(name==='search'){const n=Math.floor(sr*.06),tail=out.slice(out.length-n);for(let i=0;i<n;i++){const k=i/n;out[i]=tail[i]*(1-k)+out[i]*k;}return out.slice(0,out.length-n);}return out;
}
function installSoundDesign(sound){sound.effectBuffers={};for(const name of ['search','ignition','engine','zstep']){const pcm=makeEffect(name,sound.ac.sampleRate),buffer=sound.ac.createBuffer(1,pcm.length,sound.ac.sampleRate);buffer.getChannelData(0).set(pcm);sound.effectBuffers[name]=buffer;}}
