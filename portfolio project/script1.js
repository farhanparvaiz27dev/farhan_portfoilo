// DOM Elements
const header = document.getElementById('header');
const menuToggle = document.getElementById('menuToggle');
const mobileNav = document.getElementById('mobileNav');
const home = document.getElementById('home');
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toastMessage');

// Header scroll effect
let isScrolled = false;

function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const shouldBeScrolled = scrollTop > 50;
    
    if (shouldBeScrolled !== isScrolled) {
        isScrolled = shouldBeScrolled;
        header.classList.toggle('scrolled', isScrolled);
    }
}

// Mobile menu toggle
let isMenuOpen = false;

function toggleMobileMenu() {
    isMenuOpen = !isMenuOpen;
    mobileNav.classList.toggle('active', isMenuOpen);
    
    // Animate hamburger
    const hamburgers = menuToggle.querySelectorAll('.hamburger');
    hamburgers.forEach((line, index) => {
        if (isMenuOpen) {
            if (index === 0) {
                line.style.transform = 'rotate(45deg) translate(5px, 5px)';
            } else if (index === 1) {
                line.style.opacity = '0';
            } else if (index === 2) {
                line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            }
        } else {
            line.style.transform = 'none';
            line.style.opacity = '1';
        }
    });
}

// Smooth scrolling for navigation links
function scrollToSection(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        const headerHeight = header.offsetHeight;
        const elementPosition = element.offsetTop - headerHeight;
        
        window.scrollTo({
            top: elementPosition,
            behavior: 'smooth'
        });
        
        // Close mobile menu if open
        if (isMenuOpen) {
            toggleMobileMenu();
        }
    }
}

// Contact scroll function (called from HTML)
function scrollToContact() {
    scrollToSection('#contact');
}

// Active navigation link highlighting
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    
    let currentSection = '';
    const headerHeight = header.offsetHeight;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - headerHeight - 100;
        const sectionHeight = section.clientHeight;
        
        if (window.pageYOffset >= sectionTop && window.pageYOffset < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// Skills animation with Intersection Observer
function initSkillsAnimation() {
    const skillsSection = document.getElementById('skills');
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Animate skill bars
                skillBars.forEach((bar, index) => {
                    setTimeout(() => {
                        const width = bar.getAttribute('data-width');
                        bar.style.setProperty('--width', width + '%');
                        bar.classList.add('animate');
                    }, index * 100);
                });
                
                // Stop observing after animation
                observer.unobserve(skillsSection);
            }
        });
    }, observerOptions);
    
    if (skillsSection) {
        observer.observe(skillsSection);
    }
}

// Form handling
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(contactForm);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        mobileNumber: formData.get('mobileNumber'),
        emailSubject: formData.get('emailSubject'),
        message: formData.get('message')
    };
    
    // Basic validation
    if (!data.name || !data.email || !data.emailSubject || !data.message) {
        showToast('Please fill in all required fields.', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        showToast('Please enter a valid email address.', 'error');
        return;
    }
    
    // Simulate form submission
    showToast('Thank you for your message! I will get back to you soon.', 'success');
    contactForm.reset();
}

// Toast notification system
function showToast(message, type = 'success') {
    toastMessage.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');
    
    setTimeout(() => {
        hideToast();
    }, 5000);
}

function hideToast() {
    toast.classList.remove('show');
}

// Card hover effects
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.journey-card, .skills-card, .contact-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// Initialize animations for elements coming into view
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.hero-text, .hero-image, .about-image, .about-text, .journey-card, .skills-card');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    animatedElements.forEach(element => {
        // Set initial state
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        observer.observe(element);
    });
}

// Social media link handlers
function initSocialLinks() {
    const socialLinks = document.querySelectorAll('.social-link');
    
    socialLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            if (link.getAttribute('href') === '#') {
                event.preventDefault();
                showToast('Social media link coming soon!', 'info');
            }
        });
    });
}

// Keyboard navigation support
function initKeyboardNavigation() {
    document.addEventListener('keydown', (event) => {
        // ESC key closes mobile menu
        if (event.key === 'Escape' && isMenuOpen) {
            toggleMobileMenu();
        }
        
        // Enter key on toast closes it
        if (event.key === 'Enter' && toast.classList.contains('show')) {
            hideToast();
        }
    });
}

// Smooth page transitions
function initPageTransitions() {
    // Add entrance animation to body
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// Performance optimization: Debounced scroll handler
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

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Initialize all features
    initSkillsAnimation();
    initCardHoverEffects();
    initScrollAnimations();
    initSocialLinks();
    initKeyboardNavigation();
    initPageTransitions();
    
    // Set up event listeners
    window.addEventListener('scroll', debounce(() => {
        handleScroll();
        updateActiveNavLink();
    }, 10));
    
    menuToggle.addEventListener('click', toggleMobileMenu);
    
    // Navigation link event listeners
    document.querySelectorAll('.nav-link, .nav-link-mobile').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const href = link.getAttribute('href');
            scrollToSection(href);
        });
    });
    
    // Contact form submission
    contactForm.addEventListener('submit', handleFormSubmit);
    
    // Toast click to dismiss
    toast.addEventListener('click', hideToast);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (event) => {
        if (isMenuOpen && !header.contains(event.target)) {
            toggleMobileMenu();
        }
    });
    
    // Initial scroll position check
    handleScroll();
    updateActiveNavLink();
});

// Handle page resize
window.addEventListener('resize', debounce(() => {
    // Close mobile menu on resize to larger screen
    if (window.innerWidth >= 768 && isMenuOpen) {
        toggleMobileMenu();
    }
}, 250));

// Preload critical images
function preloadImages() {
    const imageUrls = [
        'src/assets/hero-portrait-new.jpg'
    ];
    
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// Call preload on page load
window.addEventListener('load', preloadImages);