const express = require('express');
const app = express();

const postRouter = require('./routes/api/post');
const profileRouter = require('./routes/api/profile');
const usersRouter = require('./routes/api/users');

app.use('/api/post', postRouter);
app.use('/api/profile', profileRouter);
app.use('/api/users', usersRouter);

const PORT = 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
