const Cart = require('../models/Cart')
const Menuitem = require('../models/Menuitem')
const Milk = require('../models/Milk')
const Size = require('../models/Size')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getCarts = async (req, res) => {
    const carts = await Cart.find({ createdBy: req.user.userId })
    .populate({
        path: 'menuitem',
        select: 'title -_id'
    })
    .populate({
      path: 'milk',
      select: 'title -_id'
    })
    .populate({
      path: 'size',
      select: 'title -_id'
    })
    .sort('updatedAt')

    res.status(StatusCodes.OK).json({ carts, count: carts.length })
}

const getCart = async (req, res) => {
    
    const cart = req.resource
    res.status(StatusCodes.OK).json({ cart })
}

const createCart = async (req, res) => {
    console.log("creating cart")
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
        menuitem: menuitem._id,

        milk: milk._id,
        size: size._id,
        temperature,
        sugar,
        quantity,
        unitPrice
        
    })
    res.status(StatusCodes.CREATED).json({ cart })
}

const updateCart = async (req, res) => {
    const cartId = req.params.id;
    
    const {
        // menuitemId,
        milkId,
        temperature,
        sugar,
        sizeId,
        quantity
    } = req.body

    const cart = req.resource;


    const menuitem = await Menuitem.findById(cart.menuitem._id)
    if(!menuitem)
        throw new NotFoundError('Menuitem not found')

    let unitPrice = menuitem.price

    const milk = await Milk.findById(milkId)
    if(!milk)
        throw new NotFoundError('Milk not found')
    unitPrice += milk.price     

    const size = await Size.findById(sizeId)
    if(!size)
        throw new NotFoundError('Size not found')
    unitPrice += size.price
    

    cart.milk = milk._id
    cart.size = size._id
    cart.temperature = temperature
    cart.sugar = sugar
    cart.quantity = quantity
    cart.unitPrice = unitPrice
        
    await cart.save()

    res.status(StatusCodes.OK).json({ cart })
}

const deleteCart = async (req, res) => {
  const { id: cartId } = req.params;

  const cart = await Cart.findByIdAndDelete(cartId)
  if (!cart) {
    throw new NotFoundError(`No cart with id ${cartId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createCart,
  getCart,
  deleteCart,
  getCarts,
  updateCart
}