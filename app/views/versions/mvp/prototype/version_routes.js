var qs = require('qs');
var url = require('url');
var utils = require('../../../../utils');

var defaultSession = {
  username: "",
  password: "",
  allowance: 146.20,
  debt_amount: 350,
  payment_frequency: "fortnightly",
  debt_reason: ['is','pip'],
}

// calculate the payment amount based on debt amount
defaultSession.payment_amount_original = parseFloat(defaultSession.allowance/100*15).toFixed(2);
defaultSession.payment_amount = parseFloat(defaultSession.allowance/100*15).toFixed(2);
defaultSession.minimum_amount = parseFloat(defaultSession.allowance/100*5).toFixed(2);

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
        var minimumPayment = parseFloat(defaultSession.minimum_amount);
        
        // store the new amount the user has offered
        var newPaymentAmountRequested = parseFloat(req.session.data.payment_amount);
        
        // quick fix to handle posting with no amount entered
        if(postData.payment_amount == '') {
          Object.assign(req.session.data, { payment_amount: parseFloat(req.session.data.payment_amount_original).toFixed(2) });
        }
        
        // if less than minimum then redirect to page that deals with that    
        if (newPaymentAmountRequested < minimumPayment) {
          return res.redirect('what-this-means-below-minimum');
        } else {
          // redirect if greater than their original payment amount (stored in previous version of the session)
          if (parseFloat(req.session.data.payment_amount).toFixed(2) >= parseFloat(req.session.data.payment_amount_original).toFixed(2)){
            return res.redirect('what-this-means');
          // else redirect if lower
          } else {
            return res.redirect('what-this-means-lower');
          }  
        }
        
      break;
      
      case 'process_minimum_payment_choice':
        
        // get the minimum amount based on the session as the minimum amount
        // is dependant on the user's payment interval (fortnightly, etc)
        var minimumPayment = parseFloat(defaultSession.minimum_amount).toFixed(2);
        
        // store the new amount the user has offered
        var newPaymentAmountRequested = parseFloat(req.session.data.payment_amount).toFixed(2);
        
        // if less than minimum then redirect to page that deals with that    
        if (parseFloat(newPaymentAmountRequested).toFixed(2) < parseFloat(minimumPayment).toFixed(2)) {
          return res.redirect('requested-below-minimum');
        } else {
          return res.redirect('what-this-means-lower');
        }
        
      break;
       
    }
    
    next();
  
  });

  return router;
}
