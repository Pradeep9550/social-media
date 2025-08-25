import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Profile from './pages/Profile'
import Reels from './pages/Reels'
import Sidebar from './components/Sidebar'
import CreatePost from './components/CreatePost'
import ProtectedRoute from './components/ProtectedRoute'
import Search from './pages/Search'
import FriendProfile from './pages/FriendProfile'

function App() {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null)
  const [createPostOpen, setCreatePostOpen] = useState(false)

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  useEffect(() => {
    const token = user?.token;
    if (token && isTokenExpired(token)) {
      logout();
    }
    function isTokenExpired(token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      return decoded.exp * 1000 < Date.now();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      { user ? ( <Sidebar user={user} logout={logout} onCreatePost={() => setCreatePostOpen(true)}/>) : null}
      <div className={`${user ? 'flex-1 md:ml-64' : 'w-full'} pb-28 md:pb-4`}>
        <Routes>
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register setUser={setUser} />} />

          <Route
            path="/" element={ <ProtectedRoute user={user}> <Home user={user} /> </ProtectedRoute> } />

          <Route
            path="/profile/:username"
            element={
              <ProtectedRoute user={user}>
                <Profile user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reels"
            element={
              <ProtectedRoute user={user}>
                <Reels user={user} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectedRoute user={user}>
                <Search user={user} />
              </ProtectedRoute>
            }
          />


          <Route
            path='/friendProfile/:username'
            element={
              <ProtectedRoute user={user}>
                <FriendProfile user={user} />
              </ProtectedRoute>
            }
          />

          
          <Route path="*" element={<Navigate to={user ? '/' : '/login'} />} />
        </Routes>

        {user && (
          <CreatePost isOpen={createPostOpen} onClose={() => setCreatePostOpen(false)} user={user} />
        )}
      </div>
    </div>
  )
}

export default App
