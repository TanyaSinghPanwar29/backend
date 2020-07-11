const express = require('express');
const app = express();
const { connectToDb, createUser } = require('./database')

app.use(express.json());
const port = 3000 || process.env.PORT;


app.post("/api/createUser",(req,res)=>{
   createUser(req.body.email,req.body.password);
   res.send("User Created");
});
 
connectToDb();

app.listen(port,()=>{
    console.log("The server is running at port "+port);
})