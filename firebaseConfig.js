const admin = require('firebase-admin');
const { auth } = require('firebase-admin');
const serviceAccount = require('./chatbox-dfb88-firebase-adminsdk-lweu3-df3ed3f7ec.json');

const initializeDatabase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://chatbox-dfb88.firebaseio.com/'
    });
}

const registerUser = async (email,password) => {
    return  await admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: password
      });
  }
  
const loginUser = async (email,password) => {
return await admin.auth().getUserByEmail(email)
.then((userRecord)=>{
    console.log(userRecord.toJSON());
}).catch(err=> err);
}

exports.initializeDatabase = initializeDatabase;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.firesbase = admin;