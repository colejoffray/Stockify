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

//@ desc add a new product
// POST /products
router.post('/', ensureAuth, async (req, res) => {
    try{
        req.body.isLiquid = req.body.isLiquid === 'true'
        req.body.user = req.user.id

        const productData = {
            productName: req.body.productName,
            isLiquid: req.body.isLiquid,
            user: req.user.id,
        }

        if(req.body.isLiquid){
            //Liquid Product
            productData.pricePerQuart = req.body.pricePerQuart;
            productData.pricePerPint = req.body.pricePerPint;
            productData.pluNumberPerQuart = req.body.pluNumberPerQuart;
            productData.pluNumberPerPint = req.body.pluNumberPerPint;
        }else {
            //non liquid product
            productData.price = req.body.price;
            productData.pluNumber = req.body.plu
        }
        await Product.create(productData)
        res.redirect('/products')

    }catch(err){
        console.error(err)
        res.redirect('dashboard')
    }
})


//@ desc add product form
// get /products/add 
router.get('/add', ensureAuth, async (req, res) => {
    res.render('products/add')
})

//@ desc edit a product form  
// GET /products/edit/:id
router.get('/edit/:id', ensureAuth, async (req, res) => {
    try{
        const product = await Product.findOne({ _id: req.params.id}).lean()
        res.render('products/edit', {
            layout: 'plain',
            product,
        })
    }catch(err){
        console.error(err)
        res.redirect('/products')
    }
}) 

//@desc Post request to edit a product
//PUT /products/:id
router.put('/:id', ensureAuth, async (req, res) => {
    try{
        await Product.findByIdAndUpdate(req.params.id, req.body)
        res.redirect('/products')
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})

//@desc Delete a product 
//DELETE /products/:id
router.delete('/:id', ensureAuth, async(req, res) => {
    try{
        await Product.findByIdAndDelete(req.params.id)
        res.redirect('/products')
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})



module.exports = router