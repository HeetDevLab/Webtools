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

// ===== STATUS =====
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

        // Expiry check
        if (payload.exp) {
            const expTime = payload.exp * 1000;
            startCountdown(expTime);
        } else {
            document.getElementById("expiryInfo").textContent =
                "No expiry claim";
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
            showStatus("Expired", "#ff4d4d");
            return;
        }

        const h = Math.floor(diff / (1000 * 60 * 60));
        const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((diff % (1000 * 60)) / 1000);

        expiryInfo.textContent =
            `Expires in: ${h}h ${m}m ${s}s`;

        showStatus("Valid Token", "#00ff88");

    }, 1000);
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
    document.getElementById("expiryInfo").textContent = "";
    showStatus("Waiting...", "#00ff88");
}
