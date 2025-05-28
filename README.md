# Leet Tracker

Leet Tracker is a MVC and microservices-based web application that helps you track, visualize, and analyze your LeetCode problem-solving progress. It's designed for students, job seekers, and anyone who wants to stay organized and motivated while practicing coding problems.

---

## 🚀 Features

- **User Authentication:** Secure sign-up and login.
- **Problem Tracking:** Add, update, and view solved LeetCode problems.
- **Statistics Dashboard:** Visualize your progress with charts and stats.
- **View Solutions with Syntax Highlighting:** Easily review your submitted solutions with clear syntax highlighting for better readability.
- **Multi-language Backend:** Built with PHP (Laravel), Python, and Go.
- **Modern Frontend:** UI built with React, Vite, and Tailwind CSS.
- **RESTful APIs:** Clean separation between services for scalability.

---

## 🖼️ Screenshots

### Dashboard
![Dashboard Screenshot](https://raw.githubusercontent.com/ibrahemassa/leet-tracker/main/docs/dashboard.png)
*Track your LeetCode progress and performance at a glance.*

### Problems Page
![Problems Screenshot](https://raw.githubusercontent.com/ibrahemassa/leet-tracker/main/docs/problems.png)
*Manage your coding problems, filter by status, difficulty, and tags, and view or add solutions.*

---

## 🏗️ Architecture

Leet Tracker uses a hybrid MVC and microservices architecture:

- **Backend (Laravel/PHP):** Handles authentication, user management, and main API.
- **Problem Service (Python):** Manages LeetCode problem data and integration.
- **Stats Service (Go):** Processes and serves user statistics.
- **Frontend (React + Vite + Tailwind CSS):** User interface for interacting with the platform.
- **Main Database (MySQL):** Stores user data, problems, and stats.

> See `Diagrams.pdf` for UML and architecture diagrams.

---

## ⚡ Quick Start

### 1. Clone the Repository

```sh
git clone https://github.com/ibrahemassa/leet-tracker.git
cd leet-tracker
```

### 2. Database Setup

- Import the provided `leet_tracker.sql` into your MySQL server.

### 3. Start the Services

#### Backend (Laravel)
```sh
cd backend
composer install
php artisan key:generate
php artisan migrate
php artisan serve
```

#### Problem Service (Python)
```sh
cd problem_service
pip install -r requirements.txt
python app.py
```

#### Stats Service (Go)
```sh
cd stats_service
go mod download
go run main.go
```

#### Frontend (React + Vite)
```sh
cd frontend/leet-tracker
npm install
npm run dev
```

### 4. Access the App

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📝 Project Structure

```
leet-tracker/
├── backend/           # Laravel backend (PHP)
├── problem_service/   # Problem service (Python)
├── stats_service/     # Stats service (Go)
├── frontend/          # Frontend (React + Vite + Tailwind CSS)
│   └── leet-tracker/
├── leet_tracker.sql   # MySQL database schema and seed
├── Diagrams.pdf       # UML and architecture diagrams
├── README.md
└── .gitignore
```

---

## 🛠️ Requirements

- PHP 8.1+
- Python 3.8+
- Go 1.19+
- Node.js (latest LTS recommended)
- MySQL (running)

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## FAQ

**Q: Can I use this for other coding platforms?**  
A: Not fully supported yet, but support for more platforms is planned!

**Q: How do I reset my password?**  
A: Use the update profile feature on the profile page (if implemented), or contact the admin.

---
