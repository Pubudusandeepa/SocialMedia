const express = require('express');
const connectDB = require('./config/db');

const app = express();

//connect db
connectDB();

//Init middleware
app.use(express.json({ extended: false }));

app.get('/', (req,res) => res.send('ApI running'));

//define Router
app.use('/api/users', require('../devconnector/routes/api/users'));
app.use('/api/auth', require('../devconnector/routes/api/auth'));
app.use('/api/profile', require('../devconnector/routes/api/profile'));
app.use('/api/posts', require('../devconnector/routes/api/posts'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server started on port ${PORT}`));