import React, { useState, useEffect } from 'react'
import '../styles/Reel.css'

interface ReelProps {
  symbols: string[]
  isSpinning: boolean
  showAllSymbols: boolean
  isFreeSpins?: boolean
  level?: number
}

const Reel: React.FC<ReelProps> = ({
  symbols,
  isSpinning,
  showAllSymbols,
  isFreeSpins = false,
  level = 1
}) => {
  const [spinningSymbols, setSpinningSymbols] = useState(['?', '?', '?'])
  const allSymbols = ['🍒', '🍋', '🍊', '💎', '7️⃣', '🎰', '⭐', '🐍', '🎲', '🎴']

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isSpinning) {
      interval = setInterval(
        () => {
          setSpinningSymbols(
            Array(3)
              .fill(null)
              .map(() => allSymbols[Math.floor(Math.random() * allSymbols.length)])
          )
        },
        isFreeSpins ? 50 : 80
      )
    } else {
      setSpinningSymbols(symbols)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isSpinning, symbols, isFreeSpins])

  return (
    <div className={`reel ${isSpinning ? 'flickering' : ''} ${isFreeSpins ? 'fast-spin' : ''}`}>
      {showAllSymbols ? (
        <>
          <div className={`symbol top ${level >= 14 ? 'active' : ''}`}>
            {isSpinning ? spinningSymbols[0] : symbols[0]}
          </div>
          <div className="symbol middle">{isSpinning ? spinningSymbols[1] : symbols[1]}</div>
          <div className={`symbol bottom ${level >= 14 ? 'active' : ''}`}>
            {isSpinning ? spinningSymbols[2] : symbols[2]}
          </div>
          {level >= 14 && <div className="win-line top" />}
          <div className="win-line middle" />
          {level >= 14 && <div className="win-line bottom" />}
        </>
      ) : (
        <div className="symbol middle">{isSpinning ? spinningSymbols[1] : symbols[1]}</div>
      )}
    </div>
  )
}

export default Reel
