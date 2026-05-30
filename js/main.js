// Main JavaScript file for ChiyaSeeYa website

// Store menu data globally for filtering
let menuData = null;
let currentCategory = 'all';

document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the menu page
    const menuContainer = document.getElementById('menu-container');
    const filterButtons = document.getElementById('filter-buttons');
    
    if (menuContainer && filterButtons) {
        // We're on the menu page - load menu with filtering
        loadMenuWithFilter();
    }
    
    // Initialize navigation highlighting
    initNavigationHighlight();
});

// Initialize navigation highlighting based on current page
function initNavigationHighlight() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        } else if (href.includes('#')) {
            // Handle anchor links
            const page = href.split('#')[0];
            if (page === currentPage || (page === '' && currentPage === 'index.html')) {
                // Don't add active class to anchor links on the same page
            }
        }
    });
}

// Load menu with filtering capability
function loadMenuWithFilter() {
    fetch('menu.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            menuData = data;
            createFilterButtons(data);
            renderMenu(data, 'all');
        })
        .catch(error => {
            console.error('Error loading menu:', error);
            document.getElementById('menu-container').innerHTML = 
                '<div class="no-results"><i class="fas fa-exclamation-circle"></i><p>Unable to load menu at this time. Please try again later.</p></div>';
        });
}

// Create filter buttons dynamically
function createFilterButtons(data) {
    const filterContainer = document.getElementById('filter-buttons');
    
    // Keep the "All" button, just remove category buttons
    const existingCategoryButtons = filterContainer.querySelectorAll('.filter-btn[data-category]:not([data-category="all"])');
    existingCategoryButtons.forEach(btn => btn.remove());
    
    // Create buttons for each category
    if (data.categories && data.categories.length > 0) {
        data.categories.forEach((category, index) => {
            const button = document.createElement('button');
            button.className = 'filter-btn';
            button.setAttribute('data-category', category.name.toLowerCase().replace(/\s+/g, '-'));
            
            // Add icon based on category
            const icon = category.icon || 'fas fa-utensils';
            
            button.innerHTML = `<i class="${icon} me-1"></i> ${category.name}`;
            
            // Add click event
            button.addEventListener('click', function() {
                filterMenu(category.name.toLowerCase().replace(/\s+/g, '-'));
            });
            
            filterContainer.appendChild(button);
        });
    }
}

// Filter menu by category
function filterMenu(category) {
    currentCategory = category;
    
    // Update active button
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.getAttribute('data-category') === category) {
            btn.classList.add('active');
        }
    });
    
    // Re-render menu with filter
    renderMenu(menuData, category);
}

// Render menu items
function renderMenu(data, filterCategory) {
    const menuContainer = document.getElementById('menu-container');
    menuContainer.innerHTML = '';
    
    if (!data.categories || data.categories.length === 0) {
        menuContainer.innerHTML = '<div class="no-results"><i class="fas fa-inbox"></i><p>No menu items available.</p></div>';
        return;
    }
    
    let hasItems = false;
    
    data.categories.forEach(category => {
        // Check if this category should be displayed
        if (filterCategory !== 'all') {
            const categorySlug = category.name.toLowerCase().replace(/\s+/g, '-');
            if (categorySlug !== filterCategory) {
                return;
            }
        }
        
        if (!category.items || category.items.length === 0) {
            return;
        }
        
        hasItems = true;
        
        // Create category section
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'menu-category';
        categoryDiv.setAttribute('data-category', category.name.toLowerCase().replace(/\s+/g, '-'));
        
        // Category header with icon
        const categoryIcon = category.icon || 'fas fa-utensils';
        
        const categoryHeader = document.createElement('div');
        categoryHeader.className = 'category-header';
        categoryHeader.innerHTML = `
            <div class="category-icon-wrapper">
                <i class="${categoryIcon}"></i>
            </div>
            <h3 class="category-title">${escapeHtml(category.name)} 
                <span class="item-count">(${category.items.length} items)</span>
            </h3>
        `;
        categoryDiv.appendChild(categoryHeader);
        
        // Items grid
        const itemsGrid = document.createElement('div');
        itemsGrid.className = 'menu-items-grid';
        
        category.items.forEach(item => {
            const itemCard = document.createElement('div');
            itemCard.className = 'menu-item';
            itemCard.innerHTML = `
                <div class="menu-item-header">
                    <h4 class="menu-item-name">${escapeHtml(item.name)}</h4>
                    <span class="menu-item-price">${escapeHtml(item.price)}</span>
                </div>
                <p class="menu-item-description">${escapeHtml(item.description)}</p>
            `;
            itemsGrid.appendChild(itemCard);
        });
        
        categoryDiv.appendChild(itemsGrid);
        menuContainer.appendChild(categoryDiv);
    });
    
    // Show "no results" if nothing matches
    if (!hasItems) {
        menuContainer.innerHTML = `
            <div class="no-results">
                <i class="fas fa-search"></i>
                <p>No items found in this category.</p>
            </div>
        `;
    }
    
    // Add loaded class for animation
    menuContainer.classList.remove('loading');
    menuContainer.classList.add('loaded');
}

// Utility function to escape HTML to prevent XSS
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Handle navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 4px 20px rgba(0,0,0,0.2)';
        } else {
            navbar.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
        }
    }
});