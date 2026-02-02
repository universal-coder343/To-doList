let tasks = JSON.parse(localStorage.getItem("tasks")) || [];


const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const tasksList = document.getElementById("tasksList");
const activeCount = document.getElementById("activeCount");
const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const completionRate = document.getElementById("completionRate");
const currentDate = document.getElementById("current-date");
const currentTime = document.getElementById("current-time");

function updateDateTime() {
  const now = new Date();
  const dateOptions = { month: "short", day: "numeric", year: "numeric" };
  currentDate.textContent = now.toLocaleDateString("en-US", dateOptions);

  const timeOptions = { hour: "2-digit", minute: "2-digit" };
  currentTime.textContent = now.toLocaleTimeString("en-US", timeOptions);
}

updateDateTime();
setInterval(updateDateTime, 60000);


function addTask() {
  const text = taskInput.value.trim();
  if (text === "") return;

  const task = {
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  tasks.unshift(task);
  saveTasks();
  renderTasks();
  taskInput.value = "";
  taskInput.focus();
}


function toggleTask(id) {
  const task = tasks.find((t) => t.id === id);
  if (task) {
    task.completed = !task.completed;
    saveTasks();
    renderTasks();
  }
}


function deleteTask(id) {
  const taskElement = document.querySelector(`[data-id="${id}"]`);
  taskElement.classList.add("removing");

  setTimeout(() => {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }, 300);
}


function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const active = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  activeCount.textContent = active;
  totalCount.textContent = total;
  completedCount.textContent = completed;
  completionRate.textContent = rate + "%";
}


function renderTasks() {
  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const sortedTasks = [...activeTasks, ...completedTasks];

  if (sortedTasks.length === 0) {
    tasksList.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-state-icon">□</div>
                        <div class="empty-state-text">No tasks yet</div>
                    </div>
                `;
  } else {
    tasksList.innerHTML = sortedTasks
      .map(
        (task) => `
                    <div class="task ${task.completed ? "completed" : ""}" data-id="${task.id}">
                        <div class="checkbox-wrapper">
                            <input type="checkbox" ${task.completed ? "checked" : ""} 
                                   onchange="toggleTask(${task.id})">
                        </div>
                        <div class="task-text">${escapeHtml(task.text)}</div>
                        <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
                    </div>
                `,
      )
      .join("");
  }

  updateStats();
}


function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

addBtn.addEventListener("click", addTask);
taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") addTask();
});

renderTasks();
