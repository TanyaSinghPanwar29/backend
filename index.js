const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { initializeDatabase, registerUser , loginUser , updateProfileInfo } = require('./firebaseConfig')
const { RESPONSE_MODALS } = require('./ResponseModels/responseModels')

app.use(bodyParser.json());
app.use(cors({
    'allowedHeaders': ['Content-Type'],
    'origin': '*',
    'preflightContinue': true,
    'Access-Control-Allow-Origin': '*'
  }));

const port = 3000 || process.env.PORT;

const initServer = () => {
    initializeDatabase();
}

initServer();

app.post("/api/createUser",(req,res)=>{
   res.set('Access-Control-Allow-Origin','*');
   registerUser(req,res)
});

app.post("/api/signIn", async (req,res)=>{
    res.set('Access-Control-Allow-Origin','*');
    loginUser(req,res);
 });

 app.post("/api/update-profile",(req,res) => {
    updateProfileInfo(req,res);
 });

app.listen(port,()=>{
    console.log("The server is running at port "+port);
})



