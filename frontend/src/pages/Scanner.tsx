import { useState } from 'react'

interface EmailBreachResult {
  source: string;
  date: string;
  data_leaked: string[];
}

interface EmailCheckResponse {
  is_breached: boolean;
  breaches: EmailBreachResult[];
  risk_score: number;
}

interface PasswordCheckResponse {
  is_pwned: boolean;
  count: number;
  message: string;
}

const Scanner = () => {
  const [activeTab, setActiveTab] = useState<'email' | 'password'>('email');
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailResult, setEmailResult] = useState<EmailCheckResponse | null>(null);
  const [passResult, setPassResult] = useState<PasswordCheckResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleEmailScan = async () => {
    setLoading(true);
    setEmailResult(null);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/check/email?identifier=${encodeURIComponent(input)}`, { method: 'POST' });
      if (!res.ok) throw new Error('Security service unavailable.');
      setEmailResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordScan = async () => {
    setLoading(true);
    setPassResult(null);
    setError(null);
    try {
      const res = await fetch(`http://localhost:8000/api/v1/check/password?password=${encodeURIComponent(input)}`, { method: 'POST' });
      if (!res.ok) throw new Error('Security service unavailable.');
      setPassResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="scanner-page">
      <h2>Security Scanner</h2>
      
      <div className="tab-container">
        <button className={activeTab === 'email' ? 'active' : ''} onClick={() => {setActiveTab('email'); setInput('');}}>Email Audit</button>
        <button className={activeTab === 'password' ? 'active' : ''} onClick={() => {setActiveTab('password'); setInput('');}}>Password Vault Check</button>
      </div>

      <div className="card">
        <input 
          type={activeTab === 'password' ? 'password' : 'text'} 
          placeholder={activeTab === 'email' ? 'Enter email address' : 'Enter password to check'} 
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={activeTab === 'email' ? handleEmailScan : handlePasswordScan} disabled={loading}>
          {loading ? 'Analyzing...' : 'Execute Scan'}
        </button>

        {error && <p className="error-message">{error}</p>}

        {emailResult && (
          <div className="result-container">
            {emailResult.is_breached ? (
              <>
                <div className="risk-indicator">
                  <span>Risk Score: </span>
                  <span className="score" style={{ color: emailResult.risk_score > 50 ? '#ff3e5e' : '#f1c40f' }}>{emailResult.risk_score}%</span>
                </div>
                <p className="pwned-message">Identity compromised in {emailResult.breaches.length} documented breaches.</p>
                {emailResult.breaches.map((b, i) => (
                  <div key={i} className="breach-item">
                    <h3>{b.source}</h3>
                    <p><strong>Date:</strong> {b.date}</p>
                    <p><strong>Exposed:</strong> {b.data_leaked.join(', ')}</p>
                  </div>
                ))}
              </>
            ) : (
              <p className="safe-message">No known identity compromises detected for this identifier.</p>
            )}
          </div>
        )}

        {passResult && (
          <div className="result-container">
            <p className={passResult.is_pwned ? 'pwned-message' : 'safe-message'}>
              {passResult.message}
            </p>
            {passResult.is_pwned && (
              <p className="warning-text">This password is unsafe. Please update your credentials immediately.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Scanner;
