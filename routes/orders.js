const express = require('express')

const router = express.Router()
const {
    createOrder,
    deleteOrder,
    getAllOrders,
    updateOrder,
    getOrder,
} = require('../controllers/orders')

router.route('/').post(createOrder).get(getAllOrders)

router.route('/:id').get(getOrder).delete(deleteOrder).patch(updateOrder)

module.exports = router