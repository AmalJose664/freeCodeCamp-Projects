var express = require('express');
var app = express();

var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200})); 

app.use(express.static('public'));

app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});
app.get("/api", (req, res)=>{
   res.json({unix: (new Date()).getTime(),
      utc:(new Date()).toUTCString()})

})

app.get("/api/:date", function (req, res) {
   const time = req.params.date
   console.log(time,typeof time, " <<")
   let unix
   let utc 
   
   if((new Date(parseInt(time))).toString() === "Invalid Date"){
      res.json({error: "Invalid Date"})
      return
   }

   if((new Date(parseInt(time))).getTime() === parseInt(time) && time.indexOf("-") === -1 && time.indexOf(" ")=== -1){
      console.log("Milli part =======") 
      unix = parseInt(time)
      utc = (new Date(unix)).toUTCString()
   }else{
      console.log("Not Milli part =======")
      unix = (new Date(time)).getTime()
      utc = (new Date(parseInt(unix))).toUTCString()
   }
   console.log("utc = ",utc," unix = ", unix, "Date her========::\n\n")
   res.json({
      unix,
      utc
   });
});




var listener = app.listen(process.env.PORT || 3000, function () {
  console.log('Your app is listening on port ' +listener.address().port, new Date().toString())
});
