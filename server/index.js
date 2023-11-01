// server/index.js
const express = require("express");
const users = require("../users.json");
const app = express();
const PORT = 3001;
app.get("/api/users", (req, res) => {
    return res.json(users);
});
app.listen(PORT, () => console.log('Listening on port ${PORT}'));