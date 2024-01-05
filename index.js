//Modules 
const express = require('express')
const dotenv = require('dotenv')
const app = express()
const passport = require('passport')
const exphbs = require('express-handlebars')
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const methodOverride = require('method-override')
const morgan = require('morgan')
const connectDB = require('./config/db')

//Load config file
dotenv.config({ path: './config/.env'})

//passport config 
require('./config/passport')(passport)

//body parser //!this will let use use req.body
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

//METHOD OVERRIDE 
app.use(
    methodOverride(function(req,res) {
        if(req.body && typeof req.body === 'object' && '_method' in req.body){
            let method = req.body._method
            delete req.body._method
            return method
        }
    })
)

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

//Handlebar Helpers
const {if_eq, formatDate, hasQuartsOrPints } = require('./helpers/hbs')

//Handlebars
//!this line of code allows us to not have to worry about using extension names in our router functions
app.engine('.hbs', exphbs.engine(
    {   
    helpers: {
        if_eq,
        formatDate,
        hasQuartsOrPints,
    } ,
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
app.use('/batch', require('./routes/batch'))
app.use('/inventory', require('./routes/inventory'))
app.use('/api/inventory', require('./routes/inventory'))
app.use('/waste', require('./routes/waste'))


const PORT = process.env.PORT || 5000

connectDB().then(() => {
    app.listen( PORT, () => {
        console.log(`App running on PORT: ${PORT} in ${process.env.NODE_ENV} mode`);
    })
})




