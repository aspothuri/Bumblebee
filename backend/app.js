const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const usersRouter = require('./routes/users');
const tagsRouter = require('./routes/tags');
const profilesRouter = require('./routes/profiles');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.STRING)
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// Define a simple root route
app.get('/', (req, res) => {
  
});

// Mount the users router
app.use('/users', usersRouter);
app.use('/tags', tagsRouter);
app.use('/profiles', profilesRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
