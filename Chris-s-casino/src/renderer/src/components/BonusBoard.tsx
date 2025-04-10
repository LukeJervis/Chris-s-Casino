import React, { useState, useEffect } from 'react'
import '../styles/BonusBoard.css'

interface BonusBoardProps {
  onComplete: (winAmount: number) => void
  currentBet?: number
  level?: number // Add level prop
}

const BonusBoard: React.FC<BonusBoardProps> = ({ onComplete, currentBet = 1, level = 1 }) => {
  const [picks, setPicks] = useState(3)
  const [revealed, setRevealed] = useState<boolean[]>(Array(12).fill(false))
  const [prizes] = useState(() =>
    Array(12)
      .fill(0)
      .map(() => {
        // Reduced base values between 2-8 (was 5-15)
        const baseValue = Math.floor(Math.random() * 6) + 2

        // Reduced level multiplier: increases by 3% every level after 3 (was 5%)
        const levelMultiplier = level <= 3 ? 1 : 1 + (level - 3) * 0.03

        // Reduced chance for premium prizes
        const isPremium = Math.random() < (level >= 10 ? 0.15 : level >= 5 ? 0.08 : 0.03)
        const premiumMultiplier = isPremium ? 1.3 : 1 // Reduced from 1.5 to 1.3

        // Calculate final prize with reduced values
        return Math.floor(baseValue * currentBet * levelMultiplier * premiumMultiplier)
      })
  )
  const [isComplete, setIsComplete] = useState(false)

  const handleTileClick = (index: number): void => {
    if (picks > 0 && !revealed[index] && !isComplete) {
      const newRevealed = [...revealed]
      newRevealed[index] = true
      setRevealed(newRevealed)
      setPicks((prev) => prev - 1)

      if (picks === 1) {
        setIsComplete(true)
        const totalWin = calculateTotalWin(newRevealed)
        setTimeout(() => {
          onComplete(totalWin)
        }, 1500)
      }
    }
  }

  const calculateTotalWin = (revealedTiles: boolean[]): number => {
    // Calculate base win
    let totalWin = prizes.reduce((sum, prize, i) => (revealedTiles[i] ? sum + prize : sum), 0)

    // Reduced level-based bonus percentages
    if (level >= 15)
      totalWin = Math.floor(totalWin * 1.15) // 15% bonus at level 15+ (was 25%)
    else if (level >= 10)
      totalWin = Math.floor(totalWin * 1.1) // 10% bonus at level 10+ (was 15%)
    else if (level >= 5) totalWin = Math.floor(totalWin * 1.05) // 5% bonus at level 5+ (was 10%)

    return totalWin
  }

  const getRandomPrize = (): number => {
    const multipliers = [
      // Reduced multipliers
      1,
      1.5,
      2,
      2.5,
      3, // Common (lower) prizes
      4,
      5,
      6, // Medium prizes
      8,
      10,
      12, // Rare prizes
      15 // Super rare prize
    ]

    // Adjust weights to favor lower multipliers
    const weights = [
      30,
      25,
      20,
      15,
      12, // Common prizes (higher weights)
      10,
      8,
      6, // Medium prizes
      4,
      3,
      2, // Rare prizes
      1 // Super rare prize
    ]

    const totalWeight = weights.reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < multipliers.length; i++) {
      random -= weights[i]
      if (random <= 0) {
        return Math.ceil(currentBet * multipliers[i])
      }
    }

    return currentBet // Fallback to 1x bet
  }

  const getMaxPicks = (): number => {
    if (level >= 16) return 4
    if (level >= 12) return 3
    return 2
  }

  useEffect(() => {
    return () => {
      setIsComplete(false)
    }
  }, [])

  return (
    <div className="bonus-board">
      <div className="bonus-header">
        <h2>⭐ Bonus Round! ⭐</h2>
        <div className="picks-remaining">Picks remaining: {picks}</div>
        {level >= 5 && (
          <div className="level-bonus">
            Level {level} Bonus:{' '}
            {level >= 15 ? '25% Extra Win!' : level >= 10 ? '15% Extra Win!' : '10% Extra Win!'}
          </div>
        )}
      </div>
      <div className="bonus-grid">
        {prizes.map((prize, index) => (
          <div
            key={index}
            className={`bonus-tile ${revealed[index] ? 'revealed' : ''} ${
              isComplete ? 'game-complete' : ''
            }`}
            onClick={() => handleTileClick(index)}
          >
            {revealed[index] ? (
              <div className="prize-amount">£{prize}</div>
            ) : (
              <div className="tile-cover">?</div>
            )}
          </div>
        ))}
      </div>
      {isComplete && <div className="bonus-total">Total Win: £{calculateTotalWin(revealed)}</div>}
    </div>
  )
}

export default BonusBoard
