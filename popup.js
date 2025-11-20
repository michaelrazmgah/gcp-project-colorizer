// Popup script for managing project color rules

document.addEventListener('DOMContentLoaded', () => {
  const projectIdInput = document.getElementById('projectId');
  const colorPicker = document.getElementById('colorPicker');
  const saveBtn = document.getElementById('saveBtn');
  const rulesContainer = document.getElementById('rulesContainer');

  // Load and display existing rules
  function loadRules() {
    chrome.storage.sync.get(['projectColors'], (result) => {
      const projectColors = result.projectColors || {};
      displayRules(projectColors);
    });
  }

  // Display rules in the UI
  function displayRules(projectColors) {
    const projectIds = Object.keys(projectColors);
    
    if (projectIds.length === 0) {
      rulesContainer.innerHTML = '<div class="empty-state">No rules saved yet</div>';
      return;
    }

    rulesContainer.innerHTML = projectIds.map(projectId => {
      const color = projectColors[projectId];
      return `
        <div class="rule-item">
          <div class="rule-info">
            <span class="rule-project">${escapeHtml(projectId)}</span>
            <div class="rule-color" style="background-color: ${color}"></div>
          </div>
          <button class="delete-btn" data-project="${escapeHtml(projectId)}">Delete</button>
        </div>
      `;
    }).join('');

    // Add delete button listeners
    rulesContainer.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const projectId = btn.getAttribute('data-project');
        deleteRule(projectId);
      });
    });
  }

  // Save a new rule
  function saveRule() {
    const projectId = projectIdInput.value.trim();
    const color = colorPicker.value;

    if (!projectId) {
      alert('Please enter a project ID');
      return;
    }

    chrome.storage.sync.get(['projectColors'], (result) => {
      const projectColors = result.projectColors || {};
      projectColors[projectId] = color;
      
      chrome.storage.sync.set({ projectColors }, () => {
        projectIdInput.value = '';
        colorPicker.value = '#ffffff';
        loadRules();
        // Content script will automatically update via storage.onChanged listener
      });
    });
  }

  // Delete a rule
  function deleteRule(projectId) {
    chrome.storage.sync.get(['projectColors'], (result) => {
      const projectColors = result.projectColors || {};
      delete projectColors[projectId];
      
      chrome.storage.sync.set({ projectColors }, () => {
        loadRules();
        // Content script will automatically update via storage.onChanged listener
      });
    });
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Event listeners
  saveBtn.addEventListener('click', saveRule);
  
  projectIdInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      saveRule();
    }
  });

  // Load rules on popup open
  loadRules();
});

