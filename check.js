
const input = document.getElementById("passwordInput");
const fill = document.getElementById("strengthFill");
const text = document.getElementById("strengthText");
const toggle = document.getElementById("togglePassword");

toggle.addEventListener("change", () => {
  input.type = toggle.checked ? "text" : "password";
});

input.addEventListener("input", () => {

  const value = input.value;
  let score = 0;

  if (value.length >= 8) score += 25;
  if (/[A-Z]/.test(value)) score += 20;
  if (/[0-9]/.test(value)) score += 20;
  if (/[^A-Za-z0-9]/.test(value)) score += 20;
  if (value.length >= 12) score += 15;

  if (score > 100) score = 100;

  fill.style.width = score + "%";

  if (score < 40) {
  fill.style.background = "red";
  text.textContent = "Strength: Weak";
  text.style.color = "red";
} 
else if (score < 70) {
  fill.style.background = "orange";
  text.textContent = "Strength: Medium";
  text.style.color = "orange";
} 
else if (score < 90) {
  fill.style.background = "#2ea8ff";
  text.textContent = "Strength: Strong";
  text.style.color = "#2ea8ff";
} 
else {
  fill.style.background = "#00ff88";
  text.textContent = "Strength: Very Strong";
  text.style.color = "#00ff88";
}

  /* Suggestions */
  let tips = [];

  if (value.length < 8) tips.push("Use at least 8 characters");
  if (!/[A-Z]/.test(value)) tips.push("Add uppercase letter");
  if (!/[0-9]/.test(value)) tips.push("Add a number");
  if (!/[^A-Za-z0-9]/.test(value)) tips.push("Add special character");

  document.getElementById("suggestions").innerHTML = tips.join("<br>");

  /* Crack Time */
  let crack = "";

  if (score < 40) crack = "Can be cracked in seconds";
  else if (score < 70) crack = "May take hours";
  else if (score < 90) crack = "May take months";
  else crack = "May take years";

  document.getElementById("crackTime").textContent = crack;

});


