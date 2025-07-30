const express = require('express');
const app = express();
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { readUsers, writeUsers } = require('./helpers.js');
app.use(express.json());
app.set('PORT', process.env.PORT || 3080);

   // TODO add id as first level obecht key in json

app.get('/users/:id', (req, res) => {
    let users = readUsers();
    let param = req.params.id;

    let user = users[param];
    if (!user) {
        return res.status(404).json("User not found");
    }

    res.json(user);
});


// TODO user can have email which is unique
// TODO userId must be UUID
// user add operation needs to recieve metadata and then spread

// get operation with id and email needs to be o(1)

app.post('/users', (req, res) => {
    let users = readUsers();
    const { name, surname, email, meta } = req.body;
    
    if (Object.values(users).some(u => u.email === email)) {
        return res.status(404).json({ letter: "Email must be unique" });
    }

    let id = uuidv4();
    const newUser = { ...meta, name, surname, email };
    users[id] = newUser;
    
    writeUsers(users);
    res.status(201).json(newUser);
});


app.delete('/users/:id', (req, res) => {
   let users = readUsers();
   const id = req.params.id;

   if (!users[id]) {
        return res.status(404).json({ letter: "User not found" });
   }

   const deletedUser = users[id];
   delete users[id];

   writeUsers(users);
   res.json({ letter: "User deleted", user: deletedUser });
});


   // TODO add patch
app.patch('/users/:id', (req, res) => {
    let users = readUsers();
    const id = req.params.id;

    if (!users[id]) {
        return res.status(404).json({ message: "User not found"});;
    }

    const update = req.body;

    if (update.email && Object.values(users).some(u => u.email === update.email && u.id !== id)) {
        return res.status(404).json({ message: "Email must be unique" }); 
    }

    users[id] = { ...users[id], ...update };
    writeUsers(users);

    res.json(users[id]);
});



app.put('/users/:id', (req, res) => {
   let users = readUsers();
   const id = req.params.id;

   if (!users[id]) {
        return res.status(404).json({ message: "User not found"});;
   }

   const { name, surname, email, meta } = req.body;

   if (email && Object.values(users).some(u => u.email === email && u.id !== id)) {
        return res.status(404).json({ message: "Email must be unique" }); 
   }
   
   users[id] = { ...meta, name, surname, email };

   writeUsers(users);
   res.json(users[id]);
});

app.listen(app.get('PORT'), () => {
  console.log("app listen on PORT: ", app.get('PORT'));
})