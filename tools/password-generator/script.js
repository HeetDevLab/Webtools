/* ===== MOBILE NAV ===== */
(function(){
  const button=document.getElementById("hamburger");
  const links=document.getElementById("navLinks");
  const overlay=document.getElementById("navOverlay");

  function setOpen(open){
    button.classList.toggle("active",open);
    links.classList.toggle("open",open);
    overlay.classList.toggle("open",open);
    button.setAttribute("aria-expanded",String(open));
    button.setAttribute("aria-label",open?"Close menu":"Open menu");
  }

  button.addEventListener("click",()=>setOpen(!button.classList.contains("active")));
  overlay.addEventListener("click",()=>setOpen(false));
  links.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>setOpen(false)));
  window.addEventListener("resize",()=>{if(window.innerWidth>800)setOpen(false)});
})();

/* ===== PASSWORD GENERATOR ===== */
let passwordHistory=[];

function randomIndex(max){
  if(max<=0)return 0;
  const array=new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0]%max;
}

function randomChar(chars){
  return chars[randomIndex(chars.length)];
}

function getCharacterSets(){
  let upper="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let lower="abcdefghijklmnopqrstuvwxyz";
  let numbers="0123456789";
  let symbols="!@#$%^&*()_+{}[]<>?";

  if(document.getElementById("excludeSimilar").checked){
    upper=upper.replace(/[OI]/g,"");
    lower=lower.replace(/[ol]/g,"");
    numbers=numbers.replace(/[01]/g,"");
  }

  return {upper,lower,numbers,symbols};
}

function mutateKeyword(word){
  const level=Number(document.getElementById("mutationLevel").value);
  const maps={
    1:{a:"4",e:"3",i:"1",o:"0",s:"5",t:"7"},
    2:{a:"4",e:"3",i:"1",o:"0",s:"5",t:"7",h:"#",l:"|",b:"8"},
    3:{a:"@",e:"3",i:"!",o:"0",s:"$",t:"7",h:"#",l:"|",b:"8",g:"9"},
    4:{a:"@",e:"3",i:"!",o:"0",s:"$",t:"7",h:"#",l:"|",b:"8",g:"9",c:"(",k:"|<",m:"^^"}
  };
  const map=maps[level];
  let out="";
  for(const char of word){
    const key=char.toLowerCase();
    if(map[key] && Math.random()>(0.6-level*0.1)) out+=map[key];
    else out+=Math.random()>.5?char.toUpperCase():char.toLowerCase();
  }
  return out;
}

function updateImpactBar(mutated){
  const fill=document.getElementById("impactFill");
  const text=document.getElementById("impactText");
  if(mutated){
    fill.style.width="82%";
    text.textContent="Keyword mutation enabled";
    text.style.color="#39f5a5";
  }else{
    fill.style.width="25%";
    text.textContent="Basic keyword mode";
    text.style.color="#8196b0";
  }
}

function generatePassword(){
  const ultra=document.getElementById("ultraSecure").checked;
  const lengthEl=document.getElementById("length");

  if(ultra){
    lengthEl.value=16;
    document.getElementById("symbols").checked=true;
    document.getElementById("avoidRepeat").checked=true;
  }

  const length=Number(lengthEl.value);
  document.getElementById("lengthValue").textContent=length;

  const sets=getCharacterSets();
  const useUpper=document.getElementById("uppercase").checked;
  const useLower=document.getElementById("lowercase").checked;
  const useNumbers=document.getElementById("numbers").checked;
  const useSymbols=document.getElementById("symbols").checked;
  const avoidRepeat=document.getElementById("avoidRepeat").checked;
  const mutate=document.getElementById("mutateSeed").checked;
  const seed=document.getElementById("customSeed").value.trim();

  let chars="";
  if(useUpper)chars+=sets.upper;
  if(useLower)chars+=sets.lower;
  if(useNumbers)chars+=sets.numbers;
  if(useSymbols)chars+=sets.symbols;

  if(!chars){
    alert("Select at least one character type.");
    return;
  }

  let processedSeed=seed;
  if(mutate && seed){
    processedSeed=mutateKeyword(seed);
    document.getElementById("mutatedPreview").textContent="Preview: "+processedSeed;
    updateImpactBar(true);
  }else{
    document.getElementById("mutatedPreview").textContent="";
    updateImpactBar(false);
  }

  /* Keep the seed within the requested length. */
  if(processedSeed.length>length) processedSeed=processedSeed.slice(0,length);

  let randomLength=Math.max(0,length-processedSeed.length);
  let randomPart="";
  let attempts=0;
  const maxAttempts=Math.max(500,randomLength*100);

  while(randomPart.length<randomLength && attempts<maxAttempts){
    const char=randomChar(chars);
    attempts++;
    if(avoidRepeat && randomPart.includes(char)){
      if(new Set(chars).size<=randomLength) break;
      continue;
    }
    randomPart+=char;
  }

  /* If uniqueness is impossible, safely finish without an infinite loop. */
  while(randomPart.length<randomLength) randomPart+=randomChar(chars);

  let finalPassword=randomPart;
  if(processedSeed){
    const pos=randomIndex(randomPart.length+1);
    finalPassword=randomPart.slice(0,pos)+processedSeed+randomPart.slice(pos);
  }
  finalPassword=finalPassword.slice(0,length);

  document.getElementById("passwordOutput").value=finalPassword;
  checkStrength(finalPassword);
  calculateEntropy(finalPassword,chars.length);
  estimateCrackTime(finalPassword,chars.length);
  updateHistory(finalPassword);
}

function checkStrength(password){
  let score=0;
  if(password.length>=8)score++;
  if(password.length>=12)score++;
  if(/[A-Z]/.test(password))score++;
  if(/[a-z]/.test(password))score++;
  if(/[0-9]/.test(password))score++;
  if(/[^A-Za-z0-9]/.test(password))score++;

  let label,width,color;
  if(score<=2){label="Very Weak";width="20%";color="#ff5964"}
  else if(score===3){label="Weak";width="40%";color="#ff9f43"}
  else if(score===4){label="Moderate";width="60%";color="#facc15"}
  else if(score===5){label="Strong";width="80%";color="#39d98a"}
  else{label="Very Strong";width="100%";color="#18d7ff"}

  document.getElementById("strengthText").textContent=label;
  document.getElementById("strengthFill").style.width=width;
  document.getElementById("strengthFill").style.background=color;
}

function calculateEntropy(password,charsetSize){
  const entropy=password.length*Math.log2(Math.max(charsetSize,1));
  document.getElementById("entropyText").textContent=entropy.toFixed(1)+" bits";
  document.getElementById("entropyFill").style.width=Math.min(100,(entropy/128)*100)+"%";
  document.getElementById("entropyFill").style.background="linear-gradient(90deg,#2878ff,#18d7ff)";
}

function estimateCrackTime(password,charsetSize){
  const crack=document.getElementById("crackTime");
  if(!password){crack.textContent="Estimated crack time: —";return}

  const entropy=password.length*Math.log2(Math.max(charsetSize,1));
  const seconds=Math.pow(2,entropy)/1e10;

  let display;
  if(seconds<1)display="less than a second";
  else if(seconds<60)display="under a minute";
  else if(seconds<3600)display=Math.round(seconds/60)+" minutes";
  else if(seconds<86400)display=Math.round(seconds/3600)+" hours";
  else if(seconds<31536000)display=Math.round(seconds/86400)+" days";
  else if(seconds<3153600000)display=Math.round(seconds/31536000)+" years";
  else display="millions of years 🛡️";

  crack.textContent="Estimated crack time: "+display+"*";
}

function updateHistory(password){
  if(!password)return;
  if(passwordHistory[0]===password)return;
  passwordHistory.unshift(password);
  if(passwordHistory.length>5)passwordHistory.pop();

  const list=document.getElementById("historyList");
  list.innerHTML="";
  passwordHistory.forEach(p=>{
    const li=document.createElement("li");
    li.textContent=p;
    list.appendChild(li);
  });
}

async function copyPassword(){
  const value=document.getElementById("passwordOutput").value;
  if(!value)return;

  try{
    await navigator.clipboard.writeText(value);
  }catch{
    const field=document.getElementById("passwordOutput");
    field.select();
    document.execCommand("copy");
    field.setSelectionRange(0,0);
  }

  const toast=document.getElementById("copyToast");
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),1500);
}

function downloadPassword(){
  const password=document.getElementById("passwordOutput").value;
  if(!password)return;

  const blob=new Blob([password],{type:"text/plain"});
  const url=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=url;
  a.download="heetdevlab-password.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),500);
}

function clearHistory(){
  passwordHistory=[];
  document.getElementById("historyList").innerHTML="";
}

/* ===== EVENTS ===== */
document.addEventListener("DOMContentLoaded",()=>{
  const length=document.getElementById("length");
  const seed=document.getElementById("customSeed");
  const mutate=document.getElementById("mutateSeed");
  const mutationSection=document.getElementById("mutationSection");
  const mutationSlider=document.getElementById("mutationLevel");
  const mutationText=document.getElementById("mutationLevelText");

  length.addEventListener("input",()=>{
    document.getElementById("lengthValue").textContent=length.value;
    generatePassword();
  });

  seed.addEventListener("input",generatePassword);

  document.querySelectorAll(".options-grid input").forEach(input=>{
    input.addEventListener("change",generatePassword);
  });

  mutate.addEventListener("change",()=>{
    mutationSection.style.display=mutate.checked?"block":"none";
    generatePassword();
  });

  mutationSlider.addEventListener("input",()=>{
    const levels={1:"Light",2:"Medium",3:"Strong",4:"Extreme"};
    mutationText.textContent=levels[mutationSlider.value];
    generatePassword();
  });

  generatePassword();
});

// --- extracted page behaviour ---

if(window.particlesJS){
  particlesJS("particles-js",{
    particles:{
      number:{value:42,density:{enable:true,value_area:900}},
      color:{value:"#168cff"},
      shape:{type:"circle"},
      opacity:{value:.28},
      size:{value:2,random:true},
      line_linked:{enable:true,distance:145,color:"#168cff",opacity:.13,width:1},
      move:{enable:true,speed:.55,direction:"none",random:false,straight:false,out_mode:"out"}
    },
    interactivity:{events:{onhover:{enable:false},onclick:{enable:false}}},
    retina_detect:true
  });
}
