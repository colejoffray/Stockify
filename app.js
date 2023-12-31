//Modules 
const express = require('express')
const dotenv = require('dotenv')
const app = express()
const passport = require('passport')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const morgan = require('morgan')
const connectDB = require('./config/db')

//Load config file
dotenv.config({ path: './config/.env'})

//passport config 
require('./config/passport')(passport)


connectDB()

//body parser //!this will let use use req.body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

//session middleware
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))

//passport middleware
app.use(passport.initialize())
app.use(passport.session())

//Handlebars
//!this line of code allows us to not have to worry about using extension names in our router functions
app.engine('.hbs', exphbs.engine(
    {    
    defaultLayout: 'main', 
    extname: '.hbs'
}))
app.set('view engine', '.hbs')


//sessions middleware 
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    })
}))


//STATIC FOLDER
app.use(express.static(path.join(__dirname, 'public')))


//ROUTES
app.use('/', (require('./routes/index')))
app.use('/auth', require('./routes/auth'))
app.use('/products', require('./routes/products'))

const PORT = process.env.PORT || 5000


app.listen(PORT, () => {
    console.log(`App running on PORT: ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
})



