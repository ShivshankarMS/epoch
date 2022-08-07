import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react'

function App() {
  const [epochInSec, setEpochInSec] = useState(0)
  useEffect(() => {
    async function fetchEpocData() {
      const headers = new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + 'mysecrettoken',
      });
      headers.append('Access-Control-Allow-Origin', 'http://localhost:3000');
      headers.append('Access-Control-Allow-Credentials', 'true');
      const response = await fetch('http://localhost:3001/time', { headers })
      const reader = response.body
        .getReader();
      while (true) {
        const { value, done } = await reader.read()
        if (done) break;
        let jsonString = new TextDecoder().decode(value)
        let epocObject = JSON.parse(jsonString)
        setEpochInSec(epocObject.epoch)
      }
    }
    fetchEpocData()
  }, [])

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          {epochInSec}Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
