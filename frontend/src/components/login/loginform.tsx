import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'

interface Props {
  email: string
  password: string
  remember: boolean
  setEmail: (val: string) => void
  setPassword: (val: string) => void
  setRemember: (val: boolean) => void
  onLogin: () => void
  onSignUp: () => void
}

function LoginForm({ email, password, remember, setEmail, setPassword, setRemember, onLogin, onSignUp }: Props) {
  return (
    <>
      <Typography variant="h5" align="center">Welcome back</Typography>

      <TextField
        label="Email"
        type="email"
        fullWidth
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <TextField
        label="Password"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <FormControlLabel
        control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
        label="Remember me"
      />

      <Button variant="contained" fullWidth onClick={onLogin}>
        Login
      </Button>

      <Button variant="outlined" fullWidth onClick={onSignUp}>
        Sign up
      </Button>
    </>
  )
}

export default LoginForm