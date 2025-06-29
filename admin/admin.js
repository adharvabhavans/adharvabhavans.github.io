// API Configuration
const API_BASE_URL = 'http://127.0.0.1:8000';
const STORAGE_KEY = 'adharva_admin_api_key';

document.addEventListener('DOMContentLoaded', function() {
  const storedApiKey = localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);

  if (storedApiKey) {
    document.getElementById('apiKeySetup').style.display = 'none';
    document.getElementById('statusForm').style.display = 'block';
    refreshStatuses();
  } else {
    document.getElementById('apiKeySetup').style.display = 'block';
    document.getElementById('statusForm').style.display = 'none';
  }
});

function saveApiKey() {
  const apiKey = document.getElementById('initialApiKey').value;
  const rememberKey = document.getElementById('rememberKey').checked;

  if (!apiKey) {
    logResponse('error', 'Please enter an API key');
    return;
  }

  if (rememberKey) {
    localStorage.setItem(STORAGE_KEY, apiKey);
    logResponse('success', 'API key saved to browser storage');
  } else {
    sessionStorage.setItem(STORAGE_KEY, apiKey);
    logResponse('success', 'API key saved for this session only');
  }

  document.getElementById('apiKeySetup').style.display = 'none';
  document.getElementById('statusForm').style.display = 'block';
  refreshStatuses();
}

function changeApiKey() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);

  document.getElementById('apiKeySetup').style.display = 'block';
  document.getElementById('statusForm').style.display = 'none';
  document.getElementById('initialApiKey').value = '';
  document.getElementById('rememberKey').checked = false;

  logResponse('info', 'API key cleared. Please enter a new one.');
}

function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY);
}

document.getElementById('updateForm').addEventListener('submit', async function(e) {
  e.preventDefault();

  const eventName = document.getElementById('eventName').value;
  const status = document.getElementById('status').value;
  const apiKey = getStoredApiKey();

  if (!eventName || !status) {
    logResponse('error', 'Please fill in all fields');
    return;
  }

  if (!apiKey) {
    logResponse('error', 'No API key found. Please set up your API key.');
    return;
  }

  const submitBtn = document.querySelector('button[type=\"submit\"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class=\"fas fa-spinner fa-spin mr-2\"></i>Updating...';
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/v3/update/${eventName}/${status}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (response.ok) {
      logResponse('success', `Successfully updated ${eventName} to ${status}`);
      refreshStatuses();
      document.getElementById('eventName').value = '';
      document.getElementById('status').value = '';
    } else {
      logResponse('error', `Failed to update: ${result.message || response.statusText}`);
    }
  } catch (error) {
    logResponse('error', `Network error: ${error.message}`);
  } finally {
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
});

async function refreshStatuses() {
  const statusesContainer = document.getElementById('currentStatuses');
  statusesContainer.innerHTML = '<div class=\"text-center text-gray-400\"><i class=\"fas fa-spinner fa-spin text-2xl mb-2\"></i><p>Loading...</p></div>';

  try {
    const response = await fetch(`${API_BASE_URL}/api/v3/get/events`);
    const events = await response.json();

    if (response.ok) {
      let statusesHTML = '';
      events.forEach(event => {
        const statusColor = getStatusColor(event.status);
        statusesHTML += `
          <div class=\"flex items-center justify-between p-4 bg-gray-700 rounded-lg\">
            <div class=\"flex items-center gap-3\">
              <i class=\"fas fa-circle text-${statusColor}\"></i>
              <span class=\"font-bold\">${event.name}</span>
            </div>
            <span class=\"text-${statusColor} font-semibold\">${event.status}</span>
          </div>
        `;
      });
      statusesContainer.innerHTML = statusesHTML;
    } else {
      statusesContainer.innerHTML = '<div class=\"text-center text-red-400\"><i class=\"fas fa-exclamation-triangle text-2xl mb-2\"></i><p>Failed to load statuses</p></div>';
    }
  } catch (error) {
    statusesContainer.innerHTML = '<div class=\"text-center text-red-400\"><i class=\"fas fa-exclamation-triangle text-2xl mb-2\"></i><p>Network error</p></div>';
  }
}

function getStatusColor(status) {
  const colors = {
    'Started': 'green-400',
    'Ended': 'green-500',
    'Ongoing': 'yellow-400',
    'Soon': 'blue-400',
    'Delayed': 'orange-400',
    'Round1': 'blue-400',
    'Round2': 'blue-400',
    'Round3': 'blue-400',
    'Round4': 'blue-400'
  };
  return colors[status] || 'gray-400';
}

function logResponse(type, message) {
  const logContainer = document.getElementById('responseLog');
  const timestamp = new Date().toLocaleTimeString();

  let icon, color;
  switch(type) {
    case 'success':
      icon = 'fas fa-check-circle';
      color = 'text-green-400';
      break;
    case 'error':
      icon = 'fas fa-exclamation-circle';
      color = 'text-red-400';
      break;
    case 'info':
      icon = 'fas fa-info-circle';
      color = 'text-blue-400';
      break;
    default:
      icon = 'fas fa-info-circle';
      color = 'text-gray-400';
  }

  const logEntry = document.createElement('div');
  logEntry.className = 'flex items-center gap-2 mb-2 text-sm';
  logEntry.innerHTML = `
    <i class=\"${icon} ${color}\"></i>
    <span class=\"text-gray-300\">[${timestamp}]</span>
    <span class=\"text-white\">${message}</span>
  `;

  logContainer.appendChild(logEntry);
  logContainer.scrollTop = logContainer.scrollHeight;
}

function clearLog() {
  document.getElementById('responseLog').innerHTML = '<div class=\"text-gray-400 text-sm\">Log cleared...</div>';
}

// Add grid effect for gray sections - desktop only (match main site)
if ('ontouchstart' in window === false) {
  document.addEventListener('mousemove', (e) => {
    document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
    document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    // Update section positions for grid effect
    document.querySelectorAll('.bg-gray-900').forEach(section => {
      const rect = section.getBoundingClientRect();
      section.style.setProperty('--section-x', `${rect.left}px`);
      section.style.setProperty('--section-y', `${rect.top}px`);
    });
  });
}
