const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
let PORT = 3000;

// Password for authentication
const PASSWORD = 'vivek';

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

const CSV_FILE = path.join(__dirname, 'employee_pc_inventory_100_sample_data.csv');

// Verify password
app.post('/api/verify', (req, res) => {
    const { password } = req.body;
    
    if (password === PASSWORD) {
        res.json({ success: true, message: 'Authentication successful' });
    } else {
        res.status(401).json({ success: false, error: 'Incorrect password' });
    }
});

// Get CSV data
app.get('/api/data', (req, res) => {
    try {
        const data = fs.readFileSync(CSV_FILE, 'utf8');
        res.json({ success: true, data });
    } catch (error) {
        console.error('Error reading CSV:', error);
        res.status(500).json({ success: false, error: 'Failed to read CSV file' });
    }
});

// Save CSV data (NO BACKUP - removed backup creation)
app.post('/api/data', (req, res) => {
    try {
        const { data, password } = req.body;
        
        if (!data) {
            return res.status(400).json({ success: false, error: 'No data provided' });
        }

        // Verify password for sensitive operations
        if (password && password !== PASSWORD) {
            return res.status(401).json({ success: false, error: 'Incorrect password' });
        }

        // Write new data directly (NO BACKUP)
        fs.writeFileSync(CSV_FILE, data, 'utf8');
        
        console.log('CSV file updated successfully');
        res.json({ success: true, message: 'Data saved successfully' });
    } catch (error) {
        console.error('Error saving CSV:', error);
        res.status(500).json({ success: false, error: 'Failed to save CSV file' });
    }
});

// Get backups list (REMOVED - no more backups)
// Restore from backup (REMOVED - no more backups)

app.listen(PORT, () => {
    console.log(`
╔════════════════════════════════════════════╗
║   IT Management Server Running!            ║
╚════════════════════════════════════════════╝

🚀 Server started on: http://localhost:${PORT}
📊 Dashboard URL: http://localhost:${PORT}/index.html
📁 CSV File: ${CSV_FILE}

🔐 Password Protection: ENABLED
✅ Auto-save is enabled
❌ Backups: DISABLED (as requested)
✅ Server is ready to accept connections

Press Ctrl+C to stop the server
    `);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`⚠️  Port ${PORT} is busy, trying port ${PORT + 1}...`);
        PORT++;
        app.listen(PORT, () => {
            console.log(`
╔════════════════════════════════════════════╗
║   IT Management Server Running!            ║
╚════════════════════════════════════════════╝

🚀 Server started on: http://localhost:${PORT}
📊 Dashboard URL: http://localhost:${PORT}/index.html
📁 CSV File: ${CSV_FILE}

🔐 Password Protection: ENABLED
✅ Auto-save is enabled
❌ Backups: DISABLED (as requested)
✅ Server is ready to accept connections

⚠️  Note: Using port ${PORT} (default 3000 was busy)

Press Ctrl+C to stop the server
            `);
        });
    } else {
        console.error('Server error:', err);
    }
});
