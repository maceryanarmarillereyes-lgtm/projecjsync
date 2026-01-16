// Procedural Page
const ProceduralPage = {
    config: {
        id: 'procedural',
        title: 'PROCEDURAL'
    },
    
    render: function() {
        return `
            <div class="page-container active" id="procedural-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Procedural Documents</h2>
                    <p>Standard operating procedures and guidelines.</p>
                </div>
                
                <!-- Procedure Categories -->
                <div class="procedure-categories">
                    <div class="category-card active" data-category="all">
                        <i class="fas fa-list"></i>
                        <span>All Procedures</span>
                    </div>
                    <div class="category-card" data-category="it">
                        <i class="fas fa-desktop"></i>
                        <span>IT Procedures</span>
                    </div>
                    <div class="category-card" data-category="support">
                        <i class="fas fa-headset"></i>
                        <span>Support Procedures</span>
                    </div>
                    <div class="category-card" data-category="safety">
                        <i class="fas fa-shield-alt"></i>
                        <span>Safety Procedures</span>
                    </div>
                    <div class="category-card" data-category="admin">
                        <i class="fas fa-clipboard-list"></i>
                        <span>Administrative</span>
                    </div>
                </div>
                
                <!-- Procedures List -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Procedural Documents</h2>
                    <div class="procedures-list" id="proceduresList">
                        ${[
                            {title: 'Incident Response Procedure', category: 'it', code: 'PROC-IT-001', version: '2.1', date: '2024-01-10'},
                            {title: 'Customer Support Escalation', category: 'support', code: 'PROC-SUP-003', version: '1.5', date: '2024-01-08'},
                            {title: 'Network Security Protocol', category: 'safety', code: 'PROC-SEC-007', version: '3.2', date: '2024-01-05'},
                            {title: 'Data Backup Procedure', category: 'it', code: 'PROC-IT-012', version: '1.8', date: '2023-12-20'},
                            {title: 'New User Onboarding', category: 'admin', code: 'PROC-ADM-005', version: '2.0', date: '2023-12-15'},
                            {title: 'System Maintenance Checklist', category: 'it', code: 'PROC-IT-008', version: '1.3', date: '2023-12-10'},
                            {title: 'Emergency Contact Procedure', category: 'safety', code: 'PROC-SEC-004', version: '1.0', date: '2023-12-05'},
                            {title: 'Quality Assurance Process', category: 'support', code: 'PROC-SUP-009', version: '2.2', date: '2023-11-30'},
                        ].map(proc => `
                            <div class="procedure-item" data-category="${proc.category}">
                                <div class="procedure-icon">
                                    <i class="fas fa-file-alt"></i>
                                </div>
                                <div class="procedure-info">
                                    <h3>${proc.title}</h3>
                                    <div class="procedure-meta">
                                        <span class="procedure-code">${proc.code}</span>
                                        <span class="procedure-category">${proc.category.toUpperCase()}</span>
                                        <span class="procedure-version">v${proc.version}</span>
                                        <span class="procedure-date">Updated: ${proc.date}</span>
                                    </div>
                                </div>
                                <div class="procedure-actions">
                                    <button class="procedure-btn view-btn">
                                        <i class="fas fa-eye"></i> View
                                    </button>
                                    <button class="procedure-btn download-btn">
                                        <i class="fas fa-download"></i> Download
                                    </button>
                                </div>
                            </div>
                        `).join('')}
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
            .procedure-categories {
                display: flex;
                gap: 15px;
                margin-bottom: 30px;
                overflow-x: auto;
                padding: 10px 0;
            }
            
            .category-card {
                flex: 1;
                min-width: 150px;
                background-color: white;
                border-radius: 8px;
                padding: 15px;
                display: flex;
                flex-direction: column;
                align-items: center;
                text-align: center;
                cursor: pointer;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                transition: all 0.3s;
            }
            
            .category-card:hover {
                transform: translateY(-3px);
                box-shadow: 0 4px 10px rgba(0,0,0,0.15);
            }
            
            .category-card.active {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            
            .category-card i {
                font-size: 2rem;
                margin-bottom: 10px;
            }
            
            .procedures-list {
                display: flex;
                flex-direction: column;
                gap: 15px;
            }
            
            .procedure-item {
                background-color: white;
                border-radius: 8px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 20px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            
            .procedure-icon {
                width: 50px;
                height: 50px;
                background-color: #e3f2fd;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                color: #0078d4;
            }
            
            .procedure-info {
                flex: 1;
            }
            
            .procedure-info h3 {
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .procedure-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 15px;
                font-size: 0.85rem;
                color: #6c757d;
            }
            
            .procedure-code {
                font-weight: 600;
                color: #0078d4;
            }
            
            .procedure-category {
                padding: 2px 8px;
                background-color: #f8f9fa;
                border-radius: 4px;
                font-size: 0.75rem;
            }
            
            .procedure-actions {
                display: flex;
                gap: 10px;
            }
            
            .procedure-btn {
                padding: 8px 15px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .view-btn {
                background-color: #17a2b8;
                color: white;
            }
            
            .download-btn {
                background-color: #28a745;
                color: white;
            }
        `;
        document.head.appendChild(style);
    },
    
    setupEventListeners: function() {
        // Category filtering
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                document.querySelectorAll('.category-card').forEach(c => {
                    c.classList.remove('active');
                });
                
                // Add active class to clicked card
                card.classList.add('active');
                
                // Filter procedures
                const category = card.dataset.category;
                this.filterProcedures(category);
            });
        });
        
        // Procedure button handlers
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const procedureTitle = this.closest('.procedure-item').querySelector('h3').textContent;
                alert(`Viewing: ${procedureTitle}`);
            });
        });
        
        document.querySelectorAll('.download-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const procedureTitle = this.closest('.procedure-item').querySelector('h3').textContent;
                alert(`Downloading: ${procedureTitle}`);
            });
        });
    },
    
    filterProcedures: function(category) {
        const procedures = document.querySelectorAll('.procedure-item');
        
        procedures.forEach(proc => {
            if (category === 'all' || proc.dataset.category === category) {
                proc.style.display = 'flex';
            } else {
                proc.style.display = 'none';
            }
        });
    }
};

PageManager.registerPage('procedural', ProceduralPage);