const mongoose = require("mongoose");
const dotenv = require("dotenv").config();
const colors = require("colors");
const app = require("./app");
const { connectDB } = require("./utils/dbConnect");
const ProductsRoute=require('./routes/api/v1/ProductsRoute')
// database connection
connectDB()




// server
const port = process.env.PORT || 8080;
app.use("/api/v1/product",ProductsRoute)

app.listen(port, () => {
  console.log(`App is running on port ${port}`.yellow.bold);
});