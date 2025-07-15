import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [fires, setFires] = useState([])
  const [lastCrashTime, setLastCrashTime] = useState(null)
  const [timeSinceLastCrash, setTimeSinceLastCrash] = useState(0)

  // Load saved count and last crash time on mount
  useEffect(() => {
    const storedCount = localStorage.getItem('crashoutCount')
    const storedLastCrash = localStorage.getItem('lastCrashTime')

    if (storedCount) setCount(parseInt(storedCount, 10))
    if (storedLastCrash) setLastCrashTime(parseInt(storedLastCrash, 10))
  }, [])

  // Save count to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('crashoutCount', count)
  }, [count])

  // Save lastCrashTime to localStorage whenever it changes
  useEffect(() => {
    if (lastCrashTime !== null) {
      localStorage.setItem('lastCrashTime', lastCrashTime)
    }
  }, [lastCrashTime])

  // Timer updates every second based on lastCrashTime
  useEffect(() => {
    if (!lastCrashTime) return

    const interval = setInterval(() => {
      setTimeSinceLastCrash(Math.floor((Date.now() - lastCrashTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [lastCrashTime])

  const handleClick = () => {
    setCount(prev => prev + 1)
    const now = Date.now()
    setLastCrashTime(now)
    setTimeSinceLastCrash(0)

    const newFires = Array.from({ length: 20 }, () => ({
      id: crypto.randomUUID(),
      left: Math.random() * 100 + 'vw',
      top: Math.random() * 100 + 'vh',
      size: Math.random() * 8 + 4,
      rotation: Math.random() * 360 + 'deg',
    }))

    setFires(prev => [...prev, ...newFires])

    setTimeout(() => {
      setFires(prev => prev.filter(f => !newFires.find(nf => nf.id === f.id)))
    }, 1200)
  }

  return (
    <div className="app-container">
      <h1 className="manufacturing-consent-regular">Crashout Counter</h1>
      <div className="card">
        <button onClick={handleClick}>
          CRASHOUT COUNT IS {count}
        </button>
        {lastCrashTime && (
          <p>Time since last Crashout: {timeSinceLastCrash} seconds</p>
        )}
        {lastCrashTime && (
          <p>Last Crashout at: {new Date(lastCrashTime).toLocaleString()}</p>
        )}
      </div>

      {fires.map(fire => (
        <div
          key={fire.id}
          className="fire-burst-fullscreen"
          style={{
            left: fire.left,
            top: fire.top,
            fontSize: `${fire.size}rem`,
            transform: `rotate(${fire.rotation})`,
          }}
        >
          🔥
        </div>
      ))}
    </div>
  )
}

export default App
