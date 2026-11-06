
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");
const taskCount = document.getElementById("taskCount");
const taskSummary = document.getElementById("taskSummary");
const remainingText = document.getElementById("remainingText");
const clearCompleted = document.getElementById("clearCompleted");
const filterButtons = document.querySelectorAll(".filter");

let tasks = [];

try {
  const savedTasks = JSON.parse(localStorage.getItem("taskly-tasks"));
  if (Array.isArray(savedTasks)) {
    tasks = savedTasks.filter(task =>
      task &&
      typeof task.id === "string" &&
      typeof task.text === "string" &&
      typeof task.completed === "boolean"
    );
  }
} catch (error) {
  tasks = [];
}

let currentFilter = "all";

document.getElementById("year").textContent = new Date().getFullYear();

function saveTasks() {
  try {
    localStorage.setItem("taskly-tasks", JSON.stringify(tasks));
  } catch (error) {
    alert("Data tidak bisa disimpan di browser ini.");
  }
}

function renderTasks() {
  taskList.replaceChildren();

  const filteredTasks = tasks.filter(task => {
    if (currentFilter === "active") return !task.completed;
    if (currentFilter === "completed") return task.completed;
    return true;
  });

  filteredTasks.forEach(task => {
    const item = document.createElement("li");
    item.className = "task-item";

    if (task.completed) {
      item.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "task-check";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Tandai tugas selesai");

    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-btn";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", "Hapus tugas");

    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, deleteButton);
    taskList.appendChild(item);
  });

  const completedCount = tasks.filter(task => task.completed).length;
  const remainingCount = tasks.length - completedCount;

  taskCount.textContent = tasks.length;
  remainingText.textContent = `${remainingCount} tugas tersisa`;

  taskSummary.textContent = tasks.length
    ? `${completedCount} dari ${tasks.length} tugas sudah selesai.`
    : "Mulai rencanakan harimu.";

  emptyState.hidden = filteredTasks.length > 0;
  taskList.hidden = filteredTasks.length === 0;

  const emptyTitle = emptyState.querySelector("h3");
  const emptyDescription = emptyState.querySelector("p");

  if (currentFilter === "active") {
    emptyTitle.textContent = "Semua beres!";
    emptyDescription.textContent = "Tidak ada tugas yang belum selesai.";
  } else if (currentFilter === "completed") {
    emptyTitle.textContent = "Belum ada tugas selesai";
    emptyDescription.textContent = "Tugas yang kamu selesaikan akan muncul di sini.";
  } else {
    emptyTitle.textContent = "Belum ada tugas";
    emptyDescription.textContent = "Tambahkan tugas pertamamu dan mulai produktif.";
  }

  clearCompleted.disabled = completedCount === 0;
  clearCompleted.style.opacity = completedCount === 0 ? "0.4" : "1";
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();

  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.unshift({
    id: crypto.randomUUID(),
    text,
    completed: false
  });

  saveTasks();
  currentFilter = "all";

  filterButtons.forEach(button => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  taskInput.value = "";
  renderTasks();
  taskInput.focus();
});

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;

    filterButtons.forEach(filter => {
      const isActive = filter === button;
      filter.classList.toggle("active", isActive);
      filter.setAttribute("aria-pressed", String(isActive));
    });

    renderTasks();
  });
});

clearCompleted.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

filterButtons.forEach(button => {
  button.setAttribute(
    "aria-pressed",
    String(button.dataset.filter === currentFilter)
  );
});

renderTasks();
