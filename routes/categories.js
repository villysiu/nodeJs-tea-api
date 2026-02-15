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

//public 
router.get("/", getCategories);
router.get("/:id", getCategory);

// admin
router.post("/", authenticateUser, isAdmin, createCategory);
router.patch("/:id", authenticateUser, isAdmin, updateCategory);
router.delete("/:id", authenticateUser, isAdmin, deleteCategory);

module.exports = router