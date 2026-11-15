(function(){
 const ts=document.getElementById('textSection'),fs=document.getElementById('fileSection'),tm=document.getElementById('textMode'),fm=document.getElementById('fileMode');
 tm.onclick=()=>{ts.style.display='block';fs.style.display='none'};fm.onclick=()=>{ts.style.display='none';fs.style.display='block'};
 window.copyHash=window.copyHash||function(){navigator.clipboard.writeText(document.getElementById('hashOutput').value||'')};
})();

(function(){
 const h=document.getElementById('hamburger'), n=document.getElementById('navLinks');
 if(!h||!n)return;
 const toggle=()=>{const open=!h.classList.contains('active');h.classList.toggle('active',open);n.classList.toggle('active',open);h.setAttribute('aria-expanded',open);h.setAttribute('aria-label',open?'Close menu':'Open menu');};
 h.addEventListener('click',toggle);
 h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
 n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{h.classList.remove('active');n.classList.remove('active');}));
})();
