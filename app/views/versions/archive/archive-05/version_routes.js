module.exports = function(router, config) {
  
  // routing for all pages directly below version/app/
  router.all(config.routes.step, function(req,res,next){

    var requestedPage = req.params.step,
        postData = req.body || {};
        
    // place version routing below this line:
    // console.log(requestedPage);

    switch(requestedPage) {


    // How often 
      case 'pay_weekly':
      	if(postData['benefits'] == 'weekly') {
          return res.redirect('pay_weekly');
        }
        else if (postData['benefits'] == 'fortnightly') {
          return res.redirect('pay_fortnightly');
        } 
        else if (postData['benefits'] == 'four-weekly') {
          return res.redirect('pay_four-weekly');
        } 
        else if (postData['benefits'] == 'monthly') {
          return res.redirect('pay_monthly');
        }

        break;

    }
    
    next();
  
  });

  return router;
}
