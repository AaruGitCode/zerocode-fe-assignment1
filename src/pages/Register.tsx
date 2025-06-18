import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import chatbotLogo from '../assets/chatbot-logo.png'

const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleRegister = () => {
    alert('Registered successfully')
    navigate('/login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-cover bg-center bg-gray-100 dark:bg-gray-900" style={{ backgroundImage: 'url(/chat-bg.jpg)' }}>
      <ThemeToggle />
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md w-96 relative">
        <div className="absolute -top-20 left-1/2 transform -translate-x-1/2">
          <img src={chatbotLogo} alt="Chatbot Logo" className="w-20 h-20 rounded-full shadow-lg" />
        </div>
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-center mb-4 text-gray-900 dark:text-white">Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
          />
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
          >
            Register
          </button>
          <p className="text-center text-sm mt-2 text-gray-600 dark:text-gray-300">
            Already have an account? <a href="/login" className="text-blue-500">Login</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
