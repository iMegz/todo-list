const todos = document.querySelector(".todos");

// Detect if no todos were found
todos.addEventListener("DOMSubtreeModified", () => {
    const liElements = todos.querySelectorAll("li");
    if (liElements.length === 0) {
        if (!todos.querySelector("h2")) {
            const h2 = document.createElement("h2");
            h2.textContent = "No todos were found";
            todos.appendChild(h2);
        }
    } else {
        const h2 = todos.querySelector("h2");
        if (h2) todos.removeChild(h2);
    }
});

// Edit the todo task
function edit(element) {
    element.contentEditable = true;
    element.spellcheck = false;
    element.focus();
    if (element.textContent === "New todo") selectText(element);
}

// Select all text if the todo is new
function selectText(element) {
    const range = document.createRange();
    range.selectNodeContents(element);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
}

// Stop editing the todo task
function stopEdit(element) {
    const trimmedValue = element.textContent.trim();
    element.contentEditable = false;

    if (trimmedValue === "") {
        const liElement = element.parentNode;
        if (liElement) liElement.parentNode?.removeChild(liElement);
    }
}

// Add editing events to todo element
function addListeners(element) {
    element.addEventListener("click", () => edit(element));
    element.addEventListener("blur", () => stopEdit(element));
    element.addEventListener(
        "keypress",
        ({ key }) => key === "Enter" && stopEdit(element)
    );
}

// Create new todo element
function Todo(todo = {}) {
    const id = todo?.id ?? Date.now();
    const task = todo?.task ?? "New todo";
    const done = todo.done;

    const li = document.createElement("li");
    li.id = id;
    li.className = "todo";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `cb${id}`;
    li.appendChild(checkbox);

    const span = document.createElement("span");
    span.className = "todoTask";
    span.textContent = task;
    if (done) {
        span.classList.add("done");
        checkbox.checked = true;
    }
    li.appendChild(span);

    const btn = document.createElement("button");
    btn.className = "btn btn-delete";
    btn.textContent = "X";
    btn.addEventListener("click", () => li.parentNode.removeChild(li));
    li.appendChild(btn);

    checkbox.addEventListener("change", ({ target }) => {
        if (target.checked) span.classList.add("done");
        else span.classList.remove("done");
    });

    addListeners(span);
    return li;
}

// Add event listener to add task button
document
    .querySelector("#addTodo")
    .addEventListener("click", () => todos.appendChild(Todo()));

window.addEventListener("beforeunload", save);

function save() {
    console.log("Test");
    const todoList = [];
    todos.querySelectorAll(".todo").forEach((liElement) => {
        const task = liElement.querySelector(".todoTask");
        const todo = {};
        todo.id = liElement.id;
        todo.task = task.textContent;
        todo.done = task.classList.contains("done");

        todoList.push(todo);
    });
    localStorage.setItem("todos", JSON.stringify(todoList));
}

function init() {
    const todoList = JSON.parse(localStorage.getItem("todos"));
    if (todoList?.length > 0) {
        todoList.forEach((todo) => todos.appendChild(Todo(todo)));
    }
}

init();
