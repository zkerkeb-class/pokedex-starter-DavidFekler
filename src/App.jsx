import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function PokemonCard() {
    return (
        <div>
            <h2>Pikachu</h2>
            <p>Type: Électrique</p>
            <h3>Attaques :</h3>
            <ul>
                <li>Éclair</li>
                <li>Fatal-Foudre</li>
                <li>Vive-Attaque</li>
                <li>Queue de Fer</li>
            </ul>
        </div>
    );
}

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
            <PokemonCard />
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
