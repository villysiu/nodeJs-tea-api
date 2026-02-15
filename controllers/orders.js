const Order = require('../models/Order')
const Cart = require('../models/Cart')
const OrderDetails = require('../models/OrderDetails')

const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getOrders = async (req, res) => {
  console.log('see all orders without details')
  const orders = await Order.find({ createdBy: req.user.userId })
    .sort('-createdAt')
    .select('-_id')

  res.status(StatusCodes.OK).json({ orders, count: orders.length })
}

const getOrder = async (req, res) => {
  
  const order = req.resource

  const orderDetailsData = await OrderDetails.find({ 'order': order._id})
    .select('-_id')
    .populate('menuitem', 'title -_id')
    .populate('milk', 'title -_id')
    .populate('size', 'title -_id')

  const orderObject = order.toObject()



  res.status(StatusCodes.OK).json({ 
    ...order.toObject(), 
    orderDetails: {
      orderDetailsData,
      count: orderDetailsData.length
    }
    
  })
}

const createOrder = async (req, res) => {
  console.log(req.body)
  const carts = await Cart.find({'createdBy': req.user.userId})

  if(carts.length === 0)  
    throw new BadRequestError("Cart is empty" )

  // cart total
  const total = carts.reduce((acc, cart) => 
    acc + cart.unitPrice * cart.quantity,
    0
  )
  const order = await Order.create({
    createdBy: req.user.userId,
    total
  })

  // create orderDetails data so if crashed, it wont mess up the database withpartial data
  const orderDetailsData = carts.map(cart => ({
    order: order._id,
    menuitem: cart.menuitem,
    milk: cart.milk,
    size: cart.size,
    temperature: cart.temperature,
    sugar: cart.sugar,
    unitPrice: cart.unitPrice,
    quantity: cart.quantity,
  }))

  await OrderDetails.insertMany(orderDetailsData)


  // delete user cart
  await Cart.deleteMany({ createdBy: req.user.userId })


  res.status(StatusCodes.CREATED).json({ 
    ...order.toObject(),
    orderDetails: {
      orderDetailsData,
      count: orderDetailsData.length 
    }
  }) 
}

// No update order, order is genearated by user and order details. If orderDetails change, order total will change
// Admin only

// const updateOrder = async (req, res) => {
//   const order = req.resource

  
//   res.status(StatusCodes.OK).json({ 
//     ...order.toObject(),
//     orderDetails: {
//       orderDetailsData,
//       count: orderDetailsData.length 
//     } 
//   })
// }

const deleteOrder = async (req, res) => {
  const order = req.resource

  await OrderDetails.deleteMany({ order: order._id })
  await Order.findByIdAndDelete(order._id)

  console.log(`Order ${order._id} and its details deleted`)

  res.status(StatusCodes.OK).send()
}

module.exports = {
  createOrder,
  deleteOrder,
  getOrders,
  // updateOrder,
  getOrder,
}