const alert = document.getElementById("alert");
const form = document.getElementById("form");
window.onload = parseEquationLogToHTML;

const openAlert = () => {
  alert.classList.remove("hidden");
};

const closeAlert = () => {
  alert.classList.add("hidden");
};

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36);
};

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks == null) tasks = [];

  let data = new FormData(form);
  let task = {
    id: generateId(),
    title: data.get("title"),
    description: data.get("description"),
    completed: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  parseEquationLogToHTML();
  closeAlert();
});

function parseEquationLogToHTML() {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks == null) return;

  tasks.forEach((task) => {
    const taskElement = `<li 
    class="task ${task.completed ? "task--completed" : ""}" id="'${task.id}'"
    >

    <div class="task__title">${task.title}</div>
    <div class="task__description">${task.description}</div>
    <div class="task__actions">
        <button title="Mark as done" class="action action__done">✅</button>
        <button title="Remove" class="action action__remove" onclick="removeTask('${
          task.id
        }')">❌</button>
    </div>
    
    </li>`;

    document.getElementById("tasks").innerHTML += taskElement;
  });
}

const removeTask = (taskId) => {
  let tasks = JSON.parse(localStorage.getItem("tasks"));
  if (tasks == null) tasks = [];

  const taskToDelete = tasks.findIndex((task) => task.id === taskId);
  tasks.splice(taskToDelete, 1);

  localStorage.setItem("tasks", JSON.stringify(tasks));

  parseEquationLogToHTML();
};
