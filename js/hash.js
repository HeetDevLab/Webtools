// ===============================
// HASH GENERATOR - HeetDevLab
// ===============================

// ===== GENERATE HASH =====
async function generateHash() {

    const text = document.getElementById("inputText").value;
    const type = document.getElementById("hashType").value;
    const output = document.getElementById("hashOutput");

    if (!text) {
        alert("Enter some text first!");
        return;
    }

    // MD5 (uses CryptoJS)
    if (type === "MD5") {
        const hash = CryptoJS.MD5(text).toString();
        output.value = hash;
        updateLength(hash.length);
        return;
    }

    // SHA algorithms (native browser crypto)
    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const hashBuffer = await crypto.subtle.digest(type, data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    output.value = hashHex;
    updateLength(hashHex.length);
}


// ===== UPDATE LENGTH =====
function updateLength(length) {
    const lengthText = document.getElementById("lengthDisplay");
    if (lengthText) {
        lengthText.textContent = "Length: " + length;
    }
}


// ===== COPY HASH =====
function copyHash() {

    const output = document.getElementById("hashOutput");

    if (!output.value) return;

    navigator.clipboard.writeText(output.value).then(() => {
        alert("Hash copied!");
    });
}


// ===== CLEAR ALL =====
function clearAll() {

    document.getElementById("inputText").value = "";
    document.getElementById("hashOutput").value = "";

    const lengthText = document.getElementById("lengthDisplay");
    if (lengthText) {
        lengthText.textContent = "Length: -";
    }
}
