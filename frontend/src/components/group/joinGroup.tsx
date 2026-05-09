import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Avatar from '@mui/material/Avatar'
import { useNavigate } from 'react-router'

export default function JoinGroup() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [filtered, setFiltered] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [joined, setJoined] = useState<number[]>([])
  const [error, setError] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      fetchGroups(parsed.id)
    } else {
      navigate('/login')
    }
  }, [])

  const fetchGroups = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/available/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
        setFiltered(data)
      }
    } catch (error) {
      console.log('error fetching groups:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (val: string) => {
    setSearch(val)
    const lower = val.toLowerCase()
    setFiltered(groups.filter(g =>
      g.name.toLowerCase().includes(lower) ||
      g.city.toLowerCase().includes(lower) ||
      g.sports?.toLowerCase().includes(lower)
    ))
  }

  const handleJoin = async (groupId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/groups/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id, groupId }),
      })
      if (response.ok) {
        setJoined(prev => [...prev, groupId])
      } else {
        setError('Failed to join group.')
      }
    } catch (error) {
      console.log('error joining group:', error)
    }
  }

  return (
    <Box sx={{
      width: '100vw',
      minHeight: '100vh',
      backgroundColor: '#f0f4f8',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      py: 4,
      px: 2,
    }}>
      <Box sx={{ width: '100%', maxWidth: 560 }}>

        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
          <Button variant="text" onClick={() => navigate('/home')}>← Back</Button>
          <Typography variant="h5" sx={{ fontWeight: 500 }}>
            Join a group
          </Typography>
        </Box>

        {/* Search */}
        <TextField
          label="Search by name, city or sport"
          fullWidth
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
          sx={{ mb: 3 }}
        />

        {error && (
          <Typography color="error" variant="body2" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Groups list */}
        {loading ? (
          <Typography color="text.secondary">Loading groups...</Typography>
        ) : filtered.length === 0 ? (
          <Typography color="text.secondary">No groups found.</Typography>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filtered.map((group) => (
              <Card key={group.id} variant="outlined" sx={{ borderRadius: 3 }}>
                <CardContent>

                  {/* Group header */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                    <Avatar sx={{ backgroundColor: '#007FFF' }}>
                      {group.name?.[0]}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>{group.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {group.city}
                      </Typography>
                    </Box>
                  </Box>

                  {/* Description */}
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {group.description}
                  </Typography>

                  {/* Level + sports */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip label={group.level} size="small" color="primary" variant="outlined" />
                    {(Array.isArray(group.sports)
                      ? group.sports
                      : group.sports?.split(',') ?? []
                    ).map((sport: string) => (
                      <Chip key={sport} label={sport.trim()} size="small" variant="outlined" />
                    ))}
                  </Box>

                </CardContent>

                <CardActions sx={{ px: 2, pb: 2 }}>
                  {joined.includes(group.id) ? (
                    <Button variant="contained" disabled fullWidth>
                      Joined ✓
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => handleJoin(group.id)}
                      sx={{ backgroundColor: '#007FFF' }}
                    >
                      Join group
                    </Button>
                  )}
                </CardActions>
              </Card>
            ))}
          </Box>
        )}
      </Box>
    </Box>
  )
}