const form = document.querySelector('#task-form');
const input = document.querySelector('#task-input');
const list = document.querySelector('#task-list');
const count = document.querySelector('#task-count');
const emptyState = document.querySelector('#empty-state');
const clockFace = document.querySelector('#clock-face');
const hourHand = document.querySelector('#clock-hour');
const minuteHand = document.querySelector('#clock-minute');
const secondHand = document.querySelector('#clock-second');
const storageKey = 'mis-tareas-v1';

let tasks = loadTasks();

function loadTasks() {
  try {
    const savedTasks = JSON.parse(localStorage.getItem(storageKey) || '[]');
    return Array.isArray(savedTasks) ? savedTasks : [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(storageKey, JSON.stringify(tasks));
}

function renderTasks() {
  list.replaceChildren();
  const pendingCount = tasks.filter((task) => !task.completed).length;
  count.textContent = `${pendingCount} ${pendingCount === 1 ? 'tarea pendiente' : 'tareas pendientes'}`;
  emptyState.hidden = tasks.length > 0;

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' is-complete' : ''}`;

    const toggle = document.createElement('button');
    toggle.className = 'task-toggle';
    toggle.type = 'button';
    toggle.setAttribute('aria-label', task.completed ? `Marcar ${task.text} como pendiente` : `Completar ${task.text}`);
    toggle.setAttribute('aria-pressed', String(task.completed));
    toggle.addEventListener('click', () => {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const remove = document.createElement('button');
    remove.className = 'delete-task';
    remove.type = 'button';
    remove.textContent = '×';
    remove.setAttribute('aria-label', `Eliminar ${task.text}`);
    remove.addEventListener('click', () => {
      tasks = tasks.filter((currentTask) => currentTask.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(toggle, text, remove);
    list.append(item);
  });
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text) return;

  tasks.unshift({ id: `${Date.now()}-${Math.random()}`, text, completed: false });
  saveTasks();
  renderTasks();
  form.reset();
  input.focus();
});

function updateClock() {
  const now = new Date();
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;

  hourHand.style.transform = `translateX(-50%) rotate(${(hours * 30) + (minutes * 0.5)}deg)`;
  minuteHand.style.transform = `translateX(-50%) rotate(${(minutes * 6) + (seconds * 0.1)}deg)`;
  secondHand.style.transform = `translateX(-50%) rotate(${seconds * 6}deg)`;
  clockFace.setAttribute('aria-label', `Hora actual: ${now.toLocaleTimeString('es-ES')}`);
}

renderTasks();
updateClock();
window.setInterval(updateClock, 1000);