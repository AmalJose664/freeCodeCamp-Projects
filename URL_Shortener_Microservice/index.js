require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const isUrl = require("is-url")
const bodyParser = require('body-parser')
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}))

let counter = 0
let shortendUrls = {};

app.post('/api/shorturl', (req,res)=>{
   counter+=1
   const url =req.body.url
   console.log(url, isUrl(url))
   if(!isUrl(url)){
      res.json({error: 'invalid url'})
      return
   }
   console.log(shortendUrls)
   shortendUrls[counter] = url
   const shortUrl = counter
   res.json({original_url:url, short_url: shortUrl})
})

app.get("/api/shorturl/:id",(req, res)=>{
   const id = req.params.id
   const url = shortendUrls[id]
   console.log(shortendUrls, url, id)
   if(url){
      res.redirect(url)
      return
   }else{
      res.json({"error":"No short URL found for the given input"})
      return
   }
})

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
