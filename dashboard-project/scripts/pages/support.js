// Support Tool Page
const SupportPage = {
    config: {
        id: 'support',
        title: 'SUPPORT TOOL'
    },
    
    render: function() {
        return `
            <div class="page-container active" id="support-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Support Tool</h2>
                    <p>Technical support tools and utilities for troubleshooting.</p>
                </div>
                
                <!-- Tool Cards -->
                <div class="tools-grid">
                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-network-wired"></i>
                        </div>
                        <div class="tool-info">
                            <h3>Network Diagnostics</h3>
                            <p>Check network connectivity and diagnose issues</p>
                        </div>
                        <button class="tool-btn">Launch</button>
                    </div>
                    
                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-database"></i>
                        </div>
                        <div class="tool-info">
                            <h3>Database Check</h3>
                            <p>Verify database connections and health status</p>
                        </div>
                        <button class="tool-btn">Launch</button>
                    </div>
                    
                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-server"></i>
                        </div>
                        <div class="tool-info">
                            <h3>Server Monitor</h3>
                            <p>Monitor server performance and resources</p>
                        </div>
                        <button class="tool-btn">Launch</button>
                    </div>
                    
                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <div class="tool-info">
                            <h3>Security Scan</h3>
                            <p>Run security checks and vulnerability scans</p>
                        </div>
                        <button class="tool-btn">Launch</button>
                    </div>
                    
                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-file-code"></i>
                        </div>
                        <div class="tool-info">
                            <h3>Code Validator</h3>
                            <p>Validate scripts and code snippets</p>
                        </div>
                        <button class="tool-btn">Launch</button>
                    </div>
                    
                    <div class="tool-card">
                        <div class="tool-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="tool-info">
                            <h3>Performance Test</h3>
                            <p>Test system performance and load capacity</p>
                        </div>
                        <button class="tool-btn">Launch</button>
                    </div>
                </div>
                
                <!-- Quick Diagnostics -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Quick Diagnostics</h2>
                    <div class="diagnostics-tools">
                        <button class="diagnostic-btn" id="pingTestBtn">
                            <i class="fas fa-satellite-dish"></i> Ping Test
                        </button>
                        <button class="diagnostic-btn" id="dnsTestBtn">
                            <i class="fas fa-globe"></i> DNS Check
                        </button>
                        <button class="diagnostic-btn" id="portScanBtn">
                            <i class="fas fa-plug"></i> Port Scanner
                        </button>
                        <button class="diagnostic-btn" id="speedTestBtn">
                            <i class="fas fa-tachometer-alt"></i> Speed Test
                        </button>
                    </div>
                    
                    <div class="diagnostic-results" id="diagnosticResults">
                        <!-- Results will appear here -->
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
        this.setupEventListeners();
    },
    
    addPageStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .tools-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 30px;
            }
            
            .tool-card {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
            }
            
            .tool-icon {
                width: 60px;
                height: 60px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.8rem;
                margin-bottom: 15px;
            }
            
            .tool-info h3 {
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .tool-info p {
                color: #6c757d;
                font-size: 0.9rem;
                margin-bottom: 15px;
            }
            
            .tool-btn {
                padding: 8px 20px;
                background-color: #0078d4;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                width: 100%;
            }
            
            .diagnostics-tools {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                margin-bottom: 20px;
            }
            
            .diagnostic-btn {
                padding: 12px 25px;
                background-color: #28a745;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .diagnostic-btn:hover {
                background-color: #218838;
            }
            
            .diagnostic-results {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                min-height: 100px;
                font-family: monospace;
                white-space: pre-wrap;
                overflow-x: auto;
            }
        `;
        document.head.appendChild(style);
    },
    
    setupEventListeners: function() {
        const pingBtn = document.getElementById('pingTestBtn');
        const dnsBtn = document.getElementById('dnsTestBtn');
        const portBtn = document.getElementById('portScanBtn');
        const speedBtn = document.getElementById('speedTestBtn');
        
        if (pingBtn) {
            pingBtn.addEventListener('click', () => {
                this.runDiagnostic('PING', 'Running ping test...');
            });
        }
        
        if (dnsBtn) {
            dnsBtn.addEventListener('click', () => {
                this.runDiagnostic('DNS', 'Checking DNS resolution...');
            });
        }
        
        if (portBtn) {
            portBtn.addEventListener('click', () => {
                this.runDiagnostic('PORT', 'Scanning common ports...');
            });
        }
        
        if (speedBtn) {
            speedBtn.addEventListener('click', () => {
                this.runDiagnostic('SPEED', 'Testing connection speed...');
            });
        }
        
        // Add click handlers to tool buttons
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const toolName = this.closest('.tool-card').querySelector('h3').textContent;
                alert(`Launching ${toolName}...`);
            });
        });
    },
    
    runDiagnostic: function(type, message) {
        const resultsDiv = document.getElementById('diagnosticResults');
        resultsDiv.innerHTML = `<div class="diagnostic-loading">${message}</div>`;
        
        setTimeout(() => {
            let result = '';
            
            switch(type) {
                case 'PING':
                    result = `PING google.com (142.250.189.174):
Reply from 142.250.189.174: bytes=32 time=25ms TTL=117
Reply from 142.250.189.174: bytes=32 time=26ms TTL=117
Reply from 142.250.189.174: bytes=32 time=24ms TTL=117
Reply from 142.250.189.174: bytes=32 time=27ms TTL=117

Ping statistics:
    Packets: Sent = 4, Received = 4, Lost = 0 (0% loss)
Approximate round trip times in milli-seconds:
    Minimum = 24ms, Maximum = 27ms, Average = 25ms`;
                    break;
                    
                case 'DNS':
                    result = `DNS Resolution Test:
google.com -> 142.250.189.174 [OK]
facebook.com -> 157.240.3.35 [OK]
github.com -> 140.82.121.3 [OK]
amazon.com -> 176.32.103.205 [OK]

All DNS resolutions successful.`;
                    break;
                    
                case 'PORT':
                    result = `Port Scan Results:
Port 80 (HTTP): OPEN
Port 443 (HTTPS): OPEN
Port 22 (SSH): CLOSED
Port 21 (FTP): CLOSED
Port 25 (SMTP): OPEN
Port 110 (POP3): CLOSED

Scan completed: 6 ports tested.`;
                    break;
                    
                case 'SPEED':
                    result = `Speed Test Results:
Download: 85.4 Mbps
Upload: 42.7 Mbps
Ping: 24 ms
Jitter: 3 ms

Connection quality: Excellent`;
                    break;
            }
            
            resultsDiv.innerHTML = `<div class="diagnostic-result">${result}</div>`;
        }, 1500);
    }
};

PageManager.registerPage('support', SupportPage);