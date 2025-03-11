// Simulate user role (admin or user)
let userRole = 'admin'; // Change to 'user' to test non-admin access

// Show/hide admin section based on user role
const adminTaskManagement = document.getElementById('adminTaskManagement');
if (userRole === 'admin') {
    adminTaskManagement.classList.remove('hidden');
}

// Function to make table rows editable
function makeTableEditable(tableId) {
    const table = document.getElementById(tableId);
    if (!table) return;

    table.addEventListener('dblclick', function (event) {
        const target = event.target;
        if (target.tagName === 'TD' && !target.classList.contains('actions')) {
            const originalValue = target.innerText;
            target.innerHTML = `<input type="text" value="${originalValue}">`;
            const input = target.querySelector('input');
            input.focus();

            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    target.innerText = input.value;
                    console.log(`Updated value: ${input.value}`);
                }
                if (e.key === 'Escape') {
                    target.innerText = originalValue;
                }
            });

            input.addEventListener('blur', function () {
                target.innerText = input.value;
                console.log(`Updated value: ${input.value}`);
            });
        }
    });
}

// Function to add a new task to the "My Tasks" table
function addTask() {
    const table = document.querySelector('#myTasksTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td contenteditable="true">New Task</td>
    <td>
      <select class="priority-select">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </td>
    <td>
      <div class="progress-bar">
        <div class="progress" style="width: 0%;"></div>
      </div>
    </td>
    <td contenteditable="true">2025-01-01</td>
    <td class="actions">
      <button onclick="deleteTask(this)">❌</button>
    </td>
  `;

    table.appendChild(newRow);
}

// Function to add a new task to the "Admin Tasks" table
function addAdminTask() {
    const table = document.querySelector('#adminTasksTable tbody');
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
    <td contenteditable="true">New Admin Task</td>
    <td>
      <select class="priority-select">
        <option value="high">High</option>
        <option value="medium">Medium</option>
        <option value="low">Low</option>
      </select>
    </td>
    <td contenteditable="true">Assign to User</td>
    <td contenteditable="true">2025-01-01</td>
    <td class="actions">
      <button onclick="deleteTask(this)">❌</button>
    </td>
  `;

    table.appendChild(newRow);
}

// Function to delete a task
function deleteTask(button) {
    const row = button.closest('tr');
    row.remove();
}

// Add event listeners
document.getElementById('addTaskBtn').addEventListener('click', addTask);
document.getElementById('addAdminTaskBtn').addEventListener('click', addAdminTask);

// Make tables editable
makeTableEditable('myTasksTable');
makeTableEditable('adminTasksTable');
