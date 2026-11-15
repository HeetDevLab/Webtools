(() => {
  "use strict";
  const menuToggle=document.getElementById("menuToggle");
  const navLinks=document.getElementById("navLinks");
  const searchInput=document.getElementById("toolSearch");
  const cards=Array.from(document.querySelectorAll(".tool-card"));
  const groups=Array.from(document.querySelectorAll(".tool-group"));
  const filters=Array.from(document.querySelectorAll(".filter"));
  const count=document.getElementById("toolCount");
  const emptyState=document.getElementById("emptyState");
  const clearButton=document.getElementById("clearFilters");
  let activeFilter="all";

  function closeMenu(){
    if(!menuToggle||!navLinks)return;
    menuToggle.classList.remove("active");
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded","false");
    menuToggle.setAttribute("aria-label","Open navigation");
  }
  menuToggle?.addEventListener("click",()=>{
    const open=menuToggle.getAttribute("aria-expanded")!=="true";
    menuToggle.classList.toggle("active",open);
    navLinks?.classList.toggle("open",open);
    menuToggle.setAttribute("aria-expanded",String(open));
    menuToggle.setAttribute("aria-label",open?"Close navigation":"Open navigation");
  });
  navLinks?.querySelectorAll("a").forEach(link=>link.addEventListener("click",closeMenu));
  document.addEventListener("click",event=>{
    if(navLinks?.classList.contains("open")&&!navLinks.contains(event.target)&&!menuToggle?.contains(event.target))closeMenu();
  });
  window.addEventListener("resize",()=>{if(window.innerWidth>700)closeMenu();});

  function applyFilters(){
    const query=(searchInput?.value||"").trim().toLowerCase();
    let visible=0;
    cards.forEach(card=>{
      const categoryMatch=activeFilter==="all"||card.dataset.category===activeFilter;
      const searchable=((card.dataset.search||"")+" "+card.innerText).toLowerCase();
      const searchMatch=!query||searchable.includes(query);
      const show=categoryMatch&&searchMatch;
      card.hidden=!show;
      if(show)visible++;
    });
    groups.forEach(group=>{
      const hasVisible=Array.from(group.querySelectorAll(".tool-card")).some(card=>!card.hidden);
      group.hidden=!hasVisible;
    });
    if(count)count.textContent=String(visible).padStart(2,"0");
    if(emptyState)emptyState.hidden=visible!==0;
  }
  filters.forEach(button=>button.addEventListener("click",()=>{
    activeFilter=button.dataset.filter||"all";
    filters.forEach(item=>{
      const selected=item===button;
      item.classList.toggle("active",selected);
      item.setAttribute("aria-pressed",String(selected));
    });
    applyFilters();
  }));
  searchInput?.addEventListener("input",applyFilters);
  clearButton?.addEventListener("click",()=>{
    if(searchInput)searchInput.value="";
    activeFilter="all";
    filters.forEach(button=>{
      const selected=button.dataset.filter==="all";
      button.classList.toggle("active",selected);
      button.setAttribute("aria-pressed",String(selected));
    });
    applyFilters();
    searchInput?.focus();
  });
  document.addEventListener("keydown",event=>{
    const target=event.target;
    const typing=target instanceof HTMLElement&&(target.isContentEditable||["INPUT","TEXTAREA","SELECT"].includes(target.tagName));
    if(event.key==="/"&&!typing){event.preventDefault();searchInput?.focus();}
    if(event.key==="Escape"){closeMenu();if(document.activeElement===searchInput)searchInput.blur();}
  });
  const revealItems=document.querySelectorAll(".reveal");
  document.documentElement.classList.add("motion-ready");
  if("IntersectionObserver"in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}});
    },{threshold:.12,rootMargin:"0px 0px -25px 0px"});
    revealItems.forEach(item=>observer.observe(item));
  }else revealItems.forEach(item=>item.classList.add("is-visible"));
  applyFilters();
})();