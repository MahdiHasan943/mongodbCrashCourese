const errorHandler = (error, req, res, next) => {
 res.send('error handler')   
}
module.exports = errorHandler;