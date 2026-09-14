import {Route,Routes} from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {

  return (
    <Routes>
        <Route path="/" element={<LandingPage/>} />
        <Route path='/login' element={<LoginPage/>}/>
        <Route path='/admin/dashboard' element={<AdminDashboard/>}/>
    </Routes>

  )
}

export default App
