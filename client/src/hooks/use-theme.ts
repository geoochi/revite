import { useState, useEffect } from 'react'

function useTheme() {
  const [theme, setTheme] = useState('')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      setTheme(savedTheme)
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
  }, [])

  useEffect(() => {
    // 保存主题到 localStorage
    if (!theme) return
    localStorage.setItem('theme', theme)
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return {
    theme,
    setTheme,
  }
}

export default useTheme
