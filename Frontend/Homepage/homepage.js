

//weather app
// Weather widget functionality
document.addEventListener('DOMContentLoaded', function() {
    const weatherWidget = document.querySelector('.weather-widget');
    
    // Check if widget exists
    if (!weatherWidget) {
        console.error('Weather widget container not found!');
        return;
    }

    // Get elements with null checks
    const weatherIcon = weatherWidget.querySelector('.weather-icon i');
    const temperatureEl = weatherWidget.querySelector('.temperature');
    const conditionsEl = weatherWidget.querySelector('.conditions');
    const locationEl = weatherWidget.querySelector('.location');

    // Verify all required elements exist
    if (!weatherIcon || !temperatureEl || !conditionsEl || !locationEl) {
        console.error('Missing required weather elements!');
        return;
    }

    // Weather icon mapping
    const weatherIcons = {
        'clear': 'fa-sun',
        'clouds': 'fa-cloud',
        'rain': 'fa-cloud-rain',
        'snow': 'fa-snowflake',
        'thunderstorm': 'fa-bolt',
        'drizzle': 'fa-cloud-rain',
        'mist': 'fa-smog'
    };

    // Fetch weather data
    function fetchWeather(location = "Bremen") {
        const apiKey = '79f355fb46089977310e1f65bbec4378'; // Remember to secure this in production
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${apiKey}`)
            .then(response => {
                if (!response.ok) throw new Error('Weather data not available');
                return response.json();
            })
            .then(data => {
                updateWeatherUI({
                    temp: Math.round(data.main.temp),
                    conditions: data.weather[0].main.toLowerCase(),
                    location: data.name
                });
            })
            .catch(error => {
                console.error("Error fetching weather:", error);
                conditionsEl.textContent = "Weather unavailable";
                // Set default values when API fails
                updateWeatherUI({
                    temp: '--',
                    conditions: 'Service down',
                    location: 'Try again later'
                });
            });
    }

    // Update UI with weather data
    function updateWeatherUI(data) {
        temperatureEl.textContent = `${data.temp}°C`;
        conditionsEl.textContent = data.conditions.charAt(0).toUpperCase() + data.conditions.slice(1);
        locationEl.textContent = data.location;
        
        // Set appropriate icon
        const iconClass = weatherIcons[data.conditions.toLowerCase()] || 'fa-cloud';
        weatherIcon.className = `fas ${iconClass}`;
        
        // Change color based on temperature (if it's a number)
        if (typeof data.temp === 'number') {
            weatherIcon.style.color = data.temp > 25 ? '#e74c3c' : 
                                    data.temp < 5 ? '#3498db' : '#f39c12';
        }
    }

    // Initial load
    fetchWeather();
});

const daysContainer = document.querySelector(".days"),
  nextBtn = document.querySelector(".next-btn"),
  prevBtn = document.querySelector(".prev-btn"),
  month = document.querySelector(".month"),
  todayBtn = document.querySelector(".today-btn");

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// get current date
const date = new Date();

// get current month
let currentMonth = date.getMonth();

// get current year
let currentYear = date.getFullYear();

// function to render days
function renderCalendar() {
  // get prev month current month and next month days
  date.setDate(1);
  const firstDay = new Date(currentYear, currentMonth, 1);
  const lastDay = new Date(currentYear, currentMonth + 1, 0);
  const lastDayIndex = lastDay.getDay();
  const lastDayDate = lastDay.getDate();
  const prevLastDay = new Date(currentYear, currentMonth, 0);
  const prevLastDayDate = prevLastDay.getDate();
  const nextDays = 7 - lastDayIndex - 1;

  // update current year and month in header
  month.innerHTML = `${months[currentMonth]} ${currentYear}`;

  // update days html
  let days = "";

  // prev days html
  for (let x = firstDay.getDay(); x > 0; x--) {
    days += `<div class="day prev">${prevLastDayDate - x + 1}</div>`;
  }

  // current month days
  for (let i = 1; i <= lastDayDate; i++) {
    // check if its today then add today class
    if (
      i === new Date().getDate() &&
      currentMonth === new Date().getMonth() &&
      currentYear === new Date().getFullYear()
    ) {
      // if date month year matches add today
      days += `<div class="day today">${i}</div>`;
    } else {
      //else dont add today
      days += `<div class="day ">${i}</div>`;
    }
  }

  // next MOnth days
  for (let j = 1; j <= nextDays; j++) {
    days += `<div class="day next">${j}</div>`;
  }

  // run this function with every calendar render
  hideTodayBtn();
  daysContainer.innerHTML = days;
}

renderCalendar();

nextBtn.addEventListener("click", () => {
  // increase current month by one
  currentMonth++;
  if (currentMonth > 11) {
    // if month gets greater that 11 make it 0 and increase year by one
    currentMonth = 0;
    currentYear++;
  }
  // rerender calendar
  renderCalendar();
});

// prev monyh btn
prevBtn.addEventListener("click", () => {
  // increase by one
  currentMonth--;
  // check if let than 0 then make it 11 and deacrease year
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  }
  renderCalendar();
});

// go to today
todayBtn.addEventListener("click", () => {
  // set month and year to current
  currentMonth = date.getMonth();
  currentYear = date.getFullYear();
  // rerender calendar
  renderCalendar();
});

// lets hide today btn if its already current month and vice versa

function hideTodayBtn() {
  if (
    currentMonth === new Date().getMonth() &&
    currentYear === new Date().getFullYear()
  ) {
    todayBtn.style.display = "none";
  } else {
    todayBtn.style.display = "flex";
  }
}

//ACTIVE PROJECTS
// Function to open the "Add Project" form
function openAddProjectForm() {
    document.getElementById('add-project-form').style.display = 'block';
}

// Function to close the "Add Project" form
function closeAddProjectForm() {
    document.getElementById('add-form').style.display = 'none';
}

// Function to add a new project
function addProject() {
    // Get input values
    const projectName = document.getElementById('project-name').value;
    const projectDeadline = document.getElementById('project-deadline').value;
    const projectTeam = document.getElementById('project-team').value;

    if (projectName && projectDeadline && projectTeam) {
        // Create a new project item
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        // Add project details
        projectItem.innerHTML = `
            <h3>${projectName}</h3>
            <p class="deadline">Deadline: ${projectDeadline}</p>
            <p class="team">Team: ${projectTeam}</p>
            <label class="done-checkbox">
                <input type="checkbox" onchange="markProjectDone(this)"> Mark as Done
            </label>
        `;

        // Append the new project to the projects list
        document.getElementById('projects-list').appendChild(projectItem);

        // Clear the form and close it
        document.getElementById('project-name').value = '';
        document.getElementById('project-deadline').value = '';
        document.getElementById('project-team').value = '';
        closeAddProjectForm();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to mark a project as done
function markProjectDone(checkbox) {
    const projectItem = checkbox.closest('.project-item');
    if (checkbox.checked) {
        projectItem.style.opacity = '0.6';
        projectItem.style.textDecoration = 'line-through';
    } else {
        projectItem.style.opacity = '1';
        projectItem.style.textDecoration = 'none';
    }
}


// Function to add a new project
function addProject() {
    // Get input values
    const projectName = document.getElementById('project-name').value;
    const projectDeadline = document.getElementById('project-deadline').value;
    const projectTeam = document.getElementById('project-team').value;

    if (projectName && projectDeadline && projectTeam) {
        // Hide the "No projects assigned" message
        const noProjectsMessage = document.getElementById('no-projects-message');
        if (noProjectsMessage) {
            noProjectsMessage.style.display = 'none';
        }

        // Create a new project item
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        // Add project details
        projectItem.innerHTML = `
            <h3>${projectName}</h3>
            <p class="deadline">Deadline: ${projectDeadline}</p>
            <p class="team">Team: ${projectTeam}</p>
            <label class="done-checkbox">
                <input type="checkbox" onchange="markProjectDone(this)"> Mark as Done
            </label>
        `;

        // Append the new project to the projects list
        document.getElementById('projects-list').appendChild(projectItem);

        // Clear the form and close it
        document.getElementById('project-name').value = '';
        document.getElementById('project-deadline').value = '';
        document.getElementById('project-team').value = '';
        closeAddProjectForm();
    } else {
        alert('Please fill in all fields.');
    }
}


// Function to open the "Add New" form
function openAddForm() {
    document.getElementById('add-form').style.display = 'block';
}

// Function to close the "Add New" form
function closeAddForm() {
    document.getElementById('add-form').style.display = 'none';
}

// Function to add a new task to the schedule
function addTask() {
    // Get input values
    const taskName = document.getElementById('task-name').value;
    const taskTime = document.getElementById('task-time').value;

    if (taskName && taskTime) {
        // Create a new schedule item
        const scheduleItem = document.createElement('div');
        scheduleItem.className = 'schedule-item';

        // Add task details
        scheduleItem.innerHTML = `
            <span>${taskTime} - ${taskName}</span>
            <button onclick="removeTask(this)">Delete</button>
        `;

        // Append the new item to the schedule
        document.getElementById('schedule-items').appendChild(scheduleItem);

        // Clear the form and close it
        document.getElementById('task-name').value = '';
        document.getElementById('task-time').value = '';
        closeAddForm();
    } else {
        alert('Please fill in both task name and time.');
    }
}

// Function to remove a task
function removeTask(button) {
    const scheduleItem = button.parentElement;
    scheduleItem.remove();
}

// Function to open the "Add Project" form
function openAddProjectForm() {
    document.getElementById('add-project-form').style.display = 'block';
}

// Function to close the "Add Project" form
function closeAddProjectForm() {
    document.getElementById('add-project-form').style.display = 'none';
}

// Function to add a new project
function addProject() {
    // Get input values
    const projectName = document.getElementById('project-name').value;
    const projectDeadline = document.getElementById('project-deadline').value;
    const projectTeam = document.getElementById('project-team').value;

    if (projectName && projectDeadline && projectTeam) {
        // Create a new project item
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        // Add project details
        projectItem.innerHTML = `
            <h3>${projectName}</h3>
            <p class="deadline">Deadline: ${projectDeadline}</p>
            <p class="team">Team: ${projectTeam}</p>
            <label class="done-checkbox">
                <input type="checkbox" onchange="markProjectDone(this)"> Mark as Done
            </label>
        `;

        // Append the new project to the projects list
        document.getElementById('projects-list').appendChild(projectItem);

        // Clear the form and close it
        document.getElementById('project-name').value = '';
        document.getElementById('project-deadline').value = '';
        document.getElementById('project-team').value = '';
        closeAddProjectForm();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to mark a project as done
function markProjectDone(checkbox) {
    const projectItem = checkbox.closest('.project-item');
    if (checkbox.checked) {
        projectItem.style.opacity = '0.6';
        projectItem.style.textDecoration = 'line-through';
    } else {
        projectItem.style.opacity = '1';
        projectItem.style.textDecoration = 'none';
    }
}


// Function to add a new project
function addProject() {
    // Get input values
    const projectName = document.getElementById('project-name').value;
    const projectDeadline = document.getElementById('project-deadline').value;
    const projectTeam = document.getElementById('project-team').value;

    if (projectName && projectDeadline && projectTeam) {
        // Hide the "No projects assigned" message
        const noProjectsMessage = document.getElementById('no-projects-message');
        if (noProjectsMessage) {
            noProjectsMessage.style.display = 'none';
        }

        // Create a new project item
        const projectItem = document.createElement('div');
        projectItem.className = 'project-item';

        // Add project details
        projectItem.innerHTML = `
            <h3>${projectName}</h3>
            <p class="deadline">Deadline: ${projectDeadline}</p>
            <p class="team">Team: ${projectTeam}</p>
            <label class="done-checkbox">
                <input type="checkbox" onchange="markProjectDone(this)"> Mark as Done
            </label>
        `;

        // Append the new project to the projects list
        document.getElementById('projects-list').appendChild(projectItem);

        // Clear the form and close it
        document.getElementById('project-name').value = '';
        document.getElementById('project-deadline').value = '';
        document.getElementById('project-team').value = '';
        closeAddProjectForm();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to add a new message
function addMessage(sender, message) {
    // Hide the "No messages" message
    const noMessagesMessage = document.getElementById('no-messages-message');
    if (noMessagesMessage) {
        noMessagesMessage.style.display = 'none';
    }

    // Create a new message item
    const messageItem = document.createElement('div');
    messageItem.className = 'message-item';
    messageItem.innerHTML = `
        <strong>${sender}:</strong> ${message}
    `;

    // Append the new message to the messages list
    document.getElementById('messages-list').appendChild(messageItem);
}

// Example usage
document.addEventListener('DOMContentLoaded', () => {
    addMessage('Alice', 'Can you review the design?');
    addMessage('Daniel', 'The API docs are ready for feedback');
    addMessage('Antony', 'Hey, should I start writing the review documents?');
});

// Sample data (replace with real data from your app)
const stats = {
    tasksCompleted: 5,
    overdueTasks: 2,
    activeProjects: 3,
    overallProgress: 60 // Percentage
};

// Update the Quick Stats Dashboard
function updateQuickStats() {
    // Update tasks completed
    document.getElementById('tasks-completed').textContent = stats.tasksCompleted;

    // Update overdue tasks
    document.getElementById('overdue-tasks').textContent = stats.overdueTasks;

    // Update active projects
    document.getElementById('active-projects').textContent = stats.activeProjects;

    // Update overall progress
    const progressBar = document.getElementById('overall-progress');
    progressBar.style.width = `${stats.overallProgress}%`;
}

// Call the function to update stats
updateQuickStats();

// Sample data
let budget = {
    total: 1000,
    expenses: [
        { amount: 200, category: "Food", description: "Groceries" },
        { amount: 100, category: "Transportation", description: "Gas" },
        { amount: 100, category: "Entertainment", description: "Movie" }
    ]
};

// Function to calculate total expenses
function calculateTotalExpenses() {
    return budget.expenses.reduce((total, expense) => total + expense.amount, 0);
}

// Function to update the budget overview
function updateBudgetOverview() {
    const totalExpenses = calculateTotalExpenses();
    const remainingBudget = budget.total - totalExpenses;
    const progress = (totalExpenses / budget.total) * 100;

    document.getElementById('total-budget').textContent = `$${budget.total}`;
    document.getElementById('total-expenses').textContent = `$${totalExpenses}`;
    document.getElementById('remaining-budget').textContent = `$${remainingBudget}`;
    document.getElementById('budget-progress').style.width = `${progress}%`;
}

// Function to update the expense categories list
function updateExpenseCategories() {
    const categoriesList = document.getElementById('categories-list');
    categoriesList.innerHTML = '';

    const categories = {};
    budget.expenses.forEach(expense => {
        if (categories[expense.category]) {
            categories[expense.category] += expense.amount;
        } else {
            categories[expense.category] = expense.amount;
        }
    });

    for (const [category, amount] of Object.entries(categories)) {
        const categoryItem = document.createElement('li');
        categoryItem.innerHTML = `
            <span>${category}:</span>
            <span>$${amount}</span>
        `;
        categoriesList.appendChild(categoryItem);
    }
}

// Function to add a new expense
function addExpense() {
    const amount = parseFloat(document.getElementById('expense-amount').value);
    const category = document.getElementById('expense-category').value;
    const description = document.getElementById('expense-description').value;

    if (amount && category && description) {
        budget.expenses.push({ amount, category, description });
        updateBudgetOverview();
        updateExpenseCategories();
        closeAddExpenseForm();
    } else {
        alert('Please fill in all fields.');
    }
}

// Function to open the "Add Expense" form
function openAddExpenseForm() {
    document.getElementById('add-expense-form').style.display = 'block';
}

// Function to close the "Add Expense" form
function closeAddExpenseForm() {
    document.getElementById('add-expense-form').style.display = 'none';
}

// Initial render
updateBudgetOverview();
updateExpenseCategories();

//QUICK NOTES

document.addEventListener('DOMContentLoaded', function() {
    const savedNote = localStorage.getItem('quickNote');
    if(savedNote) {
        document.getElementById('quick-note-input').value = savedNote;
    }
});

document.getElementById('save-note').addEventListener('click', function() {
    const noteText = document.getElementById('quick-note-input').value;
    localStorage.setItem('quickNote', noteText);

    const statusEl = document.getElementById('note-status');
    statusEl.textContent = "Saved";
    setTimeout(() => statusEl.textContent = "", 2000);
});