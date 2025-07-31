const express = require('express');
const app = express();
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { readUsers, writeUsers } = require('./helpers.js');
const { checkIsUnique, changeEmail } = require('./checkOrChange.js');
app.use(express.json());
app.set('PORT', process.env.PORT || 3080);

// made email O(1), now email and id get operation O(1)
app.get('/users/:id_or_email', (req, res) => {
    const { usersById, emailToId } = readUsers();
    // i don't know here will be id or email because of that not use destructuring
    let param = req.params.id_or_email;

    if (usersById[param]) {
        return res.json(usersById[param]);
    }

    let userId = emailToId[param];
    if (userId && usersById[userId]) {
        return res.json(usersById[userId]);
    }

    return res.status(404).json({ message: "User not found" });
});


app.post('/users', (req, res) => {
    const { usersById, emailToId } = readUsers();
    const { name, surname, email, meta } = req.body;
    
    if (emailToId[email]) {
        return res.status(404).json({ letter: "Email must be unique" });
    }

    let id = uuidv4();
    const newUser = { meta, name, surname, email };
    usersById[id] = newUser;
    emailToId[email] = id;
    
    writeUsers({ usersById, emailToId });
    res.status(201).json(newUser);
});


app.delete('/users/:id', (req, res) => {
   let { usersById, emailToId } = readUsers();
   // used destructuring here
   const { id } = req.params;

   if (!usersById[id]) {
        return res.status(404).json({ letter: "User not found" });
   }

   const deletedUser = usersById[id];
   delete usersById[id];
   delete emailToId[deletedUser.email];

   writeUsers({ usersById, emailToId });
   res.json({ letter: "User deleted", user: deletedUser });
});


app.patch('/users/:id', (req, res) => {
    let { usersById, emailToId } = readUsers();
    const { id } = req.params;

    if (!usersById[id]) {
        return res.status(404).json({ message: "User not found" });;
    }

    const update = req.body;
  // made optimizations in put and patch operation code repeated I separate in another file
    try {
        checkIsUnique(id, update.email, emailToId);
        changeEmail(id, update.email, usersById, emailToId);
    } catch(err) {
        console.error(err);
    }

    usersById[id] = { ...usersById[id], ...update };
    writeUsers({ usersById, emailToId });

    res.json(usersById[id]);
});



app.put('/users/:id', (req, res) => {
   let { usersById, emailToId } = readUsers();
   const { id } = req.params;

   if (!usersById[id]) {
        return res.status(404).json({ message: "User not found"});;
   }

   const { name, surname, email, meta } = req.body;

   try {
        checkIsUnique(id, email, emailToId);
        changeEmail(id, email, usersById, emailToId);
   } catch(err) {
        console.error(err);
   }

   usersById[id] = { meta, name, surname, email };

   writeUsers({ usersById, emailToId });
   res.json(usersById[id]);
});

app.listen(app.get('PORT'), () => {
  console.log("app listen on PORT: ", app.get('PORT'));
})