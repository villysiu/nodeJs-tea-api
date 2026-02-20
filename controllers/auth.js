const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const register = async (req, res) => {
  const user = await User.create({ ...req.body })

  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json({ user: { name: user.name }, token })
}

const login = async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    throw new BadRequestError('Please provide email and password')
  }

  // check if user existed by email
  const user = await User.findOne({email })
  if (!user) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  // compare password
  const isPasswordCorrect = await user.comparePassword(password)
  if (!isPasswordCorrect) {
    throw new UnauthenticatedError('Invalid Credentials')
  }

  console.log(user)
  
  const token = user.createJWT()
  res.status(StatusCodes.OK).json({ user , token })
}

const updateCredential = async (req, res) => {
  const user = await User.findById(req.user.userId)
  const {name, password} = req.body
  
  console.log(user)
  user.name = name
  user.password = password

  await user.save()
  res.status(StatusCodes.OK).json({ user })
}
const getCurrentUser = async (req, res) => {
  res.status(StatusCodes.OK).json({user: req.user})
}


module.exports = {
  register,
  login,
  updateCredential,
  getCurrentUser
}