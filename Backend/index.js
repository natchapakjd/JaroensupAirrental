const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const auth =require('./routes/auth')
const app = express();
const port = 3000;
const user =require('./routes/users')

app.use(express());
app.use(cors());
app.use(bodyParser.json());

app.use(auth)
app.use(user)

app.get("/hello", (req, res) => {
    res.json("Hello world")
});

app.listen(port, () => {
    console.log(`App is running at http://localhost:${port}`);
});