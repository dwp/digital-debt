module.exports = function(router, config) {
  
  router.all(config.routes.step, function(req,res,next){
    
    var requestedPage = req.params.step,
    postData = req.body || {};

    switch(requestedPage) {

    // How often 
      case 'kill_session': 
        console.log("Killing session");
        req.session.destroy();
      break;
    }
    
    next();
  
  });

  return router;
}
