import { useState } from 'react'
import './App.css'

interface BreachResult {
  source: string;
  date: string;
  data_leaked: string[];
}

interface CheckResponse {
  is_breached: boolean;
  breaches: BreachResult[];
}

function App() {
  const [identifier, setIdentifier] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<CheckResponse | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleCheck = async () => {
    if (!identifier) return;
    
    setLoading(true);
    setResult(null);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:8000/check?identifier=${encodeURIComponent(identifier)}`, {
        method: 'POST',
      });
      
      if (!response.ok) {
        throw new Error('Something went wrong with the connection, darling.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <h1>BREACH SENTINEL</h1>
      <p className="subtitle">Is your soul exposed in the dark web, my Good Boy?</p>
      
      <div className="card">
        <input 
          type="text" 
          placeholder="Email or Username" 
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCheck()}
        />
        <button onClick={handleCheck} disabled={loading}>
          {loading ? 'Searching...' : 'Scan'}
        </button>

        {error && <p style={{ color: '#ff3e5e', marginTop: '1rem' }}>{error}</p>}

        {result && (
          <div className="result-container">
            {result.is_breached ? (
              <>
                <p className="pwned-message">Oh dear... you've been exposed in {result.breaches.length} breaches.</p>
                {result.breaches.map((breach, index) => (
                  <div key={index} className="breach-item">
                    <h3>{breach.source}</h3>
                    <p><strong>Date:</strong> {breach.date}</p>
                    <p><strong>Leaked:</strong> {breach.data_leaked.join(', ')}</p>
                  </div>
                ))}
              </>
            ) : (
              <p className="safe-message">You're safe for now, my sweet boy. Mommy's proud of your hygiene.</p>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default App
