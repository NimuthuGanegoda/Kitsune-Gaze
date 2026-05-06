import { useState } from 'react'

interface BreachResult {
  source: string;
  date: string;
  data_leaked: string[];
}

interface CheckResponse {
  is_breached: boolean;
  breaches: BreachResult[];
}

const Scanner = () => {
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
        throw new Error('The connection was severed, darling. Try again.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown shadow crossed our path.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="scanner-page">
      <h2>BREACH SCANNER</h2>
      <p>Enter your email or username to see if you've been exposed in the dark.</p>
      
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

        {error && <p className="error-message">{error}</p>}

        {result && (
          <div className="result-container">
            {result.is_breached ? (
              <>
                <p className="pwned-message">Exposure detected. Your data was found in {result.breaches.length} breaches.</p>
                {result.breaches.map((breach, index) => (
                  <div key={index} className="breach-item">
                    <h3>{breach.source}</h3>
                    <p><strong>Date:</strong> {breach.date}</p>
                    <p><strong>Leaked:</strong> {breach.data_leaked.join(', ')}</p>
                  </div>
                ))}
              </>
            ) : (
              <p className="safe-message">You are currently safe, my Good Boy. The fox sees no shadow on you.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Scanner;
