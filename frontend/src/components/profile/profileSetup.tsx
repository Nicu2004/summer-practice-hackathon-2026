import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import { useNavigate } from 'react-router-dom'

const sportsList = [
  'Football', 'Basketball', 'Running', 'Cycling',
  'Swimming', 'Gym', 'Tennis', 'Volleyball',
  'Boxing', 'Yoga', 'Hiking', 'Crossfit',
  'Martial Arts', 'Dancing', 'Skiing'
]

export default function ProfileSetup() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const [bio, setBio] = useState('')
  const [fitnessLevel, setFitnessLevel] = useState('')
  const [goal, setGoal] = useState('')
  const [city, setCity] = useState('')
  const [selectedSports, setSelectedSports] = useState<string[]>([])

  const addSport = (sport: string) => {
    if (!selectedSports.includes(sport)) {
      setSelectedSports(prev => [...prev, sport])
    }
  }

  const removeSport = (sport: string) => {
    setSelectedSports(prev => prev.filter(s => s !== sport))
  }

  const handleSave = async () => {
    const response = await fetch('http://localhost:8080/api/profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.id,
        bio,
        fitnessLevel,
        goal,
        city,
        sports: selectedSports,
      }),
    })
    if (response.ok) {
      navigate('/home')
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
        <Typography variant="h5" component="h1" sx={{ textAlign: 'center' }}>
          Hey {user.name}, tell us about yourself
        </Typography>

        <Typography variant="body2" component="p" sx={{ textAlign: 'center' }} color="text.secondary">
          This helps us match you with the right people and activities
        </Typography>

        <TextField
          label="City"
          fullWidth
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <TextField
          label="Bio"
          fullWidth
          multiline
          rows={3}
          placeholder="Tell others a bit about yourself..."
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <TextField
          label="Fitness level"
          select
          fullWidth
          value={fitnessLevel}
          onChange={(e) => setFitnessLevel(e.target.value)}
        >
          <MenuItem value="beginner">Beginner</MenuItem>
          <MenuItem value="intermediate">Intermediate</MenuItem>
          <MenuItem value="advanced">Advanced</MenuItem>
        </TextField>

        <TextField
          label="My main goal"
          select
          fullWidth
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        >
          <MenuItem value="lose_weight">Lose weight</MenuItem>
          <MenuItem value="build_muscle">Build muscle</MenuItem>
          <MenuItem value="stay_active">Stay active</MenuItem>
          <MenuItem value="meet_people">Meet people to train with</MenuItem>
          <MenuItem value="compete">Compete</MenuItem>
        </TextField>

        {/* Sports picker */}
        <Typography sx={{ fontWeight: 500 }}>Select your sports</Typography>

        {/* Available options — grayed out if already selected */}
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

        {/* Selected sports — with delete button */}
        {selectedSports.length > 0 && (
          <>
            <Typography sx={{ fontWeight: 500 }} color="primary">
              Your sports ({selectedSports.length})
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
          onClick={handleSave}
          sx={{ backgroundColor: '#007FFF', mt: 1 }}
        >
          Finish setup
        </Button>

        <Button variant="text" fullWidth onClick={() => navigate('/home')}>
          Skip for now
        </Button>

      </Box>
    </Box>
  )
}