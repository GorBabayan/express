const express = require('express');
const app = express();

app.use(express.json());
const PORT = 3015;

let users = [];
let id = 1;

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/users', (req, res) => {
    const { name, surname } = req.body;
    
    const newUser = { id: ++id, name, surname };
    users.push(newUser);
    res.status(201).json(newUser);
});


app.delete('/users/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const index = users.findIndex(u => u.id == id);

   if (index == -1) {
        res.status(404).json("User not found");
   }

   const deletedUser = users.splice(index, 1)[0];

   res.json({ letter: "User deleted", user: deletedUser });
});

app.put('/users/:id', (req, res) => {
   const id = parseInt(req.params.id);
   const { name, surname } = req.body;

   const user = users.find(u => id == u.id);

   if (!user) {
    res.status(404).json("User not found");
   }

    user.name = name;
    user.surname = surname;

   res.json(user);
});

app.listen(PORT, () => {
    console.log("app run on PORT: ", PORT);
});