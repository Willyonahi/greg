import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { useAuth } from '../../lib/hooks';

export default function AdminDashboard() {
  const [visitorIps, setVisitorIps] = useState([]);
  const [bannedIps, setBannedIps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  const { user, logout } = useAuth();

  useEffect(() => {
    // Redirect if not logged in or not admin
    if (!loading && (!user || !user.isAdmin)) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchVisitorIps = async () => {
      try {
        const res = await fetch('/api/admin/visitors');
        if (res.ok) {
          const data = await res.json();
          setVisitorIps(data.visitorIps || []);
        } else {
          setError('Failed to load visitor data');
        }
      } catch (err) {
        setError('An error occurred while loading visitor data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchVisitorIps();
      
      // Load banned IPs from localStorage
      const storedBannedIps = localStorage.getItem('bannedIps');
      if (storedBannedIps) {
        setBannedIps(JSON.parse(storedBannedIps));
      }
    }
  }, [user]);

  const banIp = (ip) => {
    const newBannedIps = [...bannedIps, ip];
    setBannedIps(newBannedIps);
    localStorage.setItem('bannedIps', JSON.stringify(newBannedIps));
  };

  const unbanIp = (ip) => {
    const newBannedIps = bannedIps.filter(bannedIp => bannedIp !== ip);
    setBannedIps(newBannedIps);
    localStorage.setItem('bannedIps', JSON.stringify(newBannedIps));
  };

  if (loading) {
    return <div className="container">Loading...</div>;
  }

  if (!user || !user.isAdmin) {
    return null; // This will be handled by the redirect
  }

  return (
    <div className="container">
      <Head>
        <title>Admin Dashboard | News Website</title>
        <meta name="description" content="Admin dashboard for the news website" />
      </Head>

      <header className="header">
        <h1>News Website</h1>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/create-article">Create Article</Link>
          <button className="logout-btn" onClick={logout}>Logout</button>
        </nav>
      </header>

      <main className="main">
        <div className="admin-header">
          <h2>Admin Dashboard</h2>
          <p>Welcome back, {user.username}</p>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="admin-section">
          <h3>Visitor IP Addresses</h3>
          {visitorIps.length === 0 ? (
            <p>No visitor data available yet.</p>
          ) : (
            <div className="ip-grid">
              {visitorIps.map((ip, index) => (
                <div key={index} className="ip-card">
                  <div className="ip-address">{ip}</div>
                  <div className="ip-actions">
                    {bannedIps.includes(ip) ? (
                      <button 
                        className="unban-btn"
                        onClick={() => unbanIp(ip)}
                      >
                        Unban
                      </button>
                    ) : (
                      <button 
                        className="ban-btn"
                        onClick={() => banIp(ip)}
                      >
                        Ban
                      </button>
                    )}
                  </div>
                  <div className="ip-status">
                    {bannedIps.includes(ip) ? (
                      <span className="banned">Banned</span>
                    ) : (
                      <span className="allowed">Allowed</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} News Website</p>
      </footer>

      <style jsx>{`
        .admin-header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .admin-section {
          background: white;
          padding: 1.5rem;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          margin-bottom: 2rem;
        }
        
        .admin-section h3 {
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eaeaea;
        }
        
        .ip-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .ip-card {
          padding: 1rem;
          border: 1px solid #eaeaea;
          border-radius: 4px;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .ip-address {
          font-family: monospace;
          font-size: 1.1rem;
        }
        
        .ip-status {
          font-size: 0.875rem;
        }
        
        .banned {
          color: #c62828;
          font-weight: 500;
        }
        
        .allowed {
          color: #2e7d32;
          font-weight: 500;
        }
        
        .ban-btn, .unban-btn {
          padding: 0.25rem 0.5rem;
          font-size: 0.875rem;
        }
        
        .ban-btn {
          background-color: #c62828;
        }
        
        .unban-btn {
          background-color: #2e7d32;
        }
        
        .logout-btn {
          background: none;
          border: none;
          color: #0070f3;
          cursor: pointer;
          font-size: 1rem;
          padding: 0;
        }
        
        .logout-btn:hover {
          text-decoration: underline;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
      `}</style>
    </div>
  );
} 