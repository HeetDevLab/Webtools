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

/* SAVE */
saveBtn.addEventListener("click", () => {

    const title = noteTitle.value.trim();
    const content = noteArea.value.trim();
    const password = notePassword.value.trim();

    if (!title || !password) {
        statusMsg.textContent = "Title & Password required";
        return;
    }

    let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};

    notes[title] = {
        text: content,
        password: password
    };

    localStorage.setItem("secureNotes", JSON.stringify(notes));

    statusMsg.textContent = "Saved Successfully";
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

            const enteredPassword = notePassword.value.trim();

            if (!enteredPassword) {
                statusMsg.textContent = "Enter password first";
                return;
            }

            if (enteredPassword === notes[title].password) {
                noteTitle.value = title;
                noteArea.value = notes[title].text;
                currentNote = title;
                statusMsg.textContent = "Loaded";
            } else {
                statusMsg.textContent = "Wrong password";
            }

        };

        notesList.appendChild(li);
    });
}

/* DELETE */
deleteBtn.addEventListener("click", () => {

    if (!currentNote) {
        statusMsg.textContent = "Select note first";
        return;
    }

    let notes = JSON.parse(localStorage.getItem("secureNotes")) || {};
    delete notes[currentNote];

    localStorage.setItem("secureNotes", JSON.stringify(notes));

    clearFields();
    loadNotesList();

    statusMsg.textContent = "Deleted";
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
loadNotesList();
