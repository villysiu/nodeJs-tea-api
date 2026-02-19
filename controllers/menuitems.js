const { StatusCodes } = require('http-status-codes')
const mongoose = require('mongoose')
const Menuitem = require('../models/Menuitem')
const Category = require('../models/Category')
const Milk = require('../models/Milk')
const { BadRequestError, NotFoundError } = require('../errors')

const temperaturesEnum = ['NA', 'HOT', 'ICED']
const sugarEnum = ['NA', '0%', '25%', '50%', '75%', '100%']

const createMenuitem = async (req, res) => {
  
  const {
    title,
    imageUrl,
    price,
    categoryId,
    milkId,
    temperature,
    sugar,
    active
  } = req.body


  if (!title || title.trim() === '') 
    throw new BadRequestError('Title required')
  if(!categoryId) 
    throw new BadRequestError('Category required')
  if(!milkId) 
    throw new BadRequestError('Milk required')

  const category = await Category.findById(categoryId)
  if (!category) {
    throw new NotFoundError('Category not found')
  }
  const milk = await Milk.findById(milkId)
  if(!milk)
      throw new NotFoundError('Milk not found')
  
  if(temperature && !temperaturesEnum.includes(temperature))
      throw new BadRequestError('Temperature not valid. NA, HOT, ICED')

  
  if(sugar &&!sugarEnum.includes(sugar))
      throw new BadRequestError('Sugar not valid. NA, 0%, 25%, 50%, 75%, 100%')

 
  if (price === undefined || isNaN(price))
    throw new BadRequestError('Price must be a number')

  const menuitem = await Menuitem.create({
    title: title.trim(),
    imageUrl,
    price: Number(price),
    category: category._id,
    milk: milk._id, 
    temperature,
    sugar,
    active
  })

  res.status(StatusCodes.CREATED).json({ menuitem })
}


const updateMenuitem = async (req, res) => {
  const menuitem = req.resource

  const {
    title,
    imageUrl,
    price,
    categoryId,
    milkId,
    temperature,
    sugar,
    active
  } = req.body

  if(title !== undefined){
    if (title.trim() === '') {
      throw new BadRequestError('Title cannot be empty')
    }
    menuitem.title = title.trim()
  }
  
  if(categoryId !== undefined){
    const category = await Category.findById(categoryId)
    if (!category) {
      throw new NotFoundError('Category not found')
    }
    menuitem.category = category._id
  }
  
  if(milkId !== undefined){
    const milk = await Milk.findById(milkId)
    if(!milk){
        throw new NotFoundError('Milk not found')
    }
    menuitem.milk = milk._id
  }
  

  if(temperature !== undefined){
    if(!temperaturesEnum.includes(temperature))
      throw new BadRequestError('Temperature not valid. NA, HOT, ICED')
    menuitem.temperature = temperature
  }
  
  if(sugar !== undefined){
    if(!sugarEnum.includes(sugar))
      throw new BadRequestError('Sugar not valid. NA, 0%, 25%, 50%, 75%, 100%')
    menuitem.sugar = sugar
  }
  
  if (imageUrl !== undefined) 
    menuitem.imageUrl = imageUrl.trim()


  if (price !== undefined) {
    if (isNaN(price)) throw new BadRequestError('Price must be a number')
    menuitem.price = price
  }

  
  if(active !== undefined) 
    menuitem.active = active

  await menuitem.save()

  res.status(StatusCodes.OK).json({ menuitem })
}


const getMenuitems = async (req, res) => {
  const { category } = req.query; // query param: ?category=<id>

  const filter = {};
  if (category) 
    filter.category = category;

  const menuitems = await Menuitem.find(filter)
    .populate('category', 'title -_id')

  res.status(StatusCodes.OK).json({
    menuitems,
    count: menuitems.length,
  });
};



const getMenuitem = async (req, res) => {
  const menuitem =  await req.resource
    .populate('category', 'title -_id')
    .populate('milk', 'title price -_id')
  res.status(StatusCodes.OK).json({ menuitem })
}



const deleteMenuitem = async (req, res) => {


  const menuitem = req.resource
  await menuitem.deleteOne()

  res.status(StatusCodes.OK).json({ 'message': 'Menu item deleted' })
}



module.exports = {
  createMenuitem,
  updateMenuitem,
  getMenuitems,
  getMenuitem,
  deleteMenuitem
}
