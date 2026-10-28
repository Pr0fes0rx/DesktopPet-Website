(()=>{const c=document.querySelector('.focus-card strong'),t=document.querySelector('.focus-track span');if(!c)return;const T=1500;let s=1458;
const f=()=>{c.textContent=String(s/60|0).padStart(2,'0')+':'+String(s%60).padStart(2,'0');if(t)t.style.width=(100-s/T*100)+'%'};
f();setInterval(()=>{if(document.hidden)return;s=s<=0?T:s-1;f()},1000);
if(t)t.style.transition='width 1s linear'})();
