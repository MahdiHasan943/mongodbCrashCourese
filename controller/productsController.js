const Product = require("../models/products");

module.exports.saveAllProducts = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const result = await product.save();

    res.status(200).json({
      status: "success",
      data: result,
      message: "data insert successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data can't insert",
      error: error.message,
    });
  }
};

module.exports.getAllProduct = async (req, res, next) => {
  try {
    const filters = { ...req.query };
    const excludeField = ["page", "limit", "sort"];
    excludeField.forEach((field) => delete filters[field]);
    const queries = {};
    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      queries.sortBy = sortBy;
    }
    if (req.query.fields) {
      const fields = req.query.fields.split(",").join(" ");
      queries.fields = fields;
      console.log(fields);
    }
    if (req.query.page) {
      const { page = 1, limit = 10 } = req.query; // "3" "10"
      //50 products
      // each page 10 product
      //page 1--> 1-10
      //page 2--> 2-20
      //page 3--> 21-30     --> page 3  -> skip 1-20  -> 3-1 ->2 *10
      //page 4--> 31-40      ---> page 4 --> 1-30  --> 4-1  -->3*10
      //page 5--> 41-50

      const skip = (page - 1) * parseInt(limit);
      queries.skip = skip;
      queries.limit = parseInt(limit);
    }
    const totalProductCount = await Product.countDocuments(filters);
    const page = Math.ceil(totalProductCount/queries.limit)


    const product = await Product.find(filters)
      .skip(queries.skip)
      .limit(queries.limit)
      .select(queries.fields)
      .sort(queries.sortBy);

    res.status(200).json({
      status: "success",
      data: {
        totalProductCount,
        page,
        product,
      },
      message: "data insert successfully",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "data can't get",
      error: error.message,
    });
  }
};

module.exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params; // Assuming the ID is passed as a route parameter

    const product = await Product.findById(id);

    if (!product) {
      // If the product is not found, return a 404 status code
      return res.status(404).json({
        status: "fail",
        message: "Product not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Error fetching product",
      error: error.message,
    });
  }
};

module.exports.updateAProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Product.updateOne(
      { _id: id },
      { $set: req.body },
      { runValidators: true }
    );
    res.status(200).json({
      status: "successfully updated",
      data: result,
      message: "update done",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't update",
      error: error.message,
    });
  }
};
module.exports.deleteProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await Product.findByIdAndDelete(id);
    res.status(200).json({
      data: result,
      status: "delete success",
    });
  } catch (error) {
    res.status(400).json({
      err: error.message,
      status: "fail can't delete",
    });
  }
};
module.exports.updateMany = async (req, res, next) => {
  try {
    const { data } = req.body;

    // Create an array of update promises
    const updatePromises = data.ids.map(async (product) => {
      const updateResult = await Product.updateOne(
        { _id: product.id },
        product.data
      );
      return updateResult;
    });

    // Execute all update promises
    const result = await Promise.all(updatePromises);
    console.log(result);

    res.status(200).json({
      status: "success",
      data: result,
      message: "Successfully updated the products",
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "Couldn't bulk update",
      error: error.message,
    });
  }
};
module.exports.deleteMany = async (req, res, next) => {
  try {
    const { data } = req.body;
    const ids = data.ids;
    // Check if ids is an array and is not empty
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({
        status: "fail",
        message: "Invalid or empty 'ids' array provided.",
      });
    }
    const query = { _id: { $in: ids } };
    const result = await Product.deleteMany(query);

    if (result.deletedCount > 0) {
      res.status(200).json({
        status: "delete success",
        data: result,
      });
    } else {
      res.status(404).json({
        status: "fail",
        message: "No matching documents found to delete.",
      });
    }
  } catch (error) {
    console.error("Error deleting documents:", error);
    res.status(500).json({
      error: error.message,
      status: "fail can't delete",
    });
  }
};
