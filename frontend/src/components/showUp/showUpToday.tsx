import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import { motion } from 'framer-motion'

const sportsList = [
  'Football', 'Basketball', 'Running', 'Cycling',
  'Swimming', 'Gym', 'Tennis', 'Volleyball',
  'Boxing', 'Yoga', 'Hiking', 'Crossfit',
]

interface Props {
  onClose: () => void
}

export default function ShowUpToday({ onClose }: Props) {
  const user = JSON.parse(localStorage.getItem('user') || '{}')
  const [selectedSport, setSelectedSport] = useState('')
  const [response, setResponse] = useState<string | null>(null)
  const [alreadyAnswered, setAlreadyAnswered] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkTodayResponse()
  }, [])

  const checkTodayResponse = async () => {
    try {
      const res = await fetch(`http://localhost:8080/api/availability/${user.id}`)
      if (res.ok) {
        const data = await res.json()
        if (data && data.response) {
          setResponse(data.response)
          setSelectedSport(data.sport)
          setAlreadyAnswered(true)
        }
      }
    } catch (error) {
      console.log('error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleResponse = async (answer: 'yes' | 'no') => {
    if (!selectedSport && answer === 'yes') return
    try {
      const res = await fetch('http://localhost:8080/api/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          response: answer,
          sport: selectedSport,
        }),
      })
      if (res.ok) {
        setResponse(answer)
        setAlreadyAnswered(true)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  if (loading) return null

  return (
    <Box sx={{                          // ← full screen wrapper
      width: '100vw',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f0f4f8',
      py: 4,
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Box sx={{
          backgroundColor: '#fff',
          borderRadius: 3,
          border: '1px solid #e0e0e0',
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
          width: 400,
        }}>

          {alreadyAnswered ? (
            <>
              <Typography fontSize={48}>
                {response === 'yes' ? '🏃' : '😴'}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 500 }} textAlign="center">
                {response === 'yes'
                  ? `You're in for ${selectedSport} today!`
                  : "You're sitting this one out today."}
              </Typography>
              <Button variant="outlined" fullWidth onClick={onClose}>
                Back to home
              </Button>
            </>
          ) : (
            <>
              <Typography fontSize={48}>🏅</Typography>
              <Typography variant="h5" sx={{ fontWeight: 500 }} textAlign="center">
                ShowUpToday?
              </Typography>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                Are you available to play today? Pick your sport and let us know!
              </Typography>

              <Typography sx={{ fontWeight: 500, alignSelf: 'flex-start' }}>
                Pick a sport
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {sportsList.map(sport => (
                  <Chip
                    key={sport}
                    label={sport}
                    onClick={() => setSelectedSport(sport)}
                    color={selectedSport === sport ? 'primary' : 'default'}
                    variant={selectedSport === sport ? 'filled' : 'outlined'}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, width: '100%', mt: 1 }}>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={!selectedSport}
                  onClick={() => handleResponse('yes')}
                  sx={{ backgroundColor: '#4caf50', fontSize: 18, py: 1.5 }}
                >
                  ✅ Yes
                </Button>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => handleResponse('no')}
                  color="error"
                  sx={{ fontSize: 18, py: 1.5 }}
                >
                  ❌ No
                </Button>
              </Box>

              {!selectedSport && (
                <Typography variant="caption" color="text.secondary">
                  Pick a sport to enable Yes
                </Typography>
              )}

              <Button variant="text" onClick={onClose}>
                Ask me later
              </Button>
            </>
          )}

        </Box>
      </motion.div>
    </Box>
  )
}