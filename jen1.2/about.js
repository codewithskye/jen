// About Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeAboutPage();
});

function initializeAboutPage() {
    // Initialize all features
    initScrollAnimations();
    initCounterAnimations();
    initTimelineAnimations();
    initTestimonialCarousel();
    initParallaxEffects();
    initSmoothScrolling();
    initProgressIndicator();
    initAccessibilityFeatures();
    initPerformanceOptimizations();
    initAnalytics();
}

// Scroll Animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Trigger specific animations based on element type
                if (entry.target.classList.contains('mission-card')) {
                    animateMissionCard(entry.target);
                } else if (entry.target.classList.contains('feature-item')) {
                    animateFeatureItem(entry.target);
                } else if (entry.target.classList.contains('testimonial-card')) {
                    animateTestimonialCard(entry.target);
                } else if (entry.target.classList.contains('timeline-item')) {
                    animateTimelineItem(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe all animatable elements
    const animatableElements = document.querySelectorAll(
        '.mission-card, .feature-item, .testimonial-card, .timeline-item, .intro-text, .intro-image'
    );
    
    animatableElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Counter Animations for Statistics
function initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number');
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Timeline Animations
function initTimelineAnimations() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    timelineItems.forEach((item, index) => {
        item.style.animationDelay = `${index * 0.2}s`;
    });
}

function animateTimelineItem(element) {
    const isOdd = Array.from(element.parentNode.children).indexOf(element) % 2 === 0;
    element.style.animation = `slideIn${isOdd ? 'Left' : 'Right'} 0.6s ease forwards`;
}

// Mission Card Animations
function animateMissionCard(element) {
    const icon = element.querySelector('.card-icon');
    if (icon) {
        icon.style.animation = 'bounceIn 0.6s ease';
    }
}

// Feature Item Animations
function animateFeatureItem(element) {
    const benefits = element.querySelectorAll('.feature-benefits li');
    benefits.forEach((benefit, index) => {
        setTimeout(() => {
            benefit.style.animation = 'fadeInUp 0.4s ease forwards';
        }, index * 100);
    });
}

// Testimonial Card Animations
function animateTestimonialCard(element) {
    const stars = element.querySelectorAll('.rating i');
    stars.forEach((star, index) => {
        setTimeout(() => {
            star.style.animation = 'starGlow 0.3s ease forwards';
        }, index * 100);
    });
}

// Testimonial Carousel (if multiple testimonials)
function initTestimonialCarousel() {
    const testimonialGrid = document.querySelector('.testimonials-grid');
    if (!testimonialGrid) return;

    const testimonials = testimonialGrid.querySelectorAll('.testimonial-card');
    if (testimonials.length <= 3) return; // No need for carousel if 3 or fewer

    let currentIndex = 0;
    const visibleCount = window.innerWidth > 768 ? 3 : 1;

    function showTestimonials() {
        testimonials.forEach((testimonial, index) => {
            testimonial.style.display = 
                (index >= currentIndex && index < currentIndex + visibleCount) ? 'block' : 'none';
        });
    }

    function nextTestimonials() {
        currentIndex = (currentIndex + visibleCount) % testimonials.length;
        showTestimonials();
    }

    // Auto-rotate testimonials every 5 seconds
    setInterval(nextTestimonials, 5000);
    showTestimonials();
}

// Parallax Effects
function initParallaxEffects() {
    const parallaxElements = document.querySelectorAll('.page-header, .intro-image img');
    
    function updateParallax() {
        const scrolled = window.pageYOffset;
        
        parallaxElements.forEach(element => {
            const rate = scrolled * -0.5;
            element.style.transform = `translateY(${rate}px)`;
        });
    }

    // Throttle scroll events for performance
    let ticking = false;
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateParallax);
            ticking = true;
            setTimeout(() => { ticking = false; }, 16);
        }
    }

    window.addEventListener('scroll', requestTick);
}

// Smooth Scrolling for Anchor Links
function initSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 100; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Reading Progress Indicator
function initProgressIndicator() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress';
    progressBar.style.cssText = `
        position: fixed;
        top: 80px;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(135deg, #e6007e, #ff4da6);
        z-index: 1001;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    function updateProgress() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    }

    window.addEventListener('scroll', throttle(updateProgress, 10));
}

// Enhanced Card Hover Effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.mission-card, .feature-item, .testimonial-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            this.style.boxShadow = '0 25px 50px rgba(230, 0, 126, 0.15)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        });
        
        // Click tracking for analytics
        card.addEventListener('click', function() {
            trackEvent('card_click', {
                card_type: this.className.split(' ')[0],
                card_title: this.querySelector('h3')?.textContent || 'Unknown'
            });
        });
    });
}

// Accessibility Features
function initAccessibilityFeatures() {
    // Keyboard navigation for cards
    const focusableCards = document.querySelectorAll('.mission-card, .feature-item, .testimonial-card');
    
    focusableCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Focus indicators
    const style = document.createElement('style');
    style.textContent = `
        .mission-card:focus,
        .feature-item:focus,
        .testimonial-card:focus {
            outline: 3px solid #e6007e;
            outline-offset: 2px;
        }
    `;
    document.head.appendChild(style);

    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #e6007e;
        color: white;
        padding: 8px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 1002;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add main content ID if not exists
    const aboutIntro = document.querySelector('.about-intro');
    if (aboutIntro && !document.getElementById('main-content')) {
        aboutIntro.id = 'main-content';
    }
}

// Performance Optimizations
function initPerformanceOptimizations() {
    // Lazy load images
    const images = document.querySelectorAll('img[src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.classList.add('loaded');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });

    // Preload critical images
    const criticalImages = [
        'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
    ];
    
    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Analytics and Tracking
function initAnalytics() {
    // Track page view
    trackEvent('page_view', {
        page: 'about',
        timestamp: new Date().toISOString()
    });

    // Track scroll depth
    const scrollDepths = [25, 50, 75, 100];
    const trackedDepths = new Set();

    function trackScrollDepth() {
        const scrollPercent = Math.round(
            (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100
        );

        scrollDepths.forEach(depth => {
            if (scrollPercent >= depth && !trackedDepths.has(depth)) {
                trackedDepths.add(depth);
                trackEvent('scroll_depth', {
                    depth: depth,
                    page: 'about'
                });
            }
        });
    }

    window.addEventListener('scroll', throttle(trackScrollDepth, 1000));

    // Track time spent on page
    const startTime = Date.now();
    window.addEventListener('beforeunload', function() {
        const timeSpent = Math.round((Date.now() - startTime) / 1000);
        trackEvent('time_on_page', {
            duration: timeSpent,
            page: 'about'
        });
    });
}

// Utility Functions
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

function trackEvent(eventName, properties = {}) {
    // Analytics tracking (replace with your analytics service)
    console.log('Analytics Event:', eventName, properties);
    
    // Example: Google Analytics 4
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, properties);
    }
    
    // Example: Custom analytics
    if (window.analytics) {
        window.analytics.track(eventName, properties);
    }
}

// Error Handling
window.addEventListener('error', function(e) {
    console.error('About page error:', e.error);
    trackEvent('javascript_error', {
        message: e.message,
        filename: e.filename,
        lineno: e.lineno,
        page: 'about'
    });
});

// Additional CSS for animations
const additionalStyles = `
    @keyframes bounceIn {
        0% {
            opacity: 0;
            transform: scale(0.3);
        }
        50% {
            opacity: 1;
            transform: scale(1.05);
        }
        70% {
            transform: scale(0.9);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes starGlow {
        0% {
            opacity: 0;
            transform: scale(0.5);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
        100% {
            opacity: 1;
            transform: scale(1);
        }
    }
    
    @keyframes slideInLeft {
        from {
            opacity: 0;
            transform: translateX(-50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(50px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
    
    .loaded {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
    
    img:not(.loaded) {
        opacity: 0;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Initialize card hover effects after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initCardHoverEffects();
});

// Mobile menu functionality (if not already in main script.js)
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });
    }
}

// Initialize mobile menu
initMobileMenu();

// Navbar scroll effect
function initNavbarScrollEffect() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Scrolling down
            navbar.style.transform = 'translateY(-100%)';
        } else {
            // Scrolling up
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = scrollTop;
    });
}

// Initialize navbar scroll effect
initNavbarScrollEffect();