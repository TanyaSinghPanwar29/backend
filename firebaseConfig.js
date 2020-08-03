const admin = require('firebase-admin');
const serviceAccount = require('./chatbox-dfb88-firebase-adminsdk-lweu3-df3ed3f7ec.json');
const { Utils } = require('./Utils/Utils');
const { RESPONSE_MODALS , getSuccessfulLoginResponse } = require('./ResponseModels/responseModels')
const { getDecodedPayload } = require('./Authentication/jwt-service');
const { text } = require('body-parser');

const initializeDatabase = () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: 'https://chatbox-dfb88.firebaseio.com/'
    });
}


const registerUser = async (req,res) => {
    if(!res || !req || !req.body || !req.body.email || !req.body.password || !req.body.username){
        res.json(RESPONSE_MODALS.userRegistered.failed);
        return;
    }
    let email = req.body.email;
    let password = req.body.password;
    let username = req.body.username;
    admin.database().ref("users/"+username).orderByValue()
        .once("value").then(snapshot =>{
            let data = snapshot.val();
            if(data){
                res.json(RESPONSE_MODALS.userRegistered.userAlreadyExist)
                return;
            }
            if(!data){
                admin.auth().createUser({
                    email: email,
                    emailVerified: false,
                    password: password
                }).then(userCreated =>{
                    res.json(RESPONSE_MODALS.userRegistered.success);
                    admin.storage().ref().child("ProfileImages/default.png").getDownloadURL().then((url) => {
                        admin.database().ref("users/"+username).set({
                            email: email,
                            password: password,
                            hasUpdatedProfile: false,
                            username: username,
                            profile_img_src: url
                        })
                    })
                    
                }).catch((err)=>{
                    res.json(RESPONSE_MODALS.userRegistered.failed);
                    return;
                });
            }
        })
}

const loginUser = async (req,res) => {

    if(!req || !req.body || !req.body.username || !req.body.password){ 
        res.json(RESPONSE_MODALS.loggedIn.invalidData);
        return;
    }
    let username = req.body.username;
    let password = req.body.password;
    console.log(username)
    console.log(req.body)
    admin.database().ref("users/"+ username).orderByValue()
        .once("value").then((snapshot)=>{
            let data = snapshot.val();
            if(!data){
                res.json(RESPONSE_MODALS.loggedIn.user_not_found)
                return;
            }
           console.log(data)
           console.log(req.body)
            if(data && data.password === password && username === data.username){
                res.json(getSuccessfulLoginResponse(data.email,data.hasUpdatedProfile));
                
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
    if(!req || !res || !req.body || !req.body.username){
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
    // let payLoad = getDecodedPayload(req.body.token);
    await admin.database().ref("users/"+req.body.username).orderByValue().once("value").then(async (data)=>{
        console.log(data.val())
        if(data.val()){
        await admin.database().ref("users/"+ req.body.username).update(update_payload)
        .then(()=>{
            //TODO create a response modal for this
            res.json(RESPONSE_MODALS.profileUpdate.success);
            return;
        }).catch((err)=>{
            res.json(RESPONSE_MODALS.profileUpdate.failed);
            return;
        })
    }
    else{
        res.json(RESPONSE_MODALS.profileUpdate.failed);
        return
    }
    })
   
}


const search = async (req,res) =>{
    if(!req || !res || !req.body || !req.body.text ){
        req.json(RESPONSE_MODALS.search.failed)
        return 
    }
    let search_results = [];
    let searchText = req.body.text;
    admin.database().ref('/users').orderByValue().once('value').then((snapshot) =>{
        let data = snapshot.val();
        for(let u in data){
            if(search_results.length >= 10)
            break;

            let username = u+"";
            if(username.indexOf(searchText) === 0){
                let temp = {
                    username: data[u].username,
                    email: data[u].email,
                    profile_img_src : data[u].profile_img_src,
                    description: data[u].description
                }
                search_results.push(temp);
            }
        }
        if(search_results.length > 0){
            let response = {
                ...RESPONSE_MODALS.search.success,
                search_results: search_results 
            }
            res.json(response);
        } else if(search_results.length === 0){
            res.json(RESPONSE_MODALS.search.failed)
        }

    })

}
exports.initializeDatabase = initializeDatabase;
exports.loginUser = loginUser;
exports.registerUser = registerUser;
exports.updateProfileInfo = updateProfileInfo;
exports.search = search;
exports.firesbase = admin;
