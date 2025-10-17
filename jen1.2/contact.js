// Contact Page JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initContactForm();
    initFAQ();
    initScrollEffects();
    initAccessibility();
    initPerformanceOptimizations();
    initAnalytics();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        });
    });
    
    // Navbar scroll effect
    let lastScrollTop = 0;
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            navbar?.classList.add('nav-hidden');
        } else {
            navbar?.classList.remove('nav-hidden');
        }
        
        // Add background on scroll
        if (scrollTop > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }
        
        lastScrollTop = scrollTop;
    }, 100));
}

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Counter animation for stats
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                // Stagger animation for cards
                if (entry.target.classList.contains('contact-card')) {
                    const delay = Array.from(entry.target.parentNode.children).indexOf(entry.target) * 100;
                    setTimeout(() => {
                        entry.target.style.transform = 'translateY(0)';
                        entry.target.style.opacity = '1';
                    }, delay);
                }
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.animate-on-scroll, .contact-card, .faq-item').forEach(el => {
        observer.observe(el);
    });
}

// Contact form functionality
function initContactForm() {
    const form = document.getElementById('contactForm');
    const submitBtn = document.querySelector('.btn-submit');
    
    if (!form) return;
    
    // Form validation rules
    const validationRules = {
        firstName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid first name (letters only, minimum 2 characters)'
        },
        lastName: {
            required: true,
            minLength: 2,
            pattern: /^[a-zA-Z\s]+$/,
            message: 'Please enter a valid last name (letters only, minimum 2 characters)'
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: 'Please enter a valid email address'
        },
        phone: {
            required: true,
            pattern: /^[\+]?[1-9][\d]{0,3}[\s\-\(\)]?[\d\s\-\(\)]{7,15}$/,
            message: 'Please enter a valid phone number'
        },
        destination: {
            required: true,
            message: 'Please select a destination'
        },
        travelDates: {
            required: true,
            message: 'Please select your travel dates'
        },
        travelers: {
            required: true,
            min: 1,
            max: 20,
            message: 'Please enter number of travelers (1-20)'
        },
        budget: {
            required: true,
            message: 'Please select your budget range'
        },
        message: {
            required: true,
            minLength: 10,
            message: 'Please enter a message (minimum 10 characters)'
        },
        terms: {
            required: true,
            message: 'Please accept the terms and conditions'
        }
    };
    
    // Real-time validation
    Object.keys(validationRules).forEach(fieldName => {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (field) {
            field.addEventListener('blur', () => validateField(field, validationRules[fieldName]));
            field.addEventListener('input', debounce(() => {
                if (field.classList.contains('error')) {
                    validateField(field, validationRules[fieldName]);
                }
            }, 300));
        }
    });
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validate all fields
        let isValid = true;
        Object.keys(validationRules).forEach(fieldName => {
            const field = form.querySelector(`[name="${fieldName}"]`);
            if (field && !validateField(field, validationRules[fieldName])) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            showNotification('Please correct the errors in the form', 'error');
            return;
        }
        
        // Show loading state
        setSubmitButtonLoading(true);
        
        try {
            // Simulate form submission
            await simulateFormSubmission(new FormData(form));
            
            // Success
            showNotification('Thank you! Your message has been sent successfully. We\'ll get back to you within 24 hours.', 'success');
            form.reset();
            
            // Track successful submission
            trackEvent('form_submission', {
                form_type: 'contact',
                destination: form.destination.value,
                budget: form.budget.value
            });
            
        } catch (error) {
            console.error('Form submission error:', error);
            showNotification('Sorry, there was an error sending your message. Please try again or contact us directly.', 'error');
        } finally {
            setSubmitButtonLoading(false);
        }
    });
    
    // Dynamic country/region updates
    const destinationSelect = form.querySelector('[name="destination"]');
    if (destinationSelect) {
        destinationSelect.addEventListener('change', updateDestinationInfo);
    }
    
    // Travel date validation
    const travelDatesInput = form.querySelector('[name="travelDates"]');
    if (travelDatesInput) {
        // Set minimum date to today
        const today = new Date().toISOString().split('T')[0];
        travelDatesInput.setAttribute('min', today);
        
        travelDatesInput.addEventListener('change', validateTravelDates);
    }
}

// Field validation function
function validateField(field, rules) {
    const value = field.type === 'checkbox' ? field.checked : field.value.trim();
    const errorElement = field.parentNode.querySelector('.error-message');
    
    // Required validation
    if (rules.required && (!value || (field.type === 'checkbox' && !field.checked))) {
        showFieldError(field, errorElement, rules.message);
        return false;
    }
    
    // Skip other validations if field is empty and not required
    if (!value && !rules.required) {
        hideFieldError(field, errorElement);
        return true;
    }
    
    // Pattern validation
    if (rules.pattern && !rules.pattern.test(value)) {
        showFieldError(field, errorElement, rules.message);
        return false;
    }
    
    // Length validation
    if (rules.minLength && value.length < rules.minLength) {
        showFieldError(field, errorElement, rules.message);
        return false;
    }
    
    // Number validation
    if (rules.min !== undefined && parseInt(value) < rules.min) {
        showFieldError(field, errorElement, rules.message);
        return false;
    }
    
    if (rules.max !== undefined && parseInt(value) > rules.max) {
        showFieldError(field, errorElement, rules.message);
        return false;
    }
    
    // Field is valid
    hideFieldError(field, errorElement);
    return true;
}

function showFieldError(field, errorElement, message) {
    field.classList.add('error');
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('show');
    }
}

function hideFieldError(field, errorElement) {
    field.classList.remove('error');
    if (errorElement) {
        errorElement.classList.remove('show');
    }
}

// Submit button loading state
function setSubmitButtonLoading(loading) {
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) return;
    
    if (loading) {
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove('loading');
        submitBtn.disabled = false;
    }
}

// Simulate form submission
function simulateFormSubmission(formData) {
    return new Promise((resolve, reject) => {
        // Simulate network delay
        setTimeout(() => {
            // Simulate 95% success rate
            if (Math.random() > 0.05) {
                resolve({ success: true });
            } else {
                reject(new Error('Network error'));
            }
        }, 2000);
    });
}

// Update destination info based on selection
function updateDestinationInfo() {
    const destinationSelect = document.querySelector('[name="destination"]');
    const selectedValue = destinationSelect.value;
    
    // You could add logic here to show additional fields or information
    // based on the selected destination
    console.log('Selected destination:', selectedValue);
}

// Validate travel dates
function validateTravelDates() {
    const travelDatesInput = document.querySelector('[name="travelDates"]');
    const selectedDate = new Date(travelDatesInput.value);
    const today = new Date();
    
    if (selectedDate < today) {
        showFieldError(travelDatesInput, 
            travelDatesInput.parentNode.querySelector('.error-message'),
            'Travel date cannot be in the past'
        );
        return false;
    }
    
    hideFieldError(travelDatesInput, 
        travelDatesInput.parentNode.querySelector('.error-message')
    );
    return true;
}

// FAQ functionality
function initFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.addEventListener('click', () => {
            const isActive = item.classList.contains('active');
            
            // Close all other FAQ items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            
            // Toggle current item
            item.classList.toggle('active', !isActive);
            
            // Track FAQ interaction
            trackEvent('faq_interaction', {
                question: question.querySelector('h3').textContent,
                action: isActive ? 'close' : 'open'
            });
        });
    });
}

// Scroll effects
function initScrollEffects() {
    // Parallax effect for page header
    const pageHeader = document.querySelector('.page-header');
    
    if (pageHeader) {
        window.addEventListener('scroll', throttle(() => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            pageHeader.style.transform = `translateY(${rate}px)`;
        }, 16));
    }
    
    // Reading progress indicator
    createReadingProgress();
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Create reading progress indicator
function createReadingProgress() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.innerHTML = '<div class="reading-progress-fill"></div>';
    document.body.appendChild(progressBar);
    
    const progressFill = progressBar.querySelector('.reading-progress-fill');
    
    window.addEventListener('scroll', throttle(() => {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        progressFill.style.width = Math.min(scrollPercent, 100) + '%';
    }, 16));
}

// Notification system
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    const icon = type === 'success' ? '✓' : '✕';
    
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">${icon}</div>
            <div class="notification-message">${message}</div>
            <button class="notification-close" aria-label="Close notification">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Auto hide after 5 seconds
    const autoHideTimer = setTimeout(() => hideNotification(notification), 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoHideTimer);
        hideNotification(notification);
    });
    
    // Hide on escape key
    const escapeHandler = (e) => {
        if (e.key === 'Escape') {
            clearTimeout(autoHideTimer);
            hideNotification(notification);
            document.removeEventListener('keydown', escapeHandler);
        }
    };
    document.addEventListener('keydown', escapeHandler);
}

function hideNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => notification.remove(), 300);
}

// Accessibility improvements
function initAccessibility() {
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.className = 'skip-to-content';
    skipLink.textContent = 'Skip to main content';
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Focus management for mobile menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            const isExpanded = navMenu.classList.contains('active');
            hamburger.setAttribute('aria-expanded', isExpanded);
            
            if (isExpanded) {
                const firstLink = navMenu.querySelector('a');
                firstLink?.focus();
            }
        });
    }
    
    // Keyboard navigation for FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.setAttribute('tabindex', '0');
        question.setAttribute('role', 'button');
        question.setAttribute('aria-expanded', 'false');
        
        question.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                question.click();
            }
        });
    });
    
    // Form accessibility
    const form = document.getElementById('contactForm');
    if (form) {
        // Add aria-describedby for error messages
        form.querySelectorAll('input, select, textarea').forEach(field => {
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                const errorId = `error-${field.name}`;
                errorElement.id = errorId;
                field.setAttribute('aria-describedby', errorId);
            }
        });
    }
}

// Performance optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Preload critical resources
    const criticalImages = [
        'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
    
    // Monitor performance
    if ('PerformanceObserver' in window) {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                if (entry.entryType === 'largest-contentful-paint') {
                    console.log('LCP:', entry.startTime);
                }
            });
        });
        
        observer.observe({ entryTypes: ['largest-contentful-paint'] });
    }
}

// Analytics tracking
function initAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page: 'contact',
        timestamp: new Date().toISOString()
    });
    
    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', throttle(() => {
        const scrollDepth = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
        if (scrollDepth > maxScrollDepth) {
            maxScrollDepth = scrollDepth;
            
            // Track milestone scroll depths
            if ([25, 50, 75, 90].includes(scrollDepth)) {
                trackEvent('scroll_depth', {
                    depth: scrollDepth,
                    page: 'contact'
                });
            }
        }
    }, 1000));
    
    // Track time on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', () => {
        const timeOnPage = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            duration: timeOnPage,
            page: 'contact'
        });
    });
}

// Track events (placeholder for analytics integration)
function trackEvent(eventName, properties = {}) {
    console.log('Analytics Event:', eventName, properties);
    
    // Integration with analytics services would go here
    // Example: gtag('event', eventName, properties);
    // Example: analytics.track(eventName, properties);
}

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Error handling
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        page: 'contact'
    });
});

// Add dynamic CSS for animations
const style = document.createElement('style');
style.textContent = `
    .reading-progress {
        position: fixed;
        top: 80px;
        left: 0;
        width: 100%;
        height: 4px;
        background: rgba(230, 0, 126, 0.1);
        z-index: 999;
    }
    
    .reading-progress-fill {
        height: 100%;
        background: linear-gradient(135deg, #e6007e, #ff4da6);
        width: 0%;
        transition: width 0.1s ease;
    }
    
    .skip-to-content {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #e6007e;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1001;
        transition: top 0.3s ease;
    }
    
    .skip-to-content:focus {
        top: 6px;
    }
    
    .nav-hidden {
        transform: translateY(-100%);
    }
    
    .navbar.scrolled {
        background: rgba(255, 255, 255, 0.98);
        box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .reading-progress-fill {
            transition: none;
        }
    }
`;
document.head.appendChild(style);