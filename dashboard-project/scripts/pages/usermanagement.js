// User Management Page
const UserManagementPage = {
    config: {
        id: 'usermanagement',
        title: 'User Management'
    },
    
    render: function() {
        const users = DashboardConfig.getAllUsers().filter(u => u.isActive !== false);
        const currentUser = UserManager.currentUser;
        
        return `
            <div class="page-container active" id="usermanagement-page">
                <div class="scheduling-section">
                    <div class="user-management-header">
                        <h2 class="scheduling-title">User Management System</h2>
                        ${UserManager.isAdmin() || UserManager.isTeamLead() ? `
                            <button class="add-user-btn" id="addUserBtn">
                                <i class="fas fa-user-plus"></i> Add New User
                            </button>
                        ` : ''}
                    </div>
                    <p>Manage user accounts, roles, and permissions.</p>
                </div>
                
                <!-- User Stats -->
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.length}</div>
                            <div class="stat-label">Total Users</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-user-shield"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.filter(u => u.role === 'ADMIN').length}</div>
                            <div class="stat-label">Admins</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-user-tie"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.filter(u => u.role === 'TEAM_LEAD').length}</div>
                            <div class="stat-label">Team Leads</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-user"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.filter(u => u.role === 'MEMBER').length}</div>
                            <div class="stat-label">Members</div>
                        </div>
                    </div>
                </div>
                
                <!-- Users Table -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">All Users</h2>
                    
                    <div class="table-container">
                        <table class="user-management-table">
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Shift</th>
                                    <th>Status</th>
                                    <th>Schedule</th>
                                    <th>Last Login</th>
                                    ${UserManager.isAdmin() || UserManager.isTeamLead() ? '<th>Actions</th>' : ''}
                                </tr>
                            </thead>
                            <tbody>
                                ${users.map(user => `
                                    <tr>
                                        <td>
                                            <div class="user-info-cell">
                                                <div class="user-avatar-small">${user.avatar}</div>
                                                <div class="user-details">
                                                    <div class="user-name">${user.fullName}</div>
                                                    <div class="user-position">${user.position}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>${user.email}</td>
                                        <td>
                                            <span class="role-badge ${user.role.toLowerCase()}">
                                                ${user.role}
                                            </span>
                                        </td>
                                        <td>${user.shift}</td>
                                        <td>
                                            <div class="user-status">
                                                <span class="status-dot ${user.status}"></span>
                                                ${UserManager.getStatusText(user.status)}
                                            </div>
                                        </td>
                                        <td>
                                            ${user.currentSchedule ? `
                                                <div class="user-schedule">
                                                    <i class="${DashboardConfig.getScheduleIcon(user.currentSchedule).icon}" 
                                                       style="color: ${DashboardConfig.getScheduleIcon(user.currentSchedule).color}"></i>
                                                    <span>${DashboardConfig.getScheduleIcon(user.currentSchedule).abbreviation}</span>
                                                </div>
                                            ` : 'No Schedule'}
                                        </td>
                                        <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Never'}</td>
                                        ${UserManager.isAdmin() || UserManager.isTeamLead() ? `
                                            <td>
                                                <div class="user-actions">
                                                    ${(UserManager.isAdmin() || (UserManager.isTeamLead() && user.role !== 'ADMIN')) ? `
                                                        <button class="action-btn edit-btn" data-user-id="${user.id}" title="Edit User">
                                                            <i class="fas fa-edit"></i>
                                                        </button>
                                                    ` : ''}
                                                    
                                                    ${(UserManager.isAdmin() || (UserManager.isTeamLead() && user.role !== 'ADMIN')) ? `
                                                        <button class="action-btn schedule-btn assign-schedule-btn" data-user-id="${user.id}" title="Assign Schedule">
                                                            <i class="fas fa-calendar-alt"></i>
                                                        </button>
                                                    ` : ''}
                                                    
                                                    ${UserManager.isAdmin() ? `
                                                        <button class="action-btn delete-btn" data-user-id="${user.id}" title="Delete User">
                                                            <i class="fas fa-trash"></i>
                                                        </button>
                                                    ` : ''}
                                                </div>
                                            </td>
                                        ` : ''}
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Add/Edit User Modal -->
                <div class="modal-overlay" id="userModal" style="display: none;">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3 id="modalTitle">Add New User</h3>
                            <button class="modal-close" id="userModalClose">&times;</button>
                        </div>
                        <div class="modal-body">
                            <form id="userForm">
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="modalFirstName">First Name *</label>
                                        <input type="text" id="modalFirstName" class="form-input" required>
                                    </div>
                                    <div class="form-group">
                                        <label for="modalLastName">Last Name *</label>
                                        <input type="text" id="modalLastName" class="form-input" required>
                                    </div>
                                </div>
                                
                                <div class="form-group">
                                    <label for="modalEmail">Email Address *</label>
                                    <input type="email" id="modalEmail" class="form-input" required>
                                </div>
                                
                                <div class="form-group">
                                    <label for="modalPassword">Password *</label>
                                    <input type="password" id="modalPassword" class="form-input" required>
                                </div>
                                
                                <div class="form-row">
                                    <div class="form-group">
                                        <label for="modalShift">Shift *</label>
                                        <select id="modalShift" class="form-input" required>
                                            <option value="">Select Shift</option>
                                            <option value="Morning Shift">Morning Shift</option>
                                            <option value="Mid Shift">Mid Shift</option>
                                            <option value="Night Shift">Night Shift</option>
                                        </select>
                                    </div>
                                    
                                    <div class="form-group">
                                        <label for="modalPosition">Position *</label>
                                        <select id="modalPosition" class="form-input" required>
                                            <option value="">Select Position</option>
                                            ${UserManager.isAdmin() ? '<option value="Admin">Admin</option>' : ''}
                                            <option value="Team Lead">Team Lead</option>
                                            <option value="Member">Member</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <div class="form-actions">
                                    <button type="button" class="cancel-btn" id="cancelUserBtn">Cancel</button>
                                    <button type="submit" class="submit-btn" id="submitUserBtn">Save User</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
                
                <!-- Date Section -->
                <div class="date-section">
                    <div class="current-date">${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        weekday: 'long'
                    })}</div>
                </div>
            </div>
        `;
    },
    
    init: function() {
        this.setupEventListeners();
        this.addPageStyles();
    },
    
    setupEventListeners: function() {
        // Add User Button
        document.getElementById('addUserBtn')?.addEventListener('click', () => {
            this.showUserModal();
        });
        
        // Edit User Buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.edit-btn')) {
                const userId = e.target.closest('.edit-btn').dataset.userId;
                this.editUser(userId);
            }
            
            if (e.target.closest('.delete-btn')) {
                const userId = e.target.closest('.delete-btn').dataset.userId;
                this.deleteUser(userId);
            }
        });
        
        // Modal Controls
        document.getElementById('userModalClose')?.addEventListener('click', () => {
            this.hideUserModal();
        });
        
        document.getElementById('cancelUserBtn')?.addEventListener('click', () => {
            this.hideUserModal();
        });
        
        // User Form Submission
        document.getElementById('userForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveUser();
        });
    },
    
    showUserModal: function(user = null) {
        const modal = document.getElementById('userModal');
        const title = document.getElementById('modalTitle');
        const form = document.getElementById('userForm');
        
        if (user) {
            // Edit mode
            title.textContent = 'Edit User';
            form.dataset.userId = user.id;
            
            document.getElementById('modalFirstName').value = user.firstName;
            document.getElementById('modalLastName').value = user.lastName;
            document.getElementById('modalEmail').value = user.email;
            document.getElementById('modalPassword').value = '';
            document.getElementById('modalPassword').required = false;
            document.getElementById('modalShift').value = user.shift;
            document.getElementById('modalPosition').value = user.position;
        } else {
            // Add mode
            title.textContent = 'Add New User';
            form.dataset.userId = '';
            form.reset();
            document.getElementById('modalPassword').required = true;
        }
        
        modal.style.display = 'flex';
    },
    
    hideUserModal: function() {
        const modal = document.getElementById('userModal');
        modal.style.display = 'none';
        document.getElementById('userForm').reset();
    },
    
    editUser: function(userId) {
        const user = UserManager.getUserById(userId);
        if (user) {
            this.showUserModal(user);
        }
    },
    
    deleteUser: function(userId) {
        if (confirm('Are you sure you want to delete this user?')) {
            const result = UserManager.deleteUser(userId);
            if (result.success) {
                ScheduleManager.showNotification('User deleted successfully', 'success');
                // Refresh the page
                MenuManager.switchPage('usermanagement');
            } else {
                ScheduleManager.showNotification(result.message, 'error');
            }
        }
    },
    
    saveUser: function() {
        const form = document.getElementById('userForm');
        const userId = form.dataset.userId;
        
        const userData = {
            firstName: document.getElementById('modalFirstName').value.trim(),
            lastName: document.getElementById('modalLastName').value.trim(),
            email: document.getElementById('modalEmail').value.trim(),
            password: document.getElementById('modalPassword').value.trim(),
            shift: document.getElementById('modalShift').value,
            position: document.getElementById('modalPosition').value
        };
        
        // Validate
        if (!userData.firstName || !userData.lastName || !userData.email || !userData.shift || !userData.position) {
            ScheduleManager.showNotification('Please fill in all required fields', 'error');
            return;
        }
        
        if (!userId && !userData.password) {
            ScheduleManager.showNotification('Password is required for new users', 'error');
            return;
        }
        
        let result;
        if (userId) {
            // Update existing user
            if (userData.password) {
                result = UserManager.updateUser(userId, userData);
            } else {
                // Don't update password if empty
                const { password, ...updateData } = userData;
                result = UserManager.updateUser(userId, updateData);
            }
        } else {
            // Add new user
            result = UserManager.register(userData);
        }
        
        if (result.success) {
            ScheduleManager.showNotification(`User ${userId ? 'updated' : 'added'} successfully`, 'success');
            this.hideUserModal();
            // Refresh the page
            MenuManager.switchPage('usermanagement');
        } else {
            ScheduleManager.showNotification(result.message, 'error');
        }
    },
    
    addPageStyles: function() {
        const styleId = 'usermanagement-page-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .user-management-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 20px;
            }
            
            .add-user-btn {
                background-color: #28a745;
                color: white;
                padding: 10px 20px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .add-user-btn:hover {
                background-color: #218838;
            }
            
            .user-management-table {
                width: 100%;
                border-collapse: collapse;
            }
            
            .user-management-table th {
                background-color: #0078d4;
                color: white;
                padding: 12px 15px;
                text-align: left;
                font-weight: 600;
            }
            
            .user-management-table td {
                padding: 12px 15px;
                border-bottom: 1px solid #eaeaea;
            }
            
            .user-info-cell {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .user-avatar-small {
                width: 40px;
                height: 40px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
            }
            
            .user-details {
                display: flex;
                flex-direction: column;
            }
            
            .user-name {
                font-weight: 600;
                color: #2c3e50;
            }
            
            .user-position {
                font-size: 0.8rem;
                color: #6c757d;
            }
            
            .user-status {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .status-dot {
                width: 10px;
                height: 10px;
                border-radius: 50%;
                display: inline-block;
            }
            
            .status-dot.available { background-color: #28a745; }
            .status-dot.busy { background-color: #dc3545; }
            .status-dot.backoffice { background-color: #fd7e14; }
            .status-dot.meeting { background-color: #dc3545; }
            .status-dot.callonque { background-color: #17a2b8; }
            
            .user-schedule {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .user-actions {
                display: flex;
                gap: 8px;
            }
            
            .action-btn {
                width: 32px;
                height: 32px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .action-btn.edit-btn {
                background-color: #17a2b8;
                color: white;
            }
            
            .action-btn.schedule-btn {
                background-color: #28a745;
                color: white;
            }
            
            .action-btn.delete-btn {
                background-color: #dc3545;
                color: white;
            }
            
            .action-btn:hover {
                opacity: 0.9;
            }
            
            .role-badge {
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .role-badge.admin {
                background-color: #dc3545;
                color: white;
            }
            
            .role-badge.team_lead, .role-badge.team-lead {
                background-color: #fd7e14;
                color: white;
            }
            
            .role-badge.member {
                background-color: #6c757d;
                color: white;
            }
            
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 2000;
            }
            
            .modal-content {
                background-color: white;
                border-radius: 8px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                overflow-y: auto;
            }
            
            .modal-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px;
                border-bottom: 1px solid #eaeaea;
            }
            
            .modal-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: #6c757d;
            }
            
            .modal-body {
                padding: 20px;
            }
            
            .form-row {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 15px;
            }
            
            .form-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
                margin-top: 20px;
            }
            
            .cancel-btn {
                padding: 10px 20px;
                background-color: #6c757d;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .submit-btn {
                padding: 10px 20px;
                background-color: #0078d4;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
            }
            
            .bulk-schedule-form {
                display: flex;
                flex-direction: column;
                gap: 20px;
            }
            
            .schedule-type-selector {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
                gap: 10px;
                margin-top: 10px;
            }
            
            .schedule-type-option {
                border: 2px solid #eaeaea;
                border-radius: 8px;
                padding: 10px;
                display: flex;
                align-items: center;
                gap: 10px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .schedule-type-option:hover {
                border-color: #0078d4;
            }
            
            .schedule-type-option.selected {
                border-color: #0078d4;
                background-color: #e3f2fd;
            }
            
            .schedule-icon-small {
                font-size: 1.2rem;
            }
            
            .bulk-users-list {
                max-height: 200px;
                overflow-y: auto;
                border: 1px solid #eaeaea;
                border-radius: 4px;
                padding: 10px;
            }
            
            .bulk-user-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 5px 0;
            }
            
            .user-avatar-xs {
                width: 25px;
                height: 25px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 0.7rem;
            }
            
            .current-schedule {
                font-size: 0.8rem;
                color: #6c757d;
                margin-left: 5px;
            }
        `;
        document.head.appendChild(style);
    }
};

// Register the user management page
PageManager.registerPage('usermanagement', UserManagementPage);