/**
 * PARTICLES JAVASCRIPT
 * Netflix Premium - Particle Background System
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        particles: {
            number: {
                value: 80,
                density: {
                    enable: true,
                    value_area: 800
                }
            },
            color: {
                value: ['#E50914', '#FF6B6B', '#FFFFFF', '#808080']
            },
            shape: {
                type: 'circle',
                stroke: {
                    width: 0,
                    color: '#000000'
                }
            },
            opacity: {
                value: 0.5,
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: {
                value: 3,
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.5,
                    sync: false
                }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: '#E50914',
                opacity: 0.2,
                width: 1
            },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: true,
                straight: false,
                out_mode: 'out',
                bounce: false,
                attract: {
                    enable: true,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: 'canvas',
            events: {
                onhover: {
                    enable: true,
                    mode: 'grab'
                },
                onclick: {
                    enable: true,
                    mode: 'push'
                },
                resize: true
            },
            modes: {
                grab: {
                    distance: 200,
                    line_linked: {
                        opacity: 0.5
                    }
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    };

    let particlesInstance = null;

    /**
     * Initialize particles
     */
    function initParticles() {
        const container = document.getElementById('particles-container');
        if (!container) {
            console.warn('Particles container not found');
            return;
        }

        // Check if particles.js is loaded
        if (typeof particlesJS === 'undefined') {
            console.warn('particles.js library not loaded');
            // Try to load from CDN
            loadParticlesLibrary();
            return;
        }

        // Initialize particles
        try {
            particlesJS('particles-container', CONFIG);
            
            // Store instance for later use
            if (window.pJSDom && window.pJSDom.length > 0) {
                particlesInstance = window.pJSDom[0];
            }
            
            console.log('✅ Particles initialized successfully');
        } catch (error) {
            console.error('Failed to initialize particles:', error);
        }
    }

    /**
     * Load particles library dynamically
     */
    function loadParticlesLibrary() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/particles.js/2.0.0/particles.min.js';
        script.async = true;
        
        script.onload = function() {
            console.log('✅ particles.js loaded dynamically');
            setTimeout(initParticles, 100);
        };
        
        script.onerror = function() {
            console.warn('Failed to load particles.js library');
            // Fallback: create simple particles with canvas
            createFallbackParticles();
        };
        
        document.head.appendChild(script);
    }

    /**
     * Create fallback particles using canvas
     */
    function createFallbackParticles() {
        const container = document.getElementById('particles-container');
        if (!container) return;

        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        container.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        let width = 0;
        let height = 0;
        let particles = [];
        const particleCount = 60;

        function resize() {
            const rect = container.getBoundingClientRect();
            canvas.width = rect.width;
            canvas.height = rect.height;
            width = canvas.width;
            height = canvas.height;
        }

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = 1 + Math.random() * 3;
                this.speedX = (Math.random() - 0.5) * 1.5;
                this.speedY = (Math.random() - 0.5) * 1.5;
                this.opacity = 0.2 + Math.random() * 0.5;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > width) this.speedX *= -1;
                if (this.y < 0 || this.y > height) this.speedY *= -1;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(229, 9, 20, ${this.opacity})`;
                ctx.fill();
            }
        }

        function initParticles() {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function drawLines() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150) {
                        const opacity = (1 - distance / 150) * 0.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(229, 9, 20, ${opacity})`;
                        ctx.lineWidth = 1;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            ctx.clearRect(0, 0, width, height);

            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });

            drawLines();

            requestAnimationFrame(animate);
        }

        function handleResize() {
            resize();
            initParticles();
        }

        // Initialize
        resize();
        initParticles();
        animate();

        window.addEventListener('resize', handleResize);
        console.log('✅ Fallback particles initialized');
    }

    /**
     * Update particles configuration
     */
    function updateParticles(config) {
        if (!particlesInstance) return;
        
        // This would require re-initializing with new config
        console.log('Updating particles config...');
    }

    /**
     * Destroy particles
     */
    function destroyParticles() {
        if (particlesInstance && particlesInstance.pJS) {
            particlesInstance.pJS.fn.vendors.destroypJS();
            particlesInstance = null;
        }
        
        // Clean up fallback particles if any
        const container = document.getElementById('particles-container');
        if (container) {
            const canvas = container.querySelector('canvas');
            if (canvas) {
                canvas.remove();
            }
        }
    }

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initParticles);
    } else {
        initParticles();
    }

    // Expose functions
