const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')
const Product = require('../models/Product')
const Batch = require('../models/Batch')
const Inventory = require('../models/Inventory')

//@ display waste log
// GET /waste
router.get('/', ensureAuth, async (req, res) => {
    try{
        const waste = await Inventory.find({isWaste: true, user: req.user.id}).lean()
        res.render('waste/log', {
            layout: 'plain',
            waste
        })
    }catch(err){
        console.error(err)
        res.redirect('error/404')
    }
})



module.exports = router