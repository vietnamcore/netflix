/**
 * CURSOR JAVASCRIPT
 * Netflix Premium - Custom Cursor & Glow Effects
 */

(function() {
    'use strict';

    // DOM Elements
    const cursorGlow = document.getElementById('cursorGlow');
    const mouseTrailContainer = document.getElementById('mouseTrail');

    // Configuration
    const CONFIG = {
        glowSize: 300,
        glowSizeActive: 500,
        trailLength: 15,
        trailInterval: 50, // ms
        smoothness: 0.15
    };

    // State
    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isHoveringInteractive = false;
    let trailPositions = [];
    let trailIntervalId = null;

    /**
     * Check if element is interactive
     */
    function isInteractiveElement(element) {
        if (!element) return false;
        
        const interactiveSelectors = [
            'a', 'button', '.btn-magnetic', '.card-btn', '.cta-primary', 
            '.cta-secondary', '.nav-btn', '.popup-zalo-btn', '.popup-copy-btn',
            '.faq-question', '.pricing-card', '.feature-item'
        ];
        
        // Check if element or parent matches selectors
        let target = element;
        while (target && target !== document.body) {
            for (const selector of interactiveSelectors) {
                if (target.matches && target.matches(selector)) {
                    return true;
                }
            }
            target = target.parentElement;
        }
        
        return false;
    }

    /**
     * Update cursor glow position with smooth tracking
     */
    function updateCursorGlow() {
        if (!cursorGlow) return;

        // Smooth interpolation
        currentX += (mouseX - currentX) * CONFIG.smoothness;
        currentY += (mouseY - currentY) * CONFIG.smoothness;

        cursorGlow.style.left = currentX + 'px';
        cursorGlow.style.top = currentY + 'px';

        // Update size based on interaction
        if (isHoveringInteractive) {
            cursorGlow.classList.add('active');
        } else {
            cursorGlow.classList.remove('active');
        }

        requestAnimationFrame(updateCursorGlow);
    }

    /**
     * Create trail dot
     */
    function createTrailDot(x, y) {
        if (!mouseTrailContainer) return;

        const dot = document.createElement('div');
        dot.className = 'trail-dot';
        dot.style.left = x + 'px';
        dot.style.top = y + 'px';
        
        // Random size variation
        const size = 3 + Math.random() * 4;
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        
        // Random opacity
        dot.style.opacity = 0.3 + Math.random() * 0.4;
        
        mouseTrailContainer.appendChild(dot);
        
        // Remove after animation
        setTimeout(() => {
            if (dot.parentNode) {
                dot.remove();
            }
        }, 800);
    }

    /**
     * Add trail position
     */
    function addTrailPosition() {
        trailPositions.push({ x: mouseX, y: mouseY });
        
        // Limit trail length
        if (trailPositions.length > CONFIG.trailLength) {
            trailPositions.shift();
        }
        
        // Create dots from trail positions
        if (trailPositions.length > 1) {
            const positions = trailPositions.slice(0, -1);
            positions.forEach((pos, index) => {
                const delay = index * 30;
                setTimeout(() => {
                    createTrailDot(pos.x, pos.y);
                }, delay);
            });
        }
    }

    /**
     * Handle mouse move
     */
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Check if hovering interactive element
        const target = e.target;
        isHoveringInteractive = isInteractiveElement(target);
        
        // Update cursor style
        if (isHoveringInteractive) {
            document.body.style.cursor = 'none';
        } else {
            document.body.style.cursor = 'none';
        }
    }

    /**
     * Handle mouse leave
     */
    function handleMouseLeave() {
        if (cursorGlow) {
            cursorGlow.style.opacity = '0';
        }
    }

    /**
     * Handle mouse enter
     */
    function handleMouseEnter() {
        if (cursorGlow) {
            cursorGlow.style.opacity = '1';
        }
    }

    /**
     * Handle window resize
     */
    function handleResize() {
        // Recalculate positions if needed
    }

    /**
     * Initialize cursor effects
     */
    function initCursor() {
        // Check if we should enable custom cursor
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (isTouchDevice) {
            // Disable custom cursor on touch devices
            if (cursorGlow) {
                cursorGlow.style.display = 'none';
            }
            if (mouseTrailContainer) {
                mouseTrailContainer.style.display = 'none';
            }
            document.body.style.cursor = 'auto';
            return;
        }

        // Set initial position
        mouseX = window.innerWidth / 2;
        mouseY = window.innerHeight / 2;
        currentX = mouseX;
        currentY = mouseY;

        // Event listeners
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseleave', handleMouseLeave);
        document.addEventListener('mouseenter', handleMouseEnter);
        window.addEventListener('resize', handleResize);

        // Start animation loop
        updateCursorGlow();

        // Start trail interval
        trailIntervalId = setInterval(addTrailPosition, CONFIG.trailInterval);

        console.log('✅ Custom cursor initialized');
    }

    /**
     * Clean up
     */
    function cleanup() {
        if (trailIntervalId) {
            clearInterval(trailIntervalId);
        }
        
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseleave', handleMouseLeave);
        document.removeEventListener('mouseenter', handleMouseEnter);
        window.removeEventListener('resize', handleResize);
    }

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCursor);
    } else {
        initCursor();
    }

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanup);

    // Expose functions for debugging
    window.cursorDebug = {
        updateCursorGlow,
        addTrailPosition,
        cleanup
    };

})();
