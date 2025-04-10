import React, { useState, useEffect } from 'react'
import '../styles/SnakeGame.css'

interface SnakeGameProps {
  onWin: (amount: number, message?: string) => void
  onClose: () => void
  currentBet: number
}

interface Square {
  number: number
  hasSnake?: boolean
  hasLadder?: boolean
  destination?: number
}

const SnakeGame: React.FC<SnakeGameProps> = ({ onWin, onClose, currentBet }) => {
  const [position, setPosition] = useState(1)
  const [canRoll, setCanRoll] = useState(true)
  const [lastRoll, setLastRoll] = useState(0)
  const [message, setMessage] = useState('')
  const [isGameOver, setIsGameOver] = useState(false)
  const [timeouts, setTimeouts] = useState<NodeJS.Timeout[]>([])

  // Clear all timeouts when component unmounts
  useEffect(() => {
    return () => {
      timeouts.forEach((timeout) => clearTimeout(timeout))
    }
  }, [timeouts])

  // Helper to safely set timeouts
  const safeSetTimeout = (callback: () => void, delay: number) => {
    const timeout = setTimeout(callback, delay)
    setTimeouts((prev) => [...prev, timeout])
    return timeout
  }

  // Updated board with more snakes
  const board: Square[] = Array.from({ length: 36 }, (_, i) => ({
    number: i + 1,
    hasSnake: [35, 33, 31, 28, 25, 21, 19, 15, 12].includes(i + 1), // Added more snakes
    hasLadder: [2, 7, 11, 16, 22].includes(i + 1), // Changed ladder from 17 to 16 to avoid snake
    destination: {
      35: 8, // Snakes
      33: 3,
      31: 14,
      28: 12,
      25: 4,
      21: 9,
      19: 6,
      15: 2,
      12: 5,
      2: 18, // Ladders (adjusted to avoid snakes)
      7: 13,
      11: 24,
      16: 29,
      22: 32
    }[i + 1]
  }))

  // Add ladder colors for each destination
  const LADDER_COLORS: { [key: number]: string } = {
    18: '#4CAF50', // Green ladder
    13: '#2196F3', // Blue ladder
    24: '#9C27B0', // Purple ladder
    29: '#FF9800', // Orange ladder
    32: '#E91E63' // Pink ladder
  }

  const getCurrentMultiplier = (): number => {
    return Math.floor((position / 36) * 25) + 1
  }

  const handleCashout = (): void => {
    const winAmount = currentBet * getCurrentMultiplier()
    const cashoutMessage = `🎲 Snakes & Ladders: Cashed out for £${winAmount.toFixed(2)}!`
    setMessage(cashoutMessage)
    onWin(winAmount, cashoutMessage)
    onClose()
  }

  const rollDice = (): void => {
    if (!canRoll) return

    setCanRoll(false)
    const roll = Math.floor(Math.random() * 6) + 1
    setLastRoll(roll)

    const newPosition = position + roll

    // Win if you reach or pass 36
    if (newPosition >= 36) {
      const winAmount = currentBet * 50
      setIsGameOver(true)
      setPosition(36)
      const winMessage = `🎉 MEGA JACKPOT! 🎉 You won £${winAmount.toFixed(2)}! 🏆`
      setMessage(winMessage)
      onWin(winAmount, winMessage)
      safeSetTimeout(() => onClose(), 2000)
      return
    }

    const square = board[newPosition - 1]
    setPosition(newPosition)

    if (square && square.hasSnake) {
      setIsGameOver(true)
      const loseMessage = '💀 GAME OVER! You hit a snake! 🐍'
      setMessage(loseMessage)
      onWin(0, loseMessage)
      safeSetTimeout(() => onClose(), 1500)
    } else if (square && square.hasLadder && square.destination) {
      safeSetTimeout(() => {
        setMessage('🪜 Nice! Ladder!')
        setPosition(square.destination)
        setCanRoll(true)
      }, 500)
    } else {
      safeSetTimeout(() => {
        setCanRoll(true)
      }, 500)
    }
  }

  // Fix the ladder destination helper function
  const isLadderDestination = (squareNumber: number): number | null => {
    // Check each ladder's destination
    for (const square of board) {
      if (square.hasLadder && square.destination === squareNumber) {
        return square.number
      }
    }
    return null
  }

  return (
    <div className="snake-game-modal">
      <div className={`snake-game ${isGameOver && position < 36 ? 'game-over' : ''}`}>
        <div className="game-header">
          <h2>Snakes & Ladders</h2>
          <div className="multiplier-display">Current Multiplier: {getCurrentMultiplier()}x</div>
        </div>

        <div className="game-board">
          {board.map((square, index) => {
            const color = square.hasLadder
              ? LADDER_COLORS[square.destination!]
              : square.number ===
                  board.find((s) => s.hasLadder && s.destination === square.number)?.destination
                ? LADDER_COLORS[square.number]
                : undefined

            return (
              <div
                key={index}
                className={`square ${position === square.number ? 'current' : ''} ${
                  square.hasSnake ? 'snake' : ''
                } ${square.hasLadder ? 'ladder' : ''} ${isGameOver && position < 36 ? 'lost' : ''}`}
                style={{
                  ...(color && {
                    borderColor: color,
                    backgroundColor: `${color}22`
                  })
                }}
              >
                {square.number}
                {position === square.number && (isGameOver && position < 36 ? '💀' : '🔵')}
                {square.hasSnake && '🐍'}
                {square.hasLadder && <div className="ladder-info">🪜</div>}
              </div>
            )
          })}
        </div>

        <div className="game-controls">
          <div className="dice-display">Last Roll: {lastRoll || '-'}</div>
          <div className="game-buttons">
            <button onClick={rollDice} disabled={!canRoll || isGameOver}>
              Roll Dice (1-6)
            </button>
            <button
              className="cashout-button"
              onClick={handleCashout}
              disabled={!canRoll || isGameOver}
            >
              Cash Out (£{(currentBet * getCurrentMultiplier()).toFixed(2)})
            </button>
          </div>
          {message && (
            <div
              className={`game-message ${isGameOver && position < 36 ? 'game-over-message' : ''}`}
            >
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default SnakeGame
