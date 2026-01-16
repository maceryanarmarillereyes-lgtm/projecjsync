// Service Cases Page
const ServicePage = {
    config: {
        id: 'service',
        title: 'SERVICE CASES'
    },
    
    render: function() {
        return `
            <div class="page-container active" id="service-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Service Cases Management</h2>
                    <p>Track and manage all service cases and support tickets.</p>
                </div>
                
                <!-- Service Cases Content -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Active Service Cases</h2>
                    <div class="table-container">
                        <table class="tech-record-table">
                            <thead>
                                <tr>
                                    <th>Case #</th>
                                    <th>Customer</th>
                                    <th>Issue Type</th>
                                    <th>Priority</th>
                                    <th>Status</th>
                                    <th>Assigned To</th>
                                    <th>Created Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                                    {case: 'SRV-001', customer: 'ABC Corp', issue: 'Network Issue', priority: 'High', status: 'In Progress', assigned: 'John Doe', date: '2024-01-15'},
                                    {case: 'SRV-002', customer: 'XYZ Ltd', issue: 'Software Bug', priority: 'Medium', status: 'Open', assigned: 'Jane Smith', date: '2024-01-14'},
                                    {case: 'SRV-003', customer: '123 Inc', issue: 'Hardware Failure', priority: 'Critical', status: 'Pending', assigned: 'Bob Johnson', date: '2024-01-13'},
                                    {case: 'SRV-004', customer: 'Tech Co', issue: 'Configuration', priority: 'Low', status: 'Resolved', assigned: 'Alice Brown', date: '2024-01-12'},
                                    {case: 'SRV-005', customer: 'Global Corp', issue: 'Performance', priority: 'Medium', status: 'In Progress', assigned: 'Charlie Wilson', date: '2024-01-11'},
                                ].map(item => `
                                    <tr>
                                        <td><strong>${item.case}</strong></td>
                                        <td>${item.customer}</td>
                                        <td>${item.issue}</td>
                                        <td>
                                            <span class="priority-badge ${item.priority.toLowerCase()}">
                                                ${item.priority}
                                            </span>
                                        </td>
                                        <td>
                                            <span class="status-badge ${item.status.toLowerCase().replace(' ', '-')}">
                                                ${item.status}
                                            </span>
                                        </td>
                                        <td>${item.assigned}</td>
                                        <td>${item.date}</td>
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
            .priority-badge {
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .priority-badge.critical {
                background-color: #dc3545;
                color: white;
            }
            
            .priority-badge.high {
                background-color: #fd7e14;
                color: white;
            }
            
            .priority-badge.medium {
                background-color: #ffc107;
                color: #212529;
            }
            
            .priority-badge.low {
                background-color: #28a745;
                color: white;
            }
            
            .status-badge {
                padding: 3px 10px;
                border-radius: 12px;
                font-size: 0.8rem;
                font-weight: 600;
            }
            
            .status-badge.in-progress {
                background-color: #17a2b8;
                color: white;
            }
            
            .status-badge.open {
                background-color: #007bff;
                color: white;
            }
            
            .status-badge.pending {
                background-color: #6c757d;
                color: white;
            }
            
            .status-badge.resolved {
                background-color: #28a745;
                color: white;
            }
        `;
        document.head.appendChild(style);
    }
};

PageManager.registerPage('service', ServicePage);