// Destinations page functionality
document.addEventListener('DOMContentLoaded', function() {
    initDestinationFilters();
    initDestinationAnimations();
});

// Filter functionality
function initDestinationFilters() {
    const regionFilter = document.getElementById('region-filter');
    const countryFilter = document.getElementById('country-filter');
    const settingFilter = document.getElementById('setting-filter');
    const seasonFilter = document.getElementById('season-filter');
    const resetButton = document.getElementById('reset-filters');
    const destinationCards = document.querySelectorAll('.destination-card');
    const noResults = document.getElementById('no-results');
    const destinationsContainer = document.getElementById('destinations-container');

    // Filter destinations
    function filterDestinations() {
        const regionValue = regionFilter.value;
        const countryValue = countryFilter.value;
        const settingValue = settingFilter.value;
        const seasonValue = seasonFilter.value;
        
        let visibleCount = 0;
        
        destinationCards.forEach(card => {
            const cardRegion = card.dataset.region;
            const cardCountry = card.dataset.country;
            const cardSetting = card.dataset.setting;
            const cardSeason = card.dataset.season;
            
            const regionMatch = regionValue === 'all' || cardRegion === regionValue;
            const countryMatch = countryValue === 'all' || cardCountry === countryValue;
            const settingMatch = settingValue === 'all' || cardSetting === settingValue;
            const seasonMatch = seasonValue === 'all' || cardSeason === seasonValue;
            
            if (regionMatch && countryMatch && settingMatch && seasonMatch) {
                card.classList.remove('hidden');
                card.classList.add('filter-animation');
                setTimeout(() => {
                    card.classList.add('show');
                }, 50 * visibleCount);
                visibleCount++;
            } else {
                card.classList.add('hidden');
                card.classList.remove('filter-animation', 'show');
            }
        });
        
        // Show/hide no results message
        if (visibleCount === 0) {
            noResults.style.display = 'block';
            destinationsContainer.style.display = 'none';
        } else {
            noResults.style.display = 'none';
            destinationsContainer.style.display = 'grid';
        }
        
        // Update URL with current filters
        updateURL({
            region: regionValue,
            country: countryValue,
            setting: settingValue,
            season: seasonValue
        });
    }
    
    // Reset all filters
    function resetFilters() {
        regionFilter.value = 'all';
        countryFilter.value = 'all';
        settingFilter.value = 'all';
        seasonFilter.value = 'all';
        
        destinationCards.forEach(card => {
            card.classList.remove('hidden', 'filter-animation', 'show');
        });
        
        noResults.style.display = 'none';
        destinationsContainer.style.display = 'grid';
        
        // Clear URL parameters
        updateURL({});
        
        // Show success message
        showNotification('Filters reset successfully!', 'success');
    }
    
    // Update URL with filter parameters
    function updateURL(filters) {
        const url = new URL(window.location);
        
        Object.keys(filters).forEach(key => {
            if (filters[key] && filters[key] !== 'all') {
                url.searchParams.set(key, filters[key]);
            } else {
                url.searchParams.delete(key);
            }
        });
        
        window.history.replaceState({}, '', url);
    }
    
    // Load filters from URL
    function loadFiltersFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        
        const region = urlParams.get('region');
        const country = urlParams.get('country');
        const setting = urlParams.get('setting');
        const season = urlParams.get('season');
        
        if (region) regionFilter.value = region;
        if (country) countryFilter.value = country;
        if (setting) settingFilter.value = setting;
        if (season) seasonFilter.value = season;
        
        // Apply filters if any were found in URL
        if (region || country || setting || season) {
            filterDestinations();
        }
    }
    
    // Dynamic country filter based on region
    function updateCountryFilter() {
        const regionValue = regionFilter.value;
        const countryOptions = {
            'all': ['italy', 'japan', 'thailand', 'greece', 'peru', 'egypt', 'australia', 'iceland'],
            'europe': ['italy', 'greece', 'iceland'],
            'asia': ['japan', 'thailand'],
            'americas': ['peru'],
            'africa': ['egypt'],
            'oceania': ['australia']
        };
        
        const availableCountries = countryOptions[regionValue] || countryOptions['all'];
        const countrySelect = countryFilter;
        
        // Store current selection
        const currentCountry = countrySelect.value;
        
        // Clear and rebuild options
        Array.from(countrySelect.options).forEach((option, index) => {
            if (index > 0) { // Keep "All Countries" option
                option.style.display = availableCountries.includes(option.value) ? 'block' : 'none';
            }
        });
        
        // Reset country filter if current selection is not available
        if (currentCountry !== 'all' && !availableCountries.includes(currentCountry)) {
            countrySelect.value = 'all';
        }
    }
    
    // Event listeners
    regionFilter.addEventListener('change', () => {
        updateCountryFilter();
        filterDestinations();
    });
    
    countryFilter.addEventListener('change', filterDestinations);
    settingFilter.addEventListener('change', filterDestinations);
    seasonFilter.addEventListener('change', filterDestinations);
    resetButton.addEventListener('click', resetFilters);
    
    // Initialize
    loadFiltersFromURL();
    updateCountryFilter();
}

// Destination card animations
function initDestinationAnimations() {
    const cards = document.querySelectorAll('.destination-card');
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Set initial state and observe cards
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s ease ${index * 0.1}s`;
        observer.observe(card);
    });
    
    // Card click handling
    cards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking on the explore button
            if (!e.target.classList.contains('explore-btn')) {
                const exploreBtn = this.querySelector('.explore-btn');
                if (exploreBtn) {
                    exploreBtn.click();
                }
            }
        });
    });
}

// Search functionality
function initDestinationSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Search destinations...';
    searchInput.className = 'destination-search';
    
    // Add search input to filter container
    const filterContainer = document.querySelector('.filter-container');
    if (filterContainer) {
        const searchGroup = document.createElement('div');
        searchGroup.className = 'filter-group';
        
        const searchLabel = document.createElement('label');
        searchLabel.textContent = 'Search';
        searchLabel.setAttribute('for', 'destination-search');
        
        searchInput.id = 'destination-search';
        
        searchGroup.appendChild(searchLabel);
        searchGroup.appendChild(searchInput);
        filterContainer.insertBefore(searchGroup, filterContainer.firstChild);
    }
    
    // Search functionality
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const cards = document.querySelectorAll('.destination-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                          description.includes(searchTerm) || 
                          tags.some(tag => tag.includes(searchTerm));
            
            if (matches || searchTerm === '') {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
}

// Favorite destinations functionality
function initFavorites() {
    const cards = document.querySelectorAll('.destination-card');
    
    cards.forEach(card => {
        // Add favorite button
        const favoriteBtn = document.createElement('button');
        favoriteBtn.className = 'favorite-btn';
        favoriteBtn.innerHTML = '<i class="far fa-heart"></i>';
        favoriteBtn.setAttribute('aria-label', 'Add to favorites');
        
        const cardImage = card.querySelector('.card-image');
        cardImage.appendChild(favoriteBtn);
        
        // Check if already favorited
        const destinationName = card.querySelector('h3').textContent;
        const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
        
        if (favorites.includes(destinationName)) {
            favoriteBtn.classList.add('favorited');
            favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';
        }
        
        // Toggle favorite
        favoriteBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            
            const isFavorited = this.classList.contains('favorited');
            const favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            
            if (isFavorited) {
                // Remove from favorites
                const index = favorites.indexOf(destinationName);
                if (index > -1) {
                    favorites.splice(index, 1);
                }
                this.classList.remove('favorited');
                this.innerHTML = '<i class="far fa-heart"></i>';
                showNotification('Removed from favorites', 'info');
            } else {
                // Add to favorites
                favorites.push(destinationName);
                this.classList.add('favorited');
                this.innerHTML = '<i class="fas fa-heart"></i>';
                showNotification('Added to favorites!', 'success');
            }
            
            localStorage.setItem('favorites', JSON.stringify(favorites));
        });
    });
}

// Sort functionality
function initSorting() {
    const sortSelect = document.createElement('select');
    sortSelect.className = 'filter-select';
    sortSelect.innerHTML = `
        <option value="default">Default Order</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="region">By Region</option>
    `;
    
    const filterContainer = document.querySelector('.filter-container');
    if (filterContainer) {
        const sortGroup = document.createElement('div');
        sortGroup.className = 'filter-group';
        
        const sortLabel = document.createElement('label');
        sortLabel.textContent = 'Sort By';
        
        sortGroup.appendChild(sortLabel);
        sortGroup.appendChild(sortSelect);
        filterContainer.appendChild(sortGroup);
    }
    
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        const container = document.getElementById('destinations-container');
        const cards = Array.from(container.querySelectorAll('.destination-card'));
        
        cards.sort((a, b) => {
            switch (sortValue) {
                case 'name-asc':
                    return a.querySelector('h3').textContent.localeCompare(b.querySelector('h3').textContent);
                case 'name-desc':
                    return b.querySelector('h3').textContent.localeCompare(a.querySelector('h3').textContent);
                case 'region':
                    return a.dataset.region.localeCompare(b.dataset.region);
                default:
                    return 0;
            }
        });
        
        // Re-append sorted cards
        cards.forEach(card => container.appendChild(card));
    });
}

// Initialize additional features
document.addEventListener('DOMContentLoaded', function() {
    initDestinationSearch();
    initFavorites();
    initSorting();
});

// Add CSS for additional features
const additionalStyles = `
    .destination-search {
        padding: 12px 15px;
        border: 2px solid #ddd;
        border-radius: 10px;
        background: white;
        font-size: 1rem;
        color: #1a1a1a;
        transition: all 0.3s ease;
        outline: none;
        width: 100%;
    }
    
    .destination-search:focus {
        border-color: #e6007e;
        box-shadow: 0 0 0 3px rgba(230, 0, 126, 0.1);
    }
    
    .favorite-btn {
        position: absolute;
        top: 15px;
        right: 15px;
        background: rgba(255, 255, 255, 0.9);
        border: none;
        width: 40px;
        height: 40px;
        border-radius: 50%;
        cursor: pointer;
        transition: all 0.3s ease;
        z-index: 10;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 1.2rem;
        color: #666;
    }
    
    .favorite-btn:hover {
        background: white;
        transform: scale(1.1);
    }
    
    .favorite-btn.favorited {
        color: #e6007e;
    }
    
    .favorite-btn.favorited:hover {
        color: #ff4da6;
    }
`;

const additionalStyleSheet = document.createElement('style');
additionalStyleSheet.textContent = additionalStyles;
document.head.appendChild(additionalStyleSheet);