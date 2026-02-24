const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')

const getCurrentUser = async (req, res) => {
  console.log(req.user)
  res.status(StatusCodes.OK).json({user: req.user})
}

const register = async (req, res) => {
  const user = await User.create({ ...req.body })

  const token = user.createJWT()
  res.status(StatusCodes.CREATED).json(
    { user: {
      userId: user._id, 
      email: user.email,
      name: user.name, 
      role: user.role 
    }, 
    token })
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
  res.status(StatusCodes.OK).json({ user: {
                                      userId: user._id, 
                                      email: user.email,
                                      name: user.name, 
                                      role: user.role 
                                    } , 
                                    token })
}

const updateCredential = async (req, res) => {
  const user = req.user;
  const {name, password} = req.body
  
  console.log("update", user)
  if(name !== undefined){
    if (name.trim() === '') {
      throw new BadRequestError('User name cannot be empty')
    }
    user.name = name.trim()
  }
      // if(password)
  //   user.password = password

  await user.save()
  res.status(StatusCodes.OK).json({ user})
}




module.exports = {
  register,
  login,
  updateCredential,
  getCurrentUser
}