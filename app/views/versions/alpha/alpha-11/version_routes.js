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
    
    if(requestedPage == 'start_session') {
      var debt_amount = 350;
      Object.assign(req.session.data,{
        username: "",
        password: "",
        debt_amount: debt_amount,
        payment_amount: parseFloat(Math.floor(debt_amount/100*5)).toFixed(2),
        payment_frequency: "fortnightly",
        debt_reason: ['is','pip']
      });
      return res.redirect('index');  
    }

    next();
  
  });

  return router;
}
