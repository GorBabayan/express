const express = require('express');
const app = express();
const { readUsers, writeUsers } = require('./helpers.js');

app.use(express.json());
const PORT = 3054;

app.get('/users', (req, res) => {
    let info = readUsers();
    res.json(info.users);
});

app.post('/users', (req, res) => {
    let info = readUsers();
    const { name, surname } = req.body;
    
    let users = info.users;
    let newId = users.length > 0 ? Number(users[users.length - 1].id) + 1 : 1;
    const newUser = { id: newId, name, surname };
    users.push(newUser);
    writeUsers({ users });
    res.status(201).json(newUser);
});


app.delete('/users/:id', (req, res) => {
   let info = readUsers();
   let users = info.users;
   const id = parseInt(req.params.id);
   const index = users.findIndex(u => u.id == id);

   if (index == -1) {
        return res.status(404).json("User not found");
   }

   const deletedUser = users.splice(index, 1)[0];
   writeUsers({ users });
   res.json({ letter: "User deleted", user: deletedUser });
});

app.put('/users/:id', (req, res) => {
   let info = readUsers();
   const id = parseInt(req.params.id);
   const { name, surname } = req.body;

   let users = info.users;
   const user = users.find(u => id == u.id);

   if (!user.name || !user.surname) {
    return res.status(404).json("User not found");
   }

   user.name = name === undefined ? user.name : name;
   user.surname = surname === undefined ? user.surname : surname;
   
   writeUsers({ users });
   res.json(user);
});

app.listen(PORT, () => {
    console.log("app run on PORT: ", PORT);
});