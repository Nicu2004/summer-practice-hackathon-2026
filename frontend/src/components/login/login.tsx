import { useState } from 'react'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import LoginForm from './loginform'

function LoginBox() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)

  const handleLogin = async () => {
  const response = await fetch('http://localhost:8080/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (response.ok) {
    const user = await response.json()       // ← get user data from Spring Boot
    localStorage.setItem('user', JSON.stringify(user))  // ← save it
    navigate('/home')                        // ← then navigate
  }
}

  return (
    <Box sx={{
      width: '100vw',
      height: '100vh',
      margin: 'auto'}}>
            <Box sx={{
      width: 400,
      height: 500,
      margin: 'auto',
      backgroundColor: '#fff',
      border:1,
      borderRadius: 2,
      borderColor: 'primary.main',
      padding: 4,
      display: 'flex',
      flexDirection: 'column',
      gap: 2,
    }}>
      <LoginForm
        email={email}
        password={password}
        remember={remember}
        setEmail={setEmail}
        setPassword={setPassword}
        setRemember={setRemember}
        onLogin={handleLogin}
        onSignUp={() => navigate('/register')}
      />
    </Box>
    </Box>
  )
}

export default LoginBox