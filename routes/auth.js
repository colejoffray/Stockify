const express = require('express')
const router = express.Router()
const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy



// @ desc home login page
// GET /
router.get('/', async (req,res) => {
    res.render('login', {
        layout: 'login'
    })
})

router.get('/logout', (req, res) => {
    req.logout(function(err){
        if(err) return (next(err))
        res.redirect('/')
    })
})


// @ desc google authenticate and login 
// GET /google
router.get('/google', passport.authenticate('google', { scope: ['profile'] }))


//@ desc google callback route after login is complete 
// GET /google/callback
router.get('/google/callback',  passport.authenticate('google', { failureRedirect: '/' }), async (req,res) => {
    try{
        res.render('dashboard')
    }catch(err){
        console.error(err)
    }
})



module.exports = router