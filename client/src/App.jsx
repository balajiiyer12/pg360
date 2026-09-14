import {Route,Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import TenantDashboard from './pages/TenantDashboard';
import AdminComplaintPage from './pages/AdminComplaintPage';

function App() {

  return (
    <AuthProvider>
        <Routes>
            <Route path="/" element={<LandingPage/>} />
            <Route path='/login' element={<LoginPage/>}/>

            <Route element={<ProtectedRoute allowedRole="admin" />}>
               <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
               <Route path='/admin/complaints' element={<AdminComplaintPage/>}/>
            </Route>

            <Route element={<ProtectedRoute allowedRole="tenant" />}>
               <Route path='/tenant/dashboard' element={<TenantDashboard/>}/>
            </Route>

        </Routes>
    </AuthProvider>

  )
}

export default App
