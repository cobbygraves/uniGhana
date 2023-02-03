const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: 'Required'
  },
  email: {
    type: String,
    required: 'Required'
  },
  password: {
    type: String,
    required: 'Required'
  }
})

const UserModel = mongoose.model('user', UserSchema)

module.exports = UserModel
