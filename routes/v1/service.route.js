const express = require('express');
const serviceController=require('../../controller/serviceController');
const viewCount = require('../../middleware/viewCoount');
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
    .get(serviceController.getAllService)
   
  .post(serviceController.saveAService)
  router.route("/tests").post(serviceController.test).get(serviceController.testGet);

  router
  .route("/:id")
  .get(serviceController.getToolDetail)
  .patch(serviceController.updateTool)
  .delete(serviceController.deleteTool);

module.exports = router;