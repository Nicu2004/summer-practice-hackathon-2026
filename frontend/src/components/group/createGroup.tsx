import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import MenuItem from '@mui/material/MenuItem'
import { useNavigate } from 'react-router'

const sportsList = [
  'Football', 'Basketball', 'Running', 'Cycling',
  'Swimming', 'Gym', 'Tennis', 'Volleyball',
  'Boxing', 'Yoga', 'Hiking', 'Crossfit',
  'Martial Arts', 'Dancing', 'Skiing'
]

export default function CreateGroup() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [city, setCity] = useState('')
  const [level, setLevel] = useState('')
  const [selectedSports, setSelectedSports] = useState<string[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      navigate('/login')
    }
  }, [])

  const addSport = (sport: string) => {
    if (!selectedSports.includes(sport)) {
      setSelectedSports(prev => [...prev, sport])
    }
  }

  const removeSport = (sport: string) => {
    setSelectedSports(prev => prev.filter(s => s !== sport))
  }

 const handleCreate = async () => {
  if (!name || !description || !city || !level || selectedSports.length === 0) {
    setError('Please fill in all fields and select at least one sport.')
    return
  }

  try {
    const response = await fetch('http://localhost:8080/api/groups', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        description,
        city,
        level,
        sports: selectedSports,
        createdBy: user.id,
      }),
    })

    const text = await response.text()
    console.log('status:', response.status)
    console.log('response:', text)        // ← see exact error from Spring Boot

    if (response.ok) {
      navigate('/home')
    } else {
      setError(text)                      // ← show Spring Boot error on screen
    }
  } catch (error) {
    console.log('fetch error:', error)
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

        <Typography variant="h5" align="center" sx={{ fontWeight: 500 }}>
          Create a group
        </Typography>

        <Typography variant="body2" align="center" color="text.secondary">
          Set up your training group and find people to join
        </Typography>

        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}

        <TextField
          label="Group name"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={3}
          placeholder="What is this group about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <TextField
          label="City"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <TextField
          label="Fitness level required"
          select
          fullWidth
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="advanced">Advanced</MenuItem>
          <MenuItem value="all">All levels welcome</MenuItem>
        </TextField>

        {/* Sports picker */}
        <Typography sx={{ fontWeight: 500 }}>Select sports for this group</Typography>

        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {sportsList.map(sport => (
            <Chip
              key={sport}
              label={sport}
              onClick={() => addSport(sport)}
              disabled={selectedSports.includes(sport)}
              variant="outlined"
              sx={{ cursor: 'pointer' }}
            />
          ))}
        </Box>

        {selectedSports.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 500 }} color="primary">
              Selected ({selectedSports.length})
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {selectedSports.map(sport => (
                <Chip
                  key={sport}
                  label={sport}
                  onDelete={() => removeSport(sport)}
                  color="primary"
                  variant="filled"
                />
              ))}
            </Box>
          </>
        )}

        <Button
          variant="contained"
          fullWidth
          onClick={handleCreate}
          sx={{ backgroundColor: '#007FFF', mt: 1 }}
        >
          Create group
        </Button>

        <Button variant="text" fullWidth onClick={() => navigate('/home')}>
          Cancel
        </Button>

      </Box>
    </Box>
  )
}