// Portfolio JavaScript - Aurora James Creative Portfolio

// Work data for modal
const workData = {
  1: {
    title: "E-commerce Platform",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    description: "A comprehensive e-commerce platform designed for modern retail businesses. Features include responsive design, user-friendly navigation, secure payment processing, and advanced product management system."
  },
  2: {
    title: "Mobile App UI",
    category: "UI/UX Design",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
    description: "Intuitive mobile application interface designed with user experience in mind. Clean, modern design with smooth animations and accessible navigation patterns."
  },
  3: {
    title: "Brand Identity",
    category: "Brand Design",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&h=600&fit=crop",
    description: "Complete brand identity package including logo design, color palette, typography, and comprehensive style guidelines for consistent brand representation."
  },
  4: {
    title: "Analytics Dashboard",
    category: "Web Development",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&h=600&fit=crop",
    description: "Data visualization dashboard with real-time analytics, interactive charts, and customizable reporting features for business intelligence and decision making."
  },
  5: {
    title: "SaaS Landing Page",
    category: "Landing Page",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=600&fit=crop",
    description: "High-converting landing page designed to capture leads and drive user engagement. Optimized for conversion with clear value propositions and compelling call-to-actions."
  },
  6: {
    title: "Portfolio Website",
    category: "Web Design",
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop",
    description: "Personal portfolio website showcasing creative work and professional experience. Features responsive design, smooth animations, and optimized user experience."
  }
};

// DOM Elements
const themeToggle = document.querySelector('.theme-toggle');
const body = document.body;
const navLinks = document.querySelectorAll('.nav-link');
const workItems = document.querySelectorAll('.work-item');
const modal = document.getElementById('workModal');
const modalClose = document.querySelector('.modal-close');
const modalPrev = document.querySelector('.modal-prev');
const modalNext = document.querySelector('.modal-next');
const contactForm = document.querySelector('.contact-form');
const formStatus = document.querySelector('.form-status');

// Theme Management
class ThemeManager {
  constructor() {
    this.currentTheme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    this.setTheme(this.currentTheme);
    themeToggle.addEventListener('click', () => this.toggleTheme());
  }

  setTheme(theme) {
    body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    this.currentTheme = theme;
  }

  toggleTheme() {
    const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }
}

// Navigation Management
class NavigationManager {
  constructor() {
    this.sections = document.querySelectorAll('section[id]');
    this.navLinks = document.querySelectorAll('.nav-link');
    this.init();
  }

  init() {
    // Smooth scrolling for navigation links
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });

    // Active navigation highlighting
    this.setupIntersectionObserver();
  }

  setupIntersectionObserver() {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -80% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.updateActiveNav(entry.target.id);
        }
      });
    }, observerOptions);

    this.sections.forEach(section => {
      observer.observe(section);
    });
  }

  updateActiveNav(sectionId) {
    this.navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${sectionId}`) {
        link.classList.add('active');
      }
    });
  }
}

// Modal Management
class ModalManager {
  constructor() {
    this.currentIndex = 0;
    this.workItems = Array.from(workItems);
    this.init();
  }

  init() {
    // Open modal on work item click
    this.workItems.forEach((item, index) => {
      item.addEventListener('click', () => {
        this.openModal(index);
      });
    });

    // Close modal
    modalClose.addEventListener('click', () => this.closeModal());
    modal.addEventListener('click', (e) => {
      if (e.target === modal || e.target.classList.contains('modal-overlay')) {
        this.closeModal();
      }
    });

    // Navigation
    modalPrev.addEventListener('click', () => this.prevItem());
    modalNext.addEventListener('click', () => this.nextItem());

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('show')) return;
      
      switch (e.key) {
        case 'Escape':
          this.closeModal();
          break;
        case 'ArrowLeft':
          this.prevItem();
          break;
        case 'ArrowRight':
          this.nextItem();
          break;
      }
    });
  }

  openModal(index) {
    this.currentIndex = index;
    const workId = this.workItems[index].getAttribute('data-work');
    const workInfo = workData[workId];
    
    if (workInfo) {
      document.getElementById('modalTitle').textContent = workInfo.title;
      document.getElementById('modalDescription').textContent = workInfo.category;
      document.getElementById('modalImage').src = workInfo.image;
      document.getElementById('modalImage').alt = workInfo.title;
      document.getElementById('modalText').textContent = workInfo.description;
    }

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Focus trap
    this.setupFocusTrap();
  }

  closeModal() {
    modal.classList.remove('show');
    document.body.style.overflow = '';
    
    // Restore focus to the work item that was clicked
    if (this.workItems[this.currentIndex]) {
      this.workItems[this.currentIndex].focus();
    }
  }

  prevItem() {
    this.currentIndex = this.currentIndex > 0 ? this.currentIndex - 1 : this.workItems.length - 1;
    this.updateModalContent();
  }

  nextItem() {
    this.currentIndex = this.currentIndex < this.workItems.length - 1 ? this.currentIndex + 1 : 0;
    this.updateModalContent();
  }

  updateModalContent() {
    const workId = this.workItems[this.currentIndex].getAttribute('data-work');
    const workInfo = workData[workId];
    
    if (workInfo) {
      document.getElementById('modalTitle').textContent = workInfo.title;
      document.getElementById('modalDescription').textContent = workInfo.category;
      document.getElementById('modalImage').src = workInfo.image;
      document.getElementById('modalImage').alt = workInfo.title;
      document.getElementById('modalText').textContent = workInfo.description;
    }
  }

  setupFocusTrap() {
    const focusableElements = modal.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (firstElement) {
      firstElement.focus();
    }

    modal.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    });
  }
}

// Contact Form Management
class ContactFormManager {
  constructor() {
    this.form = contactForm;
    this.submitBtn = this.form.querySelector('.form-submit');
    this.statusElement = formStatus;
    this.init();
  }

  init() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    this.setupValidation();
  }

  setupValidation() {
    const inputs = this.form.querySelectorAll('input, textarea');
    
    inputs.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  validateField(field) {
    const value = field.value.trim();
    const errorElement = document.getElementById(`${field.id}-error`);
    
    if (!value) {
      this.showFieldError(field, 'This field is required');
      return false;
    }
    
    if (field.type === 'email' && !this.isValidEmail(value)) {
      this.showFieldError(field, 'Please enter a valid email address');
      return false;
    }
    
    this.clearFieldError(field);
    return true;
  }

  showFieldError(field, message) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.textContent = message;
      errorElement.classList.add('show');
      field.setAttribute('aria-invalid', 'true');
    }
  }

  clearFieldError(field) {
    const errorElement = document.getElementById(`${field.id}-error`);
    if (errorElement) {
      errorElement.classList.remove('show');
      field.removeAttribute('aria-invalid');
    }
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    // Validate all fields
    const inputs = this.form.querySelectorAll('input, textarea');
    let isValid = true;
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    if (!isValid) {
      this.showStatus('Please fix the errors above', 'error');
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      const formData = new FormData(this.form);
      const action = this.form.getAttribute('data-action');
      
      // Simulate form submission (replace with actual Formspree endpoint)
      const response = await fetch(action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        this.showStatus('Thank you! Your message has been sent successfully.', 'success');
        this.form.reset();
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      this.showStatus('Sorry, there was an error sending your message. Please try again.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }

  setLoadingState(loading) {
    if (loading) {
      this.submitBtn.classList.add('loading');
      this.submitBtn.disabled = true;
    } else {
      this.submitBtn.classList.remove('loading');
      this.submitBtn.disabled = false;
    }
  }

  showStatus(message, type) {
    this.statusElement.textContent = message;
    this.statusElement.className = `form-status ${type}`;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
      setTimeout(() => {
        this.statusElement.classList.remove('show');
      }, 5000);
    }
  }
}

// Performance and Accessibility Enhancements
class PerformanceManager {
  constructor() {
    this.init();
  }

  init() {
    this.setupLazyLoading();
    this.setupIntersectionObserver();
    this.preventHorizontalScroll();
  }

  setupLazyLoading() {
    // Lazy loading is handled by the loading="lazy" attribute in HTML
    // Additional lazy loading for images that don't support it
    if ('loading' in HTMLImageElement.prototype) {
      const images = document.querySelectorAll('img[loading="lazy"]');
      images.forEach(img => {
        if (img.complete) {
          img.classList.add('loaded');
        } else {
          img.addEventListener('load', () => {
            img.classList.add('loaded');
          });
        }
      });
    }
  }

  setupIntersectionObserver() {
    // Observe elements for animations or other performance optimizations
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
        }
      });
    }, observerOptions);

    // Observe cards and other elements for animations
    const animateElements = document.querySelectorAll('.service-card, .work-item, .testimonial-card');
    animateElements.forEach(el => observer.observe(el));
  }

  preventHorizontalScroll() {
    // Prevent horizontal scroll on mobile devices
    const preventHorizontalScroll = () => {
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      if (scrollLeft > 0) {
        window.scrollTo(0, window.pageYOffset);
      }
    };

    window.addEventListener('scroll', preventHorizontalScroll);
  }
}

// Initialize all managers when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ThemeManager();
  new NavigationManager();
  new ModalManager();
  new ContactFormManager();
  new PerformanceManager();
  
  // Add some subtle animations
  document.body.classList.add('loaded');
});

// Service Worker Registration (if supported)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

// Export for module usage (if needed)
export { ThemeManager, NavigationManager, ModalManager, ContactFormManager, PerformanceManager };



// --- Mobile nav toggle ---
(() => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.getElementById('navLinks');
  if (!toggle || !links) return;
  toggle.addEventListener('click', () => {
    const isOpen = links.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && links.classList.contains('open')) {
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
})();
