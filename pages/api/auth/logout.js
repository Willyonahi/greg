import { withSession } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  req.session.destroy();
  
  return res.status(200).json({ message: 'Logged out successfully' });
}

export default withSession(handler); 