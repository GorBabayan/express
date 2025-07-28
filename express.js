const express = require('express');
const fs = require('node:fs');
const path = require('path');
const app = express();

app.use(express.json());
const PORT = 3031;

let id = 0;
let fileUrl = path.join(__dirname, "file.json");


function readUsers() { 
    let data = fs.readFileSync(fileUrl, "utf-8");

    return JSON.parse(data);
}

function writeUsers() {
    fs.writeFileSync(fileUrl, JSON.stringify(users, null, 2), "utf-8");
}

app.get('/fileUrl', (req, res) => {
    let users = readUsers();
    res.json(users);
});

app.post('/fileUrl', (req, res) => {
    let users = readUsers();
    const { name, surname } = req.body;
    
    let newId = users.length > 0 ? users[users.length - 1] + 1 : 1;
    const newUser = { id: newId, name, surname };
    users.push(newUser);
    writeUsers(users);
    res.status(201).json(newUser);
});


app.delete('/fileUrl', (req, res) => {
   let users = readUsers();
   const id = parseInt(req.params.id);
   const index = users.findIndex(u => u.id == id);

   if (index == -1) {
        res.status(404).json("User not found");
   }

   const deletedUser = users.splice(index, 1)[0];
   writeUsers(users);
   res.json({ letter: "User deleted", user: deletedUser });
});

app.put('/fileUrl', (req, res) => {
   let users = readUsers();
   const id = parseInt(req.params.id);
   const { name, surname } = req.body;

   const user = users.find(u => id == u.id);

   if (!user) {
    res.status(404).json("User not found");
   }

   user.name = name;
   user.surname = surname;
   
   writeUsers();
   res.json(user);
});

app.listen(PORT, () => {
    console.log("app run on PORT: ", PORT);
});