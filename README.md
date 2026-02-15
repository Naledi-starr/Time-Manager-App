# Time Bestie - Time Manager App

[![Live Demo](https://time-manager-app-ten.vercel.app/)]

A modern, feature-rich personal time tracking application with a beautiful dark-themed UI. Track your daily and weekly tasks, manage priorities, and monitor your productivity with real-time timers.

![Time Bestie](image1.png)

## Features

###  Task Management
- **Create Tasks** - Add tasks with name, type (daily/weekly), priority, category, and description
- **Edit Tasks** - Modify existing task details
- **Delete Tasks** - Remove tasks with confirmation
- **Task Categories** - Organize tasks by custom categories

###  Time Tracking
- **Start/Stop Timers** - Track time spent on each task in real-time
- **Automatic Time Calculation** - Cumulative time tracking across all tasks
- **Visual Feedback** - Active timers have pulsing animation effects

###  Dashboard Overview
- **Total Tasks** - Count of all tracked tasks
- **Total Time** - Cumulative time across all tasks (HH:MM:SS)
- **Active Timers** - Number of currently running timers
- **Productivity Score** - Tasks completed metric

###  UI/UX
- **Dark Theme** - Beautiful indigo/purple color scheme
- **Responsive Design** - Works on desktop and mobile devices
- **Tab Navigation** - Switch between Daily and Weekly tasks
- **Priority Indicators** - Visual color coding (High/Medium/Low)
- **Smooth Animations** - Floating orbs, hover effects, transitions
- **Glassmorphism** - Modern translucent card designs

###  Data Persistence
- **Local Storage** - All tasks saved to browser localStorage
- **Auto-save** - Changes saved automatically

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Structure |
| CSS3 | Styling & Animations |
| JavaScript (Vanilla) | Functionality |
| Tailwind CSS | Utility classes (via CDN) |
| Google Fonts | Typography (Poppins, Sora) |

## File Structure

```
Time-Manager-App/
├── index.html      # Main HTML structure
├── styles.css      # Custom CSS styles
├── script.js       # JavaScript functionality
└── image1.png      # App icon
```

## Getting Started

### Option 1: Open Directly
Simply open `index.html` in any modern web browser:
```bash
# Using a file path
open index.html

# Or using Python's HTTP server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

### Option 2: Local Development Server
```bash
# Python 3
python3 -m http.server 8080

# Node.js
npx serve .

# PHP
php -S localhost:8000
```

## How to Use

### Creating a Task
1. Fill in the task name (required)
2. Select task type: Daily or Weekly
3. Choose priority: Low, Medium, or High
4. Optionally add a category and description
5. Click "Add Task"

### Tracking Time
1. Find the task you want to track
2. Click the green **Start** button
3. The timer will begin counting up in real-time
4. Click **Stop** to pause and save the time

### Editing a Task
1. Click the **Edit** button on any task
2. The form will populate with the task's details
3. Modify any fields
4. Click **Update Task** to save changes

### Deleting a Task
1. Click the 🗑️ delete button
2. Click **Sure?** to confirm deletion
3. The task will be removed

## Key Functions

| Function | Description |
|----------|-------------|
| `startTimer(taskId)` | Starts tracking time for a task |
| `stopTimer(taskId)` | Stops timer and saves elapsed time |
| `renderTasks()` | Renders all tasks to the UI |
| `saveTasks()` | Saves tasks to localStorage |
| `handleFormSubmit()` | Processes new task creation/editing |
| `switchTab(tab)` | Toggles between daily/weekly views |

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Data Storage

Tasks are stored in the browser's localStorage with the key `tmpro_tasks`. The data structure:

```json
[
  {
    "__backendId": "1704067200000",
    "name": "Project Task",
    "description": "Task description",
    "type": "daily",
    "priority": "high",
    "category": "Development",
    "timeSpent": 3600,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

## Customization

### Colors
The app uses Tailwind CSS with custom CSS variables. Primary colors can be modified in:
- `styles.css` - Custom CSS properties
- Tailwind CDN config in `index.html`

### Fonts
- **Poppins** - Main font family
- **Sora** - Secondary font for headings
- Both loaded from Google Fonts

## License

MIT License - Feel free to use and modify for your own projects.

---

Built with ❤️ using vanilla JavaScript and Tailwind CSS by Naledi M Motswiane

