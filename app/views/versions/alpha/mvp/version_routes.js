var qs = require('qs');
var url = require('url');
var utils = require('../../../../utils');

var defaultSession = {
  username: "",
  password: "",
  debt_amount: 350,
  payment_frequency: "fortnightly",
  debt_reason: ['is','pip'],
}

// calculate the payment amount based on debt amount
defaultSession.payment_amount = parseFloat(Math.floor(defaultSession.debt_amount/100*5)).toFixed(2);

module.exports = function(router, config) {
  
  router.all(config.routes.step, function(req,res, next){
    
    var requestedPage = req.params.step,
    postData = req.body || {};

    switch(requestedPage) {
      
      // kills the current session
      case 'kill_session': 
        req.session.destroy();
        return res.redirect('start_session');
      break;
      
      // redirects the correct payment choice screen
      case 'change_payment':         
        if(postData['change_choice'] == 'increase') {
          return res.redirect('increase_value');
        } else {
          return res.redirect('reduce_value');
        }
      break;
      
      // this will create (or override) a session from querystring parameters
      // see the qs documentation here:
      // https://github.com/ljharb/qs/blob/master/README.md
      case 'create_session':         
        Object.assign(req.session.data,qs.parse(url.parse(req.url).query));
        return res.redirect('home');
      break;
      
      // this creates a session with particular data (in the object at the top of this file)
      case 'start_session':
        Object.assign(req.session.data, defaultSession);
        return res.redirect('your-details');
      break; 
      
      // this routes hardship questions bases on savings entered. 
      case 'handle_savings':
        var route_medical = true;
        var totalsavings = parseFloat(Math.floor(postData.total_savings)).toFixed(2);
        if (!route_medical) {
          return res.redirect('hardship-medical');
        } else {
          if(totalsavings >= 500) {
            return res.redirect('hardship-medical');
          } else {
            return res.redirect('hardship-children');
          }  
        }
      break;
      
      // when user enters the amount they want/can pay, route accordingly
      case 'process_payment_change':
        
        // get the minimum amount based on the session as the minimum amount
        // is dependant on the user's payment interval (fortnightly, etc)
        var minimumPayment = utils.getMinimalAmount(req.session.data);
        
        // store the new amount the user has offered
        var newPaymentAmountRequested = req.session.data.payment_amount;
        
        // if less than minimum then redirect to page that deals with that    
        if (newPaymentAmountRequested < minimumPayment) {
          return res.redirect('what-this-means-below-minimum');
        } else {
          // redirect if greater than their original payment amount (stored in previous version of the session)
          if (req.session.data.payment_amount > req.session.dataPrev.payment_amount){
            return res.redirect('what-this-means');
          // else redirect if lower
          } else {
            return res.redirect('what-this-means-lower');
          }  
        }
      break;
       
    }
    
    next();
  
  });

  return router;
}
