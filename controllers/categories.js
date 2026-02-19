const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getCategories = async (req, res) => {
  console.log('see all Categories')
  const categories = await Category.find();
  res.status(StatusCodes.OK).json({ categories, count: categories.length })
}

const getCategory = async (req, res) => {
  res.status(StatusCodes.OK).json({ category: req.resource })
}

const createCategory = async (req, res) => {
  console.log(req.body)
  const {title, imageUrl, description} = req.body
  if (!title || title.trim() === '') {
    throw new BadRequestError('Title is required')
  }
  const category = await Category.create({
    title: title.trim(),
    description,
    imageUrl
  }
    
  )
  res.status(StatusCodes.CREATED).json({ category })
}

const updateCategory = async (req, res) => {
  const category = req.resource
  const { title, imageUrl, description } = req.body;

  if(title !== undefined){
    if (title.trim() === '') {
      throw new BadRequestError('Title cannot be empty')
    }
    category.title = title.trim()
  }
  if(description !== undefined)
    category.description = description

  if(imageUrl !== undefined)
    category.imageUrl = imageUrl

  await category.save()

  res.status(StatusCodes.OK).json({ category })
}

const deleteCategory = async (req, res) => {
  const category = req.resource
  await category.deleteOne()
  
  res.status(StatusCodes.OK).json({ 'message': 'Category deleted successfully'})
}

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategory,
}