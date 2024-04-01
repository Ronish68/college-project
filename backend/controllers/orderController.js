const Order = require("../models/orderModels")
const Product = require("../models/productModels"); // Import the Product model
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");

exports.newOrder = catchAsyncErrors(async (req, res, next) => {
    const {
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;
  
    const order = await Order.create({
      shippingInfo,
      orderItems,
      paymentInfo,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      paidAt: Date.now(),
      user: req.user._id,
    });
  
    res.status(201).json({
      success: true,
      order,
    });
  });

  //get single order
  exports.getSingleOrder = catchAsyncErrors(async (req, res, next) => {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );
  
    if (!order) {
      return next(new ErrorHandler("Order not found with this Id", 404));
    }
  
    res.status(200).json({
      success: true,
      order,
    });
  });
   //get logged in users order
   exports.myOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders =  await Order.find({user: req.user._id})

    res.status(200).json({
        success:true,
        orders,
    })
  })

//get all order(admin)
exports.getAllOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders =  await Order.find();

    let totalAmount = 0;
    orders.forEach((order)=>{
        totalAmount += order.totalPrice;
    });
    
    res.status(200).json({
        success:true,
        totalAmount,
        orders,
    });
});

//update order status admin
exports.updateOrder = catchAsyncErrors(async(req,res,next)=>{
    const order =  await Order.findById(req.params.id);

    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("You have already delievered this order",400));
    }

    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product,o.quantity)
    });

    order.orderStatus = req.body.status;

    await order.save({validateBeforeSave: false});

    if(req.body.status==="Delivered"){
        order.deliveredAt = Date.now()
    } 
    res.status(200).json({
        success:true,
    });
});

async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.Stock -= quantity;
    
    await product.save({validateBeforeSave:false});
}

//delete order(admin)

exports.deleteOrder = catchAsyncErrors(async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return next(new ErrorHandler("Order not found", 404))
        }
        await Order.deleteOne({ _id: req.params.id });
        res.status(200).json({
            success: true,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete order' });
    }
});