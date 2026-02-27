document.addEventListener("DOMContentLoaded", function () {
  if (document.getElementById("particles-js")) {
    particlesJS("particles-js", {
      particles: {
        number: { value: 55 },
        size: { value: 2 },
        color: { value: "#2ea8ff" },
        line_linked: {
          enable: true,
          distance: 130,
          color: "#2ea8ff",
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          speed: 1.2
        }
      },
      interactivity: {
        events: {
          onhover: { enable: true, mode: "grab" }
        }
      }
    });
  }
});
