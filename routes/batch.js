const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')
const Product = require('../models/Product')
const Batch = require('../models/Batch')
const moment = require('moment');
const { rawListeners } = require('../models/User')
require('moment-timezone');

//@desc render add batch form
//GET /batch/add

router.get('/add', async (req, res) => {
    try{
        const products = await Product.find({ user: req.user.id}).lean()
        res.render('batch/add', {
            products,
            layout: 'plain'
        })
    }catch(err){

    }
}) 

//@ desc add a new batch to db
//POST /batch
router.post('/', ensureAuth, async(req, res) => {
    try{
        req.body.user = req.user.id
   
        const batchData = {
            product: req.body.product,
            user: req.body.user
        }

        if(req.body.datePacked){
            console.log(req.body.datePacked);
            batchData.datePacked =  new Date(req.body.datePacked);
        }
        if(req.body.quartsMade || req.body.pintsMade){
            if(req.body.quartsMade){
                batchData.quartsMade = req.body.quartsMade
            }else {
                batchData.quartsMade = 0
            }
            if(req.body.pintsMade){
                batchData.pintsMade = req.body.pintsMade
            }else {
                batchData.pintsMade = 0
            }
            batchData.quantity = batchData.pintsMade + batchData.quartsMade
            
        }else {
            batchData.quantity = req.body.quantity
        }

        await Batch.create(batchData)
        res.redirect('/dashboard')
    }catch(err) {
        console.error(err)
        res.render('error/404')
    }
})


//@ desc Delete a batch 
// DELETE /batch/:id

router.delete('/:id', ensureAuth, async (req, res) => {
    try{
        await Batch.findByIdAndDelete(req.params.id)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})

//@desc display update batch form 
// GET /batch/edit/id
router.get('/edit/:id', ensureAuth, async(req, res) => {
    try{
        const batch = await Batch.findById(req.params.id).lean()
        res.render('batch/edit', {
            batch
        })

    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})

//@ desc submit an updated batch 
// PUT /batch/edit/:id

router.put('/edit/:id', ensureAuth, async (req, res) => {
    try{
        const batchId = req.params.id
        const updatedBatchData = req.body
         // Convert the incoming date to UTC
         updatedBatchData.datePacked = moment.utc(updatedBatchData.datePacked).toDate();

        if(updatedBatchData.pintsMade || updatedBatchData.quartsMade){
            updatedBatchData.quantity = +updatedBatchData.pintsMade + +updatedBatchData.quartsMade
        }
        console.log(updatedBatchData);
        await Batch.findByIdAndUpdate(batchId, updatedBatchData)
        res.redirect('/dashboard')
    }catch(err){
        console.error(err)
        res.render('error/404')
    }
})

module.exports = router