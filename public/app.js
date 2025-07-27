const form = document.getElementById('taskForm');
const taskList = document.getElementById('taskList');

async function fetchTasks() {
  const res = await fetch('/tasks');
  const tasks = await res.json();
  taskList.innerHTML = '';
  tasks.forEach(addTaskToDOM);
}

function addTaskToDOM(task) {
  const li = document.createElement('li');
  li.className = task.completed ? 'completed' : '';
  li.innerHTML = `
    <span>${task.description} (Due: ${new Date(task.dueDate).toLocaleDateString()})</span>
    <div class="actions">
      <button onclick="toggleComplete('${task._id}', ${!task.completed})">
        ${task.completed ? 'Undo' : 'Done'}
      </button>
      <button onclick="deleteTask('${task._id}')">Delete</button>
    </div>
  `;
  taskList.appendChild(li);
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const description = document.getElementById('description').value;
  const dueDate = document.getElementById('dueDate').value;
  await fetch('/tasks', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, dueDate })
  });
  form.reset();
  fetchTasks();
});

async function toggleComplete(id, status) {
  await fetch(`/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed: status })
  });
  fetchTasks();
}

async function deleteTask(id) {
  await fetch(`/tasks/${id}`, { method: 'DELETE' });
  fetchTasks();
}

fetchTasks();
