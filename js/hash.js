// ===== GENERATE SHA-256 HASH =====
async function generateHash() {
    
    const text = document.getElementById("textInput").value;
    const type = document.getElementById("hashType").value;
    const output = document.getElementById("hashOutput");

    if (!text) {
        alert("Enter some text first!");
        return;
    }

    if (type === "MD5") {
        output.value = md5(text);
        updateLength(output.value.length);
        return;
    }

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
function updateLength(length) {
    document.getElementById("lengthDisplay").textContent =
        "Length: " + length;
}

function md5(str) {
    return CryptoJS.MD5(str).toString();
}
// ===== COPY =====
function copyHash() {

    const output = document.getElementById("hashOutput");

    if (!output.value) return;

    navigator.clipboard.writeText(output.value);
}


// ===== CLEAR =====
function clearAll() {

    document.getElementById("inputText").value = "";
    document.getElementById("hashOutput").value = "";
    document.getElementById("lengthText").textContent = "Length: -";
}
