import { useState } from 'react'
import { Routes, Route, } from 'react-router-dom';
import Landingpage from './pages/Landingpage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import TenantDashboard from './pages/TenantDashboard.jsx';
import ComplaintsPage from './pages/ComplaintsPage.jsx';

function App() {

  return (
    <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path='/tenant/dashboard'element={<TenantDashboard/>}/>
        <Route path='/tenant/complaint' element={<ComplaintsPage/>}/>
    </Routes>
  )
}

export default App
