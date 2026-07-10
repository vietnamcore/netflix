/**
 * POPUP JAVASCRIPT
 * Netflix Premium - Popup Management
 */

(function() {
    'use strict';

    // DOM Elements
    const popupOverlay = document.getElementById('popupOverlay');
    const popup = document.getElementById('popup');
    const popupClose = document.getElementById('popupClose');
    const popupPackage = document.getElementById('popupPackage');
    const popupPrice = document.getElementById('popupPrice');
    const popupPhone = document.getElementById('popupPhone');
    const copyPhoneBtn = document.getElementById('copyPhone');
    const zaloBtn = document.querySelector('.popup-zalo-btn');

    // Phone number
    const PHONE_NUMBER = '0818105658';

    /**
     * Open popup with package details
     */
    function openPopup(packageName, price) {
        if (!popupOverlay) return;

        // Set content
        if (popupPackage) popupPackage.textContent = 'Gói ' + packageName;
        if (popupPrice) popupPrice.textContent = price;
        if (popupPhone) popupPhone.textContent = PHONE_NUMBER;

        // Show popup
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Animation with GSAP if available
        if (typeof gsap !== 'undefined') {
            gsap.fromTo(popup, 
                { scale: 0.8, opacity: 0, y: 50 },
                { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
            );
        }

        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'view_package', {
                'package': packageName,
                'price': price
            });
        }

        console.log('📦 Popup opened:', packageName, price);
    }

    /**
     * Close popup
     */
    function closePopup() {
        if (!popupOverlay) return;

        if (typeof gsap !== 'undefined') {
            gsap.to(popup, {
                scale: 0.8,
                opacity: 0,
                y: 50,
                duration: 0.3,
                ease: 'power2.in',
                onComplete: function() {
                    popupOverlay.classList.remove('active');
                    document.body.style.overflow = '';
                }
            });
        } else {
            popupOverlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Copy phone number to clipboard
     */
    function copyPhoneNumber() {
        if (!PHONE_NUMBER) return;

        // Use modern clipboard API
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(PHONE_NUMBER)
                .then(() => {
                    showToast('📋 Đã copy số điện thoại: ' + PHONE_NUMBER, 'success');
                    updateCopyButtonFeedback(true);
                })
                .catch(() => {
                    fallbackCopy();
                });
        } else {
            fallbackCopy();
        }
    }

    /**
     * Fallback copy method
     */
    function fallbackCopy() {
        const tempInput = document.createElement('input');
        tempInput.value = PHONE_NUMBER;
        document.body.appendChild(tempInput);
        tempInput.select();
        
        try {
            document.execCommand('copy');
            showToast('📋 Đã copy số điện thoại: ' + PHONE_NUMBER, 'success');
            updateCopyButtonFeedback(true);
        } catch (err) {
            showToast('❌ Không thể copy số điện thoại', 'error');
        }
        
        document.body.removeChild(tempInput);
    }

    /**
     * Update copy button feedback
     */
    function updateCopyButtonFeedback(success) {
        if (!copyPhoneBtn) return;
        
        const originalText = copyPhoneBtn.innerHTML;
        
        if (success) {
            copyPhoneBtn.innerHTML = '✅ Đã copy';
            copyPhoneBtn.style.borderColor = '#00C853';
            copyPhoneBtn.style.color = '#00C853';
        } else {
            copyPhoneBtn.innerHTML = '❌ Thất bại';
            copyPhoneBtn.style.borderColor = '#FF1744';
            copyPhoneBtn.style.color = '#FF1744';
        }
        
        setTimeout(() => {
            copyPhoneBtn.innerHTML = originalText;
            copyPhoneBtn.style.borderColor = '';
            copyPhoneBtn.style.color = '';
        }, 3000);
    }

    /**
     * Open Zalo
     */
    function openZalo() {
        const zaloUrl = 'https://zalo.me/' + PHONE_NUMBER;
        window.open(zaloUrl, '_blank');
        
        // Track event
        if (typeof gtag !== 'undefined') {
            gtag('event', 'zalo_click', {
                'source': 'popup'
            });
        }
        
        showToast('💬 Đang mở Zalo...', 'info');
    }

    /**
     * Handle popup close on overlay click
     */
    function handleOverlayClick(e) {
        if (e.target === popupOverlay) {
            closePopup();
        }
    }

    /**
     * Handle Escape key
     */
    function handleKeyDown(e) {
        if (e.key === 'Escape' && popupOverlay && popupOverlay.classList.contains('active')) {
            closePopup();
        }
    }

    /**
     * Initialize popup event listeners
     */
    function initPopup() {
        if (!popupOverlay) {
            console.warn('Popup overlay not found');
            return;
        }

        // Close button
        if (popupClose) {
            popupClose.addEventListener('click', closePopup);
        }

        // Overlay click
        popupOverlay.addEventListener('click', handleOverlayClick);

        // Keyboard
        document.addEventListener('keydown', handleKeyDown);

        // Copy phone button
        if (copyPhoneBtn) {
            copyPhoneBtn.addEventListener('click', copyPhoneNumber);
        }

        // Zalo button
        if (zaloBtn) {
            zaloBtn.addEventListener('click', openZalo);
        }

        // Phone number click - also copy
        if (popupPhone) {
            popupPhone.style.cursor = 'pointer';
            popupPhone.addEventListener('click', copyPhoneNumber);
            popupPhone.title = 'Click để copy số điện thoại';
        }

        console.log('✅ Popup initialized');
    }

    // Expose functions globally
    window.openPopup = openPopup;
    window.closePopup = closePopup;
    window.copyPhoneNumber = copyPhoneNumber;
    window.openZalo = openZalo;

    // Initialize when DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPopup);
    } else {
        initPopup();
    }

})();
