/**
 * HABITLY LANDING PAGE - MAIN JAVASCRIPT
 * Fast, Vanilla JS, Zero external dependencies
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initHeaderScroll();
  initMobileNav();
  initInteractiveTimer();
  initFaqAccordion();
  initBackToTop();
  initNavScrollSpy();
});

/* ==========================================================================
   1. Theme Toggle (Light / Dark Mode)
   ========================================================================== */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle-btn');
  if (!toggleBtn) return;

  const savedTheme = localStorage.getItem('habitly-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }

  toggleBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('habitly-theme', newTheme);
  });
}

/* ==========================================================================
   2. Sticky Header on Scroll
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   3. Mobile Navigation Drawer
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!toggleBtn || !navMenu) return;

  toggleBtn.addEventListener('click', () => {
    toggleBtn.classList.toggle('open');
    navMenu.classList.toggle('open');
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      toggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
    });
  });

  // Close when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target) && navMenu.classList.contains('open')) {
      toggleBtn.classList.remove('open');
      navMenu.classList.remove('open');
    }
  });
}


/* ==========================================================================
   5. Interactive Focus Timer Demo Widget
   ========================================================================== */
function initInteractiveTimer() {
  const digits = document.getElementById('timer-digits');
  const toggleBtn = document.getElementById('timer-toggle-btn');
  const resetBtn = document.getElementById('timer-reset-btn');
  const statusText = document.getElementById('timer-status');
  const progressCircle = document.querySelector('.timer-progress-circle');
  const chips = document.querySelectorAll('.preset-chip');

  if (!digits || !toggleBtn) return;

  const totalCircumference = 2 * Math.PI * 90; // r=90 -> ~565.48
  let selectedMinutes = 25;
  let remainingSeconds = selectedMinutes * 60;
  let timerInterval = null;
  let isRunning = false;

  function formatTime(secs) {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }

  function updateCircleProgress() {
    if (!progressCircle) return;
    const totalSecs = selectedMinutes * 60;
    const progress = (totalSecs - remainingSeconds) / totalSecs;
    const offset = totalCircumference * (1 - progress);
    progressCircle.style.strokeDashoffset = offset;
  }

  function tick() {
    if (remainingSeconds > 0) {
      remainingSeconds--;
      digits.textContent = formatTime(remainingSeconds);
      updateCircleProgress();
    } else {
      pauseTimer();
      if (statusText) statusText.textContent = '🎉 Session Completed!';
      toggleBtn.innerHTML = `<span>Completed</span>`;
    }
  }

  function startTimer() {
    isRunning = true;
    timerInterval = setInterval(tick, 1000);
    toggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg> Pause`;
    if (statusText) statusText.textContent = 'Focusing... Stay consistent';
  }

  function pauseTimer() {
    isRunning = false;
    clearInterval(timerInterval);
    toggleBtn.innerHTML = `<svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg> Start Focus`;
    if (statusText && remainingSeconds > 0) statusText.textContent = 'Paused';
  }

  function resetTimer() {
    pauseTimer();
    remainingSeconds = selectedMinutes * 60;
    digits.textContent = formatTime(remainingSeconds);
    if (progressCircle) progressCircle.style.strokeDashoffset = '0';
    if (statusText) statusText.textContent = 'Ready to start';
  }

  toggleBtn.addEventListener('click', () => {
    if (isRunning) {
      pauseTimer();
    } else {
      startTimer();
    }
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', resetTimer);
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      selectedMinutes = parseInt(chip.dataset.minutes, 10) || 25;
      resetTimer();
    });
  });

  // Initial draw
  digits.textContent = formatTime(remainingSeconds);
  if (progressCircle) {
    progressCircle.style.strokeDasharray = totalCircumference;
    progressCircle.style.strokeDashoffset = '0';
  }
}

/* ==========================================================================
   6. FAQ Accordion
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all items
      faqItems.forEach(otherItem => otherItem.classList.remove('active'));

      // Toggle current item
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   7. Back to Top Button
   ========================================================================== */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ==========================================================================
   8. Navigation ScrollSpy
   ========================================================================== */
function initNavScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 120;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        current = sectionId;
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
