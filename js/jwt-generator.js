function base64UrlEncode(str) {
    return btoa(str)
        .replace(/=+$/, '')
        .replace(/\+/g, '-')
        .replace(/\//g, '_');
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
        alert("Enter secret key");
        return;
    }

    let payload;

    try {
        payload = JSON.parse(payloadText);
    } catch {
        alert("Invalid JSON payload");
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
}

function copyToken() {
    const token = document.getElementById("tokenOutput").value;
    navigator.clipboard.writeText(token);
}
