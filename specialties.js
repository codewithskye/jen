// Specialties Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeSpecialtiesPage();
});

function initializeSpecialtiesPage() {
    // Initialize all features
    initializeAnimations();
    initializeCounters();
    initializeScrollEffects();
    initializeCardInteractions();
    initializeProgressBars();
    initializeTooltips();
    initializeSmoothScrolling();
    initializeAccessibility();
    addProgressBarStyles(); // Moved inside to ensure DOM is ready
}

// Animation on scroll
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                
                // Add stagger effect for cards
                if (entry.target.classList.contains('ethics-card') || 
                    entry.target.classList.contains('tip-card') ||
                    entry.target.classList.contains('certification-item')) {
                    const cards = entry.target.parentElement.children;
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
                
                // Trigger counter animation for stats
                if (entry.target.classList.contains('stat-item')) {
                    const numberElement = entry.target.querySelector('.stat-number');
                    if (numberElement && !numberElement.classList.contains('counted')) {
                        animateCounter(numberElement);
                    }
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll(
        '.ethics-card, .certification-item, .stat-item, .tip-card, .section-intro'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Counter animation for impact stats
function initializeCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        counter.textContent = '0';
    });
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;
    
    element.classList.add('counted');
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
    
    // Add animation class
    element.style.animation = 'countUp 0.5s ease-out';
}

// Scroll effects (parallax removed to prevent overlap)
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        
        // Parallax removed - no transform on header
        // const parallaxElements = document.querySelectorAll('.page-header');
        // parallaxElements.forEach(element => {
        //     const speed = 0.5;
        //     element.style.transform = `translateY(${scrolled * speed}px)`;
        // });
        
        // Update progress indicator
        updateReadingProgress();
        
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateScrollEffects);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick);
}

// Reading progress indicator
function updateReadingProgress() {
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (winScroll / height) * 100;
    
    let progressBar = document.getElementById('reading-progress');
    if (!progressBar) {
        progressBar = document.createElement('div');
        progressBar.id = 'reading-progress';
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: ${scrolled}%;
            height: 3px;
            background: linear-gradient(90deg, #e6007e, #ff4da6);
            z-index: 9999;
            transition: width 0.1s ease;
        `;
        document.body.appendChild(progressBar);
    } else {
        progressBar.style.width = scrolled + '%';
    }
}

// Card interactions and hover effects
function initializeCardInteractions() {
    const cards = document.querySelectorAll('.ethics-card, .tip-card, .certification-item');
    
    cards.forEach(card => {
        // Enhanced hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
            
            // Add glow effect
            this.style.boxShadow = '0 20px 50px rgba(230, 0, 126, 0.2)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = '';
        });
        
        // Click tracking
        card.addEventListener('click', function() {
            trackCardInteraction(this);
        });
    });
}

// Track card interactions
function trackCardInteraction(card) {
    const cardTitle = card.querySelector('h3')?.textContent || 'Unknown Card';
    try {
        const interactions = JSON.parse(localStorage.getItem('cardInteractions') || '{}');
        interactions[cardTitle] = (interactions[cardTitle] || 0) + 1;
        localStorage.setItem('cardInteractions', JSON.stringify(interactions));
    } catch (e) {
        console.warn('LocalStorage error (quota?):', e);
    }
    console.log(`Card interaction: ${cardTitle}`);
}

// Progress bars for certifications
function initializeProgressBars() {
    const certItems = document.querySelectorAll('.certification-item');
    
    certItems.forEach((item, index) => {
        // Add progress indicator
        const progressContainer = document.createElement('div');
        progressContainer.className = 'cert-progress';
        progressContainer.innerHTML = `
            <div class="progress-bar">
                <div class="progress-fill" style="width: 0%"></div>
            </div>
            <span class="progress-text">Certification Level</span>
        `;
        
        item.appendChild(progressContainer);
        
        // Animate progress bar on scroll
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const progressFill = entry.target.querySelector('.progress-fill');
                    if (progressFill) { // Null check to prevent errors
                        const targetWidth = 85 + (index * 3); // Varying completion levels
                        
                        setTimeout(() => {
                            progressFill.style.width = `${targetWidth}%`;
                            progressFill.style.transition = 'width 1.5s ease-out';
                        }, index * 200);
                    }
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 }); // Added threshold for better control
        
        observer.observe(item);
    });
}

// Tooltips for icons
function initializeTooltips() {
    const icons = document.querySelectorAll('.card-icon, .tip-icon, .cert-icon');
    
    icons.forEach(icon => {
        icon.addEventListener('mouseenter', function(e) {
            const tooltip = createTooltip(getTooltipText(this));
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.left = rect.left + rect.width / 2 - tooltip.offsetWidth / 2 + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 10);
        });
        
        icon.addEventListener('mouseleave', function() {
            const tooltip = document.querySelector('.custom-tooltip');
            if (tooltip) {
                tooltip.style.opacity = '0';
                tooltip.style.transform = 'translateY(-10px)';
                setTimeout(() => tooltip.remove(), 200);
            }
        });
    });
}

function createTooltip(text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
        position: absolute;
        background: #1a1a1a;
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 12px;
        font-family: 'Open Sans', sans-serif;
        z-index: 10000;
        opacity: 0;
        transform: translateY(-10px);
        transition: all 0.2s ease;
        pointer-events: none;
        white-space: nowrap;
    `;
    return tooltip;
}

function getTooltipText(element) {
    const card = element.closest('.ethics-card, .tip-card, .certification-item');
    if (card) {
        const title = card.querySelector('h3')?.textContent;
        return `Learn more about ${title}`;
    }
    return 'Click for more information';
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const offsetTop = targetElement.getBoundingClientRect().top + window.pageYOffset - 100;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Update URL without jumping
                history.pushState(null, null, `#${targetId}`);
            }
        });
    });
}

// Accessibility improvements
function initializeAccessibility() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.ethics-card, .tip-card, .certification-item');
    
    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Information card ${index + 1}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Focus indicators
        card.addEventListener('focus', function() {
            this.style.outline = '3px solid #e6007e';
            this.style.outlineOffset = '2px';
        });
        
        card.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
    
    // Skip to content link
    const skipLink = document.createElement('a');
    skipLink.href = '#ethical-travel';
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
        z-index: 10000;
        transition: top 0.3s ease;
    `;
    
    skipLink.addEventListener('focus', function() {
        this.style.top = '6px';
    });
    
    skipLink.addEventListener('blur', function() {
        this.style.top = '-40px';
    });
    
    document.body.insertBefore(skipLink, document.body.firstChild);
}

// Dynamic CSS for progress bars
function addProgressBarStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .cert-progress {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }
        
        .progress-bar {
            width: 100%;
            height: 6px;
            background: #f0f0f0;
            border-radius: 3px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        
        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #e6007e, #ff4da6);
            border-radius: 3px;
            width: 0%;
        }
        
        .progress-text {
            font-family: 'Open Sans', sans-serif;
            font-size: 0.8rem;
            color: #666;
            font-weight: 600;
        }
        
        @media (prefers-color-scheme: dark) {
            .progress-bar {
                background: #444;
            }
            
            .progress-text {
                color: #ccc;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Intersection Observer for lazy loading effects
function initializeLazyEffects() {
    const lazyElements = document.querySelectorAll('.ethics-card, .tip-card');
    
    const lazyObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('loaded');
                lazyObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1
    });
    
    lazyElements.forEach(el => lazyObserver.observe(el));
}

// Initialize lazy effects
initializeLazyEffects();

// Performance monitoring
function monitorPerformance() {
    // Monitor page load performance
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        console.log(`Specialties page loaded in ${loadTime.toFixed(2)}ms`);
        
        // Track to localStorage for analytics
        try {
            const performanceData = JSON.parse(localStorage.getItem('pagePerformance') || '{}');
            performanceData.specialties = loadTime;
            localStorage.setItem('pagePerformance', JSON.stringify(performanceData));
        } catch (e) {
            console.warn('Performance storage error:', e);
        }
    });
}

// Initialize performance monitoring
monitorPerformance();

// Notification system
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontFamily: 'Montserrat, sans-serif',
        fontWeight: '600',
        fontSize: '14px',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px'
    });
    
    const colors = {
        success: '#28a745',
        error: '#e74c3c',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Analytics tracking
function trackPageView() {
    console.log('Specialties page viewed');
    
    // Track scroll depth
    let maxScroll = 0;
    window.addEventListener('scroll', function() {
        const scrollPercent = Math.round((window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100);
        if (scrollPercent > maxScroll) {
            maxScroll = scrollPercent;
        }
    });
    
    // Track on page unload
    window.addEventListener('beforeunload', function() {
        try {
            const analytics = JSON.parse(localStorage.getItem('pageAnalytics') || '{}');
            analytics.specialtiesMaxScroll = maxScroll;
            analytics.specialtiesTimeSpent = Date.now() - (analytics.specialtiesStartTime || Date.now());
            localStorage.setItem('pageAnalytics', JSON.stringify(analytics));
        } catch (e) {
            console.warn('Analytics storage error:', e);
        }
    });
    
    // Set start time
    try {
        const analytics = JSON.parse(localStorage.getItem('pageAnalytics') || '{}');
        analytics.specialtiesStartTime = Date.now();
        localStorage.setItem('pageAnalytics', JSON.stringify(analytics));
    } catch (e) {
        console.warn('Analytics init storage error:', e);
    }
}

// Initialize analytics
trackPageView();

// Error handling (notification removed to prevent popups; log only)
window.addEventListener('error', function(e) {
    console.error('Specialties page error:', e.error);
    // Notification removed - no showNotification call
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});

// Debounce utility function
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

// Throttle utility function
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