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
        throw new Error('The connection failed. Please try again.');
      }
      
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="scanner-page">
      <h2>BREACH SCANNER</h2>
      <p>Enter your email or username to check for data exposure.</p>
      
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
                <p className="pwned-message">Data exposure detected in {result.breaches.length} sources.</p>
                {result.breaches.map((breach, index) => (
                  <div key={index} className="breach-item">
                    <h3>{breach.source}</h3>
                    <p><strong>Date:</strong> {breach.date}</p>
                    <p><strong>Leaked:</strong> {breach.data_leaked.join(', ')}</p>
                  </div>
                ))}
              </>
            ) : (
              <p className="safe-message">No known data exposure detected for this identifier.</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Scanner;
