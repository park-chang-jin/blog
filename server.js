const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');

const postRouter = require('./routes/api/post');
const profileRouter = require('./routes/api/profile');
const usersRouter = require('./routes/api/users');

const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true})
    .then( () => console.log('MongoDB Connected...'))
    .catch( err => console.log(err));

app.use(morgan('dev'));



app.use('/api/post', postRouter);
app.use('/api/profile', profileRouter);
app.use('/api/users', usersRouter);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
