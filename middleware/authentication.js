
const jwt = require('jsonwebtoken')
const { UnauthenticatedError } = require('../errors')

const auth = async (req, res, next) => {
  // check header
  console.log("check user login")
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new UnauthenticatedError('Authentication invalid')
  }
  const token = authHeader.split(' ')[1]

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)

    // attach the user to the header
    req.user =  { 
                  userId: payload.userId, 
                  name: payload.name, 
                  role: payload.role 
                }

    next()

  } catch (error) {
    throw new UnauthenticatedError('Authentication invalid')
  }
}

module.exports = auth