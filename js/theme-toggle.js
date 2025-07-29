document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = document.querySelector('.theme-icon');
    const html = document.documentElement;
    
    // Check for saved theme preference or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme
    setTheme(savedTheme);
    
    // Theme toggle event listener
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }
    
    function setTheme(theme) {
        html.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
        
        if (themeIcon) {
            themeIcon.textContent = theme === 'dark' ? '☀️' : '🌙';
        }
        
        // Update theme toggle button aria-label for accessibility
        if (themeToggle) {
            themeToggle.setAttribute('aria-label', 
                theme === 'dark' ? 'Mudar para tema claro' : 'Mudar para tema escuro'
            );
        }
        
        // Dispatch custom event for other components that might need to react to theme changes
        const themeChangeEvent = new CustomEvent('themeChanged', {
            detail: { theme: theme }
        });
        document.dispatchEvent(themeChangeEvent);
    }
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Only apply system theme if no theme is saved
    if (!localStorage.getItem('theme')) {
        setTheme(mediaQuery.matches ? 'dark' : 'light');
    }
    
    // Listen for changes in system theme preference
    mediaQuery.addEventListener('change', function(e) {
        // Only apply system theme if no manual preference is saved
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
    
    // Add smooth theme transition
    function addThemeTransition() {
        const css = document.createElement('style');
        css.textContent = `
            * {
                transition: background-color 0.3s ease, 
                           color 0.3s ease, 
                           border-color 0.3s ease,
                           box-shadow 0.3s ease !important;
            }
            
            .theme-toggle {
                position: relative;
                overflow: hidden;
            }
            
            .theme-toggle::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 0;
                height: 0;
                background: rgba(59, 130, 246, 0.1);
                border-radius: 50%;
                transform: translate(-50%, -50%);
                transition: width 0.3s ease, height 0.3s ease;
            }
            
            .theme-toggle:hover::before {
                width: 100%;
                height: 100%;
            }
            
            .theme-icon {
                position: relative;
                z-index: 1;
                display: block;
                transition: transform 0.3s ease;
            }
            
            .theme-toggle:hover .theme-icon {
                transform: scale(1.1);
            }
        `;
        document.head.appendChild(css);
    }
    
    addThemeTransition();
    
    // Keyboard accessibility
    if (themeToggle) {
        themeToggle.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    }
    
    // Add ARIA attributes for accessibility
    if (themeToggle) {
        themeToggle.setAttribute('role', 'button');
        themeToggle.setAttribute('tabindex', '0');
        themeToggle.setAttribute('aria-pressed', savedTheme === 'dark' ? 'true' : 'false');
    }
    
    // Update ARIA pressed state when theme changes
    document.addEventListener('themeChanged', function(e) {
        if (themeToggle) {
            themeToggle.setAttribute('aria-pressed', e.detail.theme === 'dark' ? 'true' : 'false');
        }
    });
});