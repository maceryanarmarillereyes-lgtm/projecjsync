// Page Manager
const PageManager = {
    currentPage: null,
    pages: {},
    
    // Register a page
    registerPage: function(pageId, pageObject) {
        console.log('PageManager: Registering page:', pageId);
        this.pages[pageId] = pageObject;
    },
    
    // Load a page
    loadPage: function(pageId) {
        console.log('PageManager: Loading page:', pageId);
        const pageContainer = document.getElementById('page-content-container');
        
        if (!pageContainer) {
            console.error('PageManager: page-content-container element not found');
            return;
        }
        
        // Hide all pages
        pageContainer.innerHTML = '';
        
        // Check if page exists
        if (this.pages[pageId]) {
            console.log('PageManager: Page found, rendering...');
            // Render the page
            const pageHTML = this.pages[pageId].render();
            pageContainer.innerHTML = pageHTML;
            
            // Initialize the page
            if (typeof this.pages[pageId].init === 'function') {
                console.log('PageManager: Initializing page...');
                this.pages[pageId].init();
            }
            
            this.currentPage = pageId;
            console.log('PageManager: Page loaded successfully:', pageId);
        } else {
            console.warn('PageManager: Page not found:', pageId);
            // Page not found, show error
            pageContainer.innerHTML = `
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Page Not Found</h2>
                    <p>The page "${pageId}" does not exist or is not registered.</p>
                    <p>Available pages: ${Object.keys(this.pages).join(', ')}</p>
                </div>
            `;
        }
    },
    
    // Get current page
    getCurrentPage: function() {
        return this.currentPage;
    }
};