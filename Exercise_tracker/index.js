const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const mongoose = require("mongoose")
const uri = process.env.MONGO_URI
const {Schema} = require('mongoose')
const bodyParser = require('body-parser')


mongoose.connect(uri).then(()=>{
   console.log("Connected...")
}) 

const userSchema = new Schema({
   username: {
      type: String,
      required: true
   },
   log: [
      {
         description: String,
         duration: Number,
         date: {
            type: Date
         }
      }
   ],
   count: Number
})
const User = mongoose.model("free_users", userSchema)


app.use(cors())
app.use(bodyParser.urlencoded({extended: false}))
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.route('/api/users')
   .get((req, res)=>{
      const users = User.find((err, data)=>{
         if(err){
            console.log(err)
            res.json({error: err.message})
            return
         }
         console.log("Get success")
         res.json(data)

      })
   })
   .post((req, res)=>{
      const username = req.body.username
      const user = new User({username, count: 0})
      user.save((er, data)=>{
         if(er){
            console.log(er, "user post")
            res.json({error: err.message})
            return
         }
         console.log("user post success")
         res.json(data)
      })
   })

app.post("/api/users/:id/exercises", (req, res)=>{

   const {description} = req.body
   const duration = parseInt(req.body.duration)
   const date = req.body.date ? req.body.date : new Date()

   const id = req.params.id

   exercise = {
      date,
      duration,
      description
   }
   User.findByIdAndUpdate(id,
      {$push: {log: exercise },
      $inc: {count: 1}
   }, 
      {new: true}, (er, user)=>{
      if(er){
         console.log(er, "user exercise post")
         return res.json({error: er.message})
      }
      console.log("User exercise post success ")
      res.json({
         _id: user._id,
         username:user.username,
         ...exercise
      
      })
   })

})


app.get("/api/users/:_id/logs", (req, res)=>{
   const {from, to, limit} = req.query
   const id = req.params._id
   console.log({ ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) }, " Here")

   const findQuery = {
      _id: id,
      //"log.date": { ...(from && { $gte: new Date(from) }), ...(to && { $lte: new Date(to) }) }
   }
   console.log(to, from ,limit)
   
   console.log(findQuery)
   const query = User.findOne(findQuery)
   query.exec((er, user)=>{
      if(er){
         console.log(er)
         return res.json({error:er.message})
      }
      if(to || from){
         console.log(user.log)
      }
      let newLog =  user.log.map(l => ({
            description: l.description,
            duration: l.duration,
            date: new Date(l.date).toDateString()
         }))
      newLog = limit ? newLog.slice(0,limit) : newLog
      res.json({
         _id: user._id,
         username: user.username,
         count: user.count,
         log: newLog
      })
   })
})













const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
