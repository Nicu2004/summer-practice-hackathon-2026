import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Avatar from '@mui/material/Avatar'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import ListItemText from '@mui/material/ListItemText'
import Chip from '@mui/material/Chip'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import { useNavigate, useParams } from 'react-router'

interface Message {
  id: number
  userId: number
  userName: string
  content: string
  sentAt: string
}

interface Member {
  userId: number
  name: string
  forname: string
  isCaptain: boolean
}

interface Event {
  id: number
  title: string
  sport: string
  location: string
  eventDate: string
  eventTime: string
  currentPlayers: number
  maxPlayers: number
}

export default function Chat() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const [user, setUser] = useState<any>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [members, setMembers] = useState<Member[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [joinedEvents, setJoinedEvents] = useState<number[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [groupName, setGroupName] = useState('')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [isCaptain, setIsCaptain] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
  if (!user || members.length === 0) return
  const me = members.find(m => m.userId === user.id)
  console.log('me:', me)              // ← what does this print?
  console.log('isCaptain:', me?.isCaptain)  // ← true or false?
  setIsCaptain(me?.isCaptain ?? false)
}, [members, user])
  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) {
      setUser(JSON.parse(stored))
    } else {
      navigate('/login')
    }
  }, [])

  useEffect(() => {
    if (!groupId) return
    fetchGroupName()
    fetchMessages()
    fetchMembers()
    fetchEvents()        // ← added
    const interval = setInterval(() => {
      fetchMessages()
      fetchEvents()      // ← refresh events too
    }, 3000)
    return () => clearInterval(interval)
  }, [groupId])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!user || members.length === 0) return
    const me = members.find(m => m.userId === user.id)
    setIsCaptain(me?.isCaptain ?? false)
  }, [members, user])

  const fetchGroupName = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${groupId}`)
      if (response.ok) {
        const data = await response.json()
        setGroupName(data.name)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/messages/${groupId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const fetchMembers = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/groups/${groupId}/members`)
      if (response.ok) {
        const data = await response.json()
        setMembers(data)
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/events/group/${groupId}`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.log('error fetching events:', error)
    }
  }

  const joinEvent = async (eventId: number) => {
    try {
      const response = await fetch('http://localhost:8080/api/events/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId: user.id }),
      })
      if (response.ok) {
        setJoinedEvents(prev => [...prev, eventId])
        fetchEvents()
      }
    } catch (error) {
      console.log('error joining event:', error)
    }
  }

  const handleSend = async () => {
    if (!newMessage.trim() || !user) return
    try {
      const response = await fetch('http://localhost:8080/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          groupId: Number(groupId),
          userId: user.id,
          content: newMessage,
        }),
      })
      if (response.ok) {
        setNewMessage('')
        fetchMessages()
      }
    } catch (error) {
      console.log('error:', error)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <Box sx={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f0f4f8' }}>

      {/* Header */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        px: 2,
        py: 1.5,
        backgroundColor: '#fff',
        borderBottom: '1px solid #e0e0e0',
      }}>
        <Button variant="text" onClick={() => navigate('/home')}>← Back</Button>
        <Avatar sx={{ backgroundColor: '#007FFF', width: 36, height: 36 }}>
          {groupName?.[0]}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography sx={{ fontWeight: 500 }}>{groupName}</Typography>
          <Typography variant="caption" color="text.secondary">
            {members.length} members
            {isCaptain && ' · ⭐ You are the captain'}
          </Typography>
        </Box>
        <IconButton onClick={() => setDrawerOpen(true)} title="View members">
          <Typography fontSize={20}>👥</Typography>
        </IconButton>
      </Box>

      {/* Captain banner */}
      {isCaptain && (
        <Box sx={{
          backgroundColor: '#e3f2fd',
          px: 2,
          py: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            ⭐ You are the captain of this group
          </Typography>
          <Button
            size="small"
            variant="contained"
            sx={{ backgroundColor: '#007FFF' }}
            onClick={() => navigate(`/create-event/${groupId}`)}
          >
            Plan event
          </Button>
        </Box>
      )}

      {/* Events section */}
      {events.length > 0 && (
        <Box sx={{
          px: 2,
          pt: 2,
          pb: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          borderBottom: '1px solid #e0e0e0',
          backgroundColor: '#fff',
        }}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
            UPCOMING EVENTS
          </Typography>
          {events.map(event => (
            <Box key={event.id} sx={{
              backgroundColor: '#e3f2fd',
              borderRadius: 2,
              p: 2,
              border: '1px solid #90caf9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <Box>
                <Typography sx={{ fontWeight: 500 }}>📅 {event.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  🏅 {event.sport} · 📍 {event.location}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  🕐 {event.eventDate} at {event.eventTime}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  👥 {event.currentPlayers}/{event.maxPlayers} going
                </Typography>
              </Box>
              <Box>
                {joinedEvents.includes(event.id) ? (
                  <Button variant="contained" disabled size="small">
                    Going ✓
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => joinEvent(event.id)}
                    sx={{ backgroundColor: '#007FFF' }}
                  >
                    Join
                  </Button>
                )}
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Messages */}
      <Box sx={{
        flex: 1,
        overflowY: 'auto',
        px: 2,
        py: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5,
      }}>
        {messages.length === 0 ? (
          <Typography color="text.secondary" textAlign="center" sx={{ mt: 4 }}>
            No messages yet. Say hello! 👋
          </Typography>
        ) : (
          messages.map((msg) => {
            const isMe = msg.userId === user?.id
            const memberInfo = members.find(m => m.userId === msg.userId)
            return (
              <Box key={msg.id} sx={{
                display: 'flex',
                flexDirection: isMe ? 'row-reverse' : 'row',
                alignItems: 'flex-end',
                gap: 1,
              }}>
                {!isMe && (
                  <Avatar sx={{ width: 32, height: 32, backgroundColor: '#007FFF', fontSize: 14 }}>
                    {msg.userName?.[0]}
                  </Avatar>
                )}
                <Box sx={{
                  maxWidth: '70%',
                  backgroundColor: isMe ? '#007FFF' : '#fff',
                  color: isMe ? '#fff' : 'text.primary',
                  border: isMe ? 'none' : '1px solid #e0e0e0',
                  borderRadius: isMe ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                  px: 2,
                  py: 1,
                }}>
                  {!isMe && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ fontWeight: 500 }}>
                        {msg.userName}
                      </Typography>
                      {memberInfo?.isCaptain && (
                        <Typography variant="caption">⭐</Typography>
                      )}
                    </Box>
                  )}
                  <Typography variant="body2">{msg.content}</Typography>
                  <Typography variant="caption" sx={{
                    display: 'block',
                    textAlign: 'right',
                    mt: 0.5,
                    opacity: 0.7,
                    fontSize: 10,
                  }}>
                    {new Date(msg.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </Typography>
                </Box>
              </Box>
            )
          })
        )}
        <div ref={bottomRef} />
      </Box>

      {/* Input */}
      <Box sx={{
        px: 2,
        py: 1.5,
        backgroundColor: '#fff',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        gap: 1,
        alignItems: 'center',
      }}>
        <TextField
          fullWidth
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          size="small"
          sx={{ backgroundColor: '#f0f4f8', borderRadius: 2 }}
        />
        <Button variant="contained" onClick={handleSend} sx={{ backgroundColor: '#007FFF', minWidth: 80 }}>
          Send
        </Button>
      </Box>

      {/* Members drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 500, mb: 2 }}>
            Members ({members.length})
          </Typography>
          <Divider sx={{ mb: 2 }} />
          <List sx={{ p: 0 }}>
            {members.map((member) => (
              <ListItem key={member.userId} sx={{ px: 0 }}>
                <ListItemAvatar>
                  <Avatar sx={{ backgroundColor: member.isCaptain ? '#FFB300' : '#007FFF' }}>
                    {member.name?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {member.name} {member.forname}
                      </Typography>
                      {member.isCaptain && (
                        <Chip label="Captain" size="small" sx={{ backgroundColor: '#FFB300', color: '#fff', fontSize: 10 }} />
                      )}
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

    </Box>
  )
}