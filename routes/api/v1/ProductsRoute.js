const express = require('express');
const ProductController=require('../../../controller/productsController')
const router = express.Router();


router
    .route('/')
    /**
  * @api {get} /service All service
  * @apiDescription Get all the service
  * @apiPermission admin
  *
  * @apiHeader {String} Authorization   User's access token
  *
  * @apiParam  {Number{1-}}         [page=1]     List page
  * @apiParam  {Number{1-100}}      [limit=10]  Users per page
  *
  * @apiSuccess {Object[]} all the service.
  *
  * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users can access the data
  * @apiError (Forbidden 403)     Forbidden     Only admins can access the data
  */
    .get(ProductController.getAllProduct)
   
  .post(ProductController.saveAllProducts)
//   router.route("/tests").post(serviceController.test).get(serviceController.testGet);
router.route("/bulk-update").patch(ProductController.updateMany)
router.route("/bulk-delete").delete(ProductController.deleteMany)


  router
  .route("/:id")
  .patch(ProductController.updateAProduct)
  .get(ProductController.getProductById)
  .delete(ProductController.deleteProductById)

    // .get(serviceController.getToolDetail)
// .delete(serviceController.deleteTool);

module.exports = router;