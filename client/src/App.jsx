import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Landingpage from './pages/Landingpage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TenantDashboard from './pages/TenantDashboard.jsx';
import ComplaintsPage from './pages/ComplaintsPage.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import ManageComplaints from './pages/ManageComplaints.jsx';
import ManageHostels from './pages/ManageHostels.jsx';
import HostelPage from './pages/HostelPage.jsx';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Tenant Routes */}
        <Route
          path="/tenant/dashboard"
          element={
            <ProtectedRoute allowedRole="tenant">
              <TenantDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/tenant/complaint"
          element={
            <ProtectedRoute allowedRole="tenant">
              <ComplaintsPage />
            </ProtectedRoute>
          }
        />

        {/* Admin Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/complaints"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageComplaints />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hostels"
          element={
            <ProtectedRoute allowedRole="admin">
              <ManageHostels />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/hostels/:id"
          element={
            <ProtectedRoute allowedRole="admin">
              <HostelPage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;
