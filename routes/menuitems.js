const express = require('express');
const router = express.Router();
const {
    createMenuitem,
    updateMenuitem,
    getMenuitems,
    getMenuitem,
    deleteMenuitem
} = require('../controllers/menuitems')

const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')

console.log('createMenuitem:', createMenuitem)
console.log('typeof createMenuitem:', typeof createMenuitem)

//public 
router.get("/", getMenuitems);
router.get("/:id", getMenuitem);

// admin
router.post("/", authenticateUser, isAdmin, createMenuitem);
router.patch("/:id", authenticateUser, isAdmin, updateMenuitem);
router.delete("/:id", authenticateUser, isAdmin, deleteMenuitem);

module.exports = router