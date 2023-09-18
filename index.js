const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const jwt = require('jsonwebtoken');
const dbConnect = require("./utils/dbConnect");

const serviceRoute = require('./routes/v1/service.route');
const viewCount = require('./middleware/viewCoount');
const errorHandler = require('./middleware/errorHandler');
const {connectToServer, lalo}=require('./utils/dbConnect')
// email
//bookstore@gmail.com
// BBkk22@@
// middleware
app.use(cors());
app.use(express.json());

connectToServer((error) => {
    if (!error) {
        app.listen(port, () => {
            console.log(`bookstore running on port ${port}`)
        })
        
    }
    else {
        console.log(error);
    }
})

 app.use('/api/v1/service',serviceRoute)
function verifyJWT(req, res, next){
    const authHeader = req.headers.authorization;

    if(!authHeader){
        return res.status(401).send({message: 'unauthorized access'});
    }
    const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function(err, decoded){
        if(err){
            return res.status(403).send({message: 'Forbidden access'});
        }
        req.decoded = decoded;
        next();
    })
}
app.get('/', (req, res) => {
   
    res.send('bookstore start')
});
app.all("*", (req,res) => {
    res.send('no route found')
})
app.use(errorHandler)

process.on("unhandledRejection", (error) => {
    console.log(error.name, error.message);
    app.close(() => {
      process.exit(1);
    });
  });