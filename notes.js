const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");

const noteArea = document.getElementById("noteArea");
const notePassword = document.getElementById("notePassword");
const statusMsg = document.getElementById("statusMsg");

saveBtn.addEventListener("click", async () => {
  const note = noteArea.value;
  const password = notePassword.value;

  if (!password) {
    statusMsg.textContent = "Password required for encryption!";
    return;
  }

  const encrypted = await encrypt(note, password);
  localStorage.setItem("secureNote", JSON.stringify(encrypted));

  statusMsg.textContent = "Encrypted & Saved!";
});

loadBtn.addEventListener("click", async () => {
  const stored = localStorage.getItem("secureNote");

  if (!stored) {
    statusMsg.textContent = "No saved note found.";
    return;
  }

  const password = notePassword.value;

  if (!password) {
    statusMsg.textContent = "Enter password to decrypt.";
    return;
  }

  try {
    const encrypted = JSON.parse(stored);
    const decrypted = await decrypt(encrypted, password);
    noteArea.value = decrypted;
    statusMsg.textContent = "Decrypted & Loaded!";
  } catch {
    statusMsg.textContent = "Wrong password!";
  }
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("secureNote");
  noteArea.value = "";
  notePassword.value = "";
  statusMsg.textContent = "Note Cleared!";
});


// 🔐 Encryption Functions

async function getKey(password, salt) {
  const enc = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encrypt(text, password) {
  const enc = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await getKey(password, salt);

  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    enc.encode(text)
  );

  return {
    salt: Array.from(salt),
    iv: Array.from(iv),
    data: Array.from(new Uint8Array(encrypted))
  };
}

async function decrypt(encryptedData, password) {
  const enc = new TextEncoder();
  const dec = new TextDecoder();

  const salt = new Uint8Array(encryptedData.salt);
  const iv = new Uint8Array(encryptedData.iv);
  const data = new Uint8Array(encryptedData.data);

  const key = await getKey(password, salt);

  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  return dec.decode(decrypted);
}
