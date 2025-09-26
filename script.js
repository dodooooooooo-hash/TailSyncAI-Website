// TailSync AI Landing Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initNavigation();
    initCarousel();
    initScrollAnimations();
    initBackToTop();
    initDownloadTracking();
    initSmoothScrolling();
    initAOS();
});

// Navigation functionality
function initNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    const navbar = document.getElementById('navbar');

    // Mobile menu toggle
    hamburger.addEventListener('click', function() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Carousel functionality
function initCarousel() {
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dotsContainer = document.getElementById('carousel-dots');
    const slides = document.querySelectorAll('.screenshot-slide');

    if (!track || !slides.length) return;

    let currentSlide = 0;
    const totalSlides = slides.length;
    const slideWidth = slides[0].offsetWidth + 30; // Include margin

    // Create dots
    createCarouselDots();

    // Set initial position
    updateCarousel();

    // Event listeners
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            updateCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
        });
    }

    // Auto-play carousel
    setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }, 5000);

    // Touch/swipe support
    let startX = 0;
    let isDragging = false;

    track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
    });

    track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
    });

    track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        const endX = e.changedTouches[0].clientX;
        const diff = startX - endX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                currentSlide = (currentSlide + 1) % totalSlides;
            } else {
                currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            }
            updateCarousel();
        }
        isDragging = false;
    });

    function createCarouselDots() {
        if (!dotsContainer) return;

        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                currentSlide = i;
                updateCarousel();
            });

            dotsContainer.appendChild(dot);
        }
    }

    function updateCarousel() {
        const offset = -(currentSlide * slideWidth) + (window.innerWidth / 2) - (slideWidth / 2);
        track.style.transform = `translateX(${offset}px)`;

        // Update dots
        const dots = dotsContainer.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    // Responsive update
    window.addEventListener('resize', () => {
        updateCarousel();
    });
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
                entry.target.classList.add('animate-in');

                // Special animation for counter elements
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll([
        '.feature-card',
        '.step',
        '.stat-number',
        '.screenshot-slide'
    ].join(','));

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

// Counter animation
function animateCounter(element) {
    const target = parseInt(element.textContent.replace(/[^\d]/g, ''));
    const duration = 2000;
    const start = performance.now();
    const suffix = element.textContent.replace(/[\d]/g, '');

    function updateCounter(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);

        element.textContent = current + suffix;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        }
    }

    requestAnimationFrame(updateCounter);
}

// Back to top functionality
function initBackToTop() {
    const backToTopBtn = document.getElementById('back-to-top');

    if (!backToTopBtn) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Download tracking and app store redirection
function initDownloadTracking() {
    const downloadButtons = document.querySelectorAll('.download-btn, .download-link');

    downloadButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            const platform = this.dataset.platform;

            // Track download attempt (can be integrated with analytics)
            trackDownload(platform);

            // Redirect to appropriate app store
            redirectToAppStore(platform);
        });
    });
}

function trackDownload(platform) {
    // Google Analytics tracking (if implemented)
    if (typeof gtag !== 'undefined') {
        gtag('event', 'download_attempt', {
            'platform': platform,
            'event_category': 'app_download',
            'event_label': platform
        });
    }

    // Console log for development
    console.log(`Download attempt tracked: ${platform}`);
}

function redirectToAppStore(platform) {
    const urls = {
        ios: 'https://apps.apple.com/app/tailsync-ai', // Replace with actual App Store URL
        android: 'https://play.google.com/store/apps/details?id=com.tailsyncai' // Replace with actual Play Store URL
    };

    const fallbackUrls = {
        ios: 'https://www.apple.com/app-store/',
        android: 'https://play.google.com/store'
    };

    // Detect platform if not specified
    if (!platform) {
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.includes('iphone') || userAgent.includes('ipad')) {
            platform = 'ios';
        } else if (userAgent.includes('android')) {
            platform = 'android';
        } else {
            // Default to iOS for desktop users
            platform = 'ios';
        }
    }

    // Open app store URL
    const url = urls[platform] || fallbackUrls[platform];
    window.open(url, '_blank');
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));

            if (target) {
                const offsetTop = target.offsetTop - 70; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Animate On Scroll (AOS) alternative implementation
function initAOS() {
    const aosElements = document.querySelectorAll('[data-aos]');

    const aosObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const delay = entry.target.dataset.aosDelay || 0;

                setTimeout(() => {
                    entry.target.classList.add('aos-animate');
                }, delay);

                aosObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    aosElements.forEach(el => {
        aosObserver.observe(el);
    });
}

// Parallax effect for decorative elements
function initParallax() {
    const parallaxElements = document.querySelectorAll('.decoration-circle');

    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;

        parallaxElements.forEach((element, index) => {
            const speed = (index + 1) * 0.3;
            element.style.transform = `translateY(${rate * speed}px)`;
        });
    });
}

// Initialize parallax after DOM load
document.addEventListener('DOMContentLoaded', initParallax);

// Floating animation for emotion bubbles
function initFloatingAnimation() {
    const emotionBubbles = document.querySelectorAll('.emotion-bubble');

    emotionBubbles.forEach((bubble, index) => {
        // Add random floating animation
        const randomDelay = Math.random() * 2;
        const randomDuration = 3 + Math.random() * 2;

        bubble.style.animationDelay = `${randomDelay}s`;
        bubble.style.animationDuration = `${randomDuration}s`;
    });
}

// Initialize floating animations
document.addEventListener('DOMContentLoaded', initFloatingAnimation);

// Form handling (if contact form is added later)
function initFormHandling() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Handle form submission
            console.log('Form submitted');
        });
    });
}

// Performance optimization: Lazy load images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => {
        imageObserver.observe(img);
    });
}

// Keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const hamburger = document.getElementById('hamburger');
            const navMenu = document.getElementById('nav-menu');

            if (hamburger && navMenu) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
        }

        // Arrow keys for carousel navigation
        if (e.key === 'ArrowLeft') {
            const prevBtn = document.getElementById('prev-btn');
            if (prevBtn) prevBtn.click();
        }

        if (e.key === 'ArrowRight') {
            const nextBtn = document.getElementById('next-btn');
            if (nextBtn) nextBtn.click();
        }
    });
}

// Initialize keyboard navigation
document.addEventListener('DOMContentLoaded', initKeyboardNavigation);

// Error handling for missing elements
function safeQuerySelector(selector) {
    const element = document.querySelector(selector);
    if (!element) {
        console.warn(`Element not found: ${selector}`);
    }
    return element;
}

// Utility function for throttling scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll-heavy functions
const throttledScrollHandler = throttle(() => {
    // Throttled scroll operations
}, 16); // ~60fps

window.addEventListener('scroll', throttledScrollHandler);

// Cookie consent (if needed)
function initCookieConsent() {
    // Implementation for cookie consent banner
    // This can be added later based on requirements
}

// Analytics initialization (placeholder)
function initAnalytics() {
    // Google Analytics initialization
    // This will be uncommented when GA_MEASUREMENT_ID is provided
    /*
    if (typeof gtag !== 'undefined') {
        gtag('config', 'GA_MEASUREMENT_ID', {
            page_title: 'TailSync AI - Pet Emotion Analysis App',
            page_location: window.location.href
        });
    }
    */
}

// Initialize analytics
document.addEventListener('DOMContentLoaded', initAnalytics);

// Service Worker registration (for PWA features)
function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
}