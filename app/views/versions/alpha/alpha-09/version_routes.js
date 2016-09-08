var qs = require('qs');
var url = require('url');

module.exports = function(router, config) {
  
  router.all(config.routes.step, function(req,res, next){
    
    var requestedPage = req.params.step,
    postData = req.body || {};

    switch(requestedPage) {
      
      // kills the current session
      case 'kill_session': 
        req.session.destroy();
        return res.redirect('configure');
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
    }
    
    next();
  
  });

  return router;
}
