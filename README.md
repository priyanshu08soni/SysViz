# 🚀 SysViz - Modern System Visualization Platform

SysViz is a professional, high-performance platform designed for **System Architects** and **Developers** to visualize, simulate, and manage complex system architectures. With a focus on performance metrics (latency, load) and real-time collaboration, SysViz transforms abstract designs into interactive, data-driven visualizations.

---

## 🎨 Aesthetic & Experience
- **Premium Glassmorphism**: Stunning UI with modern transparency and blur effects.
- **Dynamic Interactions**: Smooth animations powered by `framer-motion`.
- **Responsive Canvas**: Infinite canvas design using `@xyflow/react` (React Flow).
- **Pro Typography**: Utilizing *Inter* and *Plus Jakarta Sans* for ultimate readability.

## ✨ Key Features
- **Interactive Visualizer**: Drag-and-drop nodes to build system flows.
- **Real-time Metrics**: Edit latency and load directly on system components.
- **Dynamic Dashboard**: Manage your projects, teams, and activities in one place.
- **Authentication**: Secure JWT-based auth with `bcryptjs` hashing.
- **Activity Tracking**: Comprehensive logs of your workspace changes.
- **Export Capabilities**: Clean PDF exports for documentation and sharing.

## 🛠️ Tech Stack
| Frontend | Backend | Database | Tools |
| :--- | :--- | :--- | :--- |
| React 19 (Vite) | Node.js (Express) | MongoDB (Mongoose) | TypeScript |
| Tailwind CSS | Socket.io | JWT Auth | Zustand |
| Framer Motion | Lucide Icons | Axios | ESLint |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/try/download/community) (Local or Atlas)
- [npm](https://www.npmjs.com/)

### 1. Setup Backend
```bash
cd server
npm install
```
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:5173
```
Run the server:
```bash
npm run dev
```

### 2. Setup Frontend
```bash
cd client
npm install
```
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://localhost:5000
```
Run the client:
```bash
npm run dev
```

---

## 📁 Project Structure
```text
SysViz/
├── client/           # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # Page views (Dashboard, Visualizer, etc.)
│   │   ├── store/       # Zustand state management
│   │   └── styles/      # Global CSS and Tailwind config
├── server/           # Node/Express Backend
│   ├── src/
│   │   ├── controllers/ # API logic
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # Express routes
│   │   └── middleware/  # Auth guards and utilities
```

---

## 🗺️ Roadmap
- [ ] Multi-user Real-time Collaboration (WebSockets).
- [ ] Advanced System Simulation Engine.
- [ ] Dark/Light Mode Persistence.
- [ ] Cloud-native Deployment Templates.

## 📄 License
This project is licensed under the ISC License.

---
Built with ❤️ by [Priyanshu Soni](https://github.com/priyanshu08soni)
