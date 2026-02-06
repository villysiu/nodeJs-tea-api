const Category = require('../models/Category')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')

const getCategories = async (req, res) => {
  console.log('see all Categories')
  const categories = await Category.find();
  res.status(StatusCodes.OK).json({ categories, count: categories.length })
}
const getCategory = async (req, res) => {
  const {id: categoryId} = req.params

  const category = await Category.findById(categoryId)

  if (!category) {
    throw new NotFoundError(`No category with id ${categoryId}`)
  }
  res.status(StatusCodes.OK).json({ category })
}

const createCategory = async (req, res) => {
  console.log(req.body)
  const category = await Category.create(req.body)
  res.status(StatusCodes.CREATED).json({ category })
}

const updateCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { title } = req.body;

  if (title === '') {
    throw new BadRequestError('Title field cannot be empty')
  }

  const category = await Category.findByIdAndUpdate(
    categoryId,
    req.body,
    { new: true, runValidators: true }
  )
  if (!category) {
    throw new NotFoundError(`No category with id ${categoryId}`)
  }
  res.status(StatusCodes.OK).json({ category })
}

const deleteCategory = async (req, res) => {
  const { id: categoryId } = req.params;

  const category = await Category.findByIdAndRemove(categoryId)
  if (!category) {
    throw new NotFoundError(`No category with id ${categoryId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
  getCategory,
}