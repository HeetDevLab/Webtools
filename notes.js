console.log("Notes JS Loaded");

const saveBtn = document.getElementById("saveBtn");
const deleteBtn = document.getElementById("deleteBtn");
const clearBtn = document.getElementById("clearBtn");

const noteTitle = document.getElementById("noteTitle");
const noteArea = document.getElementById("noteArea");
const notePassword = document.getElementById("notePassword");
const notesList = document.getElementById("notesList");
const statusMsg = document.getElementById("statusMsg");

let currentNote = null;

/* SAVE NOTE */
saveBtn.addEventListener("click", () => {

  const title = noteTitle.value.trim();
  const content = noteArea.value;
  const password = notePassword.value;

  if (!title || !password) {
    statusMsg.textContent = "Title & Password required!";
    return;
  }

  let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};

  notes[title] = {
    text: content,
    password: password
  };

  localStorage.setItem("secureNotes", JSON.stringify(notes));

  statusMsg.textContent = "Saved!";
  loadNotesList();
});

/* LOAD LIST */
function loadNotesList() {

  notesList.innerHTML = "";
  let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};

  Object.keys(notes).forEach(title => {

    const li = document.createElement("li");
    li.textContent = title;

    li.onclick = () => {

      const enteredPassword = notePassword.value;

      if (!enteredPassword) {
        statusMsg.textContent = "Enter password first!";
        return;
      }

      if (enteredPassword === notes[title].password) {
        noteTitle.value = title;
        noteArea.value = notes[title].text;
        currentNote = title;
        statusMsg.textContent = "Loaded!";
      } else {
        statusMsg.textContent = "Wrong password!";
      }

    };

    notesList.appendChild(li);
  });

}

/* DELETE */
deleteBtn.addEventListener("click", () => {

  if (!currentNote) {
    statusMsg.textContent = "Select note first!";
    return;
  }

  let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};

  delete notes[currentNote];
  localStorage.setItem("secureNotes", JSON.stringify(notes));

  clearFields();
  loadNotesList();
  statusMsg.textContent = "Deleted!";
});

/* CLEAR */
clearBtn.addEventListener("click", clearFields);

function clearFields() {
  noteTitle.value = "";
  noteArea.value = "";
  notePassword.value = "";
  currentNote = null;
}

/* INITIAL LOAD */
loadNotesList();  );
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
