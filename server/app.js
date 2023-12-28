const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/user');
const taskRoutes = require('./routes/task');

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/user',userRoutes);

app.use('/task',taskRoutes);

mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{
    app.listen(3000);
    console.log('server running on port 3000');
})
.catch((err)=>{
    console.log(err)
})




  