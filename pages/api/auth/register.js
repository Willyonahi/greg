import { createUser, withSession } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    if (password.length < 32) {
      return res.status(400).json({ message: 'Password must be at least 32 characters' });
    }

    const user = await createUser(username, password);
    
    return res.status(201).json({ user });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

export default withSession(handler); 