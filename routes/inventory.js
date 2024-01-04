const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')
const Product = require('../models/Product')
const Batch = require('../models/Batch')
const Inventory = require('../models/Inventory')

//@desc add inventory
//POST /inventory/add/:id

router.post('/add/:id', ensureAuth, async(req, res) => {
    try{
        const newInv = await Batch.findOne({_id: req.params.id})
        const newData = {
            product: newInv.product,
            quantity: newInv.quantity,
            user: newInv.user,
        }
        if(newInv.quartsMade) newData.quartsMade = newInv.quartsMade
        if(newInv.pintsMade) newData.pintsMade = newInv.pintsMade

        await Inventory.create(newData)

        await Batch.findByIdAndDelete(req.params.id)

        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})

//@ desc add a relabeled date
//GET /inventory/edit/:id

router.get('/:id', ensureAuth, async (req, res) => {
    try{
        const id = req.params.id
        const inventory = await Inventory.findById(id)
        const route = inventory._id
        res.render('inventory/relabeled', {
            layout: 'plain',
            inventory, 
            route
        })
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})


//@ desc update relabeled date 
//PUT /inventory/:id

router.put('/:id', ensureAuth, async (req,res) => {
    try{
        const date = new Date(req.body.relabeled)
        await Inventory.findByIdAndUpdate(req.params.id, {
            relabeled: date
        })
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})


//@ desc get the product name for whatever is being added to waste 
// GET api/inventory/name/:id

router.get('/name/:id', ensureAuth, async (req, res) => {
    try{
        const inv = await Inventory.findById(req.params.id).lean()
        console.log(inv);
        res.json(inv)
    }catch(err){
        console.error(err)
        res.status(404).json({message: 'Not successful'})
    }
})

//@ desc Updating a product to be waste and setting the itemsSold and itemsLost
// PUT api/inventory/name/:id

router.put('/name/:id', ensureAuth, async (req, res) => {
    try{
        const newData = req.body;

        const product = await Product.findOne({ productName: newData.wasteName });
        const ref = await Inventory.findOne({ _id: req.params.id})

        console.log(product);

        let updateData;

        if (newData.quartsLost || newData.pintsLost) {
            // Calculate pintsSold and quartsSold
            const pintsSold = ref.pintsMade - Number(newData.pintsLost);
            const quartsSold = ref.quartsMade - Number(newData.quartsLost);
            const loss = (Number(newData.quartsLost) * product.pricePerQuart) + (Number(newData.pintsLost) * product.pricePerPint)
            const gain = (Number(newData.quartsSold) * product.pricePerQuart) + (Number(newData.pintsSold) * product.pricePerPint)
            const profit = gain - loss

            updateData = {
                $set: {
                    isWaste: true,
                    pintsLost: Number(newData.pintsLost),
                    quartsLost: Number(newData.quartsLost),
                    price: product.price,
                    pintsSold: pintsSold,
                    quartsSold: quartsSold,
                    wasteDate: new Date(),
                    loss: loss,
                    gain: gain,
                    profit: profit,
                },
            };
        } else {
            // Calculate itemsSold
            const itemsSold = ref.quantity - Number(newData.quantity);
            const loss = newData.quantity * product.price
            const gain = itemsSold * product.price
            const profit = gain - loss 

            updateData = {
                $set: {
                    isWaste: true,
                    itemsLost: Number(newData.quantity),
                    price: product.price,
                    itemsSold: itemsSold,
                    wasteDate: new Date(),
                    loss: loss,
                    gain: gain,
                    profit: profit
                },
            };
        }

        await Inventory.findByIdAndUpdate(req.params.id, updateData);

        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})






module.exports = router