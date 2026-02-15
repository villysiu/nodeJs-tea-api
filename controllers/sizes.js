const Size = require('../models/Size')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getSizes = async (req, res) => {
  const sizes = await Size.find();
  res.status(StatusCodes.OK).json({ sizes, count: sizes.length })
}


const getSize = async (req, res) => {
  const {id: sizeId} = req.params

  const size = await Size.findById(sizeId)

  if (!size) {
    throw new NotFoundError(`No size with id ${sizeId}`)
  }
  res.status(StatusCodes.OK).json({ size })
}

const createSize = async (req, res) => {
  const { title, price } = req.body

  if (!title || title.trim() === '') {
    throw new BadRequestError('Title is required')
  }

  if (price === undefined || isNaN(price)) {
    throw new BadRequestError('Price must be a valid number')
  }

  const size = await Size.create({
    title: title.trim(),
    price: Number(price)
  })

  res.status(StatusCodes.CREATED).json({ size })
}


const updateSize = async (req, res) => {
  const { id: sizeId } = req.params;
  const { title, price } = req.body;

  const data = {}
  if(title !== undefined){
    if (title.trim() === '') {
      throw new BadRequestError('Title cannot be empty')
    }
    data.title = title.trim()
  }
  if (price !== undefined) {
    if (isNaN(price)) 
      throw new BadRequestError('Price must be a number')

    data.price = Number(price)
  }
  const size = await Size.findByIdAndUpdate(
    sizeId,
    data,
    { new: true, runValidators: true }
  )
  if (!size) {
    throw new NotFoundError(`No Size with id ${sizeId}`)
  }
  res.status(StatusCodes.OK).json({ size })
}

const deleteSize = async (req, res) => {
  const { id: sizeId } = req.params;

  const size = await Size.findByIdAndDelete(sizeId)
  if (!size) {
    throw new NotFoundError(`No size with id ${sizeId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createSize,
  deleteSize,
  getSizes,
  updateSize,
  getSize,
}