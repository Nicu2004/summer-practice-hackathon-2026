import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import { useState } from 'react'
import Popover from '@mui/material/Popover'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar'
import dayjs from 'dayjs'

interface Props {
  name: string
  forname: string
  email: string
  password: string
  birthDate: string
  remember: boolean
  setName: (val: string) => void
  setForname: (val: string) => void
  setBirthDate: (val: string) => void
  setEmail: (val: string) => void
  setPassword: (val: string) => void
  setRemember: (val: boolean) => void
  onRegister: () => void
  onLogin: () => void
}

function RegisterForm({ name, forname, email, password, birthDate, remember, setName, setForname, setBirthDate, setEmail, setPassword, setRemember, onLogin, onRegister }: Props) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null)

  return (
    <>
      <Typography variant="h5" align="center">Create account</Typography>

      <TextField
        label="First name"
        type="text"
        fullWidth
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <TextField
        label="Last name"
        type="text"
        fullWidth
        value={forname}
        onChange={(e) => setForname(e.target.value)}
      />

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

      {/* Birth date field that opens calendar on click */}
      <TextField
        label="Birth date"
        type="text"
        fullWidth
        value={birthDate}
        onClick={(e) => setAnchor(e.currentTarget)}
        slotProps={{ input: { readOnly: true } }}
        placeholder="Select a date"
      />

      <Popover
        open={Boolean(anchor)}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            onChange={(val) => {
              setBirthDate(dayjs(val).format('YYYY-MM-DD'))
              setAnchor(null)
            }}
          />
        </LocalizationProvider>
      </Popover>

      <FormControlLabel
        control={<Checkbox checked={remember} onChange={(e) => setRemember(e.target.checked)} />}
        label="Remember me"
      />

      <Button variant="contained" fullWidth onClick={onRegister}>
        Register
      </Button>

      <Button variant="outlined" fullWidth onClick={onLogin}>
        Log in
      </Button>
    </>
  )
}

export default RegisterForm