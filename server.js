const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
// const { dbConnect } = require('./utils/db')
// const socket = require('socket.io')
const http = require('http')
const { dbConnect } = require('./utils/db')
const server = http.createServer(app)
require('dotenv').config()

const FRONTPORT = process.env.FRONT_PORT

// trying deployment
app.use(cors({
    origin : [`${FRONTPORT}`], // idk if this is good tho process.env.BASE_URL 
    methods : "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials : true
}))

app.use('/api', require('./routes/stripe/stripeHookRoutes')) // webhooks

app.use(cookieParser())
app.use(bodyParser.json()) //if we have an api that uses raw put it before this
app.use('/api', require('./routes/stripe/stripeRoutes')) // without webhooks
app.use('/api',require('./routes/wallet/walletStatusRoutes'))
app.use('/api',require('./routes/admin/adminRoutes'))
app.use('/api',require('./routes/transaction/transactionRoutes'))
app.use('/api', require('./routes/authRoutes'))

app.get('/',(req,res)=>res.send('My backend'))
const port = process.env.PORT 
console.log(port,FRONTPORT)
dbConnect()
server.listen(port, ()=> console.log(`server is running on PORT ${port}`))

