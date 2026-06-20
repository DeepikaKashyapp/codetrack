# CodeTrack++ 🚀

**CodeTrack++** is a full-stack competitive programming and algorithmic practice platform inspired by LeetCode. It features a fully integrated browser-based IDE, a multi-language execution engine, real-time analytics, and a global competitive leaderboard.

## 🌟 Features

* **Multi-Language IDE**: A professional browser IDE powered by Monaco Editor (the core of VS Code) with syntax highlighting and auto-completion.
* **Server-Side Execution Engine**: Safely compile, run, and evaluate user code.
  * **JavaScript**: Runs in a secure, sandboxed Node.js `vm` environment against hidden database test cases.
  * **C++**: Compiles using `g++` and executes raw binaries securely via `child_process`.
* **Real-time Analytics**: Interactive activity heatmaps (GitHub-style) and difficulty breakdown charts to track your personal algorithmic progression.
* **Global Leaderboard**: A high-performance competitive ranking system cached with Redis to reduce database load.
* **Personalized Lists**: Create, manage, and curate personal "to-do" lists of algorithmic problems.
* **Modern UI/UX**: Designed with a sleek, premium dark-mode aesthetic featuring glassmorphism and micro-animations.

## 🛠️ Tech Stack

**Frontend**
* React.js (Vite)
* React Router DOM
* Monaco Editor (`@monaco-editor/react`)
* Recharts (Data Visualization)
* Lucide React (Icons)
* Vanilla CSS with Glassmorphism 

**Backend**
* Node.js & Express.js
* PostgreSQL (Relational Database)
* Redis (Leaderboard Caching)
* Native `vm` & `child_process` (Code Execution Engine)
* JSON Web Tokens (JWT) & bcrypt (Authentication)

## 🚀 Getting Started

### Prerequisites
Make sure you have the following installed on your machine:
* Node.js (v16 or higher)
* PostgreSQL
* Redis Server
* `g++` compiler (MinGW on Windows, or standard GCC on Linux/Mac) for C++ execution.

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/YourUsername/codetrack.git
   cd codetrack
   ```

2. **Install Backend Dependencies:**
   ```bash
   npm install
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd client
   npm install
   ```

4. **Environment Variables:**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   DATABASE_URL=postgresql://user:password@localhost:5432/codetrack
   JWT_SECRET=your_super_secret_jwt_key
   REDIS_URL=redis://localhost:6379
   ```
   Create a `.env` file in the `client/` directory:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

5. **Initialize the Database:**
   Run the SQL scripts located in the `database/` folder to set up your PostgreSQL tables.

### Running the App Locally

Start both the backend and frontend development servers.

**Terminal 1 (Backend):**
```bash
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```
Open your browser and navigate to `http://localhost:5173`.

## 🌐 Deployment
* **Frontend**: Configured for deployment on **Vercel** with SPA routing (`vercel.json` included).
* **Backend**: Configured for deployment on **Render** (Node.js web service).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/YourUsername/codetrack/issues).

## 📝 License
This project is licensed under the MIT License.
