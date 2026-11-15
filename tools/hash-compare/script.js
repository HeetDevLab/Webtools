(function(){
 const a=document.getElementById('hash1'),b=document.getElementById('hash2');
 function compare(){
  const x=a.value.trim().toLowerCase(),y=b.value.trim().toLowerCase();
  document.getElementById('compareResult').textContent=!x&&!y?'Status: Waiting...':x&&y?(x===y?'Status: ✓ Hashes match':'Status: ✕ Hashes do not match'):'Status: Enter both hashes';
  const len=x.length||y.length; document.getElementById('lengthInfo').textContent='Length: '+(len||'-');
  const map={32:'Likely MD5',40:'Likely SHA-1',56:'Likely SHA-224',64:'Likely SHA-256',96:'Likely SHA-384',128:'Likely SHA-512'};
  document.getElementById('algoInfo').textContent='Algorithm: '+(map[len]||'-');
 }
 a.addEventListener('input',compare);b.addEventListener('input',compare);
 window.copyHash=window.copyHash||function(id){navigator.clipboard.writeText(document.getElementById(id).value||'')};
 window.clearCompare=window.clearCompare||function(){a.value='';b.value='';compare()};
})();

(function(){
 const h=document.getElementById('hamburger'), n=document.getElementById('navLinks');
 if(!h||!n)return;
 const toggle=()=>{const open=!h.classList.contains('active');h.classList.toggle('active',open);n.classList.toggle('active',open);h.setAttribute('aria-expanded',open);h.setAttribute('aria-label',open?'Close menu':'Open menu');};
 h.addEventListener('click',toggle);
 h.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();toggle();}});
 n.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{h.classList.remove('active');n.classList.remove('active');}));
})();
