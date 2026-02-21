const Cart = require('../models/Cart')
const Menuitem = require('../models/Menuitem')
const Milk = require('../models/Milk')
const Size = require('../models/Size')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getCarts = async (req, res) => {
    const carts = await Cart.find({ createdBy: req.user.userId })
    // .populate({
    //     path: 'menuitemId',
    //     select: 'title price _id'
    // })
    // .populate({
    //   path: 'milkId',
    //   select: 'title price _id'
    // })
    // .populate({
    //   path: 'sizeId',
    //   select: 'title price _id'
    // })
    .sort('-updatedAt')

    const subtotal = carts.reduce((acc, cart) => (
        acc + cart.unitPrice * cart.quantity
    ), 0)

    res.status(StatusCodes.OK).json({ carts, count: carts.length, subtotal })
}

const getCart = async (req, res) => {
    
    const cart = req.resource
    res.status(StatusCodes.OK).json({ cart })
}

const createCart = async (req, res) => {
    console.log("creating cart")
    console.log(req.body)
//     {
//   menuitemId: '69814634fd04af387993d3fa',
//   milkId: '69814385fd04af387993d3e6',
//   sizeId: '698142fbfd04af387993d3e4',
//   sugar: 'NA',
//   temperature: 'NA',
//   quantity: 1
// }
    const {
        menuitemId,
        milkId,
        sizeId,
        temperature,
        sugar,
        quantity
    } = req.body

    let unitPrice = 0

    let menuitem = await Menuitem.findById(menuitemId)
    if(!menuitem)
        throw new NotFoundError('Menuitem not found')
    unitPrice += menuitem.price


    let milk = await Milk.findById(milkId)
    if(!milk)
        throw new NotFoundError('Milk not found')
    unitPrice += milk.price     

    let size = await Size.findById(sizeId)
    if(!size)
        throw new NotFoundError('Size not found')
    unitPrice += size.price


    const cart = await Cart.create({
        createdBy: req.user.userId,
        menuitemId: menuitem._id,

        milkId: milk._id,
        sizeId: size._id,
        temperature,
        sugar,
        quantity,
        unitPrice
        
    })
    res.status(StatusCodes.CREATED).json({ cart })
}

const updateCart = async (req, res) => {
    console.log("update cart")
    console.log(req.body)
//     {
//   cartId: '69992f2140affd8172d3bcb3',
//   milkId: '69813e1ab60cff3582533eda',
//   sizeId: '698142fbfd04af387993d3e4',
//   sugar: '0%',
//   temperature: 'HOT',
//   quantity: 2
// }
    // all item required
    const {
        // menuitemId,
        milkId,
        temperature,
        sugar,
        sizeId,
        quantity
    } = req.body

    const cart = req.resource;


    const menuitem = await Menuitem.findById(cart.menuitemId)
    if(!menuitem)
        throw new NotFoundError('Menuitem not found')

    let unitPrice = menuitem.price

    const milk = await Milk.findById(milkId)
    console.log(milk)
    if(!milk)
        throw new NotFoundError('Milk not found')
    unitPrice += milk.price     

    const size = await Size.findById(sizeId)
    if(!size)
        throw new NotFoundError('Size not found')
    unitPrice += size.price
    

    cart.milkId = milk._id
    cart.sizeId = size._id
    cart.temperature = temperature
    cart.sugar = sugar
    cart.quantity = quantity
    cart.unitPrice = unitPrice
        
    await cart.save()

    res.status(StatusCodes.OK).json({ cart })
}

const deleteCart = async (req, res) => {
  const cart = req.resource
  await cart.deleteOne()
  res.status(StatusCodes.OK).json({'message': 'cart is deleted successfully'})
}

module.exports = {
  createCart,
  getCart,
  deleteCart,
  getCarts,
  updateCart
}