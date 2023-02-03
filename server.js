const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const path = require('path')
const userRoutes = require('./routes/user')
dotenv.config()

const server = express()

server.use(express.json({ limit: '200mb', extended: true }))
server.use(express.urlencoded({ limit: '200mb', extended: true }))
server.use(cors())
server.use(express.static(path.join(__dirname, 'client', 'build')))

//user ROUTES
server.use(userRoutes)

server.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
})

const PORT = process.env.PORT || 5000

mongoose.connect(
  process.env.MONGO_URL,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (err) => {
    if (!err) {
      server.listen(PORT, (err) => {
        if (err) {
          console.log('Error Connecting To Server')
        } else {
          console.log('Connections Successful')
        }
      })
    } else {
      console.log('Error Connecting To Database')
    }
  }
)
