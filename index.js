require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const { dbConnect, urlModel } = require('./schema');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('0123456789', 10);
const {isURL} = require('validator');
const dns = require('dns');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

dbConnect();

app.use('/public', express.static(`${process.cwd()}/public`));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});


// Your first API endpoint
app.post('/api/shorturl', function(req, res) {
  const url = req.body.url;
  
  if(isURL(url)) {
  const shortUrl = nanoid(6);
  const newUrl = new urlModel({
    original_url: url,
    short_url: shortUrl
  });
  newUrl.save((err, data) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json({ original_url: data.original_url, short_url: data.short_url });
    }
  });
} else {
  res.json({ error: 'invalid URL' });
}

});


app.get('/api/shorturl/:shortUrl', function(req, res) {
  const shortUrl = req.params.shortUrl;
  urlModel.findOne({ short_url: shortUrl }, (err, data) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.redirect(data.original_url);
    }
  });
})

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
