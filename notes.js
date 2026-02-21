const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const clearBtn = document.getElementById("clearBtn");

const noteTitle = document.getElementById("noteTitle");
const noteArea = document.getElementById("noteArea");
const notePassword = document.getElementById("notePassword");
const notesList = document.getElementById("notesList");
const statusMsg = document.getElementById("statusMsg");

let currentNote = null;

saveBtn.addEventListener("click", async () => {
  const title = noteTitle.value.trim();
  const content = noteArea.value;
  const password = notePassword.value;

  if (!title || !password) {
    statusMsg.textContent = "Title & Password required!";
    return;
  }

  const encrypted = await encrypt(content, password);
  let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};

  notes[title] = encrypted;
  localStorage.setItem("secureNotes", JSON.stringify(notes));

  loadNotesList();
  statusMsg.textContent = "Encrypted & Saved!";
});

deleteBtn.addEventListener("click", () => {
  if (!currentNote) return;

  let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};
  delete notes[currentNote];

  localStorage.setItem("secureNotes", JSON.stringify(notes));

  clearFields();
  loadNotesList();
  statusMsg.textContent = "Note Deleted!";
});

clearBtn.addEventListener("click", clearFields);

function clearFields() {
  noteTitle.value = "";
  noteArea.value = "";
  notePassword.value = "";
  currentNote = null;
}

function loadNotesList() {
  notesList.innerHTML = "";
  let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};

  Object.keys(notes).forEach(title => {
    const li = document.createElement("li");
    li.textContent = title;
    li.onclick = () => loadNote(title);
    notesList.appendChild(li);
  });
}

async function loadNote(title) {
  const password = notePassword.value;
  if (!password) {
    statusMsg.textContent = "Enter password first!";
    return;
  }

  let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};
  const encrypted = notes[title];

  try {
    const decrypted = await decrypt(encrypted, password);
    noteTitle.value = title;
    noteArea.value = decrypted;
    currentNote = title;
    statusMsg.textContent = "Decrypted!";
  } catch {
    statusMsg.textContent = "Wrong password!";
  }
}

/* ENCRYPTION */

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

loadNotesList();
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    data
  );

  return dec.decode(decrypted);
}
