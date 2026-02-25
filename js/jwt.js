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
        status.textContent = "Status: Enter token first";
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

        checkExpiry(payload);

        status.textContent = "Token Decoded Successfully";
        status.style.color = "#00ff88";

    } catch (err) {
        status.textContent = "Error decoding token";
        status.style.color = "#ff4d4d";
    }
}

function checkExpiry(payload) {

    const expiryInfo = document.getElementById("expiryInfo");

    if (!payload.exp) {
        expiryInfo.textContent = "Expiry: Not Found";
        return;
    }

    const expDate = new Date(payload.exp * 1000);
    const now = new Date();

    if (expDate < now) {
        expiryInfo.textContent = "Expired: " + expDate.toLocaleString();
        expiryInfo.style.color = "#ff4d4d";
    } else {
        expiryInfo.textContent = "Valid until: " + expDate.toLocaleString();
        expiryInfo.style.color = "#00ff88";
    }
}

function copyOutput(id) {
    const value = document.getElementById(id).value;
    if (!value) return;
    navigator.clipboard.writeText(value)
        .then(() => alert("Copied!"));
}

function clearJWT() {
    document.getElementById("jwtInput").value = "";
    document.getElementById("headerOutput").value = "";
    document.getElementById("payloadOutput").value = "";
    document.getElementById("expiryInfo").textContent = "Expiry: -";
    document.getElementById("jwtStatus").textContent = "Status: Waiting...";
}
