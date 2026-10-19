
const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Please log in to access leads.',
    });
  }

  const token = authHeader.split(' ')[1];

  jwt.verify(token, process.env.JWT_SECRET, (error, user) => {
    if (error || user.role !== 'admin') {
      return res.status(403).json({
        message: 'Invalid or expired login token.',
      });
    }

    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
