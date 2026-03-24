import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Booking from './pages/Booking'
import Settings from './pages/Settings'
import Stats from './pages/Stats'
import ServicesList from './pages/ServicesList'
import SchedulesList from './pages/SchedulesList'
import SettingsQR from './pages/SettingsQR'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/settings/services" element={<ServicesList />} />
        <Route path="/settings/schedules" element={<SchedulesList />} />
        <Route path="/settings/qr" element={<SettingsQR />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/booking/:proId" element={<Booking />} />
      </Routes>
    </BrowserRouter>
  )
}
