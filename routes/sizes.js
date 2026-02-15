const express = require('express')

const router = express.Router()
const {
    createSize,
    deleteSize,
    getSizes,
    updateSize,
    getSize,
} = require('../controllers/sizes')

const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')

//public 
router.get("/", getSizes);
router.get("/:id", getSize);

// admin
router.post("/", authenticateUser, isAdmin, createSize);
router.patch("/:id", authenticateUser, isAdmin, updateSize);
router.delete("/:id", authenticateUser, isAdmin, deleteSize);

module.exports = router