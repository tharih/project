import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Home from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import TrainMachine from './pages/TrainMachine.jsx'
import TestMachine from './pages/TestMachine.jsx'
import EmotionDetection from './pages/EmotionDetection.jsx'
import Login from './pages/Login.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* Protected shell */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/train-machine" element={<TrainMachine />} />
          <Route path="/test-machine" element={<TestMachine />} />
          <Route path="/emotion-detection" element={<EmotionDetection />} />
        </Route>
      </Route>
    </Routes>
  )
}
