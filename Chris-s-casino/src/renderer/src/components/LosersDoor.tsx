import React, { useState } from 'react'
import '../styles/LosersDoor.css'

interface LosersDoorProps {
  onWin: (amount: number) => void
  onClose: () => void
  currentBet: number
}

const LosersDoor: React.FC<LosersDoorProps> = ({ onWin, onClose, currentBet }) => {
  const [selectedDoor, setSelectedDoor] = useState<number | null>(null)
  const [revealedDoor, setRevealedDoor] = useState<number | null>(null)
  const [winningDoor] = useState(() => Math.floor(Math.random() * 3))

  const handleDoorClick = (doorNumber: number) => {
    if (selectedDoor !== null || revealedDoor !== null) return

    setSelectedDoor(doorNumber)
    setRevealedDoor(doorNumber)

    if (doorNumber === winningDoor) {
      const winAmount = currentBet * 10
      setTimeout(() => {
        onWin(winAmount)
        onClose()
      }, 1500)
    } else {
      setTimeout(() => {
        onClose()
      }, 1500)
    }
  }

  return (
    <div className="losers-door-modal">
      <div className="losers-door-content">
        <h2>🚪 Loser's Door 🚪</h2>
        <p>Choose a door for a chance to win 10x your bet!</p>
        <div className="doors-container">
          {[0, 1, 2].map((doorNumber) => (
            <div
              key={doorNumber}
              className={`door ${selectedDoor === doorNumber ? 'selected' : ''} ${
                revealedDoor === doorNumber ? 'revealed' : ''
              }`}
              onClick={() => handleDoorClick(doorNumber)}
            >
              <div className="door-front">Door {doorNumber + 1}</div>
              <div className="door-back">
                {doorNumber === winningDoor ? (
                  <span className="win">
                    WIN!
                    <br />£{(currentBet * 10).toFixed(2)}
                  </span>
                ) : (
                  <span className="lose">LOSE</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default LosersDoor
