import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './components/home/home'
import Login from './components/login/login'
import Register from './components/register/register'
import ProfileSetup from './components/profile/profileSetup'
import CreateGroup from './components/group/createGroup'
import Landing from './components/landing/Landing'
import JoinGroup from './components/group/joinGroup'
import Chat from './components/message/Chat'
import CreateEvent from './components/event/CreateEvent'
import Box from '@mui/material/Box'
import ShowUpToday from './components/showUp/showUpToday'



function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile-setup" element={<ProfileSetup />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/join-group" element={<JoinGroup />} />
        <Route path="/chat/:groupId" element={<Chat />} />
        <Route path="/create-event/:groupId" element={<CreateEvent />} />
        <Route path="/showup" element={<ShowUpToday onClose={() => window.history.back()} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App