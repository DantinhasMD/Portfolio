document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    
    if (!contactForm) return;
    
    // Form validation and submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validate form
        if (!validateForm()) {
            return;
        }
        
        // Show loading state
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = `
            <span style="display: flex; align-items: center; gap: 0.5rem;">
                <span class="spinner"></span>
                Enviando...
            </span>
        `;
        submitButton.disabled = true;
        
        // Simulate form submission (replace with actual API call)
        setTimeout(() => {
            // Hide form and show success message
            contactForm.style.display = 'none';
            formSuccess.style.display = 'block';
            
            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Reset form after a delay
            setTimeout(() => {
                resetForm();
                submitButton.innerHTML = originalText;
                submitButton.disabled = false;
            }, 5000);
        }, 2000);
    });
    
    // Form validation
    function validateForm() {
        const requiredFields = contactForm.querySelectorAll('[required]');
        let isValid = true;
        
        requiredFields.forEach(field => {
            const value = field.value.trim();
            const fieldGroup = field.closest('.form-group');
            
            // Remove existing error styling
            field.classList.remove('error');
            const existingError = fieldGroup.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            // Validate field
            if (!value) {
                showFieldError(field, 'Este campo é obrigatório');
                isValid = false;
            } else if (field.type === 'email' && !isValidEmail(value)) {
                showFieldError(field, 'Por favor, insira um email válido');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Show field error
    function showFieldError(field, message) {
        field.classList.add('error');
        const fieldGroup = field.closest('.form-group');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        errorElement.style.cssText = `
            color: #ef4444;
            font-size: 0.85rem;
            margin-top: 0.25rem;
            display: flex;
            align-items: center;
            gap: 0.25rem;
        `;
        
        fieldGroup.appendChild(errorElement);
        
        // Add error styling to field
        field.style.borderColor = '#ef4444';
        
        // Remove error styling after user starts typing
        field.addEventListener('input', function() {
            this.classList.remove('error');
            this.style.borderColor = '';
            const errorMsg = fieldGroup.querySelector('.error-message');
            if (errorMsg) {
                errorMsg.remove();
            }
        }, { once: true });
    }
    
    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Reset form
    function resetForm() {
        contactForm.reset();
        contactForm.style.display = 'block';
        formSuccess.style.display = 'none';
        
        // Remove any error styling
        const errorFields = contactForm.querySelectorAll('.error');
        errorFields.forEach(field => {
            field.classList.remove('error');
            field.style.borderColor = '';
        });
        
        const errorMessages = contactForm.querySelectorAll('.error-message');
        errorMessages.forEach(msg => msg.remove());
    }
    
    // Auto-save form data to localStorage
    const formFields = contactForm.querySelectorAll('input, textarea, select');
    
    // Load saved data
    formFields.forEach(field => {
        const savedValue = localStorage.getItem(`contact-form-${field.name}`);
        if (savedValue && field.type !== 'submit') {
            field.value = savedValue;
        }
    });
    
    // Save data on input
    formFields.forEach(field => {
        field.addEventListener('input', function() {
            localStorage.setItem(`contact-form-${this.name}`, this.value);
        });
    });
    
    // Clear saved data after successful submission
    function clearSavedData() {
        formFields.forEach(field => {
            localStorage.removeItem(`contact-form-${field.name}`);
        });
    }
    
    // Character counter for textarea
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'char-counter';
        counter.style.cssText = `
            font-size: 0.8rem;
            color: var(--text-muted);
            text-align: right;
            margin-top: 0.25rem;
        `;
        
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${messageField.value.length}/${maxLength} caracteres`;
            
            if (remaining < 50) {
                counter.style.color = '#ef4444';
            } else if (remaining < 100) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = 'var(--text-muted)';
            }
        }
        
        messageField.setAttribute('maxlength', maxLength);
        messageField.parentNode.appendChild(counter);
        messageField.addEventListener('input', updateCounter);
        updateCounter();
    }
    
    // Form field enhancements
    const selectFields = contactForm.querySelectorAll('select');
    selectFields.forEach(select => {
        // Add custom styling for better UX
        select.addEventListener('change', function() {
            this.classList.add('has-value');
        });
        
        if (select.value) {
            select.classList.add('has-value');
        }
    });
    
    // Add focus animations
    const inputFields = contactForm.querySelectorAll('input, textarea, select');
    inputFields.forEach(field => {
        field.addEventListener('focus', function() {
            this.parentNode.classList.add('focused');
        });
        
        field.addEventListener('blur', function() {
            this.parentNode.classList.remove('focused');
            if (this.value) {
                this.parentNode.classList.add('has-value');
            } else {
                this.parentNode.classList.remove('has-value');
            }
        });
        
        // Check initial value
        if (field.value) {
            field.parentNode.classList.add('has-value');
        }
    });
    
    // Add loading spinner styles
    const style = document.createElement('style');
    style.textContent = `
        .spinner {
            width: 1rem;
            height: 1rem;
            border: 2px solid transparent;
            border-top: 2px solid currentColor;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to {
                transform: rotate(360deg);
            }
        }
        
        .form-group.focused label {
            color: #3b82f6;
        }
        
        .form-group.has-value label {
            font-weight: 500;
        }
        
        .form-group input.error,
        .form-group textarea.error,
        .form-group select.error {
            border-color: #ef4444;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
        }
        
        .char-counter {
            transition: color 0.3s ease;
        }
        
        .form-group {
            position: relative;
        }
        
        .form-group label {
            transition: color 0.3s ease, font-weight 0.3s ease;
        }
    `;
    document.head.appendChild(style);
    
    // Success message enhancement
    if (formSuccess) {
        // Add confetti effect on success (optional)
        function showConfetti() {
            // Simple confetti effect
            const colors = ['#3b82f6', '#60a5fa', '#93c5fd', '#dbeafe'];
            const confettiCount = 50;
            
            for (let i = 0; i < confettiCount; i++) {
                setTimeout(() => {
                    createConfetti(colors[Math.floor(Math.random() * colors.length)]);
                }, i * 50);
            }
        }
        
        function createConfetti(color) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 10px;
                height: 10px;
                background: ${color};
                pointer-events: none;
                z-index: 9999;
                animation: confetti-fall 3s linear forwards;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
        
        // Add confetti animation
        const confettiStyle = document.createElement('style');
        confettiStyle.textContent = `
            @keyframes confetti-fall {
                0% {
                    transform: translateY(-100vh) rotate(0deg);
                    opacity: 1;
                }
                100% {
                    transform: translateY(100vh) rotate(720deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(confettiStyle);
    }
});