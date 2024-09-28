/*
* Developers: Rishi Patel and Rushabh Runwal
*/
require('dotenv').config();
const express = require('express');
const Mastodon = require('mastodon-api');
const bodyParser = require('body-parser');
const path = require('path'); 

const app = express();
const port = 3000;

/* Body parser to handle POST data */
app.use(bodyParser.json());

console.log('Access Token:', process.env.ACCESS_TOKEN);
console.log('API URL:', process.env.API_URL);

/* Initialize Mastodon API */
const M = new Mastodon({
  access_token: process.env.ACCESS_TOKEN,
  api_url: process.env.API_URL, 
});

/* Create a new post (status update) */
app.post('/create', async (req, res) => {
  try {
    const status = req.body.status;
    const response = await M.post('statuses', { status });
    res.json(response.data);
  } catch (err) {
    console.log('Creation failed ' + err)
    res.status(500).send(err.message);
    alert('Post Creation Failed' + err );
  }
});

/* Retrieve a post by ID */
app.get('/retrieve/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const response = await M.get(`statuses/${id}`);
    res.json(response.data);
  } catch (err) {
    console.log('Nah Something is wrong ' + err)
    res.status(500).send(err.message);
  }
});

/* Delete a post by ID */
app.delete('/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await M.delete(`statuses/${id}`);
    res.json({ message: 'Post deleted' });
  } catch (err) {
    console.log('post deletion failed ' + err)
    res.status(500).send(err.message);
  }
});


app.use(express.static(path.join(__dirname, '../public')));

app.listen(port, () => {
  console.log(`Backend running on http://localhost:${port}`);
});
module.exports = app;


