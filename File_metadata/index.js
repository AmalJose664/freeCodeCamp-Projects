var express = require('express');
var cors = require('cors');
require('dotenv').config()
const bodyParser = require("body-parser");
var app = express();
const multer = require('multer')


const upload = multer({storage: multer.memoryStorage()})

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.post('/api/fileanalyse', upload.single('upfile'), (req, res)=>{
   console.log("-----new----\n",req.file)
   if(!req.file){
      return res.json({error: "No file received"})
   }
   const file = req.file
   res.json({name: file.originalname,type:file.mimetype ,size: file.size})
})


const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log('Your app is listening on port ' + port)
});
