import { findUserByUsername, validatePassword, withSession } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    const user = findUserByUsername(username);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValid = await validatePassword(user, password);
    
    if (!isValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Store user in session
    req.session.set('user', {
      id: user.id,
      username: user.username,
      isAdmin: user.isAdmin
    });
    
    await req.session.save();
    
    return res.status(200).json({ 
      user: {
        id: user.id,
        username: user.username,
        isAdmin: user.isAdmin
      }
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export default withSession(handler); 