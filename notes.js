const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");
const clearBtn = document.getElementById("clearBtn");

const noteArea = document.getElementById("noteArea");
const notePassword = document.getElementById("notePassword");
const statusMsg = document.getElementById("statusMsg");

saveBtn.addEventListener("click", () => {
  const note = noteArea.value;
  const password = notePassword.value;

  const data = {
    content: note,
    password: password
  };

  localStorage.setItem("secureNote", JSON.stringify(data));
  statusMsg.textContent = "Note Saved!";
});

loadBtn.addEventListener("click", () => {
  const stored = localStorage.getItem("secureNote");
  if (!stored) {
    statusMsg.textContent = "No saved note found.";
    return;
  }

  const data = JSON.parse(stored);

  if (data.password && data.password !== notePassword.value) {
    statusMsg.textContent = "Incorrect password!";
    return;
  }

  noteArea.value = data.content;
  statusMsg.textContent = "Note Loaded!";
});

clearBtn.addEventListener("click", () => {
  localStorage.removeItem("secureNote");
  noteArea.value = "";
  notePassword.value = "";
  statusMsg.textContent = "Note Cleared!";
});
