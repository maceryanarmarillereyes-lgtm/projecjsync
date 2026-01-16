// Skills Hub Page
const SkillsPage = {
    config: {
        id: 'skills',
        title: 'SKILL HUB'
    },
    
    render: function() {
        return `
            <div class="page-container active" id="skills-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Skills Hub</h2>
                    <p>Track and develop team skills and competencies.</p>
                </div>
                
                <!-- Skill Assessment -->
                <div class="skill-assessment-section">
                    <h3>Skill Assessment</h3>
                    <p>Rate your proficiency in different skill areas (1-5):</p>
                    
                    <div class="skill-rating-grid">
                        ${[
                            {skill: 'Technical Support', level: 4},
                            {skill: 'Network Administration', level: 3},
                            {skill: 'Database Management', level: 2},
                            {skill: 'Programming', level: 3},
                            {skill: 'Project Management', level: 4},
                            {skill: 'Communication', level: 5},
                            {skill: 'Problem Solving', level: 4},
                            {skill: 'Team Leadership', level: 3},
                        ].map(item => `
                            <div class="skill-rating-item">
                                <div class="skill-name">${item.skill}</div>
                                <div class="skill-rating">
                                    ${[1,2,3,4,5].map(level => `
                                        <div class="rating-dot ${level <= item.level ? 'filled' : ''}" 
                                             data-skill="${item.skill}" 
                                             data-level="${level}"></div>
                                    `).join('')}
                                </div>
                                <div class="skill-level">Level ${item.level}</div>
                            </div>
                        `).join('')}
                    </div>
                    
                    <button class="apply-btn" id="saveSkillsBtn">
                        <i class="fas fa-save"></i> Save Skill Assessment
                    </button>
                </div>
                
                <!-- Training Resources -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Training Resources</h2>
                    <div class="training-resources">
                        <div class="resource-card">
                            <div class="resource-icon">
                                <i class="fas fa-video"></i>
                            </div>
                            <div class="resource-info">
                                <h3>Technical Support Course</h3>
                                <p>Comprehensive training on technical support fundamentals</p>
                                <div class="resource-meta">
                                    <span><i class="fas fa-clock"></i> 8 hours</span>
                                    <span><i class="fas fa-certificate"></i> Certificate Available</span>
                                </div>
                            </div>
                            <button class="resource-btn">Enroll</button>
                        </div>
                        
                        <div class="resource-card">
                            <div class="resource-icon">
                                <i class="fas fa-book"></i>
                            </div>
                            <div class="resource-info">
                                <h3>Network Security Guide</h3>
                                <p>Learn about network security best practices and protocols</p>
                                <div class="resource-meta">
                                    <span><i class="fas fa-clock"></i> 6 hours</span>
                                    <span><i class="fas fa-file-pdf"></i> PDF Guide</span>
                                </div>
                            </div>
                            <button class="resource-btn">Download</button>
                        </div>
                        
                        <div class="resource-card">
                            <div class="resource-icon">
                                <i class="fas fa-chalkboard-teacher"></i>
                            </div>
                            <div class="resource-info">
                                <h3>Communication Workshop</h3>
                                <p>Improve your communication skills for better teamwork</p>
                                <div class="resource-meta">
                                    <span><i class="fas fa-clock"></i> 4 hours</span>
                                    <span><i class="fas fa-users"></i> Live Session</span>
                                </div>
                            </div>
                            <button class="resource-btn">Register</button>
                        </div>
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
            .skill-assessment-section {
                background-color: white;
                border-radius: 10px;
                padding: 25px;
                margin-bottom: 30px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            }
            
            .skill-assessment-section h3 {
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .skill-assessment-section p {
                color: #6c757d;
                margin-bottom: 20px;
            }
            
            .skill-rating-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
                margin-bottom: 20px;
            }
            
            .skill-rating-item {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px;
                background-color: #f8f9fa;
                border-radius: 8px;
            }
            
            .skill-name {
                font-weight: 600;
                color: #2c3e50;
                flex: 1;
            }
            
            .skill-rating {
                display: flex;
                gap: 5px;
                margin: 0 15px;
            }
            
            .rating-dot {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #e9ecef;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .rating-dot.filled {
                background-color: #28a745;
            }
            
            .rating-dot:hover {
                transform: scale(1.2);
            }
            
            .skill-level {
                font-weight: 600;
                color: #0078d4;
                min-width: 60px;
                text-align: right;
            }
            
            .training-resources {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
                gap: 20px;
            }
            
            .resource-card {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                display: flex;
                align-items: center;
                gap: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            }
            
            .resource-icon {
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
            
            .resource-info {
                flex: 1;
            }
            
            .resource-info h3 {
                margin-bottom: 5px;
                color: #2c3e50;
            }
            
            .resource-info p {
                color: #6c757d;
                font-size: 0.9rem;
                margin-bottom: 10px;
            }
            
            .resource-meta {
                display: flex;
                gap: 15px;
                font-size: 0.8rem;
                color: #6c757d;
            }
            
            .resource-btn {
                padding: 8px 15px;
                background-color: #0078d4;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    },
    
    setupEventListeners: function() {
        // Skill rating
        document.querySelectorAll('.rating-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const skill = dot.dataset.skill;
                const level = parseInt(dot.dataset.level);
                
                // Update all dots for this skill
                const skillDots = document.querySelectorAll(`.rating-dot[data-skill="${skill}"]`);
                skillDots.forEach((d, index) => {
                    if (index < level) {
                        d.classList.add('filled');
                    } else {
                        d.classList.remove('filled');
                    }
                });
                
                // Update skill level text
                const skillItem = dot.closest('.skill-rating-item');
                const levelText = skillItem.querySelector('.skill-level');
                levelText.textContent = `Level ${level}`;
            });
        });
        
        // Save skills button
        const saveBtn = document.getElementById('saveSkillsBtn');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                alert('Skill assessment saved!');
            });
        }
        
        // Resource buttons
        document.querySelectorAll('.resource-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const resourceTitle = this.closest('.resource-card').querySelector('h3').textContent;
                alert(`Accessing: ${resourceTitle}`);
            });
        });
    }
};

PageManager.registerPage('skills', SkillsPage);