import { Routes, Route } from 'react-router-dom'
import CollegeLayout from './layouts/CollegeLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/college/Home'
import About from './pages/college/About'
import Academics from './pages/college/Academics'
import Admissions from './pages/college/Admissions'
import Faculty from './pages/college/Faculty'
import Contact from './pages/college/Contact'
import Login from './pages/admin/Login'
import Dashboard from './pages/admin/Dashboard'
import ManageAbout from './pages/admin/ManageAbout'
import ManageContacts from './pages/admin/ManageContacts'
import ManageEvents from './pages/admin/ManageEvents'
import ManageFaculty from './pages/admin/ManageFaculty'
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
          <Route path="faculty" element={<Faculty />} />
          <Route path="admissions" element={<Admissions />} />
          <Route path="contact" element={<Contact />} />
        </Route>
        
        {/* Admin Login (outside layout) */}
        <Route path="/admin/login" element={<Login />} />
        
        {/* Admin Dashboard Routes (with layout) */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="about" element={<ManageAbout />} />
          <Route path="contacts" element={<ManageContacts />} />
          <Route path="events" element={<ManageEvents />} />
          <Route path="faculty" element={<ManageFaculty />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
