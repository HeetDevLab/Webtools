// ===============================
// UNIVERSAL HASH GENERATOR
// ===============================

async function generateHash() {

    const text = document.getElementById("inputText").value;
    const type = document.getElementById("hashType").value;
    const output = document.getElementById("hashOutput");

    if (!text) {
        alert("Enter some text first!");
        return;
    }

    // ===== MD5 (CryptoJS) =====
    if (type === "MD5") {
        const hash = CryptoJS.MD5(text).toString();
        output.value = hash;
        updateLength(hash.length);
        return;
    }

    // ===== SHA via CryptoJS (more reliable) =====
    let hash;

    if (type === "SHA-256") {
        hash = CryptoJS.SHA256(text).toString();
    }
    else if (type === "SHA-512") {
        hash = CryptoJS.SHA512(text).toString();
    }
    else if (type === "SHA-1") {
        hash = CryptoJS.SHA1(text).toString();
    }

    output.value = hash;
    updateLength(hash.length);
}


// ===== UPDATE LENGTH =====
function updateLength(length) {
    document.getElementById("lengthDisplay").textContent =
        "Length: " + length;
}


// ===== COPY =====
function copyHash() {

    const output = document.getElementById("hashOutput");

    if (!output.value) return;

    navigator.clipboard.writeText(output.value)
        .then(() => alert("Hash copied!"));
}


// ===== CLEAR =====
function clearAll() {

    document.getElementById("inputText").value = "";
    document.getElementById("hashOutput").value = "";
    document.getElementById("lengthDisplay").textContent = "Length: -";
}
