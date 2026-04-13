import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { NavBar } from './components/Navbar'
import { ForgotPassword } from './pages/ForgotPassword'
import { ImprintPrivacy } from './pages/ImprintPrivacy'
import { Register } from './pages/Register'
import { Send } from './pages/Send'
import { Home } from './pages/Home'
import { Profile } from './pages/Profile'
import { Quest } from './pages/Quest'
import { Message } from './pages/Message'
import { Login } from './pages/Login'
import { Gallery } from './pages/Gallery'
import { Editor } from './pages/Editor'
import { Details } from './pages/Details'
import { Dashboard } from './pages/Dashboard'

function App() {

  return (
    <BrowserRouter>
      <NavBar />
      <div style={{ padding: "2rem" }}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/details" element={<Details />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/password" element={<ForgotPassword />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/home" element={<Home />} />
          <Route path="/imprint" element={<ImprintPrivacy />} />
          <Route path="/login" element={<Login />} />
          <Route path="/message" element={<Message />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/quest" element={<Quest />} />
          <Route path="/register" element={<Register />} />
          <Route path="/send" element={<Send />} />
          <Route path="*" element={<Home/>} />
        </Routes>
      </div>
    </BrowserRouter>

  )
}

export default App
