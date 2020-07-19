const admin = require('firebase-admin');
const serviceAccount = require('./chatbox-dfb88-firebase-adminsdk-lweu3-df3ed3f7ec.json');
const { getFilteredEmail } = require('./Utils/Utils');
const { RESPONSE_MODALS , getSuccessfulLoginResponse } = require('./ResponseModels/responseModels')

const initializeDatabase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://chatbox-dfb88.firebaseio.com/'
    });
}

const registerUser = async (email,password) => {
    try{
    await admin.database().ref("users/"+getFilteredEmail(email)).set({
        email: email,
        password: password
    }); 
    } catch(err){
     return Promise.reject(new Error('fail'));
    }
    return  await admin.auth().createUser({
        email: email,
        emailVerified: false,
        password: password
      });
  }

const loginUser = async (req,res) => {
    if(!res || !req || !req.body || !req.body.email || !req.body.password){
        res.json(RESPONSE_MODALS.loggedIn.invalidData);
        return;
    }
    let email = req.body.email;
    let password = req.body.password;
    
       admin.database().ref("users/"+getFilteredEmail(email)).orderByValue()
        .once("value").then((snapshot)=>{
            let data = snapshot.val();
            if(!data){
                res.json(RESPONSE_MODALS.loggedIn.user_not_found)
                return;
            }
        
            if(data && data.password === password){
                res.json(getSuccessfulLoginResponse(email));
            } else{
                res.json(RESPONSE_MODALS.loggedIn.failed);
            }
        })
        .catch((err)=>{
            res.json(RESPONSE_MODALS.loggedIn.failed);
            return;
        });
}

exports.initializeDatabase = initializeDatabase;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.firesbase = admin;
