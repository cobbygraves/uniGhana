const UserModel = require('../models/user.js')
const bcrypt = require('bcryptjs')
const createError = require('http-errors')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')

//function to check if email exist
const checkEmail = async (email, next) => {
  let existingEmail
  try {
    existingEmail = await UserModel.findOne({
      email: email
    })
  } catch (error) {
    return next(createError(400, error))
  }
  return existingEmail
}

//logic to get user
const getUser = async (req, res, next) => {
  const user = req.body

  let existingUser = await checkEmail(user.email, next)
  if (existingUser) {
    bcrypt
      .compare(user.password, existingUser.password)
      .then((resp) => {
        if (resp) {
          // generating a token for the varified user
          jwt.sign(
            { id: existingUser.id, email: existingUser.email },
            'C0DESCRIPT',
            { expiresIn: '30m' },
            (err, token) => {
              if (!err) {
                return res.status(200).json({
                  id: existingUser.id,
                  email: existingUser.email,
                  token,
                  verification: true
                })
              }
            }
          )
        } else {
          return res.json({ message: 'wrong password', verification: false })
        }
      })
      .catch((err) => console.log(err))
  } else {
    return res.json({ message: 'email does not exist', verification: false })
  }
}

//logic to create a user
const createUser = async (req, res, next) => {
  const { email, password, passwordRepeat } = req.body

  const emailExist = await checkEmail(email, next)
  if (emailExist) {
    return res.json({
      message: 'email already exist',
      verification: false,
      emailError: true
    })
  }

  if (password.length < 8 || passwordRepeat !== password) {
    return res.json({
      verification: false,
      passwordError: true
    })
  }

  const id = uuid.v4()
  bcrypt.hash(password, 10, (err, hashpwd) => {
    if (!err) {
      const user = { id, email, password: hashpwd }
      const userDocument = new UserModel(user)

      userDocument.save((err) => {
        if (err) {
          return next(createError(400, err))
        }

        jwt.sign(
          { id, email },
          'C0DESCRIPT',
          { expiresIn: '30m' },
          (err, token) => {
            if (!err) {
              return res.status(200).json({
                id,
                email,
                token,
                verification: true
              })
            }
          }
        )
      })
    }
  })
}

module.exports = { getUser, createUser }
