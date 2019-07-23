!function(t){var e={};function o(n){if(e[n])return e[n].exports;var r=e[n]={i:n,l:!1,exports:{}};return t[n].call(r.exports,r,r.exports,o),r.l=!0,r.exports}o.m=t,o.c=e,o.d=function(t,e,n){o.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},o.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},o.t=function(t,e){if(1&e&&(t=o(t)),8&e)return t;if(4&e&&"object"==typeof t&&t&&t.__esModule)return t;var n=Object.create(null);if(o.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:t}),2&e&&"string"!=typeof t)for(var r in t)o.d(n,r,function(e){return t[e]}.bind(null,r));return n},o.n=function(t){var e=t&&t.__esModule?function(){return t.default}:function(){return t};return o.d(e,"a",e),e},o.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},o.p="",o(o.s=0)}([function(t,e,o){"use strict";o.r(e);const n=[[[0,3],[1,0],[3,1],[2,0]],[[2,1],[1,1],[3,0],[0,2]],[[2,2],[3,3],[1,2],[0,1]],[[0,0],[3,2],[1,3],[2,3]]],r=(t,e,o,n,r)=>0===r?(1===n&&(e=t-1-e,o=t-1-o),[o,e]):[e,o],a=(t,e,o)=>{let r,a=0,u=0;for(;--o>=0;)u=u<<2|(r=n[a][(t&1<<o?2:0)|(e&1<<o?1:0)])[0],a=r[1];return u};var u=(t,e)=>{const o=1<<t;let n=0,a=0;for(let t=1;t<o;t*=2){const o=1&e/2,u=1&(e^o),i=r(t,n,a,o,u);n=i[0]+t*o,a=i[1]+t*u,e/=4}return[n,a]};const i=(t,e,o)=>e*(4*o)+4*t,s=(t,e,o)=>{const n=i(e,o,480);return.3*t.data[n+0]+.59*t.data[n+1]+.11*t.data[n+2]};const d=(t,e,o)=>{let n=!0;if(!(n="array"===e?Array.isArray(t):"function"==typeof e?e(t):typeof t===e))throw console.error(o),new Error(o)},c=(t,e,o)=>{d(o,"object","Config parameter missing"),d(o.inputSize,"number","inputSize must a number"),d(o.outputSize,"number","outputSize must a number"),d(o.outputResolution,"number","outputResolution must a number");const n=o.outputSize/o.outputResolution;d(n,Number.isInteger,"ratio between outputSize & outputResolution must be integer");const r=[],u=Math.log2(o.outputResolution);d(u,Number.isInteger,"outputResolution should be power of 2");for(let d=0;d<o.outputResolution;d++)for(let c=0;c<o.outputResolution;c++){let l=0;for(let e=0;e<n;e++)for(let o=0;o<n;o++)l+=s(t,d*n+e,c*n+o);l/=n*n,r[a(d,c,u)]=l;for(let t=0;t<n;t++)for(let r=0;r<n;r++){const a=i(d*n+t,c*n+r,o.outputSize);e.data[a+0]=l,e.data[a+1]=l,e.data[a+2]=l,e.data[a+3]=256}}return{data:r,level:u}};new(window.AudioContext||window.webkitAudioContext);let l=[];window.addEventListener("DOMContentLoaded",function(){const t=document.getElementById("canvas").getContext("2d"),e=document.getElementById("output").getContext("2d"),o=document.getElementById("outputLinear").getContext("2d"),n=document.getElementById("rawcanvas").getContext("2d"),r=document.getElementById("video"),a={video:!0},s=function(t){console.log("An error has occurred!",t)};navigator.mediaDevices&&navigator.mediaDevices.getUserMedia?navigator.mediaDevices.getUserMedia(a).then(function(t){r.srcObject=t,r.play()}):navigator.getUserMedia?navigator.getUserMedia(a,function(t){r.src=t,r.play()},s):navigator.webkitGetUserMedia?navigator.webkitGetUserMedia(a,function(t){r.src=window.webkitURL.createObjectURL(t),r.play()},s):navigator.mozGetUserMedia&&navigator.mozGetUserMedia(a,function(t){r.src=window.URL.createObjectURL(t),r.play()},s);const d=t=>{let e=t[0],o=t[0],n=0;for(let r=1;r<t.length;++r)t[r]>e&&(e=t[r]),t[r]<o&&(o=t[r]),n+=t[r];return{min:o,max:e,avg:n/=t.length}},f=()=>{n.drawImage(r,0,0,640,480),t.drawImage(r,0,0,640,480),t.strokeStyle="white",t.lineWidth=3,t.strokeRect(80,0,480,480);const a=n.getImageData(80,0,480,480),s=e.createImageData(a),m=e.createImageData(256,64),p=c(a,s,{inputSize:480,outputSize:480,outputResolution:16}),{min:g,max:b}=d(p.data),v=p.data.map(t=>{const e=Math.max(b-g,128),o=255*(t-g)/e;return isNaN(o)?0:o>=255?255:o<=0?0:o}),{avg:w}=d(v),y=t=>(t=>{const e=(255-w)*Math.abs(t-w)/w;return e>=255?255:e<=0?0:e})(t);for(let t=0;t<256;t++){const e=u(4,t),o=e[0],n=e[1],r=y(v[t]);for(let t=0;t<30;t++)for(let e=0;e<30;e++){const u=i(30*o+t,30*n+e,480);s.data[u+0]=r,s.data[u+1]=r,s.data[u+2]=r,s.data[u+3]=a.data[u+3]}}const h=[];for(let t=0;t<256;t++)for(let e=0;e<64;e++){const o=i(t,e,256),n=y(v[t]);m.data[o+0]=n,m.data[o+1]=n,m.data[o+2]=n,m.data[o+3]=256}(()=>{const t=l;l=[],t.forEach(t=>{t()})})(),h.forEach(t=>{t.start()}),(t=>{l.push(t)})(()=>{h.forEach(t=>{t.stop()})}),e.putImageData(s,0,0),o.putImageData(m,0,0),window.requestAnimationFrame(()=>{f()})};window.requestAnimationFrame(()=>{f()})},!1)}]);