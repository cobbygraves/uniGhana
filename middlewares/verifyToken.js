const jwt = require('jsonwebtoken')

const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]
    jwt.verify(token, 'C0DESCRIPT', (err, tokenData) => {
      if (!err) {
        req.userInfo = tokenData
        next()
      } else {
        res.status(403).json({ message: 'PLEASE LOGIN' })
      }
    })
  } catch (err) {
    res.status(401).send('UNAUTHORIZED USER')
  }
}

module.exports = verifyToken
