import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate, useParams } from 'react-router'

const sportsList = [
  'Football', 'Basketball', 'Running', 'Cycling',
  'Swimming', 'Gym', 'Tennis', 'Volleyball',
  'Boxing', 'Yoga', 'Hiking', 'Crossfit',
]

export default function CreateEvent() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const [user, setUser] = useState<any>(null)
  const [title, setTitle] = useState('')
  const [sport, setSport] = useState('')
  const [location, setLocation] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [eventTime, setEventTime] = useState('')
  const [description, setDescription] = useState('')
  const [maxPlayers, setMaxPlayers] = useState(10)
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
    else navigate('/login')
  }, [])

  const handleCreate = async () => {
    if (!title || !sport || !location || !eventDate || !eventTime) {
      setError('Please fill in all required fields.')
      return
    }

    const response = await fetch('http://localhost:8080/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        groupId: Number(groupId),
        createdBy: user.id,
        title,
        sport,
        location,
        eventDate,
        eventTime,
        description,
        maxPlayers,
      }),
    })

    if (response.ok) {
      navigate(`/chat/${groupId}`)
    } else {
      setError('Failed to create event.')
    }
  }

  return (
    <Box sx={{
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f0f4f8',
      py: 4,
    }}>
      <Box sx={{
        width: 460,
        backgroundColor: '#fff',
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}>
        <Typography variant="h5" textAlign="center" sx={{ fontWeight: 500 }}>
          Plan an event
        </Typography>

        <Typography variant="body2" textAlign="center" color="text.secondary">
          Create an event for your group to join
        </Typography>

        {error && (
          <Typography color="error" variant="body2" textAlign="center">
            {error}
          </Typography>
        )}

        <TextField
          label="Event title"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <TextField
          label="Sport"
          select
          fullWidth
          value={sport}
          onChange={(e) => setSport(e.target.value)}
        >
          {sportsList.map(s => (
            <MenuItem key={s} value={s}>{s}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Location"
          fullWidth
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="e.g. Central Park, Court 3"
        />

        <TextField
          label="Date"
          type="date"
          fullWidth
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Time"
          type="time"
          fullWidth
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />

        <TextField
          label="Max players"
          type="number"
          fullWidth
          value={maxPlayers}
          onChange={(e) => setMaxPlayers(Number(e.target.value))}
        />

        <TextField
          label="Description (optional)"
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Any extra details for your group..."
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleCreate}
          sx={{ backgroundColor: '#007FFF', mt: 1 }}
        >
          Create event
        </Button>

        <Button variant="text" fullWidth onClick={() => navigate(`/chat/${groupId}`)}>
          Cancel
        </Button>

      </Box>
    </Box>
  )
}