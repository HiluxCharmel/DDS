// ================================
// DDS-O Website JavaScript
// Handles all interactive features
// ================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all features
    initHeroSlider();
    initMobileMenu();
    initLanguageSwitcher();
    initForms();
    initSmoothScroll();
    initActiveNavigation();
});

// ================================
// Hero Slider
// ================================
function initHeroSlider() {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.slider-nav.prev');
    const nextBtn = document.querySelector('.slider-nav.next');
    let currentSlide = 0;
    let slideInterval;

    function showSlide(index) {
        // Remove active class from all slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        // Wrap around if necessary
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }

        // Add active class to current slide and dot
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function prevSlide() {
        showSlide(currentSlide - 1);
    }

    function startAutoPlay() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopAutoPlay() {
        clearInterval(slideInterval);
    }

    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        startAutoPlay(); // Restart autoplay after manual navigation
    });

    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        startAutoPlay();
    });

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
            stopAutoPlay();
            startAutoPlay();
        });
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            startAutoPlay();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            startAutoPlay();
        }
    });

    // Start autoplay
    startAutoPlay();

    // Pause on hover
    const sliderContainer = document.querySelector('.hero-slider');
    sliderContainer.addEventListener('mouseenter', stopAutoPlay);
    sliderContainer.addEventListener('mouseleave', startAutoPlay);
}

// ================================
// Mobile Menu
// ================================
function initMobileMenu() {
    const menuToggle = document.querySelector('.mobile-menu-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });

        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuToggle.classList.remove('active');
            });
        });
    }
}

// ================================
// Language Switcher with i18next
// ================================
function initLanguageSwitcher() {
    const langButtons = document.querySelectorAll('.lang-btn');
    
    langButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            langButtons.forEach(b => b.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const selectedLang = this.dataset.lang;
            
            // Change language with i18next
            if (typeof i18next !== 'undefined') {
                i18next.changeLanguage(selectedLang, function(err, t) {
                    if (err) {
                        console.error('Language change error:', err);
                        return;
                    }
                    updateContent();
                    
                    // Update HTML lang attribute
                    document.documentElement.lang = selectedLang;
                    
                    // Store language preference
                    localStorage.setItem('preferredLanguage', selectedLang);
                    
                    // Show notification
                    const message = i18next.t('notifications.languageChanged') + ': ' + selectedLang.toUpperCase();
                    showNotification(message);
                });
            }
        });
    });
    
    // Load saved language preference
    const savedLang = localStorage.getItem('preferredLanguage');
    if (savedLang && typeof i18next !== 'undefined') {
        setTimeout(() => {
            langButtons.forEach(btn => {
                if (btn.dataset.lang === savedLang) {
                    btn.click();
                }
            });
        }, 500);
    }
}

// Update content with translations
function updateContent() {
    // Update all elements with data-i18n attribute
    document.querySelectorAll('[data-i18n]').forEach(function(element) {
        const key = element.getAttribute('data-i18n');
        const translation = i18next.t(key);
        
        // Handle HTML content
        if (translation.includes('<br>')) {
            element.innerHTML = translation;
        } else {
            element.textContent = translation;
        }
    });
    
    // Update placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(element) {
        const key = element.getAttribute('data-i18n-placeholder');
        element.placeholder = i18next.t(key);
    });
}

// ================================
// Forms Handling
// ================================
function initForms() {
    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            console.log('Contact form submitted:', formData);
            
            // Show success message
            const message = i18next ? i18next.t('notifications.messageSent') : 'Message envoyé avec succès! Nous vous contacterons bientôt.';
            showNotification(message);
            
            // Reset form
            contactForm.reset();
        });
    }

    // Appointment Form
    const appointmentForm = document.getElementById('appointmentForm');
    if (appointmentForm) {
        // Set minimum date to today
        const dateInput = document.getElementById('apt-date');
        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.setAttribute('min', today);
        }

        appointmentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('apt-name').value,
                phone: document.getElementById('apt-phone').value,
                email: document.getElementById('apt-email').value,
                service: document.getElementById('apt-service').value,
                date: document.getElementById('apt-date').value,
                time: document.getElementById('apt-time').value,
                notes: document.getElementById('apt-notes').value
            };
            
            console.log('Appointment booked:', formData);
            
            // Show success message with interpolation
            let message;
            if (i18next) {
                message = i18next.t('notifications.appointmentConfirmed', {
                    date: formData.date,
                    time: formData.time
                });
            } else {
                message = `Rendez-vous confirmé pour le ${formData.date} à ${formData.time}. Un SMS de confirmation vous sera envoyé.`;
            }
            showNotification(message);
            
            // Reset form
            appointmentForm.reset();
        });
    }

    // Report Form
    const reportForm = document.getElementById('reportForm');
    if (reportForm) {
        const anonymousCheckbox = document.getElementById('report-anonymous');
        const contactInfo = document.getElementById('contactInfo');

        // Set maximum date to today
        const reportDateInput = document.getElementById('report-date');
        if (reportDateInput) {
            const today = new Date().toISOString().split('T')[0];
            reportDateInput.setAttribute('max', today);
        }

        // Toggle contact info visibility
        if (anonymousCheckbox) {
            anonymousCheckbox.addEventListener('change', function() {
                if (this.checked) {
                    contactInfo.style.display = 'none';
                    // Clear contact fields
                    document.getElementById('report-name').value = '';
                    document.getElementById('report-phone').value = '';
                    document.getElementById('report-email').value = '';
                } else {
                    contactInfo.style.display = 'block';
                }
            });
        }

        reportForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                type: document.getElementById('report-type').value,
                location: document.getElementById('report-location').value,
                date: document.getElementById('report-date').value,
                description: document.getElementById('report-description').value,
                anonymous: document.getElementById('report-anonymous').checked,
                name: document.getElementById('report-name').value,
                phone: document.getElementById('report-phone').value,
                email: document.getElementById('report-email').value
            };
            
            console.log('Report submitted:', formData);
            
            // Show success message
            const message = i18next ? i18next.t('notifications.reportSubmitted') : 'Signalement enregistré avec succès. Nous examinerons votre rapport dans les plus brefs délais.';
            showNotification(message);
            
            // Reset form
            reportForm.reset();
            contactInfo.style.display = 'block';
        });
    }

    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            console.log('Newsletter subscription:', email);
            showNotification('Merci pour votre inscription à la newsletter!');
            this.reset();
        });
    }
}

// ================================
// Smooth Scroll
// ================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty hash
            if (href === '#') return;
            
            const target = document.querySelector(href);
            
            if (target) {
                e.preventDefault();
                
                const headerOffset = 100;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ================================
// Active Navigation Highlighting
// ================================
function initActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-menu a[href^="#"]');

    function highlightNavigation() {
        const scrollPosition = window.scrollY + 150;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });

        // Highlight home when at top
        if (window.scrollY < 100) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#accueil') {
                    link.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', highlightNavigation);
    highlightNavigation(); // Initial call
}

// ================================
// Notification System
// ================================
function showNotification(message, type = 'success') {
    // Remove existing notification
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Add styles
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        backgroundColor: type === 'success' ? '#57a773' : '#d4526e',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '400px',
        fontWeight: '600'
    });

    // Add to page
    document.body.appendChild(notification);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ================================
// Scroll to Top Button (Optional)
// ================================
function initScrollToTop() {
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    
    Object.assign(scrollBtn.style, {
        position: 'fixed',
        bottom: '30px',
        right: '30px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        backgroundColor: 'var(--primary-teal)',
        color: 'white',
        border: 'none',
        fontSize: '24px',
        cursor: 'pointer',
        opacity: '0',
        visibility: 'hidden',
        transition: 'all 0.3s ease',
        zIndex: '999',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });

    document.body.appendChild(scrollBtn);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.style.opacity = '1';
            scrollBtn.style.visibility = 'visible';
        } else {
            scrollBtn.style.opacity = '0';
            scrollBtn.style.visibility = 'hidden';
        }
    });

    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Initialize scroll to top
initScrollToTop();

// ================================
// Form Validation Helpers
// ================================
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[\d\s\+\-\(\)]+$/;
    return re.test(phone) && phone.replace(/\D/g, '').length >= 8;
}

// Add real-time validation to email fields
document.querySelectorAll('input[type="email"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validateEmail(this.value)) {
            this.style.borderColor = '#d4526e';
            const message = i18next ? i18next.t('notifications.invalidEmail') : 'Veuillez entrer une adresse email valide';
            showNotification(message, 'error');
        } else {
            this.style.borderColor = '';
        }
    });
});

// Add real-time validation to phone fields
document.querySelectorAll('input[type="tel"]').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.value && !validatePhone(this.value)) {
            this.style.borderColor = '#d4526e';
            const message = i18next ? i18next.t('notifications.invalidPhone') : 'Veuillez entrer un numéro de téléphone valide';
            showNotification(message, 'error');
        } else {
            this.style.borderColor = '';
        }
    });
});

// ================================
// Lazy Loading for Images (if needed)
// ================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// ================================
// Console Welcome Message
// ================================
console.log('%c🏥 DDS-O Website', 'color: #1a5f7a; font-size: 24px; font-weight: bold;');
console.log('%cDirection Départementale de la Santé de l\'Ouémé', 'color: #57a773; font-size: 14px;');
console.log('%cVotre santé, notre priorité', 'color: #4a5568; font-size: 12px;');
