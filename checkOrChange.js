function checkIsUnique(id, email, emailToId) {
    if (email && emailToId[email] && emailToId[email] !== id) {
        return res.status(404).json({ message: "Email must be unique" }); 
    }
}

function changeEmail(id, email, usersById, emailToId) {
   const oldEmail = usersById[id].email;

   if (email !== oldEmail) {
        delete emailToId[oldEmail];
        emailToId[email] = id;
   }
}


module.exports = { checkIsUnique, changeEmail };