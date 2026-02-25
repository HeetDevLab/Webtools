function base64UrlEncode(str) {
    return btoa(str)
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
}

function showStatus(msg, color) {
    const status = document.getElementById("genStatus");
    status.textContent = msg;
    status.style.color = color;
}

function generateJWT() {

    const header = {
        alg: "HS256",
        typ: "JWT"
    };

    const payloadText = document.getElementById("payloadInput").value;
    const secret = document.getElementById("secretInput").value;
    const expirySeconds = document.getElementById("expiryInput").value;

    if (!secret) {
        showStatus("Enter secret key", "#ff4d4d");
        return;
    }

    let payload;

    try {
        payload = JSON.parse(payloadText);
    } catch {
        showStatus("Invalid JSON payload", "#ff4d4d");
        return;
    }

    if (expirySeconds) {
        payload.exp = Math.floor(Date.now() / 1000) + parseInt(expirySeconds);
    }

    const headerEncoded = base64UrlEncode(JSON.stringify(header));
    const payloadEncoded = base64UrlEncode(JSON.stringify(payload));

    const data = headerEncoded + "." + payloadEncoded;

    const signature = CryptoJS.HmacSHA256(data, secret);
    const signatureBase64 = CryptoJS.enc.Base64.stringify(signature)
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');

    const token = data + "." + signatureBase64;

    document.getElementById("tokenOutput").value = token;

    showStatus("Token Generated Successfully", "#00ff88");
}

function copyToken() {
    const token = document.getElementById("tokenOutput").value;
    if (!token) return;
    navigator.clipboard.writeText(token);
}

function clearGenerator() {
    document.getElementById("payloadInput").value = "";
    document.getElementById("secretInput").value = "";
    document.getElementById("expiryInput").value = "";
    document.getElementById("tokenOutput").value = "";
    showStatus("Status: Waiting...", "#cfd8dc");
}
