import React from 'react'
import SlotMachine from './components/SlotMachine'

const App: React.FC = () => {
  return (
    <div className="app">
      <h1>Chris's Casino - Slot Machine</h1>
      <SlotMachine initialBalance={100} />
    </div>
  )
}

export default App
