const pinOutput = document.getElementById("pinOutput");
const generateBtn = document.getElementById("generateBtn");
const copyBtn = document.getElementById("copyBtn");
const pinLength = document.getElementById("pinLength");

generateBtn.addEventListener("click", generatePIN);
copyBtn.addEventListener("click", copyPIN);

function generatePIN() {
  const length = parseInt(pinLength.value);
  let pin = "";

  for (let i = 0; i < length; i++) {
    pin += Math.floor(Math.random() * 10);
  }

  pinOutput.value = pin;

  // Glow animation
  pinOutput.style.boxShadow = "0 0 20px #2ea8ff";
  setTimeout(() => {
    pinOutput.style.boxShadow = "none";
  }, 500);
}

function copyPIN() {
  if (pinOutput.value === "") return;

  navigator.clipboard.writeText(pinOutput.value);

  copyBtn.textContent = "Copied ✓";

  setTimeout(() => {
    copyBtn.textContent = "Copy";
  }, 1000);
}
