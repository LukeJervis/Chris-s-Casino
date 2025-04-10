import React, { useState } from 'react'
import '../styles/HigherLowerGame.css'

interface HigherLowerGameProps {
  onWin: (amount: number) => void
  onClose: () => void
  currentBet: number
}

const CARD_VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A']
const SUITS = ['♠', '♥', '♦', '♣']

interface Card {
  value: string
  suit: string
  numericValue: number
}

const HigherLowerGame: React.FC<HigherLowerGameProps> = ({ onWin, onClose, currentBet }) => {
  const [currentCard, setCurrentCard] = useState<Card>(getRandomCard())
  const [multiplier, setMultiplier] = useState(1)
  const [canPlay, setCanPlay] = useState(true)
  const [message, setMessage] = useState('')
  const [nextCard, setNextCard] = useState<Card | null>(null)

  function getRandomCard(): Card {
    const value = CARD_VALUES[Math.floor(Math.random() * CARD_VALUES.length)]
    const suit = SUITS[Math.floor(Math.random() * SUITS.length)]
    const numericValue = CARD_VALUES.indexOf(value)
    return { value, suit, numericValue }
  }

  const handleGuess = (higher: boolean): void => {
    if (!canPlay) return

    const newNextCard = getRandomCard()
    setNextCard(newNextCard)

    if (newNextCard.numericValue === currentCard.numericValue) {
      setCanPlay(false)
      setMessage('Equal value - Game Over!')
      setTimeout(() => {
        onWin(0)
        onClose()
      }, 2000)
      return
    }

    const isCorrect = higher
      ? newNextCard.numericValue > currentCard.numericValue
      : newNextCard.numericValue < currentCard.numericValue

    if (isCorrect) {
      setMultiplier((prev) => prev * 2)
      setMessage(
        `Correct! ${newNextCard.value}${newNextCard.suit} is ${higher ? 'higher' : 'lower'} than ${
          currentCard.value
        }${currentCard.suit} 🎉`
      )
      setTimeout(() => {
        setCurrentCard(newNextCard)
        setNextCard(null)
      }, 1000)
    } else {
      setCanPlay(false)
      setMessage(
        `Game Over! ${newNextCard.value}${newNextCard.suit} is ${
          higher ? 'not higher' : 'not lower'
        } than ${currentCard.value}${currentCard.suit}`
      )
      setTimeout(() => {
        onWin(0)
        onClose()
      }, 2000)
    }
  }

  const handleCashout = (): void => {
    const winAmount = currentBet * multiplier
    setMessage(`Cashed out for £${winAmount.toFixed(2)}!`)
    setCanPlay(false)
    setTimeout(() => {
      onWin(winAmount)
      onClose()
    }, 1500)
  }

  const getCardColor = (suit: string): string => (suit === '♥' || suit === '♦' ? 'red' : 'black')

  return (
    <div className="higher-lower-modal">
      <div className="higher-lower-game">
        <div className="game-header">
          <h2>Higher or Lower</h2>
          <div className="multiplier">Current Multiplier: {multiplier}x</div>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="cards-container">
          <div className="current-card">
            <div className={`card ${getCardColor(currentCard.suit)}`}>
              <div className="card-value">{currentCard.value}</div>
              <div className="card-suit">{currentCard.suit}</div>
            </div>
          </div>

          {nextCard && (
            <div className="next-card">
              <div className={`card ${getCardColor(nextCard.suit)}`}>
                <div className="card-value">{nextCard.value}</div>
                <div className="card-suit">{nextCard.suit}</div>
              </div>
            </div>
          )}
        </div>

        <div className="game-controls">
          <button className="higher-button" onClick={() => handleGuess(true)} disabled={!canPlay}>
            Higher ⬆️
          </button>
          <button className="cashout-button" onClick={handleCashout} disabled={!canPlay}>
            Cash Out (£{(currentBet * multiplier).toFixed(2)})
          </button>
          <button className="lower-button" onClick={() => handleGuess(false)} disabled={!canPlay}>
            Lower ⬇️
          </button>
        </div>

        {message && <div className="game-message">{message}</div>}
      </div>
    </div>
  )
}

export default HigherLowerGame
