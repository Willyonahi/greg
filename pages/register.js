import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';
import { useAuth } from '../lib/hooks';

export default function Register() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const { username, password, confirmPassword } = formData;
      
      // Validate form fields
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setIsLoading(false);
        return;
      }
      
      if (password.length < 32) {
        setError('Password must be at least 32 characters');
        setIsLoading(false);
        return;
      }

      const result = await register(username, password);

      if (result.success) {
        router.push('/login?registered=true');
      } else {
        setError(result.message || 'Failed to register. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <Head>
        <title>Register | News Website</title>
        <meta name="description" content="Create a new account on the news website" />
      </Head>

      <header className="header">
        <h1>News Website</h1>
        <nav>
          <Link href="/">Home</Link>
        </nav>
      </header>

      <main className="main">
        <div className="auth-container">
          <h2>Create an Account</h2>
          
          {error && <div className="error-message">{error}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <small>Must be at least 32 characters</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </form>
          
          <p className="auth-link">
            Already have an account? <Link href="/login">Login here</Link>
          </p>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} News Website</p>
      </footer>

      <style jsx>{`
        .auth-container {
          max-width: 400px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .auth-container h2 {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        
        .error-message {
          background-color: #ffebee;
          color: #c62828;
          padding: 0.75rem;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        .auth-link {
          margin-top: 1.5rem;
          text-align: center;
        }
        
        small {
          display: block;
          margin-top: 0.25rem;
          font-size: 0.75rem;
          color: #666;
        }
      `}</style>
    </div>
  );
} 