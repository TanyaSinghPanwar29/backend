const admin = require('firebase-admin');
const serviceAccount = require('./chatbox-dfb88-firebase-adminsdk-lweu3-df3ed3f7ec.json');
const { getFilteredEmail } = require('./Utils/Utils');
const { RESPONSE_MODALS , getSuccessfulLoginResponse } = require('./ResponseModels/responseModels')
const { getDecodedPayload } = require('./Authentication/jwt-service')
const initializeDatabase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://chatbox-dfb88.firebaseio.com/'
    });
}


const registerUser = async (req,res) => {

    if(!res || !req || !req.body || !req.body.email || !req.body.password){
        res.json(RESPONSE_MODALS.userRegistered.failed);
        return;
    }
    let email = req.body.email;
    let password = req.body.password;
    
    admin.database().ref("users/"+getFilteredEmail(email)).orderByValue()
        .once("value").then(snapshot =>{
            let data = snapshot.val()
            if(data){
                res.json(RESPONSE_MODALS.userRegistered.userAlreadyExist)
                return
            }
            if(!data){
                admin.auth().createUser({
                    email: email,
                    emailVerified: false,
                    password: password
                }).then(userCreated =>{
                    res.json(RESPONSE_MODALS.userRegistered.success)
                    admin.database().ref("users/"+getFilteredEmail(email)).set({
                        email: email,
                        password: password,
                        hasUpdatedProfile: false
                    })
                }).catch((err)=>{
                    res.json(RESPONSE_MODALS.userRegistered.failed);
                    return;
                });
               
            }
           
       })

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
        
            if(data && data.password === password && email === data.email){
                res.json(getSuccessfulLoginResponse(email,data.hasUpdatedProfile));
                
            } else{
                res.json(RESPONSE_MODALS.loggedIn.failed);
            }
        })
        .catch((err)=>{
            res.json(RESPONSE_MODALS.loggedIn.failed);
            return;
        });
}


const updateProfileInfo = async (req,res) => {
    if(!req || !res || !req.body || !req.body.token || req.body.user_info){
        //TODO create a modal in RESPOSE MODAL FOR THIS
        res.json(RESPONSE_MODALS.profileUpdate.failed)
        return;
    }
    let update_payload ={
        first_Name : req.body.first_Name,
        last_Name : req.body.last_Name,
        location: req.body.location,
        description: req.body.description,
        hasUpdatedProfile: true
    }

    let payLoad = getDecodedPayload(req.body.token);
    await admin.database().ref("users/"+getFilteredEmail(payLoad.email)).update(update_payload)
    .then((data)=>{
        //TODO create a response modal for this
        res.json(RESPONSE_MODALS.profileUpdate.success);
        return;
    }).catch((err)=>{
        res.json(RESPONSE_MODALS.profileUpdate.failed);
        return;
    })

}


exports.initializeDatabase = initializeDatabase;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.updateProfileInfo = updateProfileInfo;
exports.firesbase = admin;
