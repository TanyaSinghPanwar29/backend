const fs = require('fs'); 
const jwt = require('jsonwebtoken');
const privateKey = fs.readFileSync('Authentication/private.key','utf8');
const publicKey = fs.readFileSync('Authentication/public.key','utf8')

jwt.sign(JSON.stringify({ "FIELD 01": "RANDOM" }), privateKey, { algorithm: 'RS256' }, function(err, token) {
    console.log(err,token);
  });