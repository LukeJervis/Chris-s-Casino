import React, { useState, useEffect } from 'react'
import Reel from './Reel'
import BonusBoard from './BonusBoard'
import GambleFeature from './GambleFeature'
import PaytableModal from './PaytableModal'
import LevelSystem from './LevelSystem'
import SnakeGame from './SnakeGame'
import HigherLowerGame from './HigherLowerGame'
import ScratchCard from './ScratchCard'
import LosersDoor from './LosersDoor'
import '../styles/SlotMachine.css'

interface SlotMachineProps {
  // Remove initialBalance if not used
}

const SlotMachine: React.FC = () => {
  const [balance, setBalance] = useState(100)
  const [bet, setBet] = useState(1)
  const [isSpinning, setIsSpinning] = useState(false)
  const [reelSymbols, setReelSymbols] = useState<string[][]>([])
  const [isBonusActive, setIsBonusActive] = useState(false)
  const [lastWin, setLastWin] = useState(0)
  const [message, setMessage] = useState('')
  const [showGamble, setShowGamble] = useState(false)
  const [pendingWin, setPendingWin] = useState(0)
  const [showPaytable, setShowPaytable] = useState(false)
  const [level, setLevel] = useState(1)
  const [xp, setXp] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [showSnakeGame, setShowSnakeGame] = useState(false)
  const [freeSpins, setFreeSpins] = useState(0)
  const [isAutoSpinning, setIsAutoSpinning] = useState(false)
  const [showGameOver, setShowGameOver] = useState(false)
  const [showHigherLower, setShowHigherLower] = useState(false)
  const [showScratchCard, setShowScratchCard] = useState(false)
  const [isFeatureActive, setIsFeatureActive] = useState(false)
  const [freeLosses, setFreeLosses] = useState(0)
  const [consecutiveLosses, setConsecutiveLosses] = useState(0)
  const [showLosersDoor, setShowLosersDoor] = useState(false)

  const getRandomSymbol = (isFreeSpin = false): string => {
    const reelCount = getReelCount(level)
    const reelMultiplier = reelCount >= 5 ? 0.7 : reelCount >= 4 ? 0.8 : 1

    const availableSymbols: { [key: string]: number } = {
      // Basic symbols with weights that improve with levels
      '🍒': level <= 3 ? 100 : level <= 6 ? 80 : level <= 10 ? 60 : 40,
      '🍋': level <= 3 ? 85 : level <= 6 ? 65 : level <= 10 ? 45 : 35,
      '🍊': level <= 3 ? 65 : level <= 6 ? 50 : level <= 10 ? 35 : 25
    }

    // Feature symbols get adjusted by reel count
    if (level >= 2) {
      // Snake game - keep it more common
      availableSymbols['🐍'] = Math.floor(
        (level >= 10 ? 20 : level >= 6 ? 25 : 20) * reelMultiplier
      )
    }

    if (level >= 3) {
      // Bonus stars - increase frequency
      availableSymbols['⭐'] = Math.floor(
        (level >= 10 ? 18 : level >= 7 ? 20 : 15) * reelMultiplier
      )
    }

    if (level >= 5 && !isFreeSpin) {
      // Free spins - keep them fairly common
      availableSymbols['🎲'] = Math.floor(
        (level >= 10 ? 22 : level >= 6 ? 20 : 15) * reelMultiplier
      )
    }

    if (level >= 8) {
      // Higher/Lower game
      availableSymbols['🎴'] = Math.floor((level >= 10 ? 18 : 15) * reelMultiplier)
    }

    if (level >= 12) {
      // Scratch card
      availableSymbols['🎫'] = Math.floor((level >= 15 ? 18 : 15) * reelMultiplier)
    }

    // High-value symbols don't need adjustment
    if (level >= 4) {
      availableSymbols['💎'] = level >= 16 ? 25 : level >= 12 ? 20 : 15
      availableSymbols['7️⃣'] = level >= 16 ? 25 : level >= 12 ? 20 : 15
      availableSymbols['🎰'] = level >= 13 ? 20 : 15
    }

    const totalWeight = Object.values(availableSymbols).reduce((a, b) => a + b, 0)
    let random = Math.random() * totalWeight

    for (const [symbol, weight] of Object.entries(availableSymbols)) {
      random -= weight
      if (random <= 0) return symbol
    }
    return '🍒'
  }

  const handleSpin = (): void => {
    if (isSpinning || (balance < bet && freeSpins === 0)) return

    setIsSpinning(true)
    setLastWin(0)
    setMessage('')

    const reelCount = getReelCount(level)

    // Update the base win chance calculation
    const baseWinChance = 0.95 // Keep 95% win rate for all levels

    // Guarantee a win every 3rd free spin and increase base win chance
    const shouldForceWin = freeSpins > 0 && freeLosses >= 2
    const winChance =
      freeSpins > 0 ? (shouldForceWin ? 1 : Math.min(baseWinChance + 0.2, 0.95)) : baseWinChance

    // Improved symbol distribution during free spins
    const getSpinSymbols = () => {
      if (freeSpins > 0) {
        // During free spins, prioritize higher value symbols
        const winningSymbol = shouldForceWin
          ? ['💎', '7️⃣', '🎰', '⭐'][Math.floor(Math.random() * 4)]
          : getRandomSymbol(true) // Pass true for free spins

        return Array(3)
          .fill(null)
          .map((_, index) => {
            if (index === 1) return winningSymbol
            return Math.random() < 0.8 ? winningSymbol : getRandomSymbol(true)
          })
      }
      // Normal spins use regular random distribution
      return Array(3)
        .fill(null)
        .map((_, index) => (index === 1 ? getRandomSymbol() : getRandomSymbol()))
    }

    // Generate new reels
    const newReels =
      Math.random() < winChance
        ? Array(reelCount)
            .fill(null)
            .map(() => getSpinSymbols())
        : Array(reelCount)
            .fill(null)
            .map(() =>
              Array(3)
                .fill(null)
                .map(() => getRandomSymbol(freeSpins > 0))
            )

    // Update reels after a short delay
    setTimeout(() => {
      setReelSymbols(newReels)
      setIsSpinning(false)

      // Process wins and features
      processWinAndFeatures(newReels)

      // Only deduct bet if it's not a free spin and there was no win
      if (freeSpins === 0 && !checkWinBeforeDeduct(newReels)) {
        setBalance((prev) => prev - bet)
      }
    }, 500)
  }

  // New function to check wins without deducting balance
  const checkWinBeforeDeduct = (reels: string[][]): boolean => {
    // Check for any winning condition
    let hasWin = false

    // Check for snakes
    if (level >= 2) {
      const snakeCount = reels.flat().filter((symbol) => symbol === '🐍').length
      if (snakeCount >= 3) {
        hasWin = true
      }
    }

    // Check for free spins symbols
    const freeSpinSymbols = reels.flat().filter((symbol) => symbol === '🎲').length
    if (freeSpinSymbols >= 3) {
      hasWin = true
    }

    // Check for scratch card symbols
    if (level >= 12) {
      const scratchCount = reels.flat().filter((symbol) => symbol === '🎫').length
      if (scratchCount >= 3) {
        hasWin = true
      }
    }

    // Check for cards
    if (level >= 8) {
      const cardCount = reels.flat().filter((symbol) => symbol === '🎴').length
      if (cardCount >= 3) {
        hasWin = true
      }
    }

    // Check for winning combinations
    const middleRow = reels.map((reel) => reel[1])
    const topRow = reels.map((reel) => reel[0])
    const bottomRow = reels.map((reel) => reel[2])

    const checkLineForWin = (line: string[]): boolean => {
      const symbolCounts = new Map<string, number>()

      // Count occurrences of each symbol
      line.forEach((symbol) => {
        symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1)
      })

      // Check if any symbol has enough matches (3 or more only)
      for (const [symbol, count] of symbolCounts) {
        if (count >= 3) {
          return true
        }
      }
      return false
    }

    // Check middle row
    if (checkLineForWin(middleRow)) {
      hasWin = true
    }

    // Check top and bottom rows if level >= 14
    if (level >= 14) {
      if (checkLineForWin(topRow) || checkLineForWin(bottomRow)) {
        hasWin = true
      }
    }

    return hasWin
  }

  // Add new function to process wins and features
  const processWinAndFeatures = (reels: string[][]): void => {
    let shouldReturn = false
    let winAmount = 0
    let winMessage = ''

    // Process feature triggers
    if (level >= 2) {
      const snakeCount = reels.flat().filter((symbol) => symbol === '🐍').length
      if (snakeCount >= 3) {
        setShowSnakeGame(true)
        setIsFeatureActive(true)
        setConsecutiveLosses(0) // Reset on snake game trigger
        shouldReturn = true
      }
    }

    const freeSpinSymbols = reels.flat().filter((symbol) => symbol === '🎲').length
    if (freeSpinSymbols >= 3) {
      const newFreeSpins = freeSpinSymbols * 3
      setFreeSpins((prev) => prev + newFreeSpins)
      setMessage(`Won ${newFreeSpins} Free Spins! 🎲`)
      setConsecutiveLosses(0)
      setIsAutoSpinning(true)
    }

    if (level >= 12) {
      const scratchCount = reels.flat().filter((symbol) => symbol === '🎫').length
      if (scratchCount >= 3) {
        setShowScratchCard(true)
        setIsFeatureActive(true)
        setMessage('🎫 Scratch Card Bonus Game Triggered!')
        setConsecutiveLosses(0) // Reset on scratch card trigger
        shouldReturn = true
      }
    }

    if (level >= 8) {
      const cardCount = reels.flat().filter((symbol) => symbol === '🎴').length
      if (cardCount >= 3) {
        setShowHigherLower(true)
        setIsFeatureActive(true)
        setConsecutiveLosses(0) // Reset on higher/lower trigger
        shouldReturn = true
      }
    }

    // Add this before checking line wins
    if (level >= 3) {
      const starCount = reels.flat().filter((symbol) => symbol === '⭐').length
      if (starCount >= 3) {
        setIsBonusActive(true)
        setIsFeatureActive(true)
        setMessage('⭐ BONUS ROUND TRIGGERED!')
        setConsecutiveLosses(0)
        shouldReturn = true
        // Add this to prevent further processing if bonus is triggered
        return
      }
    }

    // Then update the checkLine function to remove star bonus trigger
    const checkLine = (line: string[], position: string): void => {
      const symbolCounts = new Map<string, number>()

      // Count occurrences of each symbol
      line.forEach((symbol) => {
        symbolCounts.set(symbol, (symbolCounts.get(symbol) || 0) + 1)
      })

      // Process each symbol's matches
      for (const [symbol, matchCount] of symbolCounts) {
        if (matchCount >= 3) {
          const baseMultipliers: { [key: string]: number } = {
            '💎': 15,
            '7️⃣': 12,
            '🎰': 10,
            '🍒': level <= 4 ? 10 : level <= 10 ? 8 : 6,
            '🍋': level <= 4 ? 8 : level <= 10 ? 7 : 5,
            '🍊': level <= 4 ? 7 : level <= 10 ? 6 : 4
          }

          let multiplier = baseMultipliers[symbol] || 8

          if (level >= 12) multiplier *= 1.3
          if (level >= 16) multiplier *= 1.4
          if (level >= 20) {
            const extraLevels = level - 20
            const extraMultiplier = 1 + Math.floor(extraLevels / 5) * 0.15
            multiplier *= extraMultiplier
          }

          // Remove 2-symbol win reduction since we no longer have 2-symbol wins
          const multiReelBonus =
            level >= 18 && matchCount === 5 ? 4 : level >= 10 && matchCount === 4 ? 2.5 : 1

          // Calculate win and round up to nearest pound
          const lineWin = Math.ceil(bet * multiplier * multiReelBonus)
          winAmount += lineWin

          const lineMsg = `${position}: ${symbol} x${matchCount}`
          winMessage = winMessage ? `${winMessage} | ${lineMsg}` : lineMsg
        }
      }
    }

    const middleRow = reels.map((reel) => reel[1])
    const topRow = reels.map((reel) => reel[0])
    const bottomRow = reels.map((reel) => reel[2])

    checkLine(middleRow, 'Middle')
    if (level >= 14) {
      checkLine(topRow, 'Top')
      checkLine(bottomRow, 'Bottom')
    }

    // Process wins
    if (winAmount > 0) {
      if (freeSpins > 0) {
        setFreeLosses(0)
        setBalance((prev) => prev + winAmount)
        setLastWin(winAmount)
        setMessage((prev) => (prev ? `${prev} | ${winMessage}` : winMessage))
        addXp(winAmount)
      } else {
        setLastWin(winAmount)
        setMessage((prev) => (prev ? `${prev} | ${winMessage}` : winMessage))
        setPendingWin(winAmount)
        if (!shouldReturn) {
          setShowGamble(true)
        } else {
          setBalance((prev) => prev + winAmount)
        }
        addXp(winAmount)
        setConsecutiveLosses(0) // Reset consecutive losses on regular spin wins
      }
    } else {
      // Handle losses
      if (freeSpins > 0) {
        setFreeLosses((prev) => prev + 1)
      } else {
        // Only update consecutive losses on regular spins
        setConsecutiveLosses((prev) => {
          const newLosses = prev + 1
          if (newLosses >= 10) {
            setShowLosersDoor(true)
            return 0 // Reset consecutive losses
          }
          return newLosses
        })
      }
      setMessage(freeSpins > 0 ? `Free Spins Left: ${freeSpins}` : 'Try again!')
    }
  }

  const changeBet = (amount: number): void => {
    const maxBet = getMaxBet(level)
    const newBet = Math.max(1, Math.min(bet + amount, maxBet))
    setBet(newBet)
  }

  const getXpNeeded = (currentLevel: number): number => {
    // Base XP needed increases more steeply in early levels
    const baseXp = currentLevel <= 5 ? 100 : 75

    // Exponential growth factor is higher for early levels
    const growthFactor = currentLevel <= 5 ? 1.5 : 1.3

    return Math.floor(baseXp * Math.pow(growthFactor, currentLevel - 1))
  }

  const getMaxBet = (currentLevel: number): number => {
    // Max bet increases with level
    if (currentLevel >= 20) return 1000
    if (currentLevel >= 18) return 500
    if (currentLevel >= 15) return 200
    if (currentLevel >= 13) return 150
    if (currentLevel >= 10) return 100
    if (currentLevel >= 8) return 50
    if (currentLevel >= 4) return 40
    if (currentLevel >= 3) return 30
    if (currentLevel >= 2) return 20
    return 10
  }

  const getUnlockedFeatures = (currentLevel: number): string[] => {
    const features: string[] = []

    // Add features based on level
    if (currentLevel >= 1) {
      features.push('Basic Slots', 'Gamble Feature')
    }
    if (currentLevel >= 2) {
      features.push('Snake Game', 'View All Positions')
    }
    if (currentLevel >= 3) {
      features.push('Bonus Round', 'Star Symbol')
    }
    if (currentLevel >= 4) {
      features.push('Diamond & Seven Symbols')
    }
    if (currentLevel >= 5) {
      features.push('Free Spins', 'Auto-Spin')
    }
    if (currentLevel >= 8) {
      features.push('Higher/Lower Game')
    }
    if (currentLevel >= 10) {
      features.push('4th Reel', '2x Four Symbol Wins')
    }
    if (currentLevel >= 12) {
      features.push('Scratch Card Game')
    }
    if (currentLevel >= 14) {
      features.push('Multi-line Wins')
    }
    if (currentLevel >= 18) {
      features.push('5th Reel', '3x Five Symbol Wins')
    }

    return features
  }

  const addXp = (winAmount: number): void => {
    // Base XP gain varies by level with reduced early gains
    let xpMultiplier
    if (level <= 3) {
      xpMultiplier = 0.5 // Reduced from 0.75
    } else if (level <= 10) {
      xpMultiplier = 0.3 // Reduced from 0.4
    } else {
      xpMultiplier = 0.2 // Reduced from 0.25
    }

    let xpGain = Math.floor(winAmount * xpMultiplier)

    // Bonus XP for bigger wins (slightly reduced)
    if (winAmount >= 100)
      xpGain = Math.round(xpGain * 1.1) // Reduced from 1.15
    else if (winAmount >= 50)
      xpGain = Math.round(xpGain * 1.05) // Reduced from 1.1
    else if (winAmount >= 25) xpGain = Math.round(xpGain * 1.02) // Reduced from 1.05

    // Add the XP with debug logging
    setXp((prevXp) => {
      const newXp = Math.round(prevXp + xpGain)
      const xpNeeded = getXpNeeded(level)

      if (newXp >= xpNeeded) {
        setLevel((prevLevel) => {
          const newLevel = prevLevel + 1
          setShowLevelUp(true)
          setTimeout(() => {
            setShowLevelUp(false)
            if (freeSpins > 0) {
              setIsAutoSpinning(true)
            }
          }, 3000)
          return newLevel
        })
        return Math.round(newXp - xpNeeded)
      }
      return newXp
    })
  }

  const handleFeatureComplete = (): void => {
    setIsFeatureActive(false)
    setIsBonusActive(false) // Ensure bonus state is cleared

    // Add a delay before restarting free spins
    if (freeSpins > 0) {
      setTimeout(() => {
        setIsAutoSpinning(true)
        // Force an initial spin after a short delay
        setTimeout(() => {
          if (freeSpins > 0) {
            autoSpin()
          }
        }, 100)
      }, 500)
    }
  }

  const autoSpin = (): void => {
    if (freeSpins > 0 && !isSpinning) {
      handleSpin()
      setFreeSpins((prev) => {
        const newFreeSpins = prev - 1
        if (newFreeSpins === 0) {
          setIsAutoSpinning(false)
          setMessage('Free Spins Complete!')
        }
        return newFreeSpins
      })
    }
  }

  useEffect(() => {
    let spinTimer: NodeJS.Timeout

    // Only check essential blocking conditions
    const isBlocked =
      isSpinning ||
      showSnakeGame ||
      showHigherLower ||
      isBonusActive ||
      showScratchCard ||
      showLosersDoor

    if (freeSpins > 0 && isAutoSpinning && !isBlocked) {
      spinTimer = setTimeout(autoSpin, 1000)
    }

    return (): void => {
      if (spinTimer) clearTimeout(spinTimer)
    }
  }, [
    freeSpins,
    isSpinning,
    isAutoSpinning,
    showSnakeGame,
    showHigherLower,
    isBonusActive,
    showScratchCard,
    showLosersDoor
  ])

  // Update the reset function
  const resetGame = (): void => {
    setBalance(100) // Reset to £100
    setLevel(1) // Reset level
    setXp(0) // Reset XP
    setBet(1) // Reset bet to £1
    setLastWin(0) // Clear last win
    setMessage('Game Over! Starting fresh with £100')
    setReelSymbols([]) // Clear reels
    setShowGameOver(false)
    setFreeSpins(0) // Reset free spins
    setPendingWin(0) // Clear pending wins
    setShowGamble(false) // Hide gamble feature
    setShowHigherLower(false) // Hide higher/lower game
    setShowScratchCard(false) // Hide scratch card
    setIsBonusActive(false) // Disable bonus round
    setConsecutiveLosses(0) // Reset consecutive losses counter
    setShowLosersDoor(false) // Hide losers door if showing
  }

  // Update the checkGameOver function
  const checkGameOver = (): void => {
    if (
      balance <= 0 &&
      freeSpins === 0 &&
      !pendingWin &&
      !showSnakeGame &&
      !showHigherLower &&
      !isBonusActive &&
      !showScratchCard &&
      !showLosersDoor // Add check for Loser's Door
    ) {
      setShowGameOver(true)
      setTimeout(resetGame, 1000)
    }
  }

  // Also update the useEffect dependencies
  useEffect(() => {
    checkGameOver()
  }, [
    balance,
    freeSpins,
    pendingWin,
    showSnakeGame,
    showHigherLower,
    isBonusActive,
    showScratchCard,
    showLosersDoor // Add to dependency array
  ])

  // Also update the level up message when reaching level 12
  useEffect(() => {
    if (level === 12) {
      setMessage('🎫 Scratch Card Game Unlocked! Get 3 ticket symbols to play!')
      setTimeout(() => setMessage(''), 5000)
    }
  }, [level])

  // Add helper function to determine reel count
  const getReelCount = (currentLevel: number): number => {
    if (currentLevel >= 18) return 5
    if (currentLevel >= 10) return 4
    return 3
  }

  // Add back debug shortcuts but only in development mode
  useEffect(() => {
    // Only enable shortcuts in development mode
    if (import.meta.env.DEV) {
      const handleKeyPress = (e: KeyboardEvent): void => {
        // Only work if Ctrl+Shift is pressed
        if (e.ctrlKey && e.shiftKey) {
          e.preventDefault() // Prevent default browser behavior

          switch (e.key.toLowerCase()) {
            case 'p': // Snake Game (P for Python 🐍)
              setShowSnakeGame(true)
              break
            case 'h': // Higher/Lower (H for Higher)
              setShowHigherLower(true)
              break
            case 'b': // Bonus Board (B for Bonus)
              setIsBonusActive(true)
              break
            case 'g': // Gamble Feature (G for Gamble)
              setPendingWin(bet * 5)
              setShowGamble(true)
              break
            case 'f': // Free Spins (F for Free)
              setFreeSpins((prev) => prev + 10)
              setMessage('🎲 Added 10 Free Spins!')
              break
            case 's': // Scratch Card (S for Scratch)
              setShowScratchCard(true)
              break
            case 'l': // Level Up (L for Level)
              setLevel((prev) => Math.min(prev + 1, 20))
              break
          }
        }
      }

      window.addEventListener('keydown', handleKeyPress)
      return (): void => window.removeEventListener('keydown', handleKeyPress)
    }
  }, [bet])

  // Reset freeLosses when free spins are awarded
  useEffect(() => {
    if (freeSpins > 0) {
      setFreeLosses(0)
    }
  }, [freeSpins])

  return (
    <div className="slot-machine">
      <div className="balance-display">
        Balance: £{balance.toFixed(2)}
        <div className="game-controls">
          <button className="info-button" onClick={() => setShowPaytable(true)}>
            ℹ️ Game Info
          </button>
        </div>
      </div>
      <div className="win-display">
        {lastWin > 0 && <div className="last-win">Win: £{lastWin.toFixed(2)}!</div>}
        {message && <div className="message">{message}</div>}
        {freeSpins > 0 && <div className="free-spins-counter">🎲 Free Spins: {freeSpins}</div>}
      </div>
      <div className="bet-controls">
        <div className="bet-buttons">
          <button onClick={() => changeBet(-1)} disabled={freeSpins > 0}>
            -
          </button>
          <span>Bet: £{bet.toFixed(2)}</span>
          <button onClick={() => changeBet(1)} disabled={freeSpins > 0}>
            +
          </button>
        </div>
        <input
          type="range"
          min="1"
          max={getMaxBet(level)}
          value={bet}
          onChange={(e) => setBet(Number(e.target.value))}
          disabled={freeSpins > 0}
          className="bet-slider"
        />
      </div>

      <div className="reels-container">
        {Array.from({ length: getReelCount(level) }, (_, reelIndex) => (
          <Reel
            key={reelIndex}
            symbols={reelSymbols[reelIndex] || ['?', '?', '?']}
            isSpinning={isSpinning}
            showAllSymbols={level >= 2}
            isFreeSpins={freeSpins > 0}
            level={level}
          />
        ))}
      </div>

      <button
        className="spin-button"
        onClick={() => {
          if (freeSpins > 0 && !isAutoSpinning) {
            setIsAutoSpinning(true)
            autoSpin()
          } else {
            handleSpin()
          }
        }}
        disabled={
          isSpinning || (balance < bet && freeSpins === 0) || (freeSpins > 0 && isAutoSpinning)
        }
      >
        {freeSpins > 0 ? (isAutoSpinning ? 'AUTO-SPINNING...' : 'START FREE SPINS') : 'SPIN'}
      </button>

      {showGamble && (
        <GambleFeature
          winAmount={pendingWin}
          onComplete={(finalWinAmount) => {
            if (finalWinAmount > 0) {
              setBalance((prev) => prev + finalWinAmount)
              setLastWin(finalWinAmount)
              setMessage(`Collected £${finalWinAmount.toFixed(2)}!`)
            } else {
              setLastWin(0)
              setMessage('Better luck next time!')
            }
            setShowGamble(false)
            setPendingWin(0)
          }}
        />
      )}

      {isBonusActive && (
        <BonusBoard
          onComplete={(bonusWin) => {
            setBalance((prev) => prev + bonusWin)
            if (bonusWin > 0) {
              addXp(bonusWin)
            }
            setIsBonusActive(false)
            setIsFeatureActive(false)
            // Add a small delay before handling feature completion
            setTimeout(() => {
              handleFeatureComplete()
            }, 100)
          }}
          currentBet={bet}
          level={level}
        />
      )}

      {showPaytable && <PaytableModal onClose={() => setShowPaytable(false)} level={level} />}

      <LevelSystem
        level={level}
        xp={xp}
        xpNeeded={getXpNeeded(level)}
        unlockedFeatures={getUnlockedFeatures(level)}
      />

      {showLevelUp && (
        <div className="level-up-notification">🎉 Level Up! You reached Level {level}!</div>
      )}

      {showSnakeGame && (
        <SnakeGame
          onWin={(amount) => {
            setBalance((prev) => prev + amount)
            if (amount > 0) {
              addXp(amount)
            }
            setShowSnakeGame(false)
            if (!showHigherLower && !isBonusActive && !showScratchCard) {
              handleFeatureComplete()
            }
          }}
          onClose={() => {
            setShowSnakeGame(false)
            if (!showHigherLower && !isBonusActive && !showScratchCard) {
              handleFeatureComplete()
            }
          }}
          currentBet={bet}
        />
      )}

      {showGameOver && (
        <div className="game-over-modal">
          <div className="game-over-content">
            <h2>Game Over!</h2>
            <p>You&apos;ve run out of money!</p>
            <button
              className="restart-button"
              onClick={() => {
                setBalance(1000)
                setBet(1)
                setShowGameOver(false)
                setLevel(1)
                setXp(0)
                setConsecutiveLosses(0) // Reset consecutive losses counter
              }}
            >
              Start New Game
            </button>
          </div>
        </div>
      )}

      {showHigherLower && (
        <HigherLowerGame
          onWin={(amount) => {
            setBalance((prev) => prev + amount)
            if (amount > 0) {
              addXp(amount)
            }
            setShowHigherLower(false)
            handleFeatureComplete()
          }}
          onClose={() => {
            setShowHigherLower(false)
            handleFeatureComplete()
          }}
          currentBet={bet}
        />
      )}

      {showScratchCard && (
        <ScratchCard
          onWin={(amount) => {
            setBalance((prev) => prev + amount)
            if (amount > 0) {
              addXp(amount)
            }
            setShowScratchCard(false)
          }}
          onClose={() => setShowScratchCard(false)}
          currentBet={bet}
        />
      )}

      {showLosersDoor && (
        <LosersDoor
          onWin={(amount) => {
            setBalance((prev) => prev + amount)
            setLastWin(amount)
            if (amount > 0) {
              addXp(amount)
            }
            setMessage(`Won £${amount} from Loser's Door!`)
            setShowLosersDoor(false)
          }}
          onClose={() => setShowLosersDoor(false)}
          currentBet={bet}
        />
      )}

      <div className="level-display">
        Level {level}
        {level > 20 && <span className="prestige">Prestige {Math.floor((level - 20) / 10)}</span>}
      </div>
    </div>
  )
}

export default SlotMachine
