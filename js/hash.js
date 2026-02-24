// ===== MODE SWITCH =====
function switchMode(mode) {

    const textSection = document.getElementById("textSection");
    const fileSection = document.getElementById("fileSection");

    const buttons = document.querySelectorAll(".mode-btn");
    buttons.forEach(btn => btn.classList.remove("active"));

    if (mode === "text") {
        textSection.style.display = "block";
        fileSection.style.display = "none";
        buttons[0].classList.add("active");
    } else {
        textSection.style.display = "none";
        fileSection.style.display = "block";
        buttons[1].classList.add("active");
    }

    clearAll();
}


// ===== TEXT HASH =====
function generateTextHash() {

    const text = document.getElementById("inputText").value;
    const type = document.getElementById("hashType").value;

    if (!text) {
        alert("Enter text first!");
        return;
    }

    let hash;

    if (type === "MD5") hash = CryptoJS.MD5(text).toString();
    else if (type === "SHA-1") hash = CryptoJS.SHA1(text).toString();
    else if (type === "SHA-256") hash = CryptoJS.SHA256(text).toString();
    else if (type === "SHA-512") hash = CryptoJS.SHA512(text).toString();

    displayResult(hash);
}


// ===== FILE HASH =====
async function generateFileHash() {

    const fileInput = document.getElementById("fileInput");
    const type = document.getElementById("hashType").value;

    if (!fileInput.files.length) {
        alert("Select a file first!");
        return;
    }

    const file = fileInput.files[0];
    const arrayBuffer = await file.arrayBuffer();

    const hashBuffer = await crypto.subtle.digest(type, arrayBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    displayResult(hashHex, file.name);
}


// ===== DISPLAY RESULT =====
function displayResult(hash, fileName = null) {

    document.getElementById("hashOutput").value = hash;

    const info = document.getElementById("infoText");

    if (fileName) {
        info.textContent = "File: " + fileName + " | Length: " + hash.length;
    } else {
        info.textContent = "Length: " + hash.length;
    }
}


// ===== COPY =====
function copyHash() {

    const output = document.getElementById("hashOutput");

    if (!output.value) return;

    navigator.clipboard.writeText(output.value)
        .then(() => alert("Copied!"));
}


// ===== CLEAR =====
function clearAll() {

    document.getElementById("hashOutput").value = "";
    document.getElementById("infoText").textContent = "Length: -";

    const text = document.getElementById("inputText");
    if (text) text.value = "";

    const file = document.getElementById("fileInput");
    if (file) file.value = "";
}
