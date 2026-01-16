// Schedule Management System
const ScheduleManager = {
    // Initialize schedule manager
    init: function() {
        this.setupEventListeners();
        this.updateDutyDisplay();
        this.startDutyTimer();
        this.initializeScheduleModal();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Schedule assignment buttons
        document.addEventListener('click', (e) => {
            if (e.target.closest('.assign-schedule-btn')) {
                const userId = e.target.closest('.assign-schedule-btn').dataset.userId;
                this.showScheduleModal(userId);
            }
            
            if (e.target.closest('.remove-schedule-btn')) {
                const userId = e.target.closest('.remove-schedule-btn').dataset.userId;
                this.removeScheduleFromUser(userId);
            }
            
            if (e.target.closest('.schedule-bulk-btn')) {
                const team = e.target.closest('.schedule-bulk-btn').dataset.team;
                this.showBulkScheduleModal(team);
            }
        });
    },
    
    // Initialize schedule modal
    initializeScheduleModal: function() {
        // Create schedule modal HTML
        const modalHTML = `
            <div class="modal-overlay" id="scheduleModal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Assign Schedule</h3>
                        <button class="modal-close" id="scheduleModalClose">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="schedule-options" id="scheduleOptions">
                            ${Object.values(DashboardConfig.scheduleTypes).map(schedule => `
                                <div class="schedule-option" data-type="${schedule.id}">
                                    <div class="schedule-icon" style="color: ${schedule.color}">
                                        <i class="${schedule.icon}"></i>
                                    </div>
                                    <div class="schedule-info">
                                        <h4>${schedule.name}</h4>
                                        <p>${schedule.abbreviation}</p>
                                    </div>
                                    <button class="assign-btn" data-schedule-type="${schedule.id}">
                                        Assign
                                    </button>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="modal-overlay" id="bulkScheduleModal" style="display: none;">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Bulk Assign Schedule</h3>
                        <button class="modal-close" id="bulkScheduleModalClose">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="bulk-schedule-form">
                            <div class="form-group">
                                <label>Select Schedule Type:</label>
                                <div class="schedule-type-selector">
                                    ${Object.values(DashboardConfig.scheduleTypes).map(schedule => `
                                        <div class="schedule-type-option" data-type="${schedule.id}">
                                            <div class="schedule-icon-small" style="color: ${schedule.color}">
                                                <i class="${schedule.icon}"></i>
                                            </div>
                                            <span>${schedule.name}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <div class="form-group">
                                <label>Select Users:</label>
                                <div class="bulk-users-list" id="bulkUsersList"></div>
                            </div>
                            <div class="form-actions">
                                <button class="cancel-btn" id="cancelBulkBtn">Cancel</button>
                                <button class="submit-btn" id="applyBulkBtn">Apply to Selected</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Setup modal event listeners
        this.setupModalEventListeners();
    },
    
    setupModalEventListeners: function() {
        // Schedule modal
        document.getElementById('scheduleModalClose')?.addEventListener('click', () => {
            document.getElementById('scheduleModal').style.display = 'none';
        });
        
        // Bulk schedule modal
        document.getElementById('bulkScheduleModalClose')?.addEventListener('click', () => {
            document.getElementById('bulkScheduleModal').style.display = 'none';
        });
        
        document.getElementById('cancelBulkBtn')?.addEventListener('click', () => {
            document.getElementById('bulkScheduleModal').style.display = 'none';
        });
        
        // Schedule assignment buttons
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('assign-btn')) {
                const scheduleType = e.target.dataset.scheduleType;
                const userId = document.getElementById('scheduleModal').dataset.userId;
                this.assignScheduleToUser(userId, scheduleType);
                document.getElementById('scheduleModal').style.display = 'none';
            }
            
            if (e.target.closest('.schedule-type-option')) {
                const scheduleType = e.target.closest('.schedule-type-option').dataset.type;
                document.getElementById('bulkScheduleModal').dataset.scheduleType = scheduleType;
                
                // Highlight selected
                document.querySelectorAll('.schedule-type-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                e.target.closest('.schedule-type-option').classList.add('selected');
            }
        });
        
        // Apply bulk schedule
        document.getElementById('applyBulkBtn')?.addEventListener('click', () => {
            this.applyBulkSchedule();
        });
    },
    
    // Get current duty team
    getCurrentDutyTeam: function() {
        return DashboardConfig.getCurrentDutyTeam();
    },
    
    // Get next duty team
    getNextDutyTeam: function() {
        return DashboardConfig.getNextDutyTeam();
    },
    
    // Update duty display
    updateDutyDisplay: function() {
        const currentDuty = this.getCurrentDutyTeam();
        const nextDuty = this.getNextDutyTeam();
        
        // Update left section (current duty)
        const currentDutyElement = document.getElementById('currentDutySection');
        if (currentDutyElement) {
            currentDutyElement.innerHTML = this.createDutyTeamHTML(currentDuty, true);
        }
        
        // Update right section (next duty)
        const nextDutyElement = document.getElementById('nextDutySection');
        if (nextDutyElement) {
            nextDutyElement.innerHTML = this.createDutyTeamHTML(nextDuty, false);
        }
        
        // Update timer
        this.updateTimer();
    },
    
    // Create duty team HTML
    createDutyTeamHTML: function(team, isCurrent) {
        const users = UserManager.getUsersByTeam(team.name);
        const activeUsers = users.filter(u => u.status !== 'busy' && u.status !== 'block');
        
        return `
            <div class="duty-team-section ${isCurrent ? 'current-duty' : 'next-duty'}">
                <div class="duty-team-header">
                    <h3>${isCurrent ? 'Current Duty' : 'Next Duty'}</h3>
                    <div class="team-info">
                        <span class="team-name">${team.name}</span>
                        <span class="team-time">${team.mailboxDuty}</span>
                    </div>
                </div>
                
                <div class="team-members-grid">
                    ${users.map(user => `
                        <div class="team-member-card duty-member">
                            <div class="member-header">
                                <div class="member-avatar" style="background: ${team.color}">
                                    ${user.avatar}
                                    ${user.currentSchedule ? `
                                        <div class="schedule-icon" style="background-color: ${DashboardConfig.getScheduleIcon(user.currentSchedule).color}" 
                                             title="${DashboardConfig.getScheduleIcon(user.currentSchedule).name}">
                                            <i class="${DashboardConfig.getScheduleIcon(user.currentSchedule).icon}"></i>
                                        </div>
                                    ` : ''}
                                </div>
                                <div class="member-info">
                                    <div class="member-name">${user.fullName}</div>
                                    <div class="member-status">
                                        <span class="status-dot ${user.status}"></span>
                                        ${UserManager.getStatusText(user.status)}
                                    </div>
                                </div>
                            </div>
                            <div class="member-schedule">
                                ${user.currentSchedule ? `
                                    <span class="schedule-badge" style="background-color: ${DashboardConfig.getScheduleIcon(user.currentSchedule).color}">
                                        ${DashboardConfig.getScheduleIcon(user.currentSchedule).abbreviation}
                                    </span>
                                ` : '<span class="no-schedule">No Schedule</span>'}
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="team-stats">
                    <div class="stat-item">
                        <span class="stat-value">${activeUsers.length}</span>
                        <span class="stat-label">Available</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-value">${users.length - activeUsers.length}</span>
                        <span class="stat-label">Busy/Block</span>
                    </div>
                </div>
            </div>
        `;
    },
    
    // Update timer
    updateTimer: function() {
        const timerElement = document.getElementById('dutyTimer');
        if (!timerElement) return;
        
        const manilaTime = DashboardConfig.getManilaTime();
        const currentHour = manilaTime.getHours();
        let nextSwitchTime;
        
        if (currentHour >= 6 && currentHour < 15) {
            nextSwitchTime = new Date(manilaTime);
            nextSwitchTime.setHours(15, 0, 0, 0);
        } else if (currentHour >= 15 && currentHour < 22) {
            nextSwitchTime = new Date(manilaTime);
            nextSwitchTime.setHours(22, 0, 0, 0);
        } else {
            nextSwitchTime = new Date(manilaTime);
            if (currentHour < 6) {
                nextSwitchTime.setHours(6, 0, 0, 0);
            } else {
                nextSwitchTime.setDate(manilaTime.getDate() + 1);
                nextSwitchTime.setHours(6, 0, 0, 0);
            }
        }
        
        this.startCountdown(timerElement, nextSwitchTime);
    },
    
    // Start countdown timer
    startCountdown: function(timerElement, targetTime) {
        function update() {
            const now = DashboardConfig.getManilaTime();
            const diff = targetTime - now;
            
            if (diff <= 0) {
                timerElement.textContent = '00:00:00';
                ScheduleManager.updateDutyDisplay();
                return;
            }
            
            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);
            
            timerElement.textContent = 
                `${hours.toString().padStart(2, '0')}:` +
                `${minutes.toString().padStart(2, '0')}:` +
                `${seconds.toString().padStart(2, '0')}`;
        }
        
        update();
        setInterval(update, 1000);
    },
    
    // Start duty timer
    startDutyTimer: function() {
        setInterval(() => {
            this.updateDutyDisplay();
        }, 60000); // Update every minute
    },
    
    // Show schedule modal
    showScheduleModal: function(userId) {
        const modal = document.getElementById('scheduleModal');
        modal.dataset.userId = userId;
        modal.style.display = 'flex';
    },
    
    // Show bulk schedule modal
    showBulkScheduleModal: function(team) {
        const modal = document.getElementById('bulkScheduleModal');
        modal.dataset.team = team;
        
        // Load users for this team
        const users = UserManager.getUsersByTeam(team);
        const usersList = document.getElementById('bulkUsersList');
        usersList.innerHTML = users.map(user => `
            <div class="bulk-user-item">
                <input type="checkbox" id="user_${user.id}" value="${user.id}" checked>
                <label for="user_${user.id}">
                    <span class="user-avatar-xs">${user.avatar}</span>
                    ${user.fullName}
                    ${user.currentSchedule ? `
                        <span class="current-schedule">(${DashboardConfig.getScheduleIcon(user.currentSchedule).abbreviation})</span>
                    ` : ''}
                </label>
            </div>
        `).join('');
        
        modal.style.display = 'flex';
    },
    
    // Apply bulk schedule
    applyBulkSchedule: function() {
        const modal = document.getElementById('bulkScheduleModal');
        const scheduleType = modal.dataset.scheduleType;
        const team = modal.dataset.team;
        
        if (!scheduleType) {
            this.showNotification('Please select a schedule type', 'error');
            return;
        }
        
        const checkboxes = document.querySelectorAll('#bulkUsersList input[type="checkbox"]:checked');
        if (checkboxes.length === 0) {
            this.showNotification('Please select at least one user', 'error');
            return;
        }
        
        let successCount = 0;
        checkboxes.forEach(checkbox => {
            const userId = checkbox.value;
            const result = UserManager.assignSchedule(userId, scheduleType);
            if (result.success) successCount++;
        });
        
        this.showNotification(`Schedule assigned to ${successCount} users`, 'success');
        modal.style.display = 'none';
        
        // Refresh display
        this.updateDutyDisplay();
        
        // Refresh team grids if on mailbox page
        if (PageManager.getCurrentPage() === 'mailbox') {
            MailboxPage.loadTeamMembers();
        }
    },
    
    // Assign schedule to user
    assignScheduleToUser: function(userId, scheduleType) {
        if (!UserManager.hasPermission('assign_schedules') && 
            !UserManager.isAdmin() && 
            !UserManager.isTeamLead()) {
            this.showNotification('You do not have permission to assign schedules', 'error');
            return;
        }
        
        const result = UserManager.assignSchedule(userId, scheduleType);
        if (result.success) {
            this.showNotification(`Schedule assigned successfully`, 'success');
            this.updateDutyDisplay();
            
            // Refresh team grids if on mailbox page
            if (PageManager.getCurrentPage() === 'mailbox') {
                MailboxPage.loadTeamMembers();
            }
        } else {
            this.showNotification(result.message, 'error');
        }
    },
    
    // Remove schedule from user
    removeScheduleFromUser: function(userId) {
        if (!UserManager.hasPermission('assign_schedules') && 
            !UserManager.isAdmin() && 
            !UserManager.isTeamLead()) {
            this.showNotification('You do not have permission to remove schedules', 'error');
            return;
        }
        
        const result = UserManager.removeSchedule(userId);
        if (result.success) {
            this.showNotification(`Schedule removed successfully`, 'success');
            this.updateDutyDisplay();
            
            // Refresh team grids if on mailbox page
            if (PageManager.getCurrentPage() === 'mailbox') {
                MailboxPage.loadTeamMembers();
            }
        } else {
            this.showNotification(result.message, 'error');
        }
    },
    
    // Get schedule assignments for user
    getUserSchedules: function(userId) {
        const user = UserManager.getUserById(userId);
        return user ? user.schedules || [] : [];
    },
    
    // Show notification
    showNotification: function(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
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
    }
};