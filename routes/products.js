const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')
const Product = require('../models/Product')



// @ desc home login page
// GET /
router.get('/', ensureAuth, async (req,res) => {
    try{
        req.body.user = req.user.id
        const products = await Product.find({ user: req.user.id }).sort({productName: 1}).lean()
        res.render('products/show', {
            products,
            layout: 'products'
        })

    }catch(err){
        console.error(err)
        res.redirect('dashboard')
    }
   
   
})


router.post('/', ensureAuth, async (req, res) => {
    try{
        req.body.isLiquid = "true" ? true : false;
        req.body.user = req.user.id
        await Product.create(req.body)
        res.redirect('/products')

    }catch(err){
        console.error(err)
        res.redirect('dashboard')
    }
})


//@ desc dashboard 
router.get('/add', ensureAuth, async (req, res) => {
    res.render('products/add')
})



module.exports = router