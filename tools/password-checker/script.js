(function(){
  const input = document.getElementById("passwordInput");
  const toggle = document.getElementById("togglePassword");
  const eye = document.getElementById("eyeBtn");
  const fill = document.getElementById("strengthFill");
  const text = document.getElementById("strengthText");
  const scoreText = document.getElementById("scoreText");
  const crack = document.getElementById("crackTime");
  const suggestions = document.getElementById("suggestions");

  function showPassword(show){
    input.type = show ? "text" : "password";
    eye.textContent = show ? "🙈" : "👁";
    eye.setAttribute("aria-label", show ? "Hide password" : "Show password");
  }

  toggle.addEventListener("change", function(){ showPassword(this.checked); });
  eye.addEventListener("click", function(){
    toggle.checked = input.type === "password";
    showPassword(toggle.checked);
  });

  function analyze(password){
    if(!password){
      fill.style.width="0";
      text.textContent="Strength: —";
      scoreText.textContent="0 / 6";
      crack.textContent="Estimated Crack Time: —";
      suggestions.textContent="Enter a password to check its strength.";
      return;
    }

    let score=0;
    const tips=[];

    if(password.length >= 8) score++;
    else tips.push("Use at least 8 characters");
    if(password.length >= 12) score++;
    else tips.push("12+ characters is better");
    if(/[A-Z]/.test(password)) score++;
    else tips.push("Add uppercase letters");
    if(/[a-z]/.test(password)) score++;
    else tips.push("Add lowercase letters");
    if(/[0-9]/.test(password)) score++;
    else tips.push("Add numbers");
    if(/[^A-Za-z0-9]/.test(password)) score++;
    else tips.push("Add symbols");

    let label, width, color;
    if(score <= 2){ label="Very Weak"; width="20%"; color="#ff4d4d"; }
    else if(score === 3){ label="Weak"; width="40%"; color="#f59e0b"; }
    else if(score === 4){ label="Moderate"; width="60%"; color="#facc15"; }
    else if(score === 5){ label="Strong"; width="80%"; color="#22c55e"; }
    else { label="Very Strong"; width="100%"; color="#18d7e8"; }

    fill.style.width=width;
    fill.style.background=color;
    text.textContent="Strength: "+label;
    scoreText.textContent=score+" / 6";

    let charset=0;
    if(/[a-z]/.test(password)) charset+=26;
    if(/[A-Z]/.test(password)) charset+=26;
    if(/[0-9]/.test(password)) charset+=10;
    if(/[^A-Za-z0-9]/.test(password)) charset+=33;
    charset=Math.max(charset,1);

    const entropy=password.length*Math.log2(charset);
    let seconds=Math.pow(2,entropy)/1e10;
    let crackText;

    if(entropy < 28) crackText="Cracked instantly or very quickly ⚠️";
    else if(seconds < 60) crackText="Less than a minute";
    else if(seconds < 3600) crackText="A few minutes";
    else if(seconds < 86400) crackText="A few hours";
    else if(seconds < 31536000) crackText="A few days";
    else if(seconds < 3153600000) crackText="A few years";
    else crackText="Millions of years 🛡️";

    crack.textContent="Estimated Crack Time: "+crackText;

    if(tips.length) suggestions.textContent="Suggestions: "+tips.join(" • ")+".";
    else suggestions.textContent="Excellent mix. Keep this password unique and never share it.";
  }

  input.addEventListener("input", function(){ analyze(this.value); });
  analyze("");

  const hamburger=document.getElementById("hamburger");
  const navLinks=document.getElementById("navLinks");
  const overlay=document.getElementById("navOverlay");

  function setMenu(open){
    hamburger.classList.toggle("active",open);
    document.body.classList.toggle("nav-open",open);
    hamburger.setAttribute("aria-expanded",String(open));
    hamburger.setAttribute("aria-label",open?"Close menu":"Open menu");
  }

  hamburger.addEventListener("click",()=>setMenu(!document.body.classList.contains("nav-open")));
  overlay.addEventListener("click",()=>setMenu(false));
  navLinks.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setMenu(false)));
  window.addEventListener("resize",()=>{if(window.innerWidth>768)setMenu(false);});
})();

if(window.particlesJS){
  particlesJS("particles-js",{
    particles:{
      number:{value:42,density:{enable:true,value_area:900}},
      color:{value:"#168cff"},
      shape:{type:"circle"},
      opacity:{value:.28},
      size:{value:2},
      line_linked:{enable:true,distance:145,color:"#168cff",opacity:.18,width:1},
      move:{enable:true,speed:.65}
    },
    interactivity:{events:{onhover:{enable:false},onclick:{enable:false}}}
  });
}
