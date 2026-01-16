// Files Page
const FilesPage = {
    config: {
        id: 'files',
        title: 'FILES - UPDATE'
    },
    
    render: function() {
        return `
            <div class="page-container active" id="files-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">File Management System</h2>
                    <p>Upload, download, and manage team files and documents.</p>
                </div>
                
                <!-- File Upload Area -->
                <div class="file-upload-section">
                    <div class="upload-area" id="uploadArea">
                        <i class="fas fa-cloud-upload-alt"></i>
                        <h3>Drag & Drop Files Here</h3>
                        <p>or click to browse files</p>
                        <input type="file" id="fileInput" multiple style="display: none;">
                    </div>
                    <button class="apply-btn" id="uploadBtn">Upload Selected Files</button>
                </div>
                
                <!-- File List -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Recent Files</h2>
                    <div class="table-container">
                        <table class="tech-record-table">
                            <thead>
                                <tr>
                                    <th>File Name</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Uploaded By</th>
                                    <th>Date</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${[
                                    {name: 'Project_Requirements.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'John Doe', date: '2024-01-15'},
                                    {name: 'Meeting_Minutes.docx', type: 'Document', size: '1.1 MB', uploadedBy: 'Jane Smith', date: '2024-01-14'},
                                    {name: 'Network_Diagram.png', type: 'Image', size: '3.2 MB', uploadedBy: 'Bob Johnson', date: '2024-01-13'},
                                    {name: 'Budget_Report.xlsx', type: 'Spreadsheet', size: '4.5 MB', uploadedBy: 'Alice Brown', date: '2024-01-12'},
                                    {name: 'Training_Video.mp4', type: 'Video', size: '15.2 MB', uploadedBy: 'Charlie Wilson', date: '2024-01-11'},
                                ].map(file => `
                                    <tr>
                                        <td>
                                            <div class="file-info">
                                                <i class="fas fa-file-${this.getFileIcon(file.type)}"></i>
                                                <span>${file.name}</span>
                                            </div>
                                        </td>
                                        <td>${file.type}</td>
                                        <td>${file.size}</td>
                                        <td>${file.uploadedBy}</td>
                                        <td>${file.date}</td>
                                        <td>
                                            <div class="file-actions">
                                                <button class="action-btn download-btn" title="Download">
                                                    <i class="fas fa-download"></i>
                                                </button>
                                                <button class="action-btn share-btn" title="Share">
                                                    <i class="fas fa-share"></i>
                                                </button>
                                                <button class="action-btn delete-btn" title="Delete">
                                                    <i class="fas fa-trash"></i>
                                                </button>
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
    
    getFileIcon: function(type) {
        const iconMap = {
            'PDF': 'pdf',
            'Document': 'word',
            'Image': 'image',
            'Spreadsheet': 'excel',
            'Video': 'video'
        };
        return iconMap[type] || 'file';
    },
    
    addPageStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .file-upload-section {
                background-color: white;
                border-radius: 10px;
                padding: 25px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            }
            
            .upload-area {
                border: 2px dashed #0078d4;
                border-radius: 10px;
                padding: 40px;
                text-align: center;
                margin-bottom: 20px;
                cursor: pointer;
                transition: all 0.3s;
            }
            
            .upload-area:hover {
                background-color: #f8f9fa;
                border-color: #0056b3;
            }
            
            .upload-area i {
                font-size: 3rem;
                color: #0078d4;
                margin-bottom: 15px;
            }
            
            .upload-area h3 {
                margin-bottom: 10px;
                color: #2c3e50;
            }
            
            .upload-area p {
                color: #6c757d;
            }
            
            .file-info {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .file-info i {
                font-size: 1.2rem;
                color: #0078d4;
            }
            
            .file-actions {
                display: flex;
                gap: 5px;
            }
            
            .action-btn {
                width: 30px;
                height: 30px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .download-btn {
                background-color: #28a745;
                color: white;
            }
            
            .share-btn {
                background-color: #17a2b8;
                color: white;
            }
            
            .delete-btn {
                background-color: #dc3545;
                color: white;
            }
        `;
        document.head.appendChild(style);
    },
    
    setupEventListeners: function() {
        const uploadArea = document.getElementById('uploadArea');
        const fileInput = document.getElementById('fileInput');
        const uploadBtn = document.getElementById('uploadBtn');
        
        if (uploadArea && fileInput) {
            uploadArea.addEventListener('click', () => {
                fileInput.click();
            });
            
            uploadArea.addEventListener('dragover', (e) => {
                e.preventDefault();
                uploadArea.style.backgroundColor = '#e3f2fd';
            });
            
            uploadArea.addEventListener('dragleave', () => {
                uploadArea.style.backgroundColor = '';
            });
            
            uploadArea.addEventListener('drop', (e) => {
                e.preventDefault();
                uploadArea.style.backgroundColor = '';
                // Handle dropped files
                const files = e.dataTransfer.files;
                if (files.length > 0) {
                    alert(`Dropped ${files.length} file(s)`);
                }
            });
        }
        
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                alert('Upload functionality would be implemented here');
            });
        }
    }
};

PageManager.registerPage('files', FilesPage);