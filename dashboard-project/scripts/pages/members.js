// Members Page
const MembersPage = {
    // Page configuration
    config: {
        id: 'members',
        title: 'Members'
    },
    
    // Render the page
    render: function() {
        const users = DashboardConfig.getAllUsers();
        
        return `
            <div class="page-container active" id="members-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Team Members</h2>
                    <p>View and manage all registered team members.</p>
                </div>
                
                <!-- Stats -->
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.length}</div>
                            <div class="stat-label">Total Members</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-sun"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.filter(u => u.shift === 'Morning Shift').length}</div>
                            <div class="stat-label">Morning Shift</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-clock"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.filter(u => u.shift === 'Mid Shift').length}</div>
                            <div class="stat-label">Mid Shift</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-moon"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-value">${users.filter(u => u.shift === 'Night Shift').length}</div>
                            <div class="stat-label">Night Shift</div>
                        </div>
                    </div>
                </div>
                
                <!-- Members Table -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">All Team Members</h2>
                    
                    ${users.length > 0 ? `
                        <div class="table-container">
                            <table class="tech-record-table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Shift</th>
                                        <th>Position</th>
                                        <th>Status</th>
                                        <th>Registered</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${users.map(user => `
                                        <tr>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 10px;">
                                                    <div class="member-avatar-small">${user.avatar}</div>
                                                    ${user.fullName}
                                                </div>
                                            </td>
                                            <td>${user.email}</td>
                                            <td>${user.shift}</td>
                                            <td><span class="status-badge">${user.position}</span></td>
                                            <td>
                                                <div style="display: flex; align-items: center; gap: 5px;">
                                                    <span>${UserManager.getStatusIcon(user.status)}</span>
                                                    <span>${UserManager.getStatusText(user.status)}</span>
                                                </div>
                                            </td>
                                            <td>${new Date(user.registeredDate).toLocaleDateString()}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    ` : `
                        <div class="no-results" style="text-align: center; padding: 40px;">
                            <i class="fas fa-users" style="font-size: 3rem; color: #bdc3c7; margin-bottom: 15px;"></i>
                            <h3>No Members Found</h3>
                            <p>No team members have been registered yet.</p>
                            <button class="apply-btn" onclick="location.reload()">
                                <i class="fas fa-sync"></i> Refresh
                            </button>
                        </div>
                    `}
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
    
    // Initialize the page
    init: function() {
        console.log('MembersPage: Initializing...');
        this.addPageStyles();
    },
    
    // Add page-specific styles
    addPageStyles: function() {
        const styleId = 'members-page-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .quick-stats {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .stat-card {
                background-color: white;
                border-radius: 8px;
                padding: 15px;
                display: flex;
                align-items: center;
                gap: 15px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                border: 1px solid #eaeaea;
            }
            
            .stat-icon {
                width: 50px;
                height: 50px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.5rem;
            }
            
            .stat-value {
                font-size: 1.5rem;
                font-weight: 700;
                color: #2c3e50;
            }
            
            .stat-label {
                font-size: 0.9rem;
                color: #6c757d;
            }
            
            .member-avatar-small {
                width: 30px;
                height: 30px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 0.8rem;
            }
        `;
        document.head.appendChild(style);
    }
};

// Register the members page
PageManager.registerPage('members', MembersPage);
console.log('MembersPage: Registered successfully');