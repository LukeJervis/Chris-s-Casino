import React, { useState } from 'react'
import '../styles/ScratchCard.css'

interface ScratchCardProps {
  onWin: (amount: number) => void
  onClose: () => void
  currentBet: number
}

const ScratchCard: React.FC<ScratchCardProps> = ({ onWin, onClose, currentBet }) => {
  const [revealed, setRevealed] = useState<boolean[]>(Array(9).fill(false))
  const [symbols] = useState(() => generateSymbols())
  const [isComplete, setIsComplete] = useState(false)
  const [message, setMessage] = useState('')
  const [scratchesLeft, setScratchesLeft] = useState(6)

  function generateSymbols(): string[] {
    const possibleSymbols = ['💎', '7️⃣', '🎰', '⭐', '🍒']
    const winChance = Math.random()

    if (winChance < 0.4) {
      // 40% chance of winning
      const winningSymbol = possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)]
      const winCount = Math.random() < 0.2 ? 3 : Math.random() < 0.5 ? 2 : 1
      const positions = Array(9).fill(null)

      // Place winning symbols
      for (let i = 0; i < winCount; i++) {
        let pos
        do {
          pos = Math.floor(Math.random() * 9)
        } while (positions[pos] !== null)
        positions[pos] = winningSymbol
      }

      // Fill remaining positions
      for (let i = 0; i < 9; i++) {
        if (positions[i] === null) {
          let symbol
          do {
            symbol = possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)]
          } while (symbol === winningSymbol)
          positions[i] = symbol
        }
      }
      return positions
    }

    // No win - all different symbols
    return Array(9)
      .fill(null)
      .map(() => possibleSymbols[Math.floor(Math.random() * possibleSymbols.length)])
  }

  const handleScratch = (index: number): void => {
    if (isComplete || scratchesLeft <= 0 || revealed[index]) return

    const newRevealed = [...revealed]
    newRevealed[index] = true
    setRevealed(newRevealed)
    const remainingScratchesAfterThis = scratchesLeft - 1
    setScratchesLeft(remainingScratchesAfterThis)

    // Check for win after every scratch
    const winResult = checkWin(newRevealed)

    // Only handle game completion if there wasn't a win
    if (remainingScratchesAfterThis === 0 && !winResult) {
      setIsComplete(true)
      setMessage('You lose! Better luck next time! ��')
      setTimeout(() => {
        onWin(0)
        onClose()
      }, 1500)
    }
  }

  const checkWin = (newRevealed: boolean[]): boolean => {
    // Get all revealed symbols
    const revealedSymbols = symbols.filter((_, i) => newRevealed[i])

    // Count occurrences of each symbol
    const counts: { [key: string]: number } = {}
    revealedSymbols.forEach((symbol) => {
      counts[symbol] = (counts[symbol] || 0) + 1
    })

    // Check for winning combinations (3 or more matching symbols)
    for (const [symbol, count] of Object.entries(counts)) {
      if (count >= 3) {
        const multipliers: { [key: string]: number } = {
          '💎': 50,
          '7️⃣': 25,
          '🎰': 15,
          '⭐': 10,
          '🍒': 5
        }

        const winAmount = currentBet * (multipliers[symbol] || 3)
        setMessage(`🎉 Winner! ${symbol} x3 - £${winAmount.toFixed(2)}`)
        setIsComplete(true)
        setTimeout(() => {
          onWin(winAmount)
          onClose()
        }, 1500)
        return true // Return true to indicate a win
      }
    }
    return false // Return false if no win found
  }

  return (
    <div className="scratch-card-modal">
      <div className="scratch-card">
        <div className="game-header">
          <h2>Scratch Card</h2>
          <div className="bet-amount">
            Bet: £{currentBet.toFixed(2)}
            <div className="scratches-left">Scratches Left: {scratchesLeft}</div>
          </div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="scratch-grid">
          {symbols.map((symbol, index) => (
            <div
              key={index}
              className={`scratch-cell ${revealed[index] ? 'revealed' : ''} ${
                scratchesLeft === 0 && !revealed[index] ? 'disabled' : ''
              }`}
              onClick={() => handleScratch(index)}
            >
              {revealed[index] ? symbol : '?'}
            </div>
          ))}
        </div>

        {message && <div className="game-message">{message}</div>}
      </div>
    </div>
  )
}

export default ScratchCard
