module.exports = function(router, config) {
  
  // routing for all pages directly below version/app/
  router.all(config.routes.step, function(req,res,next){

    var requestedPage = req.params.step,
        postData = req.body || {};
        
    // place version routing below this line:
    // console.log(requestedPage);

    switch(requestedPage) {


    // How often 
      case 'increase_value':
      	if(postData['increase'] == 'increase-v') {
          return res.redirect('increase_value');
        }
        else if (postData['increase'] == 'decrease-v') {
          return res.redirect('reduce_value');
        } 

        break;

    }
    
    next();
  
  });

  return router;
}
