import { useState, useEffect } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, format, isSameMonth, isSameDay, setMonth, setYear
} from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWrapper } from '../utils/fetchWrapper';

const months = Array.from({ length: 12 }, (_, i) => format(new Date(2025, i), 'MMMM'));
const years = Array.from({ length: 10 }, (_, i) => 2020 + i);

const API_URL = 'http://localhost:3000/api';

const EVENT_TYPE_COLORS = {
  PROJECT_START: '#00bfff',
  PROJECT_END: '#0077ff',
  PROJECT_COMPLETION: '#00ff99',
  TASK_START: '#ffcc00',
  TASK_END: '#ff9900',
  TASK_COMPLETION: '#00ff00',
  MEETING: '#ff6600',
  APPOINTMENT: '#cc33ff',
  DEFAULT: '#cccccc'
};

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', type: 'MEETING', description: '' });

  useEffect(() => {
    const fetchAllEvents = async () => {
      try {
        // 1. Fetch manual events
        const manualEvents = await fetchWrapper('/calendar-events');

        // 2. Fetch projects
        const projects = await fetchWrapper('/projects');

        // 3. Fetch tasks
        const tasks = await fetchWrapper('/tasks');

        // 4. Generate project date events
        const projectEvents = projects.flatMap(project => {
          const arr = [];
          if (project.dates?.startDate) arr.push({
            title: `${project.title} Start`,
            date: project.dates.startDate,
            type: 'PROJECT_START',
            color: EVENT_TYPE_COLORS.PROJECT_START
          });
          if (project.dates?.targetDate) arr.push({
            title: `${project.title} Target End`,
            date: project.dates.targetDate,
            type: 'PROJECT_END',
            color: EVENT_TYPE_COLORS.PROJECT_END
          });
          if (project.dates?.actualCompletion) arr.push({
            title: `${project.title} Completed`,
            date: project.dates.actualCompletion,
            type: 'PROJECT_COMPLETION',
            color: EVENT_TYPE_COLORS.PROJECT_COMPLETION
          });
          return arr;
        });

        // 5. Generate task date events
        const taskEvents = tasks.flatMap(task => {
          const arr = [];
          if (task.startDate) arr.push({
            title: `${task.title} Start`,
            date: task.startDate,
            type: 'TASK_START',
            color: EVENT_TYPE_COLORS.TASK_START
          });
          if (task.targetDate) arr.push({
            title: `${task.title} Target End`,
            date: task.targetDate,
            type: 'TASK_END',
            color: EVENT_TYPE_COLORS.TASK_END
          });
          if (task.actualCompletion) arr.push({
            title: `${task.title} Completed`,
            date: task.actualCompletion,
            type: 'TASK_COMPLETION',
            color: EVENT_TYPE_COLORS.TASK_COMPLETION
          });
          return arr;
        });

        // 6. Assign color to manual events if not set
        const manualEventsWithColor = manualEvents.map(ev => ({
          ...ev,
          color: ev.color || EVENT_TYPE_COLORS[ev.type] || EVENT_TYPE_COLORS.DEFAULT
        }));

        // 7. Combine all events
        setEvents([
          ...manualEventsWithColor,
          ...projectEvents,
          ...taskEvents
        ]);
      } catch (err) {
        console.error('Fetch failed, using dummy data:', err);
        setEvents([
          { title: 'Team Sync', alert: true, date: new Date(), color: EVENT_TYPE_COLORS.MEETING },
          { title: 'Demo Day', alert: false, date: new Date(new Date().setDate(new Date().getDate() + 3)), color: EVENT_TYPE_COLORS.APPOINTMENT },
        ]);
      }
    };
    fetchAllEvents();
  }, []);

  const changeMonth = (offset) => setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + offset)));
  const handleMonthChange = (e) => setCurrentMonth(setMonth(currentMonth, parseInt(e.target.value)));
  const handleYearChange = (e) => setCurrentMonth(setYear(currentMonth, parseInt(e.target.value)));

  const handleDayClick = (day) => {
    setSelectedDate(day);
    setShowModal(true);
  };

  const handleAddEvent = async () => {
    const { title, type, description } = formData;
    const color = EVENT_TYPE_COLORS[type] || EVENT_TYPE_COLORS.DEFAULT;
    const newEvent = {
      title,
      type,
      date: selectedDate,
      color,
      ...(description && { description })
    };
    setEvents((prev) => [...prev, newEvent]);
    setFormData({ title: '', type: 'MEETING', description: '' });
    setShowModal(false);

    try {
      await fetchWrapper('/calendar-events', {
        method: 'POST',
        body: JSON.stringify(newEvent)
      });
    } catch (err) {
      console.error('POST failed:', err);
    }
  };

  const handleDeleteEvent = async (eventToDelete) => {
    const filtered = events.filter(
      (e) => !(isSameDay(new Date(e.date), selectedDate) && e.title === eventToDelete.title)
    );
    setEvents(filtered);

    try {
      await fetchWrapper('/calendar-events', {
        method: 'DELETE',
        body: JSON.stringify(eventToDelete)
      });
    } catch (err) {
      console.error('DELETE failed:', err);
    }
  };

  const renderHeader = () => (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-2">
      <h1 className="text-3xl font-bold">📅 Calendar</h1>
      <div className="flex items-center gap-2">
        <button onClick={() => changeMonth(-1)} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700">←</button>
        <select value={currentMonth.getMonth()} onChange={handleMonthChange} className="bg-zinc-900 border border-zinc-700 p-2 rounded text-white">
          {months.map((month, idx) => <option key={idx} value={idx}>{month}</option>)}
        </select>
        <select value={currentMonth.getFullYear()} onChange={handleYearChange} className="bg-zinc-900 border border-zinc-700 p-2 rounded text-white">
          {years.map((year) => <option key={year} value={year}>{year}</option>)}
        </select>
        <button onClick={() => changeMonth(1)} className="px-3 py-1 bg-zinc-800 border border-zinc-700 rounded hover:bg-zinc-700">→</button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return (
      <div className="grid grid-cols-7 mb-2 text-center text-zinc-400 font-medium">
        {days.map((day) => <div key={day}>{day}</div>)}
      </div>
    );
  };

  const renderCells = () => {
    const startDate = startOfWeek(startOfMonth(currentMonth));
    const endDate = endOfWeek(endOfMonth(currentMonth));
    let day = startDate;
    const rows = [];

    while (day <= endDate) {
      const days = Array.from({ length: 7 }, () => {
        const cloneDay = day;
        const isToday = isSameDay(day, new Date());
        const isOtherMonth = !isSameMonth(day, currentMonth);
        const dayEvents = events.filter(e => isSameDay(new Date(e.date), cloneDay));
        const formatted = format(day, 'd');

        const cell = (
          <div
            key={cloneDay}
            onClick={() => handleDayClick(cloneDay)}
            className={`border border-zinc-700 p-2 rounded-xl cursor-pointer hover:bg-zinc-800 transition-colors h-28 flex flex-col ${
              isOtherMonth ? 'text-zinc-500' : 'text-white'
            } ${isToday ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="text-sm font-medium">{formatted}</div>
            <div className="text-xs mt-1 space-y-1 overflow-auto">
              {dayEvents.map((event, i) => (
                <div
                  key={i}
                  style={{ backgroundColor: event.color, color: '#fff' }}
                  className="flex items-center justify-between gap-1 px-1 py-0.5 text-xs rounded truncate"
                >
                  <span className="truncate">{event.title} <span className="ml-2 text-xs text-zinc-400">({event.type})</span></span>
                </div>
              ))}
            </div>
          </div>
        );

        day = addDays(day, 1);
        return cell;
      });

      rows.push(<div key={day} className="grid grid-cols-7 gap-2">{days}</div>);
    }

    return <div className="space-y-2">{rows}</div>;
  };

  const selectedDayEvents = events.filter(e => isSameDay(new Date(e.date), selectedDate));

  return (
    <div className="p-6">
      {renderHeader()}
      <p className="text-zinc-400 mb-4">Click a day to add/view events. 🎯</p>
      {renderDays()}
      {renderCells()}

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
          >
            <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-700 w-[22rem] space-y-4 shadow-xl backdrop-blur">
              <h2 className="text-xl font-bold">Add Event – {format(selectedDate, 'MMMM d, yyyy')}</h2>

              <input
                type="text"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-600"
                placeholder="Event Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />

                <input
                type="text"
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-600 mt-2"
                placeholder="Description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />

              <select
                className="w-full p-2 rounded bg-zinc-800 border border-zinc-600 mt-2 text-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="MEETING">Meeting</option>
                <option value="APPOINTMENT">Appointment</option>
              </select>

              {selectedDayEvents.length > 0 && (
                <div className="text-sm text-zinc-400">
                  <p className="mb-1">Existing Events:</p>
                  <ul className="space-y-1">
                    {selectedDayEvents.map((e, i) => (
                      <li key={i} className="flex justify-between items-center text-white text-xs bg-zinc-800 p-2 rounded">
                        <span>{e.title} <span className="ml-2 text-xs text-zinc-400">({e.type})</span></span>
                        <button
                          onClick={() => handleDeleteEvent(e)}
                          className="text-red-400 hover:underline text-xs"
                        >
                          Delete
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <button onClick={() => setShowModal(false)} className="px-3 py-1 bg-zinc-700 rounded hover:bg-zinc-600">Cancel</button>
                <button onClick={handleAddEvent} className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-500">Save</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Calendar;