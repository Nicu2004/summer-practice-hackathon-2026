import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardActionArea from '@mui/material/CardActionArea'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Badge from '@mui/material/Badge'
import { useNavigate } from 'react-router'
import ShowUpToday from '../showUp/showUpToday'

const menuItems = [
  { icon: '👤', title: 'Profile setup', description: 'Update your bio, sports and fitness goals', route: '/profile-setup' },
  { icon: '🤝', title: 'Join a group', description: 'Find people to train with near you', route: '/join-group' },
  { icon: '➕', title: 'Create a group', description: 'Start your own training group', route: '/create-group' },
]

export default function Home() {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [groups, setGroups] = useState<any[]>([])
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      const parsed = JSON.parse(stored)
      setUser(parsed)
      fetchGroups(parsed.id)
      checkAvailability(parsed.id)  // ← called here with real id
    } else {
      navigate('/login')
    }
  }, [])

  const checkAvailability = async (userId: number) => {
    try {
      const res = await fetch(`http://localhost:8080/api/availability/${userId}`)
      if (res.ok) {
        const data = await res.json()
        console.log('availability:', data)
        if (!data || !data.response) {
          setShowPrompt(true)
        }
      } else {
        setShowPrompt(true)
      }
    } catch (error) {
      setShowPrompt(true)
    }
  }

  const fetchGroups = async (userId: number) => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/user/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setGroups(data)
      }
    } catch (error) {
      console.log('error fetching groups:', error)
    }
  }

  if (!user) return null

  const handleLogout = () => {
    localStorage.removeItem('user')
    navigate('/login')
  }


  if (showPrompt) {
    return <ShowUpToday onClose={() => setShowPrompt(false)} />
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
        width: 480,
        backgroundColor: '#fff',
        borderRadius: 3,
        border: '1px solid #e0e0e0',
        padding: 4,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2,
      }}>

        <Avatar sx={{ width: 72, height: 72, backgroundColor: '#007FFF', fontSize: 28 }}>
          {user.name?.[0]}{user.forname?.[0]}
        </Avatar>

        <Typography variant="h5" sx={{ fontWeight: 500 }}>
          {user.name} {user.forname}
        </Typography>

        <Divider sx={{ width: '100%' }} />

        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Email</Typography>
            <Typography sx={{ fontWeight: 500 }}>{user.email}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">First name</Typography>
            <Typography sx={{ fontWeight: 500 }}>{user.name}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Last name</Typography>
            <Typography sx={{ fontWeight: 500 }}>{user.forname}</Typography>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography color="text.secondary">Birth date</Typography>
            <Typography sx={{ fontWeight: 500 }}>{user.birthDate}</Typography>
          </Box>
        </Box>

        <Divider sx={{ width: '100%' }} />

        <Typography variant="h6" sx={{ fontWeight: 500, alignSelf: 'flex-start' }}>
          What would you like to do?
        </Typography>

        <Grid container spacing={2} sx={{ width: '100%' }}>
          {menuItems.map((item) => (
            <Grid size={12} key={item.title}>
              <Card variant="outlined" sx={{ borderRadius: 2 }}>
                <CardActionArea onClick={() => navigate(item.route)}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Typography sx={{ fontSize: 32 }}>{item.icon}</Typography>
                    <Box>
                      <Typography sx={{ fontWeight: 500 }}>{item.title}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.description}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ width: '100%' }} />

        <Typography variant="h6" sx={{ fontWeight: 500, alignSelf: 'flex-start' }}>
          Your groups
        </Typography>

        {groups.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'flex-start' }}>
            You haven't joined any groups yet.
          </Typography>
        ) : (
          <List sx={{ width: '100%', p: 0 }}>
            {groups.map((group) => (
              <ListItem key={group.id} disablePadding>
                <ListItemButton
                  onClick={() => navigate(`/chat/${group.id}`)}
                  sx={{ borderRadius: 2, mb: 1, border: '1px solid #e0e0e0' }}
                >
                  <ListItemAvatar>
                    <Badge color="success" variant="dot" overlap="circular"
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
                      <Avatar sx={{ backgroundColor: '#007FFF' }}>
                        {group.name?.[0]}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>
                  <ListItemText
                    primary={group.name}
                    secondary={group.lastMessage ?? 'No messages yet'}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}

        <Divider sx={{ width: '100%' }} />

        <Button variant="outlined" fullWidth onClick={handleLogout} color="error">
          Log out
        </Button>

      </Box>
    </Box>
  )
}