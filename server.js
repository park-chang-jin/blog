const express = require('express');

const morgan = require('morgan');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const postRouter = require('./routes/api/post');
const profileRouter = require('./routes/api/profile');
const usersRouter = require('./routes/api/users');

const app = express();


const db = require('./config/keys').mongoURI;
mongoose.connect(db, { useNewUrlParser: true, useCreateIndex: true})
    .then( () => console.log('MongoDB Connected...'))
    .catch( err => console.log(err));



app.use(morgan('dev'));

// body-Parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// passport middleware
app.use(passport.initialize());

// passport confing
require('./config/passport')(passport);





app.use('/api/post', postRouter);
app.use('/api/profile', profileRouter);
app.use('/api/users', usersRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
