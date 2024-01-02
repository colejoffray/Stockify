const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')
const Batch = require('../models/Batch')



// @ desc home login page
// GET /
router.get('/', ensureGuest, async (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})


//@ desc dashboard 
router.get('/dashboard', ensureAuth, async (req, res) => {
    try{
        id = req.user.id
        const batches = await Batch.find({user: id}).populate('user').lean()
        res.render('dashboard', {
            name: req.user.firstName,
            batches
        })

    }catch(err){
        console.error(err)
        res.render('error/404')
    }
    
})



module.exports = router
