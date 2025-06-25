import { Routes, Route } from 'react-router-dom'
import CollegeLayout from './layouts/CollegeLayout'
import Home from './pages/college/Home'
import About from './pages/college/About'
import Academics from './pages/college/Academics'
import Admissions from './pages/college/Admissions'
import Contact from './pages/college/Contact'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import './App.css'

function App() {
  return (
    <div className="app">
      <Routes>
        {/* College Website Routes */}
        <Route path="/" element={<CollegeLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="academics" element={<Academics />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        
        {/* Admin Routes */}
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/dashboard" element={<Dashboard />} />
      </Routes>
    </div>
  )
}

export default App
