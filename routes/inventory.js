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





module.exports = router