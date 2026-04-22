import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import PersonalDashboard from './pages/PersonalDashboard';
import CEODashboard from './pages/CEODashboard';
import AdminDashboard from './pages/AdminDashboard';
import CreateMeetingPage from './pages/CreateMeetingPage';
import EmailPreviewPage from './pages/EmailPreviewPage';
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/" replace />;
  return <>{children}</>;
}
 
function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/personal-dashboard" element={<ProtectedRoute><PersonalDashboard /></ProtectedRoute>} />
      <Route path="/ceo-dashboard" element={<ProtectedRoute><CEODashboard /></ProtectedRoute>} />
      <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
      <Route path="/create-meeting" element={<ProtectedRoute><CreateMeetingPage /></ProtectedRoute>} />
      <Route path="/email-preview" element={<ProtectedRoute><EmailPreviewPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
 
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}