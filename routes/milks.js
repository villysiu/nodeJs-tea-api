const express = require('express')

const router = express.Router()
const {
    createMilk,
    deleteMilk,
    getMilks,
    updateMilk,
    getMilk,
} = require('../controllers/milks')

const Milk = require('../models/Milk')
const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')
const getResourceById = require('../middleware/validateRequest') 

//public 
router.get("/", getMilks);
router.get("/:id", getResourceById(Milk), getMilk);

// admin
router.post("/", authenticateUser, isAdmin, createMilk);
router.patch("/:id", authenticateUser, isAdmin, getResourceById(Milk), updateMilk);
router.delete("/:id", authenticateUser, isAdmin, getResourceById(Milk), deleteMilk);


module.exports = router