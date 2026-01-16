// Notes Page
const NotesPage = {
    config: {
        id: 'notes',
        title: 'MY NOTES'
    },
    
    data: {
        notes: []
    },
    
    render: function() {
        return `
            <div class="page-container active" id="notes-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Personal Notes</h2>
                    <p>Create and manage your personal notes and reminders.</p>
                </div>
                
                <!-- Note Creation Form -->
                <div class="note-creation-section">
                    <div class="form-group">
                        <label for="noteTitle" class="input-label">Note Title</label>
                        <input type="text" id="noteTitle" class="case-input" placeholder="Enter note title">
                    </div>
                    <div class="form-group">
                        <label for="noteContent" class="input-label">Note Content</label>
                        <textarea id="noteContent" class="note-textarea" placeholder="Enter your note content here..." rows="4"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="noteCategory" class="input-label">Category</label>
                        <select id="noteCategory" class="case-dropdown">
                            <option value="work">Work</option>
                            <option value="personal">Personal</option>
                            <option value="ideas">Ideas</option>
                            <option value="reminders">Reminders</option>
                            <option value="meetings">Meetings</option>
                        </select>
                    </div>
                    <div class="note-actions">
                        <button class="apply-btn" id="saveNoteBtn">
                            <i class="fas fa-save"></i> Save Note
                        </button>
                        <button class="clear-btn" id="clearNoteBtn">
                            <i class="fas fa-eraser"></i> Clear
                        </button>
                    </div>
                </div>
                
                <!-- Notes List -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">My Notes</h2>
                    <div class="notes-grid" id="notesGrid">
                        ${this.data.notes.length > 0 ? this.data.notes.map(note => `
                            <div class="note-card ${note.category}">
                                <div class="note-header">
                                    <h3>${note.title}</h3>
                                    <div class="note-meta">
                                        <span class="note-category">${note.category}</span>
                                        <span class="note-date">${note.date}</span>
                                    </div>
                                </div>
                                <div class="note-content">
                                    ${note.content}
                                </div>
                                <div class="note-actions">
                                    <button class="note-btn edit-btn" data-id="${note.id}">
                                        <i class="fas fa-edit"></i>
                                    </button>
                                    <button class="note-btn delete-btn" data-id="${note.id}">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="no-notes">
                                <i class="fas fa-sticky-note"></i>
                                <h3>No Notes Yet</h3>
                                <p>Create your first note using the form above!</p>
                            </div>
                        `}
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
        this.loadNotes();
        this.addPageStyles();
        this.setupEventListeners();
    },
    
    loadNotes: function() {
        const savedNotes = localStorage.getItem('dashboard_notes');
        if (savedNotes) {
            this.data.notes = JSON.parse(savedNotes);
        }
    },
    
    saveNotes: function() {
        localStorage.setItem('dashboard_notes', JSON.stringify(this.data.notes));
    },
    
    addPageStyles: function() {
        const style = document.createElement('style');
        style.textContent = `
            .note-creation-section {
                background-color: white;
                border-radius: 10px;
                padding: 25px;
                margin-bottom: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
            }
            
            .note-textarea {
                width: 100%;
                padding: 12px 15px;
                border: 1px solid #d2d2d2;
                border-radius: 6px;
                font-size: 0.95rem;
                font-family: inherit;
                resize: vertical;
            }
            
            .note-actions {
                display: flex;
                gap: 10px;
                margin-top: 15px;
            }
            
            .notes-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                gap: 20px;
            }
            
            .note-card {
                background-color: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.08);
                border-left: 4px solid #0078d4;
                display: flex;
                flex-direction: column;
            }
            
            .note-card.work { border-left-color: #0078d4; }
            .note-card.personal { border-left-color: #28a745; }
            .note-card.ideas { border-left-color: #ffc107; }
            .note-card.reminders { border-left-color: #fd7e14; }
            .note-card.meetings { border-left-color: #6f42c1; }
            
            .note-header {
                margin-bottom: 15px;
                border-bottom: 1px solid #eaeaea;
                padding-bottom: 10px;
            }
            
            .note-header h3 {
                margin-bottom: 5px;
                color: #2c3e50;
            }
            
            .note-meta {
                display: flex;
                justify-content: space-between;
                font-size: 0.8rem;
                color: #6c757d;
            }
            
            .note-category {
                text-transform: capitalize;
                font-weight: 600;
            }
            
            .note-content {
                flex: 1;
                color: #495057;
                line-height: 1.6;
                margin-bottom: 15px;
            }
            
            .note-actions {
                display: flex;
                gap: 5px;
                justify-content: flex-end;
            }
            
            .note-btn {
                width: 30px;
                height: 30px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .edit-btn {
                background-color: #17a2b8;
                color: white;
            }
            
            .delete-btn {
                background-color: #dc3545;
                color: white;
            }
            
            .no-notes {
                grid-column: 1 / -1;
                text-align: center;
                padding: 40px;
                color: #6c757d;
            }
            
            .no-notes i {
                font-size: 3rem;
                color: #bdc3c7;
                margin-bottom: 15px;
            }
        `;
        document.head.appendChild(style);
    },
    
    setupEventListeners: function() {
        const saveBtn = document.getElementById('saveNoteBtn');
        const clearBtn = document.getElementById('clearNoteBtn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveNewNote();
            });
        }
        
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                document.getElementById('noteTitle').value = '';
                document.getElementById('noteContent').value = '';
                document.getElementById('noteCategory').value = 'work';
            });
        }
    },
    
    saveNewNote: function() {
        const title = document.getElementById('noteTitle').value.trim();
        const content = document.getElementById('noteContent').value.trim();
        const category = document.getElementById('noteCategory').value;
        
        if (!title || !content) {
            alert('Please enter both title and content for the note.');
            return;
        }
        
        const newNote = {
            id: Date.now(),
            title: title,
            content: content,
            category: category,
            date: new Date().toLocaleDateString()
        };
        
        this.data.notes.unshift(newNote);
        this.saveNotes();
        
        // Refresh the page
        MenuManager.switchPage('notes');
        
        // Clear form
        document.getElementById('noteTitle').value = '';
        document.getElementById('noteContent').value = '';
        document.getElementById('noteCategory').value = 'work';
    }
};

PageManager.registerPage('notes', NotesPage);