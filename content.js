// Content script for applying colors to GCP Console banner

let projectColors = {};
let currentProjectId = null;
let bannerElement = null;

// Initialize
function init() {
  loadColors();
  findBanner();
  findProjectId();
  applyColor();
  
  // Set up observers
  setupObservers();
  
  // Listen for storage changes
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === 'sync' && changes.projectColors) {
      projectColors = changes.projectColors.newValue || {};
      applyColor();
    }
  });
}

// Load color rules from storage
function loadColors() {
  chrome.storage.sync.get(['projectColors'], (result) => {
    projectColors = result.projectColors || {};
    applyColor();
  });
}

// Find the banner element
function findBanner() {
  const banner = document.querySelector('div[role="banner"].cfc-platform-bar-container');
  if (banner) {
    bannerElement = banner;
  }
}

// Find the current project ID
function findProjectId() {
  const projectElement = document.querySelector('.cfc-switcher-button-label-text');
  if (projectElement) {
    const projectId = projectElement.textContent.trim();
    if (projectId && projectId !== currentProjectId) {
      currentProjectId = projectId;
      applyColor();
    }
  }
}

// Apply color to banner based on current project
function applyColor() {
  if (!bannerElement) {
    findBanner();
  }
  
  if (!bannerElement) {
    return;
  }
  
  if (!currentProjectId) {
    findProjectId();
  }
  
  if (currentProjectId && projectColors[currentProjectId]) {
    bannerElement.style.backgroundColor = projectColors[currentProjectId];
  } else {
    // Reset to default if no rule exists
    bannerElement.style.backgroundColor = '';
  }
}

// Set up MutationObserver to watch for DOM changes
function setupObservers() {
  // Observe the document body for changes (GCP Console is a SPA)
  const observer = new MutationObserver((mutations) => {
    let shouldCheck = false;
    
    mutations.forEach((mutation) => {
      // Check if nodes were added or text content changed
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        shouldCheck = true;
      }
    });
    
    if (shouldCheck) {
      // Debounce the check
      setTimeout(() => {
        const oldProjectId = currentProjectId;
        findBanner();
        findProjectId();
        
        // If project changed, apply new color
        if (oldProjectId !== currentProjectId) {
          applyColor();
        }
      }, 100);
    }
  });
  
  // Start observing
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true
  });
  
  // Also observe the specific project switcher area more closely
  const projectSwitcherObserver = new MutationObserver(() => {
    setTimeout(() => {
      findProjectId();
      applyColor();
    }, 100);
  });
  
  // Try to find and observe the project switcher container
  const findAndObserveSwitcher = () => {
    const switcher = document.querySelector('.pcc-purview-switcher-container');
    if (switcher) {
      projectSwitcherObserver.observe(switcher, {
        childList: true,
        subtree: true,
        characterData: true
      });
    } else {
      // Retry if not found yet
      setTimeout(findAndObserveSwitcher, 500);
    }
  };
  
  findAndObserveSwitcher();
}

// Run initialization when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

