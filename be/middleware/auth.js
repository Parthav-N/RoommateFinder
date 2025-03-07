import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  console.log('Authenticating request...');
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  console.log('Received token:', token);
  
  if (!token) {
    console.log('No token provided');
    return res.status(401).json({ message: 'No authentication token provided' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Verified user:', user);
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};