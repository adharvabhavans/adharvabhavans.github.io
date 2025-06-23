// Modal functions
function showEventModal(title, content) {
  const modal = document.getElementById('infoModal');
  modal.style.display = 'block';
  document.getElementById('modalTitle').textContent = title;
  // Format as bullet points if content contains '•' or multiple lines
  let formatted = '';
  if (content.includes('•') || content.includes('\n')) {
    // Split by either '•' or newline, filter out empty, trim
    const items = content
      .split(/•|\n/)
      .map(i => i.trim())
      .filter(i => i.length > 0);
    formatted = '<ul style="padding-left:1.2em;list-style-type:disc;">' +
      items.map(i => `<li>${i}</li>`).join('') +
      '</ul>';
  } else {
    formatted = `<p>${content}</p>`;
  }
  document.getElementById('modalContent').innerHTML = formatted;
  setTimeout(() => {
    modal.classList.add('active');
    // Focus trap: focus close button
    document.querySelector('.modal-close').focus();
  }, 10);
}

function showScheduleModal(time, title, content) {
  const modal = document.getElementById('infoModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalContent = document.getElementById('modalContent');
  modalTitle.textContent = title;
  // Format content with icons and better structure
  modalContent.innerHTML = `
    <div class="schedule-info">
      <div class="info-item">
        <i class="fas fa-clock info-icon"></i>
        <span class="info-text">${time}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-map-marker-alt info-icon"></i>
        <span class="info-text">${title}</span>
      </div>
      <div class="info-item">
        <i class="fas fa-info-circle info-icon"></i>
        <span class="info-text">${content}</span>
      </div>
    </div>
  `;
  modal.style.display = 'block';
  document.body.style.overflow = 'hidden';
  modal.offsetHeight;
  modal.classList.add('active');
  // Focus trap: focus close button
  document.querySelector('.modal-close').focus();
}

function closeModal() {
  const modal = document.getElementById('infoModal');
  modal.classList.remove('active');
  setTimeout(() => {
    modal.style.display = 'none';
    document.body.style.overflow = '';
    // Restore focus to menu button if open
    if (document.activeElement && document.activeElement.classList.contains('modal-close')) {
      document.getElementById('mobile-menu-button').focus();
    }
  }, 300);
}

// Keyboard accessibility for modal (Esc to close, Tab trap)
document.addEventListener('keydown', function(e) {
  const modal = document.getElementById('infoModal');
  if (modal.classList.contains('active')) {
    if (e.key === 'Escape') {
      closeModal();
    }
    // Trap focus inside modal
    const focusable = modal.querySelectorAll('button, [tabindex]:not([tabindex="-1"])');
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
  }
});

// Improved section tracking with Intersection Observer
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.desktop-menu a, .mobile-menu a');

const observerOptions = {
  root: null, // viewport
  rootMargin: '-10% 0px', // triggers when section is in middle of viewport
  threshold: 0.1
};

const observerCallback = (entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
      const sectionId = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
          link.classList.add('active');
        }
      });
    }
  });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);

// Observe all sections
sections.forEach(section => {
  observer.observe(section);
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth'
      });
    }
  });
});

// Enhanced Mobile Menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', (e) => {
  e.stopPropagation();
  mobileMenuButton.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenuButton.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (mobileMenu.classList.contains('active') &&
      !mobileMenu.contains(e.target) &&
      !mobileMenuButton.contains(e.target)) {
    mobileMenuButton.classList.remove('active');
    mobileMenu.classList.remove('active');
    document.body.style.overflow = '';
  }
});

// Scroll to top button
const scrollTopButton = document.getElementById('scroll-top');

if (scrollTopButton) {
  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
      scrollTopButton.classList.add('visible');
      document.querySelector('nav').classList.add('scrolled');
    } else {
      scrollTopButton.classList.remove('visible');
      document.querySelector('nav').classList.remove('scrolled');
    }
  });

  scrollTopButton.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

// Explore button scroll function
function scrollToAbout() {
  document.querySelector('#events').scrollIntoView({
    behavior: 'smooth'
  });
}

// Prevent zoom on double tap for mobile
document.addEventListener('touchend', function(event) {
  event.preventDefault();
  event.target.click();
}, { passive: false });

// Parallax Effect for Hero Section
document.addEventListener('mousemove', (e) => {
  const hero = document.querySelector('.hero-section');
  const x = (window.innerWidth - e.pageX * 2) / 100;
  const y = (window.innerHeight - e.pageY * 2) / 100;
  hero.style.backgroundPosition = `${x}px ${y}px`;
});

// Add grid effect for gray sections - desktop only
if ('ontouchstart' in window === false) {  // Only run on non-touch devices
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

// === Event Status Indicator Logic ===

document.addEventListener('DOMContentLoaded', function() {
  // Map event display names to API keys (adjust as per your API response)
  const eventNameMap = {
    'Natya Sutra': 'Natya-Sutra',
    'Yukti (Quiz)': 'Yukti',
    'Naada Nirvana': 'Naada-Nirvana',
    'Nataka': 'Nataka',
    'Nazakat': 'Nazakat',
  };

  // Status mapping: API status -> { color, label }
  const statusMap = {
    'Started':   { color: 'green',  label: 'Started' },
    'Ended':     { color: 'green',  label: 'Done' },
    'Ongoing':   { color: 'yellow', label: 'In Progress' },
    'Round1':    { color: 'blue',   label: 'Round 1' },
    'Round2':    { color: 'blue',   label: 'Round 2' },
    'Round3':    { color: 'blue',   label: 'Round 3' },
    'Round4':    { color: 'blue',   label: 'Round 4' },
    'Soon':      { color: 'blue',   label: 'Soon' },
    'Delayed':   { color: 'orange', label: 'Delayed' },
  };

  // Helper: get event name from card
  function getEventName(card) {
    const h3 = card.querySelector('h3');
    return h3 ? h3.textContent.trim() : '';
  }

  // Fetch event statuses from API
  fetch('http://127.0.0.1:8000/api/v3/get/events')
    .then(res => res.json())
    .then(data => {
      // data should be an array of { name, status }
      document.querySelectorAll('.card-orbit').forEach(card => {
        const eventName = getEventName(card);
        const apiName = eventNameMap[eventName];
        if (!apiName) return;
        const event = (data || []).find(e => e.name === apiName);
        const status = event ? event.status : null;
        const map = statusMap[status] || { color: 'gray', label: status || 'Unknown' };
        const indicator = card.querySelector('.event-status-indicator');
        if (indicator) {
          indicator.innerHTML = `<span class="status-dot ${map.color}"></span><span class="status-label">${map.label}</span>`;
        }
      });
    })
    .catch(err => {
      // On error, show gray/unknown for all
      document.querySelectorAll('.event-status-indicator').forEach(indicator => {
        indicator.innerHTML = '<span class="status-dot gray"></span><span class="status-label">Unknown</span>';
      });
    });
});
