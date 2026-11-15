const b64=s=>{s=s.replace(/-/g,'+').replace(/_/g,'/');while(s.length%4)s+='=';return decodeURIComponent(atob(s).split('').map(c=>'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2)).join(''))};
function decodeJWT(){
 const token=document.getElementById('jwtInput').value.trim(),status=document.getElementById('jwtStatus'),head=document.getElementById('headerOutput'),pay=document.getElementById('payloadOutput'),exp=document.getElementById('expiryInfo');
 try{
  const p=token.split('.');if(p.length!==3)throw new Error('A JWT must contain three parts.');
  const h=JSON.parse(b64(p[0])),pl=JSON.parse(b64(p[1]));
  head.value=JSON.stringify(h,null,2);pay.value=JSON.stringify(pl,null,2);
  status.textContent='Status: Valid JWT structure decoded.';status.className='jwt-status ok';
  if(pl.exp){const d=new Date(pl.exp*1000);exp.textContent='Expiry: '+d.toLocaleString()+(d.getTime()<Date.now()?' — Expired':' — Active')}else exp.textContent='Expiry: Not specified';
 }catch(e){head.value='';pay.value='';exp.textContent='Expiry: -';status.textContent='Status: '+e.message;status.className='jwt-status error'}
}
function copyOutput(id){const v=document.getElementById(id).value;if(v)navigator.clipboard.writeText(v)}
function clearJWT(){document.getElementById('jwtInput').value='';document.getElementById('headerOutput').value='';document.getElementById('payloadOutput').value='';document.getElementById('jwtStatus').textContent='Status: Waiting...';document.getElementById('jwtStatus').className='jwt-status';document.getElementById('expiryInfo').textContent='Expiry: -'}
(function(){const h=document.getElementById('hamburger'),n=document.getElementById('navLinks');function toggle(){const o=n.classList.toggle('open');h.classList.toggle('active',o);h.setAttribute('aria-expanded',o);h.setAttribute('aria-label',o?'Close menu':'Open menu')}h.onclick=toggle;h.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')toggle()};n.querySelectorAll('a').forEach(a=>a.onclick=()=>n.classList.remove('open'))})();
if(window.particlesJS)particlesJS('particles-js',{particles:{number:{value:42,density:{enable:true,value_area:900}},color:{value:'#168cff'},shape:{type:'circle'},opacity:{value:.25},size:{value:2},line_linked:{enable:true,distance:145,color:'#168cff',opacity:.16,width:1},move:{enable:true,speed:.6}},interactivity:{events:{onhover:{enable:false}}}});
