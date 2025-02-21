import Product from "../models/Productmodel.js";
import User from "../models/Usermodel.js";

// Function to Create Product
export const CreateProduct = async (req, res) => {
  try {
    req.body.owner = req.user.id;
    req.body.createdBy = req.user.id;

    if (!req.body.url) {
      req.body.url =
        req.body.name
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]/g, "-")
          .replace(/-+/g, "-") +
        "-" +
        Date.now();
    }
    const product = await Product.create(req.body);
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to Get a Product
export const GetProduct = async (req, res) => {
  try {
    let query;

    // Create a copy of the Query object
    const reqQuery = { ...req.query };

    // Fields to Exclude
    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);

    // Creating a Query String
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );

    if (req.query.select) {
      const fields = req.query.select.split(" ").join("");
      query = query.select(fields);
    }

    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Product.countDocuments();

    query = query.skip(startIndex).limit(limit);
    const products = await query;

    const pagination = {};
    if (endIndex < total) {
      pagination.next = { page: page + 1, limit };
    }
    if (startIndex > 0) {
      pagination.prev = { page: page - 1, limit };
    }

    res.status(200).json({
      success: true,
      count: products.length,
      pagination,
      data: products,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to Get Vendor Products
export const getVendorProducts = async (req, res) => {
   try {
     // If user is vendor, they can only see their own products
     if (req.user.role === "vendor" && req.user.id !== req.params.vendorId) {
       return res.status(403).json({
         success: false,
         message: "Not authorized to access other vendor products",
       });
     }

     // If user is staff, they can only see products from assigned vendors
     if (req.user.role === "staff") {
       const staff = await User.findById(req.user.id);
       if (!staff.assignedVendors.includes(req.params.vendorId)) {
         return res.status(403).json({
           success: false,
           message: "Not assigned to this vendor",
         });
       }
     }

     const products = await Product.find({ owner: req.params.vendorId });

     res.status(200).json({
       success: true,
       count: products.length,
       data: products,
     });
   } catch (error) {
     res.status(400).json({
       success: false,
       message: error.message,
     });
   }
};

// Function to Update a Product
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Make sure user is product owner or admin
    if (product.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to update this product",
      });
    }

    // Handle price updates - store old price
    if (req.body.price && req.body.price !== product.price) {
      req.body.oldPrice = product.price;
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

// Function to Delete a Product
export const DeleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Make sure user is product owner or admin
    if (product.owner.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Not authorized to delete this product",
      });
    }

    await product.deleteOne(); // Correct method instead of .remove()

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
