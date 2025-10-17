// Promotions Page JavaScript

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initializePromotionsPage();
});

function initializePromotionsPage() {
    // Initialize all features
    initializeAnimations();
    initializeNewsletterForm();
    initializePromotionCards();
    initializeScrollEffects();
    initializeFavorites();
    initializeFilterAnimations();
    initializeCountdown();
    initializeShareFeatures();
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
                
                // Add stagger effect for promotion cards
                if (entry.target.classList.contains('promotion-card')) {
                    const cards = document.querySelectorAll('.promotion-card');
                    const index = Array.from(cards).indexOf(entry.target);
                    entry.target.style.animationDelay = `${index * 0.1}s`;
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.promotion-card, .featured-deal, .newsletter-section, .return-message');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// Newsletter form handling
function initializeNewsletterForm() {
    const form = document.getElementById('newsletter-form');
    const emailInput = document.getElementById('newsletter-email');

    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = emailInput.value.trim();
            
            if (validateEmail(email)) {
                // Simulate newsletter subscription
                showNotification('Thank you for subscribing! You\'ll receive our latest deals soon.', 'success');
                emailInput.value = '';
                
                // Add to local storage
                const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
                if (!subscribers.includes(email)) {
                    subscribers.push(email);
                    localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
                }
            } else {
                showNotification('Please enter a valid email address.', 'error');
            }
        });

        // Real-time email validation
        emailInput.addEventListener('input', function() {
            const email = this.value.trim();
            if (email && !validateEmail(email)) {
                this.style.borderColor = '#e74c3c';
            } else {
                this.style.borderColor = '#ddd';
            }
        });
    }
}

// Email validation function
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Promotion cards interactions
function initializePromotionCards() {
    const cards = document.querySelectorAll('.promotion-card');
    
    cards.forEach(card => {
        // Add hover effects
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
        
        // Add click tracking
        const ctaButton = card.querySelector('.btn-outline');
        if (ctaButton) {
            ctaButton.addEventListener('click', function(e) {
                const promotionTitle = card.querySelector('h3').textContent;
                trackPromotionClick(promotionTitle);
            });
        }
    });
}

// Track promotion clicks
function trackPromotionClick(promotionTitle) {
    const clicks = JSON.parse(localStorage.getItem('promotionClicks') || '{}');
    clicks[promotionTitle] = (clicks[promotionTitle] || 0) + 1;
    localStorage.setItem('promotionClicks', JSON.stringify(clicks));
    
    console.log(`Promotion clicked: ${promotionTitle}`);
}

// Scroll effects
function initializeScrollEffects() {
    let ticking = false;
    
    function updateScrollEffects() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.page-header');
        
        parallaxElements.forEach(element => {
            const speed = 0.5;
            element.style.transform = `translateY(${scrolled * speed}px)`;
        });
        
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

// Favorites functionality
function initializeFavorites() {
    const cards = document.querySelectorAll('.promotion-card');
    
    cards.forEach(card => {
        // Add favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.setAttribute('aria-label', 'Add to favorites');
        
        const cardHeader = card.querySelector('.card-header');
        cardHeader.style.position = 'relative';
        cardHeader.appendChild(favoriteBtn);
        
        // Check if already favorited
        const promotionTitle = card.querySelector('h3').textContent;
        const favorites = JSON.parse(localStorage.getItem('favoritePromotions') || '[]');
        
        if (favorites.includes(promotionTitle)) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        // Handle favorite toggle
        favoriteBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            toggleFavorite(promotionTitle, favoriteBtn);
        });
    });
}

// Toggle favorite status
function toggleFavorite(promotionTitle, button) {
    const favorites = JSON.parse(localStorage.getItem('favoritePromotions') || '[]');
    const index = favorites.indexOf(promotionTitle);
    
    if (index > -1) {
        // Remove from favorites
        favorites.splice(index, 1);
        button.classList.remove('favorited');
        button.innerHTML = '<i class="far fa-heart"></i>';
        showNotification('Removed from favorites', 'info');
    } else {
        // Add to favorites
        favorites.push(promotionTitle);
        button.classList.add('favorited');
        button.innerHTML = '<i class="fas fa-heart"></i>';
        showNotification('Added to favorites', 'success');
    }
    
    localStorage.setItem('favoritePromotions', JSON.stringify(favorites));
    
    // Animate button
    button.style.transform = 'scale(1.3)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 200);
}

// Filter animations (for future filter functionality)
function initializeFilterAnimations() {
    // Placeholder for filter animations
    // This can be expanded when filters are added
}

// Countdown timer for limited offers
function initializeCountdown() {
    const countdownElements = document.querySelectorAll('[data-countdown]');
    
    countdownElements.forEach(element => {
        const endDate = new Date(element.dataset.countdown);
        
        function updateCountdown() {
            const now = new Date().getTime();
            const distance = endDate - now;
            
            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                element.innerHTML = `${days}d ${hours}h ${minutes}m ${seconds}s`;
            } else {
                element.innerHTML = 'Offer Expired';
                element.style.color = '#e74c3c';
            }
        }
        
        updateCountdown();
        setInterval(updateCountdown, 1000);
    });
}

// Share functionality
function initializeShareFeatures() {
    const cards = document.querySelectorAll('.promotion-card');
    
    cards.forEach(card => {
        // Add share button
        const shareBtn = document.createElement('button');
        shareBtn.className = 'share-btn';
        shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
        shareBtn.setAttribute('aria-label', 'Share promotion');
        
        const cardHeader = card.querySelector('.card-header');
        cardHeader.appendChild(shareBtn);
        
        shareBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const promotionTitle = card.querySelector('h3').textContent;
            sharePromotion(promotionTitle);
        });
    });
}

// Share promotion
function sharePromotion(title) {
    if (navigator.share) {
        navigator.share({
            title: `${title} - Epic Adventures by Jen`,
            text: `Check out this amazing travel deal: ${title}`,
            url: window.location.href
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: copy to clipboard
        const shareText = `Check out this amazing travel deal: ${title} - ${window.location.href}`;
        
        if (navigator.clipboard) {
            navigator.clipboard.writeText(shareText).then(() => {
                showNotification('Link copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = shareText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification('Link copied to clipboard!', 'success');
        }
    }
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
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
        maxWidth: '300px',
        wordWrap: 'break-word'
    });
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#e74c3c',
        info: '#17a2b8',
        warning: '#ffc107'
    };
    
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 4000);
}

// Add CSS for favorite and share buttons
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .favorite-btn, .share-btn {
            position: absolute;
            top: 15px;
            background: rgba(255, 255, 255, 0.9);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            backdrop-filter: blur(10px);
            z-index: 3;
        }
        
        .favorite-btn {
            left: 15px;
        }
        
        .share-btn {
            left: 65px;
        }
        
        .favorite-btn:hover, .share-btn:hover {
            background: white;
            transform: scale(1.1);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        
        .favorite-btn i {
            color: #e6007e;
            font-size: 18px;
        }
        
        .share-btn i {
            color: #666;
            font-size: 16px;
        }
        
        .favorite-btn.favorited i {
            color: #e6007e;
        }
        
        .promotion-card:hover .favorite-btn,
        .promotion-card:hover .share-btn {
            opacity: 1;
        }
        
        @media (max-width: 768px) {
            .favorite-btn, .share-btn {
                opacity: 1;
            }
        }
    `;
    
    document.head.appendChild(style);
}

// Initialize dynamic styles
addDynamicStyles();

// Performance optimization: Debounce scroll events
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

// Lazy loading for images (if needed)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Initialize lazy loading if needed
if (document.querySelectorAll('img[data-src]').length > 0) {
    initializeLazyLoading();
}

// Analytics tracking (placeholder)
function trackPageView() {
    // Placeholder for analytics tracking
    console.log('Promotions page viewed');
}

// Track page view
trackPageView();

// Accessibility improvements
function improveAccessibility() {
    // Add keyboard navigation for cards
    const cards = document.querySelectorAll('.promotion-card');
    
    cards.forEach((card, index) => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'article');
        card.setAttribute('aria-label', `Promotion ${index + 1}`);
        
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const ctaButton = this.querySelector('.btn-outline');
                if (ctaButton) {
                    ctaButton.click();
                }
            }
        });
    });
}

// Initialize accessibility improvements
improveAccessibility();

// Error handling
window.addEventListener('error', function(e) {
    console.error('Promotions page error:', e.error);
});

// Unhandled promise rejection handling
window.addEventListener('unhandledrejection', function(e) {
    console.error('Unhandled promise rejection:', e.reason);
});