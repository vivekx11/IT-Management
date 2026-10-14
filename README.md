# 🖥️ IT Management Dashboard

A modern, feature-rich IT inventory management system with **automatic CSV file saving** and **password protection**.

![Dashboard](https://img.shields.io/badge/Dashboard-IT%20Management-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## 🌟 Features

- 🔐 **Password Protection** - Dashboard access and delete operations require password
- ✅ **Auto-Save to CSV** - All changes are automatically saved to the CSV file
- 🔍 **Real-time Search** - Search across all fields with highlighting
- 📊 **Dashboard Analytics** - Visual statistics and insights
- ✏️ **Edit/Add/Delete** - Full CRUD operations
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Beautiful dark theme with smooth animations
- ❌ **No Backups** - Direct CSV updates without creating backup files

## 🎯 Live Demo

![IT Management Dashboard](https://via.placeholder.com/800x400/1a1d29/667eea?text=IT+Management+Dashboard)

## 🚀 Quick Start

### Prerequisites
- Node.js installed on your system ([Download here](https://nodejs.org/))
- Git (for cloning the repository)

### Installation

```bash
# Clone the repository
git clone https://github.com/vivekx11/IT-Management.git

# Navigate to the project directory
cd IT-Management

# Install dependencies
npm install

# Start the server
npm start
```

**Or use the batch file (Windows):**
- Double-click `START_SERVER.bat`

### Accessing the Dashboard

1. Open your browser to: `http://localhost:3000`
2. Enter password: **`vivek`**
3. Start managing your IT inventory!

## 🔐 Security

### Password Protection

- **Dashboard Access**: Password required on first load
- **Delete Operations**: Password required before deleting entries
- **Default Password**: `vivek` (can be changed in `server.js`)

### Changing the Password

Edit `server.js` line 8:
```javascript
const PASSWORD = 'vivek'; // Change to your desired password
```

## 📖 How to Use

### Starting the Application
1. Start the server using `npm start` or `START_SERVER.bat`
2. Open `http://localhost:3000` in your web browser
3. Enter password: **`vivek`**
4. The dashboard will load with your CSV data

### Making Changes
- **Add New Entry**: Click "Add New Entry" button or use Quick Actions
- **Edit Entry**: Click the "Edit" button on any row
- **Delete Entry**: Click the "Delete" button (password required)
- **Search**: Type in the search bar to filter results

### Auto-Save Behavior
- ✅ **Every edit is automatically saved** to the CSV file
- ✅ **Every delete is automatically saved** (after password verification)
- ✅ **Every add is automatically saved** to the CSV file
- ❌ **No backup files** are created
- ⚠️ No need to click "Save" - it's all automatic!

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: Node.js, Express.js
- **Database**: CSV file (simple and portable)
- **UI/UX**: Modern dark theme with gradients
- **Icons**: Font Awesome

## 📁 Project Structure

```
IT-Management/
├── index.html                    # Main dashboard page
├── styles.css                    # Styling and animations
├── script.js                     # Frontend logic and API calls
├── server.js                     # Backend server (Express)
├── package.json                  # Dependencies
├── employee_pc_inventory_100_sample_data.csv  # Data file
├── START_SERVER.bat             # Windows startup script
├── STOP_SERVER.bat              # Windows stop script
├── PASSWORD_INFO.txt            # Password information
├── .gitignore                   # Git ignore rules
└── README.md                    # This file
```

## 🎨 UI Features

### Dashboard View
- Total statistics cards (PCs, Employees, Avg Storage, Avg RAM)
- Quick action buttons
- Recent activity list

### Inventory View
- Sortable data table
- Inline edit/delete actions
- Add new entry modal

### Analytics View
- Model distribution
- Storage analysis
- RAM distribution
- Monthly additions chart

### Settings View
- Auto-save toggle
- Search highlighting toggle
- Rows per page configuration

## 🔧 Configuration

### Change Port Number
Edit `server.js`, line 7:
```javascript
let PORT = 3000; // Change to your preferred port
```

### Disable Password Protection
Edit `server.js` and remove/comment out password verification:
```javascript
// Comment this out to disable password
const PASSWORD = 'vivek';
```

## 🆘 Troubleshooting

### Server won't start
- Make sure Node.js is installed: `node --version`
- Check if port 3000 is already in use
- Try deleting `node_modules` folder and run `npm install` again

### Changes not saving
- Check if the server is running (terminal should show "Server Running!")
- Check browser console (F12) for error messages
- Make sure the CSV file is not open in Excel

### Password not working
- Default password is: `vivek`
- Password is case-sensitive
- Check `server.js` if password was changed

### Can't access dashboard
- Make sure you're using `http://localhost:3000` (not just opening the HTML file)
- Check if another application is using port 3000
- Verify server is running

## 💡 Tips

1. **Always keep the server running** while using the dashboard
2. **Close Excel** before making changes (Excel locks the file)
3. **Search is case-insensitive** - type anything to find it
4. **Press Ctrl+C** in the terminal to stop the server
5. **Session persists** - password required only once per session

## 📊 Data Format

The CSV file uses this format:
```csv
SrNo,Host Name,User Name,Model,SSD,RAM,Date
1,PC 1,Employee001,Dell OptiPlex 3080,256 GB,8 GB,2025-01-06
2,PC 2,Employee002,HP ProDesk 400 G7,512 GB,16 GB,2025-01-07
```

## 🎯 API Endpoints

- `GET /api/data` - Fetch CSV data
- `POST /api/data` - Save CSV data
- `POST /api/verify` - Verify password

## 🤝 Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👤 Author

**Vivek**
- GitHub: [@vivekx11](https://github.com/vivekx11)
- Repository: [IT-Management](https://github.com/vivekx11/IT-Management)

## 🙏 Acknowledgments

- Font Awesome for icons
- Google Fonts (Inter) for typography
- Express.js for backend framework

## 📸 Screenshots

### Dashboard View
Beautiful overview with statistics and quick actions

### Inventory Management
Full CRUD operations with search and filtering

### Analytics
Visual insights into your IT inventory

---

**Made with ❤️ for efficient IT management**

⭐ Star this repository if you find it helpful!
