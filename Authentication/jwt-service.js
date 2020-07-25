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

const getDecodedPayload = (token) => {
  if(!token)
  return null;

  try {
    let verification = jwt.verify(token, publicKey);
    console.log(verification);
    if(verification){
      return verification;
    }
    return null;
   }
   catch(err) {
    return null;
  }
}

const verifyToken = (token) => {
  if(!token)
  return false;

  try {
    let verification = jwt.verify(token, publicKey);
    console.log(verification);
    if(verification){
      return true;
    }
  } catch(err) {
    return false;
  }
}

let temp = "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3RAc2ZzZi5jbyIsImNyZWF0ZWRBdCI6ImFzZmFzZiIsImlhdCI6MTU5NTUyNjkyMiwiZXhwIjoxNTk1NTI3NTIyfQ.rp2ZlSbf_9zP1bZrBOu_cf9jyvMWG20vWhBqzrSFhUuHGYJSusyaml1Dr8en9akLgSVbdcuu2-oaRArSJZ9scWprPKZuIauKKWN2mh-pBY0zPMDlEbpEZn7y0zfTiy1nqN0L9qyJOCm1QeBjL16DA-c5aXWxC35l3PwPtifUSLg";
verifyToken(temp);

exports.verifyToken = verifyToken;
exports.generateToken = generateToken;
exports.getDecodedPayload = getDecodedPayload;