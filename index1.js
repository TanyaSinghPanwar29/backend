const Joi = require('joi');
const express = require('express');
const app = express();
app.use(express.json());
const user = [
 {id:1, email:'tanya',password: 'aaaaa'},
 {id:2, email:'tanvi',password: 'bbbbb'},
 {id:3, email:'nnnnn',password: 'ccccc'},


]

// app.get('/', (req,res) =>{
//     res.send('hello world!!!!');
// })
// app.get('/api/user',(req, res) => {
//     res.send(user)});

// app.get('/api/user/:id', (req, res) => {
//    res.send(req.params)
//    const users = user.find(c => c.id === parseInt(req.params.id))
//    if(!users) res.status(404).send('the with the give id is not found')
//     res.send(user);
// })

app.post('/api/user',(req, res) => {
     const schema = {
         email: Joi.required(),
         password: Joi.string().min(3).required()
     }
    const result = Joi.validate(req.body , schema)
    console.log(result) 
     if(result.error) {
         res.status(400).send(result.error.details[0].message)
         return;
        }

    // if (!req.body.name || req.body.name.length < 3){
    //     res.status(404).send('name is reqired and should be minimum 3 characters')
    //     return;
    // }
    const users = {
        id: user.length + 1,
        email: req.body.email,
        password: req.body.password,
    };
     user.push(users);
     res.send(users)
})


    //port


const port = process.env.PORT || 3001;
app.listen(3001, () => console.log(`listening on port ${port}..`))
// app.post()
// app.put()
// app.delete()
