let countdownInterval = null;

// Base64URL decode
function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) str += '='.repeat(4 - pad);
    return atob(str);
}

// Base64URL encode
function base64UrlEncode(wordArray) {
    return CryptoJS.enc.Base64.stringify(wordArray)
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function decodeJWT() {

    const input = document.getElementById("jwtInput").value.trim();
    clearInterval(countdownInterval);

    if (!input) return showStatus("Enter token first", "error");

    const parts = input.split(".");
    if (parts.length !== 3)
        return showStatus("Invalid JWT format", "error");

    try {

        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));

        document.getElementById("headerOutput").value =
            JSON.stringify(header, null, 2);

        document.getElementById("payloadOutput").value =
            JSON.stringify(payload, null, 2);

        analyzeToken(header, payload);
        showStatus("Token Decoded", "success");

    } catch {
        showStatus("Error decoding token", "error");
    }
}

function analyzeToken(header, payload) {

    const expiryInfo = document.getElementById("expiryInfo");
    expiryInfo.textContent = "";

    if (header.alg === "none") {
        showStatus("⚠ Insecure: alg=none", "warning");
    }

    if (payload.exp) {
        const expTime = payload.exp * 1000;
        const expDate = new Date(expTime);

        expiryInfo.textContent =
            "Expires: " + expDate.toLocaleString();

        startCountdown(expTime);
    } else {
        expiryInfo.textContent = "No expiry claim";
    }
}

function startCountdown(expTime) {

    countdownInterval = setInterval(() => {

        const diff = expTime - Date.now();

        if (diff <= 0) {
            clearInterval(countdownInterval);
            showStatus("❌ Token Expired", "error");
            return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        showStatus(
            `Valid | Expires in: ${h}h ${m}m ${s}s`,
            "success"
        );

    }, 1000);
}

// 🔐 HS256 Signature Verification
function verifySignature() {

    const token = document.getElementById("jwtInput").value.trim();
    const secret = document.getElementById("secretKey").value.trim();
    const result = document.getElementById("verifyResult");

    if (!token || !secret) {
        result.textContent = "Provide token & secret key";
        result.style.color = "#ffc107";
        return;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        result.textContent = "Invalid token format";
        result.style.color = "#ff4d4d";
        return;
    }

    const headerPayload = parts[0] + "." + parts[1];
    const signature = parts[2];

    const hash = CryptoJS.HmacSHA256(headerPayload, secret);
const base64 = CryptoJS.enc.Base64.stringify(hash);

const computed = base64
    .replace(/=+$/, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
    if (computed === signature) {
        result.textContent = "✔ Signature Valid (HS256)";
        result.style.color = "#00ff88";
    } else {
        result.textContent = "❌ Invalid Signature";
        result.style.color = "#ff4d4d";
    }
}

function showStatus(msg, type) {

    const status = document.getElementById("jwtStatus");
    status.textContent = msg;

    if (type === "success") {
        status.style.color = "#00ff88";
    }
    else if (type === "warning") {
        status.style.color = "#ffc107";
    }
    else {
        status.style.color = "#ff4d4d";
    }
}

function copyOutput(id) {
    const value = document.getElementById(id).value;
    if (!value) return;
    navigator.clipboard.writeText(value);
}

function clearJWT() {
    clearInterval(countdownInterval);
    document.getElementById("jwtInput").value = "";
    document.getElementById("headerOutput").value = "";
    document.getElementById("payloadOutput").value = "";
    document.getElementById("secretKey").value = "";
    document.getElementById("verifyResult").textContent = "Verification: -";
    document.getElementById("expiryInfo").textContent = "Expiry: -";
    showStatus("Status: Waiting...", "success");
}
