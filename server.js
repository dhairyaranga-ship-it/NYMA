const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");

const app = express();
app.use(express.json());
app.use(express.static(".")); // serve frontend

// MongoDB
mongoose.connect(process.env.MONGO_URL)
.then(()=>console.log("DB Connected"))
.catch(err=>console.log(err));

// Models
const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String
});
const Order = mongoose.model("Order", {
  items: Array,
  amount: Number,
  paymentId: String,
  createdAt: { type: Date, default: Date.now }
});

// Razorpay
const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET
});

// Routes
app.get("/products", async (req,res)=>{
  const products = await Product.find();
  res.json(products);
});

app.post("/add-product", async (req,res)=>{
  await Product.create(req.body);
  res.json({status:"added"});
});

app.post("/create-order", async (req,res)=>{
  const order = await razorpay.orders.create({
    amount: req.body.amount * 100,
    currency: "INR"
  });
  res.json(order);
});

app.post("/verify", async (req,res)=>{
  await Order.create(req.body);
  res.json({status:"success"});
});

// IMPORTANT FOR RENDER
const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=>console.log("Server running 🚀"));
