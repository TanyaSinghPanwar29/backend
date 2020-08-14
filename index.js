const express = require('express');
const socket = require('socket.io');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const { initializeDatabase, registerUser , loginUser , updateProfileInfo,
       search , userInfo, friendRequest, userStatus,
       handleFriendRequest } = require('./firebaseConfig')
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

app.post("/api/search" ,(req, res) =>{
    search(req ,res);
} ) 

app.get("/api/userInfo" , (req,res) =>{
    userInfo(req, res);
})
app.post("/api/userStatus" ,(req,res) => {
     userStatus(req,res);
})
app.post("/api/friendRequest",(req,res) => {
     friendRequest(req,res)
})

app.post("/api/handleFriendRequest",(req,res) => {
  handleFriendRequest(req,res)
})

let server = app.listen(port,()=>{
    console.log("The server is running at port "+port);
});

const io = socket(server);

io.on('connection',(socket) => {
 
  socket.on(socket.handshake.query.tunnel,(data)=>{
    console.log(data)
    /*
    1. Store the messages in database.
    2. Get the messages with their read/unread status
    3. Echo the message back to the desired destination.
    */
    console.log(data.sentTo)
    io.emit(data.sentTo,data);
  });
})

