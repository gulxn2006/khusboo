/**
 * Khusboo Entertainment - Ultra-Modern Interactive Web App
 * Master JavaScript Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSlider();
  initMediaCalculator();
  initPortfolioFilters();
  initScrollReveal();
  initModalAndForms();
  initToast();
});

/* ==========================================================================
   Navbar & Mobile Menu
   ========================================================================== */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Sticky navbar shadow on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateScrollSpy();
  });

  // Mobile menu toggle
  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navMenu.classList.toggle('open');
      const icon = mobileToggle.querySelector('i');
      if (icon) {
        if (navMenu.classList.contains('open')) {
          icon.className = 'fas fa-times';
        } else {
          icon.className = 'fas fa-bars';
        }
      }
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });

    // Close when clicking link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        const icon = mobileToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      });
    });
  }

  // Active ScrollSpy
  function updateScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-menu a[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach(l => l.classList.remove('active'));
          targetLink.classList.add('active');
        }
      }
    });
  }
}

/* ==========================================================================
   Hero Slider
   ========================================================================== */
function initHeroSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');
  if (!slides.length) return;

  let currentSlide = 0;
  let slideInterval = null;

  function showSlide(index) {
    slides.forEach((slide, idx) => {
      slide.classList.remove('active');
      if (idx === index) {
        slide.classList.add('active');
      }
    });
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetTimer(); });
  if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetTimer(); });

  function startTimer() {
    slideInterval = setInterval(nextSlide, 5500);
  }

  function resetTimer() {
    clearInterval(slideInterval);
    startTimer();
  }

  startTimer();
}

/* ==========================================================================
   Interactive Out-of-Home (OOH) Campaign Calculator
   ========================================================================== */
function initMediaCalculator() {
  const citySelect = document.getElementById('calcCity');
  const mediaSelect = document.getElementById('calcMedia');
  const durationSelect = document.getElementById('calcDuration');
  const countSelect = document.getElementById('calcCount');

  const reachDisplay = document.getElementById('calcReachVal');
  const impressionsDisplay = document.getElementById('calcImpressionsVal');
  const rateDisplay = document.getElementById('calcEstRate');
  const tierDisplay = document.getElementById('calcPlanTier');
  const whatsappCalcBtn = document.getElementById('calcWhatsAppBtn');

  if (!citySelect || !mediaSelect || !durationSelect) return;

  // Estimation multiplier logic
  const cityReachFactors = {
    'raipur': { factor: 1.4, name: 'Raipur' },
    'bilaspur': { factor: 1.1, name: 'Bilaspur' },
    'durg-bhilai': { factor: 1.25, name: 'Durg-Bhilai' },
    'korba': { factor: 0.9, name: 'Korba' },
    'rajnandgaon': { factor: 0.8, name: 'Rajnandgaon' },
    'chhattisgarh-all': { factor: 3.5, name: 'All Chhattisgarh' }
  };

  const mediaRates = {
    'led-billboard': { baseReach: 75000, baseImp: 180000, label: 'Digital LED Screen' },
    'unipole': { baseReach: 60000, baseImp: 140000, label: 'Iconic Unipole Hoarding' },
    'publicity-van': { baseReach: 45000, baseImp: 95000, label: 'Mobile LED Publicity Van' },
    'audio-jingle': { baseReach: 120000, baseImp: 250000, label: 'Audio Jingle & Radio Media' }
  };

  function updateCalculation() {
    const city = citySelect.value || 'raipur';
    const media = mediaSelect.value || 'led-billboard';
    const duration = parseInt(durationSelect.value || '30');
    const units = parseInt(countSelect.value || '1');

    const cityFactor = cityReachFactors[city] ? cityReachFactors[city].factor : 1.0;
    const mediaData = mediaRates[media] || mediaRates['led-billboard'];

    const totalReach = Math.round((mediaData.baseReach * cityFactor * units * (duration / 30)));
    const totalImpressions = Math.round((mediaData.baseImp * cityFactor * units * (duration / 30) * 1.8));

    // Format numbers
    reachDisplay.textContent = formatCompactNumber(totalReach) + '+ People';
    impressionsDisplay.textContent = formatCompactNumber(totalImpressions) + '+ Total Impressions';

    if (duration >= 90 || units >= 5) {
      tierDisplay.textContent = 'Platinum Mega Impact';
      rateDisplay.textContent = 'Custom Mega Discount';
    } else if (duration >= 30) {
      tierDisplay.textContent = 'Gold Growth Network';
      rateDisplay.textContent = 'Prime Executive Spot';
    } else {
      tierDisplay.textContent = 'Express Kickstart';
      rateDisplay.textContent = 'High-Frequency Rotation';
    }

    // Prefill WhatsApp CTA
    const message = `Hello Khusboo Entertainment! I used your Website Media Calculator:%0A• City: ${cityReachFactors[city].name}%0A• Media: ${mediaData.label}%0A• Quantity: ${units} Unit(s)%0A• Duration: ${duration} Days%0A• Est. Reach: ${formatCompactNumber(totalReach)}%0APlease share availability and official rate card.`;
    whatsappCalcBtn.href = `https://wa.me/916306900000?text=${message}`;
  }

  function formatCompactNumber(num) {
    if (num >= 10000000) {
      return (num / 10000000).toFixed(1) + ' Cr';
    }
    if (num >= 100000) {
      return (num / 100000).toFixed(1) + ' Lakh';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(0) + 'K';
    }
    return num.toLocaleString('en-IN');
  }

  [citySelect, mediaSelect, durationSelect, countSelect].forEach(el => {
    if (el) el.addEventListener('change', updateCalculation);
  });

  updateCalculation();
}

/* ==========================================================================
   Portfolio Filter System
   ========================================================================== */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      portfolioItems.forEach(item => {
        const itemCategory = item.getAttribute('data-category');
        if (filterValue === 'all' || itemCategory === filterValue) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.4s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ==========================================================================
   Scroll Reveal (IntersectionObserver)
   ========================================================================== */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    reveals.forEach(el => el.classList.add('active'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  reveals.forEach(el => observer.observe(el));
}

/* ==========================================================================
   Modal Dialog & Form Handling
   ========================================================================== */
function initModalAndForms() {
  const modal = document.getElementById('quoteModal');
  const openModalBtns = document.querySelectorAll('.open-quote-modal');
  const closeModalBtn = document.querySelector('.modal-close');
  const modalMediaField = document.getElementById('modalMediaService');

  if (modal) {
    openModalBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const serviceName = btn.getAttribute('data-service') || 'General Outdoor Advertising';
        if (modalMediaField) modalMediaField.value = serviceName;
        modal.classList.add('open');
      });
    });

    if (closeModalBtn) {
      closeModalBtn.addEventListener('click', () => {
        modal.classList.remove('open');
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('open');
    });
  }

  // Main Contact Form
  const contactForm = document.getElementById('mainContactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = contactForm.querySelector('[name="name"]').value;
      const phone = contactForm.querySelector('[name="phone"]').value;
      const service = contactForm.querySelector('[name="service"]').value;
      const message = contactForm.querySelector('[name="message"]').value;

      showToast(`Thank you, ${name}! Your inquiry has been logged. Connecting to WhatsApp...`);

      // Launch WhatsApp query
      const waText = `*New Campaign Inquiry from Website*%0A• Name: ${name}%0A• Contact: ${phone}%0A• Service: ${service}%0A• Details: ${message}`;
      setTimeout(() => {
        window.open(`https://wa.me/916306900000?text=${waText}`, '_blank');
        contactForm.reset();
      }, 1000);
    });
  }

  // Modal Quote Form
  const modalForm = document.getElementById('modalQuoteForm');
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = modalForm.querySelector('[name="name"]').value;
      const phone = modalForm.querySelector('[name="phone"]').value;
      const media = modalMediaField ? modalMediaField.value : 'Advertising';

      showToast(`Request received! Our Media Planner will call you shortly.`);
      if (modal) modal.classList.remove('open');

      const waText = `*Instant Media Booking Request*%0A• Name: ${name}%0A• Phone: ${phone}%0A• Media Space: ${media}`;
      setTimeout(() => {
        window.open(`https://wa.me/916306900000?text=${waText}`, '_blank');
        modalForm.reset();
      }, 800);
    });
  }
}

/* ==========================================================================
   Toast Notification Utility
   ========================================================================== */
function showToast(msg) {
  let toast = document.querySelector('.toast-notice');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `<i class="fas fa-check-circle"></i> <span>${msg}</span>`;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}
