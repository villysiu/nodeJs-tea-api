const Milk = require('../models/Milk')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getMilks = async (req, res) => {
  const milks = await Milk.find();
  res.status(StatusCodes.OK).json({ milks, count: milks.length })
}


const getMilk = async (req, res) => {
  
  res.status(StatusCodes.OK).json({ milk: req.resource })
}

const createMilk = async (req, res) => {
  // title and price
  const { title, price } = req.body

  if (!title || title.trim() === '') {
    throw new BadRequestError('Title is required')
  }

  if (price === undefined || isNaN(price)) {
    throw new BadRequestError('Price must be a valid number')
  }

  const milk = await Milk.create({
    title: title.trim(),
    price: Number(price)
  })

  res.status(StatusCodes.CREATED).json({ milk })
}


const updateMilk = async (req, res) => {
  const milk = req.resource
  const { title, price } = req.body;


  if(title !== undefined){
    if (title.trim() === '') {
      throw new BadRequestError('Title cannot be empty')
    }
    milk.title = title.trim()
  }
  if (price !== undefined) {
    if (isNaN(price)) 
      throw new BadRequestError('Price must be a number')

    milk.price = Number(price)
  }
  await milk.save()
  
  res.status(StatusCodes.OK).json({ milk })
}

const deleteMilk = async (req, res) => {
  const milk = req.resource
  await milk.deleteOne()
  res.status(StatusCodes.OK).json({ 'message': 'Milk deleted successfully'})
}

module.exports = {
  createMilk,
  deleteMilk,
  getMilks,
  updateMilk,
  getMilk,
}