document.addEventListener('DOMContentLoaded', () => {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    const prevMonthButton = document.getElementById('prevMonth');
    const nextMonthButton = document.getElementById('nextMonth');
    const addTaskButton = document.getElementById('addTask');
    const taskNameInput = document.getElementById('taskName');
    const taskDateInput = document.getElementById('taskDate');
    const taskTimeInput = document.getElementById('taskTime');
  
    let currentDate = new Date();
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  
    const renderCalendar = () => {
      calendarGrid.innerHTML = '';
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const daysInMonth = lastDay.getDate();
      const startDay = firstDay.getDay();
  
      currentMonthElement.textContent = `${currentDate.toLocaleString('default', { month: 'long' })} ${year}`;
  
      for (let i = 0; i < startDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.classList.add('day');
        calendarGrid.appendChild(emptyDay);
      }
  
      for (let day = 1; day <= daysInMonth; day++) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('day');
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const dayOfWeek = new Date(year, month, day).toLocaleString('default', { weekday: 'short' });
  
        // Display the day number and day of the week
        dayElement.innerHTML = `<span class="day-number">${day}</span><br><span class="day-week">${dayOfWeek}</span>`;
  
        const dayTasks = tasks.filter(task => task.date === dateKey);
  
        if (dayTasks.length > 0) {
          dayElement.classList.add('has-tasks');
          dayElement.title = dayTasks.map(task => `${task.name} at ${task.time}`).join('\n');
        }
  
        if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
          dayElement.classList.add('today');
        }
  
        // Add click event to days to show tasks in an alert
        dayElement.addEventListener('click', () => {
          showTasksForDate(dateKey);
        });
  
        calendarGrid.appendChild(dayElement);
      }
    };
  
    const addTask = () => {
      const name = taskNameInput.value.trim();
      const date = taskDateInput.value;
      const time = taskTimeInput.value;
  
      if (name && date && time) {
        tasks.push({ name, date, time });
        localStorage.setItem('tasks', JSON.stringify(tasks));
        renderCalendar();
        taskNameInput.value = '';
        taskDateInput.value = '';
        taskTimeInput.value = '';
      } else {
        alert('Please fill out all fields.');
      }
    };
  
    const showTasksForDate = (date) => {
      const tasksForDate = tasks.filter(task => task.date === date);
      if (tasksForDate.length > 0) {
        const taskDetails = tasksForDate.map(task => `${task.name} at ${task.time}`).join('\n');
        alert(`Tasks for ${date}:\n${taskDetails}`);
      } else {
        alert(`No tasks for ${date}.`);
      }
    };
  
    prevMonthButton.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() - 1);
      renderCalendar();
    });
  
    nextMonthButton.addEventListener('click', () => {
      currentDate.setMonth(currentDate.getMonth() + 1);
      renderCalendar();
    });
  
    addTaskButton.addEventListener('click', addTask);
  
    renderCalendar();
  });
