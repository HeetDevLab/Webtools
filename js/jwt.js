// ===== GLOBAL =====
let countdownInterval = null;

// ===== BASE64URL DECODE =====
function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) {
        str += '='.repeat(4 - pad);
    }
    return atob(str);
}

// ===== SHOW STATUS =====
function showStatus(msg, color) {
    const status = document.getElementById("jwtStatus");
    status.textContent = msg;
    status.style.color = color;
}

// ===== DECODE TOKEN =====
function decodeJWT() {

    const token = document.getElementById("jwtInput").value.trim();
    clearInterval(countdownInterval);

    if (!token) {
        showStatus("Enter token first", "#ff4d4d");
        return;
    }

    const parts = token.split(".");
    if (parts.length !== 3) {
        showStatus("Invalid JWT format", "#ff4d4d");
        return;
    }

    try {

        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));

        document.getElementById("headerOutput").value =
            JSON.stringify(header, null, 2);

        document.getElementById("payloadOutput").value =
            JSON.stringify(payload, null, 2);

        showStatus("Token Decoded", "#00ff88");

        // expiry check
        if (payload.exp) {
            const expTime = payload.exp * 1000;
            startCountdown(expTime);
        }

    } catch (e) {
        showStatus("Error decoding token", "#ff4d4d");
    }
}

// ===== COUNTDOWN =====
function startCountdown(expTime) {

    const expiryInfo = document.getElementById("expiryInfo");

    countdownInterval = setInterval(() => {

        const diff = expTime - Date.now();

        if (diff <= 0) {
            clearInterval(countdownInterval);
            expiryInfo.textContent = "Token Expired";
            return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        expiryInfo.textContent =
            `Expires in: ${h}h ${m}m ${s}s`;

    }, 1000);
}

// ===== VERIFY SIGNATURE (HS256 ONLY) =====
function verifySignature() {

    const token = document.getElementById("jwtInput").value.trim();
    const secret = document.getElementById("secretKey").value.trim();
    const result = document.getElementById("verifyResult");

    if (!token || !secret) {
        result.textContent = "Provide token & secret";
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

    // HMAC SHA256
    const hash = CryptoJS.HmacSHA256(headerPayload, secret);

    // Convert to Base64
    let base64 = CryptoJS.enc.Base64.stringify(hash);

    // Convert Base64 → Base64URL
    base64 = base64
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    if (base64 === signature) {
        result.textContent = "✔ Signature Valid (HS256)";
        result.style.color = "#00ff88";
    } else {
        result.textContent = "❌ Invalid Signature";
        result.style.color = "#ff4d4d";
    }
}

// ===== COPY =====
function copyOutput(id) {
    const value = document.getElementById(id).value;
    if (!value) return;
    navigator.clipboard.writeText(value);
}

// ===== CLEAR =====
function clearJWT() {
    clearInterval(countdownInterval);
    document.getElementById("jwtInput").value = "";
    document.getElementById("headerOutput").value = "";
    document.getElementById("payloadOutput").value = "";
    document.getElementById("secretKey").value = "";
    document.getElementById("verifyResult").textContent = "Verification: -";
    document.getElementById("expiryInfo").textContent = "";
    showStatus("Waiting...", "#00ff88");
}
