import { withIronSession } from 'next-iron-session';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// This would normally be in an environment variable
const JWT_SECRET = 'your-secret-key';

// In-memory user storage (replace with database in production)
let users = [
  {
    id: 1,
    username: 'admin',
    // This is a hashed version of 'root64'
    passwordHash: '$2a$10$mLEROHGA/SohqUVNAjAqU.YL4wKBYVJJSM5LFM88.ZdCCXL7C3vwK',
    isAdmin: true,
    createdAt: new Date().toISOString()
  }
];

// In-memory IP storage (replace with database in production)
export const visitorIps = [];

export const addVisitorIp = (ip) => {
  if (!visitorIps.includes(ip)) {
    visitorIps.push(ip);
  }
};

export const getVisitorIps = () => {
  return visitorIps;
};

export const findUserByUsername = (username) => {
  return users.find(user => user.username === username);
};

export const createUser = async (username, password) => {
  // Check if user already exists
  if (findUserByUsername(username)) {
    throw new Error('Username already exists');
  }
  
  // Hash password
  const passwordHash = await bcrypt.hash(password, 10);
  
  // Create new user
  const newUser = {
    id: users.length + 1,
    username,
    passwordHash,
    isAdmin: false,
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  return { ...newUser, passwordHash: undefined };
};

export const validatePassword = async (user, password) => {
  return bcrypt.compare(password, user.passwordHash);
};

export const generateToken = (user) => {
  const payload = {
    id: user.id,
    username: user.username,
    isAdmin: user.isAdmin
  };
  
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
};

export const withSession = (handler) => {
  return withIronSession(handler, {
    password: JWT_SECRET,
    cookieName: 'news-site-session',
    cookieOptions: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      httpOnly: true
    }
  });
};

export const requireAuth = (handler) => {
  return async (req, res) => {
    const user = req.session.get('user');
    
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    return handler(req, res);
  };
};

export const requireAdmin = (handler) => {
  return async (req, res) => {
    const user = req.session.get('user');
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    return handler(req, res);
  };
}; 