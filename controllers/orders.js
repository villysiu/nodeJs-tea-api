const Order = require('../models/Order')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getAllOrders = async (req, res) => {
  console.log('see all orders')
  const orders = await Order.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}
const getOrder = async (req, res) => {
  const {
    user: { userId },
    params: { id: orderId },
  } = req

  const order = await Order.findOne({
    _id: orderId,
    createdBy: userId,
  })
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`)
  }
  res.status(StatusCodes.OK).json({ order })
}

const createOrder = async (req, res) => {
  console.log(req.body)
  req.body.createdBy = req.user.userId
  const order = await Order.create(req.body)
  res.status(StatusCodes.CREATED).json({ order })
}

const updateOrder = async (req, res) => {
  const {
    body: { status },
    user: { userId },
    params: { id: orderId },
  } = req

  if (status === '') {
    throw new BadRequestError('Status field cannot be empty')
  }
  const order = await Order.findByIdAndUpdate(
    { _id: orderId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`)
  }
  res.status(StatusCodes.OK).json({ order })
}

const deleteOrder = async (req, res) => {
  const {
    user: { userId },
    params: { id: orderId },
  } = req

  const order = await Order.findByIdAndRemove({
    _id: orderId,
    createdBy: userId,
  })
  if (!order) {
    throw new NotFoundError(`No order with id ${orderId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createOrder,
  deleteOrder,
  getAllOrders,
  updateOrder,
  getOrder,
}