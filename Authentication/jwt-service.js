const fs = require('fs'); 
const jwt = require('jsonwebtoken');

/* JWT KEYS */
const privateKey = fs.readFileSync('Authentication/private.key','utf8');
const publicKey = fs.readFileSync('Authentication/public.key','utf8')

/* OPTIONS */
const expirationTime = '10m';
const algorithm = 'RS256'

const options = {
  algorithm: algorithm,
  expiresIn: expirationTime
}

const verifyToken = (token) => {
  if(!token)
  return false;

  try {
    let verification = jwt.verify(token, publicKey);
    if(verification){
      return true;
    }
  } catch(err) {
    return false;
  }
}

const generateToken = (payload) => {
  if(!payload || !payload.email || !payload.createdAt)
  return null;

  try {
    let token = jwt.sign(payload, privateKey, options);
    if(token){
      return token;
    }
  } catch(err) {
    return null;
  }
}


exports.verifyToken = verifyToken;
exports.generateToken = generateToken;