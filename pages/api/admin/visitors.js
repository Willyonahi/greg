import { requireAdmin, withSession, getVisitorIps } from '../../../lib/auth';

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const visitorIps = getVisitorIps();
  
  return res.status(200).json({ visitorIps });
}

export default withSession(requireAdmin(handler)); 