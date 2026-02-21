particlesJS("particles-js", {
  particles: {
    number: { value: 60 },
    size: { value: 3 },
    color: { value: "#00c3ff" },
    line_linked: {
      enable: true,
      distance: 150,
      color: "#00c3ff",
      opacity: 0.4,
      width: 1
    },
    move: {
      enable: true,
      speed: 2
    }
  },
  interactivity: {
    events: {
      onhover: { enable: true, mode: "repulse" }
    }
  }
});
