const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { connectToDb, createUser, signInUser } = require('./database')

app.use(bodyParser.json());
app.use(cors({
    'allowedHeaders': ['Content-Type'],
    'origin': '*',
    'preflightContinue': true
  }));
const port = 3000 || process.env.PORT;

app.post("/api/createUser",(req,res)=>{
   createUser(req.body.email,req.body.password);
   res.set('Access-Control-Allow-Origin','*');
   res.json({
       message: "USER REGISTERED"
   })
});

app.post("/api/signIn", async (req,res)=>{
    res.set('Access-Control-Allow-Origin','*');
    let resPonse = await signInUser(req.body.email,req.body.password);
    res.json(resPonse);
 });

connectToDb();

app.listen(port,()=>{
    console.log("The server is running at port "+port);
})