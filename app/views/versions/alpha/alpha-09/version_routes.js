module.exports = function(router, config) {
  
  router.all(config.routes.step, function(req,res, next){
    
    var requestedPage = req.params.step,
    postData = req.body || {};

    switch(requestedPage) {
      
      // kills the current session
      case 'kill_session': 
        req.session.destroy();
        return res.redirect('start');
      break;
      // redirects the correct payment choice screen
      case 'change_payment':         
        if(postData['change_choice'] == 'increase') {
          return res.redirect('increase_value');
        } else {
          return res.redirect('reduce_value');
        }
      break;      
    }
    
    next();
  
  });

  return router;
}
