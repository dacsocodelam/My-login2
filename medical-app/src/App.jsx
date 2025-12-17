// src/App.jsx
import { useState } from 'react'
import LoginForm from './components/LoginForm'
import SuccessScreen from './components/SuccessScreen'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div>
      {isLoggedIn ? (
        <SuccessScreen />
      ) : (
        <LoginForm onLoginSuccess={() => setIsLoggedIn(true)} />
      )}
    </div>
  )
}

export default App