import { withSession, addVisitorIp } from '../../lib/auth';

async function handler(req, res) {
  // Get client IP from X-Forwarded-For header or from socket
  const forwarded = req.headers['x-forwarded-for'];
  const ip = forwarded ? forwarded.split(/, /)[0] : req.socket.remoteAddress;
  
  // Track the IP
  addVisitorIp(ip);
  
  return res.status(200).json({ message: 'Visitor tracked' });
}

export default withSession(handler); 