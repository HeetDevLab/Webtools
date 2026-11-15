(function(){

  const hamburger =
    document.getElementById("hamburger");

  const navLinks =
    document.getElementById("navLinks");


  /* =====================
     MOBILE NAV
  ===================== */

  hamburger.addEventListener(
    "click",
    function(){

      const open =
        hamburger.classList.toggle("active");

      document.body.classList.toggle(
        "nav-open",
        open
      );

      hamburger.setAttribute(
        "aria-expanded",
        String(open)
      );

      hamburger.setAttribute(
        "aria-label",
        open
          ? "Close menu"
          : "Open menu"
      );

    }
  );


  navLinks
    .querySelectorAll("a")
    .forEach(function(link){

      link.addEventListener(
        "click",
        function(){

          hamburger.classList.remove(
            "active"
          );

          document.body.classList.remove(
            "nav-open"
          );

          hamburger.setAttribute(
            "aria-expanded",
            "false"
          );

        }
      );

    });


  window.addEventListener(
    "resize",
    function(){

      if(window.innerWidth > 768){

        hamburger.classList.remove(
          "active"
        );

        document.body.classList.remove(
          "nav-open"
        );

      }

    }
  );


  /* =====================
     PIN GENERATOR
  ===================== */

  const output =
    document.getElementById(
      "pinOutput"
    );

  const lengthSelect =
    document.getElementById(
      "pinLength"
    );

  const generateBtn =
    document.getElementById(
      "generateBtn"
    );

  const copyBtn =
    document.getElementById(
      "copyBtn"
    );

  const copyStatus =
    document.getElementById(
      "copyStatus"
    );


  /* SECURE RANDOM DIGIT */

  function secureDigit(){

    const array =
      new Uint32Array(1);

    crypto.getRandomValues(
      array
    );

    return String(
      array[0] % 10
    );

  }


  /* GENERATE PIN */

  function generatePIN(){

    const length =
      parseInt(
        lengthSelect.value,
        10
      );

    let pin = "";

    for(
      let i = 0;
      i < length;
      i++
    ){

      pin += secureDigit();

    }

    output.value = pin;

    copyStatus.textContent = "";

  }


  /* COPY PIN */

  async function copyPIN(){

    if(!output.value){

      generatePIN();

    }


    try{

      await navigator
        .clipboard
        .writeText(
          output.value
        );

      copyStatus.textContent =
        "✓ PIN copied to clipboard";

    }

    catch(error){

      output.select();

      document.execCommand(
        "copy"
      );

      copyStatus.textContent =
        "✓ PIN copied";

    }


    setTimeout(
      function(){

        copyStatus.textContent = "";

      },
      1800
    );

  }


  generateBtn.addEventListener(
    "click",
    generatePIN
  );

  copyBtn.addEventListener(
    "click",
    copyPIN
  );

  lengthSelect.addEventListener(
    "change",
    generatePIN
  );


  /* FIRST PIN */

  generatePIN();

})();

// --- extracted page behaviour ---

if(
  window.particlesJS &&
  !document
    .getElementById("particles-js")
    .dataset.ready
){

  document
    .getElementById("particles-js")
    .dataset.ready = "1";


  particlesJS(
    "particles-js",
    {

      particles:{

        number:{
          value:42,
          density:{
            enable:true,
            value_area:900
          }
        },

        color:{
          value:"#168cff"
        },

        shape:{
          type:"circle"
        },

        opacity:{
          value:.24
        },

        size:{
          value:2
        },

        line_linked:{
          enable:true,
          distance:145,
          color:"#168cff",
          opacity:.15,
          width:1
        },

        move:{
          enable:true,
          speed:.6
        }

      },

      interactivity:{
        events:{
          onhover:{
            enable:false
          }
        }
      }

    }
  );

}
