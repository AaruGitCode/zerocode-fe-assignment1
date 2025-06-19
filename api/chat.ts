import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { messages } = req.body

  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    return res.status(401).json({ error: 'No OpenRouter API key found' })
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo',
        messages
      })
    })

    const data = await response.json()
    return res.status(200).json(data)
  } catch (error) {
    console.error('❌ API error:', error)
    return res.status(500).json({ error: 'Something went wrong on the server.' })
  }
}
