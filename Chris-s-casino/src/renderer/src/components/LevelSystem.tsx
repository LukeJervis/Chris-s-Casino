import React from 'react'
import '../styles/LevelSystem.css'

interface LevelSystemProps {
  level: number
  xp: number
  xpNeeded: number
  unlockedFeatures?: string[]
}

const LevelSystem: React.FC<LevelSystemProps> = ({ level, xp, xpNeeded, unlockedFeatures }) => {
  const progress = (xp / xpNeeded) * 100

  const levelFeatures: { [key: number]: string[] } = {
    1: [
      'Basic Slots (Bet £1-£10)',
      'Basic Symbols (🍒 🍋 🍊)',
      'Single Line Wins',
      'Gamble Feature'
    ],
    2: ['View All Reel Positions', 'Snake Game (🐍)', 'Max Bet: £20', 'Improved Base Game Returns'],
    3: ['Star Symbol (⭐)', 'Bonus Round Feature', 'Max Bet: £30', 'Enhanced Winning Potential'],
    4: [
      'Super Symbols (💎 7️⃣)',
      'Higher Base Payouts',
      'Max Bet: £40',
      'Better Prize Distribution'
    ],
    5: ['Free Spins (🎲)', 'Slot Machine Symbol (🎰)', 'Auto-Spin Feature', 'Max Bet: £50'],
    6: [
      'Enhanced Snake Game Rewards',
      'Improved Free Spin Frequency',
      'Max Bet: £60',
      'Better Symbol Distribution'
    ],
    7: [
      'Enhanced Bonus Round Prizes',
      'Better Symbol Distribution',
      'Max Bet: £70',
      'Improved Feature Odds'
    ],
    8: ['Higher/Lower Game (🎴)', 'Enhanced Base Game', 'Max Bet: £100', 'Improved Prize Values'],
    9: [
      'Improved Snake Game Multipliers',
      'Better Free Spin Rewards',
      'Enhanced Feature Triggers',
      'Better Overall Returns'
    ],
    10: [
      '4th Reel Unlocked',
      '2x Multiplier for 4 Matches',
      'Enhanced Base Game Wins',
      'New Win Combinations'
    ],
    11: [
      'Improved Higher/Lower Rewards',
      'Better Bonus Round Odds',
      'Enhanced Symbol Distribution',
      'Increased Feature Frequency'
    ],
    12: [
      'Scratch Card Game (🎫)',
      'Enhanced Free Spins Multiplier',
      'Better Symbol Weights',
      '20% Base Multiplier Increase'
    ],
    13: [
      'Improved Base Game Multipliers',
      'Better Feature Trigger Rates',
      'Enhanced Bonus Rewards',
      'Increased Win Potential'
    ],
    14: [
      'Top & Bottom Line Wins',
      'Triple Line Potential',
      'Higher Win Potential',
      'Multi-line Combinations'
    ],
    15: [
      'Enhanced Scratch Card Prizes',
      'Improved Multi-line Wins',
      'Better Feature Rewards',
      'Optimized Symbol Distribution'
    ],
    16: [
      'Better High Symbol Frequency',
      'Improved Overall Returns',
      '30% Additional Multiplier',
      'Enhanced Win Distribution'
    ],
    17: [
      'Maximum Feature Trigger Rates',
      'Enhanced All Bonuses',
      'Best Symbol Distribution',
      'Optimized Returns'
    ],
    18: [
      '5th Reel Unlocked',
      '3x Five Symbol Wins',
      'Ultimate Win Potential',
      'Maximum Win Combinations'
    ],
    19: [
      'Maximum Symbol Weights',
      'Best Bonus Frequencies',
      'Enhanced All Features',
      'Peak Performance'
    ],
    20: [
      'Ultimate Win Multipliers',
      '50% Final Multiplier Boost',
      'Maximum Game Potential',
      'Final Form Achieved'
    ]
  }

  const getNextLevelFeatures = (nextLevel: number): JSX.Element[] => {
    return levelFeatures[nextLevel as keyof typeof levelFeatures].map((feature, index) => (
      <div key={index} className="feature-item locked">
        🔒 {feature}
      </div>
    ))
  }

  const getFeatureDescription = (feature: string): string => {
    switch (feature) {
      case 'Basic Slots':
        return 'Match 3 or more symbols on a line to win!'
      case 'View All Positions':
        return 'See all symbol positions on the reels'
      case 'Snake Game':
        return 'Match 3 snake symbols to play Snakes & Ladders'
      case 'Bonus Round':
        return 'Match 3 star symbols for instant prizes'
      case 'Star Symbol':
        return '⭐ symbols added to reels'
      case 'Diamond & Seven Symbols':
        return '💎 and 7️⃣ symbols added (highest paying)'
      case 'Free Spins':
        return 'Match 3 dice for free spins'
      case 'Auto-Spin':
        return 'Automatic spinning during free spins'
      case 'Higher/Lower Game':
        return 'Match 3 cards to play Higher/Lower'
      case '4th Reel':
        return 'Extra reel for bigger wins'
      case '2x Four Symbol Wins':
        return 'Double pay for 4 matching symbols'
      case 'Scratch Card Game':
        return 'Match 3 tickets for scratch card bonus'
      case 'Multi-line Wins':
        return 'Win on top and bottom lines'
      case '5th Reel':
        return 'Maximum 5 reels for biggest wins'
      case '3x Five Symbol Wins':
        return 'Triple pay for 5 matching symbols'
      default:
        return ''
    }
  }

  const renderFeatures = (features: string[]): JSX.Element => {
    // Group features by category
    const categories = {
      'Basic Features': ['Basic Slots', 'Gamble Feature', 'View All Positions', 'Auto-Spin'],
      'Special Symbols': ['Star Symbol', 'Diamond & Seven Symbols'],
      'Mini Games': ['Snake Game', 'Higher/Lower Game', 'Bonus Round', 'Scratch Card Game'],
      'Game Mechanics': ['Free Spins', '4th Reel', '5th Reel', 'Multi-line Wins'],
      'Win Multipliers': ['2x Four Symbol Wins', '3x Five Symbol Wins']
    }

    // Create a more compact display
    return (
      <div className="feature-categories">
        {Object.entries(categories).map(([category, categoryFeatures]) => {
          const unlockedInCategory = categoryFeatures.filter((f) => features.includes(f))
          if (unlockedInCategory.length === 0) return null

          return (
            <div key={category} className="feature-category">
              <h4>{category}</h4>
              <div className="feature-list">
                {unlockedInCategory.map((feature) => (
                  <span key={feature} className="feature-item">
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="level-system">
      <div className="level-info">
        <div className="xp-bar">
          <div className="xp-fill" style={{ width: `${(xp / xpNeeded) * 100}%` }}></div>
          <span className="xp-text">
            Level {level} - {xp}/{xpNeeded} XP
          </span>
        </div>
      </div>
      <div className="features-container">
        <h3>Current Features</h3>
        {renderFeatures(unlockedFeatures)}
      </div>
    </div>
  )
}

export default LevelSystem
