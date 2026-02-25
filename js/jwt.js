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

    clearInterval(countdownInterval);

    if (!input) {
        showStatus("Enter token first", "error");
        return;
    }

    const parts = input.split(".");

    if (parts.length !== 3) {
        showStatus("Invalid JWT format", "error");
        return;
    }

    try {

        const header = JSON.parse(base64UrlDecode(parts[0]));
        const payload = JSON.parse(base64UrlDecode(parts[1]));

        document.getElementById("headerOutput").value =
            JSON.stringify(header, null, 2);

        document.getElementById("payloadOutput").value =
            JSON.stringify(payload, null, 2);

        analyzeToken(header, payload);

    } catch (err) {
        showStatus("Error decoding token", "error");
    }
}

function analyzeToken(header, payload) {

    const expiryInfo = document.getElementById("expiryInfo");
    expiryInfo.textContent = "";

    let warnings = [];

    // Algorithm check
    if (!header.alg) {
        warnings.push("Missing algorithm");
    }

    if (header.alg === "none") {
        warnings.push("Algorithm 'none' is insecure");
    }

    if (header.alg === "HS256") {
        warnings.push("HS256 requires strong secret key");
    }

    // Expiry check
    if (!payload.exp) {
        warnings.push("Token has no expiry");
    }

    // Issued check
    if (payload.iat) {
        const issued = new Date(payload.iat * 1000);
        expiryInfo.textContent +=
            "Issued: " + issued.toLocaleString() + " | ";
    }

    if (payload.exp) {

        const expTime = payload.exp * 1000;
        const expDate = new Date(expTime);

        expiryInfo.textContent +=
            "Expires: " + expDate.toLocaleString();

        startCountdown(expTime);
    }

    // Final status
    if (warnings.length > 0) {
        showStatus("⚠ Token Decoded with Warnings", "warning");
        expiryInfo.textContent += "\nWarnings: " + warnings.join(", ");
    } else {
        showStatus("✔ Token Looks Structurally Safe", "success");
    }
}

function startCountdown(expTime) {

    countdownInterval = setInterval(() => {

        const now = Date.now();
        const diff = expTime - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            showStatus("❌ Token Expired", "error");
            return;
        }

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        showStatus(
            `✔ Valid | Expires in: ${hours}h ${minutes}m ${seconds}s`,
            "success"
        );

    }, 1000);
}

function showStatus(message, type) {

    const status = document.getElementById("jwtStatus");

    status.textContent = message;

    if (type === "success") {
        status.style.color = "#00ff88";
        status.style.boxShadow = "0 0 15px #00ff88";
    }
    else if (type === "warning") {
        status.style.color = "#ffc107";
        status.style.boxShadow = "0 0 15px #ffc107";
    }
    else {
        status.style.color = "#ff4d4d";
        status.style.boxShadow = "0 0 15px #ff4d4d";
    }
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
    document.getElementById("jwtStatus").style.boxShadow = "none";
}
