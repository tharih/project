import React, { useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { api } from '../api/client.js'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  const onSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await api.login({ username, password })
      if (res?.token) {
  localStorage.setItem('token', res.token)
  localStorage.setItem('username', username) // <— save who logged in
  const dest = location.state?.from?.pathname || '/'
  navigate(dest)
} else setError('Login succeeded but no token returned')
    } catch (e) {
      setError(e.message || 'Invalid username or password')
    }
  }

  return (
    <div className="login-page">
      <div className="login-wrapper">
        <div className="login-box">
          <h2>Welcome to <span className="highlight">FaceSense</span></h2>
          <form onSubmit={onSubmit}>
            <input type="text" name="username" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" name="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            <p><Link to="/forgot-password" className="forgot-link">Forgot Password?</Link></p>
            {error && <p className="error">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  )
}
