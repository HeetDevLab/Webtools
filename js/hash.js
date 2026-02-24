// ===== GENERATE SHA-256 HASH =====
async function generateHash() {

    const input = document.getElementById("inputText").value;

    if (!input) return;

    const encoder = new TextEncoder();
    const data = encoder.encode(input);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

    document.getElementById("hashOutput").value = hashHex;

    document.getElementById("lengthText").textContent =
        "Length: " + hashHex.length + " characters";
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
