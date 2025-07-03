import  { useEffect, useState } from 'react'

const ThemeToggle = () => {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark'
  })

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [dark])

  return (
    <button
      onClick={() => setDark(prev => !prev)}
      className="fixed top-4 right-4 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1 rounded shadow"
    >
      {dark ? '🌞' : '🌜'}
    </button>
  )
}

export default ThemeToggle
