import { useState } from 'react'
import Homepage from './pages/Homepage'
import { Routes, Route, } from 'react-router-dom';

function App() {
  const [count, setCount] = useState(0)

  return (
    <Routes>
        <Route path="/" element={<Homepage />} />
    </Routes>
  )
}

export default App
