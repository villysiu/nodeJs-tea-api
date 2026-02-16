const express = require('express')

const router = express.Router()
const {
    createCategory,
    deleteCategory,
    getCategories,
    updateCategory,
    getCategory,
} = require('../controllers/categories')

const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')
const getResourceById = require('../middleware/validateRequest')

//public 
router.get("/", getCategories);
router.get("/:id", getResourceById(Category), getCategory);

// admin
router.post("/", authenticateUser, isAdmin, createCategory);
router.patch("/:id", authenticateUser, isAdmin, getResourceById(Category), updateCategory);
router.delete("/:id", authenticateUser, isAdmin, getResourceById(Category), deleteCategory);

module.exports = router