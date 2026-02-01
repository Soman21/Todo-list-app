const todoValue = document.getElementById("todoText");
const todoAlert = document.getElementById("Alert");
const listItems = document.getElementById("list-items");
const addUpdate = document.getElementById("AddUpdateClick");
let todo = JSON.parse(localStorage.getItem("todo-list"));

if (!todo) {
    todo = [];
}

let updateText;

todoValue.addEventListener("keypress", function (e) {
  todoAlert.innerText = "";
  if (e.key === "Enter") {
    addUpdate.click();
  }
});

//Function to read task
function ReadToDoItems() {
    todo.forEach((element) => {
        let li = document.createElement("li");
        let style = "";
        if (element.status) {
            style = "style='text-decoration: line-through'";
        }

        const todoItems = `<div style="display:flex; align-items:center;" ondblclick="CompletedToDoItems(this)">
            <button class="complete-btn ${element.status ? 'completed' : ''}" onclick="event.stopPropagation(); CompletedToDoItems(this.parentElement)">${element.status ? '✓' : '○'}</button>
            <span class="task-text" style="${element.status ? 'text-decoration: line-through' : ''}">${element.item}</span>
            ${element.status ? `<img class="todo-controls" src="images/check.png"/>` : ''}
            </div><div>
            ${element.status === false ? `<img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/edit.png"/>` : ''}
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png"/>
            </div>`;

     li.innerHTML = todoItems;

        if (element.status) {
            const div = li.querySelector("div");
            const completedText = document.createElement("span");
            completedText.innerText = "Completed";
            completedText.style.color = "#ffffff";
            completedText.style.fontSize = "14px";
            completedText.style.fontWeight = "600";
            completedText.style.background = "green";
            completedText.style.padding = "3px 8px";
            completedText.style.borderRadius = "4px";
            completedText.style.marginLeft = "8px";
            completedText.className = "completed-text";
            div.appendChild(completedText);
        }

        listItems.appendChild(li);
    });
}

ReadToDoItems();


//Create the tasks
function CreateToDoItems() {
    if (todoValue.value === "") {
        todoAlert.innerText = 'Please enter your todo task!';
        todoValue.focus();
    } else {
        let IsPresent = false;
        todo.forEach((element) => {
            if (element.item === todoValue.value) {
                IsPresent = true;
            } 
        });
        if (IsPresent) {
            setAlertMessage("This item is already on the list!");
            return;
        }

        let li = document.createElement("li");
        
        const todoItems = `<div style="display:flex; align-items:center;" ondblclick="CompletedToDoItems(this)">
            <button class="complete-btn" onclick="event.stopPropagation(); CompletedToDoItems(this.parentElement)">○</button>
            <span class="task-text">${todoValue.value}</span>
            </div><div>
            <img class="edit todo-controls" onclick="UpdateToDoItems(this)" src="images/edit.png"/>
            <img class="delete todo-controls" onclick="DeleteToDoItems(this)" src="images/delete.png"/></div>`;

        li.innerHTML = todoItems;
        listItems.appendChild(li);

        if (!todo) {
            todo = [];
        }
        let itemList = { item: todoValue.value, status: false };
        todo.push(itemList);
        setLocalStorage();
    }
    todoValue.value = "";
    setAlertMessage("Todo item added successfully");
}


function UpdateOnSelectionItems() {
    let IsPresent = false;
    todo.forEach((element) => {
        if (element.item === todoValue.value) {
            IsPresent = true;
        }
    });
    if (IsPresent) {
        setAlertMessage("This item is already on the list!");
        return;
    }

    todo.forEach((element) => {
        if (element.item === updateText.innerText.trim()) {
            element.item = todoValue.value;
        }
    });

    setLocalStorage();

    updateText.innerText = todoValue.value;
    addUpdate.setAttribute("onclick", "CreateToDoItems()");
    addUpdate.setAttribute("src", "images/plus.png");
    todoValue.value = "";

    setAlertMessage("Todo item Updated Successfully!");
}

function CompletedToDoItems(e) {
    const div = e.tagName === "DIV" ? e : e.parentElement;
    const taskText = div.querySelector(".task-text");
    const completeBtn = div.querySelector(".complete-btn");
    const li = div.parentElement;

    if (taskText.style.textDecoration !== "line-through") {
        // --- COMPLETING ---
        taskText.style.textDecoration = "line-through";

        const img = document.createElement("img");
        img.src = "images/check.png";
        img.className = "todo-controls";
        div.appendChild(img);

        completeBtn.innerText = "✓";
        completeBtn.classList.add("completed");

        const completedText = document.createElement("span");
        completedText.innerText = "Completed";
        completedText.style.color = "#ffffff";
        completedText.style.fontSize = "14px";
        completedText.style.fontWeight = "600";
        completedText.style.background = "green";
        completedText.style.padding = "3px 8px";
        completedText.style.borderRadius = "4px";
        completedText.style.marginLeft = "8px";
        completedText.className = "completed-text";
        div.appendChild(completedText);

        // Remove edit button
        const editBtn = li.querySelector("img.edit");
        if (editBtn) editBtn.remove();

        todo.forEach((element) => {
            if (element.item === taskText.innerText.trim()) {
                element.status = true;
            }
        });
        setLocalStorage();
        triggerConfetti();
        setAlertMessage("Todo item Completed!");

    } else {
        // --- UN-COMPLETING ---
        taskText.style.textDecoration = "none";

        completeBtn.innerText = "○";
        completeBtn.classList.remove("completed");

        // Remove checkmark
        const checkMark = div.querySelector("img.todo-controls");
        if (checkMark) checkMark.remove();

        // Remove completed text
        const completedText = div.querySelector(".completed-text");
        if (completedText) completedText.remove();

        // Add back edit button
        const controlsDiv = li.querySelector("div:last-child");
        const editImg = document.createElement("img");
        editImg.src = "images/edit.png";
        editImg.className = "edit todo-controls";
        editImg.setAttribute("onclick", "UpdateToDoItems(this)");
        controlsDiv.insertBefore(editImg, controlsDiv.firstChild);

        todo.forEach((element) => {
            if (element.item === taskText.innerText.trim()) {
                element.status = false;
            }
        });
        setLocalStorage();
        setAlertMessage("Todo item Uncompleted!");
    }
}

function UpdateToDoItems(e) {
    const li = e.parentElement.parentElement;
    const taskText = li.querySelector(".task-text");

    if (taskText.style.textDecoration !== "line-through") {
        todoValue.value = taskText.innerText;
        updateText = taskText;
        addUpdate.setAttribute("onclick", "UpdateOnSelectionItems()");
        addUpdate.setAttribute("src", "images/refresh.png");
        todoValue.focus();
    }
}

 
function DeleteToDoItems(e) {
    const li = e.parentElement.parentElement;
    const taskText = li.querySelector(".task-text");
    let deleteValue = taskText.innerText.trim();

    if (confirm(`Are you sure. Do you want to delete this ${deleteValue}?`)) {
        li.setAttribute("class", "deleted-item");
        todoValue.focus();

        const index = todo.findIndex((element) => element.item === deleteValue);
        if (index !== -1) {
            todo.splice(index, 1);
        }

        setTimeout(() => {
            li.remove();
        }, 1000);

        setLocalStorage();
    }
}

function triggerConfetti() {
    const colors = ["#ff0000", "#00ff00", "#0000ff", "#ffff00", "#ff00ff", "#00ffff", "#ff8800", "#ffffff", "#ff69b4", "#ffd700"];
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    for (let i = 0; i < 150; i++) {
        const confetti = document.createElement("div");
        confetti.classList.add("confetti");

        const size = 8 + Math.random() * 10;
        confetti.style.width = size + "px";
        confetti.style.height = size + "px";
        confetti.style.left = centerX + "px";
        confetti.style.top = centerY + "px";
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const tx = (Math.random() - 0.5) * 600;
        const ty = (Math.random() - 0.5) * 400 + 100;
        const rot = (Math.random() - 0.5) * 720;
        const duration = 1.5 + Math.random() * 1.5;

        confetti.style.setProperty("--tx", tx + "px");
        confetti.style.setProperty("--ty", ty + "px");
        confetti.style.setProperty("--rot", rot + "deg");
        confetti.style.animation = `confetti-burst ${duration}s ease-out forwards`;

        document.body.appendChild(confetti);

        setTimeout(() => {
            confetti.remove();
        }, (duration + 0.5) * 1000);
    }
}

function setLocalStorage() {
  localStorage.setItem("todo-list", JSON.stringify(todo));
}

function setAlertMessage(message) {
  todoAlert.removeAttribute("class");
  todoAlert.innerText = message;
  setTimeout(() => {
    todoAlert.classList.add("toggleMe");
  }, 1000);
}



