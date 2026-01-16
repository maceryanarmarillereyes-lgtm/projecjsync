// Dashboard Configuration - Enhanced with Roles and Permissions
const DashboardConfig = {
    // Default menu items
    defaultMenuItems: [
        { id: 'mailbox', title: 'MAILBOX', page: 'mailbox', default: true, removable: false },
        { id: 'schedule', title: 'SCHEDULE', page: 'schedule', default: true, removable: false },
        { id: 'service', title: 'SERVICE CASES', page: 'service', default: true, removable: false },
        { id: 'assignment', title: 'ASSIGNMENT', page: 'assignment', default: true, removable: false },
        { id: 'files', title: 'FILES - UPDATE', page: 'files', default: true, removable: false },
        { id: 'notes', title: 'MY NOTES', page: 'notes', default: true, removable: false },
        { id: 'support', title: 'SUPPORT TOOL', page: 'support', default: true, removable: false },
        { id: 'procedural', title: 'PROCEDURAL', page: 'procedural', default: true, removable: false },
        { id: 'skills', title: 'SKILL HUB', page: 'skills', default: true, removable: false },
        { id: 'partnumber', title: 'PART NUMBER', page: 'partnumber', default: true, removable: false },
        { id: 'members', title: 'MEMBERS', page: 'members', default: true, removable: false },
        { id: 'connectplus', title: 'SHAREPOINT', page: 'connectplus', default: true, removable: false },
        { id: 'connectsites', title: 'CONNECT+ SITES', page: 'connectsites', default: true, removable: false },
        { id: 'usermanagement', title: 'USER MANAGEMENT', page: 'usermanagement', default: true, removable: false }
    ],
    
    // User Roles and Permissions
    userRoles: {
        ADMIN: {
            level: 100,
            permissions: ['manage_users', 'manage_settings', 'assign_roles', 'view_all_data', 'edit_all_data', 'assign_schedules', 'delete_users']
        },
        TEAM_LEAD: {
            level: 50,
            permissions: ['manage_team_users', 'view_team_data', 'edit_team_data', 'assign_schedules']
        },
        MEMBER: {
            level: 10,
            permissions: ['view_own_data', 'edit_own_profile']
        }
    },
    
    // Schedule Types with Icons
    scheduleTypes: {
        MAILBOX_MANAGER: {
            id: 'mailbox_manager',
            name: 'Mailbox Manager',
            icon: 'fas fa-envelope',
            color: '#0078d4',
            abbreviation: 'MB'
        },
        BACK_OFFICE: {
            id: 'back_office',
            name: 'Back Office',
            icon: 'fas fa-desktop',
            color: '#28a745',
            abbreviation: 'BO'
        },
        CALL_AVAILABLE: {
            id: 'call_available',
            name: 'Call Available',
            icon: 'fas fa-phone',
            color: '#17a2b8',
            abbreviation: 'CA'
        },
        MAILBOX_WITH_CALL: {
            id: 'mailbox_with_call',
            name: 'Mailbox Manager with Call Available',
            icon: 'fas fa-envelope-open-text',
            color: '#6f42c1',
            abbreviation: 'MC'
        },
        BLOCK: {
            id: 'block',
            name: 'Block',
            icon: 'fas fa-ban',
            color: '#dc3545',
            abbreviation: 'BL'
        }
    },
    
    // Team Schedules
    teamSchedules: {
        MORNING: {
            id: 'morning',
            name: 'Morning Shift',
            schedule: '6:00 AM to 3:00 PM',
            mailboxDuty: '6:00 AM to 3:00 PM',
            startHour: 6,
            endHour: 15,
            color: '#ffc107'
        },
        MID: {
            id: 'mid',
            name: 'Mid Shift',
            schedule: '1:00 PM to 10:00 PM',
            mailboxDuty: '3:00 PM to 10:00 PM',
            startHour: 13,
            endHour: 22,
            color: '#fd7e14'
        },
        NIGHT: {
            id: 'night',
            name: 'Night Shift',
            schedule: '10:00 PM to 6:00 AM',
            mailboxDuty: '10:00 PM to 6:00 AM',
            startHour: 22,
            endHour: 6,
            color: '#6610f2'
        }
    },
    
    // Get all menu items (default + custom)
    getAllMenuItems: function() {
        const customItems = this.getCustomMenuItems();
        return [...this.defaultMenuItems, ...customItems];
    },
    
    // Get custom menu items from localStorage
    getCustomMenuItems: function() {
        const stored = localStorage.getItem('dashboard_menu_items');
        return stored ? JSON.parse(stored) : [];
    },
    
    // Save custom menu items to localStorage
    saveCustomMenuItems: function(items) {
        localStorage.setItem('dashboard_menu_items', JSON.stringify(items));
    },
    
    // Get all users from localStorage
    getAllUsers: function() {
        const stored = localStorage.getItem('dashboard_users');
        return stored ? JSON.parse(stored) : [];
    },
    
    // Save all users to localStorage
    saveAllUsers: function(users) {
        localStorage.setItem('dashboard_users', JSON.stringify(users));
    },
    
    // Add new user
    addUser: function(user) {
        const users = this.getAllUsers();
        
        // Check if email already exists
        if (users.some(u => u.email.toLowerCase() === user.email.toLowerCase())) {
            return { success: false, message: 'Email already registered' };
        }
        
        // Generate avatar initials
        const initials = (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
        
        // Determine role based on position
        let role = 'MEMBER';
        let permissions = [...this.userRoles.MEMBER.permissions];
        
        if (user.position === 'Team Lead') {
            role = 'TEAM_LEAD';
            permissions = [...this.userRoles.TEAM_LEAD.permissions];
        } else if (user.position === 'Admin') {
            role = 'ADMIN';
            permissions = [...this.userRoles.ADMIN.permissions];
        }
        
        const newUser = {
            id: 'user_' + Date.now(),
            firstName: user.firstName,
            lastName: user.lastName,
            fullName: `${user.firstName} ${user.lastName}`,
            email: user.email,
            password: user.password,
            shift: user.shift,
            position: user.position,
            role: role,
            permissions: permissions,
            status: 'available',
            avatar: initials,
            team: user.shift,
            currentSchedule: null,
            schedules: [],
            registeredDate: new Date().toISOString(),
            lastLogin: null,
            isActive: true
        };
        
        users.push(newUser);
        this.saveAllUsers(users);
        
        return { success: true, user: newUser };
    },
    
    // Update user
    updateUser: function(userId, updates) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            // Update user
            users[index] = { ...users[index], ...updates };
            
            // Update avatar initials if name changed
            if (updates.firstName || updates.lastName) {
                const firstName = updates.firstName || users[index].firstName;
                const lastName = updates.lastName || users[index].lastName;
                users[index].avatar = (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
                users[index].fullName = `${firstName} ${lastName}`;
            }
            
            // Update team if shift changed
            if (updates.shift) {
                users[index].team = updates.shift;
            }
            
            // Update role based on position
            if (updates.position) {
                if (updates.position === 'Admin') {
                    users[index].role = 'ADMIN';
                    users[index].permissions = [...this.userRoles.ADMIN.permissions];
                } else if (updates.position === 'Team Lead') {
                    users[index].role = 'TEAM_LEAD';
                    users[index].permissions = [...this.userRoles.TEAM_LEAD.permissions];
                } else {
                    users[index].role = 'MEMBER';
                    users[index].permissions = [...this.userRoles.MEMBER.permissions];
                }
            }
            
            this.saveAllUsers(users);
            return { success: true, user: users[index] };
        }
        
        return { success: false, message: 'User not found' };
    },
    
    // Delete user (soft delete)
    deleteUser: function(userId) {
        const users = this.getAllUsers();
        const index = users.findIndex(u => u.id === userId);
        
        if (index !== -1) {
            users[index].isActive = false;
            this.saveAllUsers(users);
            return { success: true };
        }
        
        return { success: false, message: 'User not found' };
    },
    
    // Get users by shift
    getUsersByShift: function(shift) {
        const users = this.getAllUsers();
        return users.filter(user => user.shift === shift && user.isActive !== false);
    },
    
    // Get active users
    getActiveUsers: function() {
        const users = this.getAllUsers();
        return users.filter(user => user.isActive !== false);
    },
    
    // Get users by role
    getUsersByRole: function(role) {
        const users = this.getAllUsers();
        return users.filter(user => user.role === role && user.isActive !== false);
    },
    
    // Authenticate user
    authenticate: function(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
        
        if (user && user.password === password && user.isActive !== false) {
            // Update last login
            user.lastLogin = new Date().toISOString();
            this.saveAllUsers(users);
            
            return { success: true, user: user };
        }
        
        return { success: false, message: 'Invalid credentials' };
    },
    
    // Check user permission
    hasPermission: function(user, permission) {
        if (!user || !user.permissions) return false;
        return user.permissions.includes(permission);
    },
    
    // Get schedule icon for user
    getScheduleIcon: function(scheduleType) {
        return this.scheduleTypes[scheduleType] || this.scheduleTypes.MAILBOX_MANAGER;
    },
    
    // Get current team on duty based on Manila time
    getCurrentDutyTeam: function() {
        const manilaTime = this.getManilaTime();
        const currentHour = manilaTime.getHours();
        
        if (currentHour >= 6 && currentHour < 15) {
            return this.teamSchedules.MORNING;
        } else if (currentHour >= 15 && currentHour < 22) {
            return this.teamSchedules.MID;
        } else {
            return this.teamSchedules.NIGHT;
        }
    },
    
    // Get next team on duty
    getNextDutyTeam: function() {
        const manilaTime = this.getManilaTime();
        const currentHour = manilaTime.getHours();
        
        if (currentHour >= 6 && currentHour < 15) {
            return this.teamSchedules.MID;
        } else if (currentHour >= 15 && currentHour < 22) {
            return this.teamSchedules.NIGHT;
        } else {
            return this.teamSchedules.MORNING;
        }
    },
    
    // Get Manila time (UTC+8)
    getManilaTime: function() {
        const now = new Date();
        const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
        return new Date(utc + (3600000 * 8)); // UTC+8
    }
};