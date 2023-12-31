const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')



// @ desc home login page
// GET /
router.get('/', ensureAuth, async (req,res) => {
    res.render('products/show', {
        layout: 'products'
    })
})


//@ desc dashboard 
router.get('/add', ensureAuth, async (req, res) => {
    res.render('products/add')
})



module.exports = router