import { useState } from 'react'
import Box from '@mui/material/Box'
import { useNavigate } from 'react-router-dom'
import RegisterForm from './registerform'

function RegisterBox() {
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [forname, setForname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [birthDate, setBirthDate] = useState('')
  const [remember, setRemember] = useState(false)

const handleRegister = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, forname, email, password, birthDate }),
    })

    if (response.ok) {
      const user = await response.json()
      console.log('registered user:', user)  // ← check F12 console
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/profile-setup')
    } else {
      console.log('failed:', response.status)
    }
  } catch (error) {
    console.log('error:', error)
  }
}

  return (
    <Box sx={{
      width: '100vw',
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <Box sx={{
        width: 400,
        backgroundColor: '#fff',
        border: 1,
        borderRadius: 2,
        borderColor: 'primary.main',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <RegisterForm
          name={name}
          forname={forname}
          email={email}
          password={password}
          birthDate={birthDate}
          remember={remember}
          setName={setName}
          setForname={setForname}
          setBirthDate={setBirthDate}
          setEmail={setEmail}
          setPassword={setPassword}
          setRemember={setRemember}
          onRegister={handleRegister}
          onLogin={() => navigate('/login')}
        />
      </Box>
    </Box>
  )
}

export default RegisterBox