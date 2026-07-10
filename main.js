/**
 * MAIN JAVASCRIPT
 * Netflix Premium - Main Application
 */

document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // ============================================
    // INITIALIZE AOS
    // ============================================
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out-cubic',
            once: false,
            mirror: true,
            offset: 100,
            delay: 0,
            disable: window.innerWidth < 768 ? true : false
        });
    }

    // ============================================
    // INITIALIZE LENIS SMOOTH SCROLL
    // ============================================
    if (typeof Lenis !== 'undefined') {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            gestureOrientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1,
            touchMultiplier: 2
        });

        lenis.on('scroll', () => {
            updateScrollProgress();
        });

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        // Expose lenis globally for other scripts
        window.lenis = lenis;
    }

    // ============================================
    // SCROLL PROGRESS
    // ============================================
    function updateScrollProgress() {
        const scrollProgress = document.getElementById('scrollProgress');
        if (!scrollProgress) return;

        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const progress = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }

    // Debounced scroll progress update
    const debouncedUpdateScroll = debounce(updateScrollProgress, 10);
    window.addEventListener('scroll', debouncedUpdateScroll);
    window.addEventListener('resize', debouncedUpdateScroll);

    // ============================================
    // NAVBAR
    // ============================================
    const navbar = document.getElementById('navbar');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    let lastScroll = 0;

    function handleNavbarScroll() {
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }

        lastScroll = currentScroll;
    }

    // Throttled navbar scroll
    const throttledNavbarScroll = throttle(handleNavbarScroll, 10);
    window.addEventListener('scroll', throttledNavbarScroll);

    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            this.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }

    // Close menu on link click (mobile)
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    // ============================================
    // COUNTER ANIMATION
    // ============================================
    function animateCounter(element) {
        const target = parseInt(element.getAttribute('data-count'));
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.round(eased * target);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        requestAnimationFrame(updateCounter);
    }

    // Intersection Observer for counters
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                animateCounter(counter);
                counterObserver.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.stat-number').forEach(counter => {
        counterObserver.observe(counter);
    });

    // ============================================
    // FAQ ACCORDION
    // ============================================
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');

            // Close all other FAQ items
            document.querySelectorAll('.faq-item').forEach(other => {
                if (other !== item) {
                    other.classList.remove('active');
                }
            });

            // Toggle current
            if (!isActive) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });

    // ============================================
    // CONTACT FORM
    // ============================================
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Collect form data
            const formData = new FormData(this);
            const name = formData.get('name') || 'Khách hàng';
            
            // Show success toast
            showToast('Cảm ơn ' + name + '! Chúng tôi sẽ liên hệ sớm.', 'success');
            
            // Reset form
            this.reset();
        });
    }

    // ============================================
    // PRICING CARD CLICK - Open Popup
    // ============================================
    document.querySelectorAll('.card-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const packageName = this.getAttribute('data-package');
            const price = this.getAttribute('data-price');
            
            if (packageName && price && typeof openPopup === 'function') {
                openPopup(packageName, price);
            }
        });
    });

    // ============================================
    // RIPPLE CLICK EFFECT
    // ============================================
    document.addEventListener('click', function(e) {
        // Create ripple
        const ripple = document.createElement('div');
        ripple.classList.add('ripple');
        
        const size = Math.max(window.innerWidth, window.innerHeight) * 0.1;
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - size / 2) + 'px';
        ripple.style.top = (e.clientY - size / 2) + 'px';
        
        document.body.appendChild(ripple);
        
        // Remove after animation
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });

    // ============================================
    // BUTTON MAGNETIC EFFECT
    // ============================================
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
        btn.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const deltaX = (x - centerX) / centerX;
            const deltaY = (y - centerY) / centerY;
            
            const rotateX = deltaY * 5;
            const rotateY = deltaX * 5;
            
            const translateX = deltaX * 8;
            const translateY = deltaY * 8;
            
            this.style.transform = `perspective(500px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateX(${translateX}px) translateY(${translateY}px)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) translateX(0px) translateY(0px)';
        });
    });

    // ============================================
    // CARD TILT EFFECT
    // ============================================
    document.querySelectorAll('.pricing-card, .feature-item').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * 10;
            const rotateY = ((x - centerX) / centerX) * -10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
        });
    });

    // ============================================
    // LAZY LOAD IMAGES
    // ============================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.classList.add('loaded');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ============================================
    // SCROLL REVEAL - Manual implementation
    // ============================================
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale').forEach(el => {
        revealObserver.observe(el);
    });

    // ============================================
    // TOAST SYSTEM
    // ============================================
    function showToast(message, type = 'info', duration = 3000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
            <button class="toast-close">✕</button>
        `;

        container.appendChild(toast);

        // Auto remove
        setTimeout(() => {
            toast.classList.add('out');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, duration);

        // Manual close
        toast.querySelector('.toast-close').addEventListener('click', function() {
            toast.classList.add('out');
            setTimeout(() => {
                toast.remove();
            }, 400);
        });
    }

    // Expose toast globally
    window.showToast = showToast;

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    
    // Debounce
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

    // Throttle
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Expose utilities globally
    window.debounce = debounce;
    window.throttle = throttle;

    // ============================================
    // KEYBOARD NAVIGATION
    // ============================================
    document.addEventListener('keydown', function(e) {
        // ESC key - Close popup
        if (e.key === 'Escape') {
            const popup = document.getElementById('popupOverlay');
            if (popup && popup.classList.contains('active') && typeof closePopup === 'function') {
                closePopup();
            }
        }

        // Arrow keys for smooth scroll
        if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
            e.preventDefault();
            const direction = e.key === 'ArrowDown' ? 1 : -1;
            if (window.lenis) {
                window.lenis.scrollTo(window.scrollY + direction * 200);
            }
        }
    });

    // ============================================
    // PERFORMANCE - RequestAnimationFrame loop
    // ============================================
    let frameCount = 0;
    function animationLoop() {
        frameCount++;
        
        // Update any continuous animations here
        
        requestAnimationFrame(animationLoop);
    }
    requestAnimationFrame(animationLoop);

    // ============================================
    // CONSOLE WELCOME
    // ============================================
    console.log('%c Netflix Premium ', 'background: #E50914; color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 5px;');
    console.log('%c Trải nghiệm xem phim đỉnh cao ', 'color: #B3B3B3; font-size: 14px;');
    console.log('%c 📞 0818105658 ', 'color: #E50914; font-size: 14px;');

    console.log('🚀 Website đã sẵn sàng!');
    console.log('📱 Liên hệ: 0818105658');
    console.log('💬 Zalo: https://zalo.me/0818105658');

    // ============================================
    // INITIALIZATION COMPLETE
    // ============================================
    console.log('✅ Netflix Premium initialized successfully!');
});
