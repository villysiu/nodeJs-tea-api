const express = require('express')

const router = express.Router()
const {
    createMilk,
    deleteMilk,
    getMilks,
    updateMilk,
    getMilk,
} = require('../controllers/milks')

const authenticateUser = require('../middleware/authentication');
const {isAdmin} = require('../middleware/authorization')

//public 
router.get("/", getMilks);
router.get("/:id", getMilk);

// admin
router.post("/", authenticateUser, isAdmin, createMilk);
router.patch("/:id", authenticateUser, isAdmin, updateMilk);
router.delete("/:id", authenticateUser, isAdmin, deleteMilk);


module.exports = router