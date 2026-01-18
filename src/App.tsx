import { Routes, Route } from 'react-router-dom'
import Home from '@/pages/Home'
import Login from '@/pages/admin/Login'
import ProfileAdmin from '@/pages/admin/Profile'
import ExperienceAdmin from '@/pages/admin/ExperienceAdmin'
import SkillsAdmin from '@/pages/admin/SkillsAdmin'
import GapsAdmin from '@/pages/admin/GapsAdmin'
import FaqAdmin from '@/pages/admin/FaqAdmin'
import AdminLayout from '@/components/admin/AdminLayout'
import ProtectedRoute from '@/components/admin/ProtectedRoute'

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />

      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ProfileAdmin />} />
        <Route path="experience" element={<ExperienceAdmin />} />
        <Route path="skills" element={<SkillsAdmin />} />
        <Route path="gaps" element={<GapsAdmin />} />
        <Route path="faq" element={<FaqAdmin />} />
      </Route>
    </Routes>
  )
}

export default App
