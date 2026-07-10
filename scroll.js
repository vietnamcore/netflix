/**
 * SCROLL JAVASCRIPT
 * Netflix Premium - Scroll Animations & Effects
 */

(function() {
    'use strict';

    // ============================================
    // SCROLL REVEAL WITH INTERSECTION OBSERVER
    // ============================================
    const revealElements = document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-scale');

    if (revealElements.length > 0) {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // If element has a delay attribute
                    const delay = entry.target.getAttribute('data-delay');
                    if (delay) {
                        entry.target.style.transitionDelay = delay + 'ms';
                    }
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    }

    // ============================================
    // PARALLAX ON SCROLL
    // ============================================
    const parallaxElements = document.querySelectorAll('[data-parallax]');

    if (parallaxElements.length > 0) {
        let scrollY = 0;

        function updateParallax() {
            scrollY = window.pageYOffset || document.documentElement.scrollTop;
            
            parallaxElements.forEach(el => {
                const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
                const rect = el.getBoundingClientRect();
                const centerY = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const offset = (centerY - viewportCenter) / viewportCenter;
                
                const translateY = offset * speed * 100;
                el.style.transform = `translateY(${translateY}px)`;
            });
        }

        // Throttled update
        const throttledParallax = throttle(updateParallax, 10);
        window.addEventListener('scroll', throttledParallax);
        window.addEventListener('resize', throttledParallax);
        updateParallax();
    }

    // ============================================
    // SECTION ACTIVE TRACKING
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    if (sections.length > 0 && navLinks.length > 0) {
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, {
            threshold: 0.4,
            rootMargin: '0px 0px -100px 0px'
        });

        sections.forEach(section => sectionObserver.observe(section));
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                
                if (window.lenis) {
                    window.lenis.scrollTo(target, {
                        offset: -80,
                        duration: 1.2
                    });
                } else {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ============================================
    // SCROLL TRIGGERED ANIMATIONS WITH GSAP
    // ============================================
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Hero animations
        gsap.from('.hero-content', {
            scrollTrigger: {
                trigger: '.hero',
                start: 'top top',
                end: 'bottom top',
                scrub: 1
            },
            opacity: 1,
            y: 0
        });

        // Pricing cards stagger
        gsap.from('.pricing-card', {
            scrollTrigger: {
                trigger: '.pricing',
                start: 'top bottom',
                end: 'top center',
                scrub: 1
            },
            opacity: 0,
            y: 50,
            stagger: 0.2
        });

        // Feature items stagger
        gsap.from('.feature-item', {
            scrollTrigger: {
                trigger: '.features',
                start: 'top bottom',
                end: 'top center',
                scrub: 1
            },
            opacity: 0,
            y: 30,
            stagger: 0.15
        });

        // FAQ items stagger
        gsap.from('.faq-item', {
            scrollTrigger: {
                trigger: '.faq',
                start: 'top bottom',
                end: 'top center',
                scrub: 1
            },
            opacity: 0,
            y: 20,
            stagger: 0.1
        });

        console.log('✅ GSAP ScrollTrigger animations initialized');
    }

    // ============================================
    // PROGRESS BAR FOR SECTIONS
    // ============================================
    const progressBars = document.querySelectorAll('.progress-bar-animated');

    if (progressBars.length > 0) {
        progressBars.forEach(bar => {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        bar.style.width = '100%';
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(bar);
        });
    }

    // ============================================
    // BACKGROUND PARALLAX
    // ============================================
    const bgElements = document.querySelectorAll('.aurora, .gradient-orb');

    if (bgElements.length > 0) {
        window.addEventListener('scroll', () => {
            const scroll = window.pageYOffset || document.documentElement.scrollTop;
            
            bgElements.forEach((el, index) => {
                const speed = 0.02 + (index * 0.01);
                const y = scroll * speed;
                el.style.transform = `translateY(${y}px)`;
            });
        }, { passive: true });
    }

    console.log('✅ Scroll animations initialized');
})();
