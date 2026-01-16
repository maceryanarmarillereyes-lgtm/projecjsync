// Connect+ Sites Page
const ConnectSitesPage = {
    config: {
        id: 'connectsites',
        title: 'Connect+ Sites'
    },
    
    data: {
        sites: [],
        sheetHeaders: [],
        filteredData: [],
        currentSortColumn: null,
        currentSortDirection: 'asc',
        currentPage: 1,
        itemsPerPage: 25
    },
    
    corsProxies: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest='
    ],
    
    render: function() {
        return `
            <div class="page-container active" id="connectsites-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Connect+ Sites Search</h2>
                    <p>Search through the Connect+ Sites database to find information about SharePoint sites.</p>
                </div>
                
                <!-- Search Controls -->
                <div class="search-controls">
                    <div class="search-container">
                        <input type="text" id="sitesSearch" class="case-input" 
                               placeholder="Search sites, owners, URLs, or any keyword...">
                        <button class="apply-btn" id="searchBtn">Search</button>
                        <button class="clear-btn" id="clearBtn">Clear</button>
                        <button class="export-btn" id="exportBtn">Export CSV</button>
                    </div>
                    
                    <div class="search-options">
                        <div class="search-option">
                            <label for="searchColumn">Search in:</label>
                            <select id="searchColumn">
                                <option value="all">All Columns</option>
                                <option value="Site Name">Site Name</option>
                                <option value="Site URL">Site URL</option>
                                <option value="Site Owner">Site Owner</option>
                                <option value="Department">Department</option>
                            </select>
                        </div>
                        <div class="search-option">
                            <label for="resultsPerPage">Results per page:</label>
                            <select id="resultsPerPage">
                                <option value="10">10</option>
                                <option value="25" selected>25</option>
                                <option value="50">50</option>
                                <option value="100">100</option>
                            </select>
                        </div>
                        <div class="search-option">
                            <button class="apply-btn" id="refreshBtn">Refresh Data</button>
                        </div>
                    </div>
                    
                    <div class="search-stats">
                        <span id="resultCount">Search for Connect+ sites...</span>
                        <span id="dataStatus" style="font-style: italic;">Not loaded yet</span>
                    </div>
                </div>
                
                <!-- Status Messages -->
                <div id="loadingIndicator" class="status-message loading-message">
                    <i class="fas fa-spinner fa-spin"></i> Loading Connect+ Sites data...
                </div>
                
                <div id="searchErrorMessage" class="status-message error-message-part">
                    <i class="fas fa-exclamation-triangle"></i> <span id="errorText"></span>
                </div>
                
                <div id="successMessage" class="status-message success-message">
                    <i class="fas fa-check-circle"></i> <span id="successText"></span>
                </div>
                
                <!-- Table Controls -->
                <div class="table-controls">
                    <div class="pagination">
                        <button class="pagination-btn" id="firstPage">«</button>
                        <button class="pagination-btn" id="prevPage">‹</button>
                        <span class="page-info" id="pageInfo">Page 1 of 1</span>
                        <button class="pagination-btn" id="nextPage">›</button>
                        <button class="pagination-btn" id="lastPage">»</button>
                    </div>
                    <div class="search-stats">
                        <span id="displayCount">Showing 0 results</span>
                    </div>
                </div>
                
                <!-- Results Table -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Connect+ Sites Database</h2>
                    <div class="table-container">
                        <table class="part-number-table" id="sitesTable">
                            <thead id="tableHeaders">
                                <tr>
                                    <th>Site Name</th>
                                    <th>Site URL</th>
                                    <th>Site Owner</th>
                                    <th>Department</th>
                                    <th>Purpose</th>
                                    <th>Status</th>
                                    <th>Access Level</th>
                                </tr>
                            </thead>
                            <tbody id="sitesResults">
                                <tr>
                                    <td colspan="7" class="no-results">
                                        <i class="fas fa-search"></i>
                                        Enter a search term above to find Connect+ sites
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <div id="noResultsMessage" class="no-results" style="display: none;">
                        <i class="fas fa-database"></i>
                        No matching Connect+ sites found.
                    </div>
                </div>
                
                <!-- Quick Stats -->
                <div class="quick-stats">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-globe"></i></div>
                        <div class="stat-content">
                            <div class="stat-value" id="totalSites">0</div>
                            <div class="stat-label">Total Sites</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-user-check"></i></div>
                        <div class="stat-content">
                            <div class="stat-value" id="activeSites">0</div>
                            <div class="stat-label">Active Sites</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-content">
                            <div class="stat-value" id="uniqueOwners">0</div>
                            <div class="stat-label">Unique Owners</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-building"></i></div>
                        <div class="stat-content">
                            <div class="stat-value" id="departments">0</div>
                            <div class="stat-label">Departments</div>
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
        this.setupEventListeners();
        this.loadSitesData();
    },
    
    setupEventListeners: function() {
        document.getElementById('searchBtn')?.addEventListener('click', () => this.search());
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearSearch());
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportToCSV());
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.loadSitesData());
        
        const searchInput = document.getElementById('sitesSearch');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.search();
            });
        }
        
        document.getElementById('firstPage')?.addEventListener('click', () => this.goToFirstPage());
        document.getElementById('prevPage')?.addEventListener('click', () => this.goToPrevPage());
        document.getElementById('nextPage')?.addEventListener('click', () => this.goToNextPage());
        document.getElementById('lastPage')?.addEventListener('click', () => this.goToLastPage());
        
        const resultsPerPage = document.getElementById('resultsPerPage');
        if (resultsPerPage) {
            resultsPerPage.addEventListener('change', (e) => {
                this.data.itemsPerPage = parseInt(e.target.value);
                this.data.currentPage = 1;
                this.displayResults();
            });
        }
    },
    
    async loadSitesData() {
        this.showLoading(true);
        this.hideMessages();
        
        const sheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTI_dFlSCQPrUJu0bNi4O-G2Lev7G-r5iyUpMo0o2gJmfJVok3dyBpx8XigVeSwl-UORbr6a0J1HIH3/pub?gid=970184644&single=true&output=csv';
        const url = sheetsURL + '&t=' + new Date().getTime();
        
        try {
            let csvText = await this.fetchWithRetry(url);
            
            if (csvText) {
                const parsedData = this.parseCSV(csvText);
                this.data.sites = parsedData.data;
                this.data.sheetHeaders = parsedData.headers;
                this.data.filteredData = [...this.data.sites];
                
                this.updateDataStatus(`Loaded ${this.data.sites.length} Connect+ sites`);
                this.showSuccessMessage(`Successfully loaded ${this.data.sites.length} Connect+ sites`);
                this.updateStats();
                this.displayResults();
            } else {
                throw new Error('All fetch methods failed');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showErrorMessage('Error loading data from Google Sheets. Using sample data.');
            this.updateDataStatus('Using sample data');
            this.loadSampleData();
        } finally {
            this.showLoading(false);
        }
    },
    
    async fetchWithRetry(url) {
        try {
            const response = await fetch(url, { 
                mode: 'cors',
                cache: 'no-cache'
            });
            
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.text();
        } catch (error) {
            for (const proxy of this.corsProxies) {
                try {
                    const proxyUrl = proxy + encodeURIComponent(url);
                    const response = await fetch(proxyUrl, { mode: 'cors', cache: 'no-cache' });
                    if (!response.ok) continue;
                    return await response.text();
                } catch (proxyError) {
                    continue;
                }
            }
            throw error;
        }
    },
    
    parseCSV(csvText) {
        csvText = csvText.trim();
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) return { headers: [], data: [] };
        
        const headers = this.parseCSVLine(lines[0]);
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const row = this.parseCSVLine(lines[i]);
            if (row.length === 0 || (row.length === 1 && row[0] === '')) continue;
            
            const rowObj = {};
            headers.forEach((header, index) => {
                const headerName = header || `Column ${index + 1}`;
                rowObj[headerName] = row[index] || '';
            });
            
            data.push(rowObj);
        }
        
        return { headers, data };
    },
    
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"' && inQuotes && nextChar === '"') {
                current += '"';
                i++;
            } else if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        
        return result.map(field => {
            if (field.startsWith('"') && field.endsWith('"')) {
                return field.slice(1, -1);
            }
            return field;
        });
    },
    
    updateStats() {
        const totalSites = this.data.sites.length;
        const activeSites = this.data.sites.filter(site => 
            (site.Status && site.Status.toLowerCase().includes('active')) || 
            (site.status && site.status.toLowerCase().includes('active'))
        ).length;
        
        const owners = new Set();
        const departments = new Set();
        
        this.data.sites.forEach(site => {
            if (site['Site Owner']) owners.add(site['Site Owner']);
            if (site['Owner']) owners.add(site['Owner']);
            if (site['Department']) departments.add(site['Department']);
            if (site['Dept']) departments.add(site['Dept']);
        });
        
        document.getElementById('totalSites').textContent = totalSites;
        document.getElementById('activeSites').textContent = activeSites;
        document.getElementById('uniqueOwners').textContent = owners.size;
        document.getElementById('departments').textContent = departments.size;
    },
    
    search() {
        const searchTerm = document.getElementById('sitesSearch').value.toLowerCase();
        const searchColumn = document.getElementById('searchColumn').value;
        
        if (!searchTerm.trim()) {
            this.data.filteredData = [...this.data.sites];
        } else {
            this.data.filteredData = this.data.sites.filter(row => {
                if (searchColumn === 'all') {
                    return Object.values(row).some(value => 
                        value && value.toString().toLowerCase().includes(searchTerm)
                    );
                } else {
                    const columnValue = row[searchColumn];
                    return columnValue && columnValue.toString().toLowerCase().includes(searchTerm);
                }
            });
        }
        
        this.data.currentPage = 1;
        this.displayResults();
    },
    
    clearSearch() {
        document.getElementById('sitesSearch').value = '';
        this.data.filteredData = [...this.data.sites];
        this.data.currentPage = 1;
        this.displayResults();
    },
    
    displayResults() {
        const tableBody = document.getElementById('sitesResults');
        const noResultsMessage = document.getElementById('noResultsMessage');
        
        if (this.data.filteredData.length === 0) {
            noResultsMessage.style.display = 'block';
            tableBody.innerHTML = '';
            this.updateResultCount(0);
            this.updatePagination();
            return;
        }
        
        noResultsMessage.style.display = 'none';
        
        const totalPages = Math.ceil(this.data.filteredData.length / this.data.itemsPerPage);
        const startIndex = (this.data.currentPage - 1) * this.data.itemsPerPage;
        const endIndex = Math.min(startIndex + this.data.itemsPerPage, this.data.filteredData.length);
        const pageData = this.data.filteredData.slice(startIndex, endIndex);
        const searchTerm = document.getElementById('sitesSearch').value.toLowerCase();
        
        tableBody.innerHTML = pageData.map((row, rowIndex) => {
            const siteName = row['Site Name'] || row['Site'] || row['Name'] || '';
            const siteUrl = row['Site URL'] || row['URL'] || row['Link'] || '';
            const siteOwner = row['Site Owner'] || row['Owner'] || '';
            const department = row['Department'] || row['Dept'] || '';
            const purpose = row['Purpose'] || row['Description'] || '';
            const status = row['Status'] || row['State'] || 'Active';
            const accessLevel = row['Access Level'] || row['Access'] || 'Private';
            
            return `
                <tr ${rowIndex % 2 === 0 ? 'style="background-color: #f8f9fa;"' : ''}>
                    <td class="site-name-cell">${this.highlightText(siteName, searchTerm)}</td>
                    <td class="site-url-cell">
                        ${siteUrl ? `<a href="${siteUrl}" target="_blank" style="color: #0078d4;">${this.highlightText(siteUrl, searchTerm)} <i class="fas fa-external-link-alt"></i></a>` : '-'}
                    </td>
                    <td>${this.highlightText(siteOwner, searchTerm)}</td>
                    <td>${this.highlightText(department, searchTerm)}</td>
                    <td>${this.highlightText(purpose, searchTerm)}</td>
                    <td>
                        <span class="status-badge" style="background-color: ${status.toLowerCase().includes('active') ? '#d4edda' : '#f8d7da'}; 
                              color: ${status.toLowerCase().includes('active') ? '#155724' : '#721c24'}">
                            ${status}
                        </span>
                    </td>
                    <td>
                        <span class="access-badge" style="background-color: ${accessLevel.toLowerCase().includes('public') ? '#d1ecf1' : '#f8d7da'}; 
                              color: ${accessLevel.toLowerCase().includes('public') ? '#0c5460' : '#721c24'}">
                            ${accessLevel}
                        </span>
                    </td>
                </tr>
            `;
        }).join('');
        
        this.updateResultCount(this.data.filteredData.length);
        document.getElementById('displayCount').textContent = 
            `Showing ${startIndex + 1}-${endIndex} of ${this.data.filteredData.length} results`;
        
        this.updatePagination();
    },
    
    highlightText(text, searchTerm) {
        if (!searchTerm || !text) return text || '';
        const escapedSearchTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`(${escapedSearchTerm})`, 'gi');
        return text.toString().replace(regex, '<span class="highlight">$1</span>');
    },
    
    goToFirstPage() { if (this.data.currentPage > 1) { this.data.currentPage = 1; this.displayResults(); } },
    goToPrevPage() { if (this.data.currentPage > 1) { this.data.currentPage--; this.displayResults(); } },
    goToNextPage() { 
        const totalPages = Math.ceil(this.data.filteredData.length / this.data.itemsPerPage);
        if (this.data.currentPage < totalPages) { this.data.currentPage++; this.displayResults(); }
    },
    goToLastPage() { 
        const totalPages = Math.ceil(this.data.filteredData.length / this.data.itemsPerPage);
        if (this.data.currentPage < totalPages) { this.data.currentPage = totalPages; this.displayResults(); }
    },
    
    updatePagination() {
        const totalPages = Math.ceil(this.data.filteredData.length / this.data.itemsPerPage);
        const pageInfo = document.getElementById('pageInfo');
        const firstPageBtn = document.getElementById('firstPage');
        const prevPageBtn = document.getElementById('prevPage');
        const nextPageBtn = document.getElementById('nextPage');
        const lastPageBtn = document.getElementById('lastPage');
        
        if (pageInfo) pageInfo.textContent = `Page ${this.data.currentPage} of ${totalPages || 1}`;
        if (firstPageBtn) firstPageBtn.disabled = this.data.currentPage === 1 || totalPages === 0;
        if (prevPageBtn) prevPageBtn.disabled = this.data.currentPage === 1 || totalPages === 0;
        if (nextPageBtn) nextPageBtn.disabled = this.data.currentPage === totalPages || totalPages === 0;
        if (lastPageBtn) lastPageBtn.disabled = this.data.currentPage === totalPages || totalPages === 0;
    },
    
    updateResultCount(count) {
        const resultCountElement = document.getElementById('resultCount');
        if (resultCountElement) {
            if (count === this.data.sites.length || this.data.sites.length === 0) {
                resultCountElement.textContent = `Showing all ${this.data.sites.length} Connect+ sites`;
            } else {
                resultCountElement.textContent = `Found ${count} of ${this.data.sites.length} Connect+ sites`;
            }
        }
    },
    
    updateDataStatus(status) {
        const dataStatusElement = document.getElementById('dataStatus');
        if (dataStatusElement) dataStatusElement.textContent = status;
    },
    
    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) loadingIndicator.style.display = show ? 'block' : 'none';
    },
    
    showErrorMessage(message) {
        const errorText = document.getElementById('errorText');
        const errorMessage = document.getElementById('searchErrorMessage');
        if (errorText && errorMessage) {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
        }
    },
    
    showSuccessMessage(message) {
        const successText = document.getElementById('successText');
        const successMessage = document.getElementById('successMessage');
        if (successText && successMessage) {
            successText.textContent = message;
            successMessage.style.display = 'block';
            setTimeout(() => { successMessage.style.display = 'none'; }, 5000);
        }
    },
    
    hideMessages() {
        const errorMessage = document.getElementById('searchErrorMessage');
        const successMessage = document.getElementById('successMessage');
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';
    },
    
    exportToCSV() {
        if (this.data.filteredData.length === 0) {
            alert('No data to export.'); return;
        }
        
        const headers = this.data.sheetHeaders.length > 0 ? this.data.sheetHeaders : 
            ['Site Name', 'Site URL', 'Site Owner', 'Department', 'Purpose', 'Status', 'Access Level'];
        
        const csvContent = [
            headers.join(','),
            ...this.data.filteredData.map(row => {
                return headers.map(header => {
                    const value = row[header] || '';
                    const escaped = value.toString().replace(/"/g, '""');
                    return escaped.includes(',') ? `"${escaped}"` : escaped;
                }).join(',');
            })
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `connect_sites_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage(`Exported ${this.data.filteredData.length} Connect+ sites to CSV`);
    },
    
    loadSampleData() {
        this.data.sheetHeaders = ['Site Name', 'Site URL', 'Site Owner', 'Department', 'Purpose', 'Status', 'Access Level'];
        this.data.sites = [
            { 'Site Name': 'Marketing Team Site', 'Site URL': 'https://company.sharepoint.com/sites/marketing', 'Site Owner': 'John Smith', 'Department': 'Marketing', 'Purpose': 'Marketing campaigns', 'Status': 'Active', 'Access Level': 'Private' },
            { 'Site Name': 'Engineering Hub', 'Site URL': 'https://company.sharepoint.com/sites/engineering', 'Site Owner': 'Sarah Johnson', 'Department': 'Engineering', 'Purpose': 'Technical documentation', 'Status': 'Active', 'Access Level': 'Private' },
            { 'Site Name': 'HR Policies', 'Site URL': 'https://company.sharepoint.com/sites/hr-policies', 'Site Owner': 'Michael Brown', 'Department': 'Human Resources', 'Purpose': 'HR policies', 'Status': 'Active', 'Access Level': 'Public' }
        ];
        this.data.filteredData = [...this.data.sites];
        this.updateDataStatus('Using sample data (3 records)');
        this.updateStats();
        this.displayResults();
    }
};

// Register the Connect+ Sites page
PageManager.registerPage('connectsites', ConnectSitesPage);