import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import VisualizerPage from './pages/VisualizerPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import TemplatesGallery from './pages/TemplatesGallery';
import ViewerPage from './pages/ViewerPage';
import { useAuthStore } from './store/useAuthStore';
import MobileRestriction from './components/MobileRestriction';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <Router>
      <MobileRestriction />
      <main className="min-h-screen bg-background">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/view/:publicId" element={<ViewerPage />} />

          <Route
            path="/dashboard"
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />

          <Route
            path="/templates"
            element={isAuthenticated ? <TemplatesGallery /> : <Navigate to="/login" />}
          />

          <Route
            path="/visualizer/:id"
            element={isAuthenticated ? <VisualizerPage /> : <Navigate to="/login" />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
