const Privacy = () => {
  return (
    <div className="page-container">
      <h2>Privacy Policy</h2>
      <p>Your privacy is the foundation of our work. This policy outlines how Kitsune-Gaze handles your data.</p>
      
      <h3>1. No Data Retention</h3>
      <p>Kitsune-Gaze is designed to be <strong>stateless</strong>. We do not save your search queries, IP addresses, or result history to any database. Once your session ends, your data vanishes.</p>
      
      <h3>2. Compliance</h3>
      <p>We strive to comply with global data protection standards, including GDPR (General Data Protection Regulation) and CCPA (California Consumer Privacy Act).</p>
      
      <h3>3. Third-Party API Usage</h3>
      <p>To provide accurate breach data, we query external services using k-anonymity principles where possible, sending only the minimum required information.</p>
      
      <h3>4. Encryption</h3>
      <p>All communication between your browser and our sanctuary is encrypted via industry-standard protocols.</p>
    </div>
  );
};

export default Privacy;
