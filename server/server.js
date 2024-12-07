const express = require('express');
// const connectDB = require('./config/db');
const path = require('path');
const cors = require('cors');
const axios = require('axios');
const { MORALIS_API_KEY, PRIVATE_KEY } = require("./utils/keys")
const Moralis = require("moralis").default
const PORT = process.env.PORT || 8001;
console.log({ PORT })
require('dotenv').config();

const app = express();

// Connect Database
// connectDB();

// Init Middleware
app.use(express.json());
app.use(cors());


// Define Routes
app.use('/api', require('./routes/api/index'));
app.use('/api/history', require('./routes/api/history'));
app.use('/api/config', require('./routes/api/config'));
app.use('/api/users', require('./routes/api/users'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/profile', require('./routes/api/profile'));
app.use('/api/posts', require('./routes/api/posts'));
app.use('/api/tokens', require('./routes/api/tokens'));
app.use('/api/token-pairs', require('./routes/api/tokenPairs'));
app.use('/api/smart-contracts', require('./routes/api/smartContracts'));

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Set static folder
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}


// check_cookie();
// const func = async () => {
//   const response = await axios("https://api.coinmarketcap.com/v1/ticker/?limit=0");
//   console.log(response.data);
// }

// func();

Moralis.start({
  apiKey: MORALIS_API_KEY,
}).then(() => {
  app.listen(PORT, () => {
    console.log(`${PORT} Listening for API Calls`);
  })
})