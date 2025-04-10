import React, { useState } from 'react'
import '../styles/GambleFeature.css'

interface GambleFeatureProps {
  winAmount: number
  onComplete: (finalWinAmount: number) => void
}

const GambleFeature: React.FC<GambleFeatureProps> = ({ winAmount, onComplete }) => {
  const [currentWin, setCurrentWin] = useState(winAmount)
  const [isRevealed, setIsRevealed] = useState(false)
  const [selectedCard, setSelectedCard] = useState<'red' | 'black' | null>(null)
  const [correctCard, setCorrectCard] = useState<'red' | 'black'>('red')
  const [isLost, setIsLost] = useState(false)

  const handleCardSelect = (color: 'red' | 'black') => {
    if (isRevealed) return
    setSelectedCard(color)
  }

  const handleGamble = () => {
    if (!selectedCard || isLost) return

    const result = Math.random() < 0.5 ? 'red' : 'black'
    setCorrectCard(result)
    setIsRevealed(true)

    if (selectedCard !== result) {
      setIsLost(true)
      // Call onComplete with 0 immediately to prevent quick collections
      onComplete(0)
    } else {
      setTimeout(() => {
        setCurrentWin((prev) => prev * 2)
        setIsRevealed(false)
        setSelectedCard(null)
      }, 1500)
    }
  }

  return (
    <div className="gamble-feature">
      <div className="gamble-content">
        <h2>Gamble Feature</h2>
        <div className="gamble-amount">Current Win: £{currentWin.toFixed(2)}</div>
        <div className="gamble-instructions">
          Choose Red or Black to double your win!
          <br />
          Or collect your current win.
        </div>

        <div className="cards-container">
          <div
            className={`card red ${selectedCard === 'red' ? 'selected' : ''} ${
              isRevealed && correctCard === 'red' ? 'correct' : ''
            }`}
            onClick={() => handleCardSelect('red')}
          >
            ♥
          </div>
          <div
            className={`card black ${selectedCard === 'black' ? 'selected' : ''} ${
              isRevealed && correctCard === 'black' ? 'correct' : ''
            }`}
            onClick={() => handleCardSelect('black')}
          >
            ♠
          </div>
        </div>

        <div className="gamble-controls">
          <button
            className="gamble-button"
            onClick={handleGamble}
            disabled={!selectedCard || isRevealed || isLost}
          >
            Gamble
          </button>
          <button
            className="collect-button"
            onClick={() => onComplete(currentWin)}
            disabled={isLost || isRevealed}
          >
            Collect £{currentWin.toFixed(2)}
          </button>
        </div>
      </div>
    </div>
  )
}

export default GambleFeature
