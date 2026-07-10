/**
 * MOUSE JAVASCRIPT
 * Netflix Premium - Mouse Effects & Interactions
 */

(function() {
    'use strict';

    // ============================================
    // MOUSE PARALLAX
    // ============================================
    const parallaxLayers = document.querySelectorAll('.parallax-layer, .hero-3d-container, .floating-icon');

    if (parallaxLayers.length > 0) {
        let mouseX = 0;
        let mouseY = 0;
        let currentX = 0;
        let currentY = 0;

        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth - 0.5) * 2;
            const y = (e.clientY / window.innerHeight - 0.5) * 2;
            
            mouseX = x;
            mouseY = y;
        });

        function updateParallaxLayers() {
            // Smooth interpolation
            currentX += (mouseX - currentX) * 0.05;
            currentY += (mouseY - currentY) * 0.05;

            parallaxLayers.forEach((layer, index) => {
                const speed = parseFloat(layer.getAttribute('data-parallax-speed')) || (0.02 + index * 0.01);
                const x = currentX * speed * 50;
                const y = currentY * speed * 50;
                
                layer.style.transform = `translate(${x}px, ${y}px)`;
            });

            requestAnimationFrame(updateParallaxLayers);
        }

        updateParallaxLayers();
    }

    // ============================================
    // MOUSE TRAIL (Enhanced)
    // ============================================
    const trailContainer = document.getElementById('mouseTrail');
    let trailPositions = [];
    const MAX_TRAIL = 20;
    let lastTrailTime = 0;
    const TRAIL_INTERVAL = 30;

    if (trailContainer && !('ontouchstart' in window)) {
        document.addEventListener('mousemove', function(e) {
            const now = Date.now();
            if (now - lastTrailTime < TRAIL_INTERVAL) return;
            lastTrailTime = now;

            trailPositions.push({ x: e.clientX, y: e.clientY });
            
            if (trailPositions.length > MAX_TRAIL) {
                trailPositions.shift();
            }

            // Create trail dots
            trailPositions.forEach((pos, index) => {
                const dot = document.createElement('div');
                dot.className = 'trail-dot';
                
                const size = 2 + (index / MAX_TRAIL) * 4;
                const opacity = 0.1 + (index / MAX_TRAIL) * 0.5;
                
                dot.style.width = size + 'px';
                dot.style.height = size + 'px';
                dot.style.left = pos.x + 'px';
                dot.style.top = pos.y + 'px';
                dot.style.opacity = opacity;
                dot.style.transform = 'translate(-50%, -50%)';
                
                trailContainer.appendChild(dot);
                
                setTimeout(() => {
                    if (dot.parentNode) {
                        dot.remove();
                    }
                }, 500);
            });
        });
    }

    // ============================================
    // SPOTLIGHT EFFECT
    // ============================================
    const spotlightElements = document.querySelectorAll('[data-spotlight]');

    if (spotlightElements.length > 0) {
        document.addEventListener('mousemove', function(e) {
            const x = (e.clientX / window.innerWidth) * 100;
            const y = (e.clientY / window.innerHeight) * 100;
            
            spotlightElements.forEach(el => {
                const intensity = parseFloat(el.getAttribute('data-spotlight')) || 0.5;
                const gradient = `radial-gradient(circle at ${x}% ${y}%, rgba(229, 9, 20, ${intensity * 0.1}), transparent 50%)`;
                el.style.background = gradient;
            });
        });
    }

    // ============================================
    // 3D TILT ON HOVER
    // ============================================
    const tiltElements = document.querySelectorAll('.tilt-3d');

    if (tiltElements.length > 0) {
        tiltElements.forEach(el => {
            el.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width;
                const y = (e.clientY - rect.top) / rect.height;
                
                const rotateX = (y - 0.5) * 20;
                const rotateY = (x - 0.5) * -20;
                
                this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
                this.style.transition = 'transform 0.1s ease';
            });

            el.addEventListener('mouseleave', function() {
                this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
                this.style.transition = 'transform 0.5s ease';
            });
        });
    }

    // ============================================
    // MAGNETIC BUTTONS (Enhanced)
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
            
            const translateX = deltaX * 12;
            const translateY = deltaY * 12;
            
            // Apply 3D rotation
            const rotateX = deltaY * 8;
            const rotateY = deltaX * -8;
            
            this.style.transform = `perspective(500px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate(${translateX}px, ${translateY}px) scale(1.02)`;
        });

        btn.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(500px) rotateX(0deg) rotateY(0deg) translate(0, 0) scale(1)';
        });
    });

    // ============================================
    // MOUSE PARALLAX FOR HERO (Mouse tilt for 3D objects)
    // ============================================
    const hero3D = document.querySelector('.hero-3d-container');

    if (hero3D) {
        let tiltX = 0;
        let tiltY = 0;
        let currentTiltX = 0;
        let currentTiltY = 0;

        document.addEventListener('mousemove', function(e) {
            const rect = hero3D.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;
            
            tiltX = (y - 0.5) * 15;
            tiltY = (x - 0.5) * -15;
        });

        function animateTilt() {
            currentTiltX += (tiltX - currentTiltX) * 0.05;
            currentTiltY += (tiltY - currentTiltY) * 0.05;
            
            if (hero3D) {
                hero3D.style.transform = `perspective(1000px) rotateX(${currentTiltX}deg) rotateY(${currentTiltY}deg)`;
            }
            
            requestAnimationFrame(animateTilt);
        }

        animateTilt();
    }

    console.log('✅ Mouse effects initialized');
})();
