const express = require('express')
const router = express.Router()
const { ensureGuest, ensureAuth } = require('../middleware/auth')



// @ desc home login page
// GET /
router.get('/', ensureGuest, async (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})


//@ desc dashboard 
router.get('/dashboard', ensureAuth, async (req, res) => {
    res.render('dashboard')
})



module.exports = router
