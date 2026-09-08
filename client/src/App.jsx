import { useState } from 'react'
import { Routes, Route, } from 'react-router-dom';
import Landingpage from './pages/Landingpage.jsx';
import SignupPage from './pages/SignupPage.jsx';
import LoginPage from './pages/LoginPage.jsx';


function App() {

  return (
    <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
    </Routes>
  )
}

export default App
