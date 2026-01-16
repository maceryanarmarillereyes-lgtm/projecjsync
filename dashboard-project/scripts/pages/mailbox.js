// Enhanced Mailbox Page with Dynamic Scheduling
const MailboxPage = {
    config: {
        id: 'mailbox',
        title: 'Mailbox'
    },
    
    data: {
        caseAssignments: {},
        currentCaseNumber: 0,
        nextCaseId: 1
    },
    
    render: function() {
        return `
            <div class="page-container active" id="mailbox-page">
                <!-- Custom Confirmation Dialog -->
                <div class="custom-dialog-overlay" id="confirmationDialog" style="display: none;">
                    <div class="custom-dialog">
                        <div class="custom-dialog-content">
                            <div class="custom-dialog-title">Confirm Reassignment</div>
                            <div class="custom-dialog-message" id="dialogMessage"></div>
                            <div class="custom-dialog-buttons">
                                <button class="custom-dialog-btn cancel-btn" id="dialogCancelBtn">Cancel</button>
                                <button class="custom-dialog-btn proceed-btn" id="dialogProceedBtn">Proceed</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Dynamic Duty Display -->
                <div class="duty-scheduler-section">
                    <div class="shift-scheduler">
                        <!-- Current Duty Section -->
                        <div class="shift-column current-duty-column">
                            <div id="currentDutySection">
                                <div class="duty-team-section current-duty">
                                    <div class="duty-team-header">
                                        <h3>Current Duty</h3>
                                        <div class="team-info">
                                            <span class="team-name" id="currentTeamName">Morning Shift</span>
                                            <span class="team-time" id="currentTeamTime">6:00 AM - 3:00 PM</span>
                                        </div>
                                    </div>
                                    <div class="team-members-grid" id="currentTeamMembers">
                                        <!-- Current team members will be loaded dynamically -->
                                    </div>
                                    <div class="team-stats">
                                        <div class="stat-item">
                                            <span class="stat-value" id="currentAvailableCount">0</span>
                                            <span class="stat-label">Available</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-value" id="currentBusyCount">0</span>
                                            <span class="stat-label">Busy/Block</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Case Created Section -->
                            <div class="case-created-section">
                                <div class="case-created-box">
                                    <div class="case-created-label">Cases Assigned Today</div>
                                    <div class="case-number" id="currentCaseNumber">0</div>
                                </div>
                            </div>
                            
                            <!-- Action Buttons -->
                            ${UserManager.hasPermission('assign_schedules') || UserManager.isAdmin() || UserManager.isTeamLead() ? `
                                <div class="mailbox-action-buttons">
                                    <button class="mailbox-action-btn mailbox-add-btn" id="mailboxAddBtn">Add Case</button>
                                    <button class="mailbox-action-btn mailbox-remove-btn" id="mailboxRemoveBtn">Remove Case</button>
                                </div>
                            ` : ''}
                        </div>
                        
                        <!-- Middle Column with Timer -->
                        <div class="middle-column">
                            <div class="vertical-divider"></div>
                            <div class="timer-middle">
                                <div class="timer-label">Next Shift Change In</div>
                                <div class="timer-display" id="dutyTimer">00:00:00</div>
                                <div class="current-time" id="currentTime"></div>
                            </div>
                            <div class="vertical-divider"></div>
                        </div>
                        
                        <!-- Next Duty Section -->
                        <div class="shift-column next-duty-column">
                            <div id="nextDutySection">
                                <div class="duty-team-section next-duty">
                                    <div class="duty-team-header">
                                        <h3>Next Duty</h3>
                                        <div class="team-info">
                                            <span class="team-name" id="nextTeamName">Mid Shift</span>
                                            <span class="team-time" id="nextTeamTime">1:00 PM - 10:00 PM</span>
                                        </div>
                                    </div>
                                    <div class="team-members-grid" id="nextTeamMembers">
                                        <!-- Next team members will be loaded dynamically -->
                                    </div>
                                    <div class="team-stats">
                                        <div class="stat-item">
                                            <span class="stat-value" id="nextAvailableCount">0</span>
                                            <span class="stat-label">Available</span>
                                        </div>
                                        <div class="stat-item">
                                            <span class="stat-value" id="nextBusyCount">0</span>
                                            <span class="stat-label">Busy/Block</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Team Sections -->
                <div class="team-sections-container">
                    <!-- Morning Shift Team -->
                    <div class="shift-section">
                        <div class="shift-header">
                            <h2 class="shift-title">
                                <i class="fas fa-sun"></i> Morning Shift Team
                                <span class="shift-time">6:00 AM - 3:00 PM</span>
                            </h2>
                            <div class="schedule-controls">
                                ${UserManager.hasPermission('assign_schedules') || UserManager.isAdmin() || UserManager.isTeamLead() ? `
                                    <button class="schedule-bulk-btn" data-team="Morning Shift">
                                        <i class="fas fa-users-cog"></i> Bulk Assign
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="shift-grid-container">
                            <div class="team-grid" id="morningShiftGrid">
                                <!-- Morning shift team members will be loaded dynamically -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Mid Shift Team -->
                    <div class="shift-section">
                        <div class="shift-header">
                            <h2 class="shift-title">
                                <i class="fas fa-clock"></i> Mid Shift Team
                                <span class="shift-time">1:00 PM - 10:00 PM</span>
                            </h2>
                            <div class="schedule-controls">
                                ${UserManager.hasPermission('assign_schedules') || UserManager.isAdmin() || UserManager.isTeamLead() ? `
                                    <button class="schedule-bulk-btn" data-team="Mid Shift">
                                        <i class="fas fa-users-cog"></i> Bulk Assign
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="shift-grid-container">
                            <div class="team-grid" id="midShiftGrid">
                                <!-- Mid shift team members will be loaded dynamically -->
                            </div>
                        </div>
                    </div>
                    
                    <!-- Night Shift Team -->
                    <div class="shift-section">
                        <div class="shift-header">
                            <h2 class="shift-title">
                                <i class="fas fa-moon"></i> Night Shift Team
                                <span class="shift-time">10:00 PM - 6:00 AM</span>
                            </h2>
                            <div class="schedule-controls">
                                ${UserManager.hasPermission('assign_schedules') || UserManager.isAdmin() || UserManager.isTeamLead() ? `
                                    <button class="schedule-bulk-btn" data-team="Night Shift">
                                        <i class="fas fa-users-cog"></i> Bulk Assign
                                    </button>
                                ` : ''}
                            </div>
                        </div>
                        <div class="shift-grid-container">
                            <div class="team-grid" id="nightShiftGrid">
                                <!-- Night shift team members will be loaded dynamically -->
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Case Assignment System -->
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Case Assignment System</h2>
                    
                    <!-- Mailbox Controls -->
                    <div class="mailbox-controls">
                        <div class="error-message" id="mailboxErrorMessage"></div>
                        
                        <!-- Case Assignment Form -->
                        <div class="case-assignment-form" id="caseAssignmentForm">
                            <div class="case-input-group">
                                <label for="inputCase" class="input-label">Input Case #</label>
                                <input type="text" id="inputCase" class="case-input" placeholder="Enter case number (1-15)">
                            </div>
                            
                            <div class="assigned-to-group">
                                <label for="assignedTo" class="input-label">Assigned to</label>
                                <select id="assignedTo" class="case-dropdown">
                                    <option value="">Select a Tech</option>
                                    ${this.getAllTechNames().map(name => `
                                        <option value="${name}">${name}</option>
                                    `).join('')}
                                </select>
                            </div>
                            
                            <div class="apply-buttons">
                                <button class="apply-btn" id="applyBtn">Apply</button>
                                <button type="button" class="apply-btn cancel-btn-form" id="cancelBtn">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- TECH ASSIGNED RECORD LIST -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">TECH ASSIGNED RECORD LIST</h2>
                    <div class="table-container">
                        <table class="tech-record-table" id="techRecordTable">
                            <thead id="techRecordTableHeader">
                                <tr>
                                    <th>Case #</th>
                                    ${this.getAllTechNames().map(name => `
                                        <th>${name}</th>
                                    `).join('')}
                                </tr>
                            </thead>
                            <tbody id="techRecordTableBody">
                                <!-- Rows will be generated by JavaScript -->
                            </tbody>
                        </table>
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
                    <div class="current-time-display" id="currentTimeDisplay">
                        Manila Time: <span id="manilaTime"></span>
                    </div>
                </div>
            </div>
        `;
    },
    
    init: function() {
        this.loadTeamMembers();
        this.initializeTechRecordTable();
        this.setupEventListeners();
        this.setupCustomDialog();
        this.initializeManilaTime();
        this.updateDutyDisplay();
        this.startDutyTimer();
    },
    
    loadTeamMembers: function() {
        // Load morning shift with schedule controls
        const morningUsers = UserManager.getUsersByTeam('Morning Shift');
        this.renderTeamGrid('morningShiftGrid', morningUsers, true);
        
        // Load mid shift with schedule controls
        const midUsers = UserManager.getUsersByTeam('Mid Shift');
        this.renderTeamGrid('midShiftGrid', midUsers, true);
        
        // Load night shift with schedule controls
        const nightUsers = UserManager.getUsersByTeam('Night Shift');
        this.renderTeamGrid('nightShiftGrid', nightUsers, true);
        
        // Update duty sections
        this.updateDutySections();
    },
    
    renderTeamGrid: function(gridId, users, showScheduleControls = false) {
        const grid = document.getElementById(gridId);
        if (!grid) return;
        
        if (users.length === 0) {
            grid.innerHTML = '<div class="no-team-members">No team members in this shift</div>';
            return;
        }
        
        grid.innerHTML = users.map(user => `
            <div class="team-member-card">
                <div class="member-header">
                    <div class="member-avatar">
                        ${user.avatar || user.fullName?.charAt(0) || 'U'}
                        <div class="member-status-indicator ${user.status || 'available'}"></div>
                        ${user.currentSchedule ? `
                            <div class="member-schedule-indicator" style="background-color: ${DashboardConfig.getScheduleIcon(user.currentSchedule)?.color || '#0078d4'}">
                                <i class="${DashboardConfig.getScheduleIcon(user.currentSchedule)?.icon || 'fas fa-calendar'}"></i>
                            </div>
                        ` : ''}
                    </div>
                    <div class="member-info">
                        <div class="member-name">${user.fullName || 'Unknown User'}</div>
                        <div class="member-role">
                            <span class="role-badge ${(user.role || 'member').toLowerCase()}">${user.position || 'Member'}</span>
                        </div>
                    </div>
                </div>
                <div class="member-status">
                    <span class="status-icon">${UserManager.getStatusIcon(user.status || 'available')}</span>
                    <span class="status-text">${UserManager.getStatusText(user.status || 'available')}</span>
                </div>
                
                ${showScheduleControls && (UserManager.hasPermission('assign_schedules') || UserManager.isAdmin() || UserManager.isTeamLead()) ? `
                    <div class="member-schedule-controls">
                        ${user.currentSchedule ? `
                            <button class="schedule-btn remove remove-schedule-btn" data-user-id="${user.id}" title="Remove Schedule">
                                <i class="fas fa-times"></i> Remove
                            </button>
                        ` : `
                            <button class="schedule-btn assign assign-schedule-btn" data-user-id="${user.id}" title="Assign Schedule">
                                <i class="fas fa-calendar-plus"></i> Assign
                            </button>
                        `}
                    </div>
                ` : ''}
            </div>
        `).join('');
    },
    
    updateDutySections: function() {
        const currentDuty = DashboardConfig.getCurrentDutyTeam();
        const nextDuty = DashboardConfig.getNextDutyTeam();
        
        // Update team names and times
        document.getElementById('currentTeamName').textContent = currentDuty.name;
        document.getElementById('currentTeamTime').textContent = currentDuty.schedule;
        document.getElementById('nextTeamName').textContent = nextDuty.name;
        document.getElementById('nextTeamTime').textContent = nextDuty.schedule;
        
        // Load current duty team members
        const currentUsers = UserManager.getUsersByTeam(currentDuty.name);
        const currentAvailable = currentUsers.filter(u => u.status === 'available').length;
        const currentBusy = currentUsers.length - currentAvailable;
        
        document.getElementById('currentAvailableCount').textContent = currentAvailable;
        document.getElementById('currentBusyCount').textContent = currentBusy;
        
        // Load next duty team members
        const nextUsers = UserManager.getUsersByTeam(nextDuty.name);
        const nextAvailable = nextUsers.filter(u => u.status === 'available').length;
        const nextBusy = nextUsers.length - nextAvailable;
        
        document.getElementById('nextAvailableCount').textContent = nextAvailable;
        document.getElementById('nextBusyCount').textContent = nextBusy;
        
        // Render team members in duty sections
        this.renderDutyTeamMembers('currentTeamMembers', currentUsers);
        this.renderDutyTeamMembers('nextTeamMembers', nextUsers);
    },
    
    renderDutyTeamMembers: function(elementId, users) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        element.innerHTML = users.map(user => `
            <div class="duty-member">
                <div class="member-header">
                    <div class="member-avatar">
                        ${user.avatar || user.fullName?.charAt(0) || 'U'}
                    </div>
                    <div class="member-info">
                        <div class="member-name">${user.fullName || 'Unknown User'}</div>
                        <div class="member-status">
                            <span class="status-dot ${user.status || 'available'}"></span>
                            ${UserManager.getStatusText(user.status || 'available')}
                        </div>
                    </div>
                </div>
                <div class="member-schedule">
                    ${user.currentSchedule ? `
                        <span class="schedule-badge" style="background-color: ${DashboardConfig.getScheduleIcon(user.currentSchedule)?.color || '#0078d4'}">
                            ${DashboardConfig.getScheduleIcon(user.currentSchedule)?.abbreviation || 'SC'}
                        </span>
                    ` : '<span class="no-schedule">No Schedule</span>'}
                </div>
            </div>
        `).join('');
    },
    
    // Get all tech names for dropdown
    getAllTechNames: function() {
        const allUsers = UserManager.getAllUsers();
        return allUsers.filter(u => u.isActive !== false).map(user => user.fullName || `${user.firstName} ${user.lastName}`).filter(name => name.trim());
    },
    
    // Setup custom dialog
    setupCustomDialog: function() {
        const dialog = document.getElementById('confirmationDialog');
        const cancelBtn = document.getElementById('dialogCancelBtn');
        const proceedBtn = document.getElementById('dialogProceedBtn');
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                dialog.style.display = 'none';
                this.pendingAssignment = null;
            });
        }
        
        if (proceedBtn) {
            proceedBtn.addEventListener('click', () => {
                dialog.style.display = 'none';
                if (this.pendingAssignment) {
                    const { caseNumber, techName, isNewCase } = this.pendingAssignment;
                    this.clearCaseFromTable(caseNumber);
                    this.data.caseAssignments[caseNumber] = techName;
                    this.updateTechRecordTable(caseNumber, techName);
                    
                    if (isNewCase) {
                        this.incrementCaseNumber();
                    }
                    
                    this.showSuccessMessage(`Case #${caseNumber} has been assigned to ${techName}.`);
                    this.clearForm();
                    document.getElementById('caseAssignmentForm').classList.remove('show');
                    this.pendingAssignment = null;
                }
            });
        }
    },
    
    // Initialize tech record table
    initializeTechRecordTable: function() {
        const tableBody = document.getElementById('techRecordTableBody');
        if (!tableBody) return;
        
        tableBody.innerHTML = '';
        
        for (let i = 1; i <= 15; i++) {
            const row = document.createElement('tr');
            
            const caseCell = document.createElement('td');
            caseCell.className = 'case-number-cell';
            caseCell.textContent = i;
            row.appendChild(caseCell);
            
            this.getAllTechNames().forEach(techName => {
                const techCell = document.createElement('td');
                techCell.className = 'tech-cell empty';
                techCell.dataset.tech = techName;
                techCell.dataset.case = i;
                
                techCell.addEventListener('click', () => {
                    this.removeCaseAssignment(i, techName);
                });
                
                row.appendChild(techCell);
            });
            
            tableBody.appendChild(row);
        }
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        const mailboxAddBtn = document.getElementById('mailboxAddBtn');
        if (mailboxAddBtn) {
            mailboxAddBtn.addEventListener('click', () => {
                const form = document.getElementById('caseAssignmentForm');
                form.classList.toggle('show');
                document.getElementById('inputCase').focus();
            });
        }
        
        const mailboxRemoveBtn = document.getElementById('mailboxRemoveBtn');
        if (mailboxRemoveBtn) {
            mailboxRemoveBtn.addEventListener('click', async () => {
                const caseInput = document.getElementById('inputCase');
                const errorMessage = document.getElementById('mailboxErrorMessage');
                
                document.getElementById('caseAssignmentForm').classList.add('show');
                
                if (caseInput) {
                    caseInput.focus();
                    caseInput.value = '';
                    errorMessage.textContent = 'Enter case number to remove and click Apply';
                    errorMessage.classList.add('show');
                }
            });
        }
        
        const applyBtn = document.getElementById('applyBtn');
        if (applyBtn) {
            applyBtn.addEventListener('click', async () => {
                await this.assignCase();
            });
        }
        
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                document.getElementById('caseAssignmentForm').classList.remove('show');
                this.clearForm();
            });
        }
        
        const inputCase = document.getElementById('inputCase');
        const assignedTo = document.getElementById('assignedTo');
        
        if (inputCase) {
            inputCase.addEventListener('input', () => {
                const errorMessage = document.getElementById('mailboxErrorMessage');
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            });
        }
        
        if (assignedTo) {
            assignedTo.addEventListener('change', () => {
                const errorMessage = document.getElementById('mailboxErrorMessage');
                errorMessage.classList.remove('show');
                errorMessage.textContent = '';
            });
        }
        
        if (inputCase) {
            inputCase.addEventListener('keypress', async (e) => {
                if (e.key === 'Enter') {
                    await this.assignCase();
                }
            });
        }
        
        // Schedule button event delegation
        document.addEventListener('click', (e) => {
            if (e.target.closest('.assign-schedule-btn')) {
                const userId = e.target.closest('.assign-schedule-btn').dataset.userId;
                ScheduleManager.showScheduleModal(userId);
            }
            
            if (e.target.closest('.remove-schedule-btn')) {
                const userId = e.target.closest('.remove-schedule-btn').dataset.userId;
                ScheduleManager.removeScheduleFromUser(userId);
            }
            
            if (e.target.closest('.schedule-bulk-btn')) {
                const team = e.target.closest('.schedule-bulk-btn').dataset.team;
                ScheduleManager.showBulkScheduleModal(team);
            }
        });
    },
    
    // Assign a case to a tech
    assignCase: async function() {
        const caseInput = document.getElementById('inputCase');
        const assignedTo = document.getElementById('assignedTo');
        const errorMessage = document.getElementById('mailboxErrorMessage');
        
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';
        
        if (!caseInput.value.trim()) {
            errorMessage.textContent = 'Please enter a case number.';
            errorMessage.classList.add('show');
            caseInput.focus();
            return;
        }
        
        if (!assignedTo.value) {
            errorMessage.textContent = 'Please select a tech to assign the case to.';
            errorMessage.classList.add('show');
            assignedTo.focus();
            return;
        }
        
        const caseNumber = parseInt(caseInput.value.trim());
        
        if (isNaN(caseNumber) || caseNumber < 1 || caseNumber > 15) {
            errorMessage.textContent = 'Case number must be between 1 and 15.';
            errorMessage.classList.add('show');
            caseInput.focus();
            return;
        }
        
        const techName = assignedTo.value;
        const isCaseAlreadyAssigned = this.data.caseAssignments[caseNumber];
        const isNewCase = !isCaseAlreadyAssigned;
        
        if (isCaseAlreadyAssigned && this.data.caseAssignments[caseNumber] !== techName) {
            const currentTech = this.data.caseAssignments[caseNumber];
            const message = `Case#${caseNumber} is already assigned to ${currentTech}. Reassign to ${techName}?`;
            
            const dialog = document.getElementById('confirmationDialog');
            const messageElement = document.getElementById('dialogMessage');
            if (dialog && messageElement) {
                messageElement.textContent = message;
                dialog.style.display = 'flex';
                this.pendingAssignment = { caseNumber, techName, isNewCase };
                return;
            }
        }
        
        if (isCaseAlreadyAssigned && this.data.caseAssignments[caseNumber] === techName) {
            this.showSuccessMessage(`Case #${caseNumber} is already assigned to ${techName}.`);
            this.clearForm();
            document.getElementById('caseAssignmentForm').classList.remove('show');
            return;
        }
        
        this.clearCaseFromTable(caseNumber);
        this.data.caseAssignments[caseNumber] = techName;
        this.updateTechRecordTable(caseNumber, techName);
        
        if (isNewCase) {
            this.incrementCaseNumber();
        }
        
        this.showSuccessMessage(`Case #${caseNumber} assigned to ${techName}.`);
        this.clearForm();
        document.getElementById('caseAssignmentForm').classList.remove('show');
    },
    
    // Update tech record table
    updateTechRecordTable: function(caseNumber, techName) {
        this.clearCaseFromTable(caseNumber);
        
        const tableCell = document.querySelector(`.tech-cell[data-tech="${techName}"][data-case="${caseNumber}"]`);
        if (tableCell) {
            tableCell.classList.remove('empty');
            tableCell.classList.add('filled');
            tableCell.textContent = '✓';
        }
    },
    
    // Clear a case from the table
    clearCaseFromTable: function(caseNumber) {
        const cells = document.querySelectorAll(`.tech-cell[data-case="${caseNumber}"]`);
        cells.forEach(cell => {
            cell.classList.remove('filled');
            cell.classList.add('empty');
            cell.textContent = '';
        });
        
        delete this.data.caseAssignments[caseNumber];
    },
    
    // Remove a case assignment
    removeCaseAssignment: function(caseNumber, techName = null) {
        const caseNum = parseInt(caseNumber);
        
        if (isNaN(caseNum) || caseNum < 1 || caseNum > 15) {
            alert('Please enter a valid case number between 1 and 15.');
            return;
        }
        
        if (!this.data.caseAssignments[caseNum]) {
            alert(`Case #${caseNum} is not assigned to any tech.`);
            return;
        }
        
        if (techName) {
            if (this.data.caseAssignments[caseNum] === techName) {
                if (confirm(`Remove assignment of Case #${caseNum} from ${techName}?`)) {
                    this.clearCaseFromTable(caseNum);
                    this.showSuccessMessage(`Case #${caseNum} has been removed from ${techName}.`);
                }
            } else {
                alert(`Case #${caseNum} is not assigned to ${techName}.`);
            }
        } else {
            const assignedTech = this.data.caseAssignments[caseNum];
            if (confirm(`Case #${caseNum} is assigned to ${assignedTech}. Remove this assignment?`)) {
                this.clearCaseFromTable(caseNum);
                this.showSuccessMessage(`Case #${caseNum} has been removed from ${assignedTech}.`);
            }
        }
        
        this.clearForm();
        document.getElementById('caseAssignmentForm').classList.remove('show');
    },
    
    // Clear form
    clearForm: function() {
        document.getElementById('inputCase').value = '';
        document.getElementById('assignedTo').value = '';
        const errorMessage = document.getElementById('mailboxErrorMessage');
        errorMessage.classList.remove('show');
        errorMessage.textContent = '';
    },
    
    // Show success message
    showSuccessMessage: function(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'error-message';
        successDiv.style.backgroundColor = '#d4edda';
        successDiv.style.borderLeftColor = '#28a745';
        successDiv.style.color = '#155724';
        successDiv.textContent = message;
        
        const form = document.getElementById('caseAssignmentForm');
        if (form && form.parentNode) {
            form.parentNode.insertBefore(successDiv, form);
            successDiv.classList.add('show');
            
            setTimeout(() => {
                successDiv.classList.remove('show');
                setTimeout(() => {
                    if (successDiv.parentNode) {
                        successDiv.parentNode.removeChild(successDiv);
                    }
                }, 500);
            }, 3000);
        }
    },
    
    // Increment case number
    incrementCaseNumber: function() {
        this.data.currentCaseNumber++;
        if (this.data.currentCaseNumber > 999) {
            this.data.currentCaseNumber = 0;
        }
        const caseNumberElement = document.getElementById('currentCaseNumber');
        if (caseNumberElement) {
            caseNumberElement.textContent = this.data.currentCaseNumber;
        }
    },
    
    // Initialize Manila time
    initializeManilaTime: function() {
        function updateManilaTime() {
            const manilaTime = DashboardConfig.getManilaTime();
            const timeElement = document.getElementById('manilaTime');
            if (timeElement) {
                timeElement.textContent = manilaTime.toLocaleTimeString('en-US', {
                    timeZone: 'Asia/Manila',
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit'
                });
            }
            
            const currentTimeElement = document.getElementById('currentTime');
            if (currentTimeElement) {
                currentTimeElement.textContent = manilaTime.toLocaleTimeString('en-US', {
                    timeZone: 'Asia/Manila',
                    hour12: true,
                    hour: '2-digit',
                    minute: '2-digit'
                });
            }
        }
        
        updateManilaTime();
        setInterval(updateManilaTime, 1000);
    },
    
    // Update duty display
    updateDutyDisplay: function() {
        this.updateDutySections();
        this.updateTimer();
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
                MailboxPage.updateDutyDisplay();
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
        }, 60000);
    }
};

// Register the mailbox page
PageManager.registerPage('mailbox', MailboxPage);