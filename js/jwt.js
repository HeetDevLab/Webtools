let countdownInterval = null;

// Base64URL decode
function base64UrlDecode(str) {
    str = str.replace(/-/g, '+').replace(/_/g, '/');
    const pad = str.length % 4;
    if (pad) str += '='.repeat(4 - pad);
    return atob(str);
}

function decodeJWT() {

    const input = document.getElementById("jwtInput").value.trim();
    const status = document.getElementById("jwtStatus");

    if (!input) {
        status.textContent = "Enter token first";
        status.style.color = "#ff4d4d";
        return;
    }

    const parts = input.split(".");

    if (parts.length !== 3) {
        status.textContent = "Invalid JWT format";
        status.style.color = "#ff4d4d";
        return;
    }

    try {

        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));

        document.getElementById("headerOutput").value =
            JSON.stringify(header, null, 2);

        document.getElementById("payloadOutput").value =
            JSON.stringify(payload, null, 2);

        showAlgorithm(header);
        handleExpiry(payload);

        status.textContent = "Token Decoded Successfully";
        status.style.color = "#00ff88";

    } catch (err) {
        status.textContent = "Error decoding token";
        status.style.color = "#ff4d4d";
    }
}

function showAlgorithm(header) {
    const expiryInfo = document.getElementById("expiryInfo");
    expiryInfo.textContent = "Algorithm: " + (header.alg || "Unknown");
}

function handleExpiry(payload) {

    const expiryInfo = document.getElementById("expiryInfo");

    clearInterval(countdownInterval);

    if (!payload.exp) {
        expiryInfo.textContent += " | Expiry: Not Found";
        return;
    }

    const expTime = payload.exp * 1000;
    const expDate = new Date(expTime);

    startCountdown(expTime);

    if (payload.iat) {
        const issued = new Date(payload.iat * 1000);
        expiryInfo.textContent +=
            " | Issued: " + issued.toLocaleString();
    }

    expiryInfo.textContent +=
        " | Expires: " + expDate.toLocaleString();
}

function startCountdown(expTime) {

    const status = document.getElementById("jwtStatus");

    countdownInterval = setInterval(() => {

        const now = Date.now();
        const diff = expTime - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            status.textContent = "⚠ Token Expired";
            status.style.color = "#ff4d4d";
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        status.textContent =
            `Valid | Expires in: ${hours}h ${minutes}m ${seconds}s`;

        status.style.color = "#00ff88";

    }, 1000);
}

function copyOutput(id) {
    const value = document.getElementById(id).value;
    if (!value) return;

    navigator.clipboard.writeText(value)
        .then(() => alert("Copied!"));
}

function clearJWT() {

    clearInterval(countdownInterval);

    document.getElementById("jwtInput").value = "";
    document.getElementById("headerOutput").value = "";
    document.getElementById("payloadOutput").value = "";
    document.getElementById("expiryInfo").textContent = "Expiry: -";
    document.getElementById("jwtStatus").textContent = "Status: Waiting...";
}
