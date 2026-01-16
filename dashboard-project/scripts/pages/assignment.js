// Assignment Page
const AssignmentPage = {
    config: {
        id: 'assignment',
        title: 'ASSIGNMENT'
    },
    
    render: function() {
        return `
            <div class="page-container active" id="assignment-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Task Assignments</h2>
                    <p>Assign and track tasks across the team.</p>
                </div>
                
                <!-- Assignment Content -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Current Assignments</h2>
                    <div class="table-container">
                        <table class="tech-record-table">
                            <thead>
                                <tr>
                                    <th>Task ID</th>
                                    <th>Task Description</th>
                                    <th>Assigned To</th>
                                    <th>Due Date</th>
                                    <th>Progress</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                                    {id: 'TASK-001', desc: 'Update Server Configuration', assigned: 'John Doe', due: '2024-01-20', progress: 80, status: 'In Progress'},
                                    {id: 'TASK-002', desc: 'Client Documentation', assigned: 'Jane Smith', due: '2024-01-18', progress: 100, status: 'Completed'},
                                    {id: 'TASK-003', desc: 'Network Maintenance', assigned: 'Bob Johnson', due: '2024-01-22', progress: 30, status: 'In Progress'},
                                    {id: 'TASK-004', desc: 'Software Update', assigned: 'Alice Brown', due: '2024-01-25', progress: 10, status: 'Not Started'},
                                    {id: 'TASK-005', desc: 'Training Session', assigned: 'Charlie Wilson', due: '2024-01-19', progress: 50, status: 'In Progress'},
                                ].map(item => `
                                    <tr>
                                        <td><strong>${item.id}</strong></td>
                                        <td>${item.desc}</td>
                                        <td>${item.assigned}</td>
                                        <td>${item.due}</td>
                                        <td>
                                            <div class="progress-container">
                                                <div class="progress-bar" style="width: ${item.progress}%"></div>
                                                <span class="progress-text">${item.progress}%</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span class="status-badge ${item.status.toLowerCase().replace(' ', '-')}">
                                                ${item.status}
                                            </span>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <!-- Date Section -->
                <div class="date-section">
                    <div class="current-date">${new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric'
                    })}</div>
                </div>
            </div>
        `;
    },
    
    init: function() {
        this.addPageStyles();
    },
    
    addPageStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .progress-container {
                width: 100%;
                height: 20px;
                background-color: #e9ecef;
                border-radius: 10px;
                position: relative;
                overflow: hidden;
            }
            
            .progress-bar {
                height: 100%;
                background: linear-gradient(90deg, #0078d4, #00a2ff);
                border-radius: 10px;
                transition: width 0.3s;
            }
            
            .progress-text {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 0.8rem;
                font-weight: 600;
                color: #2c3e50;
            }
        `;
        document.head.appendChild(style);
    }
};

PageManager.registerPage('assignment', AssignmentPage);