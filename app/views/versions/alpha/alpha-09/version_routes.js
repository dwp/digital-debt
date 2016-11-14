module.exports = function(router, config) {
  
  // routing for all pages directly below version/app/
  router.all(config.routes.step, function(req,res,next){

    var requestedPage = req.params.step,    // this is the page requested or posted-to
        postData = req.body || {};          // this is any data in the request
    
    if(requestedPage == 'process-payment-change') {
      if (postData.total > 34){
        return res.redirect('what-this-means');
      } else {
        return res.redirect('what-this-means-lower');
      }  
    }
    
    next();
  
  });

  return router;
}
