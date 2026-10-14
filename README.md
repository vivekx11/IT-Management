# IT Management Dashboard

A modern, feature-rich IT inventory management system with **automatic CSV file saving**.

## 🌟 Features

- ✅ **Auto-Save to CSV** - All changes are automatically saved to the CSV file
- 🔍 **Real-time Search** - Search across all fields with highlighting
- 📊 **Dashboard Analytics** - Visual statistics and insights
- ✏️ **Edit/Add/Delete** - Full CRUD operations
- 💾 **Automatic Backups** - Every save creates a timestamped backup
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations

## 🚀 Quick Start

### Prerequisites
- Node.js installed on your system ([Download here](https://nodejs.org/))

### Installation & Running

**Option 1: Double-click the batch file**
1. Double-click `START_SERVER.bat`
2. Wait for the server to start
3. Open your browser to: `http://localhost:3000`

**Option 2: Manual start**
1. Open Command Prompt in this folder
2. Run: `npm install`
3. Run: `npm start`
4. Open your browser to: `http://localhost:3000`

## 📖 How to Use

### Starting the Application
1. Start the server using one of the methods above
2. Open `http://localhost:3000` in your web browser
3. The dashboard will load automatically with your CSV data

### Making Changes
- **Add New Entry**: Click "Add New Entry" button or use Quick Actions
- **Edit Entry**: Click the "Edit" button on any row
- **Delete Entry**: Click the "Delete" button on any row
- **Search**: Type in the search bar to filter results

### Auto-Save Behavior
- ✅ **Every edit is automatically saved** to the CSV file
- ✅ **Every delete is automatically saved** to the CSV file
- ✅ **Every add is automatically saved** to the CSV file
- ✅ **Automatic backups** are created before each save
- ⚠️ No need to click "Save" - it's all automatic!

### Export vs Save
- **Export Button** (Download icon): Downloads a copy of the data as a new CSV file
- **Auto-Save**: Automatically updates the original CSV file in real-time

## 📁 File Structure

```
IT/
├── index.html                                    # Main dashboard page
├── styles.css                                    # Styling
├── script.js                                     # Frontend logic
├── server.js                                     # Backend server (handles file saving)
├── package.json                                  # Dependencies
├── employee_pc_inventory_100_sample_data.csv    # Your data file
├── backup_*.csv                                  # Automatic backups
├── START_SERVER.bat                             # Easy startup script
└── README.md                                     # This file
```

## 🔧 Configuration

### Change Port Number
Edit `server.js`, line 7:
```javascript
const PORT = 3000; // Change to your preferred port
```

### Disable Auto-Save
In the Settings view, toggle "Auto-save changes" off

## 🆘 Troubleshooting

### Server won't start
- Make sure Node.js is installed: `node --version`
- Try deleting `node_modules` folder and run `npm install` again

### Changes not saving
- Check if the server is running (terminal should show "Server Running!")
- Check browser console (F12) for error messages
- Make sure the CSV file is not open in Excel

### Can't access dashboard
- Make sure you're using `http://localhost:3000` (not just opening the HTML file)
- Check if another application is using port 3000

## 💡 Tips

1. **Always keep the server running** while using the dashboard
2. **Backups are created automatically** - check for `backup_*.csv` files
3. **Search is case-insensitive** - type anything to find it
4. **Press Ctrl+C** in the terminal to stop the server
5. **Close Excel** before making changes (Excel locks the file)

## 🔐 Security Note

This is designed for **local use only**. Do not expose the server to the internet without proper security measures.

## 📊 Data Format

The CSV file uses this format:
```
SrNo,Host Name,User Name,Model,SSD,RAM,Date
1,PC 1,Employee001,Dell OptiPlex 3080,256 GB,8 GB,2025-01-06
```

## 🎯 Navigation

- **Dashboard** - Overview with statistics and recent activity
- **Inventory** - Full table view with edit/delete capabilities
- **Analytics** - Visual breakdowns of models, storage, and RAM
- **Settings** - Configure auto-save and display options

---

**Made with ❤️ for efficient IT management**
