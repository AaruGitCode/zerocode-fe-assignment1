import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ThemeToggle from '../components/ThemeToggle'
import { useAuth } from '../contexts/AuthContext'

interface Message {
  sender: 'user' | 'bot'
  text: string
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [tokenCount, setTokenCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const estimateTokens = (text: string) => {
    const words = text.trim().split(/\s+/).length
    return Math.round(words * 1.3)
  }

  const sendMessage = () => {
    if (!input.trim()) return

    const newMessage: Message = { sender: 'user', text: input }
    setMessages(prev => [...prev, newMessage])
    setInput('')
    setLoading(true)
    setTokenCount(prev => prev + estimateTokens(input))

    fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer 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' 
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          ...messages.map(m => ({
            role: m.sender === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          { role: 'user', content: input }
        ]
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.choices && data.choices.length > 0) {
          const reply = data.choices[0].message.content.trim()
          setMessages(prev => [...prev, { sender: 'bot', text: reply }])
          setTokenCount(prev => prev + estimateTokens(reply))
        } else {
          const error = data.error?.message || 'Something went wrong.'
          setMessages(prev => [...prev, { sender: 'bot', text: `⚠️ ${error}` }])
        }
        setLoading(false)
      })
      .catch(err => {
        console.error('API error:', err)
        setMessages(prev => [...prev, { sender: 'bot', text: '❌ Network/API error' }])
        setLoading(false)
      })
  }

  const handleVoiceInput = () => {
    const SpeechRecognition = (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      alert('Voice recognition not supported in this browser.')
      return
    }

    const recognition = new SpeechRecognition()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript
      setInput(transcript)
    }

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error)
    }

    recognition.start()
  }

  const exportChat = () => {
    const content = messages.map(m => `${m.sender}: ${m.text}`).join('\n')
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'chat.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex flex-col h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <ThemeToggle />
      <button
        onClick={() => { logout(); navigate('/login') }}
        className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded"
      >
        Logout
      </button>
      <button
        onClick={exportChat}
        className="absolute top-4 left-28 bg-green-600 text-white px-3 py-1 rounded"
      >
        Export Chat
      </button>

      <div className="text-xl font-bold text-center p-4 bg-white dark:bg-gray-800 shadow">
        💬 Chat with Bot
      </div>

      <div className="px-4 py-1 text-sm text-right text-gray-600 dark:text-gray-300">
        Messages: {messages.length} | Tokens: {tokenCount}
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`max-w-md px-4 py-2 rounded-lg ${
              msg.sender === 'user'
                ? 'ml-auto bg-blue-600 text-white'
                : 'mr-auto bg-gray-300 dark:bg-gray-700'
            }`}
          >
            {msg.text}
          </div>
        ))}

        {loading && (
          <div className="mr-auto bg-gray-300 dark:bg-gray-700 px-4 py-2 rounded-lg max-w-xs animate-pulse">
            Bot is typing...
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
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 px-4 py-2 rounded border dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Send
          </button>
          <button
            onClick={handleVoiceInput}
            className="bg-purple-400 text-white px-3 py-2 rounded hover:bg-purple-600"
          >
            🎤
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat
