// Tanshvi Consulting Website JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initContactForm();
    initSmoothScrolling();
    initNavbarScroll();
    initScrollAnimations();
    updateActiveNavLink();
});

// Navigation functionality
function initNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
        
        // Close menu when clicking on a link
        const navLinks = navMenu.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target) || navToggle.contains(event.target);
            
            if (!isClickInsideNav && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Smooth scrolling for navigation links
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Add scroll effect to navbar
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    const handleScroll = debounce(function() {
        const scrolled = window.scrollY > 50;
        
        if (scrolled) {
            navbar.style.backgroundColor = 'rgba(255, 255, 253, 0.95)';
            navbar.style.backdropFilter = 'blur(10px)';
            navbar.style.boxShadow = 'var(--shadow-md)';
        } else {
            navbar.style.backgroundColor = '';
            navbar.style.backdropFilter = '';
            navbar.style.boxShadow = 'var(--shadow-sm)';
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
}

// Contact form functionality
function initContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(contactForm);
            const formObject = {};
            
            for (let [key, value] of formData.entries()) {
                formObject[key] = value;
            }
            
            // Validate required fields
            const requiredFields = ['name', 'email', 'message'];
            const missingFields = requiredFields.filter(field => !formObject[field] || !formObject[field].trim());
            
            if (missingFields.length > 0) {
                showFormMessage('Please fill in all required fields.', 'error');
                highlightMissingFields(missingFields);
                return;
            }
            
            // Validate email format
            if (!isValidEmail(formObject.email)) {
                showFormMessage('Please enter a valid email address.', 'error');
                highlightField('email');
                return;
            }
            
            // Clear any existing error highlights
            clearFieldHighlights();
            
            // Simulate form submission
            submitForm(formObject);
        });
        
        // Clear error highlights when user starts typing
        const formInputs = contactForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('input', function() {
                this.classList.remove('error');
            });
        });
    }
}

// Form submission simulation
function submitForm(formData) {
    const submitButton = document.querySelector('#contactForm button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.classList.add('loading');
    submitButton.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Reset button state
        submitButton.classList.remove('loading');
        submitButton.disabled = false;
        
        // Show success message
        showFormMessage('Thank you for your message! We\'ll get back to you within 24 hours.', 'success');
        
        // Reset form
        document.getElementById('contactForm').reset();
        
        // Log form data (in real implementation, this would be sent to a server)
        console.log('Form submitted with data:', formData);
        
        // Track form submission (placeholder for analytics)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'form_submit', {
                event_category: 'Contact',
                event_label: 'Contact Form'
            });
        }
    }, 2000);
}

// Email validation
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Highlight missing fields
function highlightMissingFields(fields) {
    fields.forEach(fieldName => {
        const field = document.getElementById(fieldName);
        if (field) {
            field.classList.add('error');
        }
    });
}

// Highlight specific field
function highlightField(fieldName) {
    const field = document.getElementById(fieldName);
    if (field) {
        field.classList.add('error');
    }
}

// Clear field highlights
function clearFieldHighlights() {
    const errorFields = document.querySelectorAll('.form-control.error');
    errorFields.forEach(field => {
        field.classList.remove('error');
    });
}

// Show form messages
function showFormMessage(message, type = 'info') {
    // Remove any existing message
    const existingMessage = document.querySelector('.form-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message element
    const messageElement = document.createElement('div');
    messageElement.className = `form-message status status--${type}`;
    messageElement.textContent = message;
    
    // Insert message before the form
    const form = document.getElementById('contactForm');
    form.parentNode.insertBefore(messageElement, form);
    
    // Auto-remove message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 5000);
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Intersection Observer for animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                // Stop observing this element once it's animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements that should animate
    const animateElements = document.querySelectorAll('.service-card, .testimonial-card, .blog-card, .solution-item');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    
    const handleScroll = debounce(function() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.offsetHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once on load
}

// Utility function to debounce scroll events
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

// Add CSS for error states and form animations
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .form-control.error {
            border-color: var(--color-error) !important;
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.1) !important;
        }
        
        .form-control.error:focus {
            border-color: var(--color-error) !important;
            box-shadow: 0 0 0 3px rgba(var(--color-error-rgb), 0.2) !important;
        }
        
        /* Service card hover animations */
        .service-card {
            transform-origin: center;
        }
        
        .service-card:hover .service-icon {
            transform: scale(1.1);
            transition: transform var(--duration-normal) var(--ease-standard);
        }
        
        /* Testimonial card animations */
        .testimonial-card:hover .testimonial-rating .star {
            animation: starPulse 0.6s ease-in-out;
        }
        
        @keyframes starPulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.2); }
        }
        
        /* Blog card hover effects */
        .blog-card:hover .blog-placeholder {
            transform: scale(1.1);
            transition: transform var(--duration-normal) var(--ease-standard);
        }
        
        /* Solution item hover effects */
        .solution-item:hover .solution-number {
            transform: scale(1.1);
            background: var(--color-primary-hover);
            transition: all var(--duration-normal) var(--ease-standard);
        }
        
        /* Scroll progress indicator */
        .scroll-progress {
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--color-primary), var(--color-teal-400));
            z-index: 1001;
            transition: width 0.1s ease;
        }
        
        /* Back to top button */
        .back-to-top {
            position: fixed;
            bottom: var(--space-20);
            right: var(--space-20);
            width: 50px;
            height: 50px;
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: none;
            align-items: center;
            justify-content: center;
            font-size: var(--font-size-lg);
            box-shadow: var(--shadow-lg);
            transition: all var(--duration-normal) var(--ease-standard);
            z-index: 1000;
        }
        
        .back-to-top:hover {
            background: var(--color-primary-hover);
            transform: translateY(-2px);
        }
        
        .back-to-top.show {
            display: flex;
        }
    `;
    document.head.appendChild(style);
}

// Initialize scroll progress and back to top button
function initScrollProgress() {
    // Create scroll progress bar
    const progressBar = document.createElement('div');
    progressBar.className = 'scroll-progress';
    document.body.appendChild(progressBar);
    
    // Create back to top button
    const backToTop = document.createElement('button');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '↑';
    backToTop.title = 'Back to top';
    document.body.appendChild(backToTop);
    
    // Handle scroll events
    const handleScroll = debounce(function() {
        // Update progress bar
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
        
        // Show/hide back to top button
        if (winScroll > 300) {
            backToTop.classList.add('show');
        } else {
            backToTop.classList.remove('show');
        }
    }, 10);
    
    window.addEventListener('scroll', handleScroll);
    
    // Back to top click handler
    backToTop.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize advanced features
function initAdvancedFeatures() {
    // Add dynamic styles
    addDynamicStyles();
    
    // Initialize scroll progress and back to top
    initScrollProgress();
    
    // Add keyboard navigation support
    initKeyboardNavigation();
    
    // Initialize lazy loading for blog images
    initLazyLoading();
}

// Keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', function(e) {
        // Skip if user is typing in a form field
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        // ESC key closes mobile menu
        if (e.key === 'Escape') {
            const navMenu = document.getElementById('navMenu');
            const navToggle = document.getElementById('navToggle');
            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        }
    });
}

// Lazy loading for images (if any are added later)
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    }
}

// Performance optimization - preload critical resources
function preloadCriticalResources() {
    // Preload fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'preload';
    fontLink.href = 'https://r2cdn.perplexity.ai/fonts/FKGroteskNeue.woff2';
    fontLink.as = 'font';
    fontLink.type = 'font/woff2';
    fontLink.crossOrigin = 'anonymous';
    document.head.appendChild(fontLink);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add a small delay to ensure all elements are rendered
    setTimeout(() => {
        initAdvancedFeatures();
        preloadCriticalResources();
    }, 100);
});

// Handle page visibility changes (for analytics and performance)
document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
        // Page is hidden - pause any running animations or timers
        console.log('Page hidden - optimizing performance');
    } else {
        // Page is visible - resume normal operation
        console.log('Page visible - resuming normal operation');
    }
});

// Error handling for any JavaScript errors
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service Worker registration (for future PWA features)
if ('serviceWorker' in navigator && window.location.protocol === 'https:') {
    window.addEventListener('load', function() {
        // Register service worker when available
        // navigator.serviceWorker.register('/sw.js');
    });
}

// Export functions for potential external use
window.TanshviConsulting = {
    showFormMessage,
    scrollToSection: function(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    },
    openContactForm: function() {
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => {
                const nameField = document.getElementById('name');
                if (nameField) nameField.focus();
            }, 500);
        }
    }
};