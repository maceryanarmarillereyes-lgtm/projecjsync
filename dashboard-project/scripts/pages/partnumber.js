// Part Number Page
const PartNumberPage = {
    // Page configuration
    config: {
        id: 'partnumber',
        title: 'Part Number'
    },
    
    // Data storage
    data: {
        partNumbers: [],
        sheetHeaders: [],
        filteredData: [],
        currentSortColumn: null,
        currentSortDirection: 'asc',
        currentPage: 1,
        itemsPerPage: 25
    },
    
    // CORS Proxies
    corsProxies: [
        'https://api.allorigins.win/raw?url=',
        'https://corsproxy.io/?',
        'https://api.codetabs.com/v1/proxy?quest='
    ],
    
    // Render the page
    render: function() {
        return `
            <div class="page-container active" id="partnumber-page">
                <div class="scheduling-section">
                    <h2 class="scheduling-title">Part Number Search</h2>
                </div>
                
                <!-- Search Controls -->
                <div class="search-controls">
                    <div class="search-container">
                        <input type="text" id="partNumberSearch" class="case-input" 
                               placeholder="Search part numbers, descriptions, or any keyword...">
                        <button class="apply-btn" id="searchBtn">Search</button>
                        <button class="clear-btn" id="clearBtn">Clear</button>
                        <button class="export-btn" id="exportBtn">Export CSV</button>
                    </div>
                    
                    <div class="search-options">
                        <div class="search-option">
                            <label for="searchColumn">Search in:</label>
                            <select id="searchColumn">
                                <option value="all">All Columns</option>
                                <option value="Part Number">Part Number</option>
                                <option value="Description">Description</option>
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
                        <span id="resultCount">Search for part numbers...</span>
                        <span id="dataStatus" style="font-style: italic;">Not loaded yet</span>
                    </div>
                </div>
                
                <!-- Status Messages -->
                <div id="loadingIndicator" class="status-message loading-message">
                    <i class="fas fa-spinner fa-spin"></i> Loading part number data from Google Sheets...
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
                
                <!-- Results Table Section -->
                <div class="tech-record-section">
                    <h2 class="tech-record-title">Part Number Database</h2>
                    
                    <div class="table-container">
                        <table class="part-number-table" id="partNumberTable">
                            <thead id="tableHeaders">
                                <!-- Headers will be dynamically added -->
                            </thead>
                            <tbody id="partNumberResults">
                                <!-- Results will appear here -->
                                <tr>
                                    <td colspan="10" class="no-results">
                                        <i class="fas fa-search"></i>
                                        Enter a search term above to find part numbers
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    
                    <!-- No Results Message -->
                    <div id="noResultsMessage" class="no-results" style="display: none;">
                        <i class="fas fa-database"></i>
                        No matching part numbers found. Try a different search term.
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
    
    // Initialize the page
    init: function() {
        this.setupEventListeners();
        this.loadPartNumberData();
    },
    
    // Setup event listeners
    setupEventListeners: function() {
        // Search button
        document.getElementById('searchBtn')?.addEventListener('click', () => this.search());
        
        // Clear button
        document.getElementById('clearBtn')?.addEventListener('click', () => this.clearSearch());
        
        // Export button
        document.getElementById('exportBtn')?.addEventListener('click', () => this.exportToCSV());
        
        // Refresh button
        document.getElementById('refreshBtn')?.addEventListener('click', () => this.loadPartNumberData());
        
        // Search on Enter
        document.getElementById('partNumberSearch')?.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.search();
        });
        
        // Pagination
        document.getElementById('firstPage')?.addEventListener('click', () => this.goToFirstPage());
        document.getElementById('prevPage')?.addEventListener('click', () => this.goToPrevPage());
        document.getElementById('nextPage')?.addEventListener('click', () => this.goToNextPage());
        document.getElementById('lastPage')?.addEventListener('click', () => this.goToLastPage());
        
        // Results per page change
        document.getElementById('resultsPerPage')?.addEventListener('change', (e) => {
            this.data.itemsPerPage = parseInt(e.target.value);
            this.data.currentPage = 1;
            this.displayResults();
        });
    },
    
    // Load data from Google Sheets
    async loadPartNumberData() {
        this.showLoading(true);
        this.hideMessages();
        
        // Google Sheets URL
        const sheetsURL = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTI_dFlSCQPrUJu0bNi4O-G2Lev7G-r5iyUpMo0o2gJmfJVok3dyBpx8XigVeSwl-UORbr6a0J1HIH3/pub?gid=1904632957&single=true&output=csv';
        
        // Add timestamp to prevent caching
        const url = sheetsURL + '&t=' + new Date().getTime();
        
        try {
            // Try multiple methods to fetch data
            let csvText = await this.fetchWithRetry(url);
            
            if (csvText) {
                // Parse CSV
                const parsedData = this.parseCSV(csvText);
                this.data.partNumbers = parsedData.data;
                this.data.sheetHeaders = parsedData.headers;
                this.data.filteredData = [...this.data.partNumbers];
                
                // Update status
                this.updateDataStatus(`Loaded ${this.data.partNumbers.length} part numbers`);
                this.showSuccessMessage(`Successfully loaded ${this.data.partNumbers.length} part numbers from Google Sheets`);
                
                // Display results
                this.displayResults();
            } else {
                throw new Error('All fetch methods failed');
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showErrorMessage('Error loading data from Google Sheets. Using sample data instead.');
            this.updateDataStatus('Using sample data');
            this.loadSampleData();
        } finally {
            this.showLoading(false);
        }
    },
    
    // Fetch with retry using multiple methods
    async fetchWithRetry(url) {
        // Try direct fetch first
        try {
            const response = await fetch(url, { 
                mode: 'cors',
                cache: 'no-cache'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            return await response.text();
        } catch (error) {
            console.log('Direct fetch failed, trying CORS proxies...');
            
            // Try CORS proxies
            for (const proxy of this.corsProxies) {
                try {
                    const proxyUrl = proxy + encodeURIComponent(url);
                    const response = await fetch(proxyUrl, {
                        mode: 'cors',
                        cache: 'no-cache'
                    });
                    
                    if (!response.ok) {
                        throw new Error(`Proxy HTTP error! status: ${response.status}`);
                    }
                    
                    return await response.text();
                } catch (proxyError) {
                    console.log(`Proxy ${proxy} failed:`, proxyError);
                    continue;
                }
            }
            
            // If all proxies fail, try alternative method
            try {
                // Alternative: Use no-cors mode and iframe
                return await this.fetchAlternative(url);
            } catch (altError) {
                console.log('Alternative method failed:', altError);
                throw new Error('All fetch methods failed');
            }
        }
    },
    
    // Alternative fetch method
    async fetchAlternative(url) {
        return new Promise((resolve, reject) => {
            // Create iframe to bypass CORS
            const iframe = document.createElement('iframe');
            iframe.style.display = 'none';
            iframe.src = url;
            
            iframe.onload = () => {
                try {
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    const text = iframeDoc.body.innerText;
                    document.body.removeChild(iframe);
                    resolve(text);
                } catch (error) {
                    document.body.removeChild(iframe);
                    reject(error);
                }
            };
            
            iframe.onerror = () => {
                document.body.removeChild(iframe);
                reject(new Error('Iframe load failed'));
            };
            
            document.body.appendChild(iframe);
        });
    },
    
    // Parse CSV data
    parseCSV(csvText) {
        // Clean up the CSV text
        csvText = csvText.trim();
        
        // Split into lines and filter out empty lines
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
            return { headers: [], data: [] };
        }
        
        // Parse headers (first line)
        const headers = this.parseCSVLine(lines[0]);
        
        // Parse data rows
        const data = [];
        
        for (let i = 1; i < lines.length; i++) {
            const row = this.parseCSVLine(lines[i]);
            
            // Skip empty rows
            if (row.length === 0 || (row.length === 1 && row[0] === '')) {
                continue;
            }
            
            // Create object from row
            const rowObj = {};
            headers.forEach((header, index) => {
                const headerName = header || `Column ${index + 1}`;
                rowObj[headerName] = row[index] || '';
            });
            
            data.push(rowObj);
        }
        
        return { headers, data };
    },
    
    // Parse a single CSV line
    parseCSVLine(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = line[i + 1];
            
            if (char === '"' && inQuotes && nextChar === '"') {
                // Escaped quote
                current += '"';
                i++; // Skip next character
            } else if (char === '"') {
                // Start or end of quoted field
                inQuotes = !inQuotes;
            } else if (char === ',' && !inQuotes) {
                // End of field
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add the last field
        result.push(current.trim());
        
        // Remove quotes from quoted fields
        return result.map(field => {
            if (field.startsWith('"') && field.endsWith('"')) {
                return field.slice(1, -1);
            }
            return field;
        });
    },
    
    // Search function
    search() {
        const searchTerm = document.getElementById('partNumberSearch').value.toLowerCase();
        const searchColumn = document.getElementById('searchColumn').value;
        
        if (!searchTerm.trim()) {
            this.data.filteredData = [...this.data.partNumbers];
        } else {
            this.data.filteredData = this.data.partNumbers.filter(row => {
                if (searchColumn === 'all') {
                    // Search across all columns
                    return Object.values(row).some(value => 
                        value && value.toString().toLowerCase().includes(searchTerm)
                    );
                } else {
                    // Search in specific column
                    const columnValue = row[searchColumn];
                    return columnValue && columnValue.toString().toLowerCase().includes(searchTerm);
                }
            });
        }
        
        this.data.currentPage = 1;
        this.displayResults();
    },
    
    // Clear search
    clearSearch() {
        document.getElementById('partNumberSearch').value = '';
        this.data.filteredData = [...this.data.partNumbers];
        this.data.currentPage = 1;
        this.displayResults();
    },
    
    // Display results
    displayResults() {
        const tableBody = document.getElementById('partNumberResults');
        const tableHeaders = document.getElementById('tableHeaders');
        const noResultsMessage = document.getElementById('noResultsMessage');
        
        if (this.data.filteredData.length === 0) {
            noResultsMessage.style.display = 'block';
            tableBody.innerHTML = '';
            this.updateResultCount(0);
            this.updatePagination();
            return;
        }
        
        noResultsMessage.style.display = 'none';
        
        // Update headers if needed
        if (tableHeaders.children.length === 0 && this.data.sheetHeaders.length > 0) {
            tableHeaders.innerHTML = '';
            this.data.sheetHeaders.forEach(header => {
                const th = document.createElement('th');
                th.textContent = header;
                th.dataset.column = header;
                
                // Add sort functionality
                th.style.cursor = 'pointer';
                th.addEventListener('click', () => {
                    this.sortByColumn(header);
                });
                
                tableHeaders.appendChild(th);
            });
        }
        
        // Calculate pagination
        const totalPages = Math.ceil(this.data.filteredData.length / this.data.itemsPerPage);
        const startIndex = (this.data.currentPage - 1) * this.data.itemsPerPage;
        const endIndex = Math.min(startIndex + this.data.itemsPerPage, this.data.filteredData.length);
        const pageData = this.data.filteredData.slice(startIndex, endIndex);
        
        // Get search term for highlighting
        const searchTerm = document.getElementById('partNumberSearch').value.toLowerCase();
        
        // Update table body
        tableBody.innerHTML = pageData.map((row, rowIndex) => {
            return `
                <tr ${rowIndex % 2 === 0 ? 'style="background-color: #f8f9fa;"' : ''}>
                    ${this.data.sheetHeaders.map(header => {
                        let cellValue = row[header] || '';
                        let cellContent = cellValue;
                        
                        // Highlight search term if present
                        if (searchTerm && cellValue.toLowerCase().includes(searchTerm)) {
                            const regex = new RegExp(`(${searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
                            cellContent = cellValue.replace(regex, '<span class="highlight">$1</span>');
                        }
                        
                        // Style based on column type
                        let cellClass = '';
                        if (header.toLowerCase().includes('part') || header.toLowerCase().includes('number')) {
                            cellClass = 'part-number-cell';
                        } else if (header.toLowerCase().includes('desc')) {
                            cellClass = 'description-cell';
                        }
                        
                        return `<td class="${cellClass}">${cellContent}</td>`;
                    }).join('')}
                </tr>
            `;
        }).join('');
        
        // Update counts
        this.updateResultCount(this.data.filteredData.length);
        document.getElementById('displayCount').textContent = 
            `Showing ${startIndex + 1}-${endIndex} of ${this.data.filteredData.length} results`;
        
        // Update pagination
        this.updatePagination();
    },
    
    // Sort by column
    sortByColumn(column) {
        if (this.data.currentSortColumn === column) {
            // Toggle direction
            this.data.currentSortDirection = this.data.currentSortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            // New column, default to ascending
            this.data.currentSortColumn = column;
            this.data.currentSortDirection = 'asc';
        }
        
        // Sort the data
        this.data.filteredData.sort((a, b) => {
            const aValue = a[column] || '';
            const bValue = b[column] || '';
            
            // Try numeric comparison
            const aNum = parseFloat(aValue);
            const bNum = parseFloat(bValue);
            
            if (!isNaN(aNum) && !isNaN(bNum)) {
                return this.data.currentSortDirection === 'asc' ? aNum - bNum : bNum - aNum;
            }
            
            // String comparison
            const aStr = aValue.toString().toLowerCase();
            const bStr = bValue.toString().toLowerCase();
            
            if (aStr < bStr) return this.data.currentSortDirection === 'asc' ? -1 : 1;
            if (aStr > bStr) return this.data.currentSortDirection === 'asc' ? 1 : -1;
            return 0;
        });
        
        // Update display
        this.displayResults();
        
        // Update sort indicators in headers
        const headers = document.querySelectorAll('#tableHeaders th');
        headers.forEach(th => {
            const thColumn = th.dataset.column;
            if (thColumn === column) {
                th.innerHTML = `${thColumn} <span class="sort-indicator">${this.data.currentSortDirection === 'asc' ? '↑' : '↓'}</span>`;
            } else {
                th.textContent = thColumn;
            }
        });
    },
    
    // Pagination functions
    goToFirstPage() {
        if (this.data.currentPage > 1) {
            this.data.currentPage = 1;
            this.displayResults();
        }
    },
    
    goToPrevPage() {
        if (this.data.currentPage > 1) {
            this.data.currentPage--;
            this.displayResults();
        }
    },
    
    goToNextPage() {
        const totalPages = Math.ceil(this.data.filteredData.length / this.data.itemsPerPage);
        if (this.data.currentPage < totalPages) {
            this.data.currentPage++;
            this.displayResults();
        }
    },
    
    goToLastPage() {
        const totalPages = Math.ceil(this.data.filteredData.length / this.data.itemsPerPage);
        if (this.data.currentPage < totalPages) {
            this.data.currentPage = totalPages;
            this.displayResults();
        }
    },
    
    // Update pagination controls
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
    
    // Update result count
    updateResultCount(count) {
        const resultCountElement = document.getElementById('resultCount');
        if (resultCountElement) {
            if (count === this.data.partNumbers.length || this.data.partNumbers.length === 0) {
                resultCountElement.textContent = `Showing all ${this.data.partNumbers.length} part numbers`;
            } else {
                resultCountElement.textContent = `Found ${count} of ${this.data.partNumbers.length} part numbers`;
            }
        }
    },
    
    // Update data status
    updateDataStatus(status) {
        const dataStatusElement = document.getElementById('dataStatus');
        if (dataStatusElement) {
            dataStatusElement.textContent = status;
        }
    },
    
    // Show/hide loading
    showLoading(show) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = show ? 'block' : 'none';
        }
    },
    
    // Show error message
    showErrorMessage(message) {
        const errorText = document.getElementById('errorText');
        const errorMessage = document.getElementById('searchErrorMessage');
        if (errorText && errorMessage) {
            errorText.textContent = message;
            errorMessage.style.display = 'block';
        }
    },
    
    // Show success message
    showSuccessMessage(message) {
        const successText = document.getElementById('successText');
        const successMessage = document.getElementById('successMessage');
        if (successText && successMessage) {
            successText.textContent = message;
            successMessage.style.display = 'block';
            setTimeout(() => {
                successMessage.style.display = 'none';
            }, 5000);
        }
    },
    
    // Hide all messages
    hideMessages() {
        const errorMessage = document.getElementById('searchErrorMessage');
        const successMessage = document.getElementById('successMessage');
        if (errorMessage) errorMessage.style.display = 'none';
        if (successMessage) successMessage.style.display = 'none';
    },
    
    // Export to CSV
    exportToCSV() {
        if (this.data.filteredData.length === 0) {
            alert('No data to export.');
            return;
        }
        
        const headers = this.data.sheetHeaders.join(',');
        const rows = this.data.filteredData.map(row => {
            return this.data.sheetHeaders.map(header => {
                const value = row[header] || '';
                // Escape quotes and wrap in quotes if contains comma
                const escaped = value.toString().replace(/"/g, '""');
                return escaped.includes(',') ? `"${escaped}"` : escaped;
            }).join(',');
        });
        
        const csvContent = [headers, ...rows].join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `part_numbers_${new Date().toISOString().slice(0, 10)}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showSuccessMessage(`Exported ${this.data.filteredData.length} part numbers to CSV`);
    },
    
    // Load sample data
    loadSampleData() {
        this.data.sheetHeaders = ['Part Number', 'Description', 'Category', 'Price', 'Stock', 'Supplier', 'Lead Time', 'Last Updated'];
        this.data.partNumbers = [
            { 'Part Number': 'PN-001', 'Description': 'Air Filter Element', 'Category': 'Filters', 'Price': '$12.50', 'Stock': '45', 'Supplier': 'AirTech Supplies', 'Lead Time': '3 days', 'Last Updated': '2025-08-01' },
            { 'Part Number': 'PN-002', 'Description': 'Oil Pressure Sensor', 'Category': 'Sensors', 'Price': '$28.75', 'Stock': '12', 'Supplier': 'SensorCorp', 'Lead Time': '5 days', 'Last Updated': '2025-08-02' },
            { 'Part Number': 'PN-003', 'Description': 'Coolant Temperature Sensor', 'Category': 'Sensors', 'Price': '$32.99', 'Stock': '8', 'Supplier': 'SensorCorp', 'Lead Time': '5 days', 'Last Updated': '2025-08-01' },
            { 'Part Number': 'PN-004', 'Description': 'Turbocharger Gasket Set', 'Category': 'Gaskets', 'Price': '$45.25', 'Stock': '25', 'Supplier': 'TurboParts Inc', 'Lead Time': '7 days', 'Last Updated': '2025-07-30' },
            { 'Part Number': 'PN-005', 'Description': 'Fuel Injector Nozzle', 'Category': 'Fuel System', 'Price': '$89.99', 'Stock': '6', 'Supplier': 'FuelTech', 'Lead Time': '10 days', 'Last Updated': '2025-07-29' },
            { 'Part Number': 'PN-006', 'Description': 'Ignition Coil Pack', 'Category': 'Ignition', 'Price': '$67.50', 'Stock': '18', 'Supplier': 'SparkTech', 'Lead Time': '4 days', 'Last Updated': '2025-08-03' },
            { 'Part Number': 'PN-007', 'Description': 'Brake Caliper Piston', 'Category': 'Brakes', 'Price': '$24.95', 'Stock': '32', 'Supplier': 'BrakeMasters', 'Lead Time': '2 days', 'Last Updated': '2025-08-02' },
            { 'Part Number': 'PN-008', 'Description': 'Wheel Bearing Kit', 'Category': 'Suspension', 'Price': '$56.80', 'Stock': '15', 'Supplier': 'Suspension Pro', 'Lead Time': '6 days', 'Last Updated': '2025-07-31' },
            { 'Part Number': 'PN-009', 'Description': 'Radiator Hose Upper', 'Category': 'Cooling', 'Price': '$18.25', 'Stock': '22', 'Supplier': 'Cooling Systems', 'Lead Time': '3 days', 'Last Updated': '2025-08-01' },
            { 'Part Number': 'PN-010', 'Description': 'Alternator Bracket', 'Category': 'Electrical', 'Price': '$34.99', 'Stock': '9', 'Supplier': 'ElectroParts', 'Lead Time': '5 days', 'Last Updated': '2025-07-30' }
        ];
        this.data.filteredData = [...this.data.partNumbers];
        this.updateDataStatus('Using sample data (10 records)');
        this.displayResults();
    }
};

// Register the part number page
PageManager.registerPage('partnumber', PartNumberPage);