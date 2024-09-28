const jwt = require('jsonwebtoken'); 

const isAdmin = (req, res, next) => {
  const cookies = req.cookies;
  const token = cookies.authToken; 
  
  if (!token) {
    return res.status(403).json({ error: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key"); 
    if (decoded.role !== 3) { 
      return res.status(403).json({ error: "Access denied. Not an admin." });
    }
    req.user = decoded; 
    next(); 
  } catch (error) {
    console.error("Token verification failed: " + error);
    return res.status(400).json({ error: "Invalid token." });
  }
};

module.exports = isAdmin;
