// Global variables
let inventoryData = [];
let filteredData = [];
let currentView = 'dashboard';
const API_BASE_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api`;
let isAuthenticated = false;

// Initialize app on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
});

// Check authentication on page load
function checkAuthentication() {
    const savedAuth = sessionStorage.getItem('authenticated');
    
    if (savedAuth === 'true') {
        isAuthenticated = true;
        loadCSVData();
        initializeEventListeners();
    } else {
        showPasswordPrompt();
    }
}

// Show password prompt
function showPasswordPrompt() {
    const password = prompt('🔐 Enter password to access the dashboard:');
    
    if (!password) {
        alert('❌ Password required to access the dashboard!');
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:white;font-size:24px;">Access Denied - Password Required</div>';
        return;
    }

    verifyPassword(password);
}

// Verify password
async function verifyPassword(password) {
    try {
        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        });
        
        const result = await response.json();
        
        if (result.success) {
            isAuthenticated = true;
            sessionStorage.setItem('authenticated', 'true');
            loadCSVData();
            initializeEventListeners();
            showToast('✅ Authentication successful!', 'success');
        } else {
            alert('❌ Incorrect password! Please try again.');
            showPasswordPrompt();
        }
    } catch (error) {
        console.error('Error verifying password:', error);
        alert('❌ Error connecting to server. Make sure the server is running!');
        document.body.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:100vh;color:white;font-size:24px;">Server Connection Error</div>';
    }
}

// Load CSV data
async function loadCSVData() {
    try {
        const response = await fetch(`${API_BASE_URL}/data`);
        const result = await response.json();
        
        if (result.success) {
            inventoryData = parseCSV(result.data);
            filteredData = []; // Start with empty filtered data
            updateDashboard();
            renderTable();
            renderAnalytics();
            showToast('Data loaded successfully!', 'success');
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error loading CSV:', error);
        showToast('Error loading data. Make sure the server is running!', 'error');
    }
}

// Parse CSV text to array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const data = [];

    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',');
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((header, index) => {
                row[header.trim()] = values[index].trim();
            });
            data.push(row);
        }
    }

    return data;
}

// Convert data to CSV format
function dataToCSV(data) {
    if (data.length === 0) return '';
    
    const headers = Object.keys(data[0]);
    const csvRows = [headers.join(',')];
    
    data.forEach(row => {
        const values = headers.map(header => row[header]);
        csvRows.push(values.join(','));
    });
    
    return csvRows.join('\n');
}

// Save data to CSV file on server (NO BACKUP)
async function saveToCSV() {
    try {
        const csvContent = dataToCSV(inventoryData);
        
        const response = await fetch(`${API_BASE_URL}/data`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ data: csvContent })
        });
        
        const result = await response.json();
        
        if (result.success) {
            showToast('✅ Changes saved to CSV file!', 'success');
            return true;
        } else {
            throw new Error(result.error);
        }
    } catch (error) {
        console.error('Error saving CSV:', error);
        showToast('❌ Failed to save. Make sure the server is running!', 'error');
        return false;
    }
}

// Export/Download CSV file
function exportCSV() {
    const csvContent = dataToCSV(inventoryData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `IT_Inventory_Export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    showToast('Data exported successfully!', 'success');
}

// Initialize event listeners
function initializeEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const view = e.currentTarget.dataset.view;
            switchView(view);
        });
    });

    // Search
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');
    
    searchInput.addEventListener('input', (e) => {
        handleSearch(e.target.value);
        clearSearch.style.display = e.target.value ? 'block' : 'none';
    });

    clearSearch.addEventListener('click', () => {
        searchInput.value = '';
        handleSearch('');
        clearSearch.style.display = 'none';
    });

    // Export/Import
    document.getElementById('exportBtn').addEventListener('click', exportCSV);
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('fileInput').click();
    });

    document.getElementById('fileInput').addEventListener('change', handleFileImport);

    // Quick actions
    document.getElementById('addNewBtn').addEventListener('click', () => openModal('add'));
    document.getElementById('viewInventoryBtn').addEventListener('click', () => switchView('inventory'));
    document.getElementById('generateReportBtn').addEventListener('click', generateReport);

    // Inventory buttons
    document.getElementById('addRowBtn').addEventListener('click', () => openModal('add'));

    // Modal
    document.getElementById('modalClose').addEventListener('click', closeModal);
    document.getElementById('cancelBtn').addEventListener('click', closeModal);
    document.getElementById('editForm').addEventListener('submit', handleFormSubmit);

    // Close modal on outside click
    document.getElementById('modal').addEventListener('click', (e) => {
        if (e.target.id === 'modal') closeModal();
    });
}

// Switch between views
function switchView(view) {
    currentView = view;
    
    // Update nav links
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.dataset.view === view) {
            link.classList.add('active');
        }
    });

    // Update view containers
    document.querySelectorAll('.view-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(`${view}View`).classList.add('active');

    // Update content based on view
    if (view === 'inventory') {
        renderTable();
    } else if (view === 'analytics') {
        renderAnalytics();
    }
}

// Update dashboard statistics
function updateDashboard() {
    // Total PCs
    document.getElementById('totalPCs').textContent = inventoryData.length;

    // Total Employees (assuming unique users)
    const uniqueEmployees = new Set(inventoryData.map(item => item['User Name'])).size;
    document.getElementById('totalEmployees').textContent = uniqueEmployees;

    // Average Storage
    const avgStorage = inventoryData.reduce((sum, item) => {
        const storage = parseInt(item.SSD);
        return sum + storage;
    }, 0) / inventoryData.length;
    document.getElementById('avgStorage').textContent = Math.round(avgStorage) + ' GB';

    // Average RAM
    const avgRAM = inventoryData.reduce((sum, item) => {
        const ram = parseInt(item.RAM);
        return sum + ram;
    }, 0) / inventoryData.length;
    document.getElementById('avgRAM').textContent = Math.round(avgRAM) + ' GB';

    // Recent activity (last 5 entries)
    const recentData = [...inventoryData].slice(-5).reverse();
    const recentHTML = recentData.map(item => `
        <div class="recent-item">
            <div class="recent-info">
                <div class="recent-name">${item['Host Name']} - ${item['User Name']}</div>
                <div class="recent-details">${item.Model} | ${item.SSD} SSD | ${item.RAM} RAM</div>
            </div>
            <div class="recent-date">${item.Date}</div>
        </div>
    `).join('');
    document.getElementById('recentActivity').innerHTML = recentHTML;
}

// Render inventory table
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    
    // Determine which data to display
    let displayData;
    if (filteredData.length > 0) {
        displayData = filteredData;
    } else if (document.getElementById('searchInput').value.trim() !== '') {
        // If there's a search query but no results, show empty
        displayData = [];
    } else {
        // No search query, show all data
        displayData = inventoryData;
    }

    if (displayData.length === 0 && document.getElementById('searchInput').value.trim() !== '') {
        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                    <i class="fas fa-search" style="font-size: 2rem; margin-bottom: 0.5rem;"></i>
                    <div>No results found for your search query.</div>
                </td>
            </tr>
        `;
        return;
    }

    const html = displayData.map((item, index) => {
        const actualIndex = inventoryData.findIndex(d => d.SrNo === item.SrNo);
        return `
        <tr data-index="${actualIndex}" data-srno="${item.SrNo}">
            <td>${item.SrNo}</td>
            <td>${item['Host Name']}</td>
            <td>${item['User Name']}</td>
            <td>${item.Model}</td>
            <td>${item.SSD}</td>
            <td>${item.RAM}</td>
            <td>${item.Date}</td>
            <td>
                <div class="action-buttons-cell">
                    <button class="btn-edit" onclick="editRow(${actualIndex})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete" onclick="deleteRow(${actualIndex})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </td>
        </tr>
    `}).join('');

    tableBody.innerHTML = html;
}

// Handle search
function handleSearch(query) {
    const searchInfo = document.getElementById('searchInfo');
    
    if (!query.trim()) {
        filteredData = [];
        searchInfo.textContent = '';
        renderTable();
        return;
    }

    const lowerQuery = query.toLowerCase();
    filteredData = inventoryData.filter(item => {
        return Object.values(item).some(value => 
            value.toString().toLowerCase().includes(lowerQuery)
        );
    });

    searchInfo.textContent = `Found ${filteredData.length} result(s) for "${query}"`;
    renderTable();

    // Highlight matching text after a short delay to ensure DOM is updated
    setTimeout(() => {
        if (document.getElementById('highlightSearch').checked) {
            highlightSearchResults(query);
        }
    }, 100);
}

// Highlight search results
function highlightSearchResults(query) {
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');
    
    if (rows.length === 0 || !query) return;
    
    rows.forEach(row => {
        // Skip the "no results" row
        if (row.querySelector('[colspan]')) return;
        
        row.classList.add('highlight');
        const cells = row.querySelectorAll('td');
        
        cells.forEach((cell, cellIndex) => {
            // Skip the actions column (last column)
            if (cellIndex === cells.length - 1) return;
            
            const originalText = cell.textContent.trim();
            const lowerText = originalText.toLowerCase();
            const lowerQuery = query.toLowerCase();
            
            if (lowerText.includes(lowerQuery)) {
                const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
                const highlightedText = originalText.replace(regex, '<span class="highlight-text">$1</span>');
                cell.innerHTML = highlightedText;
            }
        });
    });

    // Remove highlight after animation
    setTimeout(() => {
        rows.forEach(row => row.classList.remove('highlight'));
    }, 2000);
}

// Helper function to escape special regex characters
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Open modal for add/edit
function openModal(mode, data = null) {
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('editForm');

    modal.classList.add('active');
    form.reset();

    if (mode === 'add') {
        modalTitle.textContent = 'Add New Entry';
        document.getElementById('editIndex').value = '';
        document.getElementById('editSrNo').value = inventoryData.length + 1;
        document.getElementById('editDate').value = new Date().toISOString().split('T')[0];
    } else if (mode === 'edit' && data) {
        modalTitle.textContent = 'Edit Entry';
        document.getElementById('editIndex').value = data.index;
        document.getElementById('editSrNo').value = data.SrNo;
        document.getElementById('editHostName').value = data['Host Name'];
        document.getElementById('editUserName').value = data['User Name'];
        document.getElementById('editModel').value = data.Model;
        document.getElementById('editSSD').value = data.SSD;
        document.getElementById('editRAM').value = data.RAM;
        document.getElementById('editDate').value = data.Date;
    }
}

// Close modal
function closeModal() {
    document.getElementById('modal').classList.remove('active');
}

// Handle form submit
async function handleFormSubmit(e) {
    e.preventDefault();

    const index = document.getElementById('editIndex').value;
    const newData = {
        'SrNo': document.getElementById('editSrNo').value,
        'Host Name': document.getElementById('editHostName').value,
        'User Name': document.getElementById('editUserName').value,
        'Model': document.getElementById('editModel').value,
        'SSD': document.getElementById('editSSD').value,
        'RAM': document.getElementById('editRAM').value,
        'Date': document.getElementById('editDate').value
    };

    if (index === '') {
        // Add new entry
        inventoryData.push(newData);
        showToast('New entry added successfully!', 'success');
    } else {
        // Update existing entry
        inventoryData[parseInt(index)] = newData;
        showToast('Entry updated successfully!', 'success');
    }

    // Auto-save to server
    const saved = await saveToCSV();
    if (!saved && !document.getElementById('autoSave').checked) {
        showToast('⚠️ Changes saved locally. Click Export to download backup.', 'warning');
    }

    closeModal();
    updateDashboard();
    renderTable();
    renderAnalytics();
}

// Edit row
function editRow(index) {
    const data = { ...inventoryData[index], index };
    openModal('edit', data);
}

// Delete row with password protection
async function deleteRow(index) {
    // Ask for password before deleting
    const password = prompt('🔐 Enter password to delete this entry:');
    
    if (!password) {
        showToast('❌ Delete cancelled - password required', 'warning');
        return;
    }

    // Verify password
    try {
        const response = await fetch(`${API_BASE_URL}/verify`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password })
        });
        
        const result = await response.json();
        
        if (!result.success) {
            showToast('❌ Incorrect password! Delete cancelled.', 'error');
            return;
        }
    } catch (error) {
        showToast('❌ Error verifying password', 'error');
        return;
    }

    // Password verified, proceed with deletion
    if (confirm('Are you sure you want to delete this entry?')) {
        inventoryData.splice(index, 1);
        
        // Renumber SrNo
        inventoryData.forEach((item, idx) => {
            item.SrNo = (idx + 1).toString();
        });

        showToast('Entry deleted successfully!', 'success');
        
        // Auto-save to server
        await saveToCSV();

        updateDashboard();
        renderTable();
        renderAnalytics();
    }
}

// Handle file import
function handleFileImport(e) {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const csvText = event.target.result;
            inventoryData = parseCSV(csvText);
            filteredData = [];
            
            // Clear search
            document.getElementById('searchInput').value = '';
            document.getElementById('clearSearch').style.display = 'none';
            document.getElementById('searchInfo').textContent = '';
            
            updateDashboard();
            renderTable();
            renderAnalytics();
            showToast('File imported successfully!', 'success');
        } catch (error) {
            showToast('Error importing file. Please check the format.', 'error');
        }
    };
    reader.readAsText(file);
}

// Generate report
function generateReport() {
    const report = {
        totalPCs: inventoryData.length,
        uniqueEmployees: new Set(inventoryData.map(item => item['User Name'])).size,
        modelBreakdown: {},
        storageBreakdown: {},
        ramBreakdown: {}
    };

    inventoryData.forEach(item => {
        // Model breakdown
        report.modelBreakdown[item.Model] = (report.modelBreakdown[item.Model] || 0) + 1;
        
        // Storage breakdown
        report.storageBreakdown[item.SSD] = (report.storageBreakdown[item.SSD] || 0) + 1;
        
        // RAM breakdown
        report.ramBreakdown[item.RAM] = (report.ramBreakdown[item.RAM] || 0) + 1;
    });

    const reportText = `
IT INVENTORY REPORT
Generated on: ${new Date().toLocaleDateString()}

SUMMARY:
- Total PCs: ${report.totalPCs}
- Total Employees: ${report.uniqueEmployees}

MODEL DISTRIBUTION:
${Object.entries(report.modelBreakdown).map(([model, count]) => `- ${model}: ${count}`).join('\n')}

STORAGE DISTRIBUTION:
${Object.entries(report.storageBreakdown).map(([storage, count]) => `- ${storage}: ${count}`).join('\n')}

RAM DISTRIBUTION:
${Object.entries(report.ramBreakdown).map(([ram, count]) => `- ${ram}: ${count}`).join('\n')}
    `;

    const blob = new Blob([reportText], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `IT_Inventory_Report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();

    showToast('Report generated successfully!', 'success');
}

// Render analytics
function renderAnalytics() {
    // Model Distribution
    const modelCount = {};
    inventoryData.forEach(item => {
        modelCount[item.Model] = (modelCount[item.Model] || 0) + 1;
    });

    const modelHTML = Object.entries(modelCount)
        .sort((a, b) => b[1] - a[1])
        .map(([model, count]) => `
            <div class="chart-item">
                <span class="chart-label">${model}</span>
                <span class="chart-value">${count} units</span>
            </div>
        `).join('');
    document.getElementById('modelDistribution').innerHTML = modelHTML;

    // Storage Analysis
    const storageCount = {};
    inventoryData.forEach(item => {
        storageCount[item.SSD] = (storageCount[item.SSD] || 0) + 1;
    });

    const storageHTML = Object.entries(storageCount)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([storage, count]) => `
            <div class="chart-item">
                <span class="chart-label">${storage}</span>
                <span class="chart-value">${count} units</span>
            </div>
        `).join('');
    document.getElementById('storageAnalysis').innerHTML = storageHTML;

    // RAM Distribution
    const ramCount = {};
    inventoryData.forEach(item => {
        ramCount[item.RAM] = (ramCount[item.RAM] || 0) + 1;
    });

    const ramHTML = Object.entries(ramCount)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([ram, count]) => `
            <div class="chart-item">
                <span class="chart-label">${ram}</span>
                <span class="chart-value">${count} units</span>
            </div>
        `).join('');
    document.getElementById('ramDistribution').innerHTML = ramHTML;

    // Monthly Additions
    const monthCount = {};
    inventoryData.forEach(item => {
        const month = item.Date.substring(0, 7); // YYYY-MM
        monthCount[month] = (monthCount[month] || 0) + 1;
    });

    const monthHTML = Object.entries(monthCount)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([month, count]) => `
            <div class="chart-item">
                <span class="chart-label">${month}</span>
                <span class="chart-value">${count} additions</span>
            </div>
        `).join('');
    document.getElementById('monthlyAdditions').innerHTML = monthHTML;
}

// Show toast notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast show ${type}`;

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}
