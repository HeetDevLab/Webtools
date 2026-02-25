const hash1 = document.getElementById("hash1");
const hash2 = document.getElementById("hash2");
const resultBox = document.getElementById("compareResult");
const algoInfo = document.getElementById("algoInfo");
const lengthInfo = document.getElementById("lengthInfo");

hash1.addEventListener("input", liveCompare);
hash2.addEventListener("input", liveCompare);

function cleanHash(value) {
    return value.trim().toUpperCase();
}

function detectAlgorithm(hash) {

    const length = hash.length;

    if (length === 32) return "MD5";
    if (length === 40) return "SHA-1";
    if (length === 64) return "SHA-256";
    if (length === 128) return "SHA-512";

    return "Unknown";
}

function liveCompare() {

    const h1 = cleanHash(hash1.value);
    const h2 = cleanHash(hash2.value);

    hash1.value = h1;
    hash2.value = h2;

    if (!h1 || !h2) {
        resultBox.textContent = "Status: Waiting...";
        resultBox.style.color = "#ccc";
        resultBox.style.boxShadow = "none";
        algoInfo.textContent = "Algorithm: -";
        lengthInfo.textContent = "Length: -";
        return;
    }

    const algo = detectAlgorithm(h1);
    algoInfo.textContent = "Algorithm: " + algo;
    lengthInfo.textContent = "Length: " + h1.length;

    if (h1 === h2) {
        resultBox.textContent = "✔ MATCH – File is authentic";
        resultBox.style.color = "#00ff88";
        resultBox.style.boxShadow = "0 0 15px #00ff88";
    } else {
        resultBox.textContent = "✖ NOT MATCH – File may be modified";
        resultBox.style.color = "#ff4d4d";
        resultBox.style.boxShadow = "0 0 15px #ff4d4d";
    }
}

function copyHash(id) {

    const value = document.getElementById(id).value;
    if (!value) return;

    navigator.clipboard.writeText(value)
        .then(() => alert("Copied!"));
}

function clearCompare() {
    hash1.value = "";
    hash2.value = "";
    liveCompare();
}
