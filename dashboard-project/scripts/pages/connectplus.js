// Connect+ Page
const ConnectPlusPage = {
    // Page configuration
    config: {
        id: 'connectplus',
        title: 'Connect+'
    },
    
    // Render the page
    render: function() {
        return `
            <div class="page-container active" id="connectplus-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Connect+ Collaboration Platform</h2>
                    <p>Team communication and collaboration tools.</p>
                </div>
                
                <!-- Coming Soon Message -->
                <div class="tech-record-section" style="text-align: center; padding: 40px 20px;">
                    <div style="font-size: 5rem; color: #0078d4; margin-bottom: 20px;">
                        <i class="fas fa-plug"></i>
                    </div>
                    <h2>Connect+ Platform</h2>
                    <p style="font-size: 1.1rem; color: #6c757d; margin-bottom: 30px; max-width: 600px; margin-left: auto; margin-right: auto;">
                        The Connect+ collaboration platform is coming soon! This will include team chat, task management, and shared resources.
                    </p>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 30px;">
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-comments"></i>
                            </div>
                            <h3>Team Chat</h3>
                            <p>Real-time messaging with your team members</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-tasks"></i>
                            </div>
                            <h3>Task Manager</h3>
                            <p>Assign and track tasks across the team</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-calendar-alt"></i>
                            </div>
                            <h3>Team Calendar</h3>
                            <p>Shared calendar for scheduling and events</p>
                        </div>
                        
                        <div class="feature-card">
                            <div class="feature-icon">
                                <i class="fas fa-folder-open"></i>
                            </div>
                            <h3>Shared Resources</h3>
                            <p>Central repository for team documents and files</p>
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
    
    // Initialize the page
    init: function() {
        console.log('ConnectPlusPage: Initializing...');
        this.addPageStyles();
    },
    
    // Add page-specific styles
    addPageStyles: function() {
        const styleId = 'connectplus-page-styles';
        if (document.getElementById(styleId)) return;
        
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .feature-card {
                background-color: white;
                border-radius: 8px;
                padding: 25px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                border: 1px solid #eaeaea;
                text-align: center;
                transition: transform 0.3s, box-shadow 0.3s;
            }
            
            .feature-card:hover {
                transform: translateY(-5px);
                box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            }
            
            .feature-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.8rem;
                margin: 0 auto 15px auto;
            }
            
            .feature-card h3 {
                color: #2c3e50;
                margin-bottom: 10px;
                font-size: 1.2rem;
            }
            
            .feature-card p {
                color: #6c757d;
                font-size: 0.9rem;
                line-height: 1.5;
            }
        `;
        document.head.appendChild(style);
    }
};

// Register the Connect+ page
PageManager.registerPage('connectplus', ConnectPlusPage);
console.log('ConnectPlusPage: Registered successfully');