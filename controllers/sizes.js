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
  // title and price
  const size = await Size.create(req.body)
  res.status(StatusCodes.CREATED).json({ size })
}

const updateSize = async (req, res) => {
  const { id: sizeId } = req.params;
  const { title } = req.body;

  if (title === '') {
    throw new BadRequestError('Title field cannot be empty')
  }

  const size = await Size.findByIdAndUpdate(
    sizeId,
    req.body,
    { new: true, runValidators: true }
  )
  if (!size) {
    throw new NotFoundError(`No Size with id ${SizeId}`)
  }
  res.status(StatusCodes.OK).json({ size })
}

const deleteSize = async (req, res) => {
  const { id: sizeId } = req.params;

  const size = await Size.findByIdAndRemove(sizeId)
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