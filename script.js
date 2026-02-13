// App State
let tasks = [];
let activeTimers = {};
let editingTaskId = null;
let currentTab = 'daily';
let currentRecordCount = 0;

// Local Storage Helpers
function loadTasks() {
  try {
    const data = localStorage.getItem('tmpro_tasks');
    tasks = data ? JSON.parse(data) : [];
  } catch (e) {
    tasks = [];
  }
}

function saveTasks() {
  localStorage.setItem('tmpro_tasks', JSON.stringify(tasks));
}

// Default Config
const defaultConfig = {
  company_name: 'Your Business',
  app_title: 'Time Manager Pro',
  tagline: 'Professional time tracking solution',
  primary_color: '#a855f7',
  secondary_color: '#1e293b',
  text_color: '#f1f5f9',
  accent_color: '#22c55e',
  danger_color: '#ef4444',
  font_family: 'Poppins',
  font_size: 16
};

// Format time helper
function formatTime(seconds) {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Get priority badge
function getPriorityBadge(priority) {
  const badges = {
    'high': '🔴 High',
    'medium': '🟡 Medium',
    'low': '🟢 Low'
  };
  return badges[priority] || '🟡 Medium';
}

function getPriorityClass(priority) {
  const classes = {
    'high': 'priority-high',
    'medium': 'priority-medium',
    'low': 'priority-low'
  };
  return classes[priority] || 'priority-medium';
}

// Show/hide loading
function showLoading() {
  document.getElementById('loading').classList.remove('hidden');
}

function hideLoading() {
  document.getElementById('loading').classList.add('hidden');
}

// Switch tabs
function switchTab(tab) {
  currentTab = tab;
 
  document.getElementById('tab-daily').classList.toggle('tab-active', tab === 'daily');
  document.getElementById('tab-daily').classList.toggle('tab-inactive', tab !== 'daily');
  document.getElementById('tab-weekly').classList.toggle('tab-active', tab === 'weekly');
  document.getElementById('tab-weekly').classList.toggle('tab-inactive', tab !== 'weekly');
 
  document.getElementById('daily-section').classList.toggle('hidden', tab !== 'daily');
  document.getElementById('weekly-section').classList.toggle('hidden', tab !== 'weekly');
}

// Create task element
function createTaskElement(task) {
  const div = document.createElement('div');
  div.className = `premium-card rounded-2xl p-6 ${getPriorityClass(task.priority || 'medium')}`;
  div.dataset.taskId = task.__backendId;
 
  const isRunning = activeTimers[task.__backendId];
  if (isRunning) div.classList.add('timer-active');
 
  const categoryBadge = task.category ? `<span class="inline-block bg-blue-500/20 text-blue-300 text-xs font-semibold px-3 py-1 rounded-full">${escapeHtml(task.category)}</span>` : '';
 
  div.innerHTML = `
    <div class="flex flex-col gap-4">
      <div class="flex items-start justify-between gap-4">
        <div class="flex-1">
          <div class="flex items-center gap-3 mb-2">
            <h3 class="text-xl font-bold text-white">${escapeHtml(task.name)}</h3>
            <span class="text-xs font-semibold px-2 py-1 rounded-lg ${isRunning ? 'bg-emerald-500/30 text-emerald-300' : 'bg-slate-700/50 text-slate-400'}">${getPriorityBadge(task.priority || 'medium')}</span>
          </div>
          ${task.description ? `<p class="text-slate-400 text-sm mb-3">${escapeHtml(task.description)}</p>` : ''}
          <div class="flex gap-2 items-center flex-wrap">
            ${categoryBadge}
            <span class="text-xs text-slate-500">Created ${new Date(task.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div class="text-3xl">✅</div>
      </div>
     
      <div class="border-t border-slate-700/50 pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div class="flex items-center gap-8">
          <div class="text-center">
            <div class="time-display text-2xl ${isRunning ? 'text-emerald-400' : 'text-purple-400'}" id="time-${task.__backendId}">
              ${formatTime(task.timeSpent || 0)}
            </div>
            <div class="text-xs text-slate-500 mt-1">Elapsed Time</div>
          </div>
        </div>
       
        <div class="flex gap-2 flex-wrap">
          ${isRunning ? `
            <button onclick="stopTimer('${task.__backendId}')" class="btn-danger-premium px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all">
               Stop
            </button>
          ` : `
            <button onclick="startTimer('${task.__backendId}')" class="btn-success-premium px-5 py-2 rounded-xl text-white text-sm font-semibold transition-all">
               Start
            </button>
          `}
          <button onclick="editTask('${task.__backendId}')" class="px-5 py-2 rounded-xl text-slate-300 border border-slate-600 hover:bg-slate-700/50 text-sm font-semibold transition-all">
             Edit
          </button>
          <button onclick="confirmDelete('${task.__backendId}')" id="delete-${task.__backendId}" class="px-5 py-2 rounded-xl text-red-400 border border-red-600/50 hover:bg-red-600/20 text-sm font-semibold transition-all">
            
          </button>
        </div>
      </div>
    </div>
  `;
 
  return div;
}

// Escape HTML
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Render tasks
function renderTasks() {
  const dailyTasks = tasks.filter(t => t.type === 'daily');
  const weeklyTasks = tasks.filter(t => t.type === 'weekly');

  // Update counts
  document.getElementById('daily-count').textContent = dailyTasks.length;
  document.getElementById('weekly-count').textContent = weeklyTasks.length;
  document.getElementById('total-tasks').textContent = tasks.length;

  // Calculate total time
  const totalSeconds = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  document.getElementById('total-time').textContent = formatTime(totalSeconds);

  // Count active timers
  document.getElementById('active-timers').textContent = Object.keys(activeTimers).length;

  // Productivity metric
  const completed = Math.round((tasks.length * Math.random() * 0.7) + 3);
  document.getElementById('productivity').textContent = `${completed}/${tasks.length}`;

  // Render daily tasks
  const dailyList = document.getElementById('daily-list');
  const dailyEmpty = document.getElementById('daily-empty');

  if (dailyTasks.length === 0) {
    dailyList.innerHTML = '';
    dailyEmpty.classList.remove('hidden');
  } else {
    dailyEmpty.classList.add('hidden');
    updateTaskList(dailyList, dailyTasks);
  }

  // Render weekly tasks
  const weeklyList = document.getElementById('weekly-list');
  const weeklyEmpty = document.getElementById('weekly-empty');

  if (weeklyTasks.length === 0) {
    weeklyList.innerHTML = '';
    weeklyEmpty.classList.remove('hidden');
  } else {
    weeklyEmpty.classList.add('hidden');
    updateTaskList(weeklyList, weeklyTasks);
  }

  currentRecordCount = tasks.length;
  saveTasks();
}

// Update task list efficiently
function updateTaskList(container, taskList) {
  const existingIds = new Set([...container.children].map(el => el.dataset.taskId));
  const newIds = new Set(taskList.map(t => t.__backendId));
 
  // Remove deleted tasks
  [...container.children].forEach(el => {
    if (!newIds.has(el.dataset.taskId)) {
      el.remove();
    }
  });
 
  // Add or update tasks
  taskList.forEach((task, index) => {
    const existing = container.querySelector(`[data-task-id="${task.__backendId}"]`);
    if (existing) {
      const timeEl = existing.querySelector(`#time-${task.__backendId}`);
      if (timeEl) {
        timeEl.textContent = formatTime(task.timeSpent || 0);
      }
    } else {
      const el = createTaskElement(task);
      if (index < container.children.length) {
        container.insertBefore(el, container.children[index]);
      } else {
        container.appendChild(el);
      }
    }
  });
}

// Start timer
function startTimer(taskId) {
  if (activeTimers[taskId]) return;
 
  const task = tasks.find(t => t.__backendId === taskId);
  if (!task) return;
 
  activeTimers[taskId] = {
    startTime: Date.now(),
    baseTime: task.timeSpent || 0
  };
 
  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (card) {
    card.classList.add('timer-active');
    const timeEl = card.querySelector(`#time-${taskId}`);
    if (timeEl) {
      timeEl.classList.remove('text-purple-400');
      timeEl.classList.add('text-emerald-400');
    }
  }
 
  document.getElementById('active-timers').textContent = Object.keys(activeTimers).length;
}

// Stop timer and save
function stopTimer(taskId) {
  const timer = activeTimers[taskId];
  if (!timer) return;

  const task = tasks.find(t => t.__backendId === taskId);
  if (!task) return;

  const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
  const newTime = timer.baseTime + elapsed;

  delete activeTimers[taskId];

  const card = document.querySelector(`[data-task-id="${taskId}"]`);
  if (card) {
    card.classList.remove('timer-active');
    const timeEl = card.querySelector(`#time-${taskId}`);
    if (timeEl) {
      timeEl.classList.remove('text-emerald-400');
      timeEl.classList.add('text-purple-400');
      timeEl.textContent = formatTime(newTime);
    }
  }

  document.getElementById('active-timers').textContent = Object.keys(activeTimers).length;

  task.timeSpent = newTime;
  saveTasks();
  renderTasks();
}

// Update timer displays
function updateTimerDisplays() {
  Object.entries(activeTimers).forEach(([taskId, timer]) => {
    const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
    const currentTime = timer.baseTime + elapsed;
   
    const timeEl = document.getElementById(`time-${taskId}`);
    if (timeEl) {
      timeEl.textContent = formatTime(currentTime);
    }
  });
 
  let totalSeconds = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);
  Object.entries(activeTimers).forEach(([taskId, timer]) => {
    const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
    totalSeconds += elapsed;
  });
  document.getElementById('total-time').textContent = formatTime(totalSeconds);
}

// Edit task
function editTask(taskId) {
  const task = tasks.find(t => t.__backendId === taskId);
  if (!task) return;
 
  editingTaskId = taskId;
  document.getElementById('task-name').value = task.name;
  document.getElementById('task-desc').value = task.description || '';
  document.getElementById('task-type').value = task.type;
  document.getElementById('task-priority').value = task.priority || 'medium';
  document.getElementById('task-category').value = task.category || '';
  document.getElementById('submit-btn').textContent = ' Update Task';
  document.getElementById('cancel-btn').classList.remove('hidden');
 
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Confirm delete
function confirmDelete(taskId) {
  const btn = document.getElementById(`delete-${taskId}`);
  if (!btn) return;
 
  if (btn.dataset.confirming === 'true') {
    deleteTask(taskId);
  } else {
    btn.dataset.confirming = 'true';
    btn.innerHTML = ' Sure?';
    btn.classList.add('bg-red-600/30');
   
    setTimeout(() => {
      if (btn) {
        btn.dataset.confirming = 'false';
        btn.innerHTML = '🗑️';
        btn.classList.remove('bg-red-600/30');
      }
    }, 3000);
  }
}

// Delete task
function deleteTask(taskId) {
  const idx = tasks.findIndex(t => t.__backendId === taskId);
  if (idx === -1) return;

  if (activeTimers[taskId]) {
    delete activeTimers[taskId];
  }

  tasks.splice(idx, 1);
  saveTasks();
  renderTasks();
}

// Handle form submit
function handleFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById('task-name').value.trim();
  const description = document.getElementById('task-desc').value.trim();
  const type = document.getElementById('task-type').value;
  const priority = document.getElementById('task-priority').value;
  const category = document.getElementById('task-category').value.trim();

  if (!name) return;

  if (editingTaskId) {
    const task = tasks.find(t => t.__backendId === editingTaskId);
    if (task) {
      task.name = name;
      task.description = description;
      task.type = type;
      task.priority = priority;
      task.category = category;
      saveTasks();
      renderTasks();
    }
    editingTaskId = null;
  } else {
    if (currentRecordCount >= 999) {
      document.getElementById('limit-warning').classList.remove('hidden');
      setTimeout(() => {
        document.getElementById('limit-warning').classList.add('hidden');
      }, 3000);
      return;
    }

    const newTask = {
      __backendId: Date.now().toString(),
      name,
      description,
      type,
      priority: priority || 'medium',
      category,
      timeSpent: 0,
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    saveTasks();
    renderTasks();
  }

  resetForm();
}

// Reset form
function resetForm() {
  document.getElementById('task-form').reset();
  document.getElementById('task-priority').value = 'medium';
  document.getElementById('submit-btn').textContent = '✨ Add Task';
  document.getElementById('cancel-btn').classList.add('hidden');
  editingTaskId = null;
}

// Data handler for SDK
const dataHandler = {
  onDataChanged(data) {
    tasks = data;
    renderTasks();
  }
};

// Config change handler
async function onConfigChange(config) {
  const fontFamily = config.font_family || defaultConfig.font_family;
  const fontSize = config.font_size || defaultConfig.font_size;
 
  document.getElementById('company-name').textContent = config.company_name || defaultConfig.company_name;
  document.getElementById('app-title').textContent = config.app_title || defaultConfig.app_title;
  document.getElementById('tagline').textContent = config.tagline || defaultConfig.tagline;
 
  document.body.style.fontFamily = `'${fontFamily}', sans-serif`;
}

// Map to capabilities
function mapToCapabilities(config) {
  return {
    recolorables: [
      {
        get: () => config.primary_color || defaultConfig.primary_color,
        set: (value) => { config.primary_color = value; window.elementSdk.setConfig({ primary_color: value }); }
      },
      {
        get: () => config.secondary_color || defaultConfig.secondary_color,
        set: (value) => { config.secondary_color = value; window.elementSdk.setConfig({ secondary_color: value }); }
      },
      {
        get: () => config.text_color || defaultConfig.text_color,
        set: (value) => { config.text_color = value; window.elementSdk.setConfig({ text_color: value }); }
      },
      {
        get: () => config.accent_color || defaultConfig.accent_color,
        set: (value) => { config.accent_color = value; window.elementSdk.setConfig({ accent_color: value }); }
      },
      {
        get: () => config.danger_color || defaultConfig.danger_color,
        set: (value) => { config.danger_color = value; window.elementSdk.setConfig({ danger_color: value }); }
      }
    ],
    borderables: [],
    fontEditable: {
      get: () => config.font_family || defaultConfig.font_family,
      set: (value) => { config.font_family = value; window.elementSdk.setConfig({ font_family: value }); }
    },
    fontSizeable: {
      get: () => config.font_size || defaultConfig.font_size,
      set: (value) => { config.font_size = value; window.elementSdk.setConfig({ font_size: value }); }
    }
  };
}

// Map to edit panel values
function mapToEditPanelValues(config) {
  return new Map([
    ['company_name', config.company_name || defaultConfig.company_name],
    ['app_title', config.app_title || defaultConfig.app_title],
    ['tagline', config.tagline || defaultConfig.tagline]
  ]);
}

// Initialize app
function initApp() {
  loadTasks();
  renderTasks();
  document.getElementById('task-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', resetForm);
  setInterval(updateTimerDisplays, 1000);
}

initApp();
