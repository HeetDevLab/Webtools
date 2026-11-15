function b64url(s){return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(s)).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_')}
function generateJWT(){
 const status=document.getElementById('genStatus'),out=document.getElementById('tokenOutput'),secret=document.getElementById('secretInput').value;
 try{
  if(!secret)throw new Error('Enter a secret key.');
  const payload=JSON.parse(document.getElementById('payloadInput').value||'{}');
  const seconds=parseInt(document.getElementById('expiryInput').value,10);
  if(Number.isFinite(seconds)&&seconds>0)payload.exp=Math.floor(Date.now()/1000)+seconds;
  const header={alg:'HS256',typ:'JWT'},h=b64url(JSON.stringify(header)),p=b64url(JSON.stringify(payload)),data=h+'.'+p;
  const sig=CryptoJS.HmacSHA256(data,secret).toString(CryptoJS.enc.Base64).replace(/=/g,'').replace(/\+/g,'-').replace(/\//g,'_');
  out.value=data+'.'+sig;status.textContent='Status: JWT generated successfully.';status.className='status ok';
 }catch(e){out.value='';status.textContent='Status: '+e.message;status.className='status error'}
}
function copyToken(){const v=document.getElementById('tokenOutput').value;if(v)navigator.clipboard.writeText(v)}
function clearGenerator(){document.getElementById('payloadInput').value='';document.getElementById('expiryInput').value='';document.getElementById('secretInput').value='';document.getElementById('tokenOutput').value='';document.getElementById('genStatus').textContent='Status: Waiting...';document.getElementById('genStatus').className='status'}
(function(){const h=document.getElementById('hamburger'),n=document.getElementById('navLinks');function toggle(){const o=n.classList.toggle('open');h.classList.toggle('active',o);h.setAttribute('aria-label',o?'Close menu':'Open menu')}h.onclick=toggle;h.onkeydown=e=>{if(e.key==='Enter'||e.key===' ')toggle()};n.querySelectorAll('a').forEach(a=>a.onclick=()=>n.classList.remove('open'))})();
if(window.particlesJS)particlesJS('particles-js',{particles:{number:{value:42,density:{enable:true,value_area:900}},color:{value:'#168cff'},shape:{type:'circle'},opacity:{value:.25},size:{value:2},line_linked:{enable:true,distance:145,color:'#168cff',opacity:.16,width:1},move:{enable:true,speed:.6}},interactivity:{events:{onhover:{enable:false}}}});
