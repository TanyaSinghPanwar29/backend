const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { auth } = require('firebase-admin');
const { initializeDatabase, registerUser } = require('./firebaseConfig')
const { RESPONSE_MODALS } = require('./ResponseModels/responseModels')

app.use(bodyParser.json());
app.use(cors({
    'allowedHeaders': ['Content-Type'],
    'origin': '*',
    'preflightContinue': true
  }));

const port = 3000 || process.env.PORT;

const initServer = () => {
    initializeDatabase();
}

initServer();

app.post("/api/createUser",(req,res)=>{
   res.set('Access-Control-Allow-Origin','*');
   registerUser(req.body.email,req.body.password)
   .then((response)=> {
       res.json(RESPONSE_MODALS.userRegistered.success);
   })
   .catch((err)=> {
       console.log(err);
    res.json(RESPONSE_MODALS.userRegistered.failed);
   })
});

// app.post("/api/signIn", async (req,res)=>{
//     res.set('Access-Control-Allow-Origin','*');
//     let resPonse = await signInUser(req.body.email,req.body.password);
//     res.json(resPonse);
//  });

app.listen(port,()=>{
    console.log("The server is running at port "+port);
})
