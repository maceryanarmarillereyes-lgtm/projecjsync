// Schedule Page
const SchedulePage = {
    config: {
        id: 'schedule',
        title: 'SCHEDULE'
    },
    
    render: function() {
        return `
            <div class="page-container active" id="schedule-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Team Schedule Management</h2>
                    <p>View and manage team schedules and duty rotations.</p>
                </div>
                
                <!-- Schedule Content -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Weekly Schedule</h2>
                    <div class="table-container">
                        <table class="tech-record-table">
                            <thead>
                                <tr>
                                    <th>Day</th>
                                    <th>Morning Shift (6AM-3PM)</th>
                                    <th>Mid Shift (1PM-10PM)</th>
                                    <th>Night Shift (10PM-6AM)</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => `
                                    <tr>
                                        <td><strong>${day}</strong></td>
                                        <td>
                                            <div class="team-assignment">
                                                <span class="team-member">John Doe</span>
                                                <span class="team-member">Jane Smith</span>
                                                <span class="team-member">Bob Johnson</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="team-assignment">
                                                <span class="team-member">Alice Brown</span>
                                                <span class="team-member">Charlie Wilson</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div class="team-assignment">
                                                <span class="team-member">David Lee</span>
                                                <span class="team-member">Emma Davis</span>
                                            </div>
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
                        day: 'numeric',
                        weekday: 'long'
                    })}</div>
                </div>
            </div>
        `;
    },
    
    init: function() {
        console.log('SchedulePage: Initializing...');
    }
};

PageManager.registerPage('schedule', SchedulePage);