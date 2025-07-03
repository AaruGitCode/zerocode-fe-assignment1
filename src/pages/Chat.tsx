import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import ThemeToggle from '../components/ThemeToggle'

interface Message {
  sender: 'user' | 'bot'
  text: string
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMsg: Message = { sender: 'user', text: input }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${import.meta.env.VITE_API_KEY}`,
          "HTTP-Referer": "http://localhost:5173", // update in production
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "mistralai/mistral-7b-instruct",
          messages: [
            { role: "system", content: "You are a helpful assistant." },
            { role: "user", content: userMsg.text }
          ]
        })
      })

      const data = await response.json()
      const botReply = data.choices[0].message.content
      const botMsg: Message = { sender: 'bot', text: botReply }
      setMessages(prev => [...prev, botMsg])
    } catch (error: any) {
      console.error("API error:", error)
      setMessages(prev => [...prev, { sender: 'bot', text: "❌ Something went wrong." }])
    }

    setLoading(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') sendMessage()
  }

  const exportChat = () => {
    const content = messages.map(msg => `${msg.sender === 'user' ? 'You' : 'Bot'}: ${msg.text}`).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat-history.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const startVoiceInput = () => {
    const recognition = new (window as any).webkitSpeechRecognition()
    recognition.lang = 'en-US'
    recognition.onresult = (event: any) => {
      setInput(event.results[0][0].transcript)
    }
    recognition.start()
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ThemeToggle />
      <div className="p-4 bg-white dark:bg-gray-800 shadow flex justify-between items-center">
        <div className="text-xl font-bold">💬 BotTalk</div>
        <div className="flex gap-2">
          <button onClick={exportChat} className="bg-green-600 text-white px-3 py-1 rounded">Export Chat</button>
          <button onClick={() => { logout(); navigate('/login') }} className="bg-red-600 text-white px-3 py-1 rounded">Logout</button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div key={index} className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'user' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-300 dark:bg-gray-700'}`}>
            {msg.text}
          </div>
        ))}
        {loading && (
          <div className="mr-auto bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg max-w-xs animate-pulse">
            Typing...
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
          <button
            onClick={startVoiceInput}
            className="bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600"
          >
            🎤
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
