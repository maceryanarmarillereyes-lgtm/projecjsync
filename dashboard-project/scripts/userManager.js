// Enhanced User Management System
const UserManager = {
    // User data - loaded from localStorage
    currentUser: null,
    
    // Status colors mapping
    statusColors: {
        'available': '#28a745',
        'busy': '#dc3545',
        'backoffice': '#fd7e14',
        'meeting': '#dc3545',
        'callonque': '#17a2b8'
    },
    
    // Status icons mapping
    statusIcons: {
        'available': '🟢',
        'busy': '🔴',
        'backoffice': '🟠',
        'meeting': '🔴',
        'callonque': '🔵'
    },
    
    // Initialize user management
    init: function() {
        this.setupEventListeners();
        this.loadUserFromStorage();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // User status change
        const statusSelect = document.getElementById('userStatusSelect');
        if (statusSelect) {
            statusSelect.addEventListener('change', (e) => {
                this.updateUserStatus(e.target.value);
            });
        }
    },
    
    // Authenticate user
    authenticate: function(email, password) {
        // Get users from DashboardConfig
        const users = DashboardConfig.getAllUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user && user.password === password && user.isActive !== false) {
            this.currentUser = user;
            this.saveUserToStorage();
            return { success: true, user: this.currentUser };
        }
        
        // Admin fallback
        if (email.toLowerCase() === 'admin@copeland.com' && password === 'admin123') {
            let adminUser = users.find(u => u.email === 'admin@copeland.com');
            
            if (!adminUser) {
                // Create admin user if not exists
                adminUser = {
                    id: 'admin_001',
                    firstName: 'Admin',
                    lastName: 'User',
                    fullName: 'Admin User',
                    email: 'admin@copeland.com',
                    password: 'admin123',
                    shift: 'Morning Shift',
                    position: 'Admin',
                    role: 'ADMIN',
                    permissions: [...DashboardConfig.userRoles.ADMIN.permissions],
                    status: 'available',
                    avatar: 'AU',
                    team: 'Morning Shift',
                    currentSchedule: null,
                    schedules: [],
                    registeredDate: new Date().toISOString(),
                    lastLogin: new Date().toISOString(),
                    isActive: true
                };
                
                users.push(adminUser);
                DashboardConfig.saveAllUsers(users);
            }
            
            this.currentUser = adminUser;
            this.saveUserToStorage();
            return { success: true, user: this.currentUser };
        }
        
        return { success: false, message: 'Invalid credentials' };
    },
    
    // Register new user
    register: function(userData) {
        return DashboardConfig.addUser(userData);
    },
    
    // Update UI with user info
    updateUserUI: function() {
        if (!this.currentUser) return;
        
        console.log('Updating UI for user:', this.currentUser);
        
        // Update user name
        const userNameElement = document.getElementById('userName');
        if (userNameElement) {
            userNameElement.textContent = this.currentUser.fullName || 'User';
            if (this.currentUser.role === 'ADMIN') {
                userNameElement.innerHTML += ' <span class="role-badge admin">ADMIN</span>';
            } else if (this.currentUser.role === 'TEAM_LEAD') {
                userNameElement.innerHTML += ' <span class="role-badge team-lead">TEAM LEAD</span>';
            }
        }
        
        // Update user role
        const userRoleElement = document.getElementById('userRole');
        if (userRoleElement) {
            userRoleElement.textContent = this.currentUser.position || 'Member';
        }
        
        // Update avatar
        const avatarElement = document.querySelector('.avatar-placeholder');
        if (avatarElement) {
            const initial = this.currentUser.avatar || 
                          (this.currentUser.firstName?.charAt(0) || '') + 
                          (this.currentUser.lastName?.charAt(0) || '');
            avatarElement.innerHTML = `<span>${initial}</span>`;
        }
        
        // Update status indicator
        this.updateStatusIndicator(this.currentUser.status || 'available');
        
        // Update status dropdown
        const statusSelect = document.getElementById('userStatusSelect');
        if (statusSelect) {
            statusSelect.value = this.currentUser.status || 'available';
        }
        
        // Update schedule icon if exists
        if (this.currentUser.currentSchedule) {
            this.updateScheduleIcon();
        }
    },
    
    // Update user status
    updateUserStatus: function(newStatus) {
        if (!this.currentUser) return;
        
        this.currentUser.status = newStatus;
        
        // Update in localStorage
        const users = DashboardConfig.getAllUsers();
        const userIndex = users.findIndex(u => u.id === this.currentUser.id);
        if (userIndex !== -1) {
            users[userIndex].status = newStatus;
            DashboardConfig.saveAllUsers(users);
        }
        
        this.updateStatusIndicator(newStatus);
        this.saveUserToStorage();
    },
    
    // Update schedule icon
    updateScheduleIcon: function() {
        const scheduleIconContainer = document.getElementById('userScheduleIcon');
        if (!scheduleIconContainer) return;
        
        if (this.currentUser.currentSchedule) {
            const scheduleType = DashboardConfig.getScheduleIcon(this.currentUser.currentSchedule);
            scheduleIconContainer.innerHTML = `
                <i class="${scheduleType.icon}" style="color: ${scheduleType.color};" 
                   title="${scheduleType.name}"></i>
            `;
            scheduleIconContainer.style.display = 'block';
        } else {
            scheduleIconContainer.style.display = 'none';
        }
    },
    
    // Update status indicator
    updateStatusIndicator: function(status) {
        const indicator = document.getElementById('userStatusIndicator');
        if (!indicator) return;
        
        // Remove all status classes
        indicator.className = 'status-indicator';
        
        // Add the appropriate status class
        indicator.classList.add(status);
    },
    
    // Get all users by team/shift
    getUsersByTeam: function(team) {
        const users = DashboardConfig.getAllUsers();
        return users.filter(user => user.shift === team && user.isActive !== false);
    },
    
    // Get users by role
    getUsersByRole: function(role) {
        return DashboardConfig.getUsersByRole(role);
    },
    
    // Get active users
    getActiveUsers: function() {
        return DashboardConfig.getActiveUsers();
    },
    
    // Get current team members (excluding current user)
    getTeamMembers: function() {
        if (!this.currentUser) return [];
        
        const allUsers = DashboardConfig.getAllUsers();
        return allUsers.filter(user => 
            user.shift === this.currentUser.shift && 
            user.id !== this.currentUser.id &&
            user.isActive !== false
        );
    },
    
    // Get all users
    getAllUsers: function() {
        return DashboardConfig.getAllUsers();
    },
    
    // Get user by email
    getUserByEmail: function(email) {
        const users = DashboardConfig.getAllUsers();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    },
    
    // Get user by ID
    getUserById: function(id) {
        const users = DashboardConfig.getAllUsers();
        return users.find(user => user.id === id);
    },
    
    // Update user information
    updateUser: function(userId, updates) {
        return DashboardConfig.updateUser(userId, updates);
    },
    
    // Delete user
    deleteUser: function(userId) {
        return DashboardConfig.deleteUser(userId);
    },
    
    // Assign schedule to user
    assignSchedule: function(userId, scheduleType) {
        const users = DashboardConfig.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].currentSchedule = scheduleType;
            
            // Add to schedule history
            if (!users[userIndex].schedules) {
                users[userIndex].schedules = [];
            }
            
            users[userIndex].schedules.push({
                type: scheduleType,
                assignedBy: this.currentUser?.id,
                assignedAt: new Date().toISOString(),
                active: true
            });
            
            DashboardConfig.saveAllUsers(users);
            
            // If updating current user, refresh UI
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser.currentSchedule = scheduleType;
                this.updateScheduleIcon();
            }
            
            return { success: true };
        }
        
        return { success: false, message: 'User not found' };
    },
    
    // Remove schedule from user
    removeSchedule: function(userId) {
        const users = DashboardConfig.getAllUsers();
        const userIndex = users.findIndex(u => u.id === userId);
        
        if (userIndex !== -1) {
            users[userIndex].currentSchedule = null;
            
            // Mark latest schedule as inactive
            if (users[userIndex].schedules && users[userIndex].schedules.length > 0) {
                users[userIndex].schedules[users[userIndex].schedules.length - 1].active = false;
            }
            
            DashboardConfig.saveAllUsers(users);
            
            // If updating current user, refresh UI
            if (this.currentUser && this.currentUser.id === userId) {
                this.currentUser.currentSchedule = null;
                this.updateScheduleIcon();
            }
            
            return { success: true };
        }
        
        return { success: false, message: 'User not found' };
    },
    
    // Check permission
    hasPermission: function(permission) {
        return DashboardConfig.hasPermission(this.currentUser, permission);
    },
    
    // Check if user is admin
    isAdmin: function() {
        return this.currentUser?.role === 'ADMIN';
    },
    
    // Check if user is team lead
    isTeamLead: function() {
        return this.currentUser?.role === 'TEAM_LEAD';
    },
    
    // Save user to localStorage
    saveUserToStorage: function() {
        if (this.currentUser) {
            localStorage.setItem('dashboard_current_user', JSON.stringify(this.currentUser));
        }
    },
    
    // Load user from localStorage
    loadUserFromStorage: function() {
        try {
            const savedUser = localStorage.getItem('dashboard_current_user');
            if (savedUser) {
                this.currentUser = JSON.parse(savedUser);
                this.updateUserUI();
            }
        } catch (e) {
            console.error('Error loading user from storage:', e);
        }
    },
    
    // Logout
    logout: function() {
        this.currentUser = null;
        localStorage.removeItem('dashboard_current_user');
        window.location.reload();
    },
    
    // Get status color
    getStatusColor: function(status) {
        return this.statusColors[status] || '#6c757d';
    },
    
    // Get status icon
    getStatusIcon: function(status) {
        return this.statusIcons[status] || '⚪';
    },
    
    // Get status text
    getStatusText: function(status) {
        const statusMap = {
            'available': 'Available',
            'busy': 'Busy',
            'backoffice': 'Back Office',
            'meeting': 'In Meeting',
            'callonque': 'Call Onque'
        };
        return statusMap[status] || 'Unknown';
    },
    
    // Get schedule abbreviation
    getScheduleAbbreviation: function(scheduleType) {
        const schedule = DashboardConfig.scheduleTypes[scheduleType];
        return schedule ? schedule.abbreviation : '';
    }
};