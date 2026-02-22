const express = require('express')

const router = express.Router()
const {
    createOrder,
    deleteOrder,
    getOrders,
    // updateOrder,
    getOrder,
} = require('../controllers/orders')

const {isOwner} = require('../middleware/authorization')
const Order = require('../models/Order')

router.route('/')
    .post(createOrder)
    .get(getOrders)

router.route('/:id')
    .get(isOwner(Order), getOrder)
    .delete(isOwner(Order), deleteOrder)
    // .patch(isOwner(Order), updateOrder)

module.exports = router