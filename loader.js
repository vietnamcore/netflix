/**
 * LOADER JAVASCRIPT
 * Netflix Premium - Loading Screen Management
 */

(function() {
    'use strict';

    // DOM Elements
    const loader = document.getElementById('loader');
    const progressBar = document.getElementById('progressBar');
    const loaderPercentage = document.getElementById('loaderPercentage');

    // Configuration
    const CONFIG = {
        minLoadTime: 1500, // Minimum loading time in ms
        maxLoadTime: 5000, // Maximum loading time in ms
        updateInterval: 50 // Progress update interval in ms
    };

    // State
    let progress = 0;
    let isLoaded = false;
    let startTime = Date.now();
    let intervalId = null;

    /**
     * Update loader progress
     */
    function updateProgress() {
        if (isLoaded) return;

        // Calculate progress based on time
        const elapsed = Date.now() - startTime;
        const targetProgress = Math.min((elapsed / CONFIG.maxLoadTime) * 100, 95);
        
        // Smooth progress
        progress += (targetProgress - progress) * 0.1;
        progress = Math.min(progress, 95);

        // Update UI
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (loaderPercentage) {
            loaderPercentage.textContent = Math.round(progress) + '%';
        }

        // Check if we've reached minimum load time
        if (elapsed >= CONFIG.minLoadTime && progress >= 90) {
            completeLoading();
        }
    }

    /**
     * Complete loading
     */
    function completeLoading() {
        if (isLoaded) return;
        isLoaded = true;

        // Finish progress
        progress = 100;
        if (progressBar) {
            progressBar.style.width = '100%';
        }
        if (loaderPercentage) {
            loaderPercentage.textContent = '100%';
        }

        // Hide loader after short delay
        setTimeout(() => {
            if (loader) {
                loader.classList.add('hidden');
                
                // Remove loader from DOM after animation
                setTimeout(() => {
                    if (loader.parentNode) {
                        loader.remove();
                    }
                }, 800);
            }

            // Trigger AOS refresh after loader hides
            if (typeof AOS !== 'undefined') {
                setTimeout(() => {
                    AOS.refresh();
                }, 100);
            }

            // Start animations
            document.dispatchEvent(new Event('loaderComplete'));
            
            console.log('✅ Loading complete');
        }, 300);

        // Clear interval
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
    }

    /**
     * Force complete loading (fallback)
     */
    function forceComplete() {
        if (!isLoaded) {
            console.warn('Forcing loader completion');
            completeLoading();
        }
    }

    /**
     * Initialize loader
     */
    function initLoader() {
        // Start progress updates
        intervalId = setInterval(updateProgress, CONFIG.updateInterval);

        // Force complete after max time
        setTimeout(forceComplete, CONFIG.maxLoadTime);

        // Wait for window load
        if (document.readyState === 'complete') {
            setTimeout(forceComplete, 500);
        } else {
            window.addEventListener('load', function() {
                setTimeout(forceComplete, 500);
            });
        }

        // Handle errors - force complete
        window.addEventListener('error', function() {
            setTimeout(forceComplete, 1000);
        });

        console.log('✅ Loader initialized');
    }

    // ============================================
    // PRELOAD CRITICAL ASSETS
    // ============================================
    function preloadAssets() {
        // Preload images
        const images = document.querySelectorAll('img[data-src]');
        let loadedImages = 0;
        const totalImages = images.length;

        if (totalImages === 0) return;

        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) {
                const tempImg = new Image();
                tempImg.onload = function() {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        console.log('✅ All images preloaded');
                    }
                };
                tempImg.onerror = function() {
                    loadedImages++;
                    if (loadedImages === totalImages) {
                        console.log('✅ All images preloaded (with errors)');
                    }
                };
                tempImg.src = src;
            }
        });
    }

    // ============================================
    // LOADER EVENTS
    // ============================================
    document.addEventListener('loaderComplete', function() {
        // Initialize Lenis if available
        if (window.lenis) {
            window.lenis.start();
        }

        // Start AOS
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }

        // Show welcome toast
        setTimeout(() => {
            if (typeof showToast === 'function') {
                showToast('🎬 Chào mừng đến với Netflix Premium!', 'success', 3000);
            }
        }, 1000);
    });

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            initLoader();
            preloadAssets();
        });
    } else {
        initLoader();
        preloadAssets();
    }

    // Expose for debugging
    window.loader = {
        progress: () => progress,
        isLoaded: () => isLoaded,
        complete: forceComplete
    };

})();
