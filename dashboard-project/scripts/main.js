// Main Application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM fully loaded and parsed');
    
    // Initialize login functionality
    initLogin();
    
    // Check for auto-login
    checkAutoLogin();
    
    // Initialize the application after login
    function initApp() {
        console.log('Initializing application...');
        
        // Initialize User Manager
        if (typeof UserManager !== 'undefined') {
            UserManager.init();
        } else {
            console.error('UserManager not found!');
        }
        
        // Initialize Menu Manager
        if (typeof MenuManager !== 'undefined') {
            // Small delay to ensure all pages are registered
            setTimeout(() => {
                MenuManager.init();
            }, 100);
        } else {
            console.error('MenuManager not found!');
        }
        
        // Initialize Schedule Manager
        if (typeof ScheduleManager !== 'undefined' && ScheduleManager.init) {
            ScheduleManager.init();
        }
        
        console.log('Application initialized successfully');
    }
    
    // Check for auto-login from localStorage
    function checkAutoLogin() {
        try {
            const savedUser = localStorage.getItem('dashboard_current_user');
            if (savedUser) {
                const user = JSON.parse(savedUser);
                console.log('Found saved user:', user.email);
                
                // Set as current user
                if (typeof UserManager !== 'undefined') {
                    UserManager.currentUser = user;
                    
                    // Hide login overlay and show main container
                    const loginOverlay = document.getElementById('loginOverlay');
                    const mainContainer = document.getElementById('mainContainer');
                    
                    if (loginOverlay) {
                        loginOverlay.classList.add('hidden');
                        console.log('Login overlay hidden (auto-login)');
                    }
                    
                    if (mainContainer) {
                        mainContainer.classList.add('show');
                        console.log('Main container shown (auto-login)');
                    }
                    
                    // Update user interface
                    UserManager.updateUserUI();
                    
                    // Initialize the application
                    initApp();
                }
            }
        } catch (e) {
            console.error('Error loading saved user:', e);
            localStorage.removeItem('dashboard_current_user');
        }
    }
    
    // Login functionality
    function initLogin() {
        console.log('Initializing login...');
        
        const loginForm = document.getElementById('loginForm');
        const registerForm = document.getElementById('registerForm');
        const loginOverlay = document.getElementById('loginOverlay');
        const mainContainer = document.getElementById('mainContainer');
        const microsoftLoginBtn = document.getElementById('microsoftLogin');
        const demoLoginBtn = document.getElementById('demoLogin');
        const showRegisterBtn = document.getElementById('showRegisterBtn');
        const showLoginBtn = document.getElementById('showLoginBtn');
        const registerAccountBtn = document.getElementById('registerAccountBtn');
        
        if (!loginOverlay) {
            console.error('Login overlay not found');
            return;
        }
        
        console.log('Login elements found, setting up event listeners...');
        
        // Switch to registration form
        if (showRegisterBtn) {
            showRegisterBtn.addEventListener('click', function(e) {
                e.preventDefault();
                loginForm.classList.remove('active');
                registerForm.classList.add('active');
            });
        }
        
        // Switch back to login form
        if (showLoginBtn) {
            showLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                registerForm.classList.remove('active');
                loginForm.classList.add('active');
            });
        }
        
        // Microsoft login handler
        if (microsoftLoginBtn) {
            microsoftLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleMicrosoftLogin();
            });
        }
        
        // Demo login handler
        if (demoLoginBtn) {
            demoLoginBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleDemoLogin();
            });
        }
        
        // Registration handler
        if (registerAccountBtn) {
            registerAccountBtn.addEventListener('click', function(e) {
                e.preventDefault();
                handleRegistration();
            });
        }
        
        // Form submission handler
        if (loginForm) {
            loginForm.addEventListener('submit', function(e) {
                e.preventDefault();
                handleLogin();
            });
        }
        
        function handleMicrosoftLogin() {
            console.log('Microsoft login attempt');
            const email = 'admin@copeland.com';
            const password = 'admin123';
            
            if (typeof UserManager !== 'undefined') {
                const result = UserManager.authenticate(email, password);
                
                if (result.success) {
                    completeLogin(result.user);
                } else {
                    alert('Microsoft authentication failed. Please try the demo account or register.');
                }
            } else {
                alert('User management system not loaded. Please refresh the page.');
            }
        }
        
        function handleDemoLogin() {
            console.log('Demo login attempt');
            // Pre-fill demo credentials
            document.getElementById('email').value = 'admin@copeland.com';
            document.getElementById('password').value = 'admin123';
            handleLogin();
        }
        
        function handleLogin() {
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value.trim();
            
            if (!email || !password) {
                alert('Please fill in both email and password fields.');
                return;
            }
            
            console.log('Login attempt for:', email);
            
            // Authenticate user
            if (typeof UserManager !== 'undefined') {
                const result = UserManager.authenticate(email, password);
                
                if (result.success) {
                    completeLogin(result.user);
                } else {
                    alert('Invalid credentials. Please try again.\n\nDemo credentials:\nEmail: admin@copeland.com\nPassword: admin123');
                }
            } else {
                alert('User management system not loaded. Please refresh the page.');
            }
        }
        
        function handleRegistration() {
            const firstName = document.getElementById('regFirstName').value.trim();
            const lastName = document.getElementById('regLastName').value.trim();
            const email = document.getElementById('regEmail').value.trim();
            const password = document.getElementById('regPassword').value.trim();
            const shift = document.getElementById('regShift').value;
            const position = document.getElementById('regPosition').value;
            
            // Validate all fields
            if (!firstName || !lastName || !email || !password || !shift || !position) {
                alert('Please fill in all required fields.');
                return;
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address.');
                return;
            }
            
            // Validate password length
            if (password.length < 6) {
                alert('Password must be at least 6 characters long.');
                return;
            }
            
            const userData = {
                firstName,
                lastName,
                email,
                password,
                shift,
                position
            };
            
            console.log('Registration attempt for:', email);
            
            // Register user
            if (typeof UserManager !== 'undefined') {
                const result = UserManager.register(userData);
                
                if (result.success) {
                    alert('Account created successfully! You are now logged in.');
                    completeLogin(result.user);
                } else {
                    alert('Registration failed: ' + result.message);
                }
            } else {
                alert('User management system not loaded. Please refresh the page.');
            }
        }
        
        function completeLogin(user) {
            console.log('Login successful for:', user.email);
            
            // Hide login overlay and show main container
            if (loginOverlay) {
                loginOverlay.classList.add('hidden');
                console.log('Login overlay hidden');
            }
            
            if (mainContainer) {
                mainContainer.classList.add('show');
                console.log('Main container shown');
            }
            
            // Set current user
            if (typeof UserManager !== 'undefined') {
                UserManager.currentUser = user;
                
                // Save user to localStorage
                UserManager.saveUserToStorage();
                
                // Update user interface
                UserManager.updateUserUI();
                
                // Show welcome message
                showWelcomeMessage(user.fullName || user.name);
                
                // Initialize the application
                initApp();
            }
        }
        
        function showWelcomeMessage(userName) {
            // Create welcome notification
            const welcomeDiv = document.createElement('div');
            welcomeDiv.className = 'welcome-message';
            welcomeDiv.innerHTML = `
                <div class="welcome-content">
                    <i class="fas fa-check-circle"></i>
                    <div>
                        <h3>Welcome, ${userName}!</h3>
                        <p>Dashboard loaded successfully.</p>
                    </div>
                </div>
            `;
            
            // Style the welcome message
            welcomeDiv.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 15px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                animation: slideIn 0.5s ease-out;
                max-width: 400px;
            `;
            
            const welcomeContent = welcomeDiv.querySelector('.welcome-content');
            if (welcomeContent) {
                welcomeContent.style.cssText = `
                    display: flex;
                    align-items: center;
                    gap: 15px;
                `;
            }
            
            document.body.appendChild(welcomeDiv);
            
            // Add animation keyframes
            const style = document.createElement('style');
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
            
            // Remove after 5 seconds
            setTimeout(() => {
                welcomeDiv.style.animation = 'slideOut 0.5s ease-out';
                setTimeout(() => {
                    if (welcomeDiv.parentNode) {
                        welcomeDiv.parentNode.removeChild(welcomeDiv);
                    }
                }, 500);
            }, 5000);
        }
        
        // Auto-focus on email field
        const emailField = document.getElementById('email');
        if (emailField) emailField.focus();
        
        console.log('Login initialization complete');
    }
    
    // Add CSS for components
    addComponentStyles();
    console.log('Component styles added');
});

// Add component-specific styles
function addComponentStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Component Styles */
        .status-badge {
            display: inline-block;
            padding: 3px 10px;
            border-radius: 12px;
            font-size: 0.8rem;
            font-weight: 600;
        }
        
        .status-badge.admin {
            background-color: #dc3545;
            color: white;
        }
        
        .status-badge.team-lead {
            background-color: #fd7e14;
            color: white;
        }
        
        .status-badge.member {
            background-color: #6c757d;
            color: white;
        }
        
        .table-container {
            overflow-x: auto;
            border: 1px solid #eaeaea;
            border-radius: 6px;
        }
        
        .tech-record-table {
            width: 100%;
            border-collapse: collapse;
            font-size: 0.9rem;
        }
        
        .tech-record-table th {
            background-color: #0078d4;
            color: white;
            padding: 12px 15px;
            text-align: left;
            font-weight: 600;
        }
        
        .tech-record-table td {
            padding: 12px 15px;
            border-bottom: 1px solid #eaeaea;
        }
        
        .tech-record-table tr:hover {
            background-color: #f8f9fa;
        }
        
        .no-results {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
        }
        
        .no-results i {
            font-size: 3rem;
            margin-bottom: 15px;
            color: #bdc3c7;
            display: block;
        }
        
        /* Welcome Message Styles */
        .welcome-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            animation: slideIn 0.5s ease-out;
            max-width: 400px;
        }
        
        .welcome-content {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .welcome-content i {
            font-size: 1.5rem;
        }
        
        .welcome-content h3 {
            margin: 0 0 5px 0;
        }
        
        .welcome-content p {
            margin: 0;
            font-size: 0.9rem;
            opacity: 0.9;
        }
        
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        /* Notification Styles */
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            color: white;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 3000;
            opacity: 0;
            transform: translateX(100%);
            transition: opacity 0.3s, transform 0.3s;
        }
        
        .notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        
        .notification.success {
            background-color: #28a745;
        }
        
        .notification.error {
            background-color: #dc3545;
        }
        
        /* Menu Item Styles */
        .menu-item-actions {
            display: flex;
            gap: 5px;
        }
        
        .menu-item-btn {
            background: transparent;
            border: none;
            color: #bdc3c7;
            cursor: pointer;
            padding: 2px 5px;
            border-radius: 3px;
            font-size: 0.8rem;
        }
        
        .menu-item-btn:hover {
            background: rgba(255, 255, 255, 0.1);
            color: white;
        }
        
        /* User Status Styles */
        .status-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            display: inline-block;
        }
        
        .status-dot.available { background-color: #28a745; }
        .status-dot.busy { background-color: #dc3545; }
        .status-dot.backoffice { background-color: #fd7e14; }
        .status-dot.meeting { background-color: #dc3545; }
        .status-dot.callonque { background-color: #17a2b8; }
        
        /* Marquee Blink Animation */
        .blink {
            animation: blink 1s infinite;
        }
        
        @keyframes blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
    `;
    document.head.appendChild(style);
}

// Export for global access if needed
window.initApp = initApp;