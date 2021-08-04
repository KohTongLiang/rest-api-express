const mongoose = require('mongoose');
const url = process.env.MONGODB_URI
const connect = mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
})

connect.then(db => {
    console.log("connected to db")
  }).catch(err => {
    console.log(err)
  })