const Product = require("../models/productModels"); // Import the Product model
const ErrorHandler = require("../utils/errorhandler");
const catchAsyncErrors = require("../middleware/catchAsyncError");
const ApiFeatures = require("../utils/apifeatures");

// Create Product admin
exports.createProduct = catchAsyncErrors(async (req, res, next) => {
    req.body.user = req.user.id;
        const product = await Product.create(req.body);
        res.status(201).json({
            success: true,
            product,
        });
    
    
});

//get all products

exports.getAllProducts = catchAsyncErrors(async(req, res) => {

    const resultPerPage = 8;
    const productsCount = await Product.countDocuments();

    const apiFeature = new ApiFeatures(Product.find(),req.query)
    .search()
    .filter().pagination(resultPerPage);
    const products =  await apiFeature.query;
    res.status(200).json({ 
        success: true,
        products,
        productsCount,
     })
});
//get single product details
exports.getProductDetails = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.params.id);

    if (!product) {
        return next(new ErrorHandler("product not found", 404))
    }
    res.status(200).json({
        success: true,
        product
    });
});

//update product admin

exports.updateProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // Return the updated product
            runValidators: true, // Run Mongoose validators on update
        });
        if (!updatedProduct) {
            return next(new ErrorHandler("product not found", 404))
        }
        res.status(200).json({
            success: true,
            product: updatedProduct,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

//DEETE product

exports.deleteProduct = catchAsyncErrors(async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return next(new ErrorHandler("product not found", 404))
        }
        await Product.deleteOne({ _id: req.params.id }); // Use deleteOne to delete the product
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

//create new review or update the review
exports.createProductReview = catchAsyncErrors(async (req, res, next) => {
    const { rating, comment, productId } = req.body;
  
    const review = {
      user: req.user._id,
      name: req.user.name,
      rating: Number(rating),
      comment,
    };
  
    const product = await Product.findById(productId);
  
    const isReviewed = product.reviews.find(
      (rev) => rev.user.toString() === req.user._id.toString()
    );
  
    if (isReviewed) {
      product.reviews.forEach((rev) => {
        if (rev.user.toString() === req.user._id.toString())
          (rev.rating = rating), (rev.comment = comment);
      });
    } else {
      product.reviews.push(review);
      product.numOfReviews = product.reviews.length;
    }
  
    let avg = 0;
  
    product.reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    product.ratings = avg / product.reviews.length;
  
    await product.save({ validateBeforeSave: false });
  
    res.status(200).json({
      success: true,
    });
  });

  //get all reviews of a product
  exports.getProductReviews = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.id);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    res.status(200).json({
        success: true,
        reviews: product.reviews,
    });
  });

  //delete review
  exports.deleteReview = catchAsyncErrors(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId);

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }

    const reviews = product.reviews.filter((rev) => rev._id.toString() !== req.query.id.toString())
    let avg = 0;
  
    reviews.forEach((rev) => {
      avg += rev.rating;
    });
  
    const ratings = avg / reviews.length;

    const  numOfReviews = reviews.length;

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews, ratings, numOfReviews,
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false,
    })

    res.status(200).json({
        success: true,
    });
  })
