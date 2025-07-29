document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('project-search');
    const searchTags = document.querySelectorAll('.search-tag');
    const projectCards = document.querySelectorAll('.project-card');
    const noResults = document.getElementById('no-results');
    const projectsContainer = document.getElementById('projects-container');
    
    if (!searchInput || !projectCards.length) return;
    
    let activeTag = 'all';
    
    // Search functionality
    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const tags = card.getAttribute('data-tags').toLowerCase();
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const techTags = Array.from(card.querySelectorAll('.tech-tag')).map(tag => tag.textContent.toLowerCase());
            
            // Check if matches search term
            const matchesSearch = searchTerm === '' || 
                                title.includes(searchTerm) || 
                                description.includes(searchTerm) ||
                                tags.includes(searchTerm) ||
                                techTags.some(tech => tech.includes(searchTerm));
            
            // Check if matches active tag
            const matchesTag = activeTag === 'all' || tags.includes(activeTag);
            
            if (matchesSearch && matchesTag) {
                card.style.display = 'block';
                card.classList.add('animate-in');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.classList.remove('animate-in');
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            projectsContainer.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            projectsContainer.style.display = 'grid';
        }
        
        // Update results count (if element exists)
        updateResultsCount(visibleCount);
    }
    
    // Update results count display
    function updateResultsCount(count) {
        const existingCount = document.querySelector('.results-count');
        if (existingCount) {
            existingCount.remove();
        }
        
        if (count > 0 && (searchInput.value.trim() || activeTag !== 'all')) {
            const countElement = document.createElement('div');
            countElement.className = 'results-count';
            countElement.innerHTML = `
                <p style="text-align: center; color: var(--text-secondary); margin: 1rem 0; font-size: 0.9rem;">
                    ${count} projeto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}
                </p>
            `;
            projectsContainer.parentNode.insertBefore(countElement, projectsContainer);
        }
    }
    
    // Search input event listener
    searchInput.addEventListener('input', debounce(filterProjects, 300));
    
    // Tag filter functionality
    searchTags.forEach(tag => {
        tag.addEventListener('click', function() {
            // Remove active class from all tags
            searchTags.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tag
            this.classList.add('active');
            
            // Update active tag
            activeTag = this.getAttribute('data-tag');
            
            // Clear search input if "all" is selected
            if (activeTag === 'all') {
                searchInput.value = '';
            }
            
            // Filter projects
            filterProjects();
            
            // Add ripple effect
            addRippleEffect(this);
        });
    });
    
    // Set initial active tag
    const allTag = document.querySelector('.search-tag[data-tag="all"]');
    if (allTag) {
        allTag.classList.add('active');
    }
    
    // Keyboard navigation for search tags
    searchTags.forEach((tag, index) => {
        tag.setAttribute('tabindex', '0');
        tag.setAttribute('role', 'button');
        
        tag.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const direction = e.key === 'ArrowRight' ? 1 : -1;
                const nextIndex = (index + direction + searchTags.length) % searchTags.length;
                searchTags[nextIndex].focus();
            }
        });
    });
    
    // Clear search functionality
    function addClearButton() {
        const searchContainer = searchInput.parentNode;
        const clearButton = document.createElement('button');
        clearButton.className = 'search-clear';
        clearButton.innerHTML = '×';
        clearButton.setAttribute('aria-label', 'Limpar busca');
        clearButton.style.cssText = `
            position: absolute;
            right: 1rem;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            font-size: 1.5rem;
            color: var(--text-muted);
            cursor: pointer;
            padding: 0.25rem;
            border-radius: 50%;
            transition: all 0.3s ease;
            display: none;
        `;
        
        clearButton.addEventListener('click', function() {
            searchInput.value = '';
            searchInput.focus();
            filterProjects();
            this.style.display = 'none';
        });
        
        // Show/hide clear button based on input content
        searchInput.addEventListener('input', function() {
            clearButton.style.display = this.value ? 'block' : 'none';
        });
        
        searchContainer.style.position = 'relative';
        searchContainer.appendChild(clearButton);
    }
    
    addClearButton();
    
    // Add search suggestions
    function addSearchSuggestions() {
        const suggestions = [
            'React', 'Node.js', 'Python', 'JavaScript', 'TypeScript',
            'Vue.js', 'Express', 'MongoDB', 'PostgreSQL', 'AWS',
            'Docker', 'Firebase', 'Redux', 'GraphQL', 'REST API'
        ];
        
        const suggestionsList = document.createElement('div');
        suggestionsList.className = 'search-suggestions';
        suggestionsList.style.cssText = `
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--bg-primary);
            border: 1px solid var(--border-color);
            border-top: none;
            border-radius: 0 0 0.5rem 0.5rem;
            max-height: 200px;
            overflow-y: auto;
            z-index: 100;
            display: none;
            box-shadow: var(--shadow-medium);
        `;
        
        searchInput.parentNode.appendChild(suggestionsList);
        
        function showSuggestions(query) {
            if (!query.trim()) {
                suggestionsList.style.display = 'none';
                return;
            }
            
            const filteredSuggestions = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(query.toLowerCase())
            ).slice(0, 5);
            
            if (filteredSuggestions.length === 0) {
                suggestionsList.style.display = 'none';
                return;
            }
            
            suggestionsList.innerHTML = filteredSuggestions.map(suggestion => `
                <div class="suggestion-item" style="
                    padding: 0.75rem 1rem;
                    cursor: pointer;
                    border-bottom: 1px solid var(--border-color);
                    transition: background-color 0.2s ease;
                    color: var(--text-primary);
                " data-suggestion="${suggestion}">
                    ${suggestion}
                </div>
            `).join('');
            
            suggestionsList.style.display = 'block';
            
            // Add click handlers to suggestions
            suggestionsList.querySelectorAll('.suggestion-item').forEach(item => {
                item.addEventListener('click', function() {
                    searchInput.value = this.getAttribute('data-suggestion');
                    suggestionsList.style.display = 'none';
                    filterProjects();
                });
                
                item.addEventListener('mouseenter', function() {
                    this.style.backgroundColor = 'var(--bg-secondary)';
                });
                
                item.addEventListener('mouseleave', function() {
                    this.style.backgroundColor = 'transparent';
                });
            });
        }
        
        searchInput.addEventListener('input', function() {
            showSuggestions(this.value);
        });
        
        // Hide suggestions when clicking outside
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !suggestionsList.contains(e.target)) {
                suggestionsList.style.display = 'none';
            }
        });
    }
    
    addSearchSuggestions();
    
    // Utility functions
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
    
    function addRippleEffect(element) {
        const ripple = document.createElement('span');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            transform: scale(0);
            animation: ripple-animation 0.6s linear;
            width: 20px;
            height: 20px;
            left: 50%;
            top: 50%;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    // Add CSS for ripple animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
        
        .search-suggestions::-webkit-scrollbar {
            width: 4px;
        }
        
        .search-suggestions::-webkit-scrollbar-track {
            background: var(--bg-secondary);
        }
        
        .search-suggestions::-webkit-scrollbar-thumb {
            background: var(--text-muted);
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);
});