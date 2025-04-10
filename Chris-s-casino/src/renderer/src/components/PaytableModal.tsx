import React from 'react'
import '../styles/PaytableModal.css'

interface PaytableModalProps {
  onClose: () => void
  level: number
}

const PaytableModal: React.FC<PaytableModalProps> = ({ onClose, level }) => {
  const handleOverlayClick = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  // Helper function to determine which symbols to show
  const getAvailableSymbols = () => {
    const symbols = [
      {
        symbol: '🍒 Cherry',
        payout: `${level <= 4 ? '8x' : level <= 10 ? '6x' : '4x'}`
      },
      {
        symbol: '🍋 Lemon',
        payout: `${level <= 4 ? '6x' : level <= 10 ? '5x' : '3x'}`
      },
      {
        symbol: '🍊 Orange',
        payout: `${level <= 4 ? '5x' : level <= 10 ? '4x' : '3x'}`
      }
    ]

    if (level >= 4) {
      symbols.unshift(
        {
          symbol: '💎 Diamond',
          payout: `${level >= 5 && level <= 10 ? '10-15x' : '10x'}`
        },
        {
          symbol: '7️⃣ Seven',
          payout: `${level >= 5 && level <= 10 ? '8-12x' : '8x'}`
        }
      )
    }

    if (level >= 5) {
      symbols.push({
        symbol: '🎰 Slot',
        payout: `${level >= 5 && level <= 10 ? '6-10x' : '6x'}`
      })
    }

    return symbols
  }

  const getNextLevel = (): number => {
    if (level < 2) return 2
    if (level < 3) return 3
    if (level < 4) return 4
    if (level < 5) return 5
    if (level < 8) return 8
    if (level < 10) return 10
    if (level < 14) return 14
    if (level < 18) return 18
    return level
  }

  const getNextLevelFeatures = (): string => {
    if (level < 2) return 'View all reel positions, Snake Game (🐍), Max Bet £20'
    if (level < 3) return 'Bonus Round (⭐), Gamble Feature, Max Bet £30'
    if (level < 4) return 'Super Symbols (💎 7️⃣), Higher Payouts, Max Bet £40'
    if (level < 5) return 'Free Spins (🎲), Auto-Spin Feature, Max Bet £50'
    if (level < 8) return 'Higher/Lower Game (🎴), Max Bet £100'
    if (level < 10) return '4th Reel, New Win Combinations, 2x for 4 Matches'
    if (level < 14) return 'Top & Bottom Line Wins, Scratch Card Game (🎫)'
    if (level < 18) return '5th Reel, 3x for 5 Matches, Maximum Win Potential'
    return 'Maximum Level Reached!'
  }

  return (
    <div className="paytable-modal" onClick={handleOverlayClick}>
      <div className="paytable-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <h2>Paytable & Game Info</h2>

        <div className="paytable-section">
          <h3>Win Patterns</h3>
          <p>Match 3 or more symbols anywhere on a line to win!</p>
          <ul>
            <li>Symbols don't need to be consecutive</li>
            <li>Higher level = more win lines</li>
          </ul>
        </div>

        <div className="paytable-section">
          <h3>Symbol Values (Multiplied by Bet)</h3>
          <div className="symbol-values">
            {level >= 4 && (
              <>
                <div className="symbol-row">
                  <span>💎 Diamond</span>
                  <span>15x</span>
                </div>
                <div className="symbol-row">
                  <span>7️⃣ Seven</span>
                  <span>12x</span>
                </div>
              </>
            )}
            {level >= 5 && (
              <div className="symbol-row">
                <span>🎰 Slot</span>
                <span>10x</span>
              </div>
            )}
            <div className="symbol-row">
              <span>⭐ Star</span>
              <span>8x + Bonus</span>
            </div>
            <div className="symbol-row">
              <span>🍒 Cherry</span>
              <span>{level <= 4 ? 10 : level <= 10 ? 8 : 6}x</span>
            </div>
            <div className="symbol-row">
              <span>🍋 Lemon</span>
              <span>{level <= 4 ? 8 : level <= 10 ? 7 : 5}x</span>
            </div>
            <div className="symbol-row">
              <span>🍊 Orange</span>
              <span>{level <= 4 ? 7 : level <= 10 ? 6 : 4}x</span>
            </div>
          </div>
        </div>

        <div className="paytable-section">
          <h3>Feature Symbols (Need 3)</h3>
          <div className="feature-symbols">
            {level >= 2 && (
              <div className="symbol-row">
                <span>🐍 Snake</span>
                <span>Snakes & Ladders Game</span>
              </div>
            )}
            {level >= 5 && (
              <div className="symbol-row">
                <span>🎲 Dice</span>
                <span>3-9 Free Spins</span>
              </div>
            )}
            {level >= 8 && (
              <div className="symbol-row">
                <span>🎴 Cards</span>
                <span>Higher/Lower Game</span>
              </div>
            )}
            {level >= 12 && (
              <div className="symbol-row">
                <span>🎫 Ticket</span>
                <span>Scratch Card Game</span>
              </div>
            )}
          </div>
        </div>

        <div className="paytable-section">
          <h3>Feature Games</h3>

          {level >= 2 && (
            <div className="feature-info">
              <h4>🐍 Snakes & Ladders</h4>
              <p>
                Match 3 Snake symbols to play. Roll the dice and climb the board for multipliers.
                Watch out for snakes! Cash out anytime, but hit a snake and lose everything.
              </p>
            </div>
          )}

          {level >= 3 && (
            <div className="feature-info">
              <h4>⭐ Bonus Round</h4>
              <p>
                Match 3 Star symbols to trigger the bonus round. Pick cards to reveal instant
                prizes!
              </p>
            </div>
          )}

          {level >= 5 && (
            <div className="feature-info">
              <h4>🎲 Free Spins</h4>
              <p>
                Match 3 or more Dice symbols to win free spins. Each symbol awards 3 free spins!
              </p>
            </div>
          )}

          {level >= 8 && (
            <div className="feature-info">
              <h4>🎴 Higher or Lower</h4>
              <p>
                Match 3 Card symbols to play. Guess if the next card will be higher or lower. Each
                correct guess increases your multiplier!
              </p>
            </div>
          )}

          {level >= 14 && (
            <div className="feature-info">
              <h4>🎫 Scratch Card</h4>
              <p>Match 3 Ticket symbols to play the scratch card bonus game for instant prizes!</p>
            </div>
          )}
        </div>

        <div className="paytable-section">
          <h3>Win Lines & Special Features</h3>
          <ul>
            <li>Win on middle line</li>
            {level >= 14 && <li>Win on top, middle, and bottom lines</li>}
            {level >= 10 && level < 18 && <li>4 reels with 3-4 matching symbols required</li>}
            {level >= 18 && <li>5 reels with 3-5 matching symbols required</li>}
            {level >= 10 && <li>4 matching symbols pay 2x the normal win amount</li>}
            {level >= 18 && <li>5 matching symbols pay 3x the normal win amount</li>}
          </ul>
        </div>

        <div className="paytable-section">
          <h3>Next Level Unlock</h3>
          <div className="level-unlocks">
            {level < 18 && (
              <div className="level-item">
                <h4>Level {getNextLevel()}</h4>
                <p>{getNextLevelFeatures()}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaytableModal
