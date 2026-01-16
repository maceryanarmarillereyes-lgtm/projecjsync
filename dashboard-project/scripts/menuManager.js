// Enhanced Menu Manager with Role-Based Access Control
const MenuManager = {
    currentPage: null,
    
    // Menu item permissions mapping
    menuPermissions: {
        'mailbox': ['view_mailbox'],
        'schedule': ['view_schedule'],
        'service': ['view_service_cases'],
        'assignment': ['view_assignment'],
        'files': ['view_files'],
        'notes': ['view_notes'],
        'support': ['view_support_tool'],
        'procedural': ['view_procedural'],
        'skills': ['view_skills'],
        'partnumber': ['view_partnumber'],
        'members': ['view_members'],
        'connectplus': ['view_connectplus'],
        'connectsites': ['view_connectsites'],
        'usermanagement': ['manage_users', 'view_team_data'],
        'settings': ['view_settings']
    },
    
    // Menu item visibility based on role
    menuVisibility: {
        'mailbox': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'schedule': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'service': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'assignment': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'files': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'notes': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'support': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'procedural': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'skills': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'partnumber': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'members': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'connectplus': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'connectsites': ['ADMIN', 'TEAM_LEAD', 'MEMBER'],
        'usermanagement': ['ADMIN', 'TEAM_LEAD'],
        'settings': ['ADMIN', 'TEAM_LEAD', 'MEMBER']
    },
    
    // Initialize menu
    init: function() {
        console.log('MenuManager: Initializing enhanced menu...');
        this.initializeMenuList();
        this.setupEventListeners();
        this.loadInitialPage();
        this.updateMenuAccessibility();
    },
    
    // Initialize menu list with retry mechanism
    initializeMenuList: function() {
        const menuList = document.getElementById('menuSectionList');
        if (!menuList) {
            console.error('MenuManager: menuSectionList element not found, retrying...');
            setTimeout(() => this.initializeMenuList(), 100);
            return;
        }
        this.renderMenu();
    },
    
    // Render menu items with role-based filtering
    renderMenu: function() {
        const menuList = document.getElementById('menuSectionList');
        if (!menuList) {
            console.error('MenuManager: menuSectionList element not found');
            return;
        }
        
        // Get current user
        const currentUser = UserManager.currentUser;
        if (!currentUser) {
            console.error('MenuManager: No current user found');
            return;
        }
        
        const allMenuItems = DashboardConfig.getAllMenuItems();
        console.log('MenuManager: Rendering menu items for user:', currentUser.role);
        
        // Clear existing menu
        menuList.innerHTML = '';
        
        // Filter menu items based on user role and permissions
        const accessibleMenuItems = this.getAccessibleMenuItems(currentUser);
        
        // Render filtered menu items
        accessibleMenuItems.forEach(item => {
            const li = this.createMenuItemElement(item, currentUser);
            menuList.appendChild(li);
        });
        
        // Add Settings menu item (always visible but with permissions)
        const settingsLi = this.createSettingsMenuItem(currentUser);
        menuList.appendChild(settingsLi);
        
        console.log('MenuManager: Menu rendered successfully. Items:', accessibleMenuItems.length);
    },
    
    // Get accessible menu items for current user
    getAccessibleMenuItems: function(currentUser) {
        const allMenuItems = DashboardConfig.getAllMenuItems();
        
        return allMenuItems.filter(item => {
            // Check role-based visibility
            if (!this.isMenuVisibleToUser(item.id, currentUser)) {
                return false;
            }
            
            // Check permissions if defined
            if (this.menuPermissions[item.id]) {
                const hasPermission = this.menuPermissions[item.id].some(permission => 
                    UserManager.hasPermission(permission)
                );
                if (!hasPermission) return false;
            }
            
            return true;
        });
    },
    
    // Check if menu is visible to user based on role
    isMenuVisibleToUser: function(menuId, currentUser) {
        const allowedRoles = this.menuVisibility[menuId];
        if (!allowedRoles) return true; // Default to visible if not specified
        
        return allowedRoles.includes(currentUser.role);
    },
    
    // Create menu item element
    createMenuItemElement: function(item, currentUser) {
        const li = document.createElement('li');
        li.dataset.page = item.page;
        li.dataset.id = item.id;
        
        // Add role-based class for styling
        li.classList.add(`menu-${currentUser.role.toLowerCase()}`);
        
        const titleSpan = document.createElement('span');
        titleSpan.textContent = item.title;
        
        // Add icon if specified in config
        if (item.icon) {
            titleSpan.innerHTML = `<i class="${item.icon}"></i> ${item.title}`;
        }
        
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'menu-item-actions';
        
        // Only show actions for removable items
        if (item.removable && UserManager.hasPermission('manage_settings')) {
            const editBtn = document.createElement('button');
            editBtn.className = 'menu-item-btn edit';
            editBtn.innerHTML = '<i class="fas fa-edit"></i>';
            editBtn.title = 'Edit Menu';
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.editMenuItem(item.id);
            });
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'menu-item-btn delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
            deleteBtn.title = 'Delete Menu';
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteMenuItem(item.id);
            });
            
            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
        }
        
        li.appendChild(titleSpan);
        li.appendChild(actionsDiv);
        
        li.addEventListener('click', () => {
            console.log('Menu click:', item.page);
            
            // Check if user has permission to access this page
            if (!this.canAccessPage(item.id, currentUser)) {
                this.showAccessDeniedMessage();
                return;
            }
            
            this.switchPage(item.page);
        });
        
        return li;
    },
    
    // Create settings menu item
    createSettingsMenuItem: function(currentUser) {
        const li = document.createElement('li');
        li.dataset.page = 'settings';
        li.classList.add(`menu-${currentUser.role.toLowerCase()}`);
        
        li.innerHTML = '<span><i class="fas fa-cog"></i> SETTINGS</span>';
        
        li.addEventListener('click', () => {
            if (!this.canAccessPage('settings', currentUser)) {
                this.showAccessDeniedMessage();
                return;
            }
            
            this.switchPage('settings');
        });
        
        return li;
    },
    
    // Check if user can access a page
    canAccessPage: function(pageId, currentUser) {
        // Always allow access to basic pages
        const basicPages = ['mailbox', 'schedule', 'service', 'assignment', 'files', 'notes', 'support', 'procedural', 'skills', 'partnumber', 'members', 'connectplus', 'connectsites'];
        
        if (basicPages.includes(pageId)) {
            return true;
        }
        
        // Check role-based access for special pages
        switch (pageId) {
            case 'usermanagement':
                return currentUser.role === 'ADMIN' || currentUser.role === 'TEAM_LEAD';
            case 'settings':
                return true; // Everyone can access settings
            default:
                return true;
        }
    },
    
    // Show access denied message
    showAccessDeniedMessage: function() {
        // Create notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>Access Denied: You do not have permission to access this page.</span>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Settings button in profile section
        const settingsButton = document.getElementById('settingsButton');
        if (settingsButton) {
            settingsButton.addEventListener('click', () => {
                if (!UserManager.currentUser) return;
                
                if (!this.canAccessPage('settings', UserManager.currentUser)) {
                    this.showAccessDeniedMessage();
                    return;
                }
                
                this.switchPage('settings');
            });
        }
        
        // Listen for user status changes to update menu
        document.addEventListener('userStatusChanged', () => {
            this.updateMenuAccessibility();
        });
        
        // Listen for user role changes
        document.addEventListener('userRoleChanged', () => {
            this.refresh();
        });
        
        // Handle browser history
        window.addEventListener('popstate', (event) => {
            this.handlePopState(event);
        });
    },
    
    // Update menu accessibility based on user permissions
    updateMenuAccessibility: function() {
        const currentUser = UserManager.currentUser;
        if (!currentUser) return;
        
        const menuItems = document.querySelectorAll('.menu-section-list li');
        
        menuItems.forEach(item => {
            const pageId = item.dataset.page;
            
            // Enable/disable based on permissions
            if (this.canAccessPage(pageId, currentUser)) {
                item.classList.remove('disabled');
                item.style.opacity = '1';
                item.style.cursor = 'pointer';
            } else {
                item.classList.add('disabled');
                item.style.opacity = '0.5';
                item.style.cursor = 'not-allowed';
            }
        });
    },
    
    // Switch to a page
    switchPage: function(pageId) {
        console.log('MenuManager: Switching to page:', pageId);
        
        const currentUser = UserManager.currentUser;
        if (!currentUser) {
            console.error('MenuManager: No user logged in');
            return;
        }
        
        // Check permissions
        if (!this.canAccessPage(pageId, currentUser)) {
            this.showAccessDeniedMessage();
            return;
        }
        
        // Update active state in menu
        const menuItems = document.querySelectorAll('.menu-section-list li');
        menuItems.forEach(li => {
            li.classList.remove('active');
            if (li.dataset.page === pageId) {
                li.classList.add('active');
            }
        });
        
        // Load the page
        if (typeof PageManager !== 'undefined') {
            PageManager.loadPage(pageId);
        } else {
            console.error('PageManager not found!');
        }
        
        this.currentPage = pageId;
        
        // Update browser history
        this.updateBrowserHistory(pageId);
        
        // Log page access
        this.logPageAccess(pageId);
    },
    
    // Update browser history
    updateBrowserHistory: function(pageId) {
        const state = { page: pageId };
        const title = `Dashboard - ${pageId.charAt(0).toUpperCase() + pageId.slice(1)}`;
        const url = `#${pageId}`;
        
        history.pushState(state, title, url);
    },
    
    // Handle browser back/forward
    handlePopState: function(event) {
        if (event.state && event.state.page) {
            const pageId = event.state.page;
            const currentUser = UserManager.currentUser;
            
            if (currentUser && this.canAccessPage(pageId, currentUser)) {
                this.switchPage(pageId);
            }
        }
    },
    
    // Log page access
    logPageAccess: function(pageId) {
        const currentUser = UserManager.currentUser;
        if (!currentUser) return;
        
        const logEntry = {
            user: currentUser.email,
            page: pageId,
            timestamp: new Date().toISOString(),
            action: 'page_access'
        };
        
        console.log('Page access logged:', logEntry);
        
        // You could send this to a server or save to localStorage
        this.saveActivityLog(logEntry);
    },
    
    // Save activity log
    saveActivityLog: function(logEntry) {
        try {
            // Get existing logs
            const logs = JSON.parse(localStorage.getItem('dashboard_activity_logs') || '[]');
            
            // Add new log
            logs.push(logEntry);
            
            // Keep only last 100 logs
            if (logs.length > 100) {
                logs.shift();
            }
            
            // Save back to localStorage
            localStorage.setItem('dashboard_activity_logs', JSON.stringify(logs));
        } catch (error) {
            console.error('Error saving activity log:', error);
        }
    },
    
    // Load initial page
    loadInitialPage: function() {
        const currentUser = UserManager.currentUser;
        if (!currentUser) {
            console.error('MenuManager: No user logged in for initial page');
            return;
        }
        
        // Check URL hash for page
        const hashPage = window.location.hash.substring(1);
        if (hashPage && this.canAccessPage(hashPage, currentUser)) {
            console.log('MenuManager: Loading page from URL hash:', hashPage);
            this.switchPage(hashPage);
            return;
        }
        
        // Load default page based on user role
        let defaultPage = 'mailbox';
        
        // Admin and Team Lead see user management as default if accessible
        if ((currentUser.role === 'ADMIN' || currentUser.role === 'TEAM_LEAD') && 
            this.canAccessPage('usermanagement', currentUser)) {
            defaultPage = 'mailbox'; // Or set to usermanagement if you prefer
        }
        
        // Find default page from config
        const defaultMenuItem = DashboardConfig.defaultMenuItems.find(item => item.default);
        if (defaultMenuItem && this.canAccessPage(defaultMenuItem.page, currentUser)) {
            defaultPage = defaultMenuItem.page;
        }
        
        console.log('MenuManager: Loading initial page:', defaultPage);
        this.switchPage(defaultPage);
    },
    
    // Add new menu item
    addMenuItem: function(title, pageId) {
        // Check permission
        if (!UserManager.hasPermission('manage_settings') && 
            !UserManager.isAdmin() && 
            !UserManager.isTeamLead()) {
            this.showAccessDeniedMessage();
            return null;
        }
        
        const newItem = {
            id: `custom_${Date.now()}`,
            title: title.toUpperCase(),
            page: pageId.toLowerCase().replace(/\s+/g, '_'),
            removable: true,
            custom: true
        };
        
        const customItems = DashboardConfig.getCustomMenuItems();
        customItems.push(newItem);
        DashboardConfig.saveCustomMenuItems(customItems);
        
        this.refresh();
        
        // Switch to the new page
        this.switchPage(newItem.page);
        
        return newItem;
    },
    
    // Edit menu item
    editMenuItem: function(itemId) {
        // Check permission
        if (!UserManager.hasPermission('manage_settings') && 
            !UserManager.isAdmin() && 
            !UserManager.isTeamLead()) {
            this.showAccessDeniedMessage();
            return;
        }
        
        const customItems = DashboardConfig.getCustomMenuItems();
        const item = customItems.find(i => i.id === itemId);
        
        if (item) {
            const newTitle = prompt('Enter new menu title:', item.title);
            if (newTitle && newTitle.trim()) {
                item.title = newTitle.toUpperCase();
                DashboardConfig.saveCustomMenuItems(customItems);
                this.refresh();
            }
        }
    },
    
    // Delete menu item
    deleteMenuItem: function(itemId) {
        // Check permission
        if (!UserManager.hasPermission('manage_settings') && 
            !UserManager.isAdmin() && 
            !UserManager.isTeamLead()) {
            this.showAccessDeniedMessage();
            return;
        }
        
        if (confirm('Are you sure you want to delete this menu item?')) {
            const customItems = DashboardConfig.getCustomMenuItems();
            const filteredItems = customItems.filter(i => i.id !== itemId);
            DashboardConfig.saveCustomMenuItems(filteredItems);
            this.refresh();
            
            // If we deleted the current page, switch to mailbox
            if (this.currentPage === itemId) {
                this.switchPage('mailbox');
            }
        }
    },
    
    // Refresh menu
    refresh: function() {
        this.renderMenu();
        
        // If current page is no longer accessible, redirect to default
        const currentUser = UserManager.currentUser;
        if (currentUser && this.currentPage && !this.canAccessPage(this.currentPage, currentUser)) {
            console.log('MenuManager: Current page no longer accessible, redirecting...');
            this.loadInitialPage();
        }
    },
    
    // Get current page
    getCurrentPage: function() {
        return this.currentPage;
    },
    
    // Check if user can manage menu
    canManageMenu: function() {
        return UserManager.hasPermission('manage_settings') || 
               UserManager.isAdmin() || 
               UserManager.isTeamLead();
    },
    
    // Show menu management interface
    showMenuManagement: function() {
        if (!this.canManageMenu()) {
            this.showAccessDeniedMessage();
            return;
        }
        
        // Create modal for menu management
        const modalHTML = `
            <div class="modal-overlay" id="menuManagementModal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Menu Management</h3>
                        <button class="modal-close" id="menuModalClose">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="menu-management-form">
                            <div class="form-group">
                                <label for="newMenuTitle">New Menu Title:</label>
                                <input type="text" id="newMenuTitle" class="form-input" placeholder="Enter menu title">
                            </div>
                            <div class="form-group">
                                <label for="newMenuPage">Page ID:</label>
                                <input type="text" id="newMenuPage" class="form-input" placeholder="Enter page ID (no spaces)">
                            </div>
                            <div class="form-actions">
                                <button class="cancel-btn" id="cancelMenuBtn">Cancel</button>
                                <button class="submit-btn" id="addMenuBtn">Add Menu Item</button>
                            </div>
                        </div>
                        
                        <div class="existing-menus">
                            <h4>Existing Custom Menus</h4>
                            <div id="customMenusList"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('menuManagementModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        document.getElementById('menuManagementModal').style.display = 'flex';
        
        // Load existing custom menus
        this.loadCustomMenusList();
        
        // Setup modal event listeners
        this.setupMenuManagementModal();
    },
    
    // Setup menu management modal
    setupMenuManagementModal: function() {
        // Close button
        document.getElementById('menuModalClose')?.addEventListener('click', () => {
            document.getElementById('menuManagementModal').style.display = 'none';
        });
        
        // Cancel button
        document.getElementById('cancelMenuBtn')?.addEventListener('click', () => {
            document.getElementById('menuManagementModal').style.display = 'none';
        });
        
        // Add menu button
        document.getElementById('addMenuBtn')?.addEventListener('click', () => {
            this.addCustomMenuItem();
        });
        
        // Handle Enter key
        document.getElementById('newMenuTitle')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addCustomMenuItem();
            }
        });
    },
    
    // Load custom menus list
    loadCustomMenusList: function() {
        const customMenusList = document.getElementById('customMenusList');
        if (!customMenusList) return;
        
        const customItems = DashboardConfig.getCustomMenuItems();
        
        if (customItems.length === 0) {
            customMenusList.innerHTML = '<p class="no-custom-menus">No custom menu items yet.</p>';
            return;
        }
        
        customMenusList.innerHTML = customItems.map(item => `
            <div class="custom-menu-item">
                <div class="menu-item-info">
                    <span class="menu-title">${item.title}</span>
                    <span class="menu-page">${item.page}</span>
                </div>
                <div class="menu-item-actions">
                    <button class="action-btn edit-menu-btn" data-id="${item.id}" title="Edit">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-menu-btn" data-id="${item.id}" title="Delete">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        // Add event listeners for edit/delete buttons
        customMenusList.querySelectorAll('.edit-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.edit-menu-btn').dataset.id;
                this.editCustomMenuItem(itemId);
            });
        });
        
        customMenusList.querySelectorAll('.delete-menu-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = e.target.closest('.delete-menu-btn').dataset.id;
                this.deleteCustomMenuItem(itemId);
            });
        });
    },
    
    // Add custom menu item from modal
    addCustomMenuItem: function() {
        const titleInput = document.getElementById('newMenuTitle');
        const pageInput = document.getElementById('newMenuPage');
        
        if (!titleInput || !pageInput) return;
        
        const title = titleInput.value.trim();
        const page = pageInput.value.trim();
        
        if (!title || !page) {
            alert('Please fill in both title and page ID.');
            return;
        }
        
        // Validate page ID format (no spaces, lowercase)
        const validPageId = page.toLowerCase().replace(/\s+/g, '_');
        
        this.addMenuItem(title, validPageId);
        
        // Clear inputs
        titleInput.value = '';
        pageInput.value = '';
        
        // Refresh list
        this.loadCustomMenusList();
    },
    
    // Edit custom menu item
    editCustomMenuItem: function(itemId) {
        const customItems = DashboardConfig.getCustomMenuItems();
        const item = customItems.find(i => i.id === itemId);
        
        if (item) {
            const newTitle = prompt('Enter new menu title:', item.title);
            if (newTitle && newTitle.trim()) {
                item.title = newTitle.toUpperCase();
                DashboardConfig.saveCustomMenuItems(customItems);
                this.refresh();
                this.loadCustomMenusList();
            }
        }
    },
    
    // Delete custom menu item
    deleteCustomMenuItem: function(itemId) {
        if (confirm('Are you sure you want to delete this menu item?')) {
            const customItems = DashboardConfig.getCustomMenuItems();
            const filteredItems = customItems.filter(i => i.id !== itemId);
            DashboardConfig.saveCustomMenuItems(filteredItems);
            this.refresh();
            this.loadCustomMenusList();
        }
    },
    
    // Update user's menu access after role change
    updateUserMenuAccess: function() {
        this.refresh();
        
        // If current page is no longer accessible, redirect
        const currentUser = UserManager.currentUser;
        if (currentUser && this.currentPage && !this.canAccessPage(this.currentPage, currentUser)) {
            console.log('MenuManager: Redirecting due to permission change');
            this.loadInitialPage();
        }
    }
};

// Export for global access if needed
window.MenuManager = MenuManager;